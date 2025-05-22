// This is a special entry file for the UMD build that bundles Vue
import * as Vue from 'vue';
import FormBuilder from './components/FormBuilder.vue';
import FormRenderer from './components/FormRenderer.vue';
import SignaturePad from './components/SignaturePad.vue';
import FileDisplay from './components/FileDisplay.vue';
import * as FileHandler from './utils/FileHandler';
import './styles.css';

// Manually add Vue to window for UMD builds
window.Vue = Vue;

// Export all components
export { 
  FormBuilder, 
  FormRenderer, 
  SignaturePad, 
  FileDisplay,
  FileHandler
};

// Default export for Vue plugin usage
export default {
  install: (app) => {
    app.component('FormBuilder', FormBuilder);
    app.component('FormRenderer', FormRenderer);
    app.component('SignaturePad', SignaturePad);
    app.component('FileDisplay', FileDisplay);
  }
};
