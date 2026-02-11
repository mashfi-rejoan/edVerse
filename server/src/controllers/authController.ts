import { Request, Response } from 'express';
import User from '../models/User';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth';

export const register = async (_req: Request, res: Response) => {
  return res.status(403).json({
    message: 'Self-registration is disabled. Please contact your admin for account access.'
  });
};

const generateDefaultPassword = (phone?: string): string => {
  if (!phone) return `edverse@${Math.random().toString().slice(2, 8)}`;
  const digits = phone.replace(/\D/g, '').slice(-6);
  return `edverse@${digits || Math.random().toString().slice(2, 8)}`;
};

export const adminCreateUser = async (req: Request, res: Response) => {
  try {
    const { name, email, universityId, role, phone, bloodGroup, password } = req.body;

    if (!name || !email || !universityId || !role) {
      return res.status(400).json({ message: 'Name, email, universityId, and role are required' });
    }

    const allowedRoles = ['student', 'teacher', 'moderator', 'cafeteria-manager', 'librarian', 'admin'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { universityId }] });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email or university ID already exists' });
    }

    const generatedPassword = password || generateDefaultPassword(phone);

    const user = new User({
      name,
      email,
      universityId,
      password: generatedPassword,
      role,
      phone,
      bloodGroup: bloodGroup || ''
    });

    await user.save();

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        universityId: user.universityId,
        role: user.role,
        phone: user.phone,
        bloodGroup: user.bloodGroup
      },
      temporaryPassword: generatedPassword
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Admin create user error:', error);
    res.status(500).json({ message: 'Server error while creating user' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide username and password' });
    }

    // Find user by email or university ID
    const user = await User.findOne({
      $or: [{ email: username }, { universityId: username }]
    }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        universityId: user.universityId,
        role: user.role
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token required' });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const newAccessToken = generateAccessToken(user._id.toString());
    const newRefreshToken = generateRefreshToken(user._id.toString());

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        universityId: user.universityId,
        role: user.role,
        phone: user.phone,
        bloodGroup: user.bloodGroup,
        isBloodDonor: user.isBloodDonor,
        bloodDonorAvailable: user.bloodDonorAvailable
      }
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if user exists
      return res.json({ message: 'If the email exists, a reset link has been sent' });
    }

    // TODO: Generate reset token and send email via Nodemailer
    // For now, just return success
    // const resetToken = generateResetToken(user._id);
    // await sendPasswordResetEmail(email, resetToken);

    res.json({ message: 'If the email exists, a reset link has been sent' });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const logout = async (req: AuthRequest, res: Response) => {
  try {
    // In a production app, you would add the token to a blacklist
    // For now, we just return success
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
