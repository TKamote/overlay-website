/// <reference types="vite/client" />
// vite-env.d.ts

/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_FIREBASE_USER_ID: string;
    // Add other environment variables here if you have them
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }