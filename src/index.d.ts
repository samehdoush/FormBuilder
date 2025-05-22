// Type definitions for Vue Form Builder

import { App, Component, Ref } from 'vue';

export type FormElement = {
  id: string;
  type: string;
  name?: string;
  component: string;
  props: Record<string, any>;
};

export type FormSchema = {
  title: string;
  elements: FormElement[];
};

export type ValidationRule = {
  enabled: boolean;
  value: any;
};

export type ValidationRules = {
  required?: boolean;
  email?: boolean;
  minLength?: ValidationRule;
  maxLength?: ValidationRule;
  [key: string]: any;
};

export type FileData = {
  name: string;
  type: string;
  size: number;
  data: string;
};

export interface FormBuilderProps {
  modelValue: FormSchema;
  formOptions?: Record<string, any>;
}

export interface FormBuilderEmits {
  (e: 'update:modelValue', schema: FormSchema): void;
  (e: 'save', schema: FormSchema): void;
}

export interface FormRendererProps {
  formData: FormSchema;
  initialValues?: Record<string, any>;
  readOnly?: boolean;
}

export interface FormRendererEmits {
  (e: 'save', values: Record<string, any>): void;
  (e: 'update:modelValue', values: Record<string, any>): void;
}

export interface SignaturePadProps {
  modelValue: string;
  width?: number;
  height?: number;
  backgroundColor?: string;
  penColor?: string;
  readOnly?: boolean;
}

export interface SignaturePadEmits {
  (e: 'update:modelValue', data: string): void;
}

export interface FileDisplayProps {
  fileData: FileData | FileData[] | null;
}

export const FormBuilder: Component<FormBuilderProps, FormBuilderEmits>;
export const FormRenderer: Component<FormRendererProps, FormRendererEmits>;
export const SignaturePad: Component<SignaturePadProps, SignaturePadEmits>;
export const FileDisplay: Component<FileDisplayProps>;

// File Handler Utilities
export namespace FileHandler {
  export function fileToBase64(file: File): Promise<string>;
  export function processFiles(files: File | File[]): Promise<FileData[] | null>;
  export function base64ToUrl(base64Data: string): string | null;
  export function base64ToBlob(base64Data: string, contentType?: string): Blob | null;
  export function prepareFormForSubmission(
    formValues: Record<string, any>, 
    formElements: FormElement[]
  ): Promise<Record<string, any>>;
  export function prepareStoredFormForRendering(
    storedValues: Record<string, any>, 
    formElements: FormElement[]
  ): Record<string, any>;
}

declare const _default: {
  install: (app: App) => void;
};

export default _default;
