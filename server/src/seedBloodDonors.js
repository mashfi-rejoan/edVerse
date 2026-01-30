// Seed blood donor data
const mongoose = require('mongoose');
const BloodDonation = require('./database/bloodDonationSchema');

const databaseUrl = 'mongodb://localhost:27017/edverse';

mongoose.connect(databaseUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const bloodDonors = [
  {
    studentId: '2022-1-60-001',
    donorName: 'Ahmed Hassan',
    bloodType: 'O+',
    contact: '01712345678',
    currentAddress: 'House 12, Road 5, Dhanmondi, Dhaka',
    lastDonationDate: new Date('2025-11-15'),
    isAvailable: true,
    status: 'Available',
  },
  {
    studentId: '2022-1-60-015',
    donorName: 'Fatima Rahman',
    bloodType: 'A+',
    contact: '01823456789',
    currentAddress: 'Flat 3B, Green View Apartment, Mirpur-10, Dhaka',
    lastDonationDate: new Date('2025-12-01'),
    isAvailable: true,
    status: 'Available',
  },
  {
    studentId: '2022-1-60-028',
    donorName: 'Kamal Hossain',
    bloodType: 'B+',
    contact: '01934567890',
    currentAddress: 'House 45, Sector 7, Uttara, Dhaka',
    lastDonationDate: new Date('2025-10-20'),
    isAvailable: true,
    status: 'Available',
  },
  {
    studentId: '2022-1-60-042',
    donorName: 'Nusrat Jahan',
    bloodType: 'AB+',
    contact: '01645678901',
    currentAddress: 'House 23, Road 11, Banani, Dhaka',
    lastDonationDate: new Date('2025-09-10'),
    isAvailable: true,
    status: 'Available',
  },
  {
    studentId: '2022-1-60-056',
    donorName: 'Rakib Islam',
    bloodType: 'O-',
    contact: '01756789012',
    currentAddress: 'Flat 5C, Rose Garden, Mohammadpur, Dhaka',
    lastDonationDate: new Date('2025-08-25'),
    isAvailable: true,
    status: 'Available',
  },
  {
    studentId: '2022-1-60-073',
    donorName: 'Sadia Akter',
    bloodType: 'A-',
    contact: '01867890123',
    currentAddress: 'House 78, Road 3, Bashundhara R/A, Dhaka',
    isAvailable: true,
    status: 'Available',
  },
  {
    studentId: '2022-1-60-089',
    donorName: 'Tanvir Ahmed',
    bloodType: 'B-',
    contact: '01978901234',
    currentAddress: 'Flat 2A, Diamond Tower, Gulshan-1, Dhaka',
    lastDonationDate: new Date('2025-11-30'),
    isAvailable: true,
    status: 'Available',
  },
  {
    studentId: '2022-1-60-101',
    donorName: 'Maliha Khan',
    bloodType: 'AB-',
    contact: '01689012345',
    currentAddress: 'House 34, Road 8, Banasree, Dhaka',
    isAvailable: true,
    status: 'Available',
  },
  {
    studentId: '2022-1-60-118',
    donorName: 'Fahim Shahriar',
    bloodType: 'O+',
    contact: '01790123456',
    currentAddress: 'Flat 7D, Sky Garden, Motijheel, Dhaka',
    lastDonationDate: new Date('2025-12-15'),
    isAvailable: true,
    status: 'Available',
  },
  {
    studentId: '2022-1-60-125',
    donorName: 'Ayesha Siddika',
    bloodType: 'A+',
    contact: '01801234567',
    currentAddress: 'House 56, Sector 12, Uttara, Dhaka',
    isAvailable: true,
    status: 'Available',
  },
  {
    studentId: '2022-1-60-138',
    donorName: 'Imran Hossain',
    bloodType: 'B+',
    contact: '01912345670',
    currentAddress: 'Flat 4F, Noor Tower, Khilgaon, Dhaka',
    lastDonationDate: new Date('2025-10-05'),
    isAvailable: false,
    status: 'Available',
  },
  {
    studentId: '2022-1-60-147',
    donorName: 'Lamia Haque',
    bloodType: 'O+',
    contact: '01623456781',
    currentAddress: 'House 89, Road 15, Dhanmondi, Dhaka',
    isAvailable: false,
    status: 'Available',
  },
  {
    studentId: '2022-1-60-159',
    donorName: 'Sharmin Sultana',
    bloodType: 'A-',
    contact: '01734567892',
    currentAddress: 'Flat 6B, Pearl Residency, Mirpur-2, Dhaka',
    lastDonationDate: new Date('2025-09-18'),
    isAvailable: true,
    status: 'Available',
  },
  {
    studentId: '2022-1-60-166',
    donorName: 'Rifat Mahmud',
    bloodType: 'AB+',
    contact: '01845678903',
    currentAddress: 'House 22, Road 4, Lalmatia, Dhaka',
    isAvailable: true,
    status: 'Available',
  },
  {
    studentId: '2022-1-60-174',
    donorName: 'Sabrina Islam',
    bloodType: 'O-',
    contact: '01956789014',
    currentAddress: 'Flat 8A, Green City, Badda, Dhaka',
    lastDonationDate: new Date('2025-11-20'),
    isAvailable: true,
    status: 'Available',
  },
];

async function seedBloodDonors() {
  try {
    console.log('Connected to database');
    
    // Clear existing donors
    await BloodDonation.deleteMany({});
    console.log('Cleared existing blood donors');

    // Insert new donors
    await BloodDonation.insertMany(bloodDonors);
    console.log(`Seeded ${bloodDonors.length} blood donors successfully!`);

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding blood donors:', error);
    mongoose.connection.close();
  }
}

seedBloodDonors();
