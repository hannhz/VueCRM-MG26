<script>
import { ChevronDown, ChevronRight } from "lucide-vue-next";

export default {
  name: "TaskSection",
  components: {
    ChevronDown,
    ChevronRight,
  },

  props: {
    modelValue: {
      type: Object,
      default: () => ({
        name: "",
        content: "",
        status: "",
        assignee: "",
        dueDate: "",
        time: "",
        priority: "",
      }),
    },

    statusOptions: {
      type: Array,
      default: () => [
        { value: "", label: "Select Data" },
        { value: "todo", label: "To Do" },
        { value: "in_progress", label: "In Progress" },
        { value: "done", label: "Done" },
      ],
    },

    priorityOptions: {
      type: Array,
      default: () => [
        { value: "", label: "Select Data" },
        { value: "low", label: "Low" },
        { value: "medium", label: "Medium" },
        { value: "high", label: "High" },
      ],
    },

    assigneeOptions: {
      type: Array,
      default: () => [{ value: "", label: "Select Data" }],
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
      showTasks: this.isOpen,
      ChevronDown,
      ChevronRight,
    };
  },

  watch: {
    isOpen(newVal) {
      this.showTasks = newVal;
    },
  },

  methods: {
    toggleTasks() {
      this.showTasks = !this.showTasks;
    },

    updateTask(field, value) {
      const updated = {
        ...this.modelValue,
        [field]: value,
      };
      this.$emit("update:modelValue", updated);
    },

    onTaskNameChange(value) {
      this.updateTask("name", value);
    },

    onTaskContentChange(value) {
      this.updateTask("content", value);
    },

    onTaskStatusChange(value) {
      this.updateTask("status", value);
    },

    onTaskAssigneeChange(value) {
      this.updateTask("assignee", value);
    },

    onTaskDueDateChange(value) {
      this.updateTask("dueDate", value);
    },

    onTaskTimeChange(value) {
      this.updateTask("time", value);
    },

    onTaskPriorityChange(value) {
      this.updateTask("priority", value);
    },
  },
};
</script>

<template>
  <div :class="wrapperClass">
    <button
      type="button"
      @click="toggleTasks"
      class="flex mt-3 items-center gap-2 w-full text-left mb-3"
    >
      <component
        :is="showTasks ? ChevronDown : ChevronRight"
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
          <polyline points="9 11 12 14 22 4" />
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        </svg>
        Tasks
      </span>
    </button>

    <div
      v-if="showTasks"
      class="border border-outline rounded-lg overflow-hidden space-y-0"
    >
      <div class="px-4 pt-4 pb-2">
        <label class="block text-sm font-medium text-dark-base mb-2">Name of Task</label>
        <input
          :value="modelValue.name"
          type="text"
          placeholder="Task name..."
          @input="onTaskNameChange($event.target.value)"
          class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
        />
      </div>

      <div class="px-4 pb-4">
        <div
          v-if="!hideToolbar"
          class="flex items-center gap-1 px-3 py-2 border border-outline rounded-t-lg bg-light-base flex-wrap"
        >
          <button type="button" class="p-1 hover:bg-white rounded text-sub-text text-xs">↩</button>
          <button type="button" class="p-1 hover:bg-white rounded text-sub-text text-xs">↪</button>
          <span class="text-outline mx-1">|</span>
          <select class="text-xs border-none bg-transparent text-sub-text focus:outline-none">
            <option>Format</option>
            <option>Heading 1</option>
            <option>Paragraph</option>
          </select>
          <span class="text-outline mx-1">|</span>
          <button type="button" class="p-1 hover:bg-white rounded font-bold text-xs text-sub-text">B</button>
          <button type="button" class="p-1 hover:bg-white rounded italic text-xs text-sub-text">I</button>
          <button type="button" class="p-1 hover:bg-white rounded underline text-xs text-sub-text">U</button>
          <span class="text-outline mx-1">|</span>
          <button type="button" class="p-1 hover:bg-white rounded text-xs text-sub-text">🔗</button>
          <button type="button" class="p-1 hover:bg-white rounded text-xs text-sub-text">⚡</button>
          <span class="text-outline mx-1">|</span>
          <button type="button" class="p-1 hover:bg-white rounded text-xs text-sub-text">≡</button>
          <button type="button" class="p-1 hover:bg-white rounded text-xs text-sub-text">≡</button>
          <button type="button" class="p-1 hover:bg-white rounded text-xs text-sub-text">≡</button>
          <button type="button" class="p-1 hover:bg-white rounded text-xs text-sub-text">☰</button>
          <button type="button" class="p-1 hover:bg-white rounded text-xs text-sub-text">☰</button>
        </div>
        <textarea
          :value="modelValue.content"
          rows="4"
          @input="onTaskContentChange($event.target.value)"
          class="w-full px-3 py-3 text-sm text-sub-text border border-outline rounded-b-lg focus:outline-none resize-none"
          :class="{ 'rounded-t-none': !hideToolbar }"
          placeholder="Deskripsi task..."
        ></textarea>
      </div>

      <div class="grid grid-cols-1 gap-4 px-4 pb-4">
        <div>
          <label class="block text-sm font-medium text-dark-base mb-2">Status</label>
          <select
            :value="modelValue.status"
            @change="onTaskStatusChange($event.target.value)"
            class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm bg-white"
          >
            <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 px-4 pb-4" v-if="assigneeOptions.length > 1">
        <div>
          <label class="block text-sm font-medium text-dark-base mb-2">Assignee</label>
          <select
            :value="modelValue.assignee"
            @change="onTaskAssigneeChange($event.target.value)"
            class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm bg-white"
          >
            <option v-for="opt in assigneeOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 px-4 pb-4">
        <div>
          <label class="block text-sm font-medium text-dark-base mb-2">Due Date</label>
          <input
            :value="modelValue.dueDate"
            @input="onTaskDueDateChange($event.target.value)"
            type="date"
            class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-dark-base mb-2">Time</label>
          <input
            :value="modelValue.time"
            @input="onTaskTimeChange($event.target.value)"
            type="time"
            class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
          />
        </div>
      </div>

      <div class="px-4 pb-4">
        <label class="block text-sm font-medium text-dark-base mb-2">Priority</label>
        <select
          :value="modelValue.priority"
          @change="onTaskPriorityChange($event.target.value)"
          class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm bg-white"
        >
          <option v-for="opt in priorityOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<style scoped>
div {
  transition: all 0.3s ease;
}
</style>
