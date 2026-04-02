<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useStore } from "vuex";

const store = useStore();

const allContacts = computed(() => store.getters["contacts/allContacts"] || []);
const allCompanies = computed(() => store.getters["company/allcompany"] || []);
const allDeals = computed(() => store.getters["deals/allDeals"] || []);
const isLoadingDeals = computed(() => store.getters["deals/isLoading"]);
const showFilterMenu = ref(false);
const selectedRange = ref("yearly");
const filterMenuRef = ref(null);

const rangeOptions = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const toAssociationCandidates = (...values) => {
  const candidates = [];

  values.forEach((value) => {
    if (value === "" || value === null || value === undefined) return;

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== "" && item !== null && item !== undefined) {
          candidates.push(item);
        }
      });
      return;
    }

    if (typeof value === "object") {
      if (value.id !== undefined && value.id !== null && value.id !== "") {
        candidates.push(value.id);
      }
      if (
        value.value !== undefined &&
        value.value !== null &&
        value.value !== ""
      ) {
        candidates.push(value.value);
      }
      return;
    }

    String(value)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .forEach((item) => candidates.push(item));
  });

  return [...new Set(candidates.map((item) => String(item).trim()))].filter(
    Boolean,
  );
};

const getContactName = (contact = {}) => {
  return (
    contact.name ||
    contact.contact_name ||
    [contact.first_name, contact.last_name].filter(Boolean).join(" ") ||
    contact.email ||
    `Contact ${contact.id || ""}`
  );
};

const getCompanyName = (company = {}) => {
  return company.company_name || company.name || `Company ${company.id || ""}`;
};

const findCompanyByCandidates = (candidates = []) => {
  if (candidates.length === 0) return null;

  const byId = allCompanies.value.find((company) =>
    candidates.includes(String(company.id)),
  );
  if (byId) return byId;

  const candidateLower = candidates.map((candidate) => candidate.toLowerCase());
  return (
    allCompanies.value.find((company) => {
      const companyName = String(
        company.company_name || company.name || "",
      ).toLowerCase();
      return candidateLower.includes(companyName);
    }) || null
  );
};

const getDealTimestamp = (deal = {}) => {
  const rawDate =
    deal?.created_at ||
    deal?.updated_at ||
    deal?.expected_close_date ||
    deal?.expectedCloseDate ||
    deal?.duration ||
    deal?.tertanggal;

  if (!rawDate) return null;

  const timestamp = new Date(rawDate).getTime();
  return Number.isFinite(timestamp) ? timestamp : null;
};

const leads = computed(() => {
  return allDeals.value.map((deal) => {
    const dealContactCandidates = toAssociationCandidates(
      deal?.contactassoc,
      deal?.dealsassoc,
      deal?.contacts_id,
      deal?.contact_id,
      deal?.contact_association,
      deal?.contactAssociation,
    );

    let contact = allContacts.value.find((item) =>
      dealContactCandidates.includes(String(item.id)),
    );

    if (!contact) {
      const dealContactName = String(
        deal?.contact || deal?.contact_name || "",
      ).toLowerCase();

      if (dealContactName) {
        contact = allContacts.value.find((item) => {
          return getContactName(item).toLowerCase() === dealContactName;
        });
      }
    }

    const contactCompanyCandidates = toAssociationCandidates(
      contact?.companyassoc,
      contact?.companiesAssociation,
      contact?.company_id,
      contact?.companies_id,
    );

    const dealCompanyCandidates = toAssociationCandidates(
      deal?.companyassoc,
      deal?.companies_id,
      deal?.company_id,
      deal?.companies_association,
      deal?.companiesAssociation,
      deal?.company,
      deal?.company_name,
    );

    const company =
      findCompanyByCandidates(contactCompanyCandidates) ||
      findCompanyByCandidates(dealCompanyCandidates);

    const rawStatus = String(deal?.pipeline || deal?.stage || "").toLowerCase();

    let status = "Process";
    if (rawStatus.includes("won")) status = "Won";
    else if (rawStatus.includes("lost")) status = "Lost";

    return {
      id: deal.id,
      name: contact ? getContactName(contact) : deal?.contact || "-",
      company: company
        ? getCompanyName(company)
        : deal?.company || deal?.company_name || "-",
      email: contact?.email || deal?.email || deal?.contact_email || "-",
      project: deal?.deal_name || deal?.name || deal?.project || "-",
      duration: formatDate(
        deal?.duration ||
          deal?.expected_close_date ||
          deal?.expectedCloseDate ||
          deal?.tertanggal,
      ),
      status,
      timestamp: getDealTimestamp(deal),
    };
  });
});

const filteredLeads = computed(() => {
  const day = 24 * 60 * 60 * 1000;
  const now = Date.now();

  const rangeMap = {
    weekly: 7,
    monthly: 30,
    yearly: 365,
  };

  const maxAgeDays = rangeMap[selectedRange.value] || 365;
  const threshold = now - maxAgeDays * day;

  return leads.value.filter((lead) => {
    // Keep rows without valid date so data tidak hilang dari report.
    if (!lead.timestamp) return true;
    return lead.timestamp >= threshold;
  });
});

const statusClass = (status) => {
  if (status === "Won") return "bg-green-100 text-green-600";
  if (status === "Lost") return "bg-red-100 text-red-500";
  return "bg-amber-100 text-amber-500";
};

const toggleFilterMenu = () => {
  showFilterMenu.value = !showFilterMenu.value;
};

const selectRange = (value) => {
  selectedRange.value = value;
  showFilterMenu.value = false;
};

const handleClickOutside = (event) => {
  if (!showFilterMenu.value) return;
  if (filterMenuRef.value && !filterMenuRef.value.contains(event.target)) {
    showFilterMenu.value = false;
  }
};

/* onMounted(async () => {
  document.addEventListener("click", handleClickOutside);

  const requests = [];

  if (allContacts.value.length === 0) {
    requests.push(
      store.dispatch("contacts/fetchAllContacts").catch(() => null),
    );
  }

  if (allCompanies.value.length === 0) {
    requests.push(store.dispatch("company/fetchAllcompany").catch(() => null));
  }

  if (allDeals.value.length === 0) {
    requests.push(store.dispatch("deals/fetchAllDeals").catch(() => null));
  }

  if (requests.length > 0) {
    await Promise.all(requests);
  }
}); */

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-outline p-6 mb-5">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-gray-800">Leads Report</h2>

      <div ref="filterMenuRef" class="relative">
        <button
          @click="toggleFilterMenu"
          class="text-slate-400 hover:text-gray-700 px-2 py-1 rounded"
          title="Filter"
        >
          •••
        </button>

        <div
          v-if="showFilterMenu"
          class="absolute right-0 mt-2 w-40 bg-white border border-outline rounded-lg shadow-lg z-20 py-1"
        >
          <button
            v-for="option in rangeOptions"
            :key="option.value"
            @click="selectRange(option.value)"
            class="w-full text-left px-3 py-2 text-sm hover:bg-outline/20 transition"
            :class="
              option.value === selectedRange
                ? 'text-dark-base font-semibold'
                : 'text-sub-text'
            "
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Table Head -->
    <div
      class="hidden md:grid md:grid-cols-[1.2fr_2fr_2fr_1fr_1fr_0.8fr] text-sm text-slate-500 font-medium border-b pb-3 items-center"
    >
      <span>Name</span>
      <span>Company</span>
      <span>Email</span>
      <span>Projects</span>
      <span class="text-center">Duration</span>
      <span class="text-center">Status</span>
    </div>

    <!-- Rows -->
    <div v-if="isLoadingDeals" class="py-6 text-center text-sm text-sub-text">
      Loading leads...
    </div>

    <div
      v-else-if="filteredLeads.length === 0"
      class="py-6 text-center text-sm text-sub-text"
    >
      No leads data from database.
    </div>

    <div v-else class="mt-3 max-h-[320px] overflow-y-auto pr-1 space-y-2">
      <div
        v-for="(lead, i) in filteredLeads"
        :key="lead.id || i"
        :class="[
          'grid md:grid-cols-[1.5fr_2.5fr_2.5fr_1.5fr_1fr_0.8fr] items-center py-3 px-3 rounded-xl text-sm',
          i % 2 ? 'bg-slate-100/60' : '',
        ]"
      >
        <div class="font-medium text-gray-800">{{ lead.name }}</div>
        <div class="text-gray-700">{{ lead.company }}</div>
        <div class="truncate">{{ lead.email }}</div>
        <div>{{ lead.project }}</div>
        <div class="text-center">{{ lead.duration }}</div>

        <div class="flex justify-center">
          <span
            :class="[
              'px-4 py-1 rounded-full text-xs font-semibold',
              statusClass(lead.status),
            ]"
          >
            {{ lead.status }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
