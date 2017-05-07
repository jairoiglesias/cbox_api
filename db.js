
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/moedasolidaria');

var db = exports.conn = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('conectado com sucesso');
});

var taskSchema = mongoose.Schema({
    task: String,
    price: Number,
    desc: String,
    ods_num: Number,
    ods: String,
    p: String,
    ngo: String
});

exports.taskModel = mongoose.model('tasks', taskSchema);


var userTaskSchema = mongoose.Schema({
    "user_email": String,
    "task": String,
    "done": Boolean,
    "total_currency": Number,
    "spent_currency": Number,
    "desc": String,
    "ods_num": Number,
    "ods": String,
    "p": String,
    "ngo": String
});

exports.userTaskModel = mongoose.model('user_tasks', userTaskSchema);

var productSchema = mongoose.Schema({
    "product": String,
    "price": Number
});

exports.productModel = mongoose.model('products', productSchema);
