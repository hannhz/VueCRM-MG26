<script>
import { ChevronDown, ChevronRight } from "lucide-vue-next";

export default {
  name: "DocsSection",
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

    isOpen: {
      type: Boolean,
      default: true,
    },

    hideToolbar: {
      type: Boolean,
      default: false,
    },

    wrapperClass: {
      type: String,
      default: "",
    },
  },

  emits: ["update:modelValue"],

  data() {
    return {
      showDocs: this.isOpen,
      ChevronDown,
      ChevronRight,
      fileSourceOptions: [
        { value: "", label: "Select File Source" },
        { value: "local", label: "Local File" },
        { value: "google_drive", label: "Google Drive" },
        { value: "dropbox", label: "Dropbox" },
      ],
    };
  },

  watch: {
    isOpen(newVal) {
      this.showDocs = newVal;
    },
  },

  methods: {
    toggleDocs() {
      this.showDocs = !this.showDocs;
    },

    updateDocs(field, value) {
      const updated = {
        ...this.modelValue,
        [field]: value,
      };
      this.$emit("update:modelValue", updated);
    },

    onDescriptionChange(value) {
      this.updateDocs("description", value);
    },

    onFileSourceChange(value) {
      this.updateDocs("fileSource", value);
    },

    handleDocFileChange(e) {
      const newFiles = Array.from(e.target.files);
      const updatedFiles = [...this.modelValue.files, ...newFiles];
      this.updateDocs("files", updatedFiles);
    },

    removeDocFile(index) {
      const updatedFiles = this.modelValue.files.filter((_, i) => i !== index);
      this.updateDocs("files", updatedFiles);
    },
  },
};
</script>

<template>
    <div>
            <button
              type="button"
              @click="toggleDocs"
              class="flex mt-3 items-center gap-2 w-full text-left mb-3"
            >
              <component
                :is="showDocs ? ChevronDown : ChevronRight"
                :size="16"
                class="text-sub-text"
              />
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
                  <path
                    d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
                  />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                Docs
              </span>
            </button>

            <div
              v-if="showDocs"
              class="border border-outline rounded-lg overflow-hidden"
            >
              <!-- Desc of Docs label -->
              <div class="px-4 pt-4 pb-2">
                <label class="block text-sm font-medium text-dark-base mb-2"
                  >Description</label
                >
              </div>
              <!-- Toolbar -->
              <div
                v-if="!hideToolbar"
                class="flex items-center gap-1 px-3 py-2 border-t border-b border-outline bg-light-base flex-wrap mx-4"
              >
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded text-sub-text text-xs"
                >
                  ↩
                </button>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded text-sub-text text-xs"
                >
                  ↪
                </button>
                <span class="text-outline mx-1">|</span>
                <select
                  class="text-xs border-none bg-transparent text-sub-text focus:outline-none"
                >
                  <option>Format</option>
                  <option>Heading 1</option>
                  <option>Paragraph</option>
                </select>
                <span class="text-outline mx-1">|</span>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded font-bold text-xs text-sub-text"
                >
                  B
                </button>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded italic text-xs text-sub-text"
                >
                  I
                </button>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded underline text-xs text-sub-text"
                >
                  U
                </button>
                <span class="text-outline mx-1">|</span>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded text-xs text-sub-text"
                >
                  🔗
                </button>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded text-xs text-sub-text"
                >
                  ⚡
                </button>
                <span class="text-outline mx-1">|</span>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded text-xs text-sub-text"
                >
                  ≡
                </button>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded text-xs text-sub-text"
                >
                  ≡
                </button>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded text-xs text-sub-text"
                >
                  ≡
                </button>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded text-xs text-sub-text"
                >
                  ≡
                </button>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded text-xs text-sub-text"
                >
                  ☰
                </button>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded text-xs text-sub-text"
                >
                  ☰
                </button>
              </div>
              <textarea
                :value="modelValue.description"
                @input="onDescriptionChange($event.target.value)"
                rows="5"
                class="w-full px-4 py-3 text-sm text-sub-text focus:outline-none resize-none"
                placeholder="Deskripsi dokumen..."
              ></textarea>

              <!-- Documents -->
              <div class="px-4 pb-4 border-t border-outline pt-4">
                <label class="block text-sm font-medium text-dark-base mb-2"
                  >Documents</label
                >
                <!-- File Source Dropdown -->
                <div class="relative">
                  <button
                    type="button"
                    @click.stop
                    class="w-full flex items-center justify-between px-3 py-2 border border-outline rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-sub-text"
                  >
                    <span
                      :class="
                        modelValue.fileSource ? 'text-dark-base' : 'text-gray-400'
                      "
                    >
                      {{
                        fileSourceOptions.find((o) => o.value === modelValue.fileSource)
                          ?.label || "Select File Source"
                      }}
                    </span>
                    <svg
                      class="w-4 h-4 text-sub-text"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </button>
                  <!-- Dropdown list -->
                  <div class="absolute top-full left-0 right-0 mt-1 bg-white border border-outline rounded-lg shadow-lg z-50 overflow-hidden">
                    <button
                      v-for="opt in fileSourceOptions"
                      :key="opt.value"
                      type="button"
                      @click="onFileSourceChange(opt.value)"
                      class="w-full px-3 py-2 text-sm text-left hover:bg-light-base transition"
                      :class="
                        modelValue.fileSource === opt.value
                          ? 'text-sub-text font-medium bg-light-base'
                          : 'text-dark-base'
                      "
                    >
                      {{ opt.label }}
                    </button>
                  </div>
                </div>

                <!-- Local file picker -->
                <div v-if="modelValue.fileSource === 'local'" class="mt-4">
                  <label
                    class="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-outline rounded-lg cursor-pointer hover:bg-light-base transition-colors"
                  >
                    <div class="flex flex-col items-center gap-1 text-sub-text">
                      <svg
                        class="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="1.5"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                      <span class="text-xs font-medium"
                        >Klik untuk pilih file</span
                      >
                      <span class="text-xs text-gray-400"
                        >PDF, DOC, XLS, JPG, PNG</span
                      >
                    </div>
                    <input
                      type="file"
                      multiple
                      class="hidden"
                      @change="handleDocFileChange"
                    />
                  </label>
                  <!-- Files List -->
                  <ul v-if="modelValue.files && modelValue.files.length" class="mt-2 space-y-1">
                    <li
                      v-for="(file, i) in modelValue.files"
                      :key="i"
                      class="flex items-center justify-between text-xs px-3 py-1.5 bg-light-base rounded-lg"
                    >
                      <span class="truncate text-dark-base">{{ file.name }}</span>
                      <button
                        type="button"
                        @click="removeDocFile(i)"
                        class="ml-2 text-sub-text hover:text-red-500 shrink-0 font-bold"
                      >
                        ✕
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
</template>

<style scoped>
div {
  transition: all 0.3s ease;
}
</style>