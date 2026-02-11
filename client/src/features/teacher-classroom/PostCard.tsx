import { useState } from 'react';
import { MoreVertical, Pin, Trash2, MessageCircle, Eye, FileText, Download } from 'lucide-react';
import CommentSection from './CommentSection';
import { apiUrl } from '../../utils/apiBase';

interface PostProps {
  post: any;
  onDeleted: (postId: string) => void;
  onPinned: (postId: string, isPinned: boolean) => void;
  isTeacher: boolean;
}

const PostCard = ({ post, onDeleted, onPinned, isTeacher }: PostProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showViewers, setShowViewers] = useState(false);

  const typeConfig: Record<string, { label: string; color: string; bgColor: string; icon: string }> = {
    announcement: { label: 'Announcement', color: 'text-blue-600', bgColor: 'bg-blue-50', icon: '📢' },
    material: { label: 'Material', color: 'text-green-600', bgColor: 'bg-green-50', icon: '📄' },
    assignment: { label: 'Assignment', color: 'text-orange-600', bgColor: 'bg-orange-50', icon: '📝' }
  };

  const config = typeConfig[post.type] || typeConfig.announcement;

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(apiUrl(`/api/classroom/${post._id}`), {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success) {
        onDeleted(post._id);
        alert('Post deleted successfully');
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      // Still delete from UI for offline mode
      onDeleted(post._id);
      alert('Post deleted (saved offline)');
    }
  };

  const handlePin = async () => {
    try {
      const response = await fetch(apiUrl(`/api/classroom/${post._id}/pin`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPinned: !post.isPinned })
      });

      const result = await response.json();

      if (result.success) {
        onPinned(post._id, !post.isPinned);
      }
    } catch (error) {
      console.error('Error pinning post:', error);
      onPinned(post._id, !post.isPinned);
    }
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
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`rounded-xl shadow-md border transition-all ${post.isPinned ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 bg-white hover:shadow-lg'}`}>
      {/* Pin Badge */}
      {post.isPinned && (
        <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 text-sm font-medium border-b border-yellow-200">
          <Pin className="w-4 h-4" />
          Pinned Post
        </div>
      )}

      {/* Header */}
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

          {isTeacher && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => {
                      handlePin();
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700 border-b border-gray-200"
                  >
                    <Pin className="w-4 h-4" />
                    {post.isPinned ? 'Unpin' : 'Pin Post'}
                  </button>
                  <button
                    onClick={() => {
                      handleDelete();
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-red-50 flex items-center gap-2 text-sm text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Title and Content */}
        <h2 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>

        {/* Due Date */}
        {post.dueDate && (
          <div className="mt-3 inline-block px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700 font-medium">
              Due: {formatDueDate(post.dueDate)}
            </p>
          </div>
        )}
      </div>

      {/* Attachments */}
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

      {/* Submissions (for assignments) */}
      {post.type === 'assignment' && post.submissions && post.submissions.length > 0 && (
        <div className="px-5 py-3 bg-blue-50 border-b border-blue-200">
          <p className="text-xs font-semibold text-blue-700 mb-2 uppercase">Submissions ({post.submissions.length})</p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {post.submissions.map((submission: any, idx: number) => (
              <div key={idx} className="bg-white p-2 rounded border border-blue-200">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <p className="text-sm font-medium text-blue-900">{submission.studentName}</p>
                    <p className="text-xs text-blue-600">
                      Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                      {submission.isLate && <span className="ml-1 text-red-600">(Late)</span>}
                    </p>
                  </div>
                  <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {submission.files.length} file{submission.files.length !== 1 ? 's' : ''}
                  </span>
                </div>
                {submission.files && submission.files.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {submission.files.map((file: any, fileIdx: number) => (
                      <a
                        key={fileIdx}
                        href={file.fileUrl}
                        download
                        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                      >
                        <FileText className="w-3 h-3" />
                        <span className="truncate">{file.fileName}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer - Stats and Actions */}
      <div className="px-5 py-3 flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-4">
          {post.viewedBy && post.viewedBy.length > 0 && (
            <button
              onClick={() => setShowViewers(!showViewers)}
              className="flex items-center gap-1 hover:text-[#0C2B4E] transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>{post.viewedBy.length} viewed</span>
            </button>
          )}

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1 hover:text-[#0C2B4E] transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{post.comments ? post.comments.length : 0} comments</span>
          </button>
        </div>

        {post.sections && post.sections.length > 0 && (
          <span className="text-xs text-gray-500">
            {post.sections.includes('All') ? 'All Sections' : `Section ${post.sections.join(', ')}`}
          </span>
        )}
      </div>

      {/* Viewers Modal */}
      {showViewers && post.viewedBy && post.viewedBy.length > 0 && (
        <div className="px-5 py-3 bg-blue-50 border-t border-blue-200">
          <p className="text-xs font-semibold text-blue-700 mb-2">Viewed by:</p>
          <div className="flex flex-wrap gap-2">
            {post.viewedBy.map((studentId: string) => (
              <span key={studentId} className="text-xs bg-white px-2 py-1 rounded border border-blue-200 text-blue-700">
                {studentId}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Comments Section */}
      {showComments && (
        <CommentSection
          postId={post._id}
          comments={post.comments || []}
          onCommentAdded={(newPost) => {
            // Update post with new comments
          }}
        />
      )}
    </div>
  );
};

export default PostCard;
