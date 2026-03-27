<script>
import { ChevronDown, ChevronRight, MapPin, Camera, Mic } from "lucide-vue-next";

export default {
  name: "NotesSection",
  components: {
    ChevronDown,
    ChevronRight,
    MapPin,
    Camera,
    Mic,
  },

  props: {
    // v-model value
    value: {
      type: String,
      default: "",
    },
    // Title untuk notes section
    title: {
      type: String,
      default: "Notes",
    },
    // Placeholder text
    placeholder: {
      type: String,
      default: "Tulis catatan...",
    },
    // Tinggi textarea
    rows: {
      type: Number,
      default: 5,
    },
    // Status expanded/collapsed
    isOpen: {
      type: Boolean,
      default: true,
    },
    // Hide toolbar
    hideToolbar: {
      type: Boolean,
      default: false,
    },
    // Hide action buttons
    hideActions: {
      type: Boolean,
      default: false,
    },
    // Custom class
    wrapperClass: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      showNotes: this.isOpen,
      noteContent: this.value,
    };
  },

  watch: {
    value(newVal) {
      this.noteContent = newVal;
    },
    noteContent(newVal) {
      this.$emit("input", newVal);
    },
  },

  methods: {
    toggleNotes() {
      this.showNotes = !this.showNotes;
    },

    handleLocationClick() {
      this.$emit("add-location");
    },

    handlePhotoClick() {
      this.$emit("add-photo");
    },

    handleRecordingClick() {
      this.$emit("add-recording");
    },
  },
};
</script>

<template>
  <div :class="wrapperClass">
    <!-- NOTES SECTION HEADER -->
    <button
      type="button"
      @click="toggleNotes"
      class="flex items-center gap-2 w-full text-left mb-3"
    >
      <component
        :is="showNotes ? ChevronDown : ChevronRight"
        :size="16"
        class="text-sub-text"
      />
      <span class="text-sm font-semibold text-dark-base flex items-center gap-2">
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
        </svg>
        {{ title }}
      </span>
    </button>

    <!-- NOTES SECTION CONTENT -->
    <div
      v-if="showNotes"
      class="border border-outline rounded-lg overflow-hidden"
    >
      <!-- Toolbar -->
      <div
        v-if="!hideToolbar"
        class="flex items-center gap-1 px-3 py-2 border-b border-outline bg-light-base flex-wrap"
      >
        <button type="button" class="p-1 hover:bg-white rounded text-sub-text text-xs">
          ↩
        </button>
        <button type="button" class="p-1 hover:bg-white rounded text-sub-text text-xs">
          ↪
        </button>
        <span class="text-outline mx-1">|</span>
        <select
          class="text-xs border-none bg-transparent text-sub-text focus:outline-none"
        >
          <option>Format</option>
          <option>Heading 1</option>
          <option>Heading 2</option>
          <option>Paragraph</option>
        </select>
        <span class="text-outline mx-1">|</span>
        <button type="button" class="p-1 hover:bg-white rounded font-bold text-xs text-sub-text">
          B
        </button>
        <button type="button" class="p-1 hover:bg-white rounded italic text-xs text-sub-text">
          I
        </button>
        <button type="button" class="p-1 hover:bg-white rounded underline text-xs text-sub-text">
          U
        </button>
        <span class="text-outline mx-1">|</span>
        <button type="button" class="p-1 hover:bg-white rounded text-xs text-sub-text">
          📷
        </button>
        <button type="button" class="p-1 hover:bg-white rounded text-xs text-sub-text">
          ⚔
        </button>
        <span class="text-outline mx-1">|</span>
        <button type="button" class="p-1 hover:bg-white rounded text-xs text-sub-text">
          ≡
        </button>
        <button type="button" class="p-1 hover:bg-white rounded text-xs text-sub-text">
          ≡
        </button>
        <button type="button" class="p-1 hover:bg-white rounded text-xs text-sub-text">
          ≡
        </button>
        <button type="button" class="p-1 hover:bg-white rounded text-xs text-sub-text">
          ≡
        </button>
        <button type="button" class="p-1 hover:bg-white rounded text-xs text-sub-text">
          ☰
        </button>
        <button type="button" class="p-1 hover:bg-white rounded text-xs text-sub-text">
          ☰
        </button>
      </div>

      <!-- Editor area -->
      <textarea
        v-model="noteContent"
        :rows="rows"
        class="w-full px-4 py-3 text-sm text-sub-text focus:outline-none resize-none"
        :placeholder="placeholder"
      ></textarea>

      <!-- Bottom actions -->
      <div
        v-if="!hideActions"
        class="flex items-center gap-4 px-4 py-2 border-t border-outline"
      >
        <button
          type="button"
          class="flex items-center gap-1.5 text-xs text-sub-text hover:text-dark-base transition"
          @click="handleLocationClick"
        >
          <MapPin :size="14" /> Add GPS Location
        </button>
        <button
          type="button"
          class="flex items-center gap-1.5 text-xs text-sub-text hover:text-dark-base transition"
          @click="handlePhotoClick"
        >
          <Camera :size="14" /> Add Photo
        </button>
        <button
          type="button"
          class="flex items-center gap-1.5 text-xs text-sub-text hover:text-dark-base transition"
          @click="handleRecordingClick"
        >
          <Mic :size="14" /> Start Recording
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Smooth transition untuk toggle */
div {
  transition: all 0.3s ease;
}
</style>