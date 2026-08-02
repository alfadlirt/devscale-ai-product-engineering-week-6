import type { Config } from "tailwindcss";

export default {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0F171F",
          foreground: "#FFFFFF",
          muted: "#1A242F",
        },
      },
    },
  },
} satisfies Config;
