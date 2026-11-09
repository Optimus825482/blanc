import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

export default defineConfig([
  ...nextVitals,
  // Statik stüdyo ve vitrin betikleri (public/assets/js) ES5 tarayıcı kodu; ayrı kurallarla ele alınacak.
  globalIgnores(['.next/**', 'out/**', 'build/**', 'public/**', 'next-env.d.ts']),
]);
