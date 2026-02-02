import { useState } from 'react';
import { X, Send, Clock, Upload, FileText, Trash2 } from 'lucide-react';
import authService from '../../services/authService';

interface CreatePostProps {
  courseCode: string;
  courseName: string;
  sections: string[];
  onPostCreated: (post: any) => void;
  onClose: () => void;
}

const CreatePost = ({
  courseCode,
  courseName,
  sections,
  onPostCreated,
  onClose
}: CreatePostProps) => {
  const [postType, setPostType] = useState<'announcement' | 'material' | 'assignment'>('announcement');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedSections, setSelectedSections] = useState<string[]>(['All']);
  const [dueDate, setDueDate] = useState('');
  const [attachments, setAttachments] = useState<any[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = authService.getCurrentUser();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const typeConfig = {
    announcement: { label: 'Announcement', color: 'bg-blue-100 text-blue-700', icon: '📢' },
    material: { label: 'Material', color: 'bg-green-100 text-green-700', icon: '📄' },
    assignment: { label: 'Assignment', color: 'bg-orange-100 text-orange-700', icon: '📝' }
  };

  const handleSectionToggle = (section: string) => {
    if (section === 'All') {
      setSelectedSections(['All']);
    } else {
      setSelectedSections(prev => {
        const filtered = prev.filter(s => s !== 'All');
        if (filtered.includes(section)) {
          return filtered.filter(s => s !== section);
        } else {
          return [...filtered, section];
        }
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert('Please fill in title and content');
      return;
    }

    setIsSubmitting(true);

    try {
      const postData = {
        teacherId: user?.id || 'T2020001',
        teacherName: user?.name || 'Dr. Ahmed Rahman',
        courseCode,
        courseName,
        sections: selectedSections.length === 0 ? ['All'] : selectedSections,
        type: postType,
        title: title.trim(),
        content: content.trim(),
        attachments: selectedFiles.map(file => ({
          fileName: file.name,
          fileUrl: URL.createObjectURL(file),
          fileSize: file.size,
          fileType: file.type
        })),
        dueDate: dueDate || null
      };

      // Try to save to API
      try {
        const response = await fetch('http://localhost:4000/api/classroom', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData)
        });

        const result = await response.json();

        if (result.success) {
          onPostCreated(result.data);
          
          // Also save to localStorage as backup
          const storageKey = `classroom_posts_${courseCode}`;
          const existingPosts = localStorage.getItem(storageKey);
          const posts = existingPosts ? JSON.parse(existingPosts) : [];
          posts.unshift(result.data);
          localStorage.setItem(storageKey, JSON.stringify(posts));
          
          alert('Post created successfully!');
        } else {
          throw new Error(result.message);
        }
      } catch (apiError) {
        console.error('API error:', apiError);
        
        // Fallback to localStorage only
        const newPost = {
          _id: Date.now().toString(),
          ...postData,
          comments: [],
          viewedBy: [],
          submissions: [],
          isPinned: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        onPostCreated(newPost);

        // Save to localStorage
        const storageKey = `classroom_posts_${courseCode}`;
        const existingPosts = localStorage.getItem(storageKey);
        const posts = existingPosts ? JSON.parse(existingPosts) : [];
        posts.unshift(newPost);
        localStorage.setItem(storageKey, JSON.stringify(posts));

        alert('Post saved locally (database connection failed)');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#0C2B4E] to-[#1A3D64] p-6 text-white flex items-center justify-between">
          <h2 className="text-2xl font-bold">Create New Post</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Course Info */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{courseCode}</span> - {courseName}
            </p>
          </div>

          {/* Post Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Post Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(typeConfig).map(([key, config]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPostType(key as any)}
                  className={`p-3 rounded-lg font-medium transition-all ${
                    postType === key
                      ? 'ring-2 ring-[#0C2B4E] ' + config.color
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-lg mb-1">{config.icon}</div>
                  <div className="text-xs">{config.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Sections</label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleSectionToggle('All')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedSections.includes('All')
                    ? 'bg-[#0C2B4E] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All
              </button>
              {sections.map(section => (
                <button
                  key={section}
                  type="button"
                  onClick={() => handleSectionToggle(section)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedSections.includes(section) && !selectedSections.includes('All')
                      ? 'bg-[#1A3D64] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Section {section}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0C2B4E] focus:border-transparent"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your message here..."
              rows={6}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0C2B4E] focus:border-transparent resize-none"
            />
          </div>

          {/* Due Date (for assignments) */}
          {postType === 'assignment' && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Due Date
              </label>
              <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0C2B4E] focus:border-transparent"
              />
            </div>
          )}

          {/* File Attachments */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Attachments (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#0C2B4E] transition-colors">
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input" className="cursor-pointer block">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500 mt-1">PDF, Documents, Images, etc.</p>
              </label>
            </div>

            {/* Selected Files List */}
            {selectedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-semibold text-gray-600 uppercase">Selected Files ({selectedFiles.length})</p>
                {selectedFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <FileText className="w-4 h-4 text-gray-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(idx)}
                      className="p-1 hover:bg-red-50 rounded transition-colors ml-2 flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 rounded-lg bg-[#0C2B4E] text-white font-semibold hover:bg-[#0A1F35] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? 'Publishing...' : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
