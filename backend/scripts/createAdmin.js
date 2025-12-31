#!/usr/bin/env node
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');

// Ensure models path resolves correctly from scripts folder
const User = require(path.join(__dirname, '..', 'models', 'User'));

const [,, emailArg, passwordArg] = process.argv;
const email = emailArg || 'admin@example.com';
const password = passwordArg || 'Secret123';
const name = 'Admin User';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/aqoonsoor';

async function run() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);

    const existing = await User.findOne({ email });
    if (existing) {
      if (existing.role === 'admin' && passwordArg) {
        // Update password for existing admin
        const salt2 = await bcrypt.genSalt(10);
        const newHash = await bcrypt.hash(password, salt2);
        existing.password = newHash;
        await existing.save();
        console.log(`Updated password for existing admin: ${email}`);
        await mongoose.disconnect();
        process.exit(0);
      }
      console.log(`User with email ${email} already exists (role=${existing.role}).`);
      await mongoose.disconnect();
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hash, role: 'admin' });
    await user.save();

    console.log('Admin user created:');
    console.log(`  email: ${email}`);
    console.log(`  password: ${password}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin user:', err);
    try { await mongoose.disconnect(); } catch(e){}
    process.exit(1);
  }
}

run();
