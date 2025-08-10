interface ImportMetaEnv {
  readonly VITE_FIREBASE_USER_ID?: string;
  // Add other VITE_ variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
