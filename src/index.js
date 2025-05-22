// Import components but handle Vue imports carefully
import FormBuilder from './components/FormBuilder.vue';
import FormRenderer from './components/FormRenderer.vue';
import SignaturePad from './components/SignaturePad.vue';
import FileDisplay from './components/FileDisplay.vue';
import * as FileHandler from './utils/FileHandler';
import './styles.css';

// Named exports for individual components
export { 
  FormBuilder, 
  FormRenderer, 
  SignaturePad, 
  FileDisplay,
  FileHandler
};

// Vue plugin installer (named export)
export function install(app) {
  app.component('FormBuilder', FormBuilder);
  app.component('FormRenderer', FormRenderer);
  app.component('SignaturePad', SignaturePad);
  app.component('FileDisplay', FileDisplay);
}

// Default export ONLY as a named property to avoid default import issues
export const VueFormBuilder = {
  install
};
