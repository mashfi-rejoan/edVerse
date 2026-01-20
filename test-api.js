#!/usr/bin/env node

/**
 * Quick API Test Script
 * Tests if the backend registration API is working
 * Run with: node test-api.js
 */

const http = require('http');

function testAPI() {
  const testData = {
    name: 'Test User ' + Date.now(),
    email: 'test' + Date.now() + '@university.edu',
    universityId: 'TEST' + Date.now(),
    password: 'password123',
    role: 'student',
    bloodGroup: 'O+'
  };

  const postData = JSON.stringify(testData);

  console.log('🧪 Testing Registration API...\n');
  console.log('📧 Test data:');
  console.log(testData);
  console.log('\n⏳ Sending request to http://localhost:4000/api/auth/register...\n');

  const options = {
    hostname: 'localhost',
    port: 4000,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    let responseData = '';

    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      console.log(`✓ Status: ${res.statusCode}\n`);
      
      try {
        const parsed = JSON.parse(responseData);
        console.log('✓ Response:');
        console.log(JSON.stringify(parsed, null, 2));
        
        if (res.statusCode === 201) {
          console.log('\n✅ Registration API is working!');
          console.log(`✓ Access token: ${parsed.accessToken.substring(0, 20)}...`);
          console.log(`✓ User ID: ${parsed.user.id}`);
        } else {
          console.log('\n⚠️  API returned error:');
          console.log(parsed.message);
        }
      } catch (e) {
        console.log('✓ Response (raw):');
        console.log(responseData);
      }
    });
  });

  req.on('error', (error) => {
    console.error('\n❌ Error connecting to backend:');
    console.error(`   ${error.message}`);
    console.error('\n💡 Make sure:');
    console.error('   1. Backend is running: npm run dev --workspace server');
    console.error('   2. MongoDB is connected');
    console.error('   3. Port 4000 is not blocked');
  });

  req.write(postData);
  req.end();
}

testAPI();
