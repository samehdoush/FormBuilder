// Test script for Vue Form Builder
// This script tests basic functionality of the form builder components

import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import FormBuilder from './src/components/FormBuilder.vue';
import FormRenderer from './src/components/FormRenderer.vue';

// Mock the uuid function
vi.mock('uuid', () => ({
  v4: () => 'test-uuid'
}));

describe('FormBuilder Component', () => {
  it('renders properly', () => {
    const wrapper = mount(FormBuilder, {
      global: {
        // Mock vuetify components
        stubs: {
          'v-container': true,
          'v-row': true,
          'v-col': true,
          'v-card': true,
          'v-card-title': true,
          'v-card-text': true,
          'v-list': true,
          'v-list-item': true,
          'v-icon': true,
          'v-form': true,
          'v-btn': true,
          'draggable': true
        }
      }
    });
    
    expect(wrapper.vm).toBeDefined();
    expect(wrapper.html()).toContain('Form Designer');
    expect(wrapper.html()).toContain('Form Elements');
  });
  
  it('emits update:modelValue when form elements change', async () => {
    const wrapper = mount(FormBuilder, {
      global: {
        stubs: {
          'v-container': true,
          'v-row': true,
          'v-col': true,
          'v-card': true,
          'v-card-title': true,
          'v-card-text': true,
          'v-list': true,
          'v-list-item': true,
          'v-icon': true,
          'v-form': true,
          'v-btn': true,
          'draggable': true
        }
      }
    });
    
    // Access the component's internal formElements
    const testElement = {
      id: 'test-id',
      name: 'Test Field',
      type: 'text',
      component: 'v-text-field',
      props: { label: 'Test Label' }
    };
    
    // Simulate adding a new element
    wrapper.vm.addElement(testElement);
    
    // Check if update:modelValue is emitted
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    
    // Check if the emitted value contains the new element
    const emittedValue = wrapper.emitted('update:modelValue')[0][0];
    expect(emittedValue.elements).toContainEqual(expect.objectContaining({
      id: expect.any(String),
      type: 'text'
    }));
  });
});

describe('FormRenderer Component', () => {
  it('renders form elements based on schema', () => {
    const formData = {
      title: 'Test Form',
      elements: [
        {
          id: 'field1',
          type: 'text',
          component: 'v-text-field',
          props: {
            label: 'Name',
            placeholder: 'Enter your name'
          }
        }
      ]
    };
    
    const wrapper = mount(FormRenderer, {
      props: {
        formData
      },
      global: {
        stubs: {
          'v-form': true,
          'v-card': true,
          'v-card-title': true,
          'v-card-text': true,
          'v-card-actions': true,
          'v-text-field': true,
          'v-btn': true,
          'v-spacer': true
        }
      }
    });
    
    expect(wrapper.html()).toContain('Test Form');
    expect(wrapper.vm.formValues).toHaveProperty('field1');
  });
  
  it('emits save event when form is submitted', async () => {
    const formData = {
      title: 'Test Form',
      elements: [
        {
          id: 'field1',
          type: 'text',
          component: 'v-text-field',
          props: {
            label: 'Name'
          }
        }
      ]
    };
    
    const wrapper = mount(FormRenderer, {
      props: {
        formData
      },
      global: {
        stubs: {
          'v-form': {
            template: '<div><slot></slot></div>',
            methods: {
              validate: () => true
            }
          },
          'v-card': true,
          'v-card-title': true,
          'v-card-text': true,
          'v-card-actions': true,
          'v-text-field': true,
          'v-btn': true,
          'v-spacer': true
        }
      }
    });
    
    // Set form value
    wrapper.vm.formValues.field1 = 'Test Name';
    
    // Submit the form
    wrapper.vm.submitForm();
    
    // Check if save event is emitted with correct data
    expect(wrapper.emitted('save')).toBeTruthy();
    expect(wrapper.emitted('save')[0][0]).toEqual({
      field1: 'Test Name'
    });
  });
});
