# Personal Website

A personal website built with React, TypeScript, and Tailwind CSS.

## Features

- Responsive design
- Modern UI with Tailwind CSS
- IBM Plex Mono font throughout the site
- Adaptable navigation bar with mobile menu
- Reusable footer with customizable buttons

## Technologies Used

- React
- TypeScript
- Vite
- Tailwind CSS
- IBM Plex Mono (Google Fonts)

## Getting Started

### Prerequisites

- Node.js (>= 14.x)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/personal-website.git
cd personal-website
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
my-personal-website/
├── public/
├── src/
│   ├── assets/          # Images and static files
│   ├── components/      # React components
│   │   ├── Navbar.tsx   # Navigation bar component
│   │   ├── Home.tsx     # Home page component
│   │   └── Footer.tsx   # Footer component
│   ├── App.tsx          # Main App component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles and Tailwind directives
├── index.html
├── package.json
├── tsconfig.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.ts
```

## Customization

- Edit the `Navbar.tsx` component to update navigation items
- Modify the `Home.tsx` component to change the main content
- Update the `Footer.tsx` component to change the footer buttons

## License

This project is open source and available under the [MIT License](LICENSE).
