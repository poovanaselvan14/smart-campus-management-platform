import React, { useState, useEffect } from 'react';
import { Search, Loader2, FileText, Calendar, Briefcase, Bell, User as UserIcon, X } from 'lucide-react';
import { api } from '../api/client';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  type: string;
  title: string;
  subtitle: string;
  link: string;
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : null;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get(`/search?q=${encodeURIComponent(query)}`);
        setResults(res.data.data.results || []);
      } catch (err) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'Assignment': return <FileText className="w-4 h-4 text-indigo-400" />;
      case 'Event': return <Calendar className="w-4 h-4 text-emerald-400" />;
      case 'Placement': return <Briefcase className="w-4 h-4 text-amber-400" />;
      case 'Announcement': return <Bell className="w-4 h-4 text-purple-400" />;
      case 'User': return <UserIcon className="w-4 h-4 text-sky-400" />;
      default: return <Search className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl shadow-2xl overflow-hidden z-10">
        <div className="flex items-center px-4 py-3 border-b border-gray-100 dark:border-dark-border">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search assignments, events, placements, users... (Esc to close)"
            className="w-full text-sm bg-transparent outline-none text-gray-900 dark:text-white placeholder:text-gray-400"
          />
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-brand-500" />
          ) : (
            <button onClick={onClose} className="text-gray-400 hover:text-gray-200 text-xs px-2 py-1 bg-gray-100 dark:bg-dark-hover rounded-md">Esc</button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {results.length > 0 ? (
            results.map((r, i) => (
              <div
                key={i}
                onClick={() => {
                  navigate(r.link);
                  onClose();
                }}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-hover cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 dark:bg-dark-bg rounded-lg">{getIcon(r.type)}</div>
                  <div>
                    <h5 className="text-sm font-semibold text-gray-900 dark:text-white">{r.title}</h5>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{r.subtitle}</p>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-bold text-gray-400 px-2 py-0.5 bg-gray-100 dark:bg-dark-bg rounded-md">{r.type}</span>
              </div>
            ))
          ) : query.length >= 2 && !loading ? (
            <div className="p-6 text-center text-xs text-gray-500">No matching campus records found.</div>
          ) : (
            <div className="p-4 text-xs text-gray-400 text-center">Type at least 2 characters to search across platform resources.</div>
          )}
        </div>
      </div>
    </div>
  );
};
