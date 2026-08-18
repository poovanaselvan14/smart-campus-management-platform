import React, { useEffect, useState } from 'react';
import { FileText, Plus, CheckCircle2, Clock, Upload, ExternalLink, Award, AlertCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { api } from '../api/client';
import { Assignment } from '../types';
import { useAuth } from '../context/AuthContext';

export const AssignmentsPage: React.FC = () => {
  const { user } = useAuth();
  const isFacultyOrAdmin = ['FACULTY', 'ADMIN'].includes(user?.role || '');

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted'>('all');

  // Student Submission Modal State
  const [submitModalAssignment, setSubmitModalAssignment] = useState<Assignment | null>(null);
  const [githubUrl, setGithubUrl] = useState('');
  const [solutionUrl, setSolutionUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Faculty Create Assignment Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newMaxMarks, setNewMaxMarks] = useState('100');
  const [newDeadline, setNewDeadline] = useState('');

  // Faculty Review Submissions Modal State
  const [reviewAssignmentId, setReviewAssignmentId] = useState<string | null>(null);
  const [submissionsList, setSubmissionsList] = useState<any[]>([]);
  const [gradingMarks, setGradingMarks] = useState<Record<string, string>>({});
  const [gradingFeedback, setGradingFeedback] = useState<Record<string, string>>({});

  const fetchAssignments = async () => {
    try {
      const res = await api.get('/assignments');
      setAssignments(res.data.data || []);
    } catch (err) {
      console.error('Failed fetching assignments', err);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitModalAssignment) return;
    setIsSubmitting(true);
    try {
      const res = await api.post(`/assignments/${submitModalAssignment.id}/submit`, {
        githubUrl,
        solutionUrl,
      });
      alert(res.data.message || 'Assignment submitted successfully to PostgreSQL DB!');
      setSubmitModalAssignment(null);
      setGithubUrl('');
      setSolutionUrl('');
      fetchAssignments();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed submitting assignment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/assignments', {
        title: newTitle,
        description: newDesc,
        maxMarks: Number(newMaxMarks),
        deadline: newDeadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });
      alert('New assignment published to PostgreSQL database!');
      setIsCreateModalOpen(false);
      setNewTitle('');
      setNewDesc('');
      fetchAssignments();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed creating assignment.');
    }
  };

  const openReviewModal = async (assignmentId: string) => {
    setReviewAssignmentId(assignmentId);
    try {
      const res = await api.get(`/assignments/${assignmentId}/submissions`);
      setSubmissionsList(res.data.data || []);
    } catch (err) {
      console.error('Failed loading submissions', err);
    }
  };

  const handleGradeSubmission = async (submissionId: string) => {
    const marks = gradingMarks[submissionId];
    const feedback = gradingFeedback[submissionId];
    if (!marks) return alert('Please enter numeric marks before submitting grade.');

    try {
      await api.patch(`/assignments/submissions/${submissionId}/grade`, {
        marks: Number(marks),
        feedback,
      });
      alert('Grade saved to PostgreSQL DB and notification sent to student!');
      if (reviewAssignmentId) openReviewModal(reviewAssignmentId);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed grading submission.');
    }
  };

  const filtered = assignments.filter((a) => {
    const isSub = a.submissions && a.submissions.length > 0;
    if (filter === 'pending') return !isSub;
    if (filter === 'submitted') return isSub;
    return true;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-500" /> Assignment & Task Management Board
          </h1>
          <p className="text-xs text-gray-500 dark:text-nex-muted mt-1">
            {isFacultyOrAdmin ? 'Publish coursework, review student submissions & grade' : 'View deadlines, submit GitHub links or PDF solution files'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isFacultyOrAdmin && (
            <div className="flex gap-1 p-1 bg-gray-100 dark:bg-nex-elevated rounded-xl text-xs">
              {(['all', 'pending', 'submitted'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`px-3 py-1 rounded-lg capitalize font-bold transition-all ${
                    filter === t ? 'bg-white dark:bg-nex-surface text-brand-500 shadow-subtle' : 'text-gray-400'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}

          {isFacultyOrAdmin && (
            <Button onClick={() => setIsCreateModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
              Publish Assignment
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((assignment) => {
          const userSub = assignment.submissions && assignment.submissions.length > 0 ? assignment.submissions[0] : null;
          const isSubmitted = !!userSub;

          return (
            <Card key={assignment.id} className="space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="brand">{assignment.course?.code || 'CS101'}</Badge>
                  <span className="text-[11px] text-gray-400 font-mono">Max Marks: {assignment.maxMarks}</span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">{assignment.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-nex-muted mt-1 leading-relaxed line-clamp-3">
                    {assignment.description}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-400 pt-2 border-t border-gray-100 dark:border-nex-border">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-500" /> Due: {new Date(assignment.deadline).toLocaleDateString()}
                  </span>
                  {isFacultyOrAdmin && (
                    <span className="font-bold text-brand-500">
                      {(assignment as any)._count?.submissions || 0} Submissions
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-2">
                {isFacultyOrAdmin ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => openReviewModal(assignment.id)}
                  >
                    Review & Grade Submissions
                  </Button>
                ) : isSubmitted ? (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold text-emerald-500">
                      <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Submitted</span>
                      <span>{userSub.status}</span>
                    </div>
                    {userSub.marks !== null && (
                      <p className="text-xs font-bold text-gray-900 dark:text-white">
                        Score: {userSub.marks} / {assignment.maxMarks}
                      </p>
                    )}
                  </div>
                ) : (
                  <Button
                    size="sm"
                    className="w-full"
                    icon={<Upload className="w-3.5 h-3.5" />}
                    onClick={() => setSubmitModalAssignment(assignment)}
                  >
                    Submit Assignment Solution
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Student Submission Modal */}
      <Modal isOpen={!!submitModalAssignment} onClose={() => setSubmitModalAssignment(null)} title="Submit Assignment Solution">
        {submitModalAssignment && (
          <form onSubmit={handleStudentSubmit} className="space-y-4">
            <div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">{submitModalAssignment.title}</h4>
              <p className="text-xs text-gray-400">Due Date: {new Date(submitModalAssignment.deadline).toLocaleString()}</p>
            </div>

            <Input
              label="GitHub Repository URL"
              placeholder="https://github.com/username/repo-name"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
            />

            <Input
              label="Solution File PDF / ZIP URL"
              placeholder="https://example.com/my_solution.pdf"
              value={solutionUrl}
              onChange={(e) => setSolutionUrl(e.target.value)}
            />

            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setSubmitModalAssignment(null)}>Cancel</Button>
              <Button type="submit" isLoading={isSubmitting}>Submit Solution</Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Faculty Create Assignment Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Publish New Assignment">
        <form onSubmit={handleCreateAssignment} className="space-y-4">
          <Input label="Assignment Title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required />
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Description & Instructions</label>
            <textarea
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              rows={3}
              required
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-nex-elevated border border-gray-200 dark:border-nex-border text-gray-900 dark:text-white outline-none focus:border-brand-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Maximum Marks" type="number" value={newMaxMarks} onChange={(e) => setNewMaxMarks(e.target.value)} required />
            <Input label="Submission Deadline" type="datetime-local" value={newDeadline} onChange={(e) => setNewDeadline(e.target.value)} required />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button type="submit">Publish to Course</Button>
          </div>
        </form>
      </Modal>

      {/* Faculty Review Submissions Modal */}
      <Modal isOpen={!!reviewAssignmentId} onClose={() => setReviewAssignmentId(null)} title="Student Submissions & Grading Stack">
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {submissionsList.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-6">No student submissions submitted yet.</p>
          ) : (
            submissionsList.map((sub) => (
              <div key={sub.id} className="p-4 bg-gray-50 dark:bg-nex-elevated border border-gray-200 dark:border-nex-border rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">{sub.student?.name}</h4>
                    <span className="text-[10px] text-gray-400 font-mono">{sub.student?.email}</span>
                  </div>
                  <Badge variant={sub.isLate ? 'danger' : 'success'}>
                    {sub.isLate ? 'Late Submission' : 'On Time'}
                  </Badge>
                </div>

                <div className="flex gap-2 text-xs">
                  {sub.githubUrl && (
                    <a href={sub.githubUrl} target="_blank" rel="noreferrer" className="text-brand-500 font-bold hover:underline flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" /> GitHub Repo
                    </a>
                  )}
                  {sub.solutionUrl && (
                    <a href={sub.solutionUrl} target="_blank" rel="noreferrer" className="text-indigo-400 font-bold hover:underline flex items-center gap-1">
                      <FileText className="w-3 h-3" /> Solution File
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200 dark:border-nex-border">
                  <Input
                    placeholder="Marks (e.g. 95)"
                    defaultValue={sub.marks !== null ? String(sub.marks) : ''}
                    onChange={(e) => setGradingMarks({ ...gradingMarks, [sub.id]: e.target.value })}
                  />
                  <Input
                    placeholder="Feedback comments..."
                    defaultValue={sub.feedback || ''}
                    onChange={(e) => setGradingFeedback({ ...gradingFeedback, [sub.id]: e.target.value })}
                  />
                </div>

                <Button size="sm" onClick={() => handleGradeSubmission(sub.id)}>
                  Save Grade & Notify Student
                </Button>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
};
