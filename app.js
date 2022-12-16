const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')
const conn = require('./db/conn')

const app = express()

const PhrasesRoutes = require('./routes/PhrasesRoutes')
const authRoutes = require('./routes/AuthRoutes')

const PhrasesController = require('./controllers/PhrasesController')


app.engine('.handlebars', exphbs.engine({ extname: '.handlebars', defaultLayout: "main"}));
app.set('view engine', 'handlebars');

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static('public'))

app.use(session({
  name: 'session',
  secret: 'nosso_secret',
  resave: false,
  saveUninitialized: false,
  store: new FileStore({
    logFn: function(){},
    path: require('path').join(require('os').tmpdir(), 'sessions'),
  }),
  cookie: {
    secure: false,
    maxAge: 360000,
    expires: new Date(Date.now() + 360000),
    httpOnly: true
  }
}))

app.use(flash())

app.use((req, res, next) => {
  if(req.session.userid){
    res.locals.session = req.session
  }
  
  next()
})

app.use('/auth', authRoutes)
app.use('/phrases', PhrasesRoutes)

app.get('/', PhrasesController.allPhrases)

conn
  // .sync({force: true})
  .sync()
  .then(() => {
    app.listen(3000, () => {
      console.log('Connected to server')
      console.log('')
      console.log('')
      console.log('')
    })
  })
  .catch( err => console.log(err))