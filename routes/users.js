const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = require('express').Router();
const User = require('../models/User');
const saltRounds = 10;

router.post('/register', async (req, res) => {
	try {
		req.body.password = bcrypt.hashSync(req.body.password, saltRounds);
		const createdUser = await User.create(req.body);
		const token = jwt.sign({ username: createdUser.username }, process.env.JWT_SECRET);
		res.status(201).send({ token });
	} catch (err) {
		res.status(500).send(err);
	}
});

router.post('/login', async (req, res) => {
	try {
		const { username, password } = req.body;
		const foundUser = await User.findOne({ username });
		if (foundUser) {
			const samePassword = bcrypt.compareSync(password, foundUser.password);
			if (samePassword) {
				const token = jwt.sign({ username: foundUser.username }, process.env.JWT_SECRET);
				res.status(201).send({ token });
			} else {
				res.status(500).send({ error: 'Invalid Username/Password' });
			}
		} else {
			res.status(400).send({ error: 'User not found' });
		}
	} catch (err) {
		res.status(500).send(err);
	}
});

router.get('/:username', async (req, res) => {
	try {
		const foundUser = await User.findOne({username: req.params.username}).select('-password');
		if (foundUser) {
			res.send({ success: foundUser });
		} else {
			res.send({ error: 'Invalid User' });
		}
	} catch (err) {
		res.status(500).send(err);
	}
})

module.exports = router;
