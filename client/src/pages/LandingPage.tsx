import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  ShieldCheck,
  CalendarCheck,
  Calendar,
  FileText,
  Briefcase,
  Users,
  Bot,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
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
    } catch (e) {
      alert('Login failed. Ensure backend server is running on port 5000.');
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <Badge variant="brand" className="px-3 py-1 text-xs">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-brand-500" /> NEXCAMPUS v2.0 Released
          </Badge>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.1]">
            The operating system for{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-500 via-indigo-400 to-purple-400">
              your campus.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-600 dark:text-nex-muted max-w-2xl mx-auto font-normal leading-relaxed">
            Eliminate disconnected portals, spreadsheets, and messaging groups. Centralize student attendance, assignment grading, event QR passes, placement drives, and admin analytics in one sleek interface.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link to="/register">
              <Button size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                Get Started
              </Button>
            </Link>
            <a href="#quick-demo">
              <Button size="lg" variant="outline">
                Instant Demo Access
              </Button>
            </a>
          </div>

          {/* Quick 1-Click Persona Login */}
          <div id="quick-demo" className="mt-16 max-w-3xl mx-auto p-6 bg-white dark:bg-nex-surface border border-gray-200 dark:border-nex-border rounded-2xl text-left space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-nex-muted flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-500" /> 1-Click Hackathon Persona Login:
              </h3>
              <span className="text-[10px] text-gray-400 font-mono">Pre-seeded DB Accounts</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => quickDemoLogin('student@demo.com')}
                className="p-3 bg-gray-50 dark:bg-nex-elevated hover:border-brand-500 border border-gray-200 dark:border-nex-border rounded-xl text-left transition-all group"
              >
                <div className="text-xs font-bold text-gray-900 dark:text-white">Student 🎓</div>
                <div className="text-[10px] text-gray-400 mt-0.5 truncate">student@demo.com</div>
              </button>
              <button
                onClick={() => quickDemoLogin('faculty@demo.com')}
                className="p-3 bg-gray-50 dark:bg-nex-elevated hover:border-amber-500 border border-gray-200 dark:border-nex-border rounded-xl text-left transition-all group"
              >
                <div className="text-xs font-bold text-gray-900 dark:text-white">Faculty 👨‍🏫</div>
                <div className="text-[10px] text-gray-400 mt-0.5 truncate">faculty@demo.com</div>
              </button>
              <button
                onClick={() => quickDemoLogin('coordinator@demo.com')}
                className="p-3 bg-gray-50 dark:bg-nex-elevated hover:border-purple-500 border border-gray-200 dark:border-nex-border rounded-xl text-left transition-all group"
              >
                <div className="text-xs font-bold text-gray-900 dark:text-white">Coordinator 🎪</div>
                <div className="text-[10px] text-gray-400 mt-0.5 truncate">coordinator@demo.com</div>
              </button>
              <button
                onClick={() => quickDemoLogin('admin@demo.com')}
                className="p-3 bg-gray-50 dark:bg-nex-elevated hover:border-rose-500 border border-gray-200 dark:border-nex-border rounded-xl text-left transition-all group"
              >
                <div className="text-xs font-bold text-gray-900 dark:text-white">Admin 🛡️</div>
                <div className="text-[10px] text-gray-400 mt-0.5 truncate">admin@demo.com</div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <Badge variant="brand">Unified Modules</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            Everything your institution needs
          </h2>
          <p className="text-xs text-gray-500 dark:text-nex-muted">
            Engineered for high informational clarity, fast interaction speeds, and server-enforced security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="space-y-3">
            <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center font-bold">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Smart Attendance & Target Advice</h3>
            <p className="text-xs text-gray-500 dark:text-nex-muted leading-relaxed">
              Faculty session launcher with student percentage breakdowns and automated attendance threshold advice ("Attend next 2 classes to reach 80%").
            </p>
          </Card>

          <Card className="space-y-3">
            <div className="w-10 h-10 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Task-Management Assignments</h3>
            <p className="text-xs text-gray-500 dark:text-nex-muted leading-relaxed">
              Submission board for PDF, ZIP, and GitHub repo links. Automatic late-submission flag detection and faculty grading stack.
            </p>
          </Card>

          <Card className="space-y-3">
            <div className="w-10 h-10 bg-purple-500/10 text-purple-500 rounded-xl flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Event Passes & Seat Limits</h3>
            <p className="text-xs text-gray-500 dark:text-nex-muted leading-relaxed">
              Event catalog with seat progress indicators (`184 / 300 registered`), unique QR entry passes, and ticket scanner validation.
            </p>
          </Card>

          <Card className="space-y-3">
            <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center font-bold">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Placement Drive Portal</h3>
            <p className="text-xs text-gray-500 dark:text-nex-muted leading-relaxed">
              Job placement listings with auto-enforced GPA eligibility checks, resume upload, and real-time application status tracking.
            </p>
          </Card>

          <Card className="space-y-3">
            <div className="w-10 h-10 bg-sky-500/10 text-sky-500 rounded-xl flex items-center justify-center font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">AI Campus Assistant</h3>
            <p className="text-xs text-gray-500 dark:text-nex-muted leading-relaxed">
              Natural language assistant parsing query prompts ("When is my assignment due?", "What is my attendance?") safely guarded by RBAC.
            </p>
          </Card>

          <Card className="space-y-3">
            <div className="w-10 h-10 bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Audit Trail & RBAC</h3>
            <p className="text-xs text-gray-500 dark:text-nex-muted leading-relaxed">
              Strict 4-level server-side permission checks with real-time audit logging for sensitive user management and administrative actions.
            </p>
          </Card>
        </div>
      </section>

      {/* Role Benefits Interactive Switcher */}
      <section id="roles" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-nex-surface border border-gray-200 dark:border-nex-border rounded-3xl p-8 lg:p-12">
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
            <Badge variant="brand">Targeted Role Benefits</Badge>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              Tailored for every campus persona
            </h2>
          </div>

          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            {(['student', 'faculty', 'coordinator', 'admin'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setActiveRole(r)}
                className={`px-4 py-2 rounded-xl font-bold text-xs capitalize transition-all ${
                  activeRole === r
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-nex-elevated text-gray-600 dark:text-gray-400 hover:text-white'
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
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">For Students 🎓</h3>
                  <p className="text-xs text-gray-500 dark:text-nex-muted">Stay on top of academics, deadlines, and career opportunities with zero friction.</p>
                  <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> View subject-wise attendance & target goal advice</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Submit assignments & GitHub repo links</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Download unique QR event pass tickets</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Auto-check GPA eligibility for placement drives</li>
                  </ul>
                </>
              )}
              {activeRole === 'faculty' && (
                <>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">For Faculty 👨‍🏫</h3>
                  <p className="text-xs text-gray-500 dark:text-nex-muted">Effortlessly manage course sessions, grading workflows, and student progress.</p>
                  <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Create attendance sessions & quick-mark student roster</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Publish assignments with deadlines & max marks</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Grade submissions with feedback stack</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Identify low-attendance students automatically</li>
                  </ul>
                </>
              )}
              {activeRole === 'coordinator' && (
                <>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">For Coordinators 🎪</h3>
                  <p className="text-xs text-gray-500 dark:text-nex-muted">Orchestrate university events, campus club activities, and announcements.</p>
                  <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Publish campus events & manage seat capacities</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Scan and validate student QR pass codes</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Manage campus clubs & activity feeds</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Broadcast announcements to targeted audiences</li>
                  </ul>
                </>
              )}
              {activeRole === 'admin' && (
                <>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">For Administrators 🛡️</h3>
                  <p className="text-xs text-gray-500 dark:text-nex-muted">Full platform governance, user management, and institution analytics.</p>
                  <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Manage users, assign roles, and set departments</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Real-time database analytics & performance charts</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Inspect detailed activity audit logs</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Configure system policies & academic catalogs</li>
                  </ul>
                </>
              )}
            </div>

            <div className="p-5 bg-[#0B0D10] border border-[#252B33] rounded-2xl font-mono text-xs text-gray-300 shadow-2xl">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#252B33]">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] text-gray-500 ml-2">rbac-matrix.json</span>
              </div>
              <pre className="text-[11px] text-emerald-400 overflow-x-auto">
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
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white dark:bg-nex-surface border border-gray-200 dark:border-nex-border rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-4 text-left font-bold text-xs text-gray-900 dark:text-white flex items-center justify-between"
              >
                <span>{faq.q}</span>
                {openFaq === i ? <ChevronUp className="w-4 h-4 text-brand-500" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 text-xs text-gray-500 dark:text-nex-muted leading-relaxed border-t border-gray-100 dark:border-nex-border pt-3">
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
          <p className="mt-2 text-xs sm:text-sm text-brand-100 max-w-xl mx-auto">
            Test the operating system for your campus with pre-seeded demo accounts and server-enforced RBAC.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/register">
              <Button size="lg" className="bg-white text-brand-700 hover:bg-gray-100 border-none">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
