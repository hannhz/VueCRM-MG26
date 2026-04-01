<script>
import { ChevronDown, ChevronRight } from "lucide-vue-next";

export default {
  name: "DocsEditor",

  components: {
    ChevronDown,
    ChevronRight,
  },

  props: {
    modelValue: {
      type: Object,
      default: () => ({
        description: "",
        fileSource: "",
        files: [],
      }),
    },

    fileSourceOptions: {
      type: Array,
      default: () => [
        { value: "local", label: "Upload Local" },
        { value: "url", label: "From URL" },
        { value: "drive", label: "Google Drive" },
      ],
    },

    defaultOpen: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      showDocs: this.defaultOpen,
      docDropdownOpen: false,
      localDocs: { ...this.modelValue },
    };
  },

  watch: {
    modelValue: {
      deep: true,
      handler(val) {
        this.localDocs = { ...val };
      },
    },
    localDocs: {
      deep: true,
      handler(val) {
        this.$emit("update:modelValue", val);
      },
    },
  },

  methods: {
    handleDocFileChange(e) {
      const files = Array.from(e.target.files);
      this.localDocs.files = [...this.localDocs.files, ...files];
    },

    removeDocFile(index) {
      this.localDocs.files.splice(index, 1);
    },

    selectSource(val) {
      this.localDocs.fileSource = val;
      this.docDropdownOpen = false;
    },
  },

  computed: {
    currentIcon() {
      return this.showDocs ? ChevronDown : ChevronRight;
    },
  },
};
</script>

<template>
  <div class="mb-5">
    <!-- HEADER -->
    <button
      type="button"
      @click="showDocs = !showDocs"
      class="flex items-center gap-2 w-full text-left mb-3"
    >
      <component :is="currentIcon" :size="16" class="text-sub-text" />

      <span
        class="text-sm font-semibold text-dark-base flex items-center gap-2"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
        Docs
      </span>
    </button>

    <!-- CONTENT -->
    <div
      v-if="showDocs"
      class="border border-outline rounded-lg overflow-hidden"
    >
      <!-- Description -->
      <div class="px-4 pt-4 pb-2">
        <label class="block text-sm font-medium text-dark-base mb-2">
          Desc of Docs
        </label>
      </div>

      <!-- Toolbar -->
      <div
        class="flex items-center gap-1 px-3 py-2 border-t border-b border-outline bg-light-base flex-wrap mx-4"
      >
        <button class="p-1 hover:bg-white rounded text-xs">↩</button>
        <button class="p-1 hover:bg-white rounded text-xs">↪</button>

        <span class="text-outline mx-1">|</span>

        <select class="text-xs bg-transparent focus:outline-none">
          <option>Format</option>
          <option>Heading 1</option>
          <option>Paragraph</option>
        </select>

        <span class="text-outline mx-1">|</span>

        <button class="p-1 font-bold text-xs">B</button>
        <button class="p-1 italic text-xs">I</button>
        <button class="p-1 underline text-xs">U</button>
      </div>

      <!-- TEXTAREA -->
      <textarea
        v-model="localDocs.description"
        rows="5"
        class="w-full px-4 py-3 text-sm text-sub-text focus:outline-none resize-none"
        placeholder="Deskripsi dokumen..."
      ></textarea>

      <!-- FILE SECTION -->
      <div class="px-4 pb-4 border-t border-outline pt-4">
        <label class="block text-sm font-medium text-dark-base mb-2">
          Documents
        </label>

        <!-- Dropdown -->
        <div class="relative">
          <button
            type="button"
            @click="docDropdownOpen = !docDropdownOpen"
            class="w-full flex items-center justify-between px-3 py-2 border border-outline rounded-lg text-sm bg-white"
          >
            <span
              :class="localDocs.fileSource ? 'text-dark-base' : 'text-gray-400'"
            >
              Select File Source
            </span>

            <svg
              class="w-4 h-4 text-sub-text transition-transform"
              :class="docDropdownOpen ? 'rotate-180' : ''"
              fill="none"
              stroke="currentColor"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <ul
            v-if="docDropdownOpen"
            class="absolute bottom-full left-0 right-0 mb-1 bg-white border border-outline rounded-lg shadow-lg z-50"
          >
            <li
              v-for="opt in fileSourceOptions"
              :key="opt.value"
              @click="selectSource(opt.value)"
              class="px-3 py-2 text-sm cursor-pointer hover:bg-light-base"
            >
              {{ opt.label }}
            </li>
          </ul>
        </div>

        <!-- Upload -->
        <div v-if="localDocs.fileSource === 'local'" class="mt-3">
          <label
            class="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-outline rounded-lg cursor-pointer hover:bg-light-base"
          >
            <span class="text-xs">Klik untuk pilih file</span>
            <input
              type="file"
              multiple
              class="hidden"
              @change="handleDocFileChange"
            />
          </label>

          <ul v-if="localDocs.files.length" class="mt-2 space-y-1">
            <li
              v-for="(file, i) in localDocs.files"
              :key="i"
              class="flex justify-between text-xs px-3 py-1.5 bg-light-base rounded-lg"
            >
              <span class="truncate">{{ file.name }}</span>
              <button @click="removeDocFile(i)">✕</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
