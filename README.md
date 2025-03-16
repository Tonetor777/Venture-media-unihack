# Venture Meda Unihack

This project is a Telegram mini app designed to enhance user interaction and provide seamless communication features. It integrates with the Sanity as a CMS and Gemini for AI tutor experience.

## Features

- **Tailwind CSS**: Styled using the utility-first CSS framework.
- **PostCSS**: Configured for processing CSS with plugins.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/venture-media-unihack.git
   cd venture-media-unihack
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Configuration

The project uses a `postcss.config.mjs` file for PostCSS configuration. Tailwind CSS is included as a plugin.

```javascript
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default config;
```

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.
