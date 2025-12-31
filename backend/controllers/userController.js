const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    const updates = {};
    const { name, email, password } = req.body;
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (password) updates.password = await bcrypt.hash(password, await bcrypt.genSalt(10));
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    next(err);
  }
}

module.exports = { getMe, updateProfile };

// Admin controllers
async function listUsers(req, res, next) {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Missing user id' });
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await User.deleteOne({ _id: id });
    res.json({ message: 'User deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getMe, updateProfile, listUsers, deleteUser };

async function setUserStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { active } = req.body;
    if (typeof active !== 'boolean') return res.status(400).json({ message: 'Invalid active value' });
    const user = await User.findByIdAndUpdate(id, { active }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

module.exports = { getMe, updateProfile, listUsers, deleteUser, setUserStatus };
