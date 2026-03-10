<script setup>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";

const store = useStore();

const allContacts = computed(() => store.getters["contacts/allContacts"] || []);
const isLoading = computed(() => store.getters["contacts/isLoading"]);

const getContactName = (contact = {}) => {
  return (
    contact.name ||
    contact.contact_name ||
    [contact.first_name, contact.last_name].filter(Boolean).join(" ") ||
    contact.email ||
    `Contact ${contact.id || ""}`
  );
};

const contacts = computed(() =>
  allContacts.value.slice(0, 8).map((contact, index) => ({
    id: contact.id ?? index,
    name: getContactName(contact),
    // Placeholder sementara, nanti disesuaikan saat data metrik siap.
    deals: "-",
    last: "-",
    value: "-",
  })),
);

onMounted(async () => {
  if (allContacts.value.length > 0) return;
  await store.dispatch("contacts/fetchAllContacts").catch(() => null);
});
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-outline p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-bold text-gray-800">Top Contacts</h2>
      <button class="text-slate-400 hover:text-gray-700">•••</button>
    </div>

    <!-- Table Header -->
    <div
      class="grid grid-cols-[2fr_0.7fr_1.2fr_1fr] text-sm text-slate-500 font-medium border-b pb-3"
    >
      <div>Contact</div>
      <div class="text-center">Deals</div>
      <div class="text-center">Last Activity</div>
      <div class="text-right">Deals Value</div>
    </div>

    <!-- Rows -->
    <div v-if="isLoading" class="py-6 text-center text-sm text-sub-text">
      Loading contacts...
    </div>

    <div
      v-else-if="contacts.length === 0"
      class="py-6 text-center text-sm text-sub-text"
    >
      No contact data from database.
    </div>

    <div v-else class="mt-3 space-y-3">
      <div
        v-for="(contact, i) in contacts"
        :key="contact.id"
        class="grid grid-cols-[2fr_0.7fr_1.2fr_1fr] items-center text-sm"
      >
        <div class="font-medium text-gray-800">
          {{ contact.name }}
        </div>

        <div class="text-center text-gray-700">
          {{ contact.deals }}
        </div>

        <div class="text-center text-gray-700">
          {{ contact.last }}
        </div>

        <div class="text-right font-medium text-gray-800">
          {{ contact.value }}
        </div>
      </div>
    </div>
  </div>
</template>
