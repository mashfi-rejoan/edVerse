const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/edverse';

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  universityId: String,
  password: String,
  role: String,
  phone: String,
  bloodGroup: String,
  isBloodDonor: Boolean,
  bloodDonorAvailable: Boolean,
  isActive: Boolean
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

async function seedAdmin() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@edverse.com' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('📧 Email: admin@edverse.com');
      console.log('🔑 Password: admin123');
      console.log('👤 University ID: ADMIN001');
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create admin user
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@edverse.com',
      universityId: 'ADMIN001',
      password: hashedPassword,
      role: 'admin',
      phone: '01712345678',
      bloodGroup: 'O+',
      isBloodDonor: false,
      bloodDonorAvailable: false,
      isActive: true
    });

    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('📋 Admin Login Credentials:');
    console.log('═══════════════════════════════════════');
    console.log('📧 Email/Username: admin@edverse.com');
    console.log('🔑 Password: admin123');
    console.log('👤 University ID: ADMIN001');
    console.log('📱 Phone: 01712345678');
    console.log('═══════════════════════════════════════');
    console.log('');
    console.log('🌐 Login at: http://localhost:5173/login');
    console.log('🎯 Then navigate to: /admin/dashboard');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
}

seedAdmin();
