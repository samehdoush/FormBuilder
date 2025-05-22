<template>
  <div class="form-renderer">
    <v-form ref="form" v-model="isFormValid" @submit.prevent="submitForm">
      <v-card>
        <v-card-title>{{ formData.title || 'Form' }}</v-card-title>
        <v-card-text>
          <div v-for="element in formData.elements" :key="element.id" class="mb-4">
            <!-- Text Field -->
            <v-text-field
              v-if="isTextField(element)"
              v-model="formValues[element.id]"
              :label="element.props.label"
              :placeholder="element.props.placeholder"
              :hint="element.props.hint"
              :type="element.props.type || 'text'"
              :variant="element.props.variant || 'outlined'"
              :density="element.props.density || 'comfortable'"
              :rules="generateRules(element)"
              :required="element.props.required"
              :counter="element.props.counter"
              :readonly="readOnly"
            ></v-text-field>

            <!-- Textarea -->
            <v-textarea
              v-else-if="element.type === 'textarea'"
              v-model="formValues[element.id]"
              :label="element.props.label"
              :placeholder="element.props.placeholder"
              :hint="element.props.hint"
              :rows="element.props.rows"
              :variant="element.props.variant || 'outlined'"
              :density="element.props.density || 'comfortable'"
              :rules="generateRules(element)"
              :required="element.props.required"
              :counter="element.props.counter"
              :readonly="readOnly"
            ></v-textarea>

            <!-- Select -->
            <v-select
              v-else-if="element.type === 'select'"
              v-model="formValues[element.id]"
              :label="element.props.label"
              :items="element.props.items"
              :hint="element.props.hint"
              :variant="element.props.variant || 'outlined'"
              :density="element.props.density || 'comfortable'"
              :rules="generateRules(element)"
              :required="element.props.required"
              :readonly="readOnly"
            ></v-select>

            <!-- Autocomplete -->
            <v-autocomplete
              v-else-if="element.type === 'autocomplete'"
              v-model="formValues[element.id]"
              :label="element.props.label"
              :items="element.props.items"
              :hint="element.props.hint"
              :variant="element.props.variant || 'outlined'"
              :density="element.props.density || 'comfortable'"
              :rules="generateRules(element)"
              :required="element.props.required"
              :readonly="readOnly"
            ></v-autocomplete>

            <!-- Checkbox -->
            <v-checkbox
              v-else-if="element.type === 'checkbox'"
              v-model="formValues[element.id]"
              :label="element.props.label"
              :hint="element.props.hint"
              :required="element.props.required"
              :rules="generateRules(element)"
              :readonly="readOnly"
              :disabled="readOnly"
            ></v-checkbox>

            <!-- Radio Group -->
            <v-radio-group
              v-else-if="element.type === 'radio'"
              v-model="formValues[element.id]"
              :label="element.props.label"
              :hint="element.props.hint"
              :rules="generateRules(element)"
              :required="element.props.required"
              :readonly="readOnly"
              :disabled="readOnly"
            >
              <v-radio
                v-for="item in element.props.items"
                :key="item.value"
                :label="item.title"
                :value="item.value"
              ></v-radio>
            </v-radio-group>

            <!-- Switch -->
            <v-switch
              v-else-if="element.type === 'switch'"
              v-model="formValues[element.id]"
              :label="element.props.label"
              :color="element.props.color || 'primary'"
              :hint="element.props.hint"
              :required="element.props.required"
              :rules="generateRules(element)"
              :readonly="readOnly"
              :disabled="readOnly"
            ></v-switch>

            <!-- File Input -->
            <v-file-input
              v-else-if="element.type === 'file' && !readOnly"
              v-model="formValues[element.id]"
              :label="element.props.label"
              :hint="element.props.hint"
              :accept="element.props.accept"
              :multiple="element.props.multiple"
              :variant="element.props.variant || 'outlined'"
              :density="element.props.density || 'comfortable'"
              :rules="generateRules(element)"
              :required="element.props.required"
              :readonly="readOnly"
              :disabled="readOnly"
            ></v-file-input>
              <!-- File Display (Read-only mode) -->
            <div v-else-if="element.type === 'file' && readOnly" class="mb-3">
              <label class="text-body-1 mb-1 d-block">{{ element.props.label }}</label>
              <file-display 
                :file-data="formValues[element.id]" 
                class="mt-2 mb-2 pa-2 border rounded"
              />
              <div class="text-caption text-grey">{{ element.props.hint }}</div>
            </div>

            <!-- Signature Pad -->
            <div v-else-if="element.type === 'signature'" class="mb-3">
              <label class="text-body-1 mb-1 d-block">{{ element.props.label }}</label>
              <signature-pad
                v-model="formValues[element.id]"
                :width="element.props.width || 400"
                :height="element.props.height || 200"
                :pen-color="element.props.penColor"
                :background-color="element.props.backgroundColor"
                :read-only="readOnly"
              ></signature-pad>
              <div class="text-caption text-grey">{{ element.props.hint }}</div>
            </div>
          </div>
        </v-card-text>
        
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <template v-if="!readOnly">
            <v-btn
              color="grey-darken-1"
              variant="text"
              @click="resetForm"
            >
              Reset
            </v-btn>
            <v-btn
              color="primary"
              type="submit"
              :disabled="!isFormValid"
              @click="submitForm"
            >
              Save
            </v-btn>
          </template>
        </v-card-actions>
      </v-card>
    </v-form>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, computed, watch } from 'vue';
import SignaturePad from './SignaturePad.vue';
import FileDisplay from './FileDisplay.vue';
import { prepareFormForSubmission, prepareStoredFormForRendering } from '../utils/FileHandler';

export default defineComponent({
  name: 'FormRenderer',
  
  components: {
    SignaturePad,
    FileDisplay
  },
  
  props: {
    formData: {
      type: Object,
      required: true,
      default: () => ({
        title: '',
        elements: []
      })
    },
    initialValues: {
      type: Object,
      default: () => ({})
    },
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  
  emits: ['save', 'update:modelValue'],
  
  setup(props, { emit }) {
    const form = ref(null);
    const isFormValid = ref(true);
    const formValues = reactive({});
      // Initialize form values with initial values if provided
    watch(() => props.formData.elements, (elements) => {
      if (elements) {
        elements.forEach(element => {
          if (props.initialValues && props.initialValues[element.id] !== undefined) {
            // Handle special cases for certain types of form elements
            if (element.type === 'file') {
              // For file inputs, ensure the data is in the correct format for both editing and display
              const fileValue = props.initialValues[element.id];
              
              // If we're in read-only mode and the file data is already processed for storage
              // (i.e., it's an object with name, type, size, data properties)
              if (props.readOnly && fileValue && 
                  (Array.isArray(fileValue) || 
                   (typeof fileValue === 'object' && fileValue.data))) {
                formValues[element.id] = fileValue;
              } else {
                // For edit mode, we might need to handle the file differently
                formValues[element.id] = fileValue;
              }
            } else {
              // For all other input types
              formValues[element.id] = props.initialValues[element.id];
            }
          } else {
            // Initialize with default values based on type
            switch (element.type) {
              case 'checkbox':
              case 'switch':
                formValues[element.id] = false;
                break;
              case 'select':
              case 'radio':
                if (element.props.items && element.props.items.length > 0) {
                  formValues[element.id] = null;
                }
                break;
              case 'file':
                formValues[element.id] = null;
                break;
              default:
                formValues[element.id] = '';
                break;
            }
          }
        });
      }
    }, { immediate: true, deep: true });
    
    // Helper function to check if element is a text field type
    const isTextField = (element) => {
      const textTypes = ['text', 'email', 'password', 'number', 'date', 'time'];
      return element.type === 'text' || textTypes.includes(element.props?.type);
    };
    
    // Generate validation rules for an element
    const generateRules = (element) => {
      const rules = [];
      const props = element.props || {};
      
      // Required rule
      if (props.required || (props.rules && props.rules.required)) {
        rules.push(v => !!v || `${props.label} is required`);
      }
      
      // Email validation
      if (element.type === 'email' || (props.rules && props.rules.email)) {
        const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        rules.push(v => !v || emailPattern.test(v) || 'Please enter a valid email');
      }
      
      // Min length validation
      if (props.rules && props.rules.minLength && props.rules.minLength.enabled) {
        const minLen = parseInt(props.rules.minLength.value) || 0;
        rules.push(v => !v || v.length >= minLen || `Minimum ${minLen} characters`);
      }
      
      // Max length validation
      if (props.rules && props.rules.maxLength && props.rules.maxLength.enabled) {
        const maxLen = parseInt(props.rules.maxLength.value) || 999;
        rules.push(v => !v || v.length <= maxLen || `Maximum ${maxLen} characters`);
      }
      
      return rules;
    };
    
    // Submit the form
    const submitForm = async () => {
      if (form.value && form.value.validate()) {
        // Process files and prepare data for submission
        const processedFormData = await prepareFormForSubmission(formValues, props.formData.elements);
        
        // Emit processed form data for saving to database
        emit('save', processedFormData);
        emit('update:modelValue', processedFormData);
      }
    };
    
    // Reset the form
    const resetForm = () => {
      form.value && form.value.reset();
    };
    
    return {
      form,
      isFormValid,
      formValues,
      isTextField,
      generateRules,
      submitForm,
      resetForm
    };
  }
});
</script>

<style scoped>
.form-renderer {
  width: 100%;
}
</style>
