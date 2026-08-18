import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CalendarCheck,
  Calendar,
  FileText,
  Briefcase,
  Bot,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  UserCheck,
  Layers,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState<'student' | 'faculty' | 'coordinator' | 'admin'>('student');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const quickDemoLogin = async (email: string) => {
    try {
      await login(email, 'Password123!');
      navigate('/dashboard');
    } catch (e: any) {
      const status = e.response?.status;
      const msg = e.response?.data?.message || e.message || 'Login failed';
      alert(status ? `Authentication Error (${status}): ${msg}` : `Connection Error: ${msg}`);
    }
  };

  const faqs = [
    {
      q: 'How does NEXCAMPUS centralize university operations?',
      a: 'NEXCAMPUS replaces fragmented notice boards, spreadsheets, and messaging groups by unifying student attendance tracking, homework assignment grading, QR event passes, placement drives, campus clubs, and administrative audit trails into one single SaaS web platform.',
    },
    {
      q: 'Is Role-Based Access Control (RBAC) enforced on the server?',
      a: 'Yes! Authorization is strictly validated on the Express REST backend using JWT middleware and database permission checks. A Student attempting an Admin or Faculty endpoint receives an HTTP 403 Forbidden error.',
    },
    {
      q: 'How does the Smart Attendance Goal Calculator work?',
      a: 'For students with attendance below threshold, NEXCAMPUS automatically computes the exact number of consecutive upcoming classes they must attend to achieve their target percentage (e.g. 80%).',
    },
    {
      q: 'How does the AI Campus Assistant function?',
      a: 'The AI Assistant parses natural language queries (e.g. "When is my assignment due?", "What is my attendance?") and securely queries authorized database records based on the logged-in user\'s role.',
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-16 lg:pt-24 overflow-hidden text-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 dark:bg-brand-500/20 border border-brand-500/30 text-brand-700 dark:text-brand-300 font-extrabold text-xs">
            <Layers className="w-4 h-4 text-brand-500" />
            <span>NEXCAMPUS v2.0 Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            The operating system for{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 dark:from-brand-400 dark:via-indigo-400 dark:to-purple-400">
              your campus.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            Eliminate disconnected portals, spreadsheets, and messaging groups. Centralize student attendance, assignment grading, event QR passes, placement drives, and admin analytics in one sleek interface.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link to="/register">
              <Button size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                Get Started
              </Button>
            </Link>
            <a href="#quick-demo">
              <Button size="lg" variant="secondary">
                Demo Access
              </Button>
            </a>
          </div>

          {/* 1-Click Hackathon Persona Login */}
          <div id="quick-demo" className="mt-16 max-w-3xl mx-auto p-6 bg-slate-900 text-white border border-slate-800 rounded-3xl text-left space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-400" /> 1-Click Persona Authentication:
              </h3>
              <span className="text-xs text-slate-400 font-mono">Pre-seeded Database Accounts</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => quickDemoLogin('student@demo.com')}
                className="p-3.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-brand-500 rounded-2xl text-left transition-all group"
              >
                <div className="flex items-center gap-2 text-xs font-extrabold text-white">
                  <GraduationCap className="w-4 h-4 text-brand-400" /> Student
                </div>
                <div className="text-xs text-slate-400 mt-1 truncate font-mono">student@demo.com</div>
              </button>
              <button
                onClick={() => quickDemoLogin('faculty@demo.com')}
                className="p-3.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500 rounded-2xl text-left transition-all group"
              >
                <div className="flex items-center gap-2 text-xs font-extrabold text-white">
                  <UserCheck className="w-4 h-4 text-amber-400" /> Faculty
                </div>
                <div className="text-xs text-slate-400 mt-1 truncate font-mono">faculty@demo.com</div>
              </button>
              <button
                onClick={() => quickDemoLogin('coordinator@demo.com')}
                className="p-3.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-purple-500 rounded-2xl text-left transition-all group"
              >
                <div className="flex items-center gap-2 text-xs font-extrabold text-white">
                  <Calendar className="w-4 h-4 text-purple-400" /> Coordinator
                </div>
                <div className="text-xs text-slate-400 mt-1 truncate font-mono">coordinator@demo.com</div>
              </button>
              <button
                onClick={() => quickDemoLogin('admin@demo.com')}
                className="p-3.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-rose-500 rounded-2xl text-left transition-all group"
              >
                <div className="flex items-center gap-2 text-xs font-extrabold text-white">
                  <ShieldCheck className="w-4 h-4 text-rose-400" /> Admin
                </div>
                <div className="text-xs text-slate-400 mt-1 truncate font-mono">admin@demo.com</div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <Badge variant="brand">Unified Architecture</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Institutional Management Suite
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            Engineered for high informational clarity, fast interaction speeds, and server-enforced security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="space-y-3">
            <div className="w-10 h-10 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center font-bold">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Smart Attendance Engine</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Faculty session launcher with student percentage breakdowns and automated attendance threshold advice ("Attend next 2 classes to reach 80%").
            </p>
          </Card>

          <Card className="space-y-3">
            <div className="w-10 h-10 bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Assignment Management</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Submission board for PDF, ZIP, and GitHub repo links. Automatic late-submission flag detection and faculty grading stack.
            </p>
          </Card>

          <Card className="space-y-3">
            <div className="w-10 h-10 bg-purple-500/15 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Event Pass System</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Event catalog with seat progress indicators (`184 / 300 registered`), unique QR entry passes, and ticket scanner validation.
            </p>
          </Card>

          <Card className="space-y-3">
            <div className="w-10 h-10 bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center font-bold">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Placement Drive Portal</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Job placement listings with auto-enforced GPA eligibility checks, resume upload, and real-time application status tracking.
            </p>
          </Card>

          <Card className="space-y-3">
            <div className="w-10 h-10 bg-sky-500/15 text-sky-600 dark:text-sky-400 rounded-xl flex items-center justify-center font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">AI Campus Assistant</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Natural language assistant parsing query prompts ("When is my assignment due?", "What is my attendance?") safely guarded by RBAC.
            </p>
          </Card>

          <Card className="space-y-3">
            <div className="w-10 h-10 bg-rose-500/15 text-rose-600 dark:text-rose-400 rounded-xl flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Audit Trail & Security</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Strict 4-level server-side permission checks with real-time audit logging for sensitive user management and administrative actions.
            </p>
          </Card>
        </div>
      </section>

      {/* Role Benefits Interactive Switcher */}
      <section id="roles" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-nex-surface border border-slate-200 dark:border-nex-border rounded-3xl p-8 lg:p-12 shadow-subtle">
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
            <Badge variant="brand">RBAC Permission Matrix</Badge>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Tailored for every campus persona
            </h2>
          </div>

          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            {(['student', 'faculty', 'coordinator', 'admin'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setActiveRole(r)}
                className={`px-4 py-2 rounded-xl font-extrabold text-xs capitalize transition-all ${
                  activeRole === r
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-nex-elevated text-slate-700 dark:text-slate-300 hover:text-brand-500'
                }`}
              >
                {r} View
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              {activeRole === 'student' && (
                <>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-brand-500" /> Student Operations
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Stay on top of academics, deadlines, and career opportunities with zero friction.</p>
                  <ul className="space-y-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
                    <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> View subject-wise attendance & target goal advice</li>
                    <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Submit assignments & GitHub repo links</li>
                    <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Download unique QR event pass tickets</li>
                    <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Auto-check GPA eligibility for placement drives</li>
                  </ul>
                </>
              )}
              {activeRole === 'faculty' && (
                <>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-amber-500" /> Faculty Management Portal
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Effortlessly manage course sessions, grading workflows, and student progress.</p>
                  <ul className="space-y-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
                    <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Create attendance sessions & quick-mark student roster</li>
                    <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Publish assignments with deadlines & max marks</li>
                    <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Grade submissions with feedback stack</li>
                    <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Identify low-attendance students automatically</li>
                  </ul>
                </>
              )}
              {activeRole === 'coordinator' && (
                <>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-500" /> Event & Club Coordinator
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Orchestrate university events, campus club activities, and announcements.</p>
                  <ul className="space-y-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
                    <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Publish campus events & manage seat capacities</li>
                    <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Scan and validate student QR pass codes</li>
                    <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Manage campus clubs & activity feeds</li>
                    <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Broadcast announcements to targeted audiences</li>
                  </ul>
                </>
              )}
              {activeRole === 'admin' && (
                <>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-rose-500" /> Enterprise Administration
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Full platform governance, user management, and institution analytics.</p>
                  <ul className="space-y-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
                    <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Manage users, assign roles, and set departments</li>
                    <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Real-time database analytics & performance charts</li>
                    <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Inspect detailed activity audit logs</li>
                    <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Configure system policies & academic catalogs</li>
                  </ul>
                </>
              )}
            </div>

            <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl font-mono text-xs text-slate-200 shadow-2xl">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-800">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs text-slate-400 ml-2">rbac-policy.json</span>
              </div>
              <pre className="text-xs text-emerald-400 overflow-x-auto">
{`{
  "role": "${activeRole.toUpperCase()}",
  "permissions": [
    "GET /api/attendance/my",
    "POST /api/assignments/submit",
    "POST /api/events/register"
  ],
  "enforcement": "SERVER_SIDE_JWT_MIDDLEWARE"
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <Badge variant="neutral">FAQ</Badge>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white dark:bg-nex-surface border border-slate-200 dark:border-nex-border rounded-2xl overflow-hidden shadow-subtle"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-5 text-left font-bold text-xs text-slate-900 dark:text-white flex items-center justify-between"
              >
                <span>{faq.q}</span>
                {openFaq === i ? <ChevronUp className="w-4 h-4 text-brand-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
              </button>
              {openFaq === i && (
                <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed border-t border-slate-100 dark:border-nex-border pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-600 rounded-3xl p-10 lg:p-14 text-center text-white shadow-glow">
          <h2 className="text-3xl font-extrabold tracking-tight">Experience NEXCAMPUS SaaS today.</h2>
          <p className="mt-3 text-xs sm:text-sm text-brand-100 max-w-xl mx-auto font-medium">
            Test the operating system for your campus with pre-seeded demo accounts and server-enforced RBAC.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/register">
              <button className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs sm:text-sm rounded-xl shadow-lg border border-white transition-all flex items-center gap-2">
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 text-slate-900" />
              </button>
            </Link>
            <a href="#quick-demo">
              <button className="px-6 py-3 bg-brand-800 hover:bg-brand-900 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg border border-brand-500 transition-all flex items-center gap-2">
                <span>Demo Access</span>
              </button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
