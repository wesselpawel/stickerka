import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* Stacking: page UI (≤~2k) < mega/mobile < header bar < modal < cart.
         Cart must always be on top (no exceptions). */
      zIndex: {
        sticky: "10",
        lottery: "20",
        mega: "4800",
        header: "4900",
        "cart-back": "100000",
        cart: "100010",
        /* Wheel/promo should be above header/modal, but always below cart overlay. */
        wheel: "5100",
        modal: "5020",
      },
      backgroundImage: { "woman-pc": "url('/home-images/woman-pc.webp')" },
      colors: {
        chill: {
          /* Dark, cool (teen) vibe palette */
          cream: "#070A10",
          sand: "#0B1620",
          sage: "#3AD6C3",
          "sage-dark": "#14B8A6",
          mist: "#2A5B6A",
          sea: "#3B82F6",
          peach: "#FF5FA2",
          ink: "#EAFBFF",
          muted: "#A7C0CF",
          line: "#1F3342",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        druk: ["var(--font-fraunces)", "Georgia", "serif"],
        coco: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
