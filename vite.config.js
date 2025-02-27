import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    global: {},
    'process.env': {},
    'crypto.getRandomValues': () => crypto.randomBytes(16), // Fix crypto issue
  },
});
