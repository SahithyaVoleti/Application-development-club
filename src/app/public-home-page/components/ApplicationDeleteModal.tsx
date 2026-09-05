'use client';
import React, { useState, useEffect } from 'react';
import { type WorkspaceProject } from '@/lib/workspaceData';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  project: WorkspaceProject;
  onClose: () => void;
  onConfirmDelete: (projectId: string) => Promise<void> | void;
}

export default function ApplicationDeleteModal({ project, onClose, onConfirmDelete }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Trap Escape key for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isDeleting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, isDeleting]);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      // Simulate backend API call delay
      await new Promise((r) => setTimeout(r, 600));

      // Execute deletion
      await onConfirmDelete(project.id);

      // Section 8: Professional Toast Message
      toast.success(`"${project.name}" was deleted successfully.`, {
        description: 'Application removed from workspace.',
        duration: 3000,
      });

      onClose();
    } catch (err: any) {
      console.error('Delete failed:', err);
      // Section 9: Error Handling
      setError('Unable to delete application. Please try again.');
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-xl border border-slate-200 animate-scaleIn relative overflow-hidden">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-600 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={24} />
          </div>

          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors disabled:opacity-30 cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Section 2 & 3: Dynamically Display Actual Application Name */}
        <div className="space-y-2">
          <h3 id="delete-modal-title" className="text-xl font-extrabold text-slate-900 tracking-tight">
            Delete Application?
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Are you sure you want to delete{' '}
            <span className="font-extrabold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded-md font-mono">
              &quot;{project.name}&quot;
            </span>
            ?
          </p>

          <p className="text-xs text-slate-500 leading-relaxed pt-1">
            This action will permanently remove the application and its deployment links from your workspace.
          </p>
        </div>

        {/* Section 9: Error Feedback */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={handleDelete}
              className="underline hover:text-rose-900 ml-2 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Section 7: Buttons & Loading State */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors disabled:opacity-40 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-md shadow-rose-500/20 btn-hover-premium disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Deleting...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Trash2 size={15} />
                Delete Application
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
