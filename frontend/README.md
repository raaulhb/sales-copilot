# 🎨 Sales Co-pilot Frontend

**Modern React 18 + TypeScript Interface with Real-time Behavioral Analysis Visualizations**

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## 📋 **Overview**

The Sales Co-pilot frontend provides a **professional, real-time interface** for behavioral analysis with modern glassmorphism design. Built for sales professionals who need instant insights during conversations.

### **Key Features**

- **Real-time Audio Recording** with visual feedback
- **Live Behavioral Analysis** (DISC+FDNA + MBTI)
- **Professional Visualizations** with progress bars and charts
- **Responsive Design** optimized for all devices
- **Modern UI** with glassmorphism effects

---

## 🎨 **Interface Design**

### **3-Card Layout**

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  Audio Recorder │  │ Live Recommend  │  │  System Status  │
│                 │  │                 │  │                 │
│ 🎙️ Record       │  │ 💡 Strategies   │  │ ⚙️ Health        │
│ 🔴 Live Status  │  │ 📝 Scripts      │  │ 📊 Environment  │
│ 📊 Visualizer   │  │ 🎯 Actions      │  │ 🔄 Refresh      │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

### **Expanded Analysis Section**

```
┌───────────────────────────────────────────────────────────────┐
│                🧠 Análise Comportamental Detalhada            │
│                                                               │
│  📊 Perfis Detalhados  │  💡 Recomendações  │  🎯 Insights     │
│                                                               │
│  ┌─────────────────┐    ┌─────────────────┐                   │
│  │   DISC + FDNA   │    │      MBTI       │                   │
│  │                 │    │                 │                   │
│  │ Type: ANALÍTICO │    │ Type: INTJ      │                   │
│  │ Subtype: Pensador│   │ Confidence: 85%  │                   │
│  │ Axes: [-70, 90] │    │ Dimensions: 4   │                   │
│  │ Confidence: 95% │     │ Strengths: 4    │                   │
│  └─────────────────┘    └─────────────────┘                   │
└───────────────────────────────────────────────────────────────┘
```

---

## 🏗️ **Architecture**

```
frontend/src/
├── components/
│   ├── features/audio/           # Audio-related components
│   │   ├── AudioRecorder.tsx          # Audio recording interface
│   │   ├── AudioVisualizer.tsx        # Audio wave visualization
│   │   ├── ExpandedProfileDisplay.tsx # DISC+FDNA+MBTI visualization
│   │   └── LiveRecommendations.tsx    # Real-time recommendations
│   └── ui/                      # shadcn/ui component library
│       ├── button.tsx               # Button components
│       ├── card.tsx                 # Card containers
│       ├── tabs.tsx                 # Tab navigation
│       ├── badge.tsx                # Status badges
│       ├── progress.tsx             # Progress bars
│       └── [more components...]
├── services/
│   ├── api.ts                   # Backend API integration
│   ├── audio/
│   │   ├── audioProcessor.ts        # Audio processing utilities
│   │   └── speechToText.ts          # Speech recognition
│   └── audioService.ts          # Audio service orchestrator
├── hooks/
│   ├── useAudio.ts              # Audio recording hook
│   ├── useRealTimeAnalysis.ts   # Real-time analysis hook
│   └── audio/
│       ├── useAudioRecorder.ts      # Audio recording logic
│       ├── useAudioAnalysis.ts      # Audio analysis logic
│       └── useTranscription.ts      # Transcription logic
├── stores/
│   ├── audioStore.ts            # Audio state management
│   └── analysisStore.ts         # Analysis state management
├── types/
│   └── index.ts                 # TypeScript type definitions
├── lib/
│   └── utils.ts                 # Utility functions
└── App.tsx                      # Main application component
```

---

## 🔧 **Setup & Installation**

### **Prerequisites**

- **Node.js 18+** and npm
- **Modern browser** with microphone access
- **Backend API** running (see backend README)

### **Installation**

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Environment setup
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev

# Start staging server
npm run dev:staging
```

### **Environment Configuration**

```env
# Development (.env)
VITE_API_URL=http://localhost:3001/api
VITE_ENV=development
VITE_DEBUG_MODE=false
```

```env
# Staging (.env.staging)
VITE_API_URL=http://localhost:3002/api
VITE_ENV=staging
VITE_DEBUG_MODE=true
```

---

## 🎛️ **Core Components**

### **AudioRecorder Component**

**Location**: `src/components/features/audio/AudioRecorder.tsx`

**Features:**

- Professional-grade audio recording (44.1kHz WAV)
- Real-time visual feedback with recording status
- 3-second chunk processing for instant analysis
- Play/pause controls with visual indicators

**Usage:**

```tsx
<AudioRecorder
  onAudioData={handleAudioData}
  onError={handleAudioError}
/>
```

**Props:**

```typescript
interface AudioRecorderProps {
  onAudioData: (audioBlob: Blob) => void;
  onError: (error: string) => void;
}
```

### **ExpandedProfileDisplay Component** ⭐

**Location**: `src/components/features/audio/ExpandedProfileDisplay.tsx`

**Features:**

- Complete DISC+FDNA profile visualization
- MBTI personality type display with dimensions
- Behavioral axes with interactive progress bars
- Color-coded traits and characteristics

**Usage:**

```tsx
<ExpandedProfileDisplay
  discProfile={expandedDiscProfile}
  mbtiProfile={mbtiProfile}
  isLoading={false}
/>
```

**Visualizations:**

- **DISC Profile**: Type, subtype, confidence score
- **Behavioral Axes**: Attack/Defense and Reason/Emotion bars
- **MBTI Type**: 16-type display with dimension scoring
- **Traits & Strengths**: Color-coded badges and lists

### **LiveRecommendations Component**

**Location**: `src/components/features/audio/LiveRecommendations.tsx`

**Features:**

- Real-time strategy suggestions
- Profile-specific sales scripts
- Dynamic objection handling advice
- Visual confidence indicators

**Usage:**

```tsx
<LiveRecommendations
  currentProfile={currentProfile}
  latestTranscript={latestTranscript}
  isRecording={isRecording}
/>
```

---

## 🎨 **Design System**

### **Color Palette**

```css
/* DISC Profile Colors */
.disc-pragmatico {
  @apply bg-red-500 text-white;
}
.disc-intuitivo {
  @apply bg-yellow-500 text-white;
}
.disc-analitico {
  @apply bg-blue-500 text-white;
}
.disc-integrador {
  @apply bg-green-500 text-white;
}

/* MBTI Dimension Colors */
.mbti-e {
  @apply text-orange-600;
}
.mbti-i {
  @apply text-purple-600;
}
.mbti-s {
  @apply text-green-600;
}
.mbti-n {
  @apply text-blue-600;
}
.mbti-t {
  @apply text-gray-600;
}
.mbti-f {
  @apply text-pink-600;
}
.mbti-j {
  @apply text-indigo-600;
}
.mbti-p {
  @apply text-yellow-600;
}
```

### **Glassmorphism Effects**

```css
/* Card Glassmorphism */
.glass-card {
  @apply bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100;
}

/* Hover Effects */
.glass-card:hover {
  @apply shadow-3xl -translate-y-2 transition-all duration-300;
}
```

### **Typography Scale**

```css
/* Headers */
.heading-xl {
  @apply text-6xl font-bold;
}
.heading-lg {
  @apply text-4xl font-bold;
}
.heading-md {
  @apply text-2xl font-bold;
}

/* Body Text */
.body-lg {
  @apply text-xl leading-relaxed;
}
.body-md {
  @apply text-base;
}
.body-sm {
  @apply text-sm;
}
```

---

## ⚡ **State Management**

### **Real-time Analysis Flow**

```typescript
// App.tsx - Main analysis flow
const handleRealTimeAnalysis = async (transcript: string) => {
  if (transcript.length < 10) return;

  try {
    const result = await apiService.processExpandedBehavioral(transcript);

    if (result.success) {
      // Update basic profile (compatibility)
      setCurrentProfile(transformToBasicProfile(result.data.profiles.disc));

      // Update expanded profiles
      setBehavioralAnalysis(result.data);
      setExpandedDiscProfile(result.data.profiles.disc);
      setMBTIProfile(result.data.profiles.mbti);
      setShowExpandedAnalysis(true);
    }
  } catch (error) {
    console.error("Analysis error:", error);
  }
};
```

### **Audio State Management**

```typescript
// Audio recording states
const [isRecording, setIsRecording] = useState(false);
const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
const [currentProfile, setCurrentProfile] = useState<DiscProfile | null>(null);
const [latestTranscript, setLatestTranscript] = useState("");

// Expanded analysis states
const [expandedDiscProfile, setExpandedDiscProfile] =
  useState<ExpandedDISCProfile | null>(null);
const [mbtiProfile, setMBTIProfile] = useState<MBTIProfile | null>(null);
const [behavioralAnalysis, setBehavioralAnalysis] =
  useState<BehavioralAnalysisResponse | null>(null);
```

---

## 🔗 **API Integration**

### **API Service**

**Location**: `src/services/api.ts`

**Key Methods:**

```typescript
export const apiService = {
  // Health check
  async healthCheck(): Promise<HealthResponse>

  // Audio processing
  async processAudio(audioFile: File, sessionId: string): Promise<AnalysisResponse>

  // Behavioral analysis
  async processExpandedBehavioral(transcript: string): Promise<CompleteBehavioralResponse>
  async processExpandedDISC(transcript: string): Promise<ExpandedAnalysisResponse>
  async processMBTI(transcript: string): Promise<MBTIAnalysisResponse>

  // Recommendations
  async generateRecommendations(analysisData: any): Promise<RecommendationResponse>
}
```

### **Type Definitions**

```typescript
// Behavioral Analysis Types
export interface ExpandedDISCProfile {
  type: DISCType;
  confidence: number;
  reasoning: string;
  subtype: FDNASubtype;
  behavioralAxes: BehavioralAxes;
  fdnaDetails: FDNADetails;
}

export interface MBTIProfile {
  type: MBTIType;
  dimensions: MBTIDimensions;
  confidence: number;
  description: string;
  strengths: string[];
  developmentAreas: string[];
}

export interface BehavioralAnalysisResponse {
  transcript: string;
  profiles: {
    disc: ExpandedDISCProfile;
    mbti: MBTIProfile;
  };
  recommendations: CombinedRecommendations;
}
```

---

## 🎛️ **Custom Hooks**

### **useAudioRecorder Hook**

```typescript
// src/hooks/audio/useAudioRecorder.ts
export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // RecordRTC setup and recording logic
      setIsRecording(true);
    } catch (err) {
      setError("Microphone access denied");
    }
  };

  const stopRecording = () => {
    // Stop recording and generate blob
    setIsRecording(false);
  };

  return {
    isRecording,
    audioBlob,
    error,
    startRecording,
    stopRecording,
  };
};
```

### **useRealTimeAnalysis Hook**

```typescript
// src/hooks/useRealTimeAnalysis.ts
export const useRealTimeAnalysis = () => {
  const [analysis, setAnalysis] = useState<BehavioralAnalysisResponse | null>(
    null
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeTranscript = useCallback(async (transcript: string) => {
    if (transcript.length < 10) return;

    setIsAnalyzing(true);
    try {
      const result = await apiService.processExpandedBehavioral(transcript);
      if (result.success) {
        setAnalysis(result.data);
      }
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  // Debounced analysis to prevent excessive API calls
  const debouncedAnalyze = useMemo(
    () => debounce(analyzeTranscript, 1000),
    [analyzeTranscript]
  );

  return {
    analysis,
    isAnalyzing,
    analyzeTranscript: debouncedAnalyze,
  };
};
```

---

## 🎨 **Component Examples**

### **Progress Bar Component**

```tsx
// src/components/ui/progress.tsx
export const Progress = ({ value, className }: ProgressProps) => (
  <ProgressPrimitive.Root
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
);
```

### **Behavioral Axes Visualization**

```tsx
// Example usage in ExpandedProfileDisplay.tsx
<div className="space-y-3">
  <h4 className="font-medium text-gray-700">Eixos Comportamentais</h4>

  {/* Attack/Defense Axis */}
  <div className="space-y-1">
    <div className="flex justify-between text-sm">
      <span className="flex items-center gap-1">
        <TrendingUp className="h-3 w-3" />
        Ataque
      </span>
      <span className="flex items-center gap-1">
        Defesa
        <TrendingDown className="h-3 w-3" />
      </span>
    </div>
    <Progress
      value={scoreToPercentage(discProfile.behavioralAxes.attackDefense)}
      className="h-2"
    />
    <div className="text-xs text-center text-gray-500">
      {discProfile.behavioralAxes.attackDefense > 0
        ? "Orientado por resultados"
        : "Cauteloso"}
    </div>
  </div>
</div>
```

---

## 📱 **Responsive Design**

### **Breakpoint System**

```css
/* Tailwind CSS Breakpoints */
.responsive-grid {
  @apply grid grid-cols-1; /* Mobile */
  @apply lg:grid-cols-2; /* Tablet */
  @apply xl:grid-cols-3; /* Desktop */
  @apply 2xl:grid-cols-4; /* Large Desktop */
}
```

### **Mobile Optimizations**

- **Touch-friendly buttons** (minimum 44px tap targets)
- **Readable text sizes** (minimum 16px on mobile)
- **Optimized card layouts** for small screens
- **Gesture-based interactions** for audio controls

---

## 🧪 **Testing & Development**

### **Available Scripts**

```bash
# Development
npm run dev              # Start development server (port 5173)
npm run dev:staging      # Start staging server (port 5174)

# Production
npm run build           # Build for production
npm run preview         # Preview production build

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues
npm run type-check      # TypeScript type checking

# Testing
npm run test            # Run test suite
npm run test:ui         # Run tests with UI
npm run test:coverage   # Generate coverage report
```

### **Development Tools**

```json
{
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@vitejs/plugin-react": "^4.0.3",
    "autoprefixer": "^10.4.14",
    "eslint": "^8.45.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "postcss": "^8.4.27",
    "tailwindcss": "^3.3.0",
    "typescript": "^5.0.2",
    "vite": "^4.4.5"
  }
}
```

---

## 🎯 **Performance Optimization**

### **Bundle Optimization**

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: ["@radix-ui/react-progress", "@radix-ui/react-tabs"],
          audio: ["recordrtc"],
        },
      },
    },
  },
});
```

### **Code Splitting**

```typescript
// Lazy load heavy components
const ExpandedProfileDisplay = lazy(() => import('./components/features/audio/ExpandedProfileDisplay'));

// Suspense wrapper
<Suspense fallback={<LoadingSpinner />}>
  <ExpandedProfileDisplay {...props} />
</Suspense>
```

### **Performance Metrics**

- **Initial Load**: <2 seconds
- **Time to Interactive**: <3 seconds
- **Bundle Size**: <500KB gzipped
- **Lighthouse Score**: 95+ Performance

---

## 🔒 **Security & Best Practices**

### **Environment Variables**

```typescript
// Secure environment variable access
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
const IS_STAGING = import.meta.env.VITE_ENV === "staging";

// Never expose sensitive data
// ❌ Don't do this: VITE_SECRET_KEY (exposed to client)
// ✅ Do this: VITE_API_URL (safe to expose)
```

### **Content Security Policy**

```html
<!-- index.html -->
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               connect-src 'self' http://localhost:3001 http://localhost:3002;"
/>
```

### **Input Sanitization**

```typescript
// Sanitize user inputs
const sanitizeTranscript = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove potential HTML
    .substring(0, 5000); // Limit length
};
```

---

## 🎨 **Theming & Customization**

### **CSS Custom Properties**

```css
/* globals.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --accent: 210 40% 94%;
  --destructive: 0 84.2% 60.2%;
  --ring: 221.2 83.2% 53.3%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... dark theme colors */
}
```

### **Component Styling**

```typescript
// Configurable styling with variants
const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm",
  {
    variants: {
      variant: {
        default: "bg-white/90 backdrop-blur-sm",
        glass: "bg-white/80 backdrop-blur-md border-white/20",
        solid: "bg-white border-gray-200",
      },
    },
  }
);
```

---

## 📊 **Analytics & Monitoring**

### **User Interaction Tracking**

```typescript
// Track component interactions
const trackAnalysisRequest = () => {
  if (import.meta.env.PROD) {
    // Analytics tracking
    gtag("event", "behavioral_analysis_request", {
      event_category: "user_interaction",
      event_label: "real_time_analysis",
    });
  }
};
```

### **Performance Monitoring**

```typescript
// Monitor component performance
const PerformanceTracker = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        console.log(`${entry.name}: ${entry.duration}ms`);
      });
    });

    observer.observe({ entryTypes: ['measure'] });
    return () => observer.disconnect();
  }, []);

  return <>{children}</>;
};
```

---

## 🚀 **Deployment**

### **Production Build**

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Build outputs to dist/
ls dist/
# index.html, assets/, etc.
```

### **Environment-specific Builds**

```bash
# Staging build
VITE_ENV=staging npm run build

# Production build
VITE_ENV=production npm run build
```

### **Deployment Targets**

- **Vercel**: Zero-config deployment
- **Netlify**: Continuous deployment from Git
- **AWS S3 + CloudFront**: Manual deployment
- **Docker**: Containerized deployment

---

## 📝 **Contributing**

### **Component Development Guidelines**

1. **Use TypeScript** with strict typing
2. **Follow naming conventions** (PascalCase for components)
3. **Include prop documentation** with JSDoc comments
4. **Add accessibility attributes** (ARIA labels, keyboard navigation)
5. **Write tests** for complex logic

### **Code Style**

```typescript
// ✅ Good component structure
interface ComponentProps {
  /** The user's DISC profile data */
  profile: ExpandedDISCProfile;
  /** Callback when analysis completes */
  onAnalysisComplete?: (result: AnalysisResult) => void;
}

export const MyComponent: React.FC<ComponentProps> = ({
  profile,
  onAnalysisComplete
}) => {
  // Component logic
  return (
    <div className="flex items-center space-x-4">
      {/* Component content */}
    </div>
  );
};
```

---

## 🔧 **Troubleshooting**

### **Common Issues**

**Microphone Access Denied:**

```typescript
// Check browser permissions
if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
  console.error("Browser does not support audio recording");
}
```

**API Connection Issues:**

```typescript
// Verify backend connection
const healthCheck = async () => {
  try {
    await apiService.healthCheck();
    console.log("✅ Backend connected");
  } catch (error) {
    console.error("❌ Backend connection failed:", error);
  }
};
```

**Build Issues:**

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run type-check
```

---

<div align="center">

**🎨 Beautiful, Responsive, Professional**

_Modern React interface for AI-powered sales intelligence_

**Ready for Production** • **Mobile Optimized** • **Accessible Design**

</div>
