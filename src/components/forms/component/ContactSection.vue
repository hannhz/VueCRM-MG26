<template>
  <div class="p-6 h-full flex flex-col">
    <!-- BUTTON TAMBAH -->
    <div class="flex items-center gap-3 mb-4">
      <button
        @click="handletambahcontact"
        class="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-outline rounded-xl text-sm font-semibold hover:bg-light-base shadow-sm"
      >
        <Plus :size="18" />
        Tambah Contacts
      </button>
    </div>
    

    <!-- CARD -->
    <div class="border border-outline rounded-lg p-4 flex flex-col flex-1">
      <!-- HEADER -->
      <div class="flex items-center gap-2 mb-3">
        <Users :size="16" class="text-sub-text" />
        <h3 class="text-sm font-semibold">
          Contacts yang terkait dengan company ini
        </h3>
      </div>

      <!-- LIST -->
      <div class="flex-1 overflow-y-auto pr-1">
        <ul v-if="contacts?.length" class="space-y-2">
          <li
            v-for="data in contacts"
            :key="data.id"
            class="px-3 py-2 rounded-lg bg-light-base border border-outline"
          >
            <p class="text-sm font-medium">
              {{ data.first_name }} {{ data.last_name }}
            </p>
            <p class="text-xs text-sub-text">ID: {{ data.id }}</p>
            <p v-if="data.email" class="text-xs text-sub-text">
              {{ data.email }}
            </p>
          </li>
        </ul>

        <div v-else class="text-sm text-sub-text">
          Daftar Contact belum tersedia.
        </div>
      </div>
    </div>

    <!-- MODAL -->
    <div v-if="openModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-[400px] shadow-xl">
        <ContactAssociationForm v-model="form.contactassoc"/>
        
        <!-- <h2 class="text-lg font-semibold mb-4">Tambah Contact</h2>

        <div class="space-y-3">
          <input v-model="form.first_name" placeholder="First Name" class="w-full border rounded px-3 py-2" />
          <input v-model="form.last_name" placeholder="Last Name" class="w-full border rounded px-3 py-2" />
          <input v-model="form.email" placeholder="Email" class="w-full border rounded px-3 py-2" />
        </div> -->

        <div class="flex justify-end gap-2 mt-4">
          <button @click="openModal = false" class="px-4 py-2 border rounded">
            Cancel
          </button>
          <button @click="submit" class="px-4 py-2 bg-blue-600 text-white rounded">
            Save
          </button>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
import { Plus, Users } from "lucide-vue-next";
import {mapActions, mapGetters} from "vuex";
import FormBrowseDialog from "@/components/widgets/FormBrowseDialog.vue";
import FormBrowse from "@/components/widgets/FormBrowse.vue";
import ContactAssociationForm from "../assoc/contacts.vue";

export default {
  name: "ContactSection",

  props: {
    contacts: {
      type: Array,
      default: () => [],
    },
  },

  components: {
    Plus,
    Users,
    FormBrowse,
    ContactAssociationForm,
  },

  emits: ["save"],

  data() {
    return {
      openModal: false,
      form: {
        first_name: "",
        last_name: "",
        email: "",
        contactassoc: [],
      },
    };
  },

  computed: {
    ...mapGetters({ "allContacts": "contacts/allContacts"}),
  },

  methods: {
    ...mapActions({"fetchAllContacts": "contacts/fetchAllContacts"}),

    submit() {
      this.$emit("save", this.form);

      this.openModal = false;

      // reset form
      this.form = {
        first_name: "",
        last_name: "",
        email: "",
      };
    },
    async handletambahcontact() {
      this.openModal = true;

      // console.log("tambah contact");

      // try {
      //   await this.fetchAllContacts();

      //   const selected = await FormBrowseDialog.show({
      //     title: "Pilih Perkiraan",
      //     dataSource: this.allContacts,
      //     keyField: "id",
      //     disablecol:['job_title','statusid', 'telephone_2', 'country', 'province', 'city', 'pos_code', 'source', 'created_at', 'id', 'notes', 'location','taskid', 'task_name', 'desktask', 'statustask', 'assignee', 'due_date', 'prioritytask', 'descdocs', 'pathfile', 'file_source', 'deals', 'contact'],
      //     width: 600,
      //     height: 400,
      //   });

      //   if (selected) {
      //       console.log("Selected contact:", selected);
      //   //   this.formData.Perkiraan = selected;
      //   //   this.mvalid = true;
      //     return "ok";
      //   } else {
      //     return "batal";
      //   }
      // } catch (err) {
      //   return "batal";
      // } finally {
      //   this.isdialogperkiraan = false; // pastikan selalu reset flag
      // }
    },
  },


  watch: {
    contacts(newVal) {
      console.log("Contacts updated:", newVal);
    },


  },

  
};
</script>
