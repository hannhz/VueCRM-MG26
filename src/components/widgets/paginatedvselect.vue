<template>
  <div>
    <v-select
      v-model="modelValue"
      :options="options"
      :label="label"
      :reduce="reduce"
      :placeholder="placeholder"
      @open="onOpen"
      @search="onSearch"
      ref="select"
    >
      <template #no-options>
        <div class="text-sm text-gray-500 p-2">
          {{ loading ? 'Loading...' : 'No data' }}
        </div>
      </template>
    </v-select>
  </div>
</template>

<script>
import { debounce } from "lodash";

export default {
  name: "PaginatedVSelect",
  props: {
    modelValue: null,
    api: {
      type: Function,
      required: true,
    },
    label: {
      type: String,
      default: "label",
    },
    reduce: {
      type: Function,
      default: (opt) => opt,
    },
    placeholder: {
      type: String,
      default: "Select option",
    },
  },
  data() {
    return {
      options: [],
      page: 1,
      lastPage: 1,
      loading: false,
      search: "",
    };
  },
  methods: {
    async fetchData(reset = false) {
      if (this.loading) return;

      this.loading = true;

      if (reset) {
        this.page = 1;
        this.options = [];
      }

      try {
        const res = await this.api({
          page: this.page,
          search: this.search,
        });

        const data = res.data.data || [];
        this.options = [...this.options, ...data];
        this.lastPage = res.data.last_page || 1;
        this.page++;
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    onOpen() {
      if (this.options.length === 0) {
        this.fetchData();
      }

      this.$nextTick(() => {
        const dropdown = document.querySelector(".vs__dropdown-menu");
        if (!dropdown) return;

        dropdown.addEventListener("scroll", this.handleScroll);
      });
    },

    handleScroll(e) {
      const bottom =
        e.target.scrollTop + e.target.clientHeight >=
        e.target.scrollHeight - 10;

      if (bottom && this.page <= this.lastPage) {
        this.fetchData();
      }
    },

    onSearch: debounce(function (search) {
      this.search = search;
      this.fetchData(true);
    }, 300),
  },
  watch: {
    modelValue(val) {
      this.$emit("update:modelValue", val);
    },
  },
};
</script>

<style scoped>
</style>
