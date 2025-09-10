# 🌿 EcoRahi - Sustainable Travel Companion

EcoRahi is an AI-powered travel planning platform focused on sustainable and eco-friendly tourism. Built with modern web technologies, it offers personalized travel recommendations with a focus on environmental consciousness.

## ✨ Features

### 🎯 Core Features
- **AI-Powered Trip Planning**: Get personalized recommendations based on preferences and budget
- **Interactive Maps**: Explore destinations with real-time weather and transport updates
- **Local Services Marketplace**: Connect with local guides, homestays, and authentic experiences
- **Multilingual Support**: Full English and Hindi language support with instant switching
- **Responsive Design**: Beautiful experience across all devices

### 🌐 Language Support
- **English** - Complete interface translation
- **Hindi (हिंदी)** - Full localization including popular destinations
- **Instant Language Switching** - Changes entire website language immediately
- **Persistent Language Preference** - Remembers your choice across sessions

### 🎨 Modern UI/UX
- **Glass Morphism Design** - Modern, elegant interface with backdrop blur effects
- **3D Animations** - Smooth hover effects and interactive elements
- **Eco-Friendly Theme** - Green color palette reflecting environmental consciousness
- **Advanced Search** - Smart destination search with filters and suggestions

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Wouter** for routing
- **TanStack Query** for data fetching

### Backend
- **Express.js** with TypeScript
- **SQLite** database with better-sqlite3
- **Zod** for schema validation
- **CORS** enabled for cross-origin requests

### Development Tools
- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for code formatting
- **Git** for version control

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Setup
1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ecorahi.git
   cd ecorahi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5174`

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

### Project Structure
```
ecorahi/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts (Language, etc.)
│   │   ├── pages/          # Page components
│   │   ├── lib/            # Utility functions
│   │   └── hooks/          # Custom React hooks
│   └── public/             # Static assets
├── server/                 # Backend Express application
│   ├── routes.ts           # API routes
│   ├── db.ts              # Database configuration
│   └── storage.ts         # Data storage logic
├── shared/                 # Shared types and schemas
└── docs/                  # Documentation
```

## 🌍 Language Implementation

EcoRahi features a comprehensive multilingual system:

### Features
- **Persistent Storage**: Language preference saved to localStorage
- **Real-time Switching**: Instant language change across all components
- **String Interpolation**: Dynamic content with variable substitution
- **Fallback System**: Graceful handling of missing translations

### Usage
```typescript
import { useLanguage } from '@/contexts/LanguageContext';

function MyComponent() {
  const { t, language, setLanguage } = useLanguage();
  
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>{t('foundResults', { count: 5 })}</p>
      <button onClick={() => setLanguage('hi')}>
        Switch to Hindi
      </button>
    </div>
  );
}
```

## 🎨 Design System

### Color Palette
- **Primary**: Emerald green tones (#10b981, #059669)
- **Accent**: Complementary green shades (#22c55e, #16a34a)
- **Background**: Dynamic gradients with glass morphism
- **Text**: High contrast for accessibility

### Components
- **Glass Morphism Cards**: Translucent backgrounds with blur effects
- **3D Hover Effects**: Interactive elements with depth
- **Smooth Animations**: CSS transitions and keyframe animations
- **Responsive Grid**: Mobile-first design approach

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
Create a `.env` file with:
```env
# Database
DATABASE_URL=./database.sqlite

# API Configuration
PORT=5000
NODE_ENV=production

# Optional: External APIs
OPENAI_API_KEY=your_openai_key_here
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use semantic commit messages
- Add tests for new features
- Update documentation as needed
- Ensure responsive design
- Test language switching functionality

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Lucide** for beautiful icons
- **Tailwind CSS** for utility-first styling
- **React** team for the amazing framework
- **Vite** for lightning-fast development
- **TypeScript** for type safety

## 📞 Support

For support, email hello@ecorahi.com or create an issue on GitHub.

## 🗺️ Roadmap

- [ ] Mobile app development
- [ ] Advanced AI recommendations
- [ ] Carbon footprint calculator
- [ ] Social features and trip sharing
- [ ] Integration with booking platforms
- [ ] Offline mode support
- [ ] More language support

---

**Made with 💚 for sustainable travel**