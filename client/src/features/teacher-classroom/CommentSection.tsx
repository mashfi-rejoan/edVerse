import { useState } from 'react';
import { Send, Trash2 } from 'lucide-react';
import authService from '../../services/authService';

interface Comment {
  userId: string;
  userRole: string;
  userName: string;
  text: string;
  createdAt: string;
}

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  onCommentAdded: (post: any) => void;
}

const CommentSection = ({ postId, comments, onCommentAdded }: CommentSectionProps) => {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = authService.getCurrentUser();
  const [commentsList, setCommentsList] = useState<Comment[]>(comments);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentText.trim()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`http://localhost:4000/api/classroom/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || 'user-' + Date.now(),
          userRole: user?.role || 'teacher',
          userName: user?.name || 'Anonymous',
          text: commentText.trim()
        })
      });

      const result = await response.json();

      if (result.success) {
        const newComment: Comment = {
          userId: user?.id || 'user-' + Date.now(),
          userRole: user?.role || 'teacher',
          userName: user?.name || 'Anonymous',
          text: commentText.trim(),
          createdAt: new Date().toISOString()
        };

        setCommentsList(prev => [...prev, newComment]);
        setCommentText('');
        onCommentAdded(result.data);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      
      // Add locally even if offline
      const newComment: Comment = {
        userId: user?.id || 'user-' + Date.now(),
        userRole: user?.role || 'teacher',
        userName: user?.name || 'Anonymous',
        text: commentText.trim(),
        createdAt: new Date().toISOString()
      };

      setCommentsList(prev => [...prev, newComment]);
      setCommentText('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (index: number) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      await fetch(`http://localhost:4000/api/classroom/${postId}/comments/${index}`, {
        method: 'DELETE'
      });

      setCommentsList(prev => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error deleting comment:', error);
      setCommentsList(prev => prev.filter((_, i) => i !== index));
    }
  };

  const formatCommentDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="px-5 py-4 bg-gray-50 border-t border-gray-200 space-y-4">
      {/* Existing Comments */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {commentsList.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No comments yet</p>
        ) : (
          commentsList.map((comment, idx) => (
            <div key={idx} className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-sm text-gray-900">
                    {comment.userName}
                    {comment.userRole === 'teacher' && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Teacher</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">{formatCommentDate(comment.createdAt)}</p>
                </div>

                {user?.id === comment.userId && (
                  <button
                    onClick={() => handleDeleteComment(idx)}
                    className="p-1 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                )}
              </div>

              <p className="text-sm text-gray-700">{comment.text}</p>
            </div>
          ))
        )}
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleAddComment} className="flex gap-2">
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C2B4E] focus:border-transparent"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting || !commentText.trim()}
          className="px-4 py-2 rounded-lg bg-[#0C2B4E] text-white text-sm font-medium hover:bg-[#0A1F35] disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default CommentSection;
