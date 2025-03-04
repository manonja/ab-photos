# AB Photos 📸

A modern, performant photo gallery application built with Next.js 14 and deployed on Cloudflare Pages. This application provides a beautiful way to showcase and manage photo collections with server-side rendering and optimal image delivery.

![Next.js](https://img.shields.io/badge/Next.js-14.1.0-black)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.0-38B2AC)
![Cloudflare](https://img.shields.io/badge/Cloudflare-Pages-orange)

## 📑 Table of Contents

- [AB Photos 📸](#ab-photos-)
  - [📑 Table of Contents](#-table-of-contents)
  - [✨ Features](#-features)
  - [🛠 Tech Stack](#-tech-stack)
  - [🚀 Getting Started](#-getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Environment Setup](#environment-setup)
  - [💻 Development](#-development)
  - [🧪 Testing](#-testing)
  - [🎯 Deployment](#-deployment)
  - [📁 Project Structure](#-project-structure)
  - [🤝 Contributing](#-contributing)
  - [📝 License](#-license)

## ✨ Features

- Server-side rendering with Next.js 14
- Optimized image delivery and caching
- TypeScript for type safety
- Responsive design with Tailwind CSS
- Integration with Neon Database (Serverless Postgres)
- E2E testing with Playwright
- Unit testing with Jest
- Analytics integration with Plausible
- Mailchimp newsletter integration
- Cloudflare Pages deployment

## 🛠 Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Neon (Serverless Postgres)
- **Testing:** Jest, Playwright
- **Deployment:** Cloudflare Pages
- **Other Tools:**
  - ESLint for code linting
  - Prettier for code formatting
  - Wrangler for Cloudflare development

## 🚀 Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn
- A Cloudflare account (for deployment)
- 1Password CLI (for secrets management)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/manonja/ab-photos.git
cd ab-photos
```

2. Install dependencies:
```bash
npm install
```

### Environment Setup

1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Set up your environment variables:
- For local development:
```bash
npm run secrets:local
```

- For Cloudflare deployment:
```bash
npm run secrets:cf
```

## 💻 Development

Start the development server:
```bash
npm run dev
```

For Cloudflare Pages development:
```bash
npm run dev:wrangler
```

## 🧪 Testing

Run unit tests:
```bash
npm test
```

Watch mode for development:
```bash
npm run test:watch
```

E2E tests are located in the `e2e-tests` directory and can be run with Playwright.

## 🎯 Deployment

Deploy to Cloudflare Pages:
```bash
npm run deploy
```

## 📁 Project Structure

```
ab-photos/
├── src/
│   ├── actions/      # Server actions
│   ├── app/          # Next.js app router
│   ├── components/   # React components
│   ├── db/          # Database utilities
│   ├── types/       # TypeScript types
│   └── utils/       # Utility functions
├── public/          # Static assets
├── e2e-tests/       # Playwright tests
└── assets-cors-worker/ # Cloudflare worker
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---
Made with ❤️ by Manon Jacquin

