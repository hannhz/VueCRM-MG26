<template>
    <div class="relative" ref="companyDropdownRef">
              <label class="block text-sm font-medium text-dark-base mb-2"
                >Companies Association</label
              >
              <div
                @click="isCompanyDropdownOpen = !isCompanyDropdownOpen"
                class="w-full px-3 py-2 border border-outline rounded-lg flex flex-wrap gap-2 items-center cursor-pointer min-h-10.5 bg-white transition focus-within:ring-1 focus-within:ring-sub-text"
              >
                <div
                  v-if="contactForm.companyassoc.length === 0"
                  class="text-gray-400 text-sm"
                >
                  Search and select companies
                </div>
                <div
                  v-for="company in selectedCompaniesList"
                  :key="company.value"
                  class="flex items-center gap-1 bg-light-base px-2 py-1 rounded text-xs font-medium text-dark-base border border-outline"
                  @click.stop
                >
                  {{ company.label }}
                  <X
                    :size="12"
                    class="cursor-pointer hover:text-red"
                    @click="toggleCompany(company)"
                  />
                </div>
                <ChevronDown :size="16" class="ml-auto text-sub-text" />
              </div>

              <!-- Dropdown Menu -->
              <div
                v-if="isCompanyDropdownOpen"
                class="absolute z-50 w-full mt-1 bg-white border border-outline rounded-lg shadow-xl flex flex-col max-h-64"
              >
                <div class="p-2 border-b border-outline">
                  <div class="relative">
                    <Search
                      :size="14"
                      class="absolute left-3 top-1/2 -translate-y-1/2 text-sub-text"
                    />
                    <input
                      v-model="companySearch"
                      type="text"
                      placeholder="Search by company name"
                      class="w-full pl-9 pr-3 py-2 bg-light-base/50 border border-outline rounded text-sm focus:outline-none focus:ring-1 focus:ring-sub-text"
                      @click.stop
                    />
                  </div>
                </div>
                <div class="flex-1 overflow-y-auto py-1">
                  <div
                    v-for="company in filteredCompanies"
                    :key="company.value"
                    @click="toggleCompany(company)"
                    class="px-4 py-2 hover:bg-light-base cursor-pointer flex items-center justify-between text-sm transition"
                  >
                    <span class="font-medium text-dark-base">{{
                      company.label
                    }}</span>
                    <div
                      v-if="isCompanySelected(company.value)"
                      class="w-5 h-5 bg-dark-base rounded-full flex items-center justify-center"
                    >
                      <Check :size="12" class="text-white" />
                    </div>
                  </div>
                  <div
                    v-if="filteredCompanies.length === 0"
                    class="px-4 py-3 text-center text-sm text-sub-text italic"
                  >
                    No companies found
                  </div>
                </div>
              </div>
            </div>
</template>
<script>
export default {
    name: "CompanyAssociationForm",

    props: {
    contactForm: {
      type: Object,
      required: true,
    },
    allCompanies: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      isCompanyDropdownOpen: false,
      companySearch: "",
    };
  },
}
</script>