// Vue Form Builder - Demo Application
// The main application file demonstrating the Vue Form Builder library usage

import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi';

// Import the form builder library
import VueFormBuilder from './src/index';

// Import styles
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import './src/styles.css';

// Create a sample app
const app = document.createElement('div');
app.id = 'app';
document.body.appendChild(app);

// Create a sample app component
const AppComponent = {
  template: `
    <v-app>
      <v-app-bar title="Vue Form Builder Demo"></v-app-bar>
      <v-main class="bg-grey-lighten-3 py-8">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-tabs v-model="activeTab">
                <v-tab value="builder">Form Builder</v-tab>
                <v-tab value="renderer">Form Renderer</v-tab>
                <v-tab value="json">JSON Output</v-tab>
              </v-tabs>
              
              <v-card class="mt-2">
                <v-card-text>
                  <v-window v-model="activeTab">
                    <v-window-item value="builder">
                      <form-builder v-model="formSchema" @save="onSave"></form-builder>
                    </v-window-item>
                    
                    <v-window-item value="renderer">
                      <form-renderer :form-data="formSchema" @save="onFormSubmit"></form-renderer>
                    </v-window-item>
                    
                    <v-window-item value="json">
                      <v-textarea
                        :model-value="JSON.stringify(formSchema, null, 2)"
                        label="Form Schema (JSON)"
                        readonly
                        auto-grow
                        variant="outlined"
                        rows="20"
                      ></v-textarea>
                    </v-window-item>
                  </v-window>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
  `,
  data() {
    return {
      activeTab: 'builder',
      formSchema: {
        title: 'Sample Form',
        elements: []
      },
      formValues: {}
    };
  },
  methods: {
    onSave(schema) {
      this.formSchema = schema;
      this.activeTab = 'renderer';
    },
    onFormSubmit(values) {
      this.formValues = values;
      console.log('Form submitted with values:', values);
      alert('Form submitted successfully!');
    }
  }
};

// Create Vuetify instance
const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  }
});

// Create the Vue app
const vueApp = createApp(AppComponent);
vueApp.use(vuetify);
vueApp.use(VueFormBuilder);
vueApp.mount('#app');