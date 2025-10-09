import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // Import tailwindcss plugin
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Add tailwindcss plugin
  ],
  resolve:{
    alias:[
      {find: '@', replacement: path.resolve(__dirname, 'src')}
    ]
  },
});