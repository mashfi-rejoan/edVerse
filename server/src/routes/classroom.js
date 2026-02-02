const express = require('express');
const router = express.Router();
const ClassroomPost = require('../models/ClassroomPost');

// Get all posts for a course (with pagination)
router.get('/course/:courseCode', async (req, res) => {
  try {
    const { courseCode } = req.params;
    const { section } = req.query;
    
    let query = { courseCode };
    if (section && section !== 'All') {
      query.sections = { $in: [section, 'All'] };
    }

    const posts = await ClassroomPost.find(query)
      .sort({ isPinned: -1, createdAt: -1 })
      .limit(50);

    res.json({ success: true, data: posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch posts',
      error: error.message 
    });
  }
});

// Get single post with details
router.get('/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    
    const post = await ClassroomPost.findById(postId);
    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: 'Post not found' 
      });
    }

    res.json({ success: true, data: post });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch post',
      error: error.message 
    });
  }
});

// Create new post
router.post('/', async (req, res) => {
  try {
    const {
      teacherId,
      teacherName,
      courseCode,
      courseName,
      sections,
      type,
      title,
      content,
      attachments = [],
      dueDate = null
    } = req.body;

    // Validate required fields
    if (!teacherId || !courseCode || !type || !title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Validate post type
    const validTypes = ['announcement', 'material', 'assignment'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid post type. Must be: announcement, material, or assignment'
      });
    }

    const newPost = new ClassroomPost({
      teacherId,
      teacherName,
      courseCode,
      courseName,
      sections,
      type,
      title,
      content,
      attachments,
      dueDate,
      isPinned: false,
      viewedBy: [],
      comments: []
    });

    await newPost.save();

    res.json({
      success: true,
      message: 'Post created successfully',
      data: newPost
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create post',
      error: error.message 
    });
  }
});

// Update post
router.put('/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, content, attachments, dueDate } = req.body;

    const post = await ClassroomPost.findByIdAndUpdate(
      postId,
      {
        title,
        content,
        attachments,
        dueDate,
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: 'Post not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Post updated successfully',
      data: post 
    });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update post',
      error: error.message 
    });
  }
});

// Delete post
router.delete('/:postId', async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await ClassroomPost.findByIdAndDelete(postId);

    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: 'Post not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Post deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete post',
      error: error.message 
    });
  }
});

// Pin/Unpin post
router.patch('/:postId/pin', async (req, res) => {
  try {
    const { postId } = req.params;
    const { isPinned } = req.body;

    const post = await ClassroomPost.findByIdAndUpdate(
      postId,
      { isPinned, updatedAt: Date.now() },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: 'Post not found' 
      });
    }

    res.json({ 
      success: true, 
      message: `Post ${isPinned ? 'pinned' : 'unpinned'} successfully`,
      data: post 
    });
  } catch (error) {
    console.error('Error pinning post:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to pin post',
      error: error.message 
    });
  }
});

// Add comment to post
router.post('/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, userRole, userName, text } = req.body;

    if (!userId || !userRole || !userName || !text) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields for comment'
      });
    }

    const post = await ClassroomPost.findByIdAndUpdate(
      postId,
      {
        $push: {
          comments: {
            userId,
            userRole,
            userName,
            text,
            createdAt: Date.now()
          }
        }
      },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: 'Post not found' 
      });
    }

    res.json({
      success: true,
      message: 'Comment added successfully',
      data: post
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to add comment',
      error: error.message 
    });
  }
});

// Delete comment
router.delete('/:postId/comments/:commentIndex', async (req, res) => {
  try {
    const { postId, commentIndex } = req.params;

    const post = await ClassroomPost.findById(postId);
    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: 'Post not found' 
      });
    }

    post.comments.splice(parseInt(commentIndex), 1);
    await post.save();

    res.json({
      success: true,
      message: 'Comment deleted successfully',
      data: post
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete comment',
      error: error.message 
    });
  }
});

// Mark post as viewed
router.post('/:postId/view', async (req, res) => {
  try {
    const { postId } = req.params;
    const { studentId } = req.body;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID required'
      });
    }

    const post = await ClassroomPost.findById(postId);
    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: 'Post not found' 
      });
    }

    // Add student to viewedBy if not already there
    if (!post.viewedBy.includes(studentId)) {
      post.viewedBy.push(studentId);
      await post.save();
    }

    res.json({
      success: true,
      message: 'Post marked as viewed',
      data: post
    });
  } catch (error) {
    console.error('Error marking post as viewed:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to mark post as viewed',
      error: error.message 
    });
  }
});

// Submit assignment (student file submission)
router.post('/:postId/submit', async (req, res) => {
  try {
    const { postId } = req.params;
    const { studentId, studentName, files } = req.body;

    if (!studentId || !studentName || !files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields for submission'
      });
    }

    const post = await ClassroomPost.findById(postId);
    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: 'Post not found' 
      });
    }

    // Check if already submitted (update existing submission)
    const existingSubmissionIndex = post.submissions.findIndex(
      (s) => s.studentId === studentId
    );

    const submission = {
      studentId,
      studentName,
      files,
      submittedAt: Date.now(),
      isLate: post.dueDate ? new Date(Date.now()) > new Date(post.dueDate) : false
    };

    if (existingSubmissionIndex > -1) {
      // Update existing submission
      post.submissions[existingSubmissionIndex] = submission;
    } else {
      // Add new submission
      post.submissions.push(submission);
    }

    await post.save();

    res.json({
      success: true,
      message: 'Assignment submitted successfully',
      data: post
    });
  } catch (error) {
    console.error('Error submitting assignment:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit assignment',
      error: error.message 
    });
  }
});

// Get student submission for an assignment
router.get('/:postId/submission/:studentId', async (req, res) => {
  try {
    const { postId, studentId } = req.params;

    const post = await ClassroomPost.findById(postId);
    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: 'Post not found' 
      });
    }

    const submission = post.submissions.find((s) => s.studentId === studentId);
    if (!submission) {
      return res.json({
        success: true,
        data: null,
        message: 'No submission found'
      });
    }

    res.json({
      success: true,
      data: submission
    });
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch submission',
      error: error.message 
    });
  }
});

// Get all submissions for an assignment (teacher view)
router.get('/:postId/submissions', async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await ClassroomPost.findById(postId);
    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: 'Post not found' 
      });
    }

    res.json({
      success: true,
      data: post.submissions
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch submissions',
      error: error.message 
    });
  }
});

module.exports = router;
