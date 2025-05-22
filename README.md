# Vue Form Builder

A dynamic form builder and renderer built with Vue 3, Vuetify 3, and Tailwind CSS.

## Features

- Drag-and-drop form builder interface with toolbox
- Support for various form elements:
  - Text fields (including email, password, number, etc.)
  - Textareas
  - Select and autocomplete inputs
  - Checkboxes
  - Radio buttons
  - Switches
  - Date and time pickers
  - File inputs
  - Signature input with drawing capability
- JSON schema output for form configuration
- Form renderer component for displaying and interacting with created forms
- Read-only mode for form viewing
- File handling for database storage and retrieval
- Validation rules support
- Customizable styling with Tailwind CSS

## Installation

```bash
npm install vue-form-builder
```

## Dependencies

This package requires:

- Vue 3
- Vuetify 3
- Tailwind CSS

## Usage

### 1. Import and register the components

```javascript
import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import VueFormBuilder from 'vue-form-builder';

// Import styles
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css'; // For Vuetify icons

const app = createApp(App);
const vuetify = createVuetify({
  components,
  directives
});

app.use(vuetify);
app.use(VueFormBuilder);
app.mount('#app');
```

### 2. Use the FormBuilder component

```html
<template>
  <div>
    <h1>Form Builder Example</h1>
    <form-builder v-model="formSchema" @save="onSave"></form-builder>
    
    <h2>Generated JSON</h2>
    <pre>{{ JSON.stringify(formSchema, null, 2) }}</pre>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formSchema: {
        title: 'My Form',
        elements: []
      }
    };
  },
  methods: {
    onSave(schema) {
      console.log('Form schema saved:', schema);
      // Do something with the schema
    }
  }
};
</script>
```

### 3. Use the FormRenderer component

```html
<template>
  <div>
    <h1>Form Renderer Example</h1>
    <form-renderer 
      :form-data="myFormSchema" 
      @save="onFormSubmit"
    ></form-renderer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      myFormSchema: {
        title: 'Contact Form',
        elements: [
          // Your form schema here
        ]
      }
    };
  },
  methods: {
    onFormSubmit(formData) {
      console.log('Form submitted with data:', formData);
      // Process the form data
    }
  }
};
</script>
```

### Using the Form Builder with Drag and Drop

```vue
<template>
  <form-builder v-model="formSchema" @save="saveForm" />
</template>

<script>
import { ref } from 'vue';
import { FormBuilder } from 'vue-form-builder';

export default {
  components: {
    FormBuilder
  },
  setup() {
    const formSchema = ref({
      title: 'My Form',
      elements: []
    });
    
    const saveForm = (schema) => {
      console.log('Form schema:', schema);
      // Save the schema to your backend
    };
    
    return {
      formSchema,
      saveForm
    };
  }
}
</script>
```

### Using the Form Renderer with Read-only Mode

```vue
<template>
  <form-renderer 
    :form-data="formSchema" 
    v-model="formValues" 
    :read-only="isReadOnly"
    @save="handleSubmit"
  />
  
  <div class="mt-4">
    <v-btn @click="isReadOnly = !isReadOnly">
      {{ isReadOnly ? 'Enable Editing' : 'View Mode' }}
    </v-btn>
  </div>
</template>

<script>
import { ref } from 'vue';
import { FormRenderer } from 'vue-form-builder';

export default {
  components: {
    FormRenderer
  },
  setup() {
    const formSchema = ref({
      title: 'My Form',
      elements: [
        // Your form elements from saved schema
      ]
    });
    
    const formValues = ref({});
    const isReadOnly = ref(false);
    
    const handleSubmit = async (values) => {
      console.log('Form values:', values);
      // values will include processed file data ready for storage
    };
    
    return {
      formSchema,
      formValues,
      isReadOnly,
      handleSubmit
    };
  }
}
</script>
```

### Using the Signature Pad Component

```vue
<template>
  <signature-pad 
    v-model="signature" 
    :width="400" 
    :height="200"
    :read-only="false"
  />
  
  <div class="mt-2">
    <img v-if="signature" :src="signature" alt="Signature" class="signature-preview" />
  </div>
</template>

<script>
import { ref } from 'vue';
import { SignaturePad } from 'vue-form-builder';

export default {
  components: {
    SignaturePad
  },
  setup() {
    const signature = ref('');
    return { signature };
  }
}
</script>
```

### Working with Files and Database Storage

```vue
<template>
  <form-renderer 
    :form-data="formSchema" 
    v-model="formValues" 
    @save="handleSubmit"
  />
</template>

<script>
import { ref } from 'vue';
import { FormRenderer, FileHandler } from 'vue-form-builder';

export default {
  components: {
    FormRenderer
  },
  setup() {
    const formSchema = ref({
      title: 'File Upload Form',
      elements: [
        // Form elements including file inputs
      ]
    });
    
    const formValues = ref({});
    
    const handleSubmit = async (values) => {
      // values will already have files processed for storage
      
      // Save to your backend
      await saveToDatabase(values);
      
      // If you need to do additional processing:
      const processedFiles = await FileHandler.processFiles(values.someFileField);
    };
    
    const loadSavedForm = async (savedData) => {
      // When loading saved data that includes files:
      formValues.value = savedData;
      
      // The FileDisplay component will automatically handle showing the files
    };
    
    return {
      formSchema,
      formValues,
      handleSubmit
    };
  }
}
</script>
```

## Form Schema Structure

The form schema is a JSON object with the following structure:

```javascript
{
  "title": "Form Title",
  "elements": [
    {
      "id": "unique-id",
      "type": "text", // or other types
      "component": "v-text-field", // Vuetify component
      "props": {
        "label": "Field Label",
        "placeholder": "Enter value",
        "hint": "Field hint",
        "required": true,
        // Other props specific to the component
        "rules": {
          "required": true,
          "email": false,
          "minLength": { "enabled": true, "value": 3 },
          "maxLength": { "enabled": true, "value": 50 }
        }
      }
    }
    // More form elements...
  ]
}
```

## Development

### Project setup
```
npm install
```

### Compile and hot-reload for development
```
npm run serve
```

### Compile and minify for production
```
npm run build
```

## License

[MIT](LICENSE)
