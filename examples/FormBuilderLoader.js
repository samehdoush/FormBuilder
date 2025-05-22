// FormBuilderLoader.js - This file handles the dynamic loading of the FormBuilder
import { defineAsyncComponent } from 'vue';

// Create a reference to the window global for UMD loaded component
let VueFormBuilderGlobal = null;

// Load the UMD script and setup the global
function loadUmdScript() {
  return new Promise((resolve, reject) => {
    if (window.VueFormBuilder) {
      VueFormBuilderGlobal = window.VueFormBuilder;
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@samehdoush/vue-formbuilder@1.0.5/dist/vue-form-builder.umd.js';
    script.async = true;
    script.onload = () => {
      VueFormBuilderGlobal = window.VueFormBuilder;
      resolve();
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Export components through a safer loading mechanism
export const FormBuilder = defineAsyncComponent(() => {
  return loadUmdScript().then(() => {
    if (!VueFormBuilderGlobal) {
      throw new Error('Failed to load VueFormBuilder');
    }
    
    // Return a component factory
    return {
      // Use a simple render function
      setup(props, { emit }) {
        return () => {
          const vNode = h(VueFormBuilderGlobal.FormBuilder, {
            ...props,
            'onUpdate:modelValue': (val) => emit('update:modelValue', val),
            onSave: (val) => emit('save', val)
          });
          return vNode;
        };
      }
    };
  });
});

// Similarly for FormRenderer
export const FormRenderer = defineAsyncComponent(() => {
  return loadUmdScript().then(() => {
    if (!VueFormBuilderGlobal) {
      throw new Error('Failed to load VueFormBuilder');
    }
    
    return {
      setup(props, { emit }) {
        return () => {
          const vNode = h(VueFormBuilderGlobal.FormRenderer, {
            ...props,
            'onUpdate:modelValue': (val) => emit('update:modelValue', val),
            onSave: (val) => emit('save', val)
          });
          return vNode;
        };
      }
    };
  });
});
