<script setup>
import { computed } from "vue";
import { X, Users } from "lucide-vue-next";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  team: {
    type: Object,
    default: null,
  },
  apiPayload: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["close"]);

const toComparableId = (value) => {
  if (value === null || value === undefined || value === "") return null;
  return String(value);
};

const getTeamId = (team) =>
  toComparableId(
    team?.team_id ?? team?.teamid ?? team?.id ?? team?.id_team ?? null,
  );

const getUsersFromViewRows = (team, apiPayload) => {
  if (!team || typeof team !== "object") return [];

  const currentTeamId = getTeamId(team);
  const rowCandidates = [
    apiPayload?.teams,
    apiPayload?.data?.teams,
    apiPayload?.rows,
    apiPayload?.data,
  ];

  for (const candidate of rowCandidates) {
    if (!Array.isArray(candidate)) continue;

    const users = candidate
      .filter((row) => row && typeof row === "object")
      .filter((row) => {
        const rowTeamId = toComparableId(
          row.team_id ?? row.teamid ?? row.id_team,
        );
        if (!currentTeamId || !rowTeamId) return false;
        return rowTeamId === currentTeamId;
      })
      .map((row, index) => {
        const userId = toComparableId(
          row.user_id ?? row.userid ?? row.id_user ?? row.id,
        );
        if (!userId) return null;

        const fullName = [row.firstname, row.lastname]
          .filter((part) => typeof part === "string" && part.trim())
          .join(" ")
          .trim();

        const name =
          row.name ||
          row.full_name ||
          row.username ||
          fullName ||
          row.email ||
          `User ID ${userId}`;

        return {
          id: userId,
          name,
          email: row.email || "",
          _order: index,
        };
      })
      .filter(Boolean);

    if (!users.length) continue;

    // Deduplicate by user id while keeping the first-seen order.
    const uniqueUsers = [];
    const seenIds = new Set();
    for (const user of users) {
      if (seenIds.has(user.id)) continue;
      seenIds.add(user.id);
      uniqueUsers.push(user);
    }

    return uniqueUsers;
  }

  return [];
};

const parseUserIds = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => toComparableId(item?.user_id ?? item?.id ?? item))
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => toComparableId(item.trim()))
      .filter(Boolean);
  }

  return [];
};

const getLinkedUserIds = (team, apiPayload) => {
  if (!team || typeof team !== "object") return new Set();

  const currentTeamId = getTeamId(team);
  const relationCandidates = [
    team.user_team,
    team.team_users,
    team.team_user,
    apiPayload?.user_team,
    apiPayload?.team_users,
    apiPayload?.team_user,
    apiPayload?.relations,
  ];
  const userIds = new Set();

  for (const candidate of relationCandidates) {
    if (!Array.isArray(candidate)) continue;

    for (const row of candidate) {
      if (!row || typeof row !== "object") continue;

      const relationTeamId = toComparableId(
        row.team_id ?? row.teamid ?? row.teamId ?? row.id_team,
      );
      const relationUserId = toComparableId(
        row.user_id ?? row.userid ?? row.userId ?? row.id_user ?? row.id,
      );

      if (!relationUserId) continue;

      if (currentTeamId && relationTeamId && relationTeamId !== currentTeamId) {
        continue;
      }

      userIds.add(relationUserId);
    }
  }

  const inlineUserIdCandidates = [
    team.user_ids,
    team.users_id,
    team.member_ids,
    team.members_id,
    team.user_id,
    team.member_id,
  ];

  for (const candidate of inlineUserIdCandidates) {
    for (const userId of parseUserIds(candidate)) {
      userIds.add(userId);
    }
  }

  return userIds;
};

const getNormalizedUsers = (team, apiPayload) => {
  if (!team || typeof team !== "object") return [];

  const usersFromViewRows = getUsersFromViewRows(team, apiPayload);
  if (usersFromViewRows.length) return usersFromViewRows;

  const linkedUserIds = getLinkedUserIds(team, apiPayload);
  const shouldFilterByLinkedIds = linkedUserIds.size > 0;

  const arrayCandidates = [
    team.users,
    team.members,
    team.user_list,
    team.member_list,
    apiPayload?.users,
    apiPayload?.members,
    apiPayload?.user_list,
    apiPayload?.member_list,
  ];

  for (const candidate of arrayCandidates) {
    if (!Array.isArray(candidate)) continue;

    return candidate
      .map((item, index) => {
        if (typeof item === "string") {
          if (shouldFilterByLinkedIds) return null;
          return { id: index, name: item, email: "" };
        }

        if (!item || typeof item !== "object") return null;

        const userId = toComparableId(item.id ?? item.user_id ?? item.userId);

        if (shouldFilterByLinkedIds) {
          if (!userId || !linkedUserIds.has(userId)) return null;
        }

        const name =
          item.name ||
          item.full_name ||
          item.username ||
          [item.firstname, item.lastname].filter(Boolean).join(" ").trim() ||
          item.firstname ||
          item.first_name ||
          item.email ||
          "Unknown User";

        const email = item.email || "";

        return {
          id: userId || index,
          name,
          email,
        };
      })
      .filter(Boolean);
  }

  const stringCandidates = [
    team.user_names,
    team.users_name,
    team.member_names,
    team.members_name,
  ];

  for (const candidate of stringCandidates) {
    if (typeof candidate !== "string" || !candidate.trim()) continue;

    if (shouldFilterByLinkedIds) continue;

    return candidate
      .split(",")
      .map((name, index) => ({
        id: index,
        name: name.trim(),
        email: "",
      }))
      .filter((item) => item.name);
  }

  if (shouldFilterByLinkedIds) {
    return Array.from(linkedUserIds).map((userId) => ({
      id: userId,
      name: `User ID ${userId}`,
      email: "",
    }));
  }

  return [];
};

const usersInTeam = computed(() =>
  getNormalizedUsers(props.team, props.apiPayload),
);

const totalUsersLabel = computed(() => {
  if (!props.team) return 0;

  const totalFromApi = Number(props.team.total_users);
  if (!Number.isNaN(totalFromApi) && totalFromApi >= 0) {
    return totalFromApi;
  }

  return usersInTeam.value.length;
});
</script>

<template>
  <Transition name="overlay">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-sub-text/80 z-40 transition-all duration-300"
      @click="emit('close')"
    ></div>
  </Transition>

  <Transition name="slide">
    <div
      v-if="isOpen"
      class="fixed top-0 right-0 h-screen w-full max-w-xl bg-white shadow-2xl z-50 flex flex-col"
      @click.stop
    >
      <div
        class="sticky top-0 bg-white border-b border-outline px-6 py-4 flex items-center justify-between z-10"
      >
        <h2 class="text-xl font-bold text-dark-base">Team Detail</h2>
        <button
          @click="emit('close')"
          class="p-2 hover:bg-light-base rounded-lg transition-colors"
        >
          <X :size="20" class="text-sub-text" />
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-6 space-y-6">
        <div class="border border-outline rounded-lg p-4 space-y-4">
          <h3 class="text-sm font-semibold text-dark-base">Team Info</h3>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-xs text-sub-text mb-1">Team Name</p>
              <p class="text-sm font-medium text-dark-base">
                {{ team?.team_name || "-" }}
              </p>
            </div>
            <div>
              <p class="text-xs text-sub-text mb-1">Parent Name</p>
              <p class="text-sm font-medium text-dark-base">
                {{ team?.parent || team?.parent_name || "-" }}
              </p>
            </div>
          </div>

          <div>
            <p class="text-xs text-sub-text mb-1">Total Users</p>
            <p class="text-sm font-semibold text-dark-base">
              {{ totalUsersLabel }}
            </p>
          </div>
        </div>

        <div class="border border-outline rounded-lg p-4">
          <div class="flex items-center gap-2 mb-3">
            <Users :size="16" class="text-sub-text" />
            <h3 class="text-sm font-semibold text-dark-base">Users In Team</h3>
          </div>

          <ul v-if="usersInTeam.length" class="space-y-2">
            <li
              v-for="user in usersInTeam"
              :key="user.id"
              class="px-3 py-2 rounded-lg bg-light-base border border-outline"
            >
              <p class="text-sm font-medium text-dark-base">{{ user.name }}</p>
              <p class="text-xs text-sub-text">ID: {{ user.id }}</p>
              <p v-if="user.email" class="text-xs text-sub-text">
                {{ user.email }}
              </p>
            </li>
          </ul>

          <div
            v-else
            class="text-sm text-sub-text bg-light-base border border-outline rounded-lg px-3 py-2"
          >
            Daftar user tim belum tersedia dari API untuk team ini.
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
