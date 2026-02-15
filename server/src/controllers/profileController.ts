import { Response } from 'express';
import bcryptjs from 'bcryptjs';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import Teacher from '../models/Teacher';
import Student from '../models/Student';

export const getTeacherProfile = async (req: AuthRequest, res: Response) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.userId })
      .populate('userId', 'name email role phone photoUrl universityId');

    if (!teacher) {
      return res.status(404).json({ success: false, error: 'Teacher profile not found' });
    }

    res.status(200).json({ success: true, data: teacher });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch profile' });
  }
};

export const updateTeacherProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, phone } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    await user.save();

    const teacher = await Teacher.findOneAndUpdate(
      { userId: req.userId },
      { $set: { name: user.name, email: user.email, phone: user.phone } },
      { new: true }
    ).populate('userId', 'name email role phone photoUrl universityId');

    res.status(200).json({ success: true, data: teacher });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to update profile' });
  }
};

export const changeTeacherPassword = async (req: AuthRequest, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.userId).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const isMatch = await bcryptjs.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to change password' });
  }
};

export const uploadTeacherPhoto = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    user.photoUrl = `/uploads/profile-photos/${req.file.filename}`;
    await user.save();

    res.status(200).json({ success: true, data: { photoUrl: user.photoUrl } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to upload photo' });
  }
};

export const getStudentProfile = async (req: AuthRequest, res: Response) => {
  try {
    const student = await Student.findOne({ userId: req.userId })
      .populate('userId', 'name email role phone photoUrl universityId');

    if (!student) {
      return res.status(404).json({ success: false, error: 'Student profile not found' });
    }

    res.status(200).json({ success: true, data: student });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch profile' });
  }
};

export const updateStudentProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, phone } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    await user.save();

    const student = await Student.findOneAndUpdate(
      { userId: req.userId },
      { $set: { name: user.name, email: user.email, phone: user.phone } },
      { new: true }
    ).populate('userId', 'name email role phone photoUrl universityId');

    res.status(200).json({ success: true, data: student });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to update profile' });
  }
};

export const changeStudentPassword = async (req: AuthRequest, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.userId).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const isMatch = await bcryptjs.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to change password' });
  }
};

export const uploadStudentPhoto = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    user.photoUrl = `/uploads/profile-photos/${req.file.filename}`;
    await user.save();

    res.status(200).json({ success: true, data: { photoUrl: user.photoUrl } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to upload photo' });
  }
};
