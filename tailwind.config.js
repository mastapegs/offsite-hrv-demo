module.exports = {
  purge: ["./**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    flexGrow: {
      0: 0,
      DEFAULT: 1,
      2: 2,
    },
    fontFamily: {
      sans: ["Lato"],
    },
    colors: {
      white: "#ffffff",
      black: "#000000",
      green: {
        light: "#E3F9E5",
        dark: "#23CB88",
      },
      gray: {
        200: "#EDEFF2",
        300: "#D3DDE5",
        400: "#B4BFCC",
        700: "#4D545C",
        900: "#1F2529",
        "input-text-border": "#B4BFCC",
      },
      smoke: {
        DEFAULT: "hsla(0, 0%, 0%, 0.5)",
      },
      red: {
        "error-border": "#F44336",
        "error-text": "#E5213B",
        "report-icon": "#FEDBE1",
      },
      purple: {
        50: "#DEC2E8",
        100: "#F6EDFA",
        600: "#681484",
        700: "#520E69",
        "picture-button-border": "#BF90CF",
      },
      progress: {
        yellow: {
          light: "#FFF3C4",
          dark: "#F0B429",
        },
      },
      "get-to-work-bg": "#FEFAFF",
      "get-to-work-border": "#DEC2E8",
      background: "#F7F9FA",
    },
    extend: {
      borderRadius: {
        modal: "32px",
      },
      boxShadow: {
        "rule-wrapper": "0px 4px 12px rgba(9, 13, 44, 0.04)",
      },
      animation: {
        ripple: "pulse 0.2s cubic-bezier(0.4, 0, 0.6, 1)",
      },
      letterSpacing: {
        "heading-primary": "-0.01rem",
        "heading-secondary": "0.6rem",
      },
    },
  },
  variants: {
    extend: {
      animation: ["active"],
      borderColor: ["focus", "active"],
      backgroundOpacity: ["disabled"],
      margin: ["last"],
      outline: ["focus"],
    },
  },
  plugins: [],
};
