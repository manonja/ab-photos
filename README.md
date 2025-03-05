# AB Photos 📸

A modern, performant photography portfolio website built with Next.js 14 and deployed on Cloudflare Pages. This website showcases photography work, enables client contact, and includes a newsletter subscription feature. 

![Next.js](https://img.shields.io/badge/Next.js-14.1.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC)
![Cloudflare](https://img.shields.io/badge/Cloudflare-Pages-F38020)

## 🌟 Features

- **Portfolio Showcase**: Dynamic gallery for photography work display
- **Responsive Design**: Optimized viewing experience across all devices
- **Newsletter Integration**: Mailchimp subscription system
- **Contact Form**: Direct client communication channel
- **Modern Stack**: Built with Next.js 14, TypeScript, and Tailwind CSS
- **Performance Optimized**: Fast loading times with Cloudflare Pages deployment
- **Analytics**: Plausible analytics integration for privacy-friendly tracking

## 🚀 Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Neon (Serverless Postgres)
- **Deployment**: Cloudflare Pages
- **Testing**: Jest & Playwright
- **Analytics**: Plausible
- **Other Tools**: 
  - ESLint for code quality
  - Wrangler for Cloudflare development
  - React Testing Library for component testing

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/manonja/ab-photos.git
   cd ab-photos
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Fill in the required environment variables in `.env.local`

4. Run the development server:
   ```bash
   npm run dev
   ```

## 🛠️ Development

- **Development Mode**: `npm run dev`
- **Build**: `npm run build`
- **Production Start**: `npm run start`
- **Linting**: `npm run lint`
- **Testing**:
  - Unit Tests: `npm test`
  - E2E Tests: `npm run test:e2e`
  - Watch Mode: `npm run test:watch`

## 🌐 Deployment

The project is configured for deployment on Cloudflare Pages:

1. Build the project:
   ```bash
   npm run pages:build
   ```

2. Deploy to Cloudflare Pages:
   ```bash
   npm run deploy
   ```

## 🔑 Environment Variables

Required environment variables:

- `DATABASE_URL`: Neon database connection string
- `MAILCHIMP_API_KEY`: Mailchimp API key
- `MAILCHIMP_LIST_ID`: Mailchimp audience list ID
- Additional variables can be found in `.env.example`

## 🧪 Testing

The project includes both unit and E2E tests:

- Jest for unit testing React components
- Playwright for end-to-end testing
- React Testing Library for component testing

Run tests with:
```bash
npm test          # Run unit tests
npm run test:e2e  # Run E2E tests
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



Made with ❤️ by Manon Jacquin


