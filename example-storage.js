/**
 * Example of file storage integration
 * This demonstrates how to use the FileHandler utilities
 * to process and store form data with file uploads
 */

import { FileHandler } from './src/index';

/**
 * Process form submission with files
 * 
 * @param {Object} formData - The form values from FormRenderer
 * @param {Array} formElements - The form elements configuration
 * @returns {Object} - Processed data ready for database storage
 */
async function processFormSubmission(formData, formElements) {
  try {
    // Process files and signatures for storage
    const processedData = await FileHandler.prepareFormForSubmission(
      formData, 
      formElements
    );
    
    console.log('Files processed for database storage:', processedData);
    
    // Here you would save the data to your database
    // Example with fetch:
    /*
    const response = await fetch('/api/forms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(processedData)
    });
    
    return await response.json();
    */
    
    return processedData;
  } catch (error) {
    console.error('Error processing form submission:', error);
    throw error;
  }
}

/**
 * Load saved form data
 * 
 * @param {String} formId - The ID of the saved form to load
 * @param {Array} formElements - The form elements configuration
 * @returns {Object} - Form data prepared for rendering
 */
async function loadSavedForm(formId, formElements) {
  try {
    // Here you would load data from your database
    // Example with fetch:
    /*
    const response = await fetch(`/api/forms/${formId}`);
    const savedData = await response.json();
    */
    
    // For demo, create some sample saved data
    const savedData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      message: 'This is a test message with file attachments',
      profilePicture: {
        name: 'profile.jpg',
        type: 'image/jpeg',
        size: 12345,
        data: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/...'
      },
      signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...'
    };
    
    // Prepare the data for rendering in the form
    const preparedData = FileHandler.prepareStoredFormForRendering(
      savedData, 
      formElements
    );
    
    console.log('Form data prepared for rendering:', preparedData);
    return preparedData;
    
  } catch (error) {
    console.error('Error loading saved form:', error);
    throw error;
  }
}

// Example usage with FormRenderer component:
/*
<script>
import { ref, onMounted } from 'vue';
import { FormRenderer } from 'vue-form-builder';
import { processFormSubmission, loadSavedForm } from './example-storage';

export default {
  components: {
    FormRenderer
  },
  setup() {
    const formSchema = ref({
      title: 'User Profile Form',
      elements: [
        // Form elements definition
      ]
    });
    
    const formValues = ref({});
    const isReadOnly = ref(false);
    
    onMounted(async () => {
      // Load saved form data
      try {
        formValues.value = await loadSavedForm('form123', formSchema.value.elements);
      } catch (error) {
        console.error('Failed to load form data');
      }
    });
    
    const handleSubmit = async (values) => {
      try {
        const savedData = await processFormSubmission(values, formSchema.value.elements);
        console.log('Form saved successfully:', savedData);
      } catch (error) {
        console.error('Failed to save form');
      }
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
*/

export {
  processFormSubmission,
  loadSavedForm
};
