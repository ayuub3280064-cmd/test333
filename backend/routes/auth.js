const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const auth = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { register: registerSchema, login: loginSchema } = require('../validation/auth');

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

// Verify token and return user info
router.get('/verify', auth, (req, res) => {
	return res.json({ user: req.user });
});

module.exports = router;
