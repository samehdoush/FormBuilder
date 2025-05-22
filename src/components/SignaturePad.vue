<template>
  <div class="signature-pad-container">
    <canvas ref="signaturePad" class="signature-pad" :width="width" :height="height"></canvas>
    <div class="signature-pad-actions" v-if="!readOnly">
      <v-btn
        v-if="modelValue"
        color="error"
        size="small"
        variant="outlined"
        @click="clear"
        class="mr-2"
      >
        Clear
      </v-btn>
      <v-btn
        color="primary"
        size="small"
        variant="outlined"
        @click="save"
      >
        Save
      </v-btn>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, watch } from 'vue';
import SignaturePad from 'signature_pad';

export default defineComponent({
  name: 'SignaturePad',
  
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 200
    },
    backgroundColor: {
      type: String,
      default: 'rgb(255, 255, 255)'
    },
    penColor: {
      type: String,
      default: 'rgb(0, 0, 0)'
    },
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  
  emits: ['update:modelValue'],
  
  setup(props, { emit }) {
    const signaturePadRef = ref(null);
    const signaturePad = ref(null);
    
    const initSignaturePad = () => {
      if (!signaturePadRef.value) return;
      
      signaturePad.value = new SignaturePad(signaturePadRef.value, {
        backgroundColor: props.backgroundColor,
        penColor: props.penColor,
      });
      
      // If read-only, disable drawing
      if (props.readOnly) {
        signaturePad.value.off();
      }
      
      // If an initial value is provided, restore it
      if (props.modelValue) {
        signaturePad.value.fromDataURL(props.modelValue);
      }
    };
    
    const clear = () => {
      if (signaturePad.value) {
        signaturePad.value.clear();
        emit('update:modelValue', '');
      }
    };
    
    const save = () => {
      if (signaturePad.value && !signaturePad.value.isEmpty()) {
        const data = signaturePad.value.toDataURL('image/png');
        emit('update:modelValue', data);
      }
    };
    
    // Watch for changes to the model value
    watch(() => props.modelValue, (newVal) => {
      if (signaturePad.value) {
        if (newVal) {
          signaturePad.value.fromDataURL(newVal);
        } else {
          signaturePad.value.clear();
        }
      }
    });
    
    // Watch for changes to readOnly
    watch(() => props.readOnly, (newVal) => {
      if (signaturePad.value) {
        if (newVal) {
          signaturePad.value.off();
        } else {
          signaturePad.value.on();
        }
      }
    });
    
    onMounted(() => {
      initSignaturePad();
    });
    
    return {
      signaturePad: signaturePadRef,
      clear,
      save
    };
  }
});
</script>

<style scoped>
.signature-pad-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.signature-pad {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  touch-action: none;
}

.signature-pad-actions {
  margin-top: 8px;
  display: flex;
  justify-content: center;
}
</style>
