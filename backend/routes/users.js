const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getMe, updateProfile, listUsers, deleteUser, setUserStatus } = require('../controllers/userController');
const { permit } = require('../middleware/roles');
const { validate } = require('../middleware/validate');
const { updateProfile: updateProfileSchema } = require('../validation/user');

router.get('/me', auth, getMe);
router.put('/me', auth, validate(updateProfileSchema), updateProfile);

// Admin: list users
router.get('/', auth, permit('admin'), listUsers);
// Delete user
router.delete('/:id', auth, permit('admin'), deleteUser);
// Toggle active/inactive
router.patch('/:id/status', auth, permit('admin'), setUserStatus);

module.exports = router;
