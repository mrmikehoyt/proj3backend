const User = require('./models/User');
const config = require('./config/config');

const addUser = ({ name }) => {
	name = name.trim().toLowerCase();
	const existingUser = User.findOne(name);

	if (existingUser) {
		return {
			error: 'USer already present'
		};
	}

	const user = User({
		name: name,
	})

	user.save();

}