var express = require('express')
var app = express()
var pug = require('pug')
var bodyParser = require('body-parser')

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

app.use(bodyParser.urlencoded({ extended: false }))
app.locals.moment = require('moment')
app.set('views', './views')
app.use('/assets', express.static('assets'))
app.use('/', express.static('public'))
app.set('view engine', 'pug')
app.use(bodyParser.json())
app.locals.pretty = true

app.get(['/app_todo', '/app_todo:id'], function (req, res) {
  var sql = 'SELECT * FROM tasks'
  connection.query(sql, function(err, rows, fields){
    if (err) throw err
    res.render('todo', {tasks: rows})
  })
})

app.post('/add', function(req, res){
  var title = req.body.title
  var details = req.body.details
  var due = new Date(req.body.due)
  var status = req.body.status
  var sql = 'INSERT INTO tasks (title, details, status, due) VALUES(?,?,?,?)'
  connection.query(sql, [title, details, status, due], function(err, result, fields){
    if (err) throw err
    res.redirect('/app_todo?id=' + result.insertId)
  })
})

app.listen(3000, function () {
  console.log('todolist app listening on port 3000!')
})
