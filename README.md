# Kinda Figma App

A Figma-like canvas editor built with Nuxt 4, Vue 3, and Konva. Create and edit designs with text, images, shapes, and more in a modern web interface.

![Nuxt](https://img.shields.io/badge/Nuxt-4.1.2-00DC82?style=flat&logo=nuxt.js&logoColor=white)
![Vue](https://img.shields.io/badge/Vue-3.5.22-4FC08D?style=flat&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=flat&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## ✨ Features

- 🎨 **Canvas Editor** - Interactive canvas with drag-and-drop functionality
- 📝 **Text Tools** - Add and edit text with customizable fonts, sizes, and styles
- 🖼️ **Image Support** - Upload and manipulate images on the canvas
- 🔷 **Shape Tools** - Create rectangles, circles, and lines with customizable properties
- 🎭 **Layer Management** - Organize elements with z-index controls (bring to front, send to back, etc.)
- 🎯 **Alignment Tools** - Align elements to edges and center (left, right, top, bottom, center)
- 🎨 **Background Customization** - Solid colors or gradient backgrounds
- 🔄 **Transform Controls** - Resize, rotate, and move elements with visual handles
- 📐 **Snap Guides** - Visual guides for precise alignment
- ⌨️ **Keyboard Shortcuts** - Efficient editing with keyboard commands
- 💾 **Export** - Export your canvas as an image
- 🎛️ **Property Inspector** - Detailed property panels for selected elements

## 🛠️ Tech Stack

- **Framework**: [Nuxt 4](https://nuxt.com/) - The Intuitive Vue Framework
- **UI Library**: [Vue 3](https://vuejs.org/) - Progressive JavaScript Framework
- **Canvas Engine**: [Konva](https://konvajs.org/) - 2D canvas library
- **State Management**: [Pinia](https://pinia.vuejs.org/) - The Vue Store
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **UI Components**: [shadcn-nuxt](https://www.shadcn-vue.com/) - Re-usable components
- **Icons**: [Lucide Vue Next](https://lucide.dev/) - Beautiful & consistent icon toolkit
- **Animations**: [GSAP](https://gsap.com/) - Professional-grade animation library

## 📋 Prerequisites

- Node.js 22+ (use `nvm use 22` if you have nvm)
- Yarn package manager

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd nuxt-kinda-figma
```

2. Install dependencies:
```bash
# Make sure you're using Node 22
nvm use 22

# Install dependencies
yarn install
```

### Development

Start the development server:

```bash
yarn dev
```

The application will be available at `http://localhost:3000`

### Build

Build the application for production:

```bash
yarn build
```

### Preview

Preview the production build locally:

```bash
yarn preview
```

## 📁 Project Structure

```
nuxt-kinda-figma/
├── app/
│   ├── components/          # Vue components
│   │   ├── canvas/         # Canvas editor components
│   │   └── ui/             # shadcn UI components
│   ├── composables/        # Vue composables
│   │   └── canvas/        # Canvas-related composables
│   ├── stores/            # Pinia stores
│   ├── types/             # TypeScript type definitions
│   └── assets/            # Static assets (CSS, images)
├── public/                # Public static files
├── nuxt.config.ts         # Nuxt configuration
└── package.json           # Dependencies and scripts
```

## 🎮 Usage

1. **Add Elements**: Use the toolbar to add text, images, or shapes to the canvas
2. **Select Elements**: Click on any element to select it
3. **Transform**: Use the transform handles to resize, rotate, or move elements
4. **Edit Properties**: Use the property inspector panel to customize selected elements
5. **Layer Management**: Use the arrange panel to change layer order
6. **Alignment**: Use alignment tools to position elements precisely
7. **Export**: Click the export button to download your canvas as an image

## 🌐 Deployment

This project can be deployed to various free hosting platforms:

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Vercel will automatically detect Nuxt and configure the build settings
4. Deploy!

**Build Settings** (auto-detected by Vercel):
- Build Command: `yarn build`
- Output Directory: `.output/public`
- Install Command: `yarn install`

### Netlify

1. Push your code to GitHub
2. Import your repository on [Netlify](https://netlify.com)
3. Use the following build settings:
   - Build command: `yarn build`
   - Publish directory: `.output/public`

### GitHub Pages

For GitHub Pages, you'll need to use `nuxt generate` instead of `nuxt build`:

1. Update `package.json` scripts to use `generate`
2. Configure GitHub Actions to build and deploy
3. Set the base URL in `nuxt.config.ts` if needed

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Syed Haroon**

- Website: [www.haroon.in](https://www.haroon.in)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](../../issues).

## 🙏 Acknowledgments

- Built with [Nuxt](https://nuxt.com/)
- Canvas powered by [Konva](https://konvajs.org/)
- UI components from [shadcn-vue](https://www.shadcn-vue.com/)

---

Made with ❤️ using Nuxt and Vue
