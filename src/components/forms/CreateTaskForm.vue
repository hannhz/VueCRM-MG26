<template>
  <!-- Overlay form utama -->
  <transition name="overlay">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-sub-text/80 z-40 transition-all duration-300"
      @click="handleClose"
    ></div>
  </transition>

  <!-- Slide Panel Utama -->
  <transition name="slide">
    <div
      v-if="isOpen"
      class="fixed top-0 right-0 h-screen w-full sm:max-w-2xl bg-white shadow-2xl z-50 flex flex-col"
      @click.stop
    >
      <!-- Header -->
      <div
        class="sticky top-0 bg-white border-b border-outline px-6 py-4 flex items-center justify-between z-10 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]"
      >
        <div class="flex items-center gap-2">
          <ClipboardList :size="20" class="text-dark-base" />
          <h2 class="text-xl font-bold text-dark-base">
            {{ isEditMode ? "Edit Task" : "Create Task" }}
          </h2>
        </div>
        <button
          @click="handleClose"
          class="p-2 hover:bg-light-base rounded-lg transition-colors"
        >
          <X :size="20" class="text-sub-text" />
        </button>
      </div>

      <!-- Tabs -->
      <div class="flex border-b border-outline px-6 bg-white">
        <button
          type="button"
          @click="activeTab = 'master'"
          :class="[
            'px-4 py-2 text-sm font-medium border-b-2 transition',
            activeTab === 'master'
              ? 'border-dark-base text-dark-base'
              : 'border-transparent text-sub-text hover:text-dark-base',
          ]"
        >
          Master
        </button>
        <button
          type="button"
          @click="activeTab = 'notes'"
          :class="[
            'px-4 py-2 text-sm font-medium border-b-2 transition',
            activeTab === 'notes'
              ? 'border-dark-base text-dark-base'
              : 'border-transparent text-sub-text hover:text-dark-base',
          ]"
        >
          Notes
        </button>
      </div>

      <!-- Konten Scrollable -->
      <div class="flex-1 overflow-y-auto min-h-0">
        <!-- Tab Master: Form Task -->
        <form
          v-if="activeTab === 'master'"
          @submit.prevent="handleSubmit"
          class="p-4 sm:p-6 space-y-5"
        >
          <!-- Name of Task -->
          <div>
            <label class="block text-sm font-medium text-dark-base mb-2"
              >Name of Task <span class="text-red-600">*</span></label
            >
            <input
              v-model="formData.task_name"
              type="text"
              placeholder="Task name..."
              class="w-full px-4 py-3 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm bg-white"
            />
          </div>

          <!-- Task Description -->
          <div
            class="border border-outline rounded-lg overflow-hidden shadow-sm"
          >
            <div
              class="flex items-center gap-1.5 px-4 py-2 border-b border-outline bg-light-base/50 flex-wrap"
            >
              <button
                type="button"
                class="p-1.5 hover:bg-white rounded transition-colors text-sub-text"
              >
                <RotateCcw :size="16" />
              </button>
              <button
                type="button"
                class="p-1.5 hover:bg-white rounded transition-colors text-sub-text"
              >
                <RotateCw :size="16" />
              </button>
              <div class="w-px h-4 bg-outline mx-1"></div>
              <div class="relative flex items-center">
                <select
                  class="text-xs font-medium border-none bg-transparent text-sub-text focus:outline-none py-1 pl-1 pr-6 rounded cursor-pointer appearance-none"
                >
                  <option>Format</option>
                </select>
                <ChevronDown
                  :size="12"
                  class="absolute right-1 text-sub-text pointer-events-none"
                />
              </div>
              <div class="w-px h-4 bg-outline mx-1"></div>
              <button
                type="button"
                class="p-1.5 hover:bg-white rounded transition-colors text-dark-base font-bold"
              >
                <Bold :size="16" />
              </button>
              <button
                type="button"
                class="p-1.5 hover:bg-white rounded transition-colors text-sub-text"
              >
                <Italic :size="16" />
              </button>
              <button
                type="button"
                class="p-1.5 hover:bg-white rounded transition-colors text-sub-text"
              >
                <Underline :size="16" />
              </button>
              <div class="w-px h-4 bg-outline mx-1"></div>
              <button
                type="button"
                class="p-1.5 hover:bg-white rounded transition-colors text-sub-text"
              >
                <Link2 :size="16" />
              </button>
              <button
                type="button"
                class="p-1.5 hover:bg-white rounded transition-colors text-sub-text"
              >
                <Anchor :size="16" />
              </button>
              <div class="w-px h-4 bg-outline mx-1"></div>
              <button
                type="button"
                class="p-1.5 hover:bg-white rounded transition-colors text-sub-text"
              >
                <AlignLeft :size="16" />
              </button>
              <button
                type="button"
                class="p-1.5 hover:bg-white rounded transition-colors text-sub-text"
              >
                <AlignCenter :size="16" />
              </button>
              <button
                type="button"
                class="p-1.5 hover:bg-white rounded transition-colors text-sub-text"
              >
                <AlignRight :size="16" />
              </button>
              <button
                type="button"
                class="p-1.5 hover:bg-white rounded transition-colors text-sub-text"
              >
                <AlignJustify :size="16" />
              </button>
              <button
                type="button"
                class="p-1.5 hover:bg-white rounded transition-colors text-sub-text"
              >
                <List :size="16" />
              </button>
              <button
                type="button"
                class="p-1.5 hover:bg-white rounded transition-colors text-sub-text"
              >
                <ListOrdered :size="16" />
              </button>
            </div>
            <textarea
              v-model="formData.description"
              rows="6"
              class="w-full px-4 py-4 text-sm text-sub-text focus:outline-none resize-none bg-white"
              placeholder="Task description..."
            ></textarea>
          </div>

          <!-- Status -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2"
                >Status</label
              >
              <div class="relative">
                <select
                  v-model="formData.status"
                  class="w-full px-4 py-3 pr-10 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm bg-white appearance-none cursor-pointer text-dark-base"
                >
                  <option
                    v-for="opt in statusOptions"
                    :key="opt.value"
                    :value="opt.value"
                  >
                    {{ opt.label }}
                  </option>
                </select>
                <ChevronDown
                  :size="18"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-sub-text pointer-events-none"
                />
              </div>
            </div>
          </div>

          <!-- Due Date & Time -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2"
                >Due Date</label
              >
              <div class="relative">
                <input
                  v-model="formData.due_date"
                  type="date"
                  class="w-full px-4 py-3 pr-10 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm text-dark-base bg-white"
                />
                <Calendar
                  :size="18"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-sub-text pointer-events-none"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2"
                >Time</label
              >
              <div class="relative">
                <input
                  v-model="formData.task_time"
                  type="time"
                  class="w-full px-4 py-3 pr-10 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm text-dark-base bg-white"
                />
                <Clock
                  :size="18"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-sub-text pointer-events-none"
                />
              </div>
            </div>
          </div>

          <!-- Priority -->
          <div>
            <label class="block text-sm font-medium text-dark-base mb-2"
              >Priority</label
            >
            <div class="relative">
              <select
                v-model="formData.priority"
                class="w-full px-4 py-3 pr-10 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm bg-white appearance-none cursor-pointer text-dark-base"
              >
                <option
                  v-for="opt in priorityOptions"
                  :key="opt.value"
                  :value="opt.value"
                >
                  {{ opt.label }}
                </option>
              </select>
              <ChevronDown
                :size="18"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-sub-text pointer-events-none"
              />
            </div>
          </div>
        </form>

        <!-- Tab Notes -->
        <div v-if="activeTab === 'notes'" class="p-6 h-full flex flex-col">
          <HistoryDetail
            :items="historyitems"
            @add-note="openNoteDrawer"
            @edit="handleHistoryEdit"
            @delete="handleHistoryDelete"
          />
        </div>
      </div>

      <!-- Footer Actions -->
      <div
        class="bg-white flex items-center justify-between p-4 sm:px-6 sm:py-4 border-t border-outline shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]"
      >
        <button
          @click="handleReset"
          class="text-sm text-red font-medium hover:underline px-2"
        >
          Reset
        </button>
        <div class="flex gap-3">
          <button
            @click="handleClose"
            class="px-6 py-2 border border-outline rounded-lg text-sub-text hover:bg-light-base transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            v-if="activeTab === 'master'"
            @click="handleSubmit"
            class="px-6 py-2 bg-dark-base text-white rounded-lg hover:bg-dark-hover transition-colors text-sm font-medium"
          >
            Save Task
          </button>
        </div>
      </div>
    </div>
  </transition>

  <!-- ======================= NOTES DRAWER DENGAN OVERLAY KHUSUS ======================= -->
  <transition name="overlay">
    <div
      v-if="isNoteDrawerOpen"
      class="fixed inset-0 bg-black/50 z-55"
      @click="isNoteDrawerOpen = false"
    ></div>
  </transition>

  <transition name="slide">
    <div
      v-if="isNoteDrawerOpen"
      class="fixed top-0 right-0 h-screen w-full max-w-2xl bg-white shadow-2xl z-60 flex flex-col"
      @click.stop
    >
      <div
        class="sticky top-0 bg-white border-b border-outline px-6 py-4 flex items-center justify-between z-10"
      >
        <h2 class="text-xl font-bold text-dark-base">
          {{ editingItemIndex !== null ? "Edit Catatan" : "Tambah Catatan" }}
        </h2>
        <button
          @click="isNoteDrawerOpen = false"
          class="p-2 hover:bg-light-base rounded-lg transition-colors"
        >
          <X :size="20" class="text-sub-text" />
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-6">
        <NotesSection v-model:note-data="tempNoteData" />
      </div>

      <div
        class="bg-white px-6 py-4 border-t border-outline flex justify-end gap-3"
      >
        <button
          @click="isNoteDrawerOpen = false"
          class="px-6 py-2 border border-outline rounded-lg text-sm font-medium hover:bg-light-base"
        >
          Cancel
        </button>
        <button
          @click="saveNoteFromDrawer"
          class="px-6 py-2 bg-dark-base text-white rounded-lg text-sm font-medium hover:bg-dark-hover"
        >
          Simpan
        </button>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";
import {
  X,
  ChevronDown,
  Calendar,
  Clock,
  ClipboardList,
  Bold,
  Italic,
  Underline,
  Link2,
  Anchor,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  RotateCcw,
  RotateCw,
  Plus,
} from "lucide-vue-next";
import NotesSection from "@/components/widgets/NotesEditor.vue";
import HistoryDetail from "@/components/widgets/historydetail.vue";
import { alertService } from "@/services/alertService";

export default {
  name: "CreateTaskForm",
  components: {
    X,
    ChevronDown,
    Calendar,
    Clock,
    ClipboardList,
    Bold,
    Italic,
    Underline,
    Link2,
    Anchor,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    List,
    ListOrdered,
    RotateCcw,
    RotateCw,
    Plus,
    NotesSection,
    HistoryDetail,
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    initialData: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      activeTab: "master",
      isNoteDrawerOpen: false,
      editingItemIndex: null,
      historyitems: [],
      formData: {
        task_name: "",
        description: "",
        status: "",
        assignee: "",
        due_date: "",
        task_time: "",
        priority: "",
      },
      tempNoteData: {
        body: "",
        gps_address: null,
        latitude: null,
        longitude: null,
        photos: [],
        audioBlob: null,
      },
      statusOptions: [
        { value: "", label: "Select Data" },
        { value: "todo", label: "To Do" },
        { value: "in_progress", label: "In Progress" },
        { value: "done", label: "Done" },
      ],
      priorityOptions: [
        { value: "", label: "Select Data" },
        { value: "low", label: "Low" },
        { value: "medium", label: "Medium" },
        { value: "high", label: "High" },
      ],
    };
  },
  computed: {
    ...mapGetters("users", ["usersignin", "allUsers"]),
    isEditMode() {
      return !!(this.initialData && Object.keys(this.initialData).length);
    },
    assigneeOptions() {
      const users = this.allUsers || [];
      return [
        { value: "", label: "Select Data" },
        ...users.map((user) => ({
          value: user.name || user.username || user.id,
          label: user.name || user.username || "Unknown",
        })),
      ];
    },
    currentUserName() {
      const signin = this.usersignin;
      return (
        signin?.name ||
        signin?.username ||
        signin?.user?.name ||
        signin?.user?.username ||
        ""
      );
    },
  },
  watch: {
    isOpen: {
      immediate: true,
      handler(val) {
        if (val) {
          if (this.initialData) {
            this.setFormData(this.initialData);
          } else {
            this.handleReset();
          }
          this.activeTab = "master";
        }
      },
    },
    initialData: {
      deep: true,
      handler(newData) {
        if (this.isOpen && newData) {
          this.setFormData(newData);
          this.activeTab = "master";
        }
      },
    },
  },
  mounted() {
    this.$store.dispatch("users/fetchAllusers");
    this.$store.dispatch("users/getusersignin");
    if (!this.formData.assignee && this.currentUserName) {
      this.formData.assignee = this.currentUserName;
    }
    window.addEventListener("keydown", this.handleEscKey);
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.handleEscKey);
  },
  methods: {
    getCurrentUserName() {
      return this.currentUserName;
    },
    setFormData(data) {
      if (!data) return;
      this.formData = {
        task_name: data.task_name || data.name || "",
        description: data.description || data.content || "",
        status: data.status || "",
        assignee: data.assignee || this.currentUserName,
        due_date: data.due_date || "",
        task_time: data.task_time || data.time || "",
        priority: data.priority || "",
      };
      // Map history notes
      let rawNotes = data.notes || data.note;
      if (typeof rawNotes === "string" && rawNotes.startsWith("[")) {
        try {
          rawNotes = JSON.parse(rawNotes);
        } catch (e) {}
      }
      const items = [];
      if (Array.isArray(rawNotes)) {
        rawNotes.forEach((n) => {
          let location = { address: null, latitude: null, longitude: null };
          try {
            if (n.location) {
              location =
                typeof n.location === "string"
                  ? JSON.parse(n.location)
                  : n.location;
            }
          } catch (e) {}
          items.push({
            type: "note",
            id: n.id,
            timestamp: n.created_at || n.update_at,
            body: n.body || n.notes || n.description || "",
            gps_address: location.address,
            latitude: location.latitude,
            longitude: location.longitude,
            photos: n.photos || [],
          });
        });
      }
      this.historyitems = items.sort(
        (a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0),
      );
    },
    handleReset() {
      this.formData = {
        task_name: "",
        description: "",
        status: "",
        assignee: this.currentUserName,
        due_date: "",
        task_time: "",
        priority: "",
      };
      this.historyitems = [];
      this.tempNoteData = {
        body: "",
        gps_address: null,
        latitude: null,
        longitude: null,
        photos: [],
        audioBlob: null,
      };
      this.editingItemIndex = null;
      this.activeTab = "master";
    },
    handleClose() {
      if (this.isNoteDrawerOpen) return;
      this.handleReset();
      this.$emit("close");
    },
    handleSubmit() {
      if (!this.formData.task_name.trim()) {
        alertService.toastError("Nama task wajib diisi");
        return;
      }
      this.$emit("submit", this.formData);
      this.handleReset();
      this.handleClose();
    },
    openNoteDrawer(editData = null, index = null) {
      if (editData) {
        this.tempNoteData = { ...editData };
        this.editingItemIndex = index;
      } else {
        this.tempNoteData = {
          body: "",
          gps_address: null,
          latitude: null,
          longitude: null,
          photos: [],
          audioBlob: null,
        };
        this.editingItemIndex = null;
      }
      this.isNoteDrawerOpen = true;
    },
    saveNoteFromDrawer() {
      if (!this.tempNoteData.body && this.tempNoteData.photos.length === 0) {
        alertService.toastWarn("Catatan masih kosong");
        return;
      }
      const item = {
        type: "note",
        timestamp: new Date().toISOString(),
        ...this.tempNoteData,
      };
      if (this.editingItemIndex !== null) {
        this.historyitems[this.editingItemIndex] = item;
      } else {
        this.historyitems.unshift(item);
      }
      this.isNoteDrawerOpen = false;
      alertService.toastSuccess("Catatan ditambahkan ke histori");
    },
    handleHistoryEdit({ item, index }) {
      this.openNoteDrawer(item, index);
    },
    handleHistoryDelete(index) {
      this.historyitems.splice(index, 1);
      alertService.toastInfo("Item dihapus dari histori");
    },
    handleEscKey(e) {
      if (e.key === "Escape" && this.isNoteDrawerOpen) {
        this.isNoteDrawerOpen = false;
      }
    },
  },
};
</script>

<style scoped>
/* Transition Animations */
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

/* Remove Browser Autofill Blue Background */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px white inset !important;
  -webkit-text-fill-color: #1c2434 !important;
  transition: background-color 5000s ease-in-out 0s;
}

.rounded-lg {
  border-radius: 0.5rem;
}

select {
  background-image: none !important;
}

input[type="date"]::-webkit-calendar-picker-indicator,
input[type="time"]::-webkit-calendar-picker-indicator {
  opacity: 0;
  position: absolute;
  right: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
</style>
