<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import { RefreshCcw } from "lucide-vue-next";
import api from "@/api";
import { alertService } from "@/services/alertService";

const store = useStore();
const permissionScope = "Otoritas User";
const apiHeaders = { keyfe: "0-opklm," };

const authorityProfiles = ref(["User Authority 1", "User Authority 2"]);
const selectedProfile = ref(authorityProfiles.value[0]);

const defaultUsers = [
  "fadlikhamdi@gmail.com",
  "hanan@mail.com",
  "aulia@mail.com",
  "rizky@mail.com",
];
const selectedUserEmail = ref(defaultUsers[0]);
const isLoadingPermission = ref(false);
const isSavingPermission = ref(false);
const autoSaveTimer = ref(null);

const projectMenus = [
  "Dashboard",
  "Contacts",
  "Companies",
  "Deals",
  "Task",
  "Broadcast",
  "Documents",
  "Users",
  "Settings",
];

const menuPermissions = ref([]);

const userOptions = computed(() => {
  const users = store.getters["users/usersList"] || [];
  const emails = users
    .map((user) => user.email)
    .filter((email) => typeof email === "string" && email.trim() !== "");

  return emails.length > 0 ? [...new Set(emails)] : defaultUsers;
});

const selectedUsername = computed(() => {
  const users = store.getters["users/usersList"] || [];
  const selectedUser = users.find((user) => user.email === selectedUserEmail.value);

  const fromStore =
    selectedUser?.username ||
    selectedUser?.user_name ||
    selectedUser?.userid ||
    selectedUser?.name;

  if (typeof fromStore === "string" && fromStore.trim() !== "") {
    return fromStore;
  }

  const localPart = String(selectedUserEmail.value || "").split("@")[0];
  return localPart || "";
});

const dbTopLevelMenus = computed(() => {
  const layout = store.getters["settingsfe/getlayoutmenuweb"];
  const dbmenu2 = layout?.dbmenu2 || [];

  const names = dbmenu2
    .filter((item) => item.L0 === "0" && item.HASACCESS === "1")
    .map((item) => item.NamaCaption || item.label || item.pathfile)
    .filter((name) => typeof name === "string" && name.trim() !== "");

  return [...new Set(names)];
});

const effectiveMenuNames = computed(() => {
  return dbTopLevelMenus.value.length > 0 ? dbTopLevelMenus.value : projectMenus;
});

function fallbackIconByMenu(menuName) {
  const name = String(menuName || "").toLowerCase();
  if (name.includes("dashboard")) return "LayoutDashboard";
  if (name.includes("contact")) return "Users";
  if (name.includes("compan")) return "Building2";
  if (name.includes("deal")) return "Briefcase";
  if (name.includes("task")) return "CheckSquare";
  if (name.includes("broadcast") || name.includes("email")) return "Mail";
  if (name.includes("document")) return "FileText";
  if (name.includes("user")) return "UserCircle";
  if (name.includes("setting")) return "Settings";
  return "FileText";
}

function resolveNonEmptyIcon(row = {}) {
  const direct = String(row.icon || row.ICON || "").trim();
  if (direct) return direct;

  const layout = store.getters["settingsfe/getlayoutmenuweb"];
  const dbmenu2 = layout?.dbmenu2 || [];
  const caption = String(row.caption || row.CAPTION || row.menu || "").trim();

  if (caption) {
    const matched = dbmenu2.find((item) => {
      const itemCaption = String(item?.CAPTION || item?.NamaCaption || item?.caption || "").trim();
      return itemCaption.toLowerCase() === caption.toLowerCase();
    });

    const fromLayout = String(matched?.icon || matched?.ICON || "").trim();
    if (fromLayout) return fromLayout;
  }

  return fallbackIconByMenu(caption);
}

function buildDefaultPermission(menu, id) {
  return {
    id,
    username: selectedUsername.value,
    menu,
    menuid: null,
    caption: menu,
    name: menu,
    L0: "0",
    Parent: "0",
    pathfile: "",
    icon: fallbackIconByMenu(menu),
    accessLevel: 0,
    hasaccess: true,
    akses: true,
    tambah: true,
    hapus: true,
    koreksi: true,
    export: false,
    status: 0,
    flagkrm: null,
    imageIndex: -1,
    l1lama: 0,
    accesslama: 0,
  };
}

function syncMenuPermissions(menuNames) {
  const previousByMenu = new Map(
    menuPermissions.value.map((row) => [row.menu, row]),
  );

  menuPermissions.value = menuNames.map((menu, index) => {
    const existing = previousByMenu.get(menu);
    return existing ? { ...existing, id: index + 1 } : buildDefaultPermission(menu, index + 1);
  });
}

function toBool(value, fallback = false) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "1" || normalized === "true" || normalized === "y";
  }
  return fallback;
}

function normalizePermissionRows(rawRows) {
  if (!Array.isArray(rawRows)) return [];

  return rawRows
    .map((row, index) => {
      const menuName =
        row.CAPTION ||
        row.menu ||
        row.nama_menu ||
        row.NAMACAPTION ||
        row.NamaCaption ||
        row.caption ||
        row.label ||
        row.pathfile ||
        "";

      if (typeof menuName !== "string" || menuName.trim() === "") {
        return null;
      }

      return {
        id: index + 1,
        username: row.username || row.USERID || selectedUsername.value,
        menuid: row.menuid || row.id_menu || row.id || row.L1 || null,
        menu: row.name || row.NAME || menuName,
        name: row.name || row.NAME || menuName,
        caption: row.CAPTION || row.caption || menuName,
        L0: String(row.L0 ?? row.l0 ?? "0"),
        Parent: String(row.Parent ?? row.parent ?? row.parendId ?? "0"),
        pathfile: row.pathfile || row.PATHFILE || "",
        icon: resolveNonEmptyIcon(row),
        accessLevel: Number(row.ACCESS ?? row.access ?? 0),
        hasaccess: toBool(row.HASACCESS ?? row.hasaccess, true),
        akses: toBool(row.HASACCESS ?? row.hasaccess ?? row.akses, true),
        tambah: toBool(row.tambah ?? row.TAMBAH ?? row.add ?? row.can_add, true),
        hapus: toBool(row.hapus ?? row.HAPUS ?? row.delete ?? row.can_delete, true),
        koreksi: toBool(row.koreksi ?? row.KOREKSI ?? row.edit ?? row.can_edit, true),
        export: toBool(row.export ?? row.EXPORT ?? row.can_export, false),
        status: Number(row.Status ?? row.status ?? 0),
        flagkrm: row.FLAGKRM ?? row.flagkrm ?? null,
        imageIndex: Number(row.ImageIndex ?? row.imageIndex ?? -1),
        l1lama: Number(row.L1lama ?? row.l1lama ?? 0),
        accesslama: Number(row.ACCESSlama ?? row.ACCESSlar ?? row.accesslama ?? row.accesslar ?? 0),
      };
    })
    .filter(Boolean);
}

async function loadPermissionFromApi() {
  isLoadingPermission.value = true;
  try {
    const response = await api.post(
      "berkas/getflmenu",
      { username: selectedUsername.value },
      {
        headers: apiHeaders,
      },
    );

    const body = response?.data || {};

    const rawRows = body.data || body.rows || body.permissions || body.flmenu || body.dbmenu2 || [];

    const normalizedRows = normalizePermissionRows(rawRows);
    if (normalizedRows.length > 0) {
      menuPermissions.value = normalizedRows;
    } else {
      syncMenuPermissions(effectiveMenuNames.value);
    }

    const apiUsers = body.users || body.user_options || [];
    if (Array.isArray(apiUsers) && apiUsers.length > 0) {
      const parsedUsers = apiUsers
        .map((item) => (typeof item === "string" ? item : item?.email))
        .filter((email) => typeof email === "string" && email.trim() !== "");

      if (parsedUsers.length > 0 && !parsedUsers.includes(selectedUserEmail.value)) {
        selectedUserEmail.value = parsedUsers[0];
      }
    }

    const apiProfiles = body.profiles || body.authority_profiles || [];
    if (Array.isArray(apiProfiles) && apiProfiles.length > 0) {
      const parsedProfiles = apiProfiles
        .map((item) => (typeof item === "string" ? item : item?.name || item?.label))
        .filter((name) => typeof name === "string" && name.trim() !== "");

      if (parsedProfiles.length > 0) {
        authorityProfiles.value = [...new Set(parsedProfiles)];
        if (!authorityProfiles.value.includes(selectedProfile.value)) {
          selectedProfile.value = authorityProfiles.value[0];
        }
      }
    }
  } catch (error) {
    syncMenuPermissions(effectiveMenuNames.value);
    const status = error?.response?.status;
    const backendMessage =
      error?.response?.data?.message || error?.response?.data?.error || "";
    const message =
      status === 500
        ? `Server error 500 on getflmenu${backendMessage ? `: ${backendMessage}` : ""}`
        : backendMessage || "Failed to load permission data.";
    alertService.toastError(message);
  } finally {
    isLoadingPermission.value = false;
  }
}

async function savePermissionToApi(options = {}) {
  const { silent = false } = options;

  isSavingPermission.value = true;
  try {
    // Backend saveedit expects raw array from $request->all(), not wrapped object.
    const payload = menuPermissions.value.map((row) => ({
      username: selectedUsername.value,
      id: String(row.menuid ?? row.id ?? ""),
      akses: row.akses ? 1 : 0,
      tambah: row.tambah ? 1 : 0,
      hapus: row.hapus ? 1 : 0,
      koreksi: row.koreksi ? 1 : 0,
      export: row.export ? 1 : 0,
      L0: String(row.L0 ?? "0"),
      Parent: String(row.Parent ?? "0"),
      CAPTION: row.caption || row.name || row.menu || "",
      icon: resolveNonEmptyIcon(row),
      pathfile: row.pathfile || "",
      ACCESS: Number.isFinite(row.accessLevel) ? row.accessLevel : 0,
      HASACCESS: row.akses ? 1 : 0,
      FLAGKRM: row.flagkrm,
      Status: Number.isFinite(row.status) ? row.status : 0,
      ImageIndex: Number.isFinite(row.imageIndex) ? row.imageIndex : -1,
      L1lama: Number.isFinite(row.l1lama) ? row.l1lama : 0,
      ACCESSlama: Number.isFinite(row.accesslama) ? row.accesslama : 0,
    }));

    await api.post("berkas/saveedit", payload, {
      headers: apiHeaders,
    });
    if (!silent) {
      alertService.toastSuccess("Permission changes saved successfully.");
    }
  } catch (error) {
    const status = error?.response?.status;
    const backendMessage =
      error?.response?.data?.message || error?.response?.data?.error || "";
    const message =
      status === 500
        ? `Server error 500 on saveedit${backendMessage ? `: ${backendMessage}` : ""}`
        : backendMessage || "Failed to save permission data.";
    alertService.toastError(message);
  } finally {
    isSavingPermission.value = false;
  }
}

function queueAutoSave() {
  if (isLoadingPermission.value) return;

  if (autoSaveTimer.value) {
    clearTimeout(autoSaveTimer.value);
  }

  autoSaveTimer.value = setTimeout(() => {
    savePermissionToApi({ silent: true });
  }, 200);
}

watch(effectiveMenuNames, (menuNames) => {
  syncMenuPermissions(menuNames);
}, { immediate: true });

watch([selectedUserEmail, selectedProfile], () => {
  loadPermissionFromApi();
});

onMounted(() => {
  store.dispatch("users/fetchAllusers").catch(() => {});

  const layout = store.getters["settingsfe/getlayoutmenuweb"];
  if (!layout?.dbmenu2?.length) {
    store.dispatch("settingsfe/actlayoutwebflmenu").catch(() => {
      // Keep UI usable with project fallback menu when API menu fetch fails.
    });
  }

  loadPermissionFromApi();
});

onBeforeUnmount(() => {
  if (autoSaveTimer.value) {
    clearTimeout(autoSaveTimer.value);
  }
});

const visiblePermissions = computed(() => {
  return menuPermissions.value;
});
</script>

<template>
  <section class="bg-white rounded-xl border border-outline shadow-sm overflow-hidden">
    <div class="p-4 border-b border-outline">
      <div class="flex flex-wrap items-end justify-between gap-3">
        <div class="flex min-w-0 flex-wrap items-end gap-2 sm:gap-3">
          <div class="w-full sm:w-64">
            <label class="mb-1 block text-sm font-medium text-sub-text">Select User:</label>
            <select
              v-model="selectedUserEmail"
              class="w-full rounded-lg border border-outline bg-white py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-sub-text"
            >
              <option v-for="email in userOptions" :key="email" :value="email">
                {{ email }}
              </option>
            </select>
          </div>

          <div class="w-full sm:w-56">
            <label class="mb-1 block text-sm font-medium text-sub-text">Authority Profile:</label>
            <select
              v-model="selectedProfile"
              class="w-full rounded-lg border border-outline bg-white py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-sub-text"
            >
              <option v-for="profile in authorityProfiles" :key="profile" :value="profile">
                {{ profile }}
              </option>
            </select>
          </div>

          <button
            type="button"
            @click="loadPermissionFromApi"
            :disabled="isLoadingPermission"
            class="h-9 w-9 rounded-lg border border-outline bg-white p-2 transition-all hover:bg-light-base active:scale-95 disabled:opacity-50"
            title="Refresh Data"
          >
            <RefreshCcw
              :size="18"
              :class="{ 'animate-spin': isLoadingPermission }"
              class="text-sub-text"
            />
          </button>
        </div>

        <button
          type="button"
          @click="savePermissionToApi"
          :disabled="isSavingPermission || isLoadingPermission"
          class="rounded-lg border border-primary bg-primary px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {{ isSavingPermission ? "Saving..." : "Save Changes" }}
        </button>
      </div>
    </div>

    <div class="relative overflow-x-auto">
      <div
        v-if="isLoadingPermission"
        class="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-10 flex items-center justify-center"
      >
        <div class="flex flex-col items-center gap-3">
          <RefreshCcw :size="32" class="animate-spin text-sub-text" />
          <p class="text-sm font-medium text-sub-text">Loading permissions...</p>
        </div>
      </div>

      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-200 bg-gray-50/50">
            <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Menu</th>
            <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Username</th>
            <th class="px-6 py-4 text-center text-sm font-semibold text-gray-700">Access</th>
            <th class="px-6 py-4 text-center text-sm font-semibold text-gray-700">Add</th>
            <th class="px-6 py-4 text-center text-sm font-semibold text-gray-700">Delete</th>
            <th class="px-6 py-4 text-center text-sm font-semibold text-gray-700">Edit</th>
            <th class="px-6 py-4 text-center text-sm font-semibold text-gray-700">Export</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="row in visiblePermissions"
            :key="row.id"
            class="border-b border-gray-100 hover:bg-gray-50 transition"
          >
            <td class="px-6 py-3 text-sm text-gray-800 font-medium">
              <span class="mr-1 text-gray-400">&#9656;</span>{{ row.menu }}
            </td>
            <td class="px-6 py-3 text-sm text-dark-base">
              {{ selectedUserEmail }}
            </td>
            <td class="px-6 py-3 text-center">
              <input v-model="row.akses" @change="queueAutoSave" type="checkbox" class="w-4 h-4 text-blue-600 rounded focus:ring-sub-text border-gray-300" />
            </td>
            <td class="px-6 py-3 text-center">
              <input v-model="row.tambah" @change="queueAutoSave" type="checkbox" class="w-4 h-4 text-blue-600 rounded focus:ring-sub-text border-gray-300" />
            </td>
            <td class="px-6 py-3 text-center">
              <input v-model="row.hapus" @change="queueAutoSave" type="checkbox" class="w-4 h-4 text-blue-600 rounded focus:ring-sub-text border-gray-300" />
            </td>
            <td class="px-6 py-3 text-center">
              <input v-model="row.koreksi" @change="queueAutoSave" type="checkbox" class="w-4 h-4 text-blue-600 rounded focus:ring-sub-text border-gray-300" />
            </td>
            <td class="px-6 py-3 text-center">
              <input v-model="row.export" @change="queueAutoSave" type="checkbox" class="w-4 h-4 text-blue-600 rounded focus:ring-sub-text border-gray-300" />
            </td>
          </tr>

          <tr v-if="visiblePermissions.length === 0">
            <td colspan="7" class="px-6 py-20 text-center text-sub-text">
              No permission data available.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
