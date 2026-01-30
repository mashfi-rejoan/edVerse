# Blood Donation Feature - Setup Instructions

## Overview
The blood donation feature now includes:
- Student ID, contact, and current address for each donor
- Availability toggle (`isAvailable` field)
- Only available donors are shown in the list
- Enhanced UI with contact and address information

## Database Schema Updates
The `BloodDonation` schema now includes:
```javascript
{
  studentId: String (required)
  donorName: String (required)
  bloodType: String (required) - O+, O-, A+, A-, B+, B-, AB+, AB-
  contact: String (required)
  currentAddress: String (required)
  lastDonationDate: Date (optional)
  nextEligibleDate: Date (optional)
  quantity: Number (default: 450ml)
  isAvailable: Boolean (default: true)
  status: String (Available/Used/Expired)
}
```

## Seeding Blood Donor Data

### Prerequisites
1. Make sure MongoDB is running:
   ```bash
   mongod --dbpath <your-data-path>
   ```

2. Navigate to server/src directory:
   ```bash
   cd D:/edVerse/server/src
   ```

### Run the Seeding Script
```bash
node seedBloodDonors.js
```

This will:
- Clear existing blood donor data
- Insert 15 sample donors with complete information
- Mix of available (13) and unavailable (2) donors
- Various blood types represented

## Sample Data
The seeding script includes donors with:
- Realistic student IDs (2022-1-60-XXX format)
- Bangladeshi names
- Dhaka addresses (various areas)
- Mobile numbers (01XXXXXXXXX format)
- Different blood types
- Some with donation history, some without

## API Endpoints

### Get All Donors (filtered by availability)
```
GET /api/blood-donation
```
Note: Frontend automatically filters to show only available donors

### Get Available Donors by Blood Type
```
GET /api/blood-donation/available/:bloodType
```

### Register New Donor
```
POST /api/blood-donation
Body: {
  studentId, donorName, bloodType, contact, currentAddress,
  lastDonationDate (optional), isAvailable (default: true)
}
```

### Update Donor Information
```
PATCH /api/blood-donation/:id
Body: { fields to update }
```

### Toggle Donor Availability
```
PATCH /api/blood-donation/:id/availability
```
Automatically toggles the `isAvailable` status

## Frontend Features
- Blood type filter (All, O+, O-, A+, A-, B+, B-, AB+, AB-)
- Statistics cards: Total Donors, Available Donors, Selected Type
- Only shows donors with `isAvailable: true`
- Enhanced donor cards showing:
  - Donor name and student ID
  - Blood type prominently displayed
  - Contact phone number
  - Current address
  - Last donation date (if available)
  - Availability badge (always "Available" since filtered)

## Usage Notes
- Donors marked as `isAvailable: false` will NOT appear in the list
- Blood donation eligibility is 56 days from last donation
- The system automatically calculates `nextEligibleDate` when saving
- All donor information is visible for easy contact and verification
