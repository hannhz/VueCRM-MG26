<template>
  <div class="formbrows-container formbrowse-global">
    <div class="form-field">
      <div class="input-group">
        <DxTextBox
          ref="textBoxRef"
          v-model:value="valtext"
          :label="label"
          mode="text"
          label-mode="floating"
          :width="width"
          :height="height"
          :read-only="false"
          :show-clear-button="false"
          @input="handletextboxonchange"
          @focus-in="handlefocusin"
          @focus-out="handleFocusOut"
          @key-down="handleTextBoxKeyDown"
          :buttons="[
            {
              name: 'browse',
              location: 'after',
              options: {
                text: '...',
                stylingMode: 'text',
                onClick: handleEnterKey,
              },
            },
          ]"
        />
        <p
          v-if="selectedItem && selectedItem.ket"
          class="text-sm text-black ml-2"
        >
          {{ selectedItem.ket }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { DxTextBox } from "devextreme-vue/text-box";
// import FormBrowseDialog from "@/components/FormBrowseDialog.vue";

export default {
  name: "FormBrowse",
  components: { DxTextBox },
  props: {
    label: { type: String, default: "Pilih Data" },
    dataSource: { type: Array, default: () => [] },
    keyField: { type: String, default: "id" },
    displayField: { type: String, default: "ket" },
    width: { type: Number, default: 300 },
    height: { type: Number, default: 40 },
    modelValue: { type: Object, default: null },
    dialogTitle: { type: String, default: "" },
  },
  emits: [
    "modelValue",
    "valuechange",
    "keydown",
    "focus-out",
    "focus-in",
    "enterkey",
  ],
  data() {
    return {
      selectedItem: this.modelValue,
      valtext: "",
    };
  },

  computed: {
    displayText() {
      this.valtext = this.selectedItem[this.keyField];
      return this.selectedItem
        ? this.selectedItem[this.displayField] || ""
        : "";
    },
  },

  watch: {
    // modelValue(val) {
    //   console.log(val);
    //   this.selectedItem = val;
    //   this.valtext = val.id;
    // },

    modelValue: {
      handler(newVal) {
        if (newVal && Object.keys(newVal).length > 0) {
          this.selectedItem = newVal;
          this.valtext = newVal.id;
          this.$emit("valtext", this.valtext);
          console.log("Ada data baru:", newVal);
        } else {
          console.log("Data kosong");
        }
      },
      immediate: true, // jalan langsung saat komponen mount
      deep: true, // kalau objeknya dalam
    },
    valtext() {
      this.$emit("valtext", this.valtext);
    },
    selectedItem(e) {
      console.log(e);
    },
  },

  methods: {
    handleEnterKey(e) {
      this.$emit("enterkey", e);
    },
    handletextboxonchange(e) {
      //  console.log('Realtime input:', e.event?.target?.value);
      this.valtext = e.event?.target?.value || "";
    },

    handlefocusin(e) {
      this.$emit("focus-in", e);
    },

    handleFocusOut(e) {
      this.$emit("focus-out", e);
    },

    handleTextBoxKeyDown(e) {
      this.$emit("keydown", e);

      if (e.event?.key === "Enter") {
        e.event.preventDefault();

        // if(!this.isDialogVisibleprops) {
        //   this.$emit("opendialog", {value: this.valtext });
        // }else{
        this.$emit("enterNext", e);
      }
      // }
    },

    focus() {
      this.$nextTick(() => {
        const dxTextBox = this.$refs.textBoxRef?.instance;
        if (dxTextBox) {
          dxTextBox.focus();
        } else {
          const input = this.$el.querySelector("input");
          if (input) input.focus();
        }
      });
    },
    // async openDialog() {
    //   try {
    //     const result = await FormBrowseDialog.show({
    //       title: this.dialogTitle || this.label,
    //       dataSource: this.dataSource,
    //       keyField: this.keyField,
    //     });
    //     this.selectedItem = result;
    //     this.$emit("update:modelValue", result);
    //     this.$emit("valuechange", result);
    //   } catch (err) {
    //     // dibatalkan
    //   }
    // },
  },
};
</script>

<style scoped>
.formbrows-container {
  margin-bottom: 0px;
}

.form-field {
  display: flex;
  flex-direction: column;
}

.input-group {
  display: flex;
  align-items: flex-end;
}
</style>
