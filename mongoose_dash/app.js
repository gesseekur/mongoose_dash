var express = require("express");
var app = express();
var mongoose = require('mongoose');
var bodyParser = require("body-parser");
var path=require("path");

mongoose.connect('mongodb://localhost:27017/dash_mongoose');

var BunnySchema = new mongoose.Schema({
	name: String,
	age: Number,
	hobbies: String
});


mongoose.model('Bunny', BunnySchema);
var Bunny = mongoose.model('Bunny');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "./static"));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.get('/', function(req,res){
	Bunny.find({}, function(err,bunnies){
		if(err) {
			console.log('Something went wrong');
		}
		else {
			res.render('index', {bunny:bunnies});
		}
	})
});

app.get('/bunny/new', function(req,res){
	res.render('new');
})

app.post('/bunny', function(req,res) {
	var bunny = new Bunny({name:req.body.name, age:req.body.age, hobbies:req.body.hobbies });
	bunny.save(function(err) {
		if(err) {
			console.log('Something went wrong');
		}
		else {
			console.log('Successfully added user');
			res.redirect('/bunny/new');
		}
	});
});

app.get('/bunny/:id/edit', function(req,res) {
	Bunny.findOne({_id:req.params.id}, function(err,bunny){
		res.render('edit',{bunny:bunny});
	});
});

app.post('/bunny/:id', function(req,res) {
	Bunny.update({_id: req.params.id},{name:req.body.name,age:req.body.age, hobbies:req.body.hobbies}, function(err, bunny) {
		if(err) {
			console.log('Something went wrong');
		}
		else {
			console.log('success!');
			res.redirect('/');
		}
	});
});

app.get('/bunny/:id', function(req,res) {
	Bunny.findOne({_id:req.params.id}, function(err,bunny){
		res.render('info', {bunny:bunny});
	});
});

app.get('/bunny/:id/destroy', function(req,res) {
	Bunny.remove({_id:req.params.id}, function(err,user){
		if(err) {
			console.log('Something went wrong');
		}
		else {
			res.redirect('/');
		}
	});
});

app.listen(8000, function(){
	console.log("listening on port 8000");
});
