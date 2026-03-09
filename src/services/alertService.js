import Swal from "sweetalert2";

const buttonColors = {
  confirm: "#002f6c",
  cancel: "#d33",
};

export const alertServicenew = {
  success(message, title = "Success") {
    alert(`${title}: ${message}`);
    return Promise.resolve();
  },
  error(message, title = "Error") {
    alert(`${title}: ${message}`);
    return Promise.resolve();
  },
  info(message, title = "Info") {
    alert(`${title}: ${message}`);
    return Promise.resolve();
  },
  confirm(message, title = "Confirm") {
    const result = confirm(`${title}: ${message}`);
    return Promise.resolve(result);
  },
};

export const alertService = {
  success(message, title = "Sukses", timer = 1000) {
    return Swal.fire({
      title,
      html: message,
      icon: "success",
      timer,
      showConfirmButton: false,
      customClass: {
        popup: "animated-popup",
        confirmButton: "animated-button",
      },
      didOpen: setupButtonAnimations,
    });
  },

  error(message, title = "Error") {
    return Swal.fire({
      title,
      html: message,
      icon: "error",
      allowOutsideClick: false,
      allowEscapeKey: true,
      showConfirmButton: true,
      showCancelButton: false,
      confirmButtonColor: buttonColors.confirm,
      confirmButtonText: "OK",
      customClass: {
        popup: "animated-popup",
        confirmButton: "animated-button",
      },
      didOpen: setupButtonAnimations,
      willOpen: () => {
        const cancelBtn = document.querySelector(".swal2-cancel");
        if (cancelBtn) {
          cancelBtn.remove();
        }
      },
    });
  },

  confirm(message, title = "Konfirmasi", options = {}) {
    return Swal.fire({
      title,
      text: message,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: buttonColors.confirm,
      cancelButtonColor: buttonColors.cancel,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
      reverseButtons: true,
      customClass: {
        popup: "animated-popup",
        confirmButton: "animated-button",
        cancelButton: "animated-button",
      },
      didOpen: setupButtonAnimations,
      ...options,
    });
  },

  confirmDelete(namaItem) {
    return this.confirm(
      `Apakah Anda yakin ingin menghapus data ${namaItem}?`,
      "Konfirmasi Hapus",
      {
        confirmButtonText: "Ya, Hapus!",
        html: `Apakah Anda yakin ingin menghapus data <strong>${namaItem}</strong>?`,
        confirmButtonColor: buttonColors.confirm,
        cancelButtonColor: buttonColors.cancel,
        customClass: {
          popup: "animated-popup",
          confirmButton: "animated-button animated-button-delete",
          cancelButton: "animated-button",
        },
        didOpen: setupButtonAnimations,
      },
    );
  },

  confirmWarning(message) {
    return Swal.fire({
      title: "Konfirmasi",
      text: message,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
      reverseButtons: true,
    });
  },

  confirmLogout() {
    return Swal.fire({
      title: "Yakin ingin keluar?",
      text: "Kamu akan keluar dari sistem.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: buttonColors.confirm,
      cancelButtonColor: buttonColors.cancel,
      confirmButtonText: "Ya, logout",
      cancelButtonText: "Batal",
      reverseButtons: true,
      customClass: {
        popup: "animated-popup",
        confirmButton: "animated-button",
        cancelButton: "animated-button",
      },
      didOpen: setupButtonAnimations,
    });
  },

  logoutSuccess() {
    return Swal.fire({
      toast: true,
      position: "top",
      icon: "success",
      title: "Berhasil Logout",
      showConfirmButton: false,
      timer: 1500,
      customClass: {
        popup: "animated-popup",
      },
    });
  },

  loginSuccess(title = "Login Berhasil", timer = 2500) {
    return Swal.fire({
      toast: true,
      position: "top",
      icon: "success",
      title,
      showConfirmButton: false,
      timer,
      customClass: {
        popup: "animated-popup",
      },
    });
  },

  loginError(message = "Email atau password salah", timer = 2500) {
    return Swal.fire({
      toast: true,
      position: "top",
      icon: "error",
      title: message,
      showConfirmButton: false,
      timer,
      customClass: {
        popup: "animated-popup",
      },
    });
  },

  validationError(message, timer = 3000) {
    return Swal.fire({
      toast: true,
      position: "top",
      icon: "warning",
      title: message,
      timer,
      customClass: {
        popup: "animated-popup",
      },
    });
  },

  toastSuccess(message, timer = 2500) {
    return Swal.fire({
      toast: true,
      position: "top",
      icon: "success",
      title: message,
      showConfirmButton: false,
      timer,
      customClass: {
        popup: "animated-popup",
      },
    });
  },

  toastError(message, timer = 2500) {
    return Swal.fire({
      toast: true,
      position: "top",
      icon: "error",
      title: message,
      // showConfirmButton: false,
      timer,
      customClass: {
        popup: "animated-popup",
      },
    });
  },

  toastInfo(message, timer = 2500) {
    return Swal.fire({
      toast: true,
      position: "top",
      icon: "info",
      title: message,
      showConfirmButton: false,
      timer,
      customClass: {
        popup: "animated-popup",
      },
    });
  },

  toastWarning(message, timer = 2500) {
    return Swal.fire({
      toast: true,
      position: "top",
      icon: "warning",
      title: message,
      showConfirmButton: false,
      timer,
      customClass: {
        popup: "animated-popup",
      },
    });
  },

  formWarning(fields, timer = 2000) {
    const fieldList = Array.isArray(fields) ? fields : [fields];
    const fieldNames = fieldList.join(", ");
    const message = `Form ${fieldNames} masih kosong!`;

    return Swal.fire({
      icon: "warning",
      title: "Peringatan",
      text: message,
      timer,
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: true,
      customClass: {
        popup: "animated-popup",
      },
      didOpen: setupButtonAnimations,
    });
  },

  perkiraanSuccess(action = "disimpan") {
    return this.success(`Data perkiraan berhasil ${action}!`, "Berhasil", 2500);
  },

  perkiraanDeleteConfirm(kodePerkiraan, keterangan = "") {
    const displayName = keterangan || kodePerkiraan;
    return this.confirm(
      `Data perkiraan "${displayName}" akan dihapus permanen.`,
      "Hapus Data Perkiraan",
      {
        confirmButtonText: "Ya, Hapus!",
        html: `<div style="font-size: 16px;">Apakah Anda yakin ingin menghapus perkiraan <strong>"${displayName}"</strong>?</div>`,
        confirmButtonColor: buttonColors.confirm,
        cancelButtonColor: buttonColors.cancel,
        customClass: {
          popup: "animated-popup",
          confirmButton: "animated-button animated-button-delete",
          cancelButton: "animated-button",
        },
        didOpen: setupButtonAnimations,
      },
    );
  },

  perkiraanRefreshSuccess() {
    return Promise.resolve({ isConfirmed: true });
  },
};

function setupButtonAnimations() {
  const buttons = document.querySelectorAll(".swal2-confirm, .swal2-cancel");
  buttons.forEach((button) => {
    button.addEventListener("mousedown", function () {
      this.style.transform = "scale(0.95)";
    });
    button.addEventListener("mouseup", function () {
      this.style.transform = "scale(1)";
    });
    button.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)";
    });
  });

  const confirmButton = document.querySelector(".swal2-confirm");
  const cancelButton = document.querySelector(".swal2-cancel");

  if (confirmButton && !cancelButton) {
    confirmButton.focus();
  } else if (cancelButton) {
    cancelButton.focus();
  }
}

const buttonStyleCSS = `
  .swal2-confirm,
  .swal2-cancel {
    display: none;
  }

  .swal2-confirm.swal2-styled,
  .swal2-cancel.swal2-styled {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 100px !important;     
    height: 36px !important;     
    line-height: 1 !important;   
    overflow: hidden !important; 
  }

  .swal2-confirm, .swal2-cancel {
    padding: 8px 16px !important;
    font-size: 15px !important;
    font-weight: 500 !important;
    font-family: inherit !important;
    border-radius: 6px !important;
    transition: all 0.15s ease !important;
    text-align: center !important;
    white-space: nowrap !important;
    letter-spacing: normal !important;
    box-sizing: border-box !important;
    border: 2px solid transparent !important;
  }
  
  .swal2-confirm {
    background-color: ${buttonColors.confirm} !important;
    color: white !important;
  }
  
  .swal2-cancel {
    background-color: ${buttonColors.cancel} !important;
    color: white !important;
  }
  
  .swal2-confirm.animated-button-delete {
    background-color: ${buttonColors.confirm} !important;
    color: white !important;
  }
  
  .swal2-actions {
    gap: 10px !important;
    justify-content: center !important;
    margin: 1.25em 0 0 0 !important;
  }
  
  .swal2-icon.swal2-warning {
    border-color: #facc15 !important;
    color: #facc15 !important;
  }
  
  .swal2-popup {
    font-family: inherit !important;
    padding: 1.5em 1.5em 1.25em !important;
  }
  
  .swal2-title {
    font-size: 17px !important;
    font-weight: 500 !important;
    font-family: inherit !important;
  }
  
  .swal2-content {
    font-size: 13px !important;
    font-family: inherit !important;
    margin: 0 0 1.5em 0 !important;
  }

  .swal2-cancel:focus {
    box-shadow: 0 0 8px rgba(211, 51, 51, 0.8) !important; 
    border: 2px solid #b91c1c !important;
    outline: none !important;
    transform: scale(1.08) !important;  
    font-size: 16px !important;
    font-weight: 600 !important;
  }
    
  .swal2-confirm:focus,
  .swal2-confirm.animated-button-delete:focus {
    box-shadow: 0 0 8px rgba(0, 47, 108, 0.8) !important; 
    border: 2px solid #002f6c !important;
    outline: none !important;
    transform: scale(1.08) !important;
    font-size: 16px !important; 
    font-weight: 600 !important;
  }
  
  .swal2-cancel:hover {
    transform: none !important;
    background-color: #c23030 !important;
    color: white !important;
  }
  
  .swal2-confirm:hover {
    transform: none !important;
    background-color: #001a3d !important;
    color: white !important;
  }
  
  .swal2-html-container {
  font-size: 16px !important;   
  font-weight: 400 !important; 
}

  @media (max-width: 480px) {
    .swal2-confirm.swal2-styled,
    .swal2-cancel.swal2-styled {
      width: 90px !important;
      height: 32px !important;
      padding: 6px 12px !important;
      font-size: 12px !important;
      line-height: 1 !important;
    }
    
    .swal2-cancel:focus {
      font-size: 14px !important; 
      font-weight: 600 !important;
    }
    
    .swal2-confirm:focus,
    .swal2-confirm.animated-button-delete:focus {
      font-size: 14px !important; 
      font-weight: 600 !important;
    }
  }
`;

const existingStyle = document.querySelector("#swal-button-style");
if (existingStyle) {
  existingStyle.remove();
}

const style = document.createElement("style");
style.id = "swal-button-style";
style.innerHTML = buttonStyleCSS;
document.head.appendChild(style);
