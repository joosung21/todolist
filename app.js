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
});
connection.connect()
connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
  if (err) throw err
  console.log('The solution is: ', rows[0].solution)
});
app.set('views', './views')
app.use('/assets', express.static('assets'))
app.use('/', express.static('public'))
app.set('view engine', 'pug')
app.use(bodyParser.json())
app.locals.pretty = true

app.get('/', function (req, res) {
  var sql = 'SELECT title FROM tasks';
  connection.query(sql, function(err, rows, fields){
    if (err) throw err
    res.render('index', {tasks:rows})
  })
})

app.listen(3000, function () {
  console.log('todolist app listening on port 3000!')
})
