export interface ResourceCategory {
  id: string;
  title: string;
  description: string;
  iconName: string;
  href: string;
  itemCount: number;
}

export interface ResourceDocItem {
  slug: string;
  category: string;
  title: string;
  description: string;
  content: string;
  prevSlug?: string;
  nextSlug?: string;
}

export interface TutorialItem {
  id: string;
  slug: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  time: string;
  technology: string;
  description: string;
  prerequisites: string[];
  steps: { title: string; content: string; code?: string }[];
  testing: string;
  deployment: string;
}

export interface DevGuideItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  toc: string[];
  content: string;
  codeExamples: { title: string; language: string; code: string }[];
  bestPractices: string[];
}

export interface ApiEndpointItem {
  id: string;
  slug: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  title: string;
  description: string;
  parameters: { name: string; type: string; required: boolean; description: string }[];
  headers: { name: string; value: string; description: string }[];
  requestBody?: string;
  responseBody: string;
  exampleRequest: string;
  exampleResponse: string;
  realBackendUrl: string;
}

export interface ArchitectureGuideItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  diagramType: 'layered' | 'microservices' | 'database' | 'api-gateway';
  overview: string;
  components: { name: string; role: string; details: string }[];
  bestPractices: string[];
}

export interface DeploymentGuideItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  prerequisites: string[];
  dockerfile?: string;
  buildCommands: string[];
  envVariables: { key: string; description: string; example: string }[];
  steps: { title: string; instructions: string; code?: string }[];
  troubleshooting: string[];
}

export const RESOURCE_CATEGORIES: ResourceCategory[] = [
  {
    id: 'documentation',
    title: 'Documentation',
    description: 'Comprehensive API specifications, framework guidelines, and component references for Application Development Hub.',
    iconName: 'BookOpen',
    href: '/resources/documentation',
    itemCount: 9,
  },
  {
    id: 'tutorials',
    title: 'Tutorials',
    description: 'Step-by-step technical walkthroughs for constructing full-stack applications, integrating AI, and building REST APIs.',
    iconName: 'GraduationCap',
    href: '/resources/tutorials',
    itemCount: 8,
  },
  {
    id: 'development-guides',
    title: 'Development Guides',
    description: 'Coding standards, git workflow rules, TypeScript practices, and design system patterns for maintainable code bases.',
    iconName: 'FileCode',
    href: '/resources/development-guides',
    itemCount: 8,
  },
  {
    id: 'api',
    title: 'API Resources',
    description: 'Interactive OpenAPI schemas, Postman collections, authorization guides, and sandbox environment endpoints.',
    iconName: 'Server',
    href: '/resources/api',
    itemCount: 4,
  },
  {
    id: 'architecture',
    title: 'Architecture Guides',
    description: 'Blueprints for microservices, database normalization, caching layers, and high-availability system designs.',
    iconName: 'Network',
    href: '/resources/architecture',
    itemCount: 9,
  },
  {
    id: 'deployment',
    title: 'Deployment Guides',
    description: 'Production deployment tutorials for Docker containers, Vercel edge networks, and AWS infrastructure pipelines.',
    iconName: 'Cloud',
    href: '/resources/deployment',
    itemCount: 8,
  },
];

/* ----------------------------------------------------
   DOCUMENTATION ITEMS
---------------------------------------------------- */
export const DOCUMENTATION_ITEMS: ResourceDocItem[] = [
  {
    slug: 'introduction',
    category: 'Getting Started',
    title: 'Introduction',
    description: 'Welcome to Application Development Hub documentation.',
    content: `Welcome to the Application Development Hub documentation! This hub provides developer workflows, architecture blueprints, API references, and pre-configured workspace templates to design, build, test, and release production-grade software applications.`,
    prevSlug: undefined,
    nextSlug: 'getting-started',
  },
  {
    slug: 'getting-started',
    category: 'Getting Started',
    title: 'Getting Started',
    description: 'Quick setup guide to initialize your workspace environment.',
    content: `To get started with the Application Development Hub:
1. Access the Developer Workspace from the top navigation bar or via shortcut.
2. Initialize your local Node.js environment with \`npm install\`.
3. Configure environment variables in your \`.env\` file.
4. Launch the local dev server using \`npm run dev\` on port 4028.`,
    prevSlug: 'introduction',
    nextSlug: 'creating-first-app',
  },
  {
    slug: 'creating-first-app',
    category: 'Application Development',
    title: 'Creating Your First Application',
    description: 'Step-by-step guide to generating a new web or mobile app.',
    content: `Creating a new application in AppDevHub takes under 2 minutes:
- Open the Developer Workspace ('/') or click **Create New Application**.
- Select a starter template (e.g. Next.js 15 App Router, React 19, or FastAPI).
- Enter project details, repository name, and target database.
- Click **Generate Project** to scaffold your codebase with pre-configured TypeScript schemas and Tailwind CSS styling.`,
    prevSlug: 'getting-started',
    nextSlug: 'project-structure',
  },
  {
    slug: 'project-structure',
    category: 'Application Development',
    title: 'Project Structure',
    description: 'Understanding directory layout and module architecture.',
    content: `The default AppDevHub Next.js project structure follows Next.js App Router conventions:

\`\`\`
appdevhub/
├── src/
│   ├── app/                    # Next.js App Router routes & layouts
│   ├── components/             # Reusable UI component library
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Data models, mock data & utils
│   └── styles/                 # Global CSS & Tailwind configuration
├── prisma/
│   ├── schema.prisma           # PostgreSQL Prisma ORM schema
│   └── seed.ts                 # Database seed script
├── public/                     # Static media & assets
└── package.json                # Project dependencies & scripts
\`\`\``,
    prevSlug: 'creating-first-app',
    nextSlug: 'working-with-apps',
  },
  {
    slug: 'working-with-apps',
    category: 'Application Development',
    title: 'Working With Applications',
    description: 'Managing active project state, environments, and deployments.',
    content: `Manage your active projects in the **Your Applications** section of the Developer Workspace:
- Monitor live production status, staging builds, and update timestamps.
- View component libraries and connected REST/GraphQL endpoints.
- Switch between production mode and interactive code editor mode seamlessly.`,
    prevSlug: 'project-structure',
    nextSlug: 'code-editor-usage',
  },
  {
    slug: 'code-editor-usage',
    category: 'Frontend',
    title: 'Using the Code Editor',
    description: 'Using the built-in browser IDE and live preview window.',
    content: `AppDevHub includes a lightweight browser IDE for inspecting files, testing React components, and editing TypeScript code directly. Click **Open Code Editor** or press \`Ctrl + K\` to trigger the editor overlay.`,
    prevSlug: 'working-with-apps',
    nextSlug: 'connecting-apis',
  },
  {
    slug: 'connecting-apis',
    category: 'APIs',
    title: 'Connecting APIs',
    description: 'Connecting backend endpoints and configuring OpenAPI schemas.',
    content: `Connect backend services using standard REST or GraphQL contracts:
- Place API handlers in \`src/app/api/[endpoint]/route.ts\`.
- Export standard HTTP methods (\`GET\`, \`POST\`, \`PUT\`, \`DELETE\`).
- Test endpoints directly using the **API Resources** interactive explorer.`,
    prevSlug: 'code-editor-usage',
    nextSlug: 'database-config',
  },
  {
    slug: 'database-config',
    category: 'Database',
    title: 'Database Configuration',
    description: 'Setting up PostgreSQL, Prisma ORM schemas, and migrations.',
    content: `AppDevHub uses Prisma ORM with PostgreSQL database instances:
- Set your connection string in \`.env\`: \`DATABASE_URL="postgresql://user:pass@localhost:5432/appdevhub"\`
- Run \`npx prisma db push\` to apply schema changes to your database.
- Run \`npx prisma generate\` to update TypeScript Prisma Client types.`,
    prevSlug: 'connecting-apis',
    nextSlug: 'deployment-config',
  },
  {
    slug: 'deployment-config',
    category: 'Deployment',
    title: 'Deployment & Environments',
    description: 'Deploying your application to Vercel, AWS, or Docker containers.',
    content: `Deploying to production:
- Push code to your GitHub repository to trigger automatic GitHub Actions CI/CD.
- Build Docker containers using the root \`Dockerfile\`.
- Host frontend applications on Vercel or AWS ECS with zero downtime.`,
    prevSlug: 'database-config',
    nextSlug: undefined,
  },
];

/* ----------------------------------------------------
   TUTORIALS ITEMS
---------------------------------------------------- */
export const TUTORIAL_ITEMS: TutorialItem[] = [
  {
    id: 'tut-1',
    slug: 'build-first-app',
    title: 'Build Your First Application',
    difficulty: 'Beginner',
    time: '15 min',
    technology: 'React + Node.js',
    description: 'Scaffold a complete full-stack web application from scratch with pre-configured routing and styling.',
    prerequisites: ['Node.js 18+ installed', 'Basic familiarity with HTML & JavaScript'],
    steps: [
      {
        title: 'Step 1: Open Developer Workspace',
        content: 'Navigate to the AppDevHub workspace homepage and click "Create New Application". Select the Web Application template.',
      },
      {
        title: 'Step 2: Configure Application Metadata',
        content: 'Name your project "my-first-app", set the primary technology to React 19 + TypeScript, and click Generate.',
        code: `npm create appdevhub-app my-first-app --template react-ts\ncd my-first-app\nnpm install`,
      },
      {
        title: 'Step 3: Run Development Server',
        content: 'Execute the dev script to start the local Next.js development server on port 4028.',
        code: `npm run dev`,
      },
      {
        title: 'Step 4: Verify Output in Browser',
        content: 'Open http://localhost:4028 in your browser to inspect your newly created application.',
      },
    ],
    testing: 'Run `npm run type-check` and `npm run test` to verify TypeScript contracts and unit test suites.',
    deployment: 'Deploy your application with `vercel deploy` or `docker build -t my-first-app .`.',
  },
  {
    id: 'tut-2',
    slug: 'create-react-app',
    title: 'Create a React Application',
    difficulty: 'Beginner',
    time: '20 min',
    technology: 'React + Next.js',
    description: 'Learn component architecture, state management with hooks, and responsive Tailwind layout design.',
    prerequisites: ['React basic knowledge', 'VS Code editor'],
    steps: [
      {
        title: 'Step 1: Create Component Files',
        content: 'Create a new React component file under `src/components/Header.tsx`.',
        code: `export default function Header() {\n  return (\n    <header className="p-4 bg-slate-900 text-white font-bold">\n      AppDevHub Component\n    </header>\n  );\n}`,
      },
      {
        title: 'Step 2: Import into Page Layout',
        content: 'Import and render the component inside `src/app/page.tsx`.',
      },
    ],
    testing: 'Test component rendering with React Testing Library.',
    deployment: 'Deploy to Vercel edge network.',
  },
  {
    id: 'tut-3',
    slug: 'build-fastapi-backend',
    title: 'Build a FastAPI Backend',
    difficulty: 'Intermediate',
    time: '25 min',
    technology: 'Python + FastAPI',
    description: 'Construct high-performance asynchronous REST APIs in Python with automated Pydantic OpenAPI documentation.',
    prerequisites: ['Python 3.10+', 'pip package manager'],
    steps: [
      {
        title: 'Step 1: Install FastAPI & Uvicorn',
        content: 'Install dependencies using pip.',
        code: `pip install fastapi uvicorn pydantic`,
      },
      {
        title: 'Step 2: Create Main API Script',
        content: 'Write asynchronous route handlers in `main.py`.',
        code: `from fastapi import FastAPI\n\napp = FastAPI(title="AppDevHub API")\n\n@app.get("/api/v1/health")\nasync def health():\n    return {"status": "operational", "latency": "14ms"}`,
      },
      {
        title: 'Step 3: Launch ASGI Server',
        content: 'Start the Uvicorn ASGI server.',
        code: `uvicorn main:app --reload --port 8000`,
      },
    ],
    testing: 'Access interactive Swagger documentation at http://localhost:8000/docs.',
    deployment: 'Deploy as a Docker container on AWS App Runner or Render.',
  },
  {
    id: 'tut-4',
    slug: 'connect-postgresql',
    title: 'Connect PostgreSQL Database',
    difficulty: 'Intermediate',
    time: '20 min',
    technology: 'PostgreSQL + Prisma',
    description: 'Set up relational database schemas, execute migrations, and query data using Prisma ORM client.',
    prerequisites: ['PostgreSQL installed locally or Docker instance', 'Prisma CLI'],
    steps: [
      {
        title: 'Step 1: Define Prisma Models',
        content: 'Add database models in `prisma/schema.prisma`.',
        code: `model Project {\n  id        String   @id @default(uuid())\n  name      String\n  status    String\n  createdAt DateTime @default(now())\n}`,
      },
      {
        title: 'Step 2: Run Database Migration',
        content: 'Push model definitions directly to PostgreSQL.',
        code: `npx prisma db push`,
      },
    ],
    testing: 'Inspect records using Prisma Studio (`npx prisma studio`).',
    deployment: 'Connect to managed PostgreSQL instance (Supabase / AWS RDS).',
  },
  {
    id: 'tut-5',
    slug: 'create-rest-apis',
    title: 'Create REST APIs',
    difficulty: 'Intermediate',
    time: '30 min',
    technology: 'Node.js + Express',
    description: 'Design RESTful HTTP endpoints with input validation, error handling middleware, and JSON responses.',
    prerequisites: ['Node.js', 'Postman or cURL'],
    steps: [
      {
        title: 'Step 1: Create Route Handler',
        content: 'Define route handlers in `src/app/api/events/route.ts`.',
        code: `import { NextResponse } from 'next/server';\nimport { MOCK_EVENTS } from '@/lib/mockData';\n\nexport async function GET() {\n  return NextResponse.json({ success: true, data: MOCK_EVENTS });\n}`,
      },
    ],
    testing: 'Test endpoints with cURL: `curl http://localhost:4028/api/events`.',
    deployment: 'Deploy API route handlers to Next.js serverless functions.',
  },
  {
    id: 'tut-6',
    slug: 'deploy-application',
    title: 'Deploy an Application',
    difficulty: 'Intermediate',
    time: '15 min',
    technology: 'Docker + AWS',
    description: 'Package your web application into a multi-stage Docker container and deploy to production cloud hosting.',
    prerequisites: ['Docker Desktop installed', 'Cloud hosting account'],
    steps: [
      {
        title: 'Step 1: Write Dockerfile',
        content: 'Create a multi-stage Docker build config in `Dockerfile`.',
        code: `FROM node:18-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nRUN npm run build\nCMD ["npm", "start"]`,
      },
    ],
    testing: 'Test local container: `docker run -p 4028:4028 appdevhub-app`.',
    deployment: 'Push container image to Amazon ECR or Docker Hub.',
  },
  {
    id: 'tut-7',
    slug: 'add-authentication',
    title: 'Add Authentication & JWT',
    difficulty: 'Advanced',
    time: '35 min',
    technology: 'NextAuth + JWT',
    description: 'Implement secure password hashing, JSON Web Tokens (JWT), session cookies, and role-based route guards.',
    prerequisites: ['TypeScript', 'Auth concept understanding'],
    steps: [
      {
        title: 'Step 1: Configure JWT Middleware',
        content: 'Enforce authenticated session tokens on protected routes.',
      },
    ],
    testing: 'Verify login authentication flows and token expiration.',
    deployment: 'Set strong secret keys (`JWT_SECRET`) in production environment.',
  },
  {
    id: 'tut-8',
    slug: 'build-ai-application',
    title: 'Build an AI-Powered Application',
    difficulty: 'Advanced',
    time: '40 min',
    technology: 'Gemini AI + RAG',
    description: 'Integrate Google Gemini AI LLM model, prompt engineering, vector embeddings, and RAG pipelines.',
    prerequisites: ['GEMINI_API_KEY', 'Python / Node.js'],
    steps: [
      {
        title: 'Step 1: Initialize Gemini Client',
        content: 'Configure Gemini API client with environment API key.',
        code: `import { GoogleGenerativeAI } from '@google/generative-ai';\nconst ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);\nconst model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });`,
      },
    ],
    testing: 'Run test prompt generator to verify live AI responses.',
    deployment: 'Deploy AI application serverless endpoints.',
  },
];

/* ----------------------------------------------------
   DEVELOPMENT GUIDES ITEMS
---------------------------------------------------- */
export const DEV_GUIDE_ITEMS: DevGuideItem[] = [
  {
    id: 'dg-1',
    slug: 'coding-standards',
    title: 'Coding Standards & Style Guide',
    description: 'Uniform coding rules, formatting conventions, and naming patterns across TypeScript and CSS.',
    toc: ['Overview', 'Naming Conventions', 'Formatting', 'Component Structure'],
    content: `Maintaining clean and consistent coding standards across the codebase prevents technical debt and speeds up onboarding.
- Use **camelCase** for variable and function names.
- Use **PascalCase** for React components and TypeScript interfaces.
- Use **UPPER_SNAKE_CASE** for global constants and environment variables.
- Always annotate function parameter types and return types explicitly in TypeScript.`,
    codeExamples: [
      {
        title: 'Clean Function Signature Example',
        language: 'typescript',
        code: `export interface UserProfile {\n  id: string;\n  name: string;\n  role: 'admin' | 'developer';\n}\n\nexport function formatUserName(user: UserProfile): string {\n  return \`\${user.name} (\${user.role.toUpperCase()})\`;\n}`,
      },
    ],
    bestPractices: [
      'Enable ESLint and Prettier formatting on file save.',
      'Never use the `any` type in TypeScript; use proper generics or `unknown`.',
      'Keep functions small and focused on a single responsibility.',
    ],
  },
  {
    id: 'dg-2',
    slug: 'git-workflow',
    title: 'Git Workflow & Branching Strategy',
    description: 'Branch management, pull requests, semantic commits, and code review guidelines.',
    toc: ['Branching Model', 'Commit Messages', 'Pull Request Review'],
    content: `We follow the Feature Branch Git workflow:
- \`main\`: Production-ready code branch.
- \`feature/feature-name\`: New feature development.
- \`fix/bug-name\`: Bug fix branch.

Commit Message Format:
\`feat: add interactive REST API explorer\`
\`fix: resolve navbar scroll padding gap\``,
    codeExamples: [
      {
        title: 'Git Branch Creation Commands',
        language: 'bash',
        code: `git checkout main\ngit pull origin main\ngit checkout -b feature/user-auth\ngit add .\ngit commit -m "feat: implement JWT auth middleware"\ngit push origin feature/user-auth`,
      },
    ],
    bestPractices: [
      'Never commit API secret keys or credentials to public Git repositories.',
      'Rebase feature branches against main before creating Pull Requests.',
      'Ensure CI type-check passes before merging.',
    ],
  },
  {
    id: 'dg-3',
    slug: 'typescript-best-practices',
    title: 'TypeScript Best Practices',
    description: 'Strict type safety, generics, interface declaration, and compiler configurations.',
    toc: ['Strict Mode', 'Discriminated Unions', 'Utility Types', 'Generics'],
    content: `TypeScript provides strong compile-time safety and self-documenting code. Ensure \`tsconfig.json\` has \`"strict": true\` enabled.`,
    codeExamples: [
      {
        title: 'Discriminated Union Pattern',
        language: 'typescript',
        code: `type AsyncState<T> =\n  | { status: 'idle' }\n  | { status: 'loading' }\n  | { status: 'success'; data: T }\n  | { status: 'error'; error: Error };\n\nfunction renderState<T>(state: AsyncState<T>) {\n  switch (state.status) {\n    case 'loading': return 'Loading...';\n    case 'success': return \`Loaded: \${JSON.stringify(state.data)}\`;\n    case 'error': return \`Error: \${state.error.message}\`;\n    default: return 'Ready';\n  }\n}`,
      },
    ],
    bestPractices: [
      'Use `type` for unions/primitives and `interface` for expandable object schemas.',
      'Leverage utility types like `Partial<T>`, `Readonly<T>`, and `Omit<T, K>`.',
    ],
  },
  {
    id: 'dg-4',
    slug: 'react-architecture',
    title: 'React Architecture & Component Design',
    description: 'Modular component architecture, custom hooks, and state isolation rules.',
    toc: ['Component Hierarchy', 'State Location', 'Custom Hooks'],
    content: `Organize React components logically by feature domain. Keep transient UI state in local component scope and shared application data in context or custom hooks.`,
    codeExamples: [
      {
        title: 'Custom Hook Pattern',
        language: 'typescript',
        code: `import { useState, useEffect } from 'react';\n\nexport function useFetch<T>(url: string) {\n  const [data, setData] = useState<T | null>(null);\n  const [loading, setLoading] = useState(true);\n\n  useEffect(() => {\n    fetch(url)\n      .then(res => res.json())\n      .then(json => { setData(json); setLoading(false); });\n  }, [url]);\n\n  return { data, loading };\n}`,
      },
    ],
    bestPractices: [
      'Separate presentation components from data-fetching logic.',
      'Memoize heavy calculations using `useMemo` or `useCallback` when needed.',
    ],
  },
  {
    id: 'dg-5',
    slug: 'component-design',
    title: 'Design System & Component Architecture',
    description: 'Building accessible, reusable, and styled UI primitives with Tailwind CSS.',
    toc: ['Design Tokens', 'Accessibility', 'Variants'],
    content: `Components should expose clean prop interfaces and follow WCAG accessibility guidelines.`,
    codeExamples: [
      {
        title: 'Reusable Button Primitive',
        language: 'tsx',
        code: `interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {\n  variant?: 'primary' | 'secondary' | 'outline';\n}\n\nexport function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {\n  const baseStyle = "px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer";\n  const variants = {\n    primary: "bg-blue-600 text-white hover:bg-blue-500 shadow-xs",\n    secondary: "bg-slate-900 text-white hover:bg-slate-800",\n    outline: "border border-slate-300 text-slate-700 hover:bg-slate-50",\n  };\n  return (\n    <button className={\`\${baseStyle} \${variants[variant]} \${className}\`} {...props}>\n      {children}\n    </button>\n  );\n}`,
      },
    ],
    bestPractices: ['Ensure interactive elements have focus rings and ARIA labels.'],
  },
  {
    id: 'dg-6',
    slug: 'error-handling',
    title: 'Error Handling Strategy',
    description: 'Global error boundaries, try-catch handlers, and standard API error responses.',
    toc: ['Error Boundaries', 'API Exceptions', 'Logging'],
    content: `Always handle potential failures gracefully without crashing the user interface. Return structured JSON error objects from API routes.`,
    codeExamples: [
      {
        title: 'Standard API Error Response Schema',
        language: 'typescript',
        code: `export interface ApiErrorResponse {\n  success: false;\n  error: {\n    code: string;\n    message: string;\n    details?: unknown;\n  };\n}`,
      },
    ],
    bestPractices: ['Never swallow exceptions silently. Log tracebacks to server logs.'],
  },
  {
    id: 'dg-7',
    slug: 'testing-strategy',
    title: 'Testing Strategy & Quality Assurance',
    description: 'Unit testing, integration testing, component testing, and automated test runners.',
    toc: ['Testing Pyramid', 'Unit Tests', 'E2E Testing'],
    content: `Maintain test coverage across business logic helpers, API routes, and critical UI workflows.`,
    codeExamples: [
      {
        title: 'Jest Unit Test Example',
        language: 'typescript',
        code: `import { computeStatus } from '@/lib/mockData';\n\ntest('computes UPCOMING event status correctly', () => {\n  const status = computeStatus({ date: '2026-10-01', startTime: '10:00', endTime: '12:00', registrationDeadline: '2026-09-28T00:00' });\n  expect(status).toBe('UPCOMING');\n});`,
      },
    ],
    bestPractices: ['Run automated test suites on every pull request CI pipeline.'],
  },
  {
    id: 'dg-8',
    slug: 'performance-optimization',
    title: 'Performance Optimization & Metrics',
    description: 'Core Web Vitals, code splitting, image optimization, and caching strategies.',
    toc: ['Core Web Vitals', 'Image Optimization', 'Bundle Reduction'],
    content: `Optimize application load speeds for fast initial response times and smooth 60fps interactions.`,
    codeExamples: [
      {
        title: 'Next.js Image Optimization Component',
        language: 'tsx',
        code: `import Image from 'next/image';\n\n<Image\n  src="/assets/poster.png"\n  alt="Event Poster"\n  width={600}\n  height={400}\n  priority\n  className="object-cover rounded-2xl"\n/>`,
      },
    ],
    bestPractices: ['Use CSS transforms for animations instead of triggering layout reflows.'],
  },
];

/* ----------------------------------------------------
   API RESOURCES ITEMS (CONNECTS TO REAL ENDPOINTS)
---------------------------------------------------- */
export const API_RESOURCE_ITEMS: ApiEndpointItem[] = [
  {
    id: 'api-1',
    slug: 'get-events',
    method: 'GET',
    endpoint: '/api/events',
    title: 'Get All Events',
    description: 'Fetch list of all upcoming, ongoing, and completed technical events in the Application Development Hub.',
    parameters: [
      { name: 'category', type: 'string', required: false, description: 'Filter events by category (e.g. Hackathon, Workshop)' },
      { name: 'status', type: 'string', required: false, description: 'Filter events by status (UPCOMING, ONGOING, COMPLETED)' },
    ],
    headers: [
      { name: 'Accept', value: 'application/json', description: 'Expected media response type' },
    ],
    responseBody: `{
  "success": true,
  "count": 16,
  "events": [
    {
      "id": "remote-event-5",
      "title": "AI Smart Campus Hackathon",
      "category": "Hackathon",
      "status": "COMPLETED",
      "date": "2026-03-14",
      "venue": "N Block Class rooms"
    }
  ]
}`,
    exampleRequest: `curl -X GET "http://localhost:4028/api/events" -H "Accept: application/json"`,
    exampleResponse: `HTTP/1.1 200 OK\nContent-Type: application/json\n\n{\n  "success": true,\n  "count": 16,\n  "data": [...]\n}`,
    realBackendUrl: '/api/events',
  },
  {
    id: 'api-2',
    slug: 'post-events',
    method: 'POST',
    endpoint: '/api/events',
    title: 'Create New Event',
    description: 'Admin endpoint to publish a new technical event, hackathon, workshop, or coding contest.',
    parameters: [],
    headers: [
      { name: 'Content-Type', value: 'application/json', description: 'Payload format' },
    ],
    requestBody: `{
  "title": "Agentic AI Hackathon 2026",
  "category": "Hackathon",
  "branches": ["CSE", "IT", "AI/ML"],
  "description": "36-hour hackathon focused on building autonomous agent workflows.",
  "date": "2026-11-15",
  "startTime": "09:00",
  "endTime": "21:00",
  "venue": "Innovation Lab, Block B",
  "organizer": "Dept. of CSE",
  "registrationDeadline": "2026-11-10T23:59",
  "capacity": 200,
  "posterUrl": "/images/events/remote-event-5.png",
  "eligibility": "CSE & IT Students",
  "rules": "Original code required.",
  "requirements": "Laptop, Python 3.10+",
  "contactPerson": "Dr. Ramesh Babu",
  "contactEmail": "ramesh.babu@vignan.ac.in"
}`,
    responseBody: `{
  "success": true,
  "message": "Event created successfully",
  "event": {
    "id": "event-178794",
    "title": "Agentic AI Hackathon 2026",
    "status": "UPCOMING"
  }
}`,
    exampleRequest: `curl -X POST "http://localhost:4028/api/events" \\\n  -H "Content-Type: application/json" \\\n  -d '{"title":"Agentic AI Hackathon 2026","category":"Hackathon",...}'`,
    exampleResponse: `HTTP/1.1 201 Created\nContent-Type: application/json\n\n{\n  "success": true,\n  "event": { "id": "event-178794", "title": "Agentic AI Hackathon 2026" }\n}`,
    realBackendUrl: '/api/events',
  },
  {
    id: 'api-3',
    slug: 'get-registrations',
    method: 'GET',
    endpoint: '/api/registrations',
    title: 'Get All Registrations',
    description: 'Fetch student registration records and attendance statuses for events.',
    parameters: [
      { name: 'eventId', type: 'string', required: false, description: 'Filter registrations by specific event ID' },
    ],
    headers: [
      { name: 'Accept', value: 'application/json', description: 'Expected media response type' },
    ],
    responseBody: `{
  "success": true,
  "count": 42,
  "registrations": [
    {
      "id": "reg-01",
      "studentName": "Aarav Kumar",
      "email": "aarav.kumar@vignan.ac.in",
      "department": "CSE",
      "registrationId": "REG-2026-9481",
      "attendanceStatus": "present"
    }
  ]
}`,
    exampleRequest: `curl -X GET "http://localhost:4028/api/registrations" -H "Accept: application/json"`,
    exampleResponse: `HTTP/1.1 200 OK\nContent-Type: application/json\n\n{\n  "success": true,\n  "count": 42,\n  "registrations": [...]\n}`,
    realBackendUrl: '/api/registrations',
  },
  {
    id: 'api-4',
    slug: 'post-registrations',
    method: 'POST',
    endpoint: '/api/registrations',
    title: 'Register for Event',
    description: 'Register a student for an upcoming technical event or hackathon.',
    parameters: [],
    headers: [
      { name: 'Content-Type', value: 'application/json', description: 'Payload format' },
    ],
    requestBody: `{
  "eventId": "event-001",
  "studentId": "221FA04001",
  "studentName": "Ananya Sharma",
  "email": "ananya.sharma@vignan.ac.in",
  "mobile": "9876543210",
  "department": "CSE",
  "year": "3rd Year",
  "section": "CSE-A",
  "gender": "Female",
  "skills": "React, Python, Tailwind"
}`,
    responseBody: `{
  "success": true,
  "message": "Registration successful",
  "registrationId": "REG-2026-8812"
}`,
    exampleRequest: `curl -X POST "http://localhost:4028/api/registrations" \\\n  -H "Content-Type: application/json" \\\n  -d '{"eventId":"event-001","studentName":"Ananya Sharma",...}'`,
    exampleResponse: `HTTP/1.1 201 Created\nContent-Type: application/json\n\n{\n  "success": true,\n  "registrationId": "REG-2026-8812"\n}`,
    realBackendUrl: '/api/registrations',
  },
];

/* ----------------------------------------------------
   ARCHITECTURE GUIDES ITEMS
---------------------------------------------------- */
export const ARCHITECTURE_ITEMS: ArchitectureGuideItem[] = [
  {
    id: 'arch-1',
    slug: 'application-architecture',
    title: 'Application Architecture & System Design',
    description: 'High-level system design patterns for multi-tenant enterprise software platforms.',
    diagramType: 'layered',
    overview: 'AppDevHub employs a 4-tier layered software architecture designed for high throughput, modular component isolation, and strict separation of concerns.',
    components: [
      { name: 'Presentation Layer', role: 'Next.js 15 App Router + React 19', details: 'Server-rendered pages and client side interactive components.' },
      { name: 'API Gateway & Routing', role: 'Edge API Routes + Middleware', details: 'Authentication token verification, rate limiting, and request routing.' },
      { name: 'Business Logic Services', role: 'Server Services & Event Handlers', details: 'Core domain logic, validation engines, and background worker jobs.' },
      { name: 'Data & Persistence', role: 'PostgreSQL + Prisma ORM + Redis', details: 'ACID-compliant relational database and fast in-memory caching.' },
    ],
    bestPractices: [
      'Maintain strict boundary isolation between UI presentation and database logic.',
      'Use typed DTOs (Data Transfer Objects) for cross-layer data contracts.',
      'Log system telemetry and trace IDs across distributed calls.',
    ],
  },
  {
    id: 'arch-2',
    slug: 'microservices',
    title: 'Microservices vs Monolith Architecture',
    description: 'Decoupling monolithic platforms into domain-driven microservices.',
    diagramType: 'microservices',
    overview: 'Microservices allow autonomous engineering teams to deploy independent services (Auth Service, Events Engine, Analytics Engine) without tight coupling.',
    components: [
      { name: 'Auth Microservice', role: 'Authentication & JWT Issuance', details: 'Isolated user session management and OAuth integrations.' },
      { name: 'Events Service', role: 'Event Lifecycle & Registrations', details: 'Handles hackathon schedules, capacity checks, and student registrations.' },
      { name: 'Notification Worker', role: 'RabbitMQ / Redis Queue Worker', details: 'Asynchronous email broadcasts and webhooks.' },
    ],
    bestPractices: [
      'Ensure each microservice owns its own database instance.',
      'Use asynchronous message queues for inter-service communication.',
    ],
  },
  {
    id: 'arch-3',
    slug: 'database-architecture',
    title: 'Database Architecture & Schema Design',
    description: 'Relational data modeling, indexing strategies, and Prisma migration strategies.',
    diagramType: 'database',
    overview: 'Relational database schema normalized to 3rd Normal Form (3NF) to eliminate data redundancy and enforce referential integrity.',
    components: [
      { name: 'Events Table', role: 'UUID Primary Keys', details: 'Stores event metadata, capacity, deadlines, and status.' },
      { name: 'Registrations Table', role: 'Foreign Key to Event', details: 'Unique constraint on (eventId, studentId) to prevent double registration.' },
    ],
    bestPractices: [
      'Add composite B-Tree indexes on frequently queried columns (e.g. status + date).',
      'Use transactions for multi-record operations.',
    ],
  },
];

/* ----------------------------------------------------
   DEPLOYMENT GUIDES ITEMS
---------------------------------------------------- */
export const DEPLOYMENT_ITEMS: DeploymentGuideItem[] = [
  {
    id: 'dep-1',
    slug: 'local-development',
    title: 'Local Development Environment Setup',
    description: 'Setting up Node.js, Prisma, PostgreSQL, and environment variables locally.',
    prerequisites: ['Node.js 18+', 'Git', 'PostgreSQL or Docker Desktop'],
    buildCommands: ['npm install', 'npx prisma db push', 'npm run dev'],
    envVariables: [
      { key: 'DATABASE_URL', description: 'PostgreSQL connection string', example: 'postgresql://postgres:postgres@localhost:5432/appdevhub' },
      { key: 'PORT', description: 'Local server port', example: '4028' },
    ],
    steps: [
      { title: 'Step 1: Clone Repository', instructions: 'Clone the codebase from GitHub.', code: 'git clone https://github.com/vignan/appdevhub.git\ncd appdevhub' },
      { title: 'Step 2: Install Dependencies', instructions: 'Install npm packages.', code: 'npm install' },
      { title: 'Step 3: Run Local Server', instructions: 'Start Next.js dev server on port 4028.', code: 'npm run dev' },
    ],
    troubleshooting: [
      'Port 4028 in use: Kill existing node process or specify a different port using `npm run dev -- -p 4029`.',
      'Prisma Connection error: Verify local PostgreSQL is running on port 5432.',
    ],
  },
  {
    id: 'dep-2',
    slug: 'docker',
    title: 'Docker Containerization & Production Build',
    description: 'Creating lightweight multi-stage Docker container images for deployment.',
    prerequisites: ['Docker Desktop', 'Dockerfile'],
    dockerfile: `FROM node:18-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM node:18-alpine AS runner\nWORKDIR /app\nENV NODE_ENV=production\nCOPY --from=builder /app/public ./public\nCOPY --from=builder /app/.next/standalone ./\nCOPY --from=builder /app/.next/static ./.next/static\nEXPOSE 4028\nCMD ["node", "server.js"]`,
    buildCommands: [
      'docker build -t appdevhub:v1.0 .',
      'docker run -d -p 4028:4028 --name appdevhub-container appdevhub:v1.0',
    ],
    envVariables: [
      { key: 'NODE_ENV', description: 'Production environment flag', example: 'production' },
      { key: 'PORT', description: 'Exposed container port', example: '4028' },
    ],
    steps: [
      { title: 'Step 1: Build Image', instructions: 'Execute multi-stage Docker build command.', code: 'docker build -t appdevhub:latest .' },
      { title: 'Step 2: Test Container', instructions: 'Run container locally to verify health.', code: 'docker run -p 4028:4028 appdevhub:latest' },
    ],
    troubleshooting: ['Docker daemon not running: Open Docker Desktop application.'],
  },
  {
    id: 'dep-3',
    slug: 'vercel',
    title: 'Vercel Edge Network Deployment',
    description: 'Deploying Next.js App Router applications to Vercel edge infrastructure.',
    prerequisites: ['Vercel Account', 'GitHub Repository'],
    buildCommands: ['vercel', 'vercel --prod'],
    envVariables: [
      { key: 'DATABASE_URL', description: 'Production PostgreSQL database URL', example: 'postgresql://...' },
    ],
    steps: [
      { title: 'Step 1: Connect GitHub Repo', instructions: 'Import your repository in Vercel Dashboard.' },
      { title: 'Step 2: Add Environment Variables', instructions: 'Set DATABASE_URL and API secrets in Vercel settings.' },
    ],
    troubleshooting: ['Build failed: Run `npm run build` locally to verify zero build errors.'],
  },
];
