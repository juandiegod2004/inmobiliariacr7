/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms'
import containerQueries from '@tailwindcss/container-queries'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "surface-container-lowest": "#ffffff",
        "surface-container": "#e9eef6",
        "surface-container-low": "#eff4fc",
        "primary-fixed-dim": "#aec7f7",
        "on-surface": "#161c22",
        "surface": "#f7f9ff",
        "tertiary-fixed-dim": "#3de273",
        "on-tertiary-fixed-variant": "#005322",
        "primary-container": "#1b365d",
        "inverse-on-surface": "#ecf1f9",
        "on-surface-variant": "#44474e",
        "on-tertiary-fixed": "#002109",
        "outline-variant": "#c4c6cf",
        "surface-bright": "#f7f9ff",
        "on-primary": "#ffffff",
        "on-secondary-container": "#00714b",
        "on-error-container": "#93000a",
        "on-primary-fixed-variant": "#2e476f",
        "surface-container-high": "#e3e9f0",
        "secondary-container": "#8af5be",
        "secondary": "#006c47",
        "outline": "#74777f",
        "background": "#f7f9ff",
        "secondary-fixed-dim": "#71dba6",
        "on-secondary-fixed-variant": "#005235",
        "surface-container-highest": "#dde3eb",
        "tertiary-fixed": "#66ff8e",
        "surface-dim": "#d5dae2",
        "surface-tint": "#465f88",
        "primary": "#002046",
        "error": "#ba1a1a",
        "on-secondary-fixed": "#002113",
        "on-error": "#ffffff",
        "on-primary-fixed": "#001b3d",
        "primary-fixed": "#d6e3ff",
        "inverse-primary": "#aec7f7",
        "on-primary-container": "#87a0cd",
        "surface-variant": "#dde3eb",
        "tertiary-container": "#003f18",
        "error-container": "#ffdad6",
        "on-tertiary": "#ffffff",
        "on-background": "#161c22",
        "on-tertiary-container": "#00b754",
        "tertiary": "#00270c",
        "on-secondary": "#ffffff",
        "secondary-fixed": "#8df7c1"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "gutter": "24px",
        "margin-mobile": "16px",
        "margin-desktop": "40px",
        "unit": "8px",
        "container-max": "1280px"
      },
      fontFamily: {
        "headline-md": ["Montserrat", "sans-serif"],
        "display-lg": ["Montserrat", "sans-serif"],
        "body-sm": ["Inter", "sans-serif"],
        "display-lg-mobile": ["Montserrat", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "headline-sm": ["Montserrat", "sans-serif"],
        "label-md": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"]
      },
      fontSize: {
        "headline-md": ["24px", {"lineHeight": "32px", "fontWeight": "600"}],
        "display-lg": ["48px", {"lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
        "body-sm": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
        "display-lg-mobile": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "700"}],
        "body-lg": ["18px", {"lineHeight": "28px", "fontWeight": "400"}],
        "headline-sm": ["20px", {"lineHeight": "28px", "fontWeight": "600"}],
        "label-md": ["12px", {"lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "600"}],
        "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}]
      }
    }
  },
  plugins: [
    forms,
    containerQueries,
  ],
}
