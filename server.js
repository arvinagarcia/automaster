const express = require('express')
const app = express()
const { pool } = require('./dbConfig')
const bcrypt = require('bcrypt')
const session = require('express-session')
const flash = require('express-flash')
const passport = require('passport')

// Serve static files from 'public' directory
app.use(express.static(__dirname + '/public'));

const initializePassport = require('./passportConfig')

initializePassport(passport)

const PORT = process.env.port || 4000

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.get('/', (req, res) => {
  res.render('login')
})

app.get('/users/register', checkAuthenticated, (req, res) => {
  res.render('register')
})

app.get('/users/login', checkAuthenticated, (req, res) => {
  res.render('login')
})

app.get('/users/dashboard', checkNotAuthenticated, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    
    // Format prices
    const products = result.rows.map(product => ({
      ...product,
      price: Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }));

    res.render('dashboard', { user: req.user.name, email: req.user.email, products });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.get('/users/cart', checkNotAuthenticated, (req, res) => {
  res.render('cart', { user: req.user.name, email: req.user.email})
})

app.get('/users/product', checkNotAuthenticated, (req, res) => {
  res.render('product', { user: req.user.name, email: req.user.email})
})

app.get('/users/logout', (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    req.flash('success_msg', 'You have logged out.')
    res.redirect('/users/login');   
  })
})

app.post('/users/register', async (req, res) => {
  let { name, email, password, confirmPassword } = req.body

  let errors = []

  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: "Please fill up all fields." })
  }

  if (password.length < 8) {
    errors.push({ message: "Password should be at least 8 characters." })
  }

  if (password != confirmPassword) {
    errors.push({ message: "Passwords do not match." })
  }

  if (errors.length > 0) {
    res.render('register', { errors })
  } else {
    // Form validation passed
    let hashedPassword = await bcrypt.hash(password, 10)

    pool.query(
      `SELECT * FROM users
      WHERE email = $1`, [email], (err, results) => {
        if (err) {
          throw err
        }

        if (results.rows.length > 0) {
          errors.push({ message: 'Email already registered.'})
          res.render('register', { errors })
        } else {
          pool.query(
            `INSERT INTO users (name, email, password)
            VALUES ($1, $2, $3)
            RETURNING id, password`, [name, email, hashedPassword], (err, results) => {
              if (err) {
                throw err
              }
              req.flash('success_msg', 'You are now registered. Please log in.')
              res.redirect('/users/login')
            }
          )
        }
      } 
    )
  }
})

app.post('/users/login', passport.authenticate('local', {
  successRedirect: '/users/dashboard',
  failureRedirect: '/users/login',
  failureFlash: true
}))

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/users/dashboard')
  }
  next()
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/users/login')
}

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})