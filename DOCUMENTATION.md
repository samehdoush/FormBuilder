# Vue Form Builder Documentation

## Overview

Vue Form Builder is a powerful library for creating dynamic forms using Vue 3, Vuetify 3, and Tailwind CSS. It consists of the following main components:

1. `FormBuilder` - A drag-and-drop interface for creating forms
2. `FormRenderer` - A component that renders forms based on the schema created by the FormBuilder
3. `SignaturePad` - A component for capturing handwritten signatures
4. `FileDisplay` - A component for displaying file data in read-only mode

## New Features

### Drag and Drop from Toolbox
The form builder now supports true drag-and-drop functionality. Users can drag elements directly from the toolbox to the form canvas, and rearrange elements within the form.

### Signature Component
A new signature component has been added that allows users to draw signatures directly on the form. The signatures are stored as base64-encoded PNGs for easy storage in databases.

### Read-Only Mode
Forms can now be displayed in read-only mode, which disables all inputs and hides action buttons. This is useful for reviewing submitted forms or displaying form data in view-only contexts.

### File Storage and Retrieval
The library now includes utilities for handling file uploads, converting them to formats suitable for database storage, and displaying them when retrieved. This includes preview support for images, PDFs, and text files.

## Installation

```bash
npm install vue-form-builder
```

## Quick Start

```javascript
// main.js
import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import VueFormBuilder from 'vue-form-builder';
import App from './App.vue';

// Import required styles
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

const app = createApp(App);
const vuetify = createVuetify();

app.use(vuetify);
app.use(VueFormBuilder);
app.mount('#app');
```

```vue
<!-- App.vue -->
<template>
  <v-app>
    <v-main>
      <v-container>
        <form-builder v-model="formSchema" @save="onSave"></form-builder>
      </v-container>
    </v-main>
  </v-app>
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
    }
  }
};
</script>
```

## Components

### FormBuilder

The FormBuilder component provides a user interface for creating and configuring form elements.

#### Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| modelValue | Object | `{ title: 'New Form', elements: [] }` | The form schema object (v-model binding) |
| formOptions | Object | `{}` | Additional options for the form builder |

#### Events

| Name | Parameters | Description |
|------|------------|-------------|
| update:modelValue | schema | Emitted when the form schema changes |
| save | schema | Emitted when the form is saved |

#### Form Schema Structure

```javascript
{
  "title": "Form Title",
  "elements": [
    {
      "id": "unique-id",
      "type": "text", // Element type (text, email, select, etc.)
      "component": "v-text-field", // Vuetify component name
      "props": {
        "label": "Field Label",
        "placeholder": "Enter text",
        "hint": "Help text",
        "variant": "outlined",
        "density": "comfortable",
        "required": false,
        "rules": {
          "required": false,
          "email": false,
          "minLength": { "enabled": false, "value": 3 },
          "maxLength": { "enabled": false, "value": 50 }
        }
        // Other component-specific props
      }
    }
    // More elements...
  ]
}
```

### FormRenderer

The FormRenderer component takes a form schema and renders the form with full functionality.

#### Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| formData | Object | required | The form schema object created by FormBuilder |
| initialValues | Object | `{}` | Initial values for the form fields |
| readOnly | Boolean | `false` | Whether the form should be in read-only mode |

#### Events

| Name | Parameters | Description |
|------|------------|-------------|
| save | formValues | Emitted when the form is submitted with valid data |
| update:modelValue | formValues | Emitted when form values change |

### SignaturePad

The SignaturePad component allows users to draw and capture signatures.

#### Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| modelValue | String | `''` | The signature data as a base64-encoded PNG (v-model binding) |
| width | Number | `300` | The width of the signature pad |
| height | Number | `150` | The height of the signature pad |
| penColor | String | `'#000000'` | The color of the pen used for signing |

#### Events

| Name | Parameters | Description |
|------|------------|-------------|
| update:modelValue | signature | Emitted when the signature is updated |

### FileDisplay

The FileDisplay component shows file data in a read-only format.

#### Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| fileData | Object | required | The file data to display |
| fileType | String | required | The type of the file (image, pdf, text, etc.) |

## Supported Form Element Types

Vue Form Builder supports the following form element types:

### Text Fields
- Regular text input
- Email input
- Password input
- Number input
- Date picker
- Time picker

### Selection Controls
- Select dropdown
- Autocomplete
- Checkbox
- Radio button group
- Switch

### Other Elements
- Textarea
- File input

Each element type supports various configuration options for validation, appearance, and behavior.

## Validation

The form elements support validation rules, including:

- Required fields
- Email format validation
- Minimum and maximum length
- Specific formats (for dates, numbers, etc.)

## Advanced Usage

### Custom Styling

You can customize the appearance of form elements using Tailwind CSS classes:

```vue
<form-builder
  v-model="formSchema"
  class="my-custom-form-builder"
></form-builder>
```

You can then define custom styles in your CSS:

```css
.my-custom-form-builder .form-element {
  @apply bg-blue-50 border-blue-200;
}
```

### Loading and Saving Form Templates

```vue
<template>
  <div>
    <form-builder v-model="formSchema"></form-builder>
    
    <v-btn @click="saveTemplate">Save Template</v-btn>
    <v-btn @click="loadTemplate">Load Template</v-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formSchema: {
        title: 'New Form',
        elements: []
      }
    };
  },
  methods: {
    saveTemplate() {
      localStorage.setItem('formTemplate', JSON.stringify(this.formSchema));
    },
    loadTemplate() {
      const savedTemplate = localStorage.getItem('formTemplate');
      if (savedTemplate) {
        this.formSchema = JSON.parse(savedTemplate);
      }
    }
  }
};
</script>
```

## Best Practices

1. **Form Organization**: Group related fields together for better user experience
2. **Validation**: Use appropriate validation rules for each field
3. **Accessibility**: Provide clear labels and hints for all form fields
4. **Responsive Design**: Test forms on different screen sizes

## Troubleshooting

### Common Issues

1. **Form elements not showing up**
   - Make sure Vuetify is properly installed and configured
   - Check that all required CSS is imported

2. **Validation not working**
   - Ensure validation rules are properly configured in the element props

3. **Drag and drop not working**
   - Make sure vuedraggable is installed and imported correctly

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Components Reference

### FormBuilder

#### Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `Object` | `{ title: 'New Form', elements: [] }` | Form schema object |
| `formOptions` | `Object` | `{}` | Additional options for customizing the builder |

#### Events

| Name | Parameters | Description |
|------|------------|-------------|
| `update:modelValue` | `schema: Object` | Emitted when the form schema changes |
| `save` | `schema: Object` | Emitted when the save button is clicked |

### FormRenderer

#### Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `formData` | `Object` | Required | Form schema created by FormBuilder |
| `initialValues` | `Object` | `{}` | Initial values for form fields |
| `readOnly` | `Boolean` | `false` | Whether the form should be in read-only mode |

#### Events

| Name | Parameters | Description |
|------|------------|-------------|
| `save` | `values: Object` | Emitted when the form is submitted |
| `update:modelValue` | `values: Object` | Emitted when form values change |

### SignaturePad

#### Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `String` | `''` | Base64 representation of the signature |
| `width` | `Number` | `400` | Width of the signature pad |
| `height` | `Number` | `200` | Height of the signature pad |
| `backgroundColor` | `String` | `'rgb(255, 255, 255)'` | Background color |
| `penColor` | `String` | `'rgb(0, 0, 0)'` | Color of the signature |
| `readOnly` | `Boolean` | `false` | Disable drawing when true |

#### Events

| Name | Parameters | Description |
|------|------------|-------------|
| `update:modelValue` | `data: String` | Emitted when the signature changes |

### FileDisplay

#### Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `fileData` | `Object/Array` | `null` | File data object(s) to display |

## Utilities

### FileHandler

A set of utility functions for handling files in forms.

#### Methods

| Name | Parameters | Returns | Description |
|------|------------|---------|-------------|
| `fileToBase64` | `file: File` | `Promise<string>` | Converts a File object to base64 string |
| `processFiles` | `files: File/File[]` | `Promise<Array>` | Process files to storage format |
| `base64ToUrl` | `base64Data: string` | `string` | Converts base64 to URL for display |
| `base64ToBlob` | `base64Data: string`, `contentType: string` | `Blob` | Converts base64 to Blob |
| `prepareFormForSubmission` | `formValues: Object`, `formElements: Array` | `Promise<Object>` | Prepares form data for submission |
| `prepareStoredFormForRendering` | `storedValues: Object`, `formElements: Array` | `Object` | Prepares stored data for display |

## Usage Examples

### Signature Pad Component

```vue
<template>
  <div>
    <h3>Signature Required</h3>
    <signature-pad
      v-model="signature"
      :width="500"
      :height="200"
      pen-color="blue"
    />
    
    <div class="mt-4">
      <v-btn @click="signature = ''">Clear</v-btn>
      <v-btn color="primary" @click="saveSignature">Save</v-btn>
    </div>
    
    <div v-if="signature" class="mt-4">
      <img :src="signature" alt="Signature" style="max-width: 100%;" />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { SignaturePad } from 'vue-form-builder';

export default {
  components: { SignaturePad },
  setup() {
    const signature = ref('');
    
    const saveSignature = () => {
      // The signature is already in base64 format ready for storage
      console.log('Signature saved:', signature.value);
    };
    
    return { signature, saveSignature };
  }
}
</script>
```

### Read-Only Form with File Display

```vue
<template>
  <form-renderer 
    :form-data="formSchema" 
    :initial-values="formValues"
    :read-only="true"
  />
</template>

<script>
import { ref } from 'vue';
import { FormRenderer } from 'vue-form-builder';

export default {
  components: { FormRenderer },
  setup() {
    const formSchema = ref({
      title: 'Submitted Application',
      elements: [
        // Form elements from your schema
        {
          id: 'resume',
          type: 'file',
          name: 'Resume',
          component: 'v-file-input',
          props: {
            label: 'Resume',
            accept: '.pdf,.doc,.docx',
            hint: 'Upload your resume'
          }
        },
        {
          id: 'signature',
          type: 'signature',
          name: 'Signature',
          component: 'signature-pad',
          props: {
            label: 'Signature',
            hint: 'Please sign here'
          }
        }
      ]
    });
    
    // Values that might be retrieved from a database
    const formValues = ref({
      resume: {
        name: 'resume.pdf',
        type: 'application/pdf',
        size: 12345,
        data: 'data:application/pdf;base64,JVBERi0xLjMKJcTl8uXrp...'
      },
      signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...'
    });
    
    return { formSchema, formValues };
  }
}
</script>
```

### File Handling for Database Storage

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
  components: { FormRenderer },
  setup() {
    const formSchema = ref({
      // Your form schema with file inputs
    });
    
    const formValues = ref({});
    
    const handleSubmit = async (values) => {
      // The FormRenderer already processes files internally,
      // but if you need additional processing:
      const processedData = await FileHandler.prepareFormForSubmission(
        values, 
        formSchema.value.elements
      );
      
      // Send to your API/backend
      await saveToDatabase(processedData);
    };
    
    return { formSchema, formValues, handleSubmit };
  }
}
</script>
```
