const config = {
  plugins: [
    [
      "@tailwindcss/postcss",
      {
        content: ["./src/**/*.{js,ts,jsx,tsx}", "!./docs/**/*"],
      },
    ],
  ],
};

export default config;
