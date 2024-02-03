const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://akhilraj3200:3cjvztm1c8y00oGX@cluster0.k7vm8mj.mongodb.net/');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'error connecting to db'));
db.once('open', function(){
    console.log('successfully connected to the database');
})