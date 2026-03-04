import { createStore } from 'vuex';
import dealsModule from './modules/deals'; // Sesuaikan path filenya
import contactsModule from './modules/contacts';
import companiesModule from './modules/companies';
import tasksModule from './modules/tasks';
import documentsModule from './modules/documents';
import usersModule from './modules/users';
import broadcastModule from './modules/broadcast';
import settingsModule from './modules/settings';
import authModule from './modules/auth';
import tabsModule from './modules/tabs';
import settingsfeModule from './modules/settingsfe';

export default createStore({
  modules: {
    auth: authModule,
    deals: dealsModule,
    contacts: contactsModule,
    companies: companiesModule,
    tasks: tasksModule,
    documents: documentsModule,
    users: usersModule,
    broadcast: broadcastModule,
    settings: settingsModule,
    tabs: tabsModule,
    settingsfe: settingsfeModule,
  }
});