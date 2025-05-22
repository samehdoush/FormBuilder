<template>
  <div class="form-builder">
    <v-container fluid>
      <v-row>
        <!-- Toolbox with available form elements -->
        <v-col cols="3" class="form-builder-toolbox">
          <v-card>
            <v-card-title class="text-h6">Form Elements</v-card-title>
            <v-card-text>
              <draggable
                :list="availableElements"
                :sort="false"
                :group="{ name: 'form-elements', pull: 'clone', put: false }"
                item-key="name"
                :clone="cloneElement"
                class="toolbox-elements"
              >
                <template #item="{ element }">
                  <v-list-item
                    :title="element.name"
                    class="cursor-move"
                  >
                    <template v-slot:prepend>
                      <v-icon :icon="element.icon"></v-icon>
                    </template>
                  </v-list-item>
                </template>
              </draggable>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Form building canvas -->
        <v-col cols="9">
          <v-card class="form-builder-canvas">
            <v-card-title class="d-flex justify-space-between align-center">
              <span>Form Designer</span>
              <div>
                <v-btn 
                  color="success" 
                  variant="outlined" 
                  class="mr-2"
                  @click="previewForm"
                >
                  Preview
                </v-btn>
                <v-btn 
                  color="primary" 
                  @click="saveForm"
                >
                  Save
                </v-btn>
              </div>
            </v-card-title>
            <v-card-text>
              <v-form ref="form">
                <draggable 
                  v-model="formElements" 
                  group="form-elements"
                  item-key="id"
                  handle=".drag-handle"
                  class="min-h-[300px] form-canvas"
                >
                  <template #item="{ element }">
                    <div class="form-element">
                      <div class="d-flex align-center justify-space-between mb-2">
                        <div class="d-flex align-center">
                          <v-icon 
                            class="drag-handle cursor-move mr-2" 
                            icon="mdi-drag"
                          ></v-icon>
                          <span class="font-weight-bold">{{ element.name }}</span>
                        </div>
                        <div>
                          <v-icon 
                            class="mr-2 form-builder-edit" 
                            icon="mdi-pencil"
                            @click="editElement(formElements.findIndex(el => el.id === element.id))"
                          ></v-icon>
                          <v-icon 
                            class="form-builder-delete" 
                            icon="mdi-delete"
                            @click="removeElement(formElements.findIndex(el => el.id === element.id))"
                          ></v-icon>
                        </div>
                      </div>

                      <component 
                        :is="element.component" 
                        v-bind="element.props"
                        :disabled="true"
                      />
                    </div>
                  </template>
                </draggable>
                <div v-if="formElements.length === 0" class="text-center py-8 text-gray-500">
                  Drag and drop form elements here
                </div>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Element Editor Dialog -->
    <v-dialog v-model="elementEditorDialog" max-width="600px">
      <v-card>
        <v-card-title>Edit {{ currentElement?.name }}</v-card-title>
        <v-card-text>
          <v-form v-if="currentElement">
            <v-text-field 
              v-model="currentElement.props.label" 
              label="Field Label"
            ></v-text-field>

            <v-text-field 
              v-model="currentElement.props.hint" 
              label="Field Hint"
            ></v-text-field>

            <v-checkbox 
              v-model="currentElement.props.required" 
              label="Required Field"
            ></v-checkbox>

            <!-- Type-specific options -->
            <div v-if="currentElement.type === 'text'">
              <v-select
                v-model="currentElement.props.variant"
                :items="['outlined', 'filled', 'plain', 'solo', 'underlined']"
                label="Variant"
              ></v-select>
            </div>

            <div v-if="currentElement.type === 'select' || currentElement.type === 'autocomplete'">
              <v-textarea
                v-model="optionsText"
                label="Options (one per line)"
                hint="Enter each option on a new line. For value:label pairs, use 'value:label'"
                persistent-hint
              ></v-textarea>
            </div>

            <div v-if="currentElement.type === 'checkbox' || currentElement.type === 'radio'">
              <v-textarea
                v-model="optionsText"
                label="Options (one per line)"
                hint="Enter each option on a new line. For value:label pairs, use 'value:label'"
                persistent-hint
              ></v-textarea>
            </div>

            <div v-if="currentElement.type === 'file'">
              <v-checkbox
                v-model="currentElement.props.multiple"
                label="Allow multiple files"
              ></v-checkbox>
              <v-text-field
                v-model="currentElement.props.accept"
                label="Accepted file types"
                hint="e.g., .jpg, .png, .pdf"
                persistent-hint
              ></v-text-field>
            </div>

            <div v-if="['text', 'textarea', 'password', 'email'].includes(currentElement.type)">
              <v-text-field
                v-model="currentElement.props.placeholder"
                label="Placeholder"
              ></v-text-field>
              
              <v-text-field
                v-model="currentElement.props.counter"
                label="Counter"
                type="number"
              ></v-text-field>
            </div>

            <!-- Validation -->
            <v-expansion-panels v-if="hasValidation(currentElement)">
              <v-expansion-panel>
                <v-expansion-panel-title>Validation Rules</v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-checkbox
                    v-model="currentElement.props.rules.required"
                    label="Required"
                  ></v-checkbox>
                  
                  <div v-if="['email', 'text'].includes(currentElement.type)">
                    <v-checkbox
                      v-model="currentElement.props.rules.email"
                      label="Email Format"
                    ></v-checkbox>
                  </div>
                  
                  <div v-if="['text', 'textarea', 'password'].includes(currentElement.type)">
                    <v-checkbox
                      v-model="currentElement.props.rules.minLength.enabled"
                      label="Minimum Length"
                    ></v-checkbox>
                    <v-text-field
                      v-if="currentElement.props.rules.minLength.enabled"
                      v-model="currentElement.props.rules.minLength.value"
                      label="Min Length"
                      type="number"
                    ></v-text-field>
                    
                    <v-checkbox
                      v-model="currentElement.props.rules.maxLength.enabled"
                      label="Maximum Length"
                    ></v-checkbox>
                    <v-text-field
                      v-if="currentElement.props.rules.maxLength.enabled"
                      v-model="currentElement.props.rules.maxLength.value"
                      label="Max Length"
                      type="number"
                    ></v-text-field>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" variant="text" @click="elementEditorDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="updateElement">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Preview Dialog -->
    <v-dialog v-model="previewDialog" fullscreen>
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>Form Preview</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="previewDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <form-renderer :form-data="formJson" @save="onPreviewSave"></form-renderer>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import FormRenderer from './FormRenderer.vue';
import SignaturePad from './SignaturePad.vue';
import draggable from 'vuedraggable';

export default defineComponent({
  name: 'FormBuilder',
    components: {
    FormRenderer,
    SignaturePad,
    draggable,
  },

  props: {
    modelValue: {
      type: Object,
      default: () => ({
        title: 'New Form',
        elements: []
      })
    },
    
    formOptions: {
      type: Object,
      default: () => ({})
    }
  },

  emits: ['update:modelValue', 'save'],

  setup(props, { emit }) {
    const formElements = ref([]);
    const currentElementIndex = ref(null);
    const currentElement = ref(null);
    const elementEditorDialog = ref(false);
    const previewDialog = ref(false);
    const optionsText = ref('');
    
    // Form title
    const formTitle = ref(props.modelValue?.title || 'New Form');

    // Available element types
    const availableElements = [
      {
        name: 'Text Field',
        type: 'text',
        icon: 'mdi-form-textbox',
        component: 'v-text-field',
        props: {
          label: 'Text Field',
          placeholder: '',
          hint: '',
          variant: 'outlined',
          density: 'comfortable',
          required: false,
          rules: {
            required: false,
            minLength: { enabled: false, value: 3 },
            maxLength: { enabled: false, value: 50 }
          }
        }
      },
      {
        name: 'Email Field',
        type: 'email',
        icon: 'mdi-email-outline',
        component: 'v-text-field',
        props: {
          label: 'Email',
          placeholder: 'Enter your email',
          type: 'email',
          hint: '',
          variant: 'outlined',
          density: 'comfortable',
          required: false,
          rules: {
            required: false,
            email: true,
          }
        }
      },
      {
        name: 'Password Field',
        type: 'password',
        icon: 'mdi-lock-outline',
        component: 'v-text-field',
        props: {
          label: 'Password',
          placeholder: 'Enter your password',
          type: 'password',
          hint: '',
          variant: 'outlined',
          density: 'comfortable',
          required: false,
          rules: {
            required: false,
            minLength: { enabled: false, value: 8 }
          }
        }
      },
      {
        name: 'Number Field',
        type: 'number',
        icon: 'mdi-numeric',
        component: 'v-text-field',
        props: {
          label: 'Number',
          type: 'number',
          hint: '',
          variant: 'outlined',
          density: 'comfortable',
          required: false,
          rules: {
            required: false,
          }
        }
      },
      {
        name: 'Textarea',
        type: 'textarea',
        icon: 'mdi-text-box-outline',
        component: 'v-textarea',
        props: {
          label: 'Text Area',
          placeholder: '',
          rows: 3,
          hint: '',
          variant: 'outlined',
          density: 'comfortable',
          required: false,
          rules: {
            required: false,
          }
        }
      },
      {
        name: 'Select',
        type: 'select',
        icon: 'mdi-menu-down',
        component: 'v-select',
        props: {
          label: 'Select',
          items: [],
          hint: '',
          variant: 'outlined',
          density: 'comfortable',
          required: false,
          rules: {
            required: false,
          }
        }
      },
      {
        name: 'Autocomplete',
        type: 'autocomplete',
        icon: 'mdi-text-search',
        component: 'v-autocomplete',
        props: {
          label: 'Autocomplete',
          items: [],
          hint: '',
          variant: 'outlined',
          density: 'comfortable',
          required: false,
          rules: {
            required: false,
          }
        }
      },
      {
        name: 'Checkbox',
        type: 'checkbox',
        icon: 'mdi-checkbox-marked-outline',
        component: 'v-checkbox',
        props: {
          label: 'Checkbox',
          hint: '',
          required: false,
          rules: {
            required: false,
          }
        }
      },
      {
        name: 'Radio Group',
        type: 'radio',
        icon: 'mdi-radiobox-marked',
        component: 'v-radio-group',
        props: {
          label: 'Radio Group',
          items: [
            { title: 'Option 1', value: 'option1' },
            { title: 'Option 2', value: 'option2' }
          ],
          hint: '',
          required: false,
          rules: {
            required: false,
          }
        }
      },
      {
        name: 'Switch',
        type: 'switch',
        icon: 'mdi-toggle-switch-outline',
        component: 'v-switch',
        props: {
          label: 'Switch',
          hint: '',
          required: false,
          color: 'primary',
          rules: {
            required: false,
          }
        }
      },
      {
        name: 'Date Picker',
        type: 'date',
        icon: 'mdi-calendar',
        component: 'v-text-field',
        props: {
          label: 'Date',
          type: 'date',
          hint: '',
          variant: 'outlined',
          density: 'comfortable',
          required: false,
          rules: {
            required: false,
          }
        }
      },
      {
        name: 'Time Picker',
        type: 'time',
        icon: 'mdi-clock-outline',
        component: 'v-text-field',
        props: {
          label: 'Time',
          type: 'time',
          hint: '',
          variant: 'outlined',
          density: 'comfortable',
          required: false,
          rules: {
            required: false,
          }
        }
      },
      {
        name: 'File Input',
        type: 'file',
        icon: 'mdi-file-upload-outline',
        component: 'v-file-input',
        props: {
          label: 'File',
          hint: '',
          variant: 'outlined',
          density: 'comfortable',
          accept: '',
          multiple: false,
          required: false,
          rules: {
            required: false,
          }
        }
      },
      {
        name: 'Signature',
        type: 'signature',
        icon: 'mdi-draw-pen',
        component: 'signature-pad',
        props: {
          label: 'Signature',
          hint: 'Please sign here',
          width: 400,
          height: 200,
          penColor: 'rgb(0, 0, 0)',
          backgroundColor: 'rgb(255, 255, 255)',
          required: false,
          rules: {
            required: false,
          }
        }
      },
    ];

    // Handle initial form data if provided
    if (props.modelValue && props.modelValue.elements?.length > 0) {
      formElements.value = JSON.parse(JSON.stringify(props.modelValue.elements));
    }

    // Computed property for the form JSON output
    const formJson = computed(() => ({
      title: formTitle.value,
      elements: formElements.value.map(el => ({
        id: el.id,
        type: el.type,
        component: el.component,
        props: el.props
      }))
    }));

    // Watch for changes in formElements and emit update to parent
    watch(formJson, (newVal) => {
      emit('update:modelValue', newVal);
    }, { deep: true });

    // Add a new element to the form
    const addElement = (element) => {
      const newElement = JSON.parse(JSON.stringify(element));
      newElement.id = uuidv4();
      formElements.value.push(newElement);
    };

    // Remove an element from the form
    const removeElement = (index) => {
      formElements.value.splice(index, 1);
    };

    // Open the element editor dialog
    const editElement = (index) => {
      currentElementIndex.value = index;
      currentElement.value = JSON.parse(JSON.stringify(formElements.value[index]));
      
      // Set options text for select/autocomplete/checkbox/radio
      if (['select', 'autocomplete', 'checkbox', 'radio'].includes(currentElement.value.type)) {
        optionsText.value = (currentElement.value.props.items || [])
          .map(item => {
            if (typeof item === 'object') {
              return `${item.value}:${item.title}`;
            }
            return item;
          })
          .join('\n');
      }
      
      elementEditorDialog.value = true;
    };

    // Update the element after editing
    const updateElement = () => {
      // Process options for select/autocomplete/checkbox/radio
      if (['select', 'autocomplete', 'checkbox', 'radio'].includes(currentElement.value.type)) {
        const items = optionsText.value.split('\n').filter(item => item.trim() !== '').map(item => {
          if (item.includes(':')) {
            const [value, title] = item.split(':');
            return { value: value.trim(), title: title.trim() };
          }
          return { value: item.trim(), title: item.trim() };
        });
        
        currentElement.value.props.items = items;
      }
      
      // Update the element in the form
      formElements.value[currentElementIndex.value] = currentElement.value;
      elementEditorDialog.value = false;
    };

    // Check if element has validation options
    const hasValidation = (element) => {
      return element && ['text', 'email', 'password', 'textarea', 'number', 'select', 'autocomplete'].includes(element.type);
    };
    
    // Preview the form
    const previewForm = () => {
      previewDialog.value = true;
    };
    
    // Clone an element when dragging from toolbox
    const cloneElement = (element) => {
      const cloned = JSON.parse(JSON.stringify(element));
      cloned.id = uuidv4();
      return cloned;
    };
    
    // Save the form schema
    const saveForm = () => {
      emit('save', formJson.value);
    };
    
    // Handle save event from preview
    const onPreviewSave = (data) => {
      console.log('Form data from preview:', data);
      previewDialog.value = false;
    };

    return {
      formElements,
      availableElements,
      currentElement,
      currentElementIndex,
      elementEditorDialog,
      optionsText,
      formTitle,
      formJson,
      previewDialog,
      hasValidation,
      addElement,
      removeElement,
      editElement,
      updateElement,
      previewForm,
      saveForm,
      onPreviewSave,
      cloneElement,
    };
  }
});
</script>

<style scoped>
.form-builder {
  width: 100%;
}

.cursor-move {
  cursor: move;
}

.cursor-pointer {
  cursor: pointer;
}

.form-element {
  padding: 12px;
  margin-bottom: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.form-canvas {
  min-height: 300px;
  padding: 10px;
  border: 1px dashed #ccc;
  background-color: #fafafa;
}

.form-canvas.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  font-style: italic;
  color: #999;
}

.toolbox-elements .v-list-item {
  transition: background-color 0.2s, transform 0.2s;
  margin-bottom: 5px;
  border: 1px solid #eee;
  border-radius: 4px;
}

.toolbox-elements .v-list-item:hover {
  background-color: #f0f0f0;
  transform: translateX(3px);
}

/* Drag ghost styling */
.sortable-ghost {
  opacity: 0.4;
  background: #c8ebfb !important;
}

.sortable-drag {
  opacity: 0.9;
  transform: rotate(3deg);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}
</style>
