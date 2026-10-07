export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

/** An image chosen on the website, already resized and compressed, ready to upload. */
export interface SelectedImage {
  file: File;
  /** Temporary browser link used to show the preview. */
  previewUrl: string;
  width: number;
  height: number;
}
