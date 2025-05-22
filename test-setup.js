// Test setup file for mocking Vuetify components
import { config } from '@vue/test-utils';

// Mock all Vuetify components
const vuetifyComponents = [
  'v-container', 'v-row', 'v-col', 'v-card', 'v-card-title', 'v-card-text', 'v-card-actions',
  'v-list', 'v-list-item', 'v-icon', 'v-form', 'v-btn', 'v-text-field', 'v-checkbox',
  'v-select', 'v-textarea', 'v-expansion-panel', 'v-expansion-panel-title',
  'v-expansion-panel-text', 'v-expansion-panels', 'v-spacer', 'v-dialog', 'v-toolbar',
  'v-toolbar-title', 'v-autocomplete', 'v-radio', 'v-radio-group', 'v-switch',
  'v-file-input', 'draggable'
];

// Create a global component stub for each Vuetify component
const globalStubs = {};
vuetifyComponents.forEach(component => {
  globalStubs[component] = {
    template: `<div class="${component}" data-vuetify-component><slot></slot></div>`
  };
});

// Configure Vue Test Utils with global stubs
config.global.stubs = globalStubs;

// Add global mocks for component methods that might be used in tests
config.global.mocks = {
  $route: {},
  $router: {
    push: vi.fn()
  }
};

// Import vi from vitest to mock functions
import { vi } from 'vitest';
