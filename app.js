const express = require('express')
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const expressSession = require('express-session')
const SQLiteStore = require('connect-sqlite3')(expressSession)
const bcrypt = require('bcrypt')
const csurf = require('csurf')
const cookieParser = require('cookie-parser')
const db = require('./db')

const staffsRouter = require('./routers/staffsRouter')
const commentsRouter = require('./routers/commentsRouter')
const reviewsRouter = require('./routers/reviewsRouter')


const ADMIN_USERNAME = "raswer"

const app = express()


app.engine('hbs', expressHandlebars({
  defaultLayout: 'main.hbs',
  extname: "hbs"
}))


csurf({cookie: true })

app.use(express.static('views/CSS'))
app.use(express.static('views/images'))
app.use(cookieParser())

app.use(bodyParser.urlencoded({
  extended: false
}))

/**********************expressSession***********************/
app.use(expressSession({
  secret: "ldfdslmlfmsdo",
  saveUninitialized:false,
  resave: false,
  store: new SQLiteStore({
		db: "sessions_database.db"
	})

}))

/**********************session***********************/

app.use(csurf())

app.use(function(req,res,next){
  const isLoggedIn = req.session.isLoggedIn
  res.locals.isLoggedIn = isLoggedIn
  next()
})

app.use(function (request, response, next) {
  response.locals.csrfToken = request.csrfToken
  next()
})

app.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err)
  res.status(403)
  const model={
    csurfError: true
  }
  res.render('form-error.hbs',model)     
})

app.use("/staffs", staffsRouter)

app.use("/comments", commentsRouter)

app.use("/reviews", reviewsRouter)


app.get('/', (req, res) => {
  res.render('index.hbs')
})

app.get('/about', (req, res) => {
  res.render('about.hbs')
})

app.get('/contact', (req, res) => {
  res.render('contact.hbs')
})

app.get('/staffs', (req, res) => {
  res.render('staffs.hbs')
})

app.get('/comments', (req, res) => {
	res.render('comments.hbs')
})

app.get('/flight', (req, res) => {
  	res.render('flight.hbs')
})

app.get('/marvel', (req, res) => {
	res.render('marvel.hbs')
})
app.get('/error', (req, res) => {
  res.render('form-error.hbs')
})

app.get('/login', (req, res) => {

	if(req.session.isLoggedIn){
		res.redirect('/')
	}else{
    res.render('login.hbs')
	}
})

/**********************login***********************/

app.post("/login", function(request, response){
  const enteredusername = request.body.username
  const enteredpassword = request.body.password

  db.getPassword(ADMIN_USERNAME, function(error,hash){
    if(error){
      const model={
        loginError: true
      }
      response.render('login.hbs',model)     
    }else{
      bcrypt.compare(enteredpassword, hash.password, function(err, result) {
        if(err){
          const model={
            loginError: true
          }
          response.render('login.hbs',model)     
        }else{
          if(result && enteredusername == ADMIN_USERNAME ){
            request.session.isLoggedIn = true
            response.redirect("/")
          }else{
            const model={
              loginError: true
            }
            response.render('login.hbs',model)
          }
      }
      })
    }
  })  

})  

/**********************logout***********************/
app.post('/logout', (req, res) =>{

  req.session.isLoggedIn = false
  res.redirect('/')

})


app.listen(3000)