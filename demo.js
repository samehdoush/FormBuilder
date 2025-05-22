// Import required dependencies
import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import FormBuilder from './src/components/FormBuilder.vue';
import FormRenderer from './src/components/FormRenderer.vue';
import SignaturePad from './src/components/SignaturePad.vue';
import FileDisplay from './src/components/FileDisplay.vue';

// Import styles
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import './src/styles.css';

// Configure Vuetify
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

// Create the demo app
const app = createApp({
  template: `
    <v-app>
      <v-app-bar color="primary" dark>
        <v-app-bar-title>Vue Form Builder</v-app-bar-title>
      </v-app-bar>
      
      <v-main class="bg-grey-lighten-4">
        <v-container fluid>
          <v-row>
            <v-col cols="12">
              <v-card>
                <v-tabs v-model="activeTab">
                  <v-tab value="builder">Form Builder</v-tab>
                  <v-tab value="renderer">Form Renderer</v-tab>
                  <v-tab value="json">JSON Output</v-tab>
                </v-tabs>
                
                <v-window v-model="activeTab">
                  <v-window-item value="builder">
                    <v-card-text>
                      <form-builder v-model="formSchema" @save="onSave"></form-builder>
                    </v-card-text>
                  </v-window-item>                  
                  <v-window-item value="renderer">
                    <v-card-text>
                      <div class="mb-4 d-flex justify-end">
                        <v-switch v-model="readOnly" label="Read-only mode"></v-switch>
                      </div>
                      <form-renderer 
                        :form-data="formSchema" 
                        :initial-values="formValues"
                        :read-only="readOnly"
                        @save="onFormSubmit"
                      ></form-renderer>
                    </v-card-text>
                  </v-window-item>
                  
                  <v-window-item value="json">
                    <v-card-text>
                      <pre class="mt-2 p-4 bg-grey-lighten-3 rounded">{{ JSON.stringify(formSchema, null, 2) }}</pre>
                    </v-card-text>
                  </v-window-item>
                </v-window>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
      
      <v-footer app>
        <div class="text-center w-100">
          &copy; {{ new Date().getFullYear() }} — <strong>Vue Form Builder</strong>
        </div>
      </v-footer>
    </v-app>
  `,
    data() {
    return {
      activeTab: 'builder',
      readOnly: false,
      formValues: {}, // Will store form values
      formSchema: {
        title: 'Contact Form',
        elements: []
      }
    };
  },
  
  methods: {
    onSave(schema) {
      this.formSchema = schema;
      this.activeTab = 'renderer';
      console.log('Form schema saved:', schema);
    },
      onFormSubmit(formData) {
      // Store the form values to demo the read-only view
      this.formValues = formData;
      console.log('Form submitted with values:', formData);
      alert('Form submitted successfully!');
    }
  }
});

// Register components
app.component('FormBuilder', FormBuilder);
app.component('FormRenderer', FormRenderer);
app.component('SignaturePad', SignaturePad);
app.component('FileDisplay', FileDisplay);

// Use Vuetify
app.use(vuetify);

// Mount the app
app.mount('#app');
