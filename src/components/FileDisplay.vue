<template>
  <div class="file-display-component">
    <div v-if="!fileData || fileData.length === 0" class="text-body-2 text-grey">
      No file uploaded
    </div>
    <div v-else>
      <div v-for="(file, index) in normalizedFileData" :key="index" class="file-item">
        <v-icon class="mr-2" :icon="getFileIcon(file)"></v-icon>
        <span class="file-name">{{ file.name }}</span>
        <span v-if="file.size" class="text-caption text-grey ml-2">
          ({{ formatFileSize(file.size) }})
        </span>
        <v-btn
          v-if="canPreview(file)"
          class="ml-2"          size="x-small"
          variant="text"
          color="primary"
          @click="openPreview(file)"
        >
          Preview
        </v-btn>
        <v-btn
          v-else
          class="ml-2"
          size="x-small"
          variant="text"
          color="primary"
          @click="downloadFile(file)"
        >
          Download
        </v-btn>
      </div>
    </div>
    
    <!-- File Preview Dialog -->
    <v-dialog v-model="previewDialog" max-width="800">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>{{ previewFile ? previewFile.name : 'File Preview' }}</span>
          <v-btn icon @click="previewDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="text-center">
          <div v-if="previewFile && previewFile.data">
            <!-- Image Preview -->
            <img
              v-if="isImageFile(previewFile)"
              :src="previewFile.data"
              class="preview-image"
              alt="File Preview"
            />
            
            <!-- PDF Preview -->
            <iframe
              v-else-if="isPdfFile(previewFile)"
              :src="previewFile.data"
              class="preview-pdf"
              width="100%"
              height="600"
            ></iframe>
            
            <!-- Text/Code Preview -->
            <pre v-else-if="isTextFile(previewFile)" class="preview-text">
              {{ previewTextContent }}
            </pre>
            
            <!-- Generic File -->
            <div v-else class="text-center py-5">
              <v-icon size="64" color="grey">mdi-file-document-outline</v-icon>
              <div class="mt-2">Preview not available for this file type</div>
              <v-btn
                color="primary"
                class="mt-4"
                @click="downloadFile(previewFile)"
              >
                Download File
              </v-btn>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import { base64ToBlob } from '../utils/FileHandler';

export default defineComponent({
  name: 'FileDisplay',
  
  props: {
    fileData: {
      type: [Array, Object],
      default: () => null
    }
  },
  
  setup(props) {
    const previewDialog = ref(false);
    const previewFile = ref(null);
    const previewTextContent = ref('');
    
    // Normalize file data to always be an array
    const normalizedFileData = computed(() => {
      if (!props.fileData) return [];
      if (Array.isArray(props.fileData)) return props.fileData;
      return [props.fileData];
    });
    
    // Format file size from bytes to human readable
    const formatFileSize = (bytes) => {
      if (!bytes || bytes === 0) return '0 Bytes';
      
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      
      return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
    };
    
    // Check if file can be previewed
    const canPreview = (file) => {
      return file && file.data && (
        isImageFile(file) || 
        isPdfFile(file) || 
        isTextFile(file)
      );
    };
    
    // Check if file is image
    const isImageFile = (file) => {
      return file.type && file.type.startsWith('image/');
    };
    
    // Check if file is PDF
    const isPdfFile = (file) => {
      return file.type === 'application/pdf';
    };
    
    // Check if file is text/code
    const isTextFile = (file) => {
      const textTypes = [
        'text/', 
        'application/json',
        'application/javascript',
        'application/xml',
        'application/html'
      ];
      
      return file.type && textTypes.some(type => file.type.includes(type));
    };
    
    // Get appropriate icon based on file type
    const getFileIcon = (file) => {
      if (!file || !file.type) return 'mdi-file-outline';
      
      // Image files
      if (file.type.startsWith('image/')) {
        return 'mdi-file-image-outline';
      }
      
      // PDF files
      if (file.type === 'application/pdf') {
        return 'mdi-file-pdf-outline';
      }
      
      // Document files
      if (file.type.includes('word') || 
          file.type.includes('document') ||
          file.type.includes('msword')) {
        return 'mdi-file-document-outline';
      }
      
      // Spreadsheet files
      if (file.type.includes('excel') || 
          file.type.includes('spreadsheet') ||
          file.type.includes('csv')) {
        return 'mdi-file-excel-outline';
      }
      
      // Presentation files
      if (file.type.includes('powerpoint') || 
          file.type.includes('presentation')) {
        return 'mdi-file-powerpoint-outline';
      }
      
      // Text files
      if (file.type.includes('text/') || file.type.includes('code')) {
        return 'mdi-file-code-outline';
      }
      
      // Zip/Archive files
      if (file.type.includes('zip') || 
          file.type.includes('tar') || 
          file.type.includes('compressed') ||
          file.type.includes('archive')) {
        return 'mdi-folder-zip-outline';
      }
      
      // Video files
      if (file.type.includes('video/')) {
        return 'mdi-file-video-outline';
      }
      
      // Audio files
      if (file.type.includes('audio/')) {
        return 'mdi-file-music-outline';
      }
      
      // Default
      return 'mdi-file-outline';
    };
    
    // Preview a file
    const openPreview = (file) => {
      previewFile.value = file;
      
      // For text files, try to get content
      if (isTextFile(file) && file.data) {
        try {
          // If it's a data URL, extract the content
          if (file.data.startsWith('data:')) {
            const base64Content = file.data.split(',')[1];
            const decodedContent = atob(base64Content);
            previewTextContent.value = decodedContent;
          } else {
            previewTextContent.value = file.data;
          }
        } catch (error) {
          console.error("Error decoding text content:", error);
          previewTextContent.value = "Error loading text content";
        }
      }
      
      previewDialog.value = true;
    };
    
    // Download a file
    const downloadFile = (file) => {
      if (!file || !file.data) return;
      
      try {
        const contentType = file.type || 'application/octet-stream';
        const blob = base64ToBlob(file.data, contentType);
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = file.name || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error downloading file:", error);
      }
    };
    
      return {
      previewDialog,
      previewFile,
      previewTextContent,
      normalizedFileData,
      formatFileSize,
      canPreview,
      isImageFile,
      isPdfFile,
      isTextFile,
      getFileIcon,
      openPreview,
      downloadFile
    };
  }
});
</script>

<style scoped>
.file-display-component {
  width: 100%;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 8px;
  margin-bottom: 4px;
  border-radius: 4px;
  background-color: #f5f5f5;
}

.file-name {
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-thumbnail {
  height: 30px;
  width: 30px;
  border-radius: 4px;
  object-fit: cover;
  cursor: pointer;
  border: 1px solid #e0e0e0;
}

.preview-image {
  max-width: 100%;
  max-height: 600px;
  object-fit: contain;
}

.preview-pdf {
  width: 100%;
  height: 600px;
  border: none;
}

.preview-text {
  max-height: 600px;
  overflow: auto;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 4px;
  text-align: left;
  font-family: monospace;
  white-space: pre-wrap;
}
</style>
