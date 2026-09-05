export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarInitials: string;
  department: string;
  studentId?: string;
  year?: string;
  section?: string;
  phone?: string;
  college?: string;
}

export const MOCK_USERS: UserProfile[] = [
  {
    id: 'user-01',
    name: 'Developer',
    email: 'developer@vignan.ac.in',
    role: 'Lead Engineer · CSE',
    avatarInitials: 'DV',
    department: 'Computer Science & Engineering',
  },
  {
    id: 'user-02',
    name: 'Alex Rivera',
    email: 'alex.rivera@vignan.ac.in',
    role: 'Full Stack Student Developer',
    avatarInitials: 'AR',
    department: 'CSE - 3rd Year',
  },
  {
    id: 'user-03',
    name: 'Priya Sharma',
    email: 'priya.sharma@vignan.ac.in',
    role: 'AI / ML Engineer',
    avatarInitials: 'PS',
    department: 'CSE - AI & ML',
  },
];

export interface WorkspaceProject {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  status: 'Production' | 'Staging' | 'Development' | 'Building';
  statusColor: 'emerald' | 'amber' | 'blue' | 'purple';
  lastUpdated: string;
  deployUrl: string;
  repoUrl: string;
  stars: number;
  commits: number;
  authorId?: string;
  authorName?: string;
  authorRole?: string;
  authorEmail?: string;
  features?: string[];
  summary?: string;
}

export interface DeploymentLog {
  id: string;
  appName: string;
  environment: 'Production' | 'Staging' | 'Development';
  status: 'Live' | 'Building' | 'Active' | 'Failed';
  version: string;
  timestamp: string;
  duration: string;
}

export interface AppTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  techStack: string[];
  previewImg: string;
  stars: number;
}

export const WORKSPACE_PROJECTS: WorkspaceProject[] = [
  {
    id: 'proj-001',
    name: 'AI Interview Platform',
    description: 'Autonomous AI interview simulator with speech recognition, real-time code evaluation, and feedback report generation.',
    techStack: ['React', 'FastAPI', 'Gemini', 'Python', 'PostgreSQL'],
    status: 'Production',
    statusColor: 'emerald',
    lastUpdated: '2 hours ago',
    deployUrl: 'https://ai-interview-hub.vignan.dev',
    repoUrl: 'https://github.com/vignan-cse/ai-interview-platform',
    stars: 128,
    commits: 245,
    authorId: 'user-01',
    authorName: 'Developer',
    authorRole: 'Lead Engineer · CSE',
    authorEmail: 'developer@vignan.ac.in',
    features: [
      'Speech-to-Text realtime voice evaluation',
      'Integrated Code Sandbox with AST analysis',
      'Automated candidate performance scorecards',
      'Proctoring & anti-plagiarism verification'
    ],
    summary: 'Built an interactive candidate interviewing portal leveraging Gemini 1.5 Pro to conduct technical coding rounds and evaluate problem-solving skills.'
  },
  {
    id: 'proj-002',
    name: 'Resume Builder AI',
    description: 'Smart ATS resume score checker and interactive builder powered by LLM suggestions and PDF export capabilities.',
    techStack: ['Next.js', 'Node.js', 'OpenAI', 'Tailwind', 'MongoDB'],
    status: 'Production',
    statusColor: 'emerald',
    lastUpdated: '4 hours ago',
    deployUrl: 'https://resume-ai.vignan.dev',
    repoUrl: 'https://github.com/vignan-cse/resume-builder-ai',
    stars: 94,
    commits: 182,
    authorId: 'user-02',
    authorName: 'Alex Rivera',
    authorRole: 'Full Stack Student Developer',
    authorEmail: 'alex.rivera@vignan.ac.in',
    features: [
      'ATS parser with instant keyword density analysis',
      'Tailored bullet-point generation based on target job description',
      'One-click pixel-perfect PDF document export',
      'Multi-template layout engine'
    ],
    summary: 'Developed an intelligent career management system that parses existing PDFs, calculates ATS compatibility scores, and provides real-time improvements.'
  },
  {
    id: 'proj-003',
    name: 'Developer Coding Platform',
    description: 'Real-time collaborative code editor with instant Docker container execution and automated unit test verification.',
    techStack: ['React', 'Python', 'Docker', 'FastAPI', 'PostgreSQL'],
    status: 'Building',
    statusColor: 'amber',
    lastUpdated: 'Just now',
    deployUrl: 'https://code-platform.vignan.dev',
    repoUrl: 'https://github.com/vignan-cse/dev-coding-platform',
    stars: 156,
    commits: 310,
    authorId: 'user-01',
    authorName: 'Developer',
    authorRole: 'Lead Engineer · CSE',
    authorEmail: 'developer@vignan.ac.in',
    features: [
      'Isolated Docker container execution sandbox',
      'Multi-cursor WebSockets pair programming',
      'Automated Vitest & PyTest test runner',
      'Git integration & commit timeline'
    ],
    summary: 'A cloud-based coding platform allowing students to write, test, and run code in isolated Linux containers directly inside the browser.'
  },
  {
    id: 'proj-004',
    name: 'Student Assessment System',
    description: 'Comprehensive examination engine with automated anti-cheating monitoring, live leaderboard, and performance analytics.',
    techStack: ['Next.js', 'FastAPI', 'MongoDB', 'Node.js', 'Docker'],
    status: 'Production',
    statusColor: 'emerald',
    lastUpdated: '1 day ago',
    deployUrl: 'https://assessment.vignan.dev',
    repoUrl: 'https://github.com/vignan-cse/student-assessment-system',
    stars: 82,
    commits: 140,
    authorId: 'user-03',
    authorName: 'Priya Sharma',
    authorRole: 'AI / ML Engineer',
    authorEmail: 'priya.sharma@vignan.ac.in',
    features: [
      'Real-time webcam head-pose & tab focus monitoring',
      'Automated grading engine for multiple choice and essay questions',
      'Departmental leaderboard and percentile breakdown',
      'Excel & PDF report export for faculty'
    ],
    summary: 'Engineered an online test portal used for departmental coding tests with cheat detection and live score distribution analytics.'
  },
  {
    id: 'proj-005',
    name: 'AI SaaS Dashboard',
    description: 'Modern developer analytics control center featuring usage quotas, billing integration, and webhook management.',
    techStack: ['React', 'Node.js', 'Tailwind', 'PostgreSQL', 'GitHub'],
    status: 'Development',
    statusColor: 'blue',
    lastUpdated: '3 hours ago',
    deployUrl: 'https://saas-dashboard.vignan.dev',
    repoUrl: 'https://github.com/vignan-cse/ai-saas-dashboard',
    stars: 210,
    commits: 412,
    authorId: 'user-02',
    authorName: 'Alex Rivera',
    authorRole: 'Full Stack Student Developer',
    authorEmail: 'alex.rivera@vignan.ac.in',
    features: [
      'API rate limit monitoring & telemetry charts',
      'Stripe subscription tier management',
      'Webhook retry queue and error logging',
      'API key generation and secret hashing'
    ],
    summary: 'Built a full-featured admin portal for monitoring cloud usage metrics, managing billing cycles, and issuing developer API keys.'
  },
  {
    id: 'proj-006',
    name: 'API Gateway & Microservices',
    description: 'High-throughput reverse proxy, rate limiter, and JWT authentication service powering departmental applications.',
    techStack: ['FastAPI', 'Python', 'Docker', 'PostgreSQL', 'Cloud'],
    status: 'Production',
    statusColor: 'emerald',
    lastUpdated: '5 hours ago',
    deployUrl: 'https://api-gateway.vignan.dev',
    repoUrl: 'https://github.com/vignan-cse/api-gateway',
    stars: 175,
    commits: 290,
    authorId: 'user-03',
    authorName: 'Priya Sharma',
    authorRole: 'AI / ML Engineer',
    authorEmail: 'priya.sharma@vignan.ac.in',
    features: [
      'High performance async reverse proxy',
      'JWT token validation and OAuth2 integration',
      'Distributed Redis token bucket rate limiting',
      'Prometheus telemetry exporter'
    ],
    summary: 'Designed a microservices gateway connecting frontend apps to distributed backend services securely.'
  },
];

export const DEPLOYMENT_LOGS: DeploymentLog[] = [
  {
    id: 'dep-101',
    appName: 'AI Interview Platform',
    environment: 'Production',
    status: 'Live',
    version: 'v2.4.0 (commit #8f32a)',
    timestamp: '2 mins ago',
    duration: '38s',
  },
  {
    id: 'dep-102',
    appName: 'Resume Builder AI',
    environment: 'Production',
    status: 'Live',
    version: 'v1.8.2 (commit #4e19b)',
    timestamp: '4 hours ago',
    duration: '45s',
  },
  {
    id: 'dep-103',
    appName: 'Developer Coding Platform',
    environment: 'Staging',
    status: 'Building',
    version: 'v3.1.0-beta (commit #7c04e)',
    timestamp: 'Building now...',
    duration: 'In progress',
  },
  {
    id: 'dep-104',
    appName: 'Student Assessment System',
    environment: 'Production',
    status: 'Live',
    version: 'v2.0.1 (commit #9a11d)',
    timestamp: '1 day ago',
    duration: '52s',
  },
  {
    id: 'dep-105',
    appName: 'AI SaaS Dashboard',
    environment: 'Development',
    status: 'Active',
    version: 'v0.9.4 (commit #3b88f)',
    timestamp: '3 hours ago',
    duration: '29s',
  },
];

export const APP_TEMPLATES: AppTemplate[] = [
  {
    id: 'tpl-001',
    name: 'SaaS Dashboard',
    category: 'Full Stack',
    description: 'Production-ready admin dashboard with authentication, billing analytics, and dark/light modes.',
    techStack: ['Next.js', 'React', 'Tailwind', 'PostgreSQL'],
    previewImg: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop',
    stars: 340,
  },
  {
    id: 'tpl-002',
    name: 'AI Application Starter',
    category: 'Artificial Intelligence',
    description: 'Complete GenAI pipeline template with streaming response UI, RAG vector database, and prompt cache.',
    techStack: ['React', 'FastAPI', 'Python', 'Gemini'],
    previewImg: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop',
    stars: 480,
  },
  {
    id: 'tpl-003',
    name: 'E-commerce & Payments Hub',
    category: 'Web App',
    description: 'Modern storefront with Stripe payment webhooks, order management, and inventory backend.',
    techStack: ['Next.js', 'Node.js', 'MongoDB', 'Tailwind'],
    previewImg: 'https://images.unsplash.com/photo-1556742049-0a67daf4005a?w=800&auto=format&fit=crop',
    stars: 290,
  },
  {
    id: 'tpl-004',
    name: 'Developer Portfolio',
    category: 'Frontend',
    description: 'Sleek personal portfolio with project showcases, blog markdown support, and interactive resume.',
    techStack: ['React', 'Tailwind', 'Next.js'],
    previewImg: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop',
    stars: 520,
  },
  {
    id: 'tpl-005',
    name: 'Admin Control Center',
    category: 'Enterprise',
    description: 'Role-based access control management dashboard with CSV export, audit logs, and analytics.',
    techStack: ['React', 'PostgreSQL', 'Node.js'],
    previewImg: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop',
    stars: 310,
  },
  {
    id: 'tpl-006',
    name: 'API Platform Gateway',
    category: 'Backend',
    description: 'REST & GraphQL microservice starter kit with Swagger docs, rate limiting, and Redis cache.',
    techStack: ['FastAPI', 'Python', 'Docker', 'PostgreSQL'],
    previewImg: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop',
    stars: 275,
  },
  {
    id: 'tpl-007',
    name: 'AI Interview Platform Template',
    category: 'Artificial Intelligence',
    description: 'Full stack AI interviewing template with audio recorder, code editor, and scoring algorithms.',
    techStack: ['React', 'FastAPI', 'Gemini', 'Python'],
    previewImg: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop',
    stars: 610,
  },
  {
    id: 'tpl-008',
    name: 'Resume Builder AI Suite',
    category: 'Full Stack',
    description: 'Automated resume parser, keyword optimization engine, and export template generator.',
    techStack: ['Next.js', 'Node.js', 'OpenAI', 'MongoDB'],
    previewImg: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop',
    stars: 430,
  },
];

export const RECENT_ACTIVITIES = [
  {
    id: 'act-1',
    title: 'Application deployed successfully',
    detail: 'AI Interview Platform (v2.4.0) deployed to production',
    time: '2 mins ago',
    type: 'deploy',
  },
  {
    id: 'act-2',
    title: 'API endpoint created',
    detail: 'POST /api/v2/analyze-resume configured & verified',
    time: '18 mins ago',
    type: 'api',
  },
  {
    id: 'act-3',
    title: 'New project created',
    detail: 'Resume Builder AI 2.0 instantiated from template',
    time: '45 mins ago',
    type: 'project',
  },
  {
    id: 'act-4',
    title: 'Database connected',
    detail: 'PostgreSQL cluster db-main-prod health status OK',
    time: '1 hour ago',
    type: 'db',
  },
  {
    id: 'act-5',
    title: 'Build completed',
    detail: 'Build #482 finished in 38s with zero errors',
    time: '2 hours ago',
    type: 'build',
  },
  {
    id: 'act-6',
    title: 'Environment variables updated',
    detail: 'Updated OPENAI_API_KEY for Staging environment',
    time: '3 hours ago',
    type: 'env',
  },
];

export const TECH_STACK_ITEMS = [
  { name: 'React', category: 'Frontend', badge: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  { name: 'Next.js', category: 'Framework', badge: 'bg-stone-100 text-stone-800 border-stone-200' },
  { name: 'FastAPI', category: 'Backend', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { name: 'Node.js', category: 'Runtime', badge: 'bg-green-50 text-green-700 border-green-200' },
  { name: 'Python', category: 'Language', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  { name: 'Java', category: 'Language', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  { name: 'C++', category: 'Language', badge: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { name: 'PostgreSQL', category: 'Database', badge: 'bg-sky-50 text-sky-700 border-sky-200' },
  { name: 'MongoDB', category: 'Database', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { name: 'Docker', category: 'DevOps', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  { name: 'GitHub', category: 'Version Control', badge: 'bg-slate-100 text-slate-800 border-slate-200' },
  { name: 'Cloud', category: 'Infrastructure', badge: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
];

export const INITIAL_CODE_FILES = [
  {
    path: 'src/main.py',
    name: 'main.py',
    language: 'python',
    code: `from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import time

app = FastAPI(title="Application Development Hub API", version="2.4.0")

class DeployRequest(BaseModel):
    app_id: str
    environment: str = "production"

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "AppDevHub Core OS",
        "timestamp": time.time()
    }

@app.post("/api/v1/deploy")
async def trigger_deploy(payload: DeployRequest):
    return {
        "status": "queued",
        "app_id": payload.app_id,
        "environment": payload.environment,
        "build_id": "bld-98241"
    }`,
  },
  {
    path: 'src/App.tsx',
    name: 'App.tsx',
    language: 'typescript',
    code: `import React, { useState } from 'react';

export default function AppDevDashboard() {
  const [activeTab, setActiveTab] = useState('projects');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <h1 className="text-lg font-extrabold text-slate-900">Application Development Hub</h1>
      </header>
      <main className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <p className="text-sm text-slate-600">Unified Developer Workspace Platform</p>
        </div>
      </main>
    </div>
  );
}`,
  },
  {
    path: 'package.json',
    name: 'package.json',
    language: 'json',
    code: `{
  "name": "appdevhub-core",
  "version": "2.4.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 4028",
    "build": "next build",
    "test": "vitest run"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "lucide-react": "^0.474.0"
  }
}`,
  },
];
