import daisyui from 'daisyui';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {}, // Keep existing theme extensions if any
  },
  plugins: [daisyui],
  daisyui: {
    styled: true, // Process daisyUI styles
    base: true, // Include daisyUI base styles
    utils: true, // Include daisyUI utility classes
    logs: true, // Show logs (can be turned off later)
    rtl: false, // Right-to-left support, default is false
    prefix: "", // Prefix for daisyUI classes (e.g., 'du-'), default is empty
    darkTheme: "material-custom-dark", // Set the default dark theme
    themes: [
      {
        "material-custom": {
          "primary": "#C51162", // Magenta
          "primary-content": "#FFFFFF",
          "secondary": "#2962FF", // Blue
          "secondary-content": "#FFFFFF",
          "accent": "#E040FB", // A variant of magenta or blue, or a complementary color
          "accent-content": "#FFFFFF",
          "neutral": "#F5F5F5", // Light gray for neutral elements
          "base-100": "#FFFFFF", // Base page color (white)
          "base-200": "#F5F5F5", // Slightly darker than base-100
          "base-300": "#E0E0E0", // Even darker
          "info": "#2196F3", // Material Blue 500
          "success": "#4CAF50", // Material Green 500
          "warning": "#FF9800", // Material Orange 500
          "error": "#F44336", // Material Red 500

          "--rounded-box": "8px", // Material Design like border radius
          "--rounded-btn": "4px",  // Material Design like border radius
          "--rounded-badge": "16px", // Can be adjusted

          // Subtle box shadows for elevation
          "--shadow-sm": "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          "--shadow-md": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          "--shadow-lg": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          "--shadow-xl": "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          "--shadow-2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          "--shadow-inner": "inset 0 2px 4px 0 rgba(0,0,0,0.06)",
        },
      },
      {
        "material-custom-dark": {
          "primary": "#F50057", // Lighter/more vibrant magenta for dark theme
          "primary-content": "#FFFFFF",
          "secondary": "#448AFF", // Lighter/more vibrant blue for dark theme
          "secondary-content": "#FFFFFF",
          "accent": "#D500F9", // Accent for dark theme
          "accent-content": "#FFFFFF",
          "neutral": "#424242", // Dark gray for neutral elements
          "base-100": "#121212", // Base page color (Material Dark background)
          "base-200": "#1E1E1E", // Slightly lighter than base-100
          "base-300": "#2C2C2C", // Even lighter
          "info": "#2196F3",
          "success": "#4CAF50",
          "warning": "#FF9800",
          "error": "#F44336",

          "--rounded-box": "8px",
          "--rounded-btn": "4px",
          "--rounded-badge": "16px",

          "--shadow-sm": "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          "--shadow-md": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          "--shadow-lg": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          "--shadow-xl": "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          "--shadow-2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          "--shadow-inner": "inset 0 2px 4px 0 rgba(0,0,0,0.06)",
        },
      },
      "light", // Keep original light and dark themes
      "dark",
    ],
  },
};
