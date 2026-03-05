import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const notifications = {
  data() {
    return {
    };
  },
  computed: {
    
  },
  methods: {
    shownotifsuccess(msg) {
      return  toast(msg, {
        autoClose: 1000,
        position: "top-right",
        theme: "colored",
        type: "success",
        newestOnTop: true,
      });
    },
    shownotiffail(msg) {
        return  toast(msg, {
            autoClose: 1000,
            position: "top-right",
            theme: "colored",
            type: "error",
            newestOnTop: true,
          });
      },

      shownotifsuccesswithact(msg,func) {
        return  toast(msg, {
            autoClose: 1000,
            position: "top-right",
            theme: "colored",
            type: "success",
            onClose: func,
            newestOnTop: true,
          });
      },
  },
};

export default notifications;
