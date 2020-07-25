require('dotenv').config();
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

const router = require('./routes');

app.use(express.json());
const server = http.createServer(app);
const io = socketio(server);

//get configs from config file
const config = require('./config/config');

/**Mongo Connection  */
//const MONGODB_URI = config.mongodburi || 'mongodb://localhost:27017/chatter';

mongoose
	.connect(config.mongodburi, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true
	})
	.then(() => {
		const { addUser, removeUser, getUser, getAllUsers } = require('./helpers/socket');

		/**MiddleWares */
		app.use(cors());
		app.use('/api', router);

		io.on('connect', (socket) => {
			socket.on('join', ({ name }, callback) => {
				const { error, user } = addUser({
					id: socket.id,
					name
				});

				if (error) return callback(error);

				socket.emit('message', {
					user: 'admin',
					text: `${user.name}, welcome to chat room.`
				});
				socket.broadcast.emit('message', {
					user: 'admin',
					text: `${user.name} has joined!`
				});

				io.emit('roomData', {
					users: getAllUsers()
				});

				callback();
			});

			socket.on('sendMessage', (message, callback) => {
				const user = getUser(socket.id);

				io.emit('message', {
					user: user.name,
					text: message
				});

				callback();
			});

			socket.on('disconnect', () => {
				const user = removeUser(socket.id);

				if (user) {
					io.emit('message', {
						user: 'Admin',
						text: `${user.name} has left.`
					});
					io.emit('roomData', {
						users: getAllUsers()
					});
				}
			});
		});

		const PORT = process.env.PORT || 4000;
		server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
	})
	.catch((err) => {
		console.log('error connecting to DB', err);
	});
