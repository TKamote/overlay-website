# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Firebase Configuration

### Setting up the User ID

The app connects to Firebase to fetch tournament data. To configure the correct user ID:

1. **Find your User ID:**

   - Go to [Firebase Console](https://console.firebase.google.com)
   - Navigate to your project → Firestore Database
   - Look for the path: `users/{USER_ID}/tournament/current`
   - Copy the `{USER_ID}` value

2. **Configure the User ID:**

   - Create a `.env` file in the project root
   - Add: `VITE_FIREBASE_USER_ID=your_user_id_here`
   - Replace `your_user_id_here` with the actual user ID from step 1

3. **Restart the development server:**
   ```bash
   npm run dev
   ```

### Example .env file:

```
VITE_FIREBASE_USER_ID=quGTVYdwKDhiF7TNIsk40brjRg33
```

### Current Configuration:

- **Firebase Project:** owenscup
- **Data Path:** `users/{USER_ID}/tournament/current`
- **Default User ID:** quGTVYdwKDhiF7TNIsk40brjRg33

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
