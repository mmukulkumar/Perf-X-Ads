export interface AdSpec {
  id: string;
  title: string;
  dimensions: string; // Display string e.g., "1080×1080"
  width?: number; // For validation
  height?: number; // For validation
  aspectRatio: string;
  format: string;
  fileType: string[]; // e.g., ["JPG", "PNG"]
  maxFileSize: string; // Display string e.g., "30MB"
  maxFileSizeBytes?: number; // For validation
  notes: string;
  settings?: string;
}

export interface PlatformData {
  id: string;
  name: string;
  description: string;
  lastUpdated: string;
  specs: AdSpec[];
}

export interface ValidationResult {
  isValid: boolean;
  messages: {
    type: 'success' | 'error' | 'warning';
    text: string;
  }[];
}