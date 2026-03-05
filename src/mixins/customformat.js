import { formatDate, formatNumber } from "devextreme/localization";
import { mapGetters, mapActions } from "vuex";

const customformat = {
  data() {
    return {
      bulan: [
        {
          bulan: "01",
          namabulan: "Januari",
        },
        {
          bulan: "02",
          namabulan: "Februari",
        },
        {
          bulan: "03",
          namabulan: "Maret",
        },
        {
          bulan: "04",
          namabulan: "April",
        },
        {
          bulan: "05",
          namabulan: "Mei",
        },
        {
          bulan: "06",
          namabulan: "Juni",
        },
        {
          bulan: "07",
          namabulan: "Juli",
        },
        {
          bulan: "08",
          namabulan: "Agustus",
        },
        {
          bulan: "09",
          namabulan: "September",
        },
        {
          bulan: "10",
          namabulan: "Oktober",
        },
        {
          bulan: "11",
          namabulan: "November",
        },
        {
          bulan: "12",
          namabulan: "Desember",
        },
      ],
      pilihanjurnal: [
        {
          tipeid: "0",
          nametipe: "Penerimaan Kas",
        },
        {
          tipeid: "1",
          nametipe: "Pengeluaran Kas",
        },
        {
          tipeid: "2",
          nametipe: "Penerimaan Bank",
        },
        {
          tipeid: "3",
          nametipe: "Pengeluaran Bank",
        },
        {
          tipeid: "4",
          nametipe: "Memorial",
        },
        {
          tipeid: "5",
          nametipe: "Koreksi",
        },
        {
          tipeid: "6",
          nametipe: "Penutup",
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      getcabang: "dash/getcabang",
      getdatamekanik: "dashboardh23/getdatamekanik",
      getcabangpt: "dash/getcabangpt",
      getlayoutmenuweb: "settingsfe/getlayoutmenuweb",
    }),
  },
  methods: {
    removeTab(tab) {
      // if (this.isNonClosableTab(tab.CAPTION)) return;

      let tabs = JSON.parse(localStorage.getItem("openTabs")) || [];
      let nametabs = JSON.parse(localStorage.getItem("opennameTabs")) || [];
      let selectedTab = localStorage.getItem("selectedTab") || [];
      let index = tabs.findIndex((t) => t === pathini);

      let tabss = tabs.filter((ta) => ta !== tab.pathfile);
      let nametabss = nametabs.filter(
        (ta) =>
          ta !==
          this.$router.getRoutes().find((r) => r.path === tab.pathfile).name
      );
      localStorage.setItem("openTabs", JSON.stringify(tabss));
      localStorage.setItem("opennameTabs", JSON.stringify(nametabss));
      // localStorage.setItem("selectedTab", this.selectedTab);
      // localStorage.setItem("openTabsflmenu", JSON.stringify(this.tabsflmenu));
      this.selectedflmenu(selectedTab);
      this.tabcaptions();
      // localStorage.setItem("selectedTabflmenu", this.selectedtabsflmenu);

      if (selectedTab === tab.pathfile) {
        if (tabs.length > 0) {
          let nextIndex = index;
          if (nextIndex >= tabs.length) {
            nextIndex = tabs.length - 1;
          }
          const nextTab = tabs[nextIndex];
          this.selectTab(tabsflmenu.find((t) => t.pathfile === nextTab));
          this.selectedTab = tab.pathfile;
          // this.selectedtabsflmenu = tab;
          this.saveTabsToStorage();
          this.$router.push({ path: tab.pathfile });
          this.selectedflmenu(tab.pathfile);
        } else {
          const dashboardMenu = this.getlayoutmenuweb.dbmenu2.find((item) =>
            item.CAPTION.toLowerCase().includes("dashboard")
          );

          if (dashboardMenu) {
            selectedTab = dashboardMenu.pathfile;
            this.$router.push({ path: dashboardMenu.pathfile });
            this.selectedflmenu(dashboardMenu.pathfile);
          } else {
            console.warn("⚠️ Dashboard tidak ditemukan di menu");
            selectedTab = null;
          }
        }
      }
    },

    saveTabsToStorage() {
      localStorage.setItem("openTabs", JSON.stringify(this.tabs));
      localStorage.setItem("opennameTabs", JSON.stringify(this.nametabs));
      localStorage.setItem("selectedTab", this.selectedTab);
      // localStorage.setItem("openTabsflmenu", JSON.stringify(this.tabsflmenu));
      this.selectedflmenu(this.selectedTab);
      this.tabcaptions();
      // localStorage.setItem("selectedTabflmenu", this.selectedtabsflmenu);
    },

    selectedflmenu(path) {
      const hasil = this.getlayoutmenuweb.dbmenu2.filter(
        (item) => item.pathfile == path
      );
      this.selectedtabsflmenu = hasil[0];
      localStorage.setItem(
        "selectedTabflmenu",
        JSON.stringify(this.selectedtabsflmenu)
      );
    },

    tabcaptions() {
      const paths = Array.from(this.tabs);
      const hasil = this.getlayoutmenuweb.dbmenu2.filter((item) =>
        paths.includes(item.pathfile)
      );
      this.tabsflmenu = hasil;
      let captions = hasil.map((tab) => tab.CAPTION);
      localStorage.setItem("openTabsflmenu", JSON.stringify(hasil));
      // this.selectedtabsflmenu = hasil[0];
      // console.log(this.selectedtabsflmenu);
      // localStorage.setItem("selectedTabflmenu", JSON.stringify(this.selectedtabsflmenu));

      this.tabs = JSON.parse(localStorage.getItem("openTabs")) || [];
      this.selectedTab = localStorage.getItem("selectedTab") || [];
    },

    selectTab(tab) {
      this.selectedTab = tab.pathfile;
      // this.selectedtabsflmenu = tab;
      this.saveTabsToStorage();
      this.$router.push({ path: tab.pathfile });
      this.selectedflmenu(tab.pathfile);
    },

    cstformatDatee(date, from = null) {
      if (from == "day") {
        return formatDate(date, "dd");
      } else if (from == "month") {
        return formatDate(date, "MMMM-yyyy");
      } else if (from == "monthnum") {
        return formatDate(date, "M");
      } else if (from == "monthnumm") {
        return formatDate(date, "MM");
      } else if (from == "tahunnum") {
        return formatDate(date, "yyyy");
      } else if (from == "normalv2") {
        return formatDate(date, "dd/MMMM/yyyy");
      } else if (from == "normalv3") {
        return formatDate(date, "dd-MMMM-yyyy");
      } else if (from == "normalv4") {
        return formatDate(date, "dd MMM yyyy");
      } else if (from == "tglforsp") {
        return formatDate(date, "yyyy/MM/dd");
      } else {
        return formatDate(date, "dd-MM-yyyy");
      }
    },

    cstformatnumber(data) {
      return formatNumber(data, "fixedPoint");
    },

    cstformatkeuangan(data) {
      let formattedNumber = formatNumber(Math.abs(data), {
        type: "currency",
        currency: "IDR", // Sesuaikan dengan mata uang yang kamu inginkan
        useCurrencyAccountingStyle: true,
      });
      // Hilangkan simbol mata uang
      formattedNumber = formattedNumber.replace(/[^0-9,.-]+/g, "");
      if (data < 0) {
        formattedNumber = `(${formattedNumber})`;
      }
      return formattedNumber;
    },

    getmekanikname(id) {
      if (this.getdatamekanik) {
        let branch = this.getdatamekanik.find((item) => item.kode === id);
        return branch ? branch.nama : null;
      } else {
        return;
      }
    },

    getcabangname(cabangId, dtcabang) {
      // if (this.getcabang) {
      //   let branch = this.getcabang.find(
      //     (branch) => branch.cabangid == cabangId
      //   );
      //   return branch
      // } else {
      //   return;
      // }
      if (dtcabang) {
        let branch = dtcabang.find((branch) => branch.kodecabang == cabangId);
        return branch ? branch.namacabang : null;
      } else {
        return;
      }
    },

    getcabangname2(cabangid, from) {
      if (from == "pt") {
        console.log(this.getcabangpt);
        // console.log(this.getcabangpt.find((branch) => branch.kodecabang == cabangid).namacabang);
        return this.getcabangpt.find((branch) => branch.kodecabang == cabangid)
          .namacabang;
      } else if (from == "cabang") {
        return this.getcabang.find((branch) => branch.kodecabang == cabangid)
          .namacabang;
        // this.getcabangname(cabangid,this.getcabang);
      }
    },

    funpersenpencapaianxtarget(data) {
      const pencapaian = data.subvalues()[1];
      const target = data.subvalues()[0];

      let total = pencapaian / target;
      // const bulat = formatNumber(total, "fixedpoint");
      // console.log(formatNumber(total, "percent"));
      return formatNumber(total, "percent");
    },

    getLastDateOfMonth(year, month) {
      // Perhatikan bahwa month dimulai dari 0 (Januari) hingga 11 (Desember)
      // Untuk mendapatkan tanggal terakhir, set tanggalnya menjadi 0 (hari sebelumnya dari tanggal 1 bulan berikutnya)
      let lastDate = new Date(year, month + 1, 0);
      return lastDate.getDate(); // Mengembalikan tanggal dari objek Date yang sudah dibuat
    },

    getdatenow() {
      const sekarang = new Date();
      const formattedDate = sekarang.toISOString().split("T")[0]; // Mendapatkan format YYYY-MM-DD
      // const formattedDatee = format(sekarang, 'yyyy-MM-dd HH:mm:ss', { timeZone: 'UTC' });
      return formattedDate;
    },

    getkeysarray(e) {
      const keys = Object.keys(e[0]);
      return keys;
    },

    getdatatunggal(e) {
      let count = e.reduce((acc, curr) => {
        if (acc[curr.kel]) {
          acc[curr.kel]++;
        } else {
          acc[curr.kel] = 1;
        }
        return acc;
      }, {});
      let lebihDariSatu = Object.keys(count).filter((key) => count[key] >= 1);
      return lebihDariSatu;
    },

    nilaimax(data, argument) {
      let nilaimax = Math.max(...data.map((item) => item.argument));
      return nilaimax;
    },

    caript(data, cabang, from = null) {
      // if (cabang == "0") {
      //   const datafilterbulan = data;
      //   return datafilterbulan;
      // }
      // else if (cabang == "10") {
      //   const datafilterbulan = data.filter((item) => {
      //     return kodecabangs.includes(item.kodecabang)
      //   });
      //   // console.log(datafilterbulan);
      //   return datafilterbulan;
      // }
      // else {

      if (from == "cabang") {
        let kodept = this.caricabang(data, cabang)[0].kodept;
        const datafilterbulan = data.filter((item) => {
          return item.kodecabang == `${kodept}`;
        });
        // console.log(datafilterbulan);
        return datafilterbulan;
      } else {
        const datafilterbulan = data.filter((item) => {
          return item.kodept == `${cabang}`;
        });
        // console.log(datafilterbulan);
        return datafilterbulan;
      }

      // }
    },

    caricabang(data, cabang) {
      const kodecabangs = ["11", "12", "13", "14"];

      if (cabang == "00" || cabang == "0") {
        const datafilterbulan = data;
        return datafilterbulan;
      } else if (cabang == "10") {
        const datafilterbulan = data.filter((item) => {
          return kodecabangs.includes(item.kodecabang);
        });
        // console.log(datafilterbulan);
        return datafilterbulan;
      } else {
        const datafilterbulan = data.filter((item) => {
          return item.kodecabang == `${cabang}` || item.kodept == `${cabang}`;
        });
        // console.log(datafilterbulan);
        return datafilterbulan;
      }
    },

    caricabangandbulan(data, cabang, bulann) {
      const kodecabangs = ["11", "12", "13", "14"];
      let bulan = this.cstformatDatee(bulann, "monthnumm");
      let bulan2 = this.cstformatDatee(bulann, "monthnum");
      // console.log(bulan);
      // console.log(bulan2);

      if (cabang == "00" || cabang == "0") {
        const datafilterbulan = data.filter((item) => {
          return item.bulan == `${bulan}` || item.bulan == `${bulan2}`;
        });
        // console.log(datafilterbulan);
        return datafilterbulan;
      } else if (cabang == "10") {
        const datafilterbulan = data.filter((item) => {
          return (
            kodecabangs.includes(item.kodecabang) &&
            (item.bulan == `${bulan}` || item.bulan == `${bulan2}`)
          );
        });
        // console.log(datafilterbulan);

        return datafilterbulan;
      } else {
        const datafilterbulan = data.filter((item) => {
          return (
            (item.kodecabang == `${cabang}` || item.kodept == `${cabang}`) &&
            (item.bulan == `${bulan}` || item.bulan == `${bulan2}`)
          );
        });
        // console.log(datafilterbulan);
        return datafilterbulan;
      }
    },

    caridatabulan(data, bulann) {
      let bulan = this.cstformatDatee(bulann, "monthnumm");
      let bulan2 = this.cstformatDatee(bulann, "monthnum");
      // console.log(bulan);
      // console.log(bulan2);
      const datafilterbulan = data.filter((item) => {
        return item.bulan == `${bulan}` || item.bulan == `${bulan2}`;
      });
      return datafilterbulan;

      // if (cabang == "00" || cabang =="0") {
      //   // console.log(datafilterbulan);
      // } else if (cabang == "10") {
      //   const datafilterbulan = data.filter((item) => {
      //     return kodecabangs.includes(item.kodecabang) && (item.bulan == `${bulan}` || item.bulan == `${bulan2}`)
      //   });
      //   // console.log(datafilterbulan);

      //   return datafilterbulan;
      // } else {
      //   const datafilterbulan = data.filter((item) => { return (item.kodecabang == `${cabang}` || item.kodept == `${cabang}`) && (item.bulan == `${bulan}` || item.bulan == `${bulan2}`) });
      //   // console.log(datafilterbulan);
      //   return datafilterbulan;
      // };
    },

    cariptandbulan(data, cabang, bulann) {
      const kodecabangs = ["11", "12", "13", "14"];
      let bulan = this.cstformatDatee(bulann, "monthnumm");
      let bulan2 = this.cstformatDatee(bulann, "monthnum");
      const getpt = this.caricabangandbulan(data, cabang, bulann)[0].kodept;
      // return getpt;
      // console.log(bulan);
      // console.log(bulan2);

      // if (cabang == "00" || cabang =="0") {
      //   const datafilterbulan = data.filter((item) => { return item.bulan == `${bulan}` || item.bulan == `${bulan2}` });
      //   // console.log(datafilterbulan);
      //   return datafilterbulan;
      // } else if (cabang == "10") {
      //   const datafilterbulan = data.filter((item) => {
      //     return kodecabangs.includes(item.kodecabang) && (item.bulan == `${bulan}` || item.bulan == `${bulan2}`)
      //   });
      //   // console.log(datafilterbulan);

      //   return datafilterbulan;
      // } else {

      const datafilterbulan = data.filter((item) => {
        return (
          item.kodecabang == `${getpt}` &&
          (item.bulan == `${bulan}` || item.bulan == `${bulan2}`)
        );
      });
      // console.log(datafilterbulan);
      return datafilterbulan;
      // };
    },

    caricabangandbulanforbarchart(data, cabang, bulann) {
      const kodecabangs = ["11", "12", "13", "14"];
      let bulan = this.cstformatDatee(bulann, "monthnumm");
      let bulan2 = this.cstformatDatee(bulann, "monthnum");
      console.log(cabang);

      if (cabang == "00" || cabang == "0") {
        const datafilterbulan = data.filter((item) => {
          return item.bulan <= `${bulan}` || item.bulan <= `${bulan2}`;
        });
        return datafilterbulan;
      } else if (cabang == "10") {
        const datafilterbulan = data.filter((item) => {
          return (
            kodecabangs.includes(item.kodecabang) &&
            (item.bulan <= `${bulan}` || item.bulan <= `${bulan2}`)
          );
        });
        // console.log(datafilterbulan);

        return datafilterbulan;
      } else {
        const datafilterbulan = data.filter((item) => {
          return (
            (item.kodecabang == `${cabang}` || item.kodept == `${cabang}`) &&
            (item.bulan <= `${bulan}` || item.bulan <= `${bulan2}`)
          );
        });
        // console.log(datafilterbulan);
        return datafilterbulan;
      }
    },

    actdatafordoughnutchart(datafilter) {
      let alldata = [];
      for (let index = 0; index < datafilter.length; index++) {
        const element = datafilter[index];
        const resultarray = Object.keys(element)
          .map((key) => {
            if (
              key == "total_sparepart_md_mpm" ||
              key == "total_sparepart_non_mpm"
            ) {
              return {
                namacabang: element["namacabang"],
                argument: key.toUpperCase(),
                value: element[key],
              };
            }
          })
          .filter((item) => item !== undefined);
        alldata.push(resultarray);
        // console.log(element);
      }
      this.dtpembeliansparepartchart = alldata;
      console.log(alldata);
    },

    actorderby(data, aksi) {
      if (aksi == "desc") {
        let sortedData = data.slice().sort((a, b) => {
          return b.kec.localeCompare(a.kec);
        });
        return sortedData;
      } else if (aksi == "asc") {
        let sortedData = data.slice().sort((a, b) => {
          return a.kec.localeCompare(b.kec);
        });
        return sortedData;
      }
    },

    strnospasi(str) {
      return str.replace(/\s+/g, "").toLowerCase();
    },

    funlebihdarisatu(e, keye) {
      let countByKey = (arr, key) => {
        return arr.reduce((acc, curr) => {
          acc[curr[key]] = (acc[curr[key]] || 0) + 1;
          return acc;
        }, {});
      };

      let lebihDariSatu = Object.keys(countByKey(e, keye)).filter(
        (key) => countByKey(e, keye)[key] >= 1
      );
      return lebihDariSatu;
    },

    fungsirandom() {
      let newdata = [];

      let countByKey = (arr, key) => {
        return arr.reduce((acc, curr) => {
          acc[curr[key]] = (acc[curr[key]] || 0) + 1;
          return acc;
        }, {});
      };

      let lebihDariSatu = Object.keys(countByKey(e, "kodecabang")).filter(
        (key) => countByKey(e, "kodecabang")[key] >= 1
      );

      lebihDariSatu.forEach((cabang) => {
        let filterdata = e.filter((item) => item.kodecabang === cabang);

        let lebihDariSatu2 = Object.keys(
          countByKey(filterdata, "kategori")
        ).filter((key) => countByKey(filterdata, "kategori")[key] >= 1);

        let todat = {};
        lebihDariSatu2.forEach((kategori) => {
          todat[strnospasi(kategori)] = filterdata
            .filter((data) => data.kategori === kategori)
            .reduce((total, data) => total + data.mppn, 0);
        });

        let dataa = { ...filterdata[0], ...todat };
        newdata.push(dataa);
      });

      console.log(newdata);
    },

    databypt(e) {
      let filterdata = e.filter((item) =>
        [1, 2, 3, 4, 5].includes(parseInt(item.kodecabang))
      );
      return filterdata;
    },

    databycabang(e) {
      let filterdata = e.filter(
        (item) => ![1, 2, 3, 4, 5].includes(parseInt(item.kodecabang))
      );
      return filterdata;
    },

    actdtfilterh1(e) {
      const datafilterh1 = e.filter((item) => {
        return item.namatarget == "H1";
      });
      return datafilterh1;
    },

    actdtfilterh23(e) {
      const datafilterh23 = e.filter((item) => {
        return item.namatarget != "H1" && item.kodecabang != "";
      });
      return datafilterh23;
    },

    sanitizeWorksheetName(name) {
      // Karakter yang tidak diizinkan
      const invalidCharacters = ["*", "?", ":", "\\", "/", "[", "]"];

      // Mengganti karakter yang dilarang dengan string kosong
      let sanitized = name;
      invalidCharacters.forEach((char) => {
        sanitized = sanitized.split(char).join("");
      });

      return sanitized;
    },

    getallroute() {
      // semua route yang terdaftar
      const allRoutes = this.$router.getRoutes();

      // ambil daftar path
      const allPaths = allRoutes.map((r) => r.path);

      // console.log("Daftar Path:", allPaths);

      // contoh kalau mau ambil juga name & meta.tabName
      const routeInfos = allRoutes.map((r) => ({
        path: r.path,
        name: r.name,
        tabName: r.meta?.tabName || null,
      }));

      return allPaths;
    },
  },
  
};

export default customformat;
