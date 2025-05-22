# Usage Examples for Vue Form Builder

This document provides examples of how to use the Vue Form Builder library in different scenarios.

## Basic Usage

### Installing and Setting Up

```bash
# Install the library
npm install vue-form-builder

# Install peer dependencies if not already installed
npm install vue vuetify @mdi/font
```

### In a Vue 3 Application

```javascript
// main.js
import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import App from './App.vue';
import VueFormBuilder from 'vue-form-builder';

// Import required styles
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

const app = createApp(App);
const vuetify = createVuetify();

app.use(vuetify);
app.use(VueFormBuilder);
app.mount('#app');
```

## Form Builder Component

### Basic Form Builder

```vue
<template>
  <div>
    <h1>Form Builder</h1>
    <form-builder v-model="formSchema" @save="onSave"></form-builder>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formSchema: {
        title: 'Contact Form',
        elements: []
      }
    };
  },
  methods: {
    onSave(schema) {
      console.log('Form schema saved:', schema);
      // Save schema to database or local storage
      localStorage.setItem('myFormSchema', JSON.stringify(schema));
    }
  }
};
</script>
```

### Pre-populated Form Builder

```vue
<template>
  <div>
    <h1>Edit Existing Form</h1>
    <form-builder v-model="formSchema" @save="onSave"></form-builder>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formSchema: {
        title: 'Registration Form',
        elements: [
          {
            id: 'name-field',
            type: 'text',
            component: 'v-text-field',
            props: {
              label: 'Full Name',
              placeholder: 'Enter your full name',
              hint: 'First and last name',
              variant: 'outlined',
              required: true,
              rules: {
                required: true,
                minLength: { enabled: true, value: 3 }
              }
            }
          },
          {
            id: 'email-field',
            type: 'email',
            component: 'v-text-field',
            props: {
              label: 'Email Address',
              placeholder: 'Enter your email',
              type: 'email',
              variant: 'outlined',
              required: true,
              rules: {
                required: true,
                email: true
              }
            }
          }
        ]
      }
    };
  },
  methods: {
    onSave(schema) {
      console.log('Updated form schema:', schema);
    }
  }
};
</script>
```

## Form Renderer Component

### Basic Form Renderer

```vue
<template>
  <div>
    <h1>Form Submission</h1>
    <form-renderer 
      :form-data="formSchema" 
      @save="onSubmit"
    ></form-renderer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // Load the form schema (could be from API or localStorage)
      formSchema: JSON.parse(localStorage.getItem('myFormSchema')) || {
        title: 'Default Form',
        elements: []
      }
    };
  },
  methods: {
    onSubmit(formData) {
      console.log('Form submitted with data:', formData);
      
      // Example: Send data to an API
      fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      .then(response => response.json())
      .then(data => {
        alert('Form submitted successfully!');
      })
      .catch(error => {
        console.error('Error submitting form:', error);
      });
    }
  }
};
</script>
```

### Form Renderer with Initial Values

```vue
<template>
  <div>
    <h1>Edit User Profile</h1>
    <form-renderer 
      :form-data="formSchema" 
      :initial-values="userData"
      @save="onUpdate"
    ></form-renderer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formSchema: {
        title: 'User Profile',
        elements: [
          {
            id: 'name',
            type: 'text',
            component: 'v-text-field',
            props: {
              label: 'Name',
              required: true
            }
          },
          {
            id: 'email',
            type: 'email',
            component: 'v-text-field',
            props: {
              label: 'Email',
              type: 'email',
              required: true
            }
          },
          {
            id: 'role',
            type: 'select',
            component: 'v-select',
            props: {
              label: 'Role',
              items: [
                { value: 'user', title: 'User' },
                { value: 'admin', title: 'Administrator' },
                { value: 'editor', title: 'Editor' }
              ]
            }
          }
        ]
      },
      userData: {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'editor'
      }
    };
  },
  methods: {
    onUpdate(formData) {
      console.log('Updated user data:', formData);
      // Update user data in your system
    }
  }
};
</script>
```

## Complete Application Example

Here's an example of a complete application that combines both form building and rendering:

```vue
<template>
  <v-app>
    <v-app-bar color="primary" dark>
      <v-app-bar-title>Form Management System</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn @click="activeTab = 'builder'">Builder</v-btn>
      <v-btn @click="activeTab = 'renderer'">View Form</v-btn>
      <v-btn @click="activeTab = 'submissions'">Submissions</v-btn>
    </v-app-bar>
    
    <v-main class="bg-grey-lighten-4 pa-6">
      <v-container>
        <v-card>
          <v-tabs v-model="activeTab">
            <v-tab value="builder">Form Builder</v-tab>
            <v-tab value="renderer">Form Preview</v-tab>
            <v-tab value="submissions">Submissions</v-tab>
          </v-tabs>
          
          <v-window v-model="activeTab">
            <v-window-item value="builder">
              <v-card-text>
                <form-builder v-model="formSchema" @save="saveForm"></form-builder>
                <v-btn color="success" class="mt-4" @click="saveFormTemplate">Save Form Template</v-btn>
              </v-card-text>
            </v-window-item>
            
            <v-window-item value="renderer">
              <v-card-text>
                <form-renderer :form-data="formSchema" @save="processSubmission"></form-renderer>
              </v-card-text>
            </v-window-item>
            
            <v-window-item value="submissions">
              <v-card-text>
                <h2 class="text-h5 mb-4">Form Submissions</h2>
                <v-list v-if="submissions.length > 0">
                  <v-list-item v-for="(submission, index) in submissions" :key="index">
                    <v-list-item-title>Submission {{ index + 1 }}</v-list-item-title>
                    <v-list-item-subtitle>{{ new Date(submission.timestamp).toLocaleString() }}</v-list-item-subtitle>
                    
                    <template v-slot:append>
                      <v-btn icon @click="viewSubmission(index)">
                        <v-icon>mdi-eye</v-icon>
                      </v-btn>
                    </template>
                  </v-list-item>
                </v-list>
                <div v-else class="text-center py-4">
                  No submissions yet
                </div>
              </v-card-text>
            </v-window-item>
          </v-window>
        </v-card>
        
        <!-- Submission details dialog -->
        <v-dialog v-model="submissionDialog" max-width="800px">
          <v-card v-if="selectedSubmission !== null">
            <v-card-title>Submission Details</v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item v-for="(value, key) in selectedSubmission.data" :key="key">
                  <v-list-item-title>{{ getFieldLabel(key) }}</v-list-item-title>
                  <v-list-item-subtitle>{{ formatValue(value) }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
              <div class="mt-4 text-caption">
                Submitted on: {{ new Date(selectedSubmission.timestamp).toLocaleString() }}
              </div>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="submissionDialog = false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      activeTab: 'builder',
      formSchema: {
        title: 'My Form',
        elements: []
      },
      submissions: [],
      submissionDialog: false,
      selectedSubmission: null
    };
  },
  
  created() {
    // Load saved form schema from localStorage if available
    const savedSchema = localStorage.getItem('formSchema');
    if (savedSchema) {
      this.formSchema = JSON.parse(savedSchema);
    }
    
    // Load saved submissions
    const savedSubmissions = localStorage.getItem('formSubmissions');
    if (savedSubmissions) {
      this.submissions = JSON.parse(savedSubmissions);
    }
  },
  
  methods: {
    saveForm() {
      this.activeTab = 'renderer';
    },
    
    saveFormTemplate() {
      localStorage.setItem('formSchema', JSON.stringify(this.formSchema));
      alert('Form template saved successfully!');
    },
    
    processSubmission(formData) {
      // Add submission to the list with timestamp
      const submission = {
        data: formData,
        timestamp: new Date().toISOString()
      };
      
      this.submissions.push(submission);
      
      // Save submissions to localStorage
      localStorage.setItem('formSubmissions', JSON.stringify(this.submissions));
      
      alert('Form submitted successfully!');
      this.activeTab = 'submissions';
    },
    
    viewSubmission(index) {
      this.selectedSubmission = this.submissions[index];
      this.submissionDialog = true;
    },
    
    getFieldLabel(fieldId) {
      // Find the element in the form schema and return its label
      const element = this.formSchema.elements.find(el => el.id === fieldId);
      return element ? element.props.label : fieldId;
    },
    
    formatValue(value) {
      if (value === null || value === undefined) {
        return 'N/A';
      } else if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No';
      } else if (Array.isArray(value)) {
        return value.join(', ');
      } else if (typeof value === 'object') {
        return JSON.stringify(value);
      }
      return value;
    }
  }
};
</script>
```

## Advanced Customization

### Custom Form Element Styling

```vue
<template>
  <form-builder 
    v-model="formSchema" 
    class="custom-form-builder"
  ></form-builder>
</template>

<style>
.custom-form-builder .form-element {
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.custom-form-builder .form-element:hover {
  border-color: #2196F3;
}

.custom-form-builder .drag-handle {
  cursor: grab;
  color: #9e9e9e;
}

.custom-form-builder .drag-handle:hover {
  color: #2196F3;
}
</style>
```

### Custom Form Actions

```vue
<template>
  <div>
    <form-renderer :form-data="formSchema">
      <template v-slot:actions="{ isValid, submitForm, resetForm }">
        <div class="d-flex justify-space-between">
          <v-btn color="error" @click="resetForm">Clear Form</v-btn>
          <div>
            <v-btn class="mr-2" variant="outlined" @click="saveDraft">Save Draft</v-btn>
            <v-btn color="success" :disabled="!isValid" @click="submitForm">Submit</v-btn>
          </div>
        </div>
      </template>
    </form-renderer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formSchema: { /* Your form schema */ }
    }
  },
  methods: {
    saveDraft() {
      // Custom logic to save a draft of the form data
      console.log('Saving draft...');
    }
  }
}
</script>
```

## Integration Examples

### With Vuex/Pinia

```javascript
// store/forms.js (Pinia example)
import { defineStore } from 'pinia';

export const useFormStore = defineStore('forms', {
  state: () => ({
    formSchema: null,
    formSubmissions: []
  }),
  actions: {
    saveFormSchema(schema) {
      this.formSchema = schema;
      // Optionally save to backend API
    },
    addSubmission(submission) {
      this.formSubmissions.push({
        ...submission,
        id: Date.now().toString(),
        timestamp: new Date().toISOString()
      });
    }
  }
});
```

```vue
<!-- FormPage.vue -->
<template>
  <div>
    <form-builder 
      v-model="formStore.formSchema" 
      @save="saveForm"
    ></form-builder>
  </div>
</template>

<script setup>
import { useFormStore } from '@/store/forms';

const formStore = useFormStore();

function saveForm(schema) {
  formStore.saveFormSchema(schema);
}
</script>
```

### With Vue Router

```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import FormBuilder from '@/views/FormBuilder.vue';
import FormView from '@/views/FormView.vue';
import FormSubmissions from '@/views/FormSubmissions.vue';

const routes = [
  {
    path: '/',
    redirect: '/builder'
  },
  {
    path: '/builder',
    name: 'FormBuilder',
    component: FormBuilder
  },
  {
    path: '/view',
    name: 'FormView',
    component: FormView
  },
  {
    path: '/submissions',
    name: 'FormSubmissions',
    component: FormSubmissions
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
```
