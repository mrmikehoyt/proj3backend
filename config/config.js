SECRET=process.env.SECRET
DB_USERNAME=process.env.DB_USERNAME
DB_PASSWORD=process.env.DB_PASSWORD

module.exports = {
    SECRET:SECRET,
    mongodburi: 'mongodb+srv://' + DB_USERNAME + ':' + DB_PASSWORD+'@cluster0.jxrw8.mongodb.net/<chat-app>?retryWrites=true&w=majority'
};
