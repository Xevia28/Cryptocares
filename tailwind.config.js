/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans'],
      },
      fontWeight: {
        thin: 100,
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
        black: 900,
      },
      colors: {
        dark: '#000',
        lightGreenish: '#439898',
        darkGreenish: '#237B7C',
        veryDarkGreenish: '#02292A',
        whitish: '#F5F5DC',
        orangeish: '#F1AB86',
        inpBg: 'rgba(217, 217, 217, 0.1)',
        bgDark: 'rgba(18, 1, 1, 0.5)',
        active: '#043b44',
        footercolor: "#011317",
        adminsideNavColor: "#333132",
        adminCardColor: "#D4AC6F",
        transSideNavColor: "#333132"
      },
      height: {
        bgHeight: "82vh",
        vectorHeight: "60vh",
        custom: "90vh"
      },
      width: {
        header: "50rem",
        subheader: "40rem",
        miniheader: "30rem",
      },
      dropShadow: {
        custom: "0px 0px 20px #439898"
      },
    },
  },
  plugins: [],
};
