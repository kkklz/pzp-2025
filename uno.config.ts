import { defineConfig, presetWebFonts, presetWind4 } from 'unocss'

export default defineConfig({
  presets: [
    presetWind4(),
    presetWebFonts({
      provider: 'google',
      fonts: {
        sans: 'Roboto',
      },
    }),
  ],
  theme: {
    colors: {
      'background': '#0a0a0e',
      'surface': '#1a1a24',
      'surface-bright': '#242430',
      'surface-light': '#2a2a38',
      'surface-variant': '#32323e',
      'on-surface-variant': '#a0a0b0',
      'primary': '#a855f7',
      'primary-darken-1': '#7c3aed',
      'secondary': '#3b82f6',
      'secondary-darken-1': '#2563eb',
      'accent': '#ec4899',
      'error': '#ef4444',
      'info': '#3b82f6',
      'success': '#22c55e',
      'warning': '#f59e0b',
    },
  },
})
