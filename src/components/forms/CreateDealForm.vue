<script>
import { useStore, mapGetters, mapState, mapActions } from "vuex";
import {
  X,
  Plus,
  ChevronDown,
  Paperclip,
  Search,
  Check,
} from "lucide-vue-next";
import AddCompanyForm from "./AddCompanyForm.vue";
import AddContactQuickForm from "./AddContactQuickForm.vue";
import { alertService } from "@/services/alertService";
import ContactAssociationForm from "./assoc/contacts.vue";
import CompaniesAssociationForm from "./assoc/companies.vue";
import NotesSection from "@/components/widgets/NotesEditor.vue";
import DocsSection from "@/components/widgets/DocsEditor.vue";
import TaskSection from "@/components/widgets/TaskEditor.vue";

export default {
  components: {
    X,
    Plus,
    ChevronDown,
    Paperclip,
    Search,
    Check,
    AddCompanyForm,
    AddContactQuickForm,
    ContactAssociationForm,
    CompaniesAssociationForm,
    NotesSection,
    DocsSection,
    TaskSection,
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
    computed: {
      isEditMode() {
        return !!this.initialData;
      },
    },
  },
  emits: ["close", "submit", "back"],
  data() {
    return {
      pipelineOptions: [
        { value: "", label: "Select Data" },
        { value: "prospect", label: "Prospect" },
        { value: "qualified", label: "Qualified" },
        { value: "offer", label: "Offer" },
        { value: "negotiation", label: "Negotiation" },
        { value: "closed_won", label: "Closed Won" },
        { value: "closed_lost", label: "Closed Lost" },
        { value: "closed_cancel", label: "Closed Cancel" },
      ],
      currencyOptions: [
        { value: "IDR", label: "IDR" },
        { value: "USD", label: "USD" },
        { value: "SGD", label: "SGD" },
        { value: "EUR", label: "EUR" },
      ],
      priorityOptions: [
        { value: "", label: "Select Data" },
        { value: "low", label: "Low" },
        { value: "medium", label: "Medium" },
        { value: "high", label: "High" },
      ],
      sourceOptions: [
        { value: "", label: "Select Data" },
        { value: "website", label: "Website" },
        { value: "referral", label: "Referral" },
        { value: "social_media", label: "Social Media" },
        { value: "email_campaign", label: "Email Campaign" },
        { value: "cold_call", label: "Cold Call" },
        { value: "other", label: "Other" },
      ],
      docSourceOptions: [
        { value: "", label: "Select File Source" },
        { value: "local", label: "Local File" },
        { value: "google_drive", label: "Google Drive" },
        { value: "dropbox", label: "Dropbox" },
        { value: "onedrive", label: "OneDrive" },
      ],
      customSource: "",
      dealNameInput: null,
      showOptional: false,
      showAddCompanyForm: false,
      showAddContactQuickForm: false,
      isSavingBeforeDetail: false,
      contactSearch: "",
      companySearch: "",
      isContactDropdownOpen: false,
      isCompanyDropdownOpen: false,
      selectedDocSource: "",
      isDocDropdownOpen: false,
      formData: {
        dealName: "",
        pipeline: "",
        currency: "IDR",
        amount: "",
        expectedCloseDate: "",
        owner: "",
        priority: "",
        source: "",
        description: "",
        documents: null,
        contactassoc: [],
        companyassoc: [],
        task: {
          name: "",
          content: "",
          dueDate: "",
          time: "",
          status: "",
          priority: "",
        },
        //docs: [],
        docs: {
          description: "",
          fileSource: "",
          files: [],
        },
        noteData: {
          body: "",
          gps_address: null,
          latitude: null,
          longitude: null,
          photos: [], // [{ id, src (base64), file (File object) }]
          audioBlob: null, // Blob audio
        },
      },
      activeTab: "master",
      noteContent: "",
      statusOptions: [
        { value: "", label: "Select Data" },
        { value: "todo", label: "To Do" },
        { value: "in_progress", label: "In Progress" },
        { value: "completed", label: "Completed" },
      ],
    };
  },
  computed: {
    ...mapGetters("users", ["usersignin"]),
    ...mapGetters("contacts", ["allContacts"]),
    ...mapGetters("company", ["allcompany"]),
    ...mapState("auth", { authUser: "user" }),
    currentUserName() {
      const signedInUser = this.usersignin || this.authUser || null;
      const fullName = [
        signedInUser?.first_name || signedInUser?.firstname,
        signedInUser?.last_name || signedInUser?.lastname,
      ]
        .filter(Boolean)
        .join(" ")
        .trim();

      return signedInUser?.name || signedInUser?.username || fullName || "";
    },
    isEditMode() {
      return !!(this.initialData && Object.keys(this.initialData).length);
    },
  },
  watch: {
    isOpen: {
      immediate: true,
      handler(isOpen) {
        if (isOpen) {
          if (this.initialData) {
            this.setFormData(this.initialData);
            this.activeTab = "master";
          } else {
            this.handleReset();
            this.activeTab = "master";
          }
        }
      },
    },
    initialData: {
      deep: true,
      handler(nextData) {
        // Tangani kasus data detail datang belakangan saat drawer sudah terbuka.
        if (!this.isOpen) return;

        if (nextData && Object.keys(nextData).length) {
          this.setFormData(nextData);
          this.activeTab = "master";
        } else {
          this.handleReset();
          this.activeTab = "master";
        }
      },
    },
  },
  mounted() {
    this.applyDefaultOwner();
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handleClickOutside);
  },
  methods: {
    ...mapActions({ createDeal: "deals/createDeal" }),

    // Parse JSON safely untuk handle associasi dari database
    parseJSON(val, defaultVal) {
      try {
        if (!val) return defaultVal;
        if (typeof val === "object") return val;
        return JSON.parse(val);
      } catch {
        return defaultVal;
      }
    },

    // Helper untuk mengekstrak array of IDs dari association array of objects
    extractIdsFromAssoc(assocArray) {
      if (!Array.isArray(assocArray)) return [];
      return assocArray
        .map((item) => {
          if (item && typeof item === "object") return item.id;
          return item;
        })
        .filter((item) => item !== undefined && item !== null && item !== "");
    },

    normalizeAssocInput(value) {
      if (!value) return [];
      if (Array.isArray(value)) return value;
      if (typeof value === "string") {
        const parsed = this.parseJSON(value, null);
        if (Array.isArray(parsed)) return parsed;

        return value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
          .map((item) => {
            const maybeNumber = Number(item);
            return Number.isFinite(maybeNumber) ? maybeNumber : item;
          });
      }
      return [];
    },

    resolveTaskData(dealData) {
      const parsedTask = this.parseJSON(dealData?.task_json, null);
      const taskObj =
        parsedTask && typeof parsedTask === "object" ? parsedTask : {};

      return {
        name: dealData?.task_name || taskObj.name || taskObj.title || "",
        content: dealData?.desktask || taskObj.content || "",
        dueDate: dealData?.due_date || taskObj.dueDate || "",
        time: dealData?.task_time || taskObj.time || "",
        status: dealData?.statustask || taskObj.status || "",
        priority: dealData?.prioritytask || taskObj.priority || "",
      };
    },

    resolveDocsData(dealData) {
      const parsedDocs = this.parseJSON(dealData?.docs, null);
      const docsObject =
        parsedDocs && typeof parsedDocs === "object" ? parsedDocs : null;

      const rawFiles = Array.isArray(docsObject?.files)
        ? docsObject.files
        : Array.isArray(dealData?.docs?.files)
          ? dealData.docs.files
          : [];

      const normalizedFiles = rawFiles
        .map((file) => {
          if (!file) return null;

          if (typeof file === "string") {
            return file;
          }

          if (typeof File !== "undefined" && file instanceof File) {
            return file;
          }

          if (typeof Blob !== "undefined" && file instanceof Blob) {
            return file;
          }

          if (typeof file === "object") {
            return {
              ...file,
              name:
                file.name || file.filename || file.original_name || "document",
              url: file.url || file.path || file.src || "",
            };
          }

          return null;
        })
        .filter(Boolean);

      const description =
        docsObject?.description ||
        dealData?.docs?.description ||
        dealData?.docs ||
        dealData?.doc ||
        "";

      const fileSource =
        docsObject?.fileSource ||
        dealData?.docs?.fileSource ||
        (normalizedFiles.length > 0 ? "local" : "");

      return {
        description,
        fileSource,
        files: normalizedFiles,
      };
    },

    resolveInitialDealId() {
      const root = this.initialData || {};
      const nestedDeal =
        Array.isArray(root.deals) && root.deals.length > 0
          ? root.deals[0]
          : null;

      return nestedDeal?.id || root?.id || root?.deal_id || null;
    },

    setFormData(data) {
      // Cek apakah data memiliki properti 'deals' (response dari fetchById)
      let dealData = data;
      let companiesAssoc = [];
      let contactsAssoc = [];

      if (data?.deals && Array.isArray(data.deals) && data.deals.length > 0) {
        dealData = data.deals[0];
        companiesAssoc =
          data.companiesassoc ||
          data.companyassoc ||
          dealData.companyassoc ||
          [];
        contactsAssoc = data.contactassoc || dealData.contactassoc || [];
      } else {
        // Fallback: mungkin data langsung object deal
        companiesAssoc = data.companyassoc || data.companiesassoc || [];
        contactsAssoc = data.contactassoc || [];
      }

      const normalizedCompaniesAssoc = this.normalizeAssocInput(companiesAssoc);
      const normalizedContactsAssoc = this.normalizeAssocInput(contactsAssoc);

      // Isi formData
      this.formData = {
        dealName: dealData.deal_name || dealData.dealName || "",
        pipeline: this.normalizePipelineValue(
          dealData.pipeline || dealData.stage || "",
        ),
        currency: dealData.currency || "IDR",
        amount: dealData.amount_value || dealData.amount || "",
        expectedCloseDate:
          dealData.expected_close_date || dealData.expectedCloseDate || "",
        owner: dealData.owner || "",
        priority: dealData.priority || "",
        source: this.normalizeSourceValue(dealData.source || ""),
        description: dealData.description || "",
        documents: null,
        // Ubah array of objects menjadi array of IDs
        companyassoc: this.extractIdsFromAssoc(normalizedCompaniesAssoc),
        contactassoc: this.extractIdsFromAssoc(normalizedContactsAssoc),
        task: this.resolveTaskData(dealData),
        docs: this.resolveDocsData(dealData),
        noteData: {
          body: dealData.note || dealData.notes || "",
          gps_address: null,
          latitude: null,
          longitude: null,
          photos: [],
          audioBlob: null,
        },
      };

      // Reset UI state
      this.showOptional = !!(
        this.formData.description || this.formData.docs.description
      );
      this.selectedDocSource = this.formData.docs.fileSource || "";
      this.customSource = "";
    },

    normalizePipelineValue(value) {
      const raw = String(value || "")
        .toLowerCase()
        .trim();

      if (!raw) return "";
      if (raw === "prospect" || raw === "new") return "prospect";
      if (raw.includes("qual")) return "qualified";
      if (
        raw.includes("offer") ||
        raw.includes("proposal") ||
        raw === "payment"
      )
        return "offer";
      if (
        raw.includes("negotia") ||
        raw.includes("negotiatio") ||
        raw.includes("negot")
      )
        return "negotiation";
      if (raw.includes("closed_won") || raw.includes("won"))
        return "closed_won";
      if (
        raw.includes("closed_lost") ||
        raw.includes("lost") ||
        raw === "closed_los"
      )
        return "closed_lost";
      if (
        raw.includes("closed_cancel") ||
        raw.includes("cancel") ||
        raw === "closed_can"
      )
        return "closed_cancel";

      return value;
    },

    normalizeSourceValue(value) {
      const raw = String(value || "")
        .toLowerCase()
        .trim();

      if (!raw) return "";

      const compact = raw.replace(/[\s-]+/g, "_");
      const aliases = {
        website: "website",
        referral: "referral",
        social_media: "social_media",
        socialmedia: "social_media",
        "social media": "social_media",
        email_campaign: "email_campaign",
        email_camp: "email_campaign",
        emailcampaign: "email_campaign",
        "email campaign": "email_campaign",
        cold_call: "cold_call",
        coldcall: "cold_call",
        "cold call": "cold_call",
        other: "other",
      };

      return aliases[raw] || aliases[compact] || compact;
    },

    // Prefill form data dari database (untuk edit mode)

    applyDefaultOwner() {
      if (!this.formData.owner && this.currentUserName) {
        this.formData.owner = this.currentUserName;
      }
    },
    isUploadableFile(file) {
      if (!file) return false;

      if (typeof File !== "undefined" && file instanceof File) return true;
      if (typeof Blob !== "undefined" && file instanceof Blob) return true;

      return false;
    },
    isAllowedLocalDocument(file) {
      const name = String(file?.name || "").toLowerCase();
      const type = String(file?.type || "").toLowerCase();

      return (
        name.endsWith(".pdf") ||
        name.endsWith(".doc") ||
        name.endsWith(".docx") ||
        name.endsWith(".xls") ||
        name.endsWith(".xlsx") ||
        name.endsWith(".jpg") ||
        name.endsWith(".jpeg") ||
        name.endsWith(".png") ||
        type === "application/pdf" ||
        type === "application/msword" ||
        type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        type === "application/vnd.ms-excel" ||
        type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        type === "image/jpeg" ||
        type === "image/png"
      );
    },
    getLocalUploadFiles() {
      return Array.isArray(this.formData.docs?.files)
        ? this.formData.docs.files.filter((file) => this.isUploadableFile(file))
        : [];
    },
    getLocalUploadLabel(file) {
      return file?.name || "document";
    },
    formatLocalUploadSize(file) {
      const size = Number(file?.size || 0);
      if (!size) return "";

      const units = ["B", "KB", "MB", "GB"];
      let value = size;
      let unitIndex = 0;

      while (value >= 1024 && unitIndex < units.length - 1) {
        value /= 1024;
        unitIndex += 1;
      }

      return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
    },
    mergeUniqueFiles(primaryFiles = [], extraFiles = []) {
      const merged = [...primaryFiles];

      extraFiles.forEach((file) => {
        if (!merged.some((existing) => existing === file)) {
          merged.push(file);
        }
      });

      return merged;
    },
    selectDocSource(value) {
      this.selectedDocSource = value;
      this.isDocDropdownOpen = false;
      if (value !== "local") {
        this.formData.documents = null;
        if (this.formData.docs && Array.isArray(this.formData.docs.files)) {
          this.formData.docs.files = [];
        }
      }
    },
    handleFileChange(e) {
      const selectedFiles = Array.from(e.target.files || []);
      const validFiles = selectedFiles.filter((file) => {
        if (!this.isAllowedLocalDocument(file)) {
          return false;
        }
        return true;
      });

      if (!validFiles.length) {
        this.$nextTick(() => {
          e.target.value = "";
        });
        return;
      }

      if (!this.formData.docs || typeof this.formData.docs !== "object") {
        this.formData.docs = {
          description: "",
          fileSource: "local",
          files: [],
        };
      }

      const existingFiles = this.getLocalUploadFiles();
      const mergedFiles = this.mergeUniqueFiles(existingFiles, validFiles);

      this.formData.docs.fileSource = "local";
      this.formData.docs.files = mergedFiles;
      this.formData.documents = mergedFiles[0] || null;

      this.$nextTick(() => {
        e.target.value = "";
      });
    },
    removeLocalUploadFile(index) {
      const localFiles = this.getLocalUploadFiles();
      const targetFile = localFiles[index];

      if (!targetFile || !Array.isArray(this.formData.docs?.files)) {
        return;
      }

      this.formData.docs.files = this.formData.docs.files.filter(
        (file) => file !== targetFile,
      );

      const remaining = this.getLocalUploadFiles();
      this.formData.documents = remaining[0] || null;
    },
    handleClose() {
      // Reset semua state sebelum close
      this.handleReset();
      this.activeTab = "master";
      this.$emit("close");
    },
    async handleSubmit() {
      // Validation
      if (!this.formData.dealName?.trim()) {
        await alertService.toastError("Deal Name wajib diisi.");
        return;
      }
      if (!this.formData.pipeline) {
        await alertService.toastError("Pipeline/Stage wajib diisi.");
        return;
      }
      if (!this.formData.amount && this.formData.amount !== 0) {
        await alertService.toastError("Amount wajib diisi.");
        return;
      }

      this.isSavingBeforeDetail = true;

      try {
        // SELALU kirim task values, jangan null - backend SP akan filter kalau kosong
        const normalizedTask = {
          name: this.formData.task?.name || "",
          content: this.formData.task?.content || "",
          status: this.formData.task?.status || "",
          priority: this.formData.task?.priority || "",
          dueDate: this.formData.task?.dueDate || "",
          time: this.formData.task?.time || "",
          task_name: this.formData.task?.name || "",
          desktask: this.formData.task?.content || "",
          statustask: this.formData.task?.status || "",
          prioritytask: this.formData.task?.priority || "",
          due_date: this.formData.task?.dueDate || "",
          task_time: this.formData.task?.time || "",
        };

        const docsFiles = Array.isArray(this.formData.docs?.files)
          ? this.formData.docs.files
          : [];

        const masterDocsFile = this.isUploadableFile(this.formData.documents)
          ? [this.formData.documents]
          : [];

        const mergedDocsFiles = this.mergeUniqueFiles(
          docsFiles,
          masterDocsFile,
        );

        const primaryDocument =
          this.formData.documents || mergedDocsFiles[0] || null;

        const submissionData = {
          dealName: this.formData.dealName,
          deal_name: this.formData.dealName,
          pipeline: this.formData.pipeline,
          stage: this.formData.pipeline,
          currency: this.formData.currency,
          amount: this.formData.amount,
          expectedCloseDate: this.formData.expectedCloseDate,
          expected_close_date: this.formData.expectedCloseDate,
          owner: this.formData.owner || this.currentUserName || "",
          priority: this.formData.priority,
          source: this.formData.source,
          description: this.formData.description,
          contactassoc: this.formData.contactassoc || [],
          companyassoc: this.formData.companyassoc || [],
          // SELALU kirim notes dan task (SP akan ignore kalau kosong)
          note: this.formData.noteData?.body || "",
          notes: this.formData.noteData?.body || "",
          noteData: { ...this.formData.noteData },
          task: normalizedTask, // Always send task object now
          task_name: normalizedTask.name || "",
          desktask: normalizedTask.content || "",
          due_date: normalizedTask.dueDate || "",
          task_time: normalizedTask.time || "",
          statustask: normalizedTask.status || "",
          prioritytask: normalizedTask.priority || "",
          documents: primaryDocument,
          // Docs conditional - only send if has content
          docs:
            (this.formData.docs?.description || "").trim() !== "" ||
            mergedDocsFiles.length > 0 ||
            masterDocsFile.length > 0
              ? {
                  description: this.formData.docs?.description || "",
                  fileSource: this.formData.docs?.fileSource || "",
                  files: mergedDocsFiles,
                }
              : null,
          doc: this.formData.docs?.description || "",
        };

        if (this.isEditMode) {
          const dealId = this.resolveInitialDealId();
          if (!dealId) {
            await alertService.toastError(
              "ID deal tidak ditemukan. Silakan tutup lalu buka lagi detail deal.",
            );
            return;
          }

          submissionData.choice = "u";
          submissionData.id = dealId;
          submissionData.id_deals = dealId;
        } else {
          submissionData.choice = "i";
        }

        const response = await this.createDeal(submissionData);

        if (response?.msg === "gagal") {
          await alertService.error(
            "Server returned 'gagal'. Please check the payload or choice parameter.",
          );
          return;
        }

        if (response?.success === false) {
          await alertService.error(response?.message || "Gagal menyimpan deal");
          return;
        }

        // VERIFY: Cek apakah data benar-benar tersimpan dengan fetch detail
        let dealId = null;
        if (this.isEditMode) {
          dealId = this.resolveInitialDealId();
        }

        if (dealId) {
          try {
            const verifyResponse = await this.$store.dispatch(
              "deals/fetchDealById",
              dealId,
            );
            if (!verifyResponse?.deals?.length) {
              throw new Error("Data tidak tersimpan");
            }
          } catch (verifyError) {
            console.error("Verification error:", verifyError);
            await alertService.error(
              "Peringatan: Ada error saat verifikasi. Mohon refresh dan cek.",
            );
            return;
          }
        }

        await alertService.toastSuccess(
          response?.msg || "Deal berhasil disimpan",
        );
        this.handleReset();
        this.$emit("submit", response);
        this.handleClose();
      } catch (error) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Gagal menyimpan deal";
        await alertService.toastError(message);
      } finally {
        this.isSavingBeforeDetail = false;
      }
    },
    toggleContactDropdown() {
      this.isContactDropdownOpen = !this.isContactDropdownOpen;
    },
    toggleCompanyDropdown() {
      this.isCompanyDropdownOpen = !this.isCompanyDropdownOpen;
    },
    filterContacts() {
      this.isContactDropdownOpen = true;
    },
    filterCompanies() {
      this.isCompanyDropdownOpen = true;
    },
    toggleContact(contact) {
      const index = this.formData.contactassoc.indexOf(contact.id);
      if (index === -1) {
        this.formData.contactassoc.push(contact.id);
      } else {
        this.formData.contactassoc.splice(index, 1);
      }
    },
    isContactSelected(id) {
      return this.formData.contactassoc.includes(id);
    },
    toggleCompany(company) {
      const index = this.formData.companyassoc.indexOf(company.id);
      if (index === -1) {
        this.formData.companyassoc.push(company.id);
      } else {
        this.formData.companyassoc.splice(index, 1);
      }
    },
    isCompanySelected(id) {
      return this.formData.companyassoc.includes(id);
    },
    handleClickOutside(e) {
      if (!e.target.closest("[data-contacts-dropdown]")) {
        this.isContactDropdownOpen = false;
      }
      if (!e.target.closest("[data-companies-dropdown]")) {
        this.isCompanyDropdownOpen = false;
      }
    },
    async handleDetailSubmit(detailPayload) {
      if (this.isSavingBeforeDetail) {
        return;
      }

      this.isSavingBeforeDetail = true;

      try {
        const hasTaskContent =
          !!this.formData.task &&
          [
            this.formData.task.name,
            this.formData.task.content,
            this.formData.task.dueDate,
            this.formData.task.time,
            this.formData.task.status,
            this.formData.task.priority,
          ].some((value) => String(value || "").trim() !== "");

        const hasDocsContent =
          (this.formData.docs.description &&
            this.formData.docs.description.trim() !== "") ||
          (Array.isArray(this.formData.docs.files) &&
            this.formData.docs.files.length > 0);

        const detailDocsFiles = Array.isArray(this.formData.docs?.files)
          ? this.formData.docs.files
          : [];

        const primaryDocument =
          this.formData.documents || detailDocsFiles[0] || null;

        const submissionData = {
          ...this.formData,
          owner: this.formData.owner || this.currentUserName || "",
          contactassoc: (this.formData.contactassoc || []).join(","),
          companyassoc: (this.formData.companyassoc || []).join(","),
          // Include Notes, Tasks, and Docs
          notes: this.formData.noteData?.body || "",
          task: hasTaskContent ? this.formData.task : null,
          documents: primaryDocument,
          docs: hasDocsContent ? this.formData.docs : null,
        };

        console.log("🔍 DEBUG: Notes, Task, Docs Before Save");
        console.log("  noteData:", this.formData.noteData);
        console.log("  task:", this.formData.task);
        console.log("  docs:", this.formData.docs);
        console.log("📤 Submitting Deal Payload:", {
          notes: submissionData.notes,
          task: submissionData.task,
          docs: submissionData.docs,
        });

        const response = await this.$store.dispatch(
          "deals/createDeal",
          submissionData,
        );

        if (response?.msg === "gagal") {
          await alertService.error(
            "Server returned 'gagal'. Please check the payload or choice parameter.",
          );
          return;
        }

        if (response?.success === false) {
          await alertService.error(response?.message || "Failed to save deal");
          return;
        }

        await alertService.toastSuccess(
          response?.msg || "Deal saved successfully",
        );
        this.handleReset();
        this.$emit("submit", response);
        this.handleClose();
      } catch (error) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Gagal menyimpan deal";
        await alertService.toastError(message);
      } finally {
        this.isSavingBeforeDetail = false;
      }
    },

    handleReset() {
      this.formData = {
        dealName: "",
        pipeline: "",
        currency: "IDR",
        amount: "",
        expectedCloseDate: "",
        owner: this.currentUserName || "",
        priority: "",
        source: "",
        description: "",
        documents: null,
        contactassoc: [],
        companyassoc: [],
        task: {
          name: "",
          content: "",
          dueDate: "",
          time: "",
          status: "",
          priority: "",
        },
        docs: {
          description: "",
          fileSource: "",
          files: [],
        },
        noteData: {
          body: "",
          gps_address: null,
          latitude: null,
          longitude: null,
          photos: [],
          audioBlob: null,
        },
      };

      // Reset UI state
      this.contactSearch = "";
      this.companySearch = "";
      this.showOptional = false;
      this.selectedDocSource = "";
      this.customSource = "";
      this.isContactDropdownOpen = false;
      this.isCompanyDropdownOpen = false;
      this.isDocDropdownOpen = false;
      this.activeTab = "master";
    },
  },
};
</script>

<template>
  <!-- Overlay Background -->
  <transition name="overlay">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-sub-text/80 z-40 transition-all duration-300"
      @click="handleClose"
    ></div>
  </transition>

  <!-- Form Slide Panel -->
  <transition name="slide">
    <div
      v-if="isOpen"
      class="fixed top-0 right-0 h-screen w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col"
      @click.stop
    >
      <!-- Header -->
      <div
        class="sticky top-0 bg-white border-b border-outline px-6 py-4 flex items-center justify-between z-10 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]"
      >
        <h2 class="text-xl font-bold text-dark-base">
          {{ isEditMode ? "Edit Deal" : "Create Deal" }}
        </h2>
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

        <!-- <button
          type="button"
          @click="activeTab = 'detail'"
          :class="[
            'px-4 py-2 text-sm font-medium border-b-2 transition',
            activeTab === 'detail'
              ? 'border-dark-base text-dark-base'
              : 'border-transparent text-sub-text hover:text-dark-base',
          ]"
        >
          Detail
        </button> -->
      </div>

      <!-- Form Content (Scrollable) -->
      <div class="flex-1 overflow-y-auto min-h-0">
        <form
          v-if="activeTab === 'master'"
          @submit.prevent="handleSubmit"
          class="p-6 space-y-6"
        >
          <!-- Deal Name & Pipeline -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2"
                >Deal Name <span class="text-red-600">*</span>
              </label>
              <input
                ref="dealNameInput"
                v-model="formData.dealName"
                type="text"
                placeholder="Deal's Name"
                class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2">
                Pipeline/Stage <span class="text-red-600">*</span>
              </label>
              <div class="relative">
                <select
                  v-model="formData.pipeline"
                  class="w-full px-3 py-2 pr-10 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm text-dark-base bg-white appearance-none cursor-pointer"
                >
                  <option
                    v-for="opt in pipelineOptions"
                    :key="opt.value"
                    :value="opt.value"
                  >
                    {{ opt.label }}
                  </option>
                </select>
                <ChevronDown
                  :size="16"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-sub-text pointer-events-none"
                />
              </div>
            </div>
          </div>

          <!-- Currency & Amount/Value -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2"
                >Currency</label
              >
              <div class="relative">
                <select
                  v-model="formData.currency"
                  class="w-full px-3 py-2 pr-10 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm text-dark-base bg-white appearance-none cursor-pointer"
                >
                  <option
                    v-for="opt in currencyOptions"
                    :key="opt.value"
                    :value="opt.value"
                  >
                    {{ opt.label }}
                  </option>
                </select>
                <ChevronDown
                  :size="16"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-sub-text pointer-events-none"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2">
                Amount / Value <span class="text-red-600">*</span>
              </label>
              <input
                v-model="formData.amount"
                type="number"
                placeholder="Amount/Value"
                class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
              />
            </div>
          </div>

          <!-- Expected Close Date -->
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2"
                >Expected Close Date</label
              >
              <input
                v-model="formData.expectedCloseDate"
                type="date"
                placeholder="Close Date"
                class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm text-dark-base"
              />
            </div>
          </div>

          <!-- Priority & Source -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2"
                >Priority</label
              >
              <div class="relative">
                <select
                  v-model="formData.priority"
                  class="w-full px-3 py-2 pr-10 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm text-dark-base bg-white appearance-none cursor-pointer"
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
                  :size="16"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-sub-text pointer-events-none"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2"
                >Source</label
              >
              <div class="space-y-2">
                <div class="relative">
                  <select
                    v-model="formData.source"
                    class="w-full px-3 py-2 pr-10 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm text-dark-base bg-white appearance-none cursor-pointer"
                  >
                    <option
                      v-for="opt in sourceOptions"
                      :key="opt.value"
                      :value="opt.value"
                    >
                      {{ opt.label }}
                    </option>
                  </select>
                  <ChevronDown
                    :size="16"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-sub-text pointer-events-none"
                  />
                </div>
                <!-- Custom Source Input -->
                <transition name="expand">
                  <div v-if="formData.source === 'other'" class="mt-2">
                    <input
                      v-model="customSource"
                      type="text"
                      placeholder="Specify source..."
                      class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
                      @input="formData.source_other = customSource"
                    />
                  </div>
                </transition>
              </div>
            </div>
          </div>

          <!-- Description & Document (Optional) - collapsible -->
          <div class="border border-outline rounded-lg">
            <label
              class="flex items-center gap-3 px-4 py-3 cursor-pointer select-none hover:bg-light-base transition-colors"
            >
              <input
                type="checkbox"
                v-model="showOptional"
                class="w-4 h-4 rounded border-outline accent-dark-base cursor-pointer"
              />
              <span class="text-sm font-medium text-sub-text"
                >Description &amp; Document
                <span class="text-sub-text/60">(Opsional)</span></span
              >
            </label>

            <transition name="expand">
              <div
                v-if="showOptional"
                class="border-t border-outline px-4 py-4 space-y-4"
              >
                <!-- Description -->
                <div>
                  <label class="block text-sm font-medium text-dark-base mb-2"
                    >Description</label
                  >
                  <textarea
                    v-model="formData.description"
                    placeholder="Ex Lorem ipsum dolor sit"
                    rows="3"
                    class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm resize-none"
                  ></textarea>
                </div>

                <!-- Documents -->
                <div>
                  <label class="block text-sm font-medium text-dark-base mb-2"
                    >Documents</label
                  >

                  <!-- Source Dropdown -->
                  <div class="relative">
                    <button
                      type="button"
                      @click="isDocDropdownOpen = !isDocDropdownOpen"
                      class="w-full flex items-center justify-between px-3 py-2 border border-outline rounded-lg text-sm bg-white cursor-pointer"
                      :class="
                        selectedDocSource ? 'text-dark-base' : 'text-sub-text'
                      "
                    >
                      <span>{{
                        docSourceOptions.find(
                          (o) => o.value === selectedDocSource,
                        )?.label || "Select File Source"
                      }}</span>
                      <ChevronDown
                        :size="16"
                        class="text-sub-text transition-transform"
                        :class="{ 'rotate-180': isDocDropdownOpen }"
                      />
                    </button>

                    <!-- Dropdown Menu -->
                    <div
                      v-if="isDocDropdownOpen"
                      class="absolute left-0 right-0 mt-1 bg-white border border-outline rounded-lg shadow-lg z-30"
                    >
                      <ul class="py-1">
                        <li
                          v-for="opt in docSourceOptions.filter(
                            (o) => o.value !== '',
                          )"
                          :key="opt.value"
                          @click="selectDocSource(opt.value)"
                          class="px-4 py-2 text-sm hover:bg-light-base cursor-pointer"
                          :class="
                            selectedDocSource === opt.value
                              ? 'text-dark-base font-medium'
                              : 'text-sub-text'
                          "
                        >
                          {{ opt.label }}
                        </li>
                      </ul>
                    </div>
                  </div>

                  <!-- Upload Area — muncul jika pilih Local File -->
                  <transition name="expand">
                    <div v-if="selectedDocSource === 'local'" class="mt-2">
                      <label class="relative block cursor-pointer">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                          multiple
                          class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          @change="handleFileChange"
                        />
                        <div
                          class="w-full flex flex-col items-center justify-center gap-2 px-4 py-6 border-2 border-dashed border-outline rounded-lg text-sm bg-light-base hover:bg-outline/10 transition-colors"
                        >
                          <!-- Upload Icon -->
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-7 h-7 text-sub-text"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="1.5"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12V4m0 0L8 8m4-4l4 4"
                            />
                          </svg>
                          <span
                            v-if="!getLocalUploadFiles().length"
                            class="text-sub-text font-medium"
                            >Klik untuk pilih file</span
                          >
                          <span v-else class="text-dark-base font-medium">
                            {{ getLocalUploadFiles().length }} file dipilih
                          </span>
                          <span class="text-xs text-sub-text/70"
                            >PDF, DOC, XLS, JPG, PNG</span
                          >
                        </div>
                      </label>

                      <ul
                        v-if="getLocalUploadFiles().length"
                        class="mt-2 space-y-1"
                      >
                        <li
                          v-for="(file, i) in getLocalUploadFiles()"
                          :key="`${file.name}-${file.lastModified || i}`"
                          class="flex items-center justify-between text-xs px-3 py-1.5 bg-light-base rounded-lg"
                        >
                          <div class="min-w-0">
                            <p class="truncate text-dark-base">
                              {{ getLocalUploadLabel(file) }}
                            </p>
                            <p class="text-[10px] text-sub-text">
                              {{ formatLocalUploadSize(file) }}
                            </p>
                          </div>
                          <button
                            type="button"
                            @click="removeLocalUploadFile(i)"
                            class="ml-2 text-sub-text hover:text-red-500 shrink-0"
                          >
                            ✕
                          </button>
                        </li>
                      </ul>
                    </div>
                  </transition>
                </div>
              </div>
            </transition>
          </div>

          <!-- Contact Association -->
          <ContactAssociationForm
            v-model="formData.contactassoc"
            :contacts="allContacts"
          />

          <!-- Companies Association -->
          <CompaniesAssociationForm
            :companies="allcompany"
            v-model="formData.companyassoc"
          />
          <!-- <button
              type="button"
              @click="showAddCompanyForm = true"
              class="mt-2 text-sm text-sub-text hover:text-dark-base font-medium flex items-center gap-1"
            >
              <Plus :size="16" />
              Create Company
            </button> -->
        </form>
        <!-- Detail Tab -->
        <div v-if="activeTab === 'detail'" class="p-6 space-y-6">
          <div class="flex-1 overflow-y-auto min-h-0">
            <NotesSection v-model:note-data="formData.noteData" />
            <TaskSection
              v-model="formData.task"
              :statusOptions="statusOptions"
              :priorityOptions="priorityOptions"
            />
            <DocsSection v-model="formData.docs" />
          </div>
        </div>
      </div>

      <!-- Footer Actions (Sticky) -->
      <div
        class="bg-white flex items-center justify-between px-6 py-4 border-t border-outline shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]"
      >
        <button
          type="button"
          @click="handleReset"
          class="text-sm text-red font-medium hover:underline"
        >
          Reset
        </button>
        <div class="flex gap-3">
          <button
            type="button"
            @click="handleClose"
            class="px-6 py-2 border border-outline rounded-lg text-sub-text hover:bg-light-base transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="handleSubmit"
            :disabled="isSavingBeforeDetail"
            class="px-6 py-2 bg-dark-base text-white rounded-lg hover:bg-dark-hover transition-colors text-sm font-medium"
            :class="{ 'opacity-60 cursor-not-allowed': isSavingBeforeDetail }"
          >
            {{ isSavingBeforeDetail ? "Saving..." : "Save" }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
/* Overlay Animation */
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

/* Slide Animation */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-enter-from {
  transform: translateX(100%);
}
.slide-leave-to {
  transform: translateX(100%);
}

/* Expand Animation for optional section */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}
.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 400px;
}

/* Remove Browser Autofill Blue Background */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:active,
select:-webkit-autofill,
select:-webkit-autofill:hover,
select:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px white inset !important;
  -webkit-text-fill-color: #1c2434 !important;
  transition: background-color 5000s ease-in-out 0s;
}

input:-webkit-autofill:focus,
select:-webkit-autofill:focus {
  -webkit-box-shadow:
    0 0 0 30px white inset,
    0 0 0 1px #64728b !important;
  -webkit-text-fill-color: #1c2434 !important;
}

/* Hide number input spin buttons */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  appearance: textfield;
  -moz-appearance: textfield;
}
</style>
