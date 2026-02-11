import { useEffect, useMemo, useState } from 'react';
import { MessageCircle, FileText, Download, Upload, Clock, CheckCircle } from 'lucide-react';
import CommentSection from '../teacher-classroom/CommentSection';
import { apiUrl } from '../../utils/apiBase';

interface Post {
  _id: string;
  teacherName: string;
  courseCode: string;
  courseName: string;
  sections: string[];
  type: 'announcement' | 'material' | 'assignment';
  title: string;
  content: string;
  attachments: any[];
  submissions: any[];
  dueDate: string | null;
  isPinned: boolean;
  viewedBy: string[];
  comments: any[];
  createdAt: string;
}

interface StudentPostCardProps {
  post: Post;
  studentId: string;
  studentName: string;
  onSubmissionUpdated: (updatedPost: Post) => void;
}

const StudentPostCard = ({ post, studentId, studentName, onSubmissionUpdated }: StudentPostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [showSubmission, setShowSubmission] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localSubmission, setLocalSubmission] = useState<any | null>(null);

  const typeConfig: Record<string, { label: string; color: string; bgColor: string; icon: string }> = {
    announcement: { label: 'Announcement', color: 'text-blue-600', bgColor: 'bg-blue-50', icon: '📢' },
    material: { label: 'Material', color: 'text-green-600', bgColor: 'bg-green-50', icon: '📄' },
    assignment: { label: 'Assignment', color: 'text-orange-600', bgColor: 'bg-orange-50', icon: '📝' }
  };

  const config = typeConfig[post.type] || typeConfig.announcement;

  useEffect(() => {
    if (!studentId) return;
    const storageKey = `classroom_submission_${post._id}_${studentId}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setLocalSubmission(JSON.parse(saved));
    }
  }, [post._id, studentId]);

  const mySubmission = useMemo(() => {
    const fromPost = post.submissions?.find((s: any) => s.studentId === studentId);
    return fromPost || localSubmission;
  }, [localSubmission, post.submissions, studentId]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const handleSubmit = async () => {
    if (!selectedFiles.length) return;
    setIsSubmitting(true);

    const filesPayload = selectedFiles.map(file => ({
      fileName: file.name,
      fileUrl: URL.createObjectURL(file),
      fileSize: file.size,
      fileType: file.type
    }));

    try {
      const response = await fetch(apiUrl(`/api/classroom/${post._id}/submit`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          studentName,
          files: filesPayload
        })
      });

      const result = await response.json();

      if (result.success && result.data) {
        const updatedPost = result.data as Post;
        const submission = updatedPost.submissions?.find((s: any) => s.studentId === studentId) || {
          studentId,
          studentName,
          files: filesPayload,
          submittedAt: new Date().toISOString(),
          isLate: post.dueDate ? new Date(Date.now()) > new Date(post.dueDate) : false
        };

        const storageKey = `classroom_submission_${post._id}_${studentId}`;
        localStorage.setItem(storageKey, JSON.stringify(submission));
        setLocalSubmission(submission);
        setSelectedFiles([]);
        onSubmissionUpdated(updatedPost);
        alert('Assignment submitted successfully');
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Error submitting assignment:', error);
      const offlineSubmission = {
        studentId,
        studentName,
        files: filesPayload,
        submittedAt: new Date().toISOString(),
        isLate: post.dueDate ? new Date(Date.now()) > new Date(post.dueDate) : false
      };
      const storageKey = `classroom_submission_${post._id}_${studentId}`;
      localStorage.setItem(storageKey, JSON.stringify(offlineSubmission));
      setLocalSubmission(offlineSubmission);
      setSelectedFiles([]);
      alert('Submission saved locally (offline mode)');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isOverdue = post.dueDate ? new Date(Date.now()) > new Date(post.dueDate) : false;

  return (
    <div className={`rounded-xl shadow-md border transition-all ${post.isPinned ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 bg-white hover:shadow-lg'}`}>
      {post.isPinned && (
        <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 text-sm font-medium border-b border-yellow-200">
          <span>📌</span>
          Pinned Post
        </div>
      )}

      <div className="p-5 border-b border-gray-200">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-1">
            <div className={`w-12 h-12 rounded-full ${config.bgColor} flex items-center justify-center text-lg`}>
              {config.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-900">{post.teacherName}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded ${config.color} bg-opacity-10 ${config.bgColor}`}>
                  {config.label}
                </span>
              </div>
              <p className="text-sm text-gray-600">{formatDate(post.createdAt)}</p>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>

        {post.dueDate && (
          <div className={`mt-3 inline-block px-3 py-2 rounded-lg border ${isOverdue ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'}`}>
            <p className={`text-sm font-medium ${isOverdue ? 'text-red-700' : 'text-orange-700'}`}>
              Due: {formatDueDate(post.dueDate)}{isOverdue ? ' (Overdue)' : ''}
            </p>
          </div>
        )}
      </div>

      {post.attachments && post.attachments.length > 0 && (
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
          <p className="text-xs font-semibold text-gray-600 mb-2 uppercase">Attachments</p>
          <div className="space-y-2">
            {post.attachments.map((attachment: any, idx: number) => (
              <a
                key={idx}
                href={attachment.fileUrl}
                download
                className="flex items-center gap-2 p-2 bg-white rounded border border-gray-200 hover:border-[#0C2B4E] group transition-colors"
              >
                <FileText className="w-4 h-4 text-gray-600 group-hover:text-[#0C2B4E]" />
                <span className="text-sm text-gray-700 flex-1 truncate">{attachment.fileName}</span>
                <Download className="w-4 h-4 text-gray-400 group-hover:text-[#0C2B4E]" />
              </a>
            ))}
          </div>
        </div>
      )}

      {post.type === 'assignment' && (
        <div className="px-5 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">Your Submission</p>
              {mySubmission ? (
                <p className="text-xs text-gray-500">
                  Submitted on {new Date(mySubmission.submittedAt).toLocaleDateString()}
                </p>
              ) : (
                <p className="text-xs text-gray-500">No submission yet</p>
              )}
            </div>
            {mySubmission ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                <CheckCircle className="w-3 h-3" /> Submitted
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-700 bg-orange-100 px-2 py-1 rounded-full">
                <Clock className="w-3 h-3" /> Pending
              </span>
            )}
          </div>

          {mySubmission && mySubmission.files?.length > 0 && (
            <div className="mb-3 space-y-2">
              {mySubmission.files.map((file: any, idx: number) => (
                <a
                  key={idx}
                  href={file.fileUrl}
                  download
                  className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-800"
                >
                  <FileText className="w-3 h-3" />
                  <span className="truncate">{file.fileName}</span>
                </a>
              ))}
            </div>
          )}

          <button
            onClick={() => setShowSubmission(!showSubmission)}
            className="text-sm text-[#0C2B4E] font-medium hover:underline"
          >
            {showSubmission ? 'Hide submission form' : mySubmission ? 'Resubmit assignment' : 'Submit assignment'}
          </button>

          {showSubmission && (
            <div className="mt-3 space-y-3">
              <label className="block text-xs font-semibold text-gray-600 uppercase">Upload Files</label>
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="block w-full text-sm text-gray-600"
              />

              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  {selectedFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs text-gray-700 bg-gray-50 border border-gray-200 rounded px-2 py-1">
                      <span className="truncate">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(idx)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || selectedFiles.length === 0}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0C2B4E] text-white text-sm font-semibold hover:bg-[#0A1F35] disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                {isSubmitting ? 'Submitting...' : mySubmission ? 'Resubmit' : 'Submit'}
              </button>
            </div>
          )}
        </div>
      )}

      <div className="px-5 py-3 flex items-center justify-between text-sm text-gray-600">
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1 hover:text-[#0C2B4E] transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{post.comments ? post.comments.length : 0} comments</span>
        </button>
        {post.sections && post.sections.length > 0 && (
          <span className="text-xs text-gray-500">
            {post.sections.includes('All') ? 'All Sections' : `Section ${post.sections.join(', ')}`}
          </span>
        )}
      </div>

      {showComments && (
        <CommentSection
          postId={post._id}
          comments={post.comments || []}
          onCommentAdded={() => {
            // Comments are updated server-side
          }}
        />
      )}
    </div>
  );
};

export default StudentPostCard;
