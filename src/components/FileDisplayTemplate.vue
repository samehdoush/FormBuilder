  <div class="file-display-component">
    <div v-if="!fileData || fileData.length === 0" class="text-body-2 text-grey">
      No file uploaded
    </div>
    <div v-else>
      <div v-for="(file, index) in normalizedFileData" :key="index" class="file-item">
        <v-icon class="mr-2" :icon="getFileIcon(file)"></v-icon>
        <span class="file-name">{{ file.name || 'Unnamed file' }}</span>
        <span v-if="file.size" class="text-caption text-grey ml-2">
          ({{ formatFileSize(file.size) }})
        </span>
        
        <!-- Preview thumbnail for images -->
        <img 
          v-if="isImageFile(file) && file.data" 
          :src="file.data" 
          class="file-thumbnail ml-2"
          @click="openPreview(file)"
        />
        
        <!-- Preview button for other file types -->
        <v-btn
          v-if="canPreview(file) && !isImageFile(file)"
          class="ml-2"
          size="x-small"
          variant="text"
          color="primary"
          @click="openPreview(file)"
        >
          Preview
        </v-btn>
        
        <!-- Download button -->
        <v-btn
          v-if="file.data"
          class="ml-1"
          size="x-small"
          variant="text"
          color="secondary"
          @click="downloadFile(file)"
        >
          <v-icon size="small">mdi-download</v-icon>
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
