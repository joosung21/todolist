var express = require('express')
var app = express()
var pug = require('pug')
var bodyParser = require('body-parser')              // Module for Passsing POST data
var mysql = require('mysql')
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '111111',
  database : 'todolist'
})
connection.connect()
connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
  if (err) throw err
  console.log('The solution is: ', rows[0].solution)
})

app.locals.moment = require('moment')               // Module for control time format
app.set('views', './views')                         // Init Pug path
app.set('view engine', 'pug')                       // Init framework
app.locals.pretty = true                            // Setting Pug comverting to pretty html
app.use('/assets', express.static('assets'))        // Init asset path
app.use('/', express.static('public'))              // Init static file path
app.use(bodyParser.urlencoded({ extended: false })) // Set bodyParser
app.use(bodyParser.json())                          // Set bodyParser json

// ENTRY OF ToDo APP
app.get(['/app_todo', '/app_todo/:id'], function (req, res) {
  var id = req.params.id
  var sql = 'SELECT * FROM tasks'
  connection.query(sql, function(err, rows, fields){
    if (err) throw err
    res.render('todo', {
      tasks: rows
    })
  })
})

// ADD A TASK
app.post('/add', function(req, res){
  var title = req.body.title
  var details = req.body.details
  var due = new Date(req.body.due)
  var status = req.body.status
  var sql = 'INSERT INTO tasks (title, details, status, due) VALUES(?,?,?,?)'
  connection.query(sql, [title, details, status, due], function(err, result, fields){
    if (err) throw err
    res.redirect('/app_todo?taskId=' + result.insertId)
  })
})

// SERVER LISTNER
app.listen(3000, function () {
  console.log('todolist app listening on port 3000!')
})
