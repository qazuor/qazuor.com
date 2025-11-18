// import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    // plugins: [react()], // Temporarily disabled due to version compatibility
    test: {
        environment: 'happy-dom',
        globals: true,
        setupFiles: ['./src/test/setup.ts'],
        exclude: ['**/node_modules/**', '**/dist/**', '**/tests/e2e/**', '**/.{git,cache,output,temp}/**'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                'src/test/',
                'tests/e2e/',
                '**/*.test.{ts,tsx}',
                '**/*.spec.{ts,tsx}',
                '**/types.ts',
                '**/*.d.ts'
            ]
        }
    }
});
