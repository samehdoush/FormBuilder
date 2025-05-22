// vue-formbuilder-adapter.js
// This adapter file helps fix the Vue import issues with the FormBuilder package

// Import components directly from the package
import { FormBuilder as OriginalFormBuilder, FormRenderer as OriginalFormRenderer } from '@samehdoush/vue-formbuilder';

// Re-export with proper import handling to avoid Vue default import issues
export const FormBuilder = OriginalFormBuilder;
export const FormRenderer = OriginalFormRenderer;

// Important: Make sure to import the styles in your main file
// import '@samehdoush/vue-formbuilder/style.css';
