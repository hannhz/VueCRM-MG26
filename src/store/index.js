import { createStore } from 'vuex';
import dealsModule from './modules/deals'; // Sesuaikan path filenya

export default createStore({
  modules: {
    deals: dealsModule // Nama 'deals' di sini harus sama dengan prefix di getter/dispatch
  }
});