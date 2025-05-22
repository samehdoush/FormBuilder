# Vue Form Builder - Getting Started

This guide will help you integrate the Vue Form Builder into your project.

## Installation

First, install the package and its dependencies:

```bash
npm install vue-form-builder vue vuetify @mdi/font
```

## Basic Setup

1. Create a new Vue project or use your existing Vue 3 project

2. Set up Vuetify and the Form Builder in your main.js:

```javascript
import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import VueFormBuilder from 'vue-form-builder';
import App from './App.vue';

// Import required styles
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

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

// Create Vue app
const app = createApp(App);

// Use plugins
app.use(vuetify);
app.use(VueFormBuilder);

// Mount app
app.mount('#app');
```

## Creating a Form Builder Interface

Here's an example App.vue file that demonstrates how to use the form builder and renderer:

```vue
<template>
  <v-app>
    <v-app-bar color="primary" dark>
      <v-app-bar-title>Vue Form Builder Demo</v-app-bar-title>
      
      <v-spacer></v-spacer>
      
      <v-btn @click="activeTab = 'builder'">Builder</v-btn>
      <v-btn @click="activeTab = 'preview'">Preview</v-btn>
      <v-btn @click="activeTab = 'json'">JSON</v-btn>
    </v-app-bar>
    
    <v-main>
      <v-container fluid>
        <v-card>
          <v-tabs v-model="activeTab">
            <v-tab value="builder">Form Builder</v-tab>
            <v-tab value="preview">Preview</v-tab>
            <v-tab value="json">JSON Schema</v-tab>
          </v-tabs>
          
          <v-card-text>
            <v-window v-model="activeTab">
              <v-window-item value="builder">
                <form-builder v-model="formSchema" @save="onSave"></form-builder>
              </v-window-item>
              
              <v-window-item value="preview">
                <form-renderer 
                  :form-data="formSchema" 
                  :initial-values="formValues" 
                  @save="onSubmit"
                ></form-renderer>
              </v-window-item>
              
              <v-window-item value="json">
                <v-textarea
                  :value="JSON.stringify(formSchema, null, 2)"
                  label="Form Schema (JSON)"
                  readonly
                  auto-grow
                  rows="20"
                ></v-textarea>
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
    
    <v-footer app padless>
      <v-card flat width="100%" class="text-center">
        <v-card-text>
          Vue Form Builder - {{ new Date().getFullYear() }}
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      activeTab: 'builder',
      formSchema: {
        title: 'Contact Form',
        elements: []
      },
      formValues: {}
    };
  },
  
  methods: {
    onSave(schema) {
      this.formSchema = schema;
      this.activeTab = 'preview';
      
      // You can save the schema to localStorage or your backend
      localStorage.setItem('savedFormSchema', JSON.stringify(schema));
      
      console.log('Form schema saved:', schema);
    },
    
    onSubmit(values) {
      this.formValues = values;
      
      console.log('Form submitted with values:', values);
      
      // Here you would typically send the data to your backend
      alert('Form submitted successfully!');
    },
    
    loadSavedForm() {
      const savedForm = localStorage.getItem('savedFormSchema');
      if (savedForm) {
        try {
          this.formSchema = JSON.parse(savedForm);
        } catch (e) {
          console.error('Error loading saved form:', e);
        }
      }
    }
  },
  
  mounted() {
    // Load any previously saved form schema
    this.loadSavedForm();
  }
};
</script>
```

## Understanding the Form Schema

The form schema is a JSON structure that defines all aspects of your form:

```json
{
  "title": "Contact Form",
  "elements": [
    {
      "id": "name",
      "type": "text",
      "component": "v-text-field",
      "props": {
        "label": "Full Name",
        "placeholder": "Enter your name",
        "variant": "outlined",
        "required": true,
        "rules": {
          "required": true,
          "minLength": { "enabled": true, "value": 3 }
        }
      }
    },
    {
      "id": "email",
      "type": "email",
      "component": "v-text-field",
      "props": {
        "label": "Email Address",
        "placeholder": "Enter your email",
        "type": "email",
        "variant": "outlined",
        "required": true,
        "rules": {
          "required": true,
          "email": true
        }
      }
    },
    {
      "id": "message",
      "type": "textarea",
      "component": "v-textarea",
      "props": {
        "label": "Message",
        "placeholder": "Enter your message",
        "rows": 4,
        "variant": "outlined",
        "required": true,
        "rules": {
          "required": true
        }
      }
    }
  ]
}
```

## Next Steps

- Check out the [Examples](./EXAMPLES.md) for more advanced usage scenarios
- Read the full [Documentation](./DOCUMENTATION.md) for all available options
- Try out the online demo at [vue-form-builder-demo.netlify.app](https://vue-form-builder-demo.netlify.app)

## Troubleshooting

### Common Issues

1. **Components not rendering**: Make sure you've properly registered the components and imported all the required styles.

2. **Drag and drop not working**: Check that you have the correct version of vuedraggable installed and properly imported.

3. **Validation not working**: Ensure that you've set up the validation rules correctly in your form schema.

4. **Styling issues**: If you're using Tailwind CSS, make sure it's properly configured to work with Vuetify and the Vue Form Builder.

### Getting Help

If you encounter any issues, please check the [GitHub Issues](https://github.com/yourusername/vue-form-builder/issues) or create a new issue if your problem hasn't been addressed yet.
