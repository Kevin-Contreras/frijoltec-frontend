import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        fondo: "#F5F7F6",
        superficie: "#FFFFFF",
        texto: "#15201C",
        "texto-secundario": "#4D5B55",
        borde: "#DDE3E0",
        "borde-fuerte": "#B9C4BF",
        principal: {
          DEFAULT: "#1C5D73",
          suave: "#E3EEF1",
          hover: "#144657",
        },
        alerta: {
          DEFAULT: "#B4471A",
          suave: "#FBEAE1",
          texto: "#8A3412",
          hover: "#953913",
        },
        "sin-dato": "#8A9590",
        // Marca Frijol Tech (nuevo diseño de Figma)
        marca: {
          oscuro: "#142A27",
          "oscuro-hover": "#1F3D39",
          menta: "#D1F7DE",
          "menta-hover": "#BFF0CF",
          "menta-suave": "#E3F8EA",
          verde: "#69AB90",
          fondo: "#F3FAF6",
        },
      },
      fontFamily: {
        titulos: ["var(--font-space-grotesk)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        marca: ["var(--font-montserrat)", "sans-serif"],
      },
      borderRadius: {
        sm: "10px",
        md: "12px",
        lg: "16px",
      },
    },
  },
  plugins: [],
};
export default config;
