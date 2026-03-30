<template>
  <div class="relative" ref="contactDropdownRef">
    <label class="block text-sm font-medium text-dark-base mb-2">
      Contact Association
    </label>
    <div
      @click="isContactDropdownOpen = !isContactDropdownOpen"
      class="w-full px-3 py-2 border border-outline rounded-lg flex flex-wrap gap-2 items-center cursor-pointer min-h-10.5 bg-white transition focus-within:ring-1 focus-within:ring-sub-text"
    >
      <div v-if="contactassoc.length === 0" class="text-gray-400 text-sm">
        Search and select contacts
      </div>
      <div
        v-for="contact in selectedContacts"
        :key="contact.id"
        class="flex items-center gap-1 bg-light-base px-2 py-1 rounded text-xs font-medium text-dark-base border border-outline"
        @click.stop
      >
        {{ getDisplayNameFromContact(contact) }}
        <X
          :size="12"
          class="cursor-pointer hover:text-red"
          @click="toggleContact(contact)"
        />
      </div>
      <ChevronDown :size="16" class="ml-auto text-sub-text" />
    </div>

    <!-- Dropdown Menu -->
    <div
      v-if="isContactDropdownOpen"
      class="absolute z-50 w-full mt-1 bg-white border border-outline rounded-lg shadow-xl flex flex-col max-h-64"
    >
      <div class="p-2 border-b border-outline">
        <div class="relative">
          <Search
            :size="14"
            class="absolute left-3 top-1/2 -translate-y-1/2 text-sub-text"
          />
          <input
            v-model="contactSearch"
            type="text"
            placeholder="Search by name or email"
            class="w-full pl-9 pr-3 py-2 bg-light-base/50 border border-outline rounded text-sm focus:outline-none focus:ring-1 focus:ring-sub-text"
            @click.stop
          />
        </div>
      </div>
      <div class="flex-1 overflow-y-auto py-1">
        <div
          v-for="contact in filteredContacts"
          :key="contact.id"
          @click="toggleContact(contact)"
          class="px-4 py-2 hover:bg-light-base cursor-pointer flex items-center justify-between text-sm transition"
        >
          <div class="flex flex-col">
            <span class="font-medium text-dark-base">{{
              getDisplayNameFromContact(contact)
            }}</span>
            <span class="text-xs text-sub-text">{{ contact.email }}</span>
          </div>
          <div
            v-if="isContactSelected(contact.id)"
            class="w-5 h-5 bg-dark-base rounded-full flex items-center justify-center"
          >
            <Check :size="12" class="text-white" />
          </div>
        </div>
        <div
          v-if="filteredContacts.length === 0"
          class="px-4 py-6 text-center text-sm text-sub-text"
        >
          No contacts found
        </div>
      </div>
    </div>
  </div>

  <button
    type="button"
    @click="showAddContactQuickForm = true"
    class="mt-2 text-sm text-sub-text hover:text-dark-base font-medium flex items-center gap-1"
  >
    <Plus :size="14" />
    Create Contact
  </button>


  <AddContactQuickForm
    :isOpen="showAddContactQuickForm"
    @close="showAddContactQuickForm = false"
    @submit="handleContactQuickSubmit"
  />
</template>

<script>
import { mapGetters } from "vuex";
import { X, ChevronDown, Search, Check,Plus,  } from "lucide-vue-next";
import AddContactQuickForm from "@/components/forms/AddContactQuickForm.vue";

export default {
  name: "ContactAssociationForm",

  components: {
    X,
    ChevronDown,
    Search,
    Check,
    Plus,
    AddContactQuickForm
  },

  props: {
    modelValue: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      isContactDropdownOpen: false,
      contactSearch: "",
      showAddContactQuickForm: false,
    };
  },

  computed: {
    ...mapGetters({
      allContacts: "contacts/allContacts",
    }),

    contactassoc: {
      get() {
        return this.modelValue || [];
      },
      set(value) {
        this.$emit("update:modelValue", value);
      },
    },

    filteredContacts() {
      if (!this.contactSearch) return this.allContacts || [];

      return (this.allContacts || []).filter((c) => {
        const name = `${c.first_name || ""} ${c.last_name || ""}`
          .toLowerCase()
          .trim();
        const email = (c.email || "").toLowerCase();
        const search = this.contactSearch.toLowerCase();

        return name.includes(search) || email.includes(search);
      });
    },

    selectedContacts() {
      return (this.allContacts || []).filter((c) =>
        this.contactassoc.includes(String(c.id).trim()),
      );
    },
  },

  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },

  destroyed() {
    document.removeEventListener("click", this.handleClickOutside);
  },

  methods: {
    async handleContactQuickSubmit(formData) {
      // Close the quick form
      this.showAddContactQuickForm = false;
      // Refresh contacts list from store
      await this.$store.dispatch('contacts/fetchAllContacts');
    },

    toggleContact(contact) {
      const contactId = String(contact.id).trim();
      const index = this.contactassoc.findIndex(
        (id) => String(id).trim() === contactId,
      );

      let newValue;
      if (index === -1) {
        newValue = [...this.contactassoc, contactId];
      } else {
        newValue = this.contactassoc.filter((id, i) => i !== index);
      }
      this.contactassoc = newValue;
    },

    isContactSelected(id) {
      const contactId = String(id).trim();
      return this.contactassoc.some((cid) => String(cid).trim() === contactId);
    },

    getDisplayNameFromContact(contact) {
      return `${contact.first_name || ""} ${contact.last_name || ""}`.trim();
    },

    handleClickOutside(e) {
      if (!this.$refs.contactDropdownRef?.contains(e.target)) {
        this.isContactDropdownOpen = false;
      }
    },
  },
};
</script>
