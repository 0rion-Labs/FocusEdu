# 🎓 FocusEdu

<div align="center">

**AI-Powered Learning Platform for Personalized Education**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Project Structure](#-project-structure) • [Contributing](#-contributing)

</div>

---

## 📖 Overview

FocusEdu is an AI-powered learning platform designed to revolutionize personalized education. By leveraging advanced machine learning algorithms and natural language processing, FocusEdu provides tailored course recommendations, resume analysis, GitHub profile insights, and career development suggestions to help learners achieve their educational and professional goals.

### 🎯 Key Highlights

- **Personalized Learning Paths**: AI-driven recommendations based on your skill level and career goals
- **Multi-Source Integration**: Curated content from YouTube, Udemy, and other educational platforms
- **Resume Analysis**: Intelligent resume parsing and gap analysis against job descriptions
- **GitHub Profile Insights**: Analyze coding contributions and suggest improvement areas
- **Career Development**: Internship opportunities and skill development recommendations
- **Real-time News**: Stay updated with the latest tech and industry trends

---

## ✨ Features

### 🤖 AI-Powered Recommendations
- Smart course suggestions tailored to your learning style
- YouTube video recommendations based on skill gaps
- Udemy course discovery with relevance scoring
- Personalized learning roadmaps

### 📄 Resume Intelligence
- Upload and analyze resumes (PDF, DOCX formats)
- Extract skills, experience, and education
- Job description gap analysis
- Actionable improvement suggestions

### 👨‍💻 GitHub Analysis
- Profile contribution visualization
- Repository analysis and insights
- Skill assessment based on coding activity
- Technology stack recommendations

### 💼 Career Development
- Internship opportunity discovery
- Skill-based job matching
- Industry news aggregation
- Learning resource suggestions

### 🎨 Modern UI/UX
- Sleek, dark-themed interface
- Responsive design for all devices
- Interactive 3D visualizations with Three.js
- Smooth animations with Framer Motion
- Snow effects and gradient backgrounds

---

## 🛠 Tech Stack

### Frontend
- **Framework**: [Next.js 16.1](https://nextjs.org/) (App Router)
- **UI Library**: [React 19.2](https://reactjs.org/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4.1](https://tailwindcss.com/)
- **3D Graphics**: [Three.js](https://threejs.org/) + [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- **Animations**: [Framer Motion 12](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Chart.js](https://www.chartjs.org/) + React Chart.js 2

### Backend & AI
- **LLM Integration**: [LangChain](https://langchain.com/) + [Groq SDK](https://groq.com/)
- **AI Models**: Hugging Face Inference, Groq LLaMA
- **Document Processing**: PDF Parse, Mammoth (DOCX)
- **Vector Search**: LangChain Community RAG

### Infrastructure
- **Authentication**: [Firebase Auth](https://firebase.google.com/docs/auth)
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Analytics**: Firebase Analytics
- **Email**: Nodemailer
- **Runtime**: Bun (optional) / Node.js

### Development Tools
- **Package Manager**: Bun / npm / yarn / pnpm
- **Linting**: ESLint 9
- **Code Quality**: TypeScript strict mode
- **Build Tool**: Next.js built-in (Turbopack)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ or Bun
- Firebase account (for authentication and database)
- Groq API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/0rion-Labs/FocusEdu.git
   cd FocusEdu
   ```

2. **Install dependencies**
   ```bash
   # Using Bun (recommended)
   bun install

   # Or using npm
   npm install

   # Or using yarn
   yarn install

   # Or using pnpm
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   
   # AI/ML API Keys
   GROQ_API_KEY=your_groq_api_key
   HUGGINGFACE_API_KEY=your_huggingface_api_key
   
   # Email Configuration (optional)
   SMTP_HOST=your_smtp_host
   SMTP_PORT=587
   SMTP_USER=your_email
   SMTP_PASSWORD=your_password
   ```

4. **Run the development server**
   ```bash
   # Using Bun
   bun dev

   # Or using npm
   npm run dev

   # Or using yarn
   yarn dev

   # Or using pnpm
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
# Build the application
bun run build  # or npm run build

# Start the production server
bun start      # or npm start
```

---

## 📁 Project Structure

```
FocusEdu/
├── app/                          # Next.js App Router directory
│   ├── (auth)/                   # Authentication routes (grouped)
│   ├── analysis/                 # Analysis dashboard
│   ├── api/                      # API routes
│   │   ├── github-analysis/      # GitHub profile analysis endpoint
│   │   ├── jd-gap-analysis/      # Job description gap analysis
│   │   ├── news/                 # News aggregation API
│   │   ├── recommendations/      # Course recommendation engine
│   │   └── resume-analysis/      # Resume parsing and analysis
│   ├── components/               # Reusable React components
│   ├── dashboard/                # User dashboard
│   ├── github-analysis/          # GitHub insights page
│   ├── home/                     # Home page components
│   ├── internship/               # Internship opportunities
│   ├── news/                     # News feed page
│   ├── resume-analysis/          # Resume upload and analysis
│   ├── suggestions/              # AI-powered suggestions page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   ├── loading.tsx               # Loading states
│   ├── not-found.tsx             # 404 page
│   └── page.tsx                  # Landing page
├── lib/                          # Utility libraries and configurations
│   ├── rag/                      # RAG (Retrieval-Augmented Generation) utilities
│   ├── firebase.ts               # Firebase configuration
│   ├── firebaseAnalytics.ts      # Analytics setup
│   ├── middleware.ts             # Custom middleware
│   ├── storage.ts                # Storage utilities
│   ├── types.ts                  # TypeScript type definitions
│   └── utils.ts                  # Helper functions
├── public/                       # Static assets
├── types/                        # Global TypeScript types
├── components.json               # Shadcn UI configuration
├── eslint.config.mjs             # ESLint configuration
├── next.config.ts                # Next.js configuration
├── package.json                  # Project dependencies
├── postcss.config.mjs            # PostCSS configuration
├── tailwind.config.ts            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
```

---

## 🎨 Key Features Deep Dive

### Resume Analysis
Upload your resume in PDF or DOCX format, and FocusEdu will:
- Extract skills, experience, and education using AI
- Compare against job descriptions to identify gaps
- Provide actionable recommendations for improvement
- Suggest relevant courses and certifications

### GitHub Profile Analysis
Connect your GitHub account to receive:
- Contribution activity visualization
- Repository quality assessment
- Technology stack analysis
- Skill recommendations based on coding patterns

### Personalized Suggestions
Get AI-powered recommendations for:
- YouTube tutorial videos matching your skill level
- Udemy courses aligned with your career goals
- Learning paths tailored to your interests
- Industry-specific resources

### News Aggregation
Stay informed with curated news from:
- Technology trends
- Industry updates
- Career development tips
- Learning resources

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Maintain existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all linting checks pass

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Vercel** for seamless deployment
- **Firebase** for backend infrastructure
- **Groq** for lightning-fast LLM inference
- **LangChain** for AI orchestration
- **Open Source Community** for incredible tools and libraries

---

## 📧 Contact & Support

- **Created by**: [Orion Labs](https://github.com/0rion-Labs)
- **Issues**: [GitHub Issues](https://github.com/0rion-Labs/FocusEdu/issues)
- **Discussions**: [GitHub Discussions](https://github.com/0rion-Labs/FocusEdu/discussions)

---

<div align="center">

**Made with ❤️ by Orion Labs**

⭐ Star this repo if you find it helpful!

</div>
