import FormBuilder from './components/FormBuilder.vue';
import FormRenderer from './components/FormRenderer.vue';
import SignaturePad from './components/SignaturePad.vue';
import FileDisplay from './components/FileDisplay.vue';
import * as FileHandler from './utils/FileHandler';
import './styles.css';

export { 
  FormBuilder, 
  FormRenderer, 
  SignaturePad, 
  FileDisplay,
  FileHandler
};

export default {
  install: (app, options) => {
    app.component('FormBuilder', FormBuilder);
    app.component('FormRenderer', FormRenderer);
    app.component('SignaturePad', SignaturePad);
    app.component('FileDisplay', FileDisplay);
  }
};
