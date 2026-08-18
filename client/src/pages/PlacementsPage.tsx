import React, { useEffect, useState } from 'react';
import { Briefcase, MapPin, DollarSign, Award, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { api } from '../api/client';
import { Placement } from '../types';
import { useAuth } from '../context/AuthContext';

export const PlacementsPage: React.FC = () => {
  const { user } = useAuth();
  const isCoordinatorOrAdmin = ['COORDINATOR', 'ADMIN'].includes(user?.role || '');

  const [placements, setPlacements] = useState<Placement[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form State
  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  const [ctc, setCtc] = useState('');
  const [location, setLocation] = useState('');
  const [eligibilityGpa, setEligibilityGpa] = useState('3.5');
  const [skills, setSkills] = useState('');
  const [description, setDescription] = useState('');

  const fetchPlacements = async () => {
    try {
      const res = await api.get('/placements');
      setPlacements(res.data.data || []);
    } catch (err) {
      console.error('Failed fetching placements', err);
    }
  };

  useEffect(() => {
    fetchPlacements();
  }, []);

  const handleApply = async (placementId: string) => {
    try {
      const res = await api.post(`/placements/${placementId}/apply`, {
        resumeUrl: user?.profile?.resumeUrl || 'https://example.com/resume.pdf',
      });
      alert(res.data.message || 'Application submitted successfully to PostgreSQL DB!');
      fetchPlacements();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Eligibility Check Failed: Student GPA is below threshold.');
    }
  };

  const handleCreatePlacement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/placements', {
        company,
        title,
        ctc,
        location,
        eligibilityGpa: Number(eligibilityGpa),
        skills,
        description,
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      });
      alert('Placement drive published!');
      setIsCreateOpen(false);
      fetchPlacements();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed publishing placement.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-amber-500" /> Career & Placement Portal
          </h1>
          <p className="text-xs text-gray-500 dark:text-nex-muted mt-1">
            Browse corporate recruitment drives, verify GPA eligibility, and apply with active resume.
          </p>
        </div>

        {isCoordinatorOrAdmin && (
          <Button icon={<Plus className="w-4 h-4" />} onClick={() => setIsCreateOpen(true)}>
            Post Recruitment Drive
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {placements.map((p) => {
          const hasApplied = (p as any).hasApplied;
          const status = (p as any).applicationStatus;
          const isEligible = (p as any).isEligible !== false;
          const studentGpa = (p as any).studentGpa;

          return (
            <Card key={p.id} className="space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{p.company}</span>
                  <Badge variant={isEligible ? 'success' : 'danger'}>
                    GPA ≥ {p.eligibilityGpa} Required
                  </Badge>
                </div>

                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">{p.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-nex-muted mt-1 line-clamp-3 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 pt-2 border-t border-gray-100 dark:border-nex-border font-medium">
                  <span className="flex items-center gap-1 font-bold text-emerald-500">
                    <DollarSign className="w-3.5 h-3.5" /> {p.ctc}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" /> {p.location}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                {hasApplied ? (
                  <div className="p-3 bg-brand-500/10 border border-brand-500/20 rounded-xl flex items-center justify-between text-xs font-bold text-brand-500">
                    <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Applied</span>
                    <Badge variant="brand">{status}</Badge>
                  </div>
                ) : !isEligible ? (
                  <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-xs text-rose-500 font-bold">
                    <AlertCircle className="w-4 h-4 shrink-0" /> Ineligible (Your GPA: {studentGpa} vs Req: {p.eligibilityGpa})
                  </div>
                ) : (
                  <Button size="sm" className="w-full" onClick={() => handleApply(p.id)}>
                    Apply for Opportunity
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Create Placement Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Post Corporate Recruitment Drive">
        <form onSubmit={handleCreatePlacement} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Company Name" value={company} onChange={(e) => setCompany(e.target.value)} required />
            <Input label="Job Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="CTC / Package" value={ctc} onChange={(e) => setCtc(e.target.value)} placeholder="$120,000 / yr" required />
            <Input label="Min GPA Requirement" type="number" step="0.1" value={eligibilityGpa} onChange={(e) => setEligibilityGpa(e.target.value)} required />
          </div>
          <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
          <Input label="Required Skills" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="TypeScript, Node.js, SQL" required />
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Role Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-nex-elevated border border-gray-200 dark:border-nex-border text-gray-900 dark:text-white outline-none focus:border-brand-500"
            />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button type="submit">Publish Placement</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
