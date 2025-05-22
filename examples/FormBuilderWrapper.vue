<!-- FormBuilderWrapper.vue -->
<template>
  <div class="form-builder-wrapper">
    <component 
      :is="formBuilderComponent" 
      v-model="localValue"
      v-bind="$attrs"
      @save="$emit('save', $event)"
    />
  </div>
</template>

<script>
import { defineComponent, ref, watch } from 'vue';
import '@samehdoush/vue-formbuilder/style.css';

export default defineComponent({
  name: 'FormBuilderWrapper',
  props: {
    modelValue: Object
  },
  emits: ['update:modelValue', 'save'],
  setup(props, { emit }) {
    // Local reactive value that syncs with v-model
    const localValue = ref(props.modelValue || { title: '', elements: [] });
    
    // Watch for external changes
    watch(() => props.modelValue, (newVal) => {
      if (newVal) localValue.value = newVal;
    });
    
    // Watch for internal changes
    watch(localValue, (newVal) => {
      emit('update:modelValue', newVal);
    });

    // Create a placeholder component that will be replaced by the actual FormBuilder
    const formBuilderComponent = defineComponent({
      created() {
        // Load the component dynamically 
        import('./FormBuilderLoader.js').then(module => {
          this.actualComponent = module.FormBuilder;
        });
      },
      data() {
        return {
          actualComponent: null
        };
      },
      render() {
        return this.actualComponent 
          ? h(this.actualComponent, { ...this.$attrs, modelValue: localValue.value, 'onUpdate:modelValue': v => localValue.value = v })
          : h('div', 'Loading form builder...');
      }
    });

    return {
      localValue,
      formBuilderComponent
    };
  }
});
</script>
