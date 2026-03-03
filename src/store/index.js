import { createStore } from 'vuex';
import dealsModule from './modules/deals'; // Sesuaikan path filenya
import contactsModule from './modules/contacts';
import companiesModule from './modules/companies';
import tasksModule from './modules/tasks';
import documentsModule from './modules/documents';
import usersModule from './modules/users';
import broadcastModule from './modules/broadcast';
import settingsModule from './modules/settings';

export default createStore({
  modules: {
    deals: dealsModule, // Nama 'deals' di sini harus sama dengan prefix di getter/dispatch
    contacts: contactsModule,
    companies: companiesModule,
    tasks: tasksModule,
    documents: documentsModule,
    users: usersModule,
    broadcast: broadcastModule,
    settings: settingsModule,
  }
});