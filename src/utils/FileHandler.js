/**
 * FileHandler utility for managing file uploads in form builder
 * Provides methods for processing files, converting to base64, and preparing for storage
 */

/**
 * Convert a file to a base64 string
 * 
 * @param {File} file - The file to convert
 * @returns {Promise<string>} - Base64 string representation of the file
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve(null);
      return;
    }
    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Process multiple files to base64
 * 
 * @param {File[]} files - Array of files to process
 * @returns {Promise<Array<{name: string, type: string, size: number, data: string}>>} - Array of processed file objects
 */
export const processFiles = async (files) => {
  if (!files || files.length === 0) return null;
  
  // Handle single file that's not in array form
  if (!Array.isArray(files)) {
    files = [files];
  }
  
  const processed = await Promise.all(
    Array.from(files).map(async (file) => {
      const base64 = await fileToBase64(file);
      return {
        name: file.name,
        type: file.type,
        size: file.size,
        data: base64
      };
    })
  );
  
  return processed;
};

/**
 * Generate a URL from base64 data
 * 
 * @param {string} base64Data - Base64 string of file data
 * @returns {string|null} - URL that can be used to display the file
 */
export const base64ToUrl = (base64Data) => {
  if (!base64Data) return null;
  return base64Data; // Already a data URL
};

/**
 * Create a Blob from base64 data
 * 
 * @param {string} base64Data - Base64 string of file data
 * @param {string} contentType - The MIME type of the data
 * @returns {Blob} - A Blob representing the file
 */
export const base64ToBlob = (base64Data, contentType = '') => {
  if (!base64Data) return null;
  
  // Extract the base64 content from data URL
  const base64Content = base64Data.split(',')[1];
  const byteCharacters = atob(base64Content);
  
  const byteArrays = [];
  const sliceSize = 512;
  
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  
  return new Blob(byteArrays, { type: contentType });
};

/**
 * Process form values for submission to backend/database
 * Handles files, signatures, etc.
 * 
 * @param {Object} formValues - The form values to process
 * @param {Array} formElements - The form elements configuration
 * @returns {Promise<Object>} - Processed form values ready for storage
 */
export const prepareFormForSubmission = async (formValues, formElements) => {
  const processedValues = { ...formValues };
  
  // Process each field based on its type
  for (const element of formElements) {
    const value = formValues[element.id];
    
    if (element.type === 'file' && value) {
      processedValues[element.id] = await processFiles(value);
    }
    
    // Signatures are already stored as base64 strings
    if (element.type === 'signature') {
      // No additional processing needed as signature pad already returns base64
    }
  }
  
  return processedValues;
};

/**
 * Process stored form data for rendering in the form
 * Converts stored data representations back to format expected by form components
 * 
 * @param {Object} storedValues - The values retrieved from storage
 * @param {Array} formElements - The form elements configuration
 * @returns {Object} - Form values prepared for rendering
 */
export const prepareStoredFormForRendering = (storedValues, formElements) => {
  const processedValues = { ...storedValues };
  
  // Custom processing for stored values if needed
  for (const element of formElements) {
    const value = storedValues[element.id];
    
    // Handle any special processing for retrieved values here
    // For example, files might need to be converted from storage format back to display format
  }
  
  return processedValues;
};

export default {
  fileToBase64,
  processFiles,
  base64ToUrl,
  base64ToBlob,
  prepareFormForSubmission,
  prepareStoredFormForRendering
};
