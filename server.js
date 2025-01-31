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
    const result = await pool.query('SELECT * FROM products ORDER BY id');
    
    // Format price
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

app.get('/users/cart', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.redirect('/users/login');
    }

    const user_id = req.user.id;

    // Fetch cart items with product details
    const result = await pool.query(
      `SELECT products.id AS product_id, products.name, products.price, products.image_path, cart_items.quantity 
      FROM cart_items
      JOIN carts ON cart_items.cart_id = carts.id
      JOIN products ON cart_items.product_id = products.id
      WHERE carts.user_id = $1
      ORDER BY cart_items.id ASC`,
      [user_id]
    );

    console.log("🚀 Cart Items Fetched:", result.rows); // Debugging log

    res.render('cart', { user: req.user.name, email: req.user.email, cartItems: result.rows });
  } catch (err) {
    console.error("🚨 Error fetching cart items:", err);
    res.status(500).send('Server Error');
  }
});

app.post('/cart/update', async (req, res) => {
  console.log("🚨 Received form data:", req.body);

  try {
    if (!req.isAuthenticated()) {
      return res.redirect('/users/login');
    }

    const product_id = parseInt(req.body.product_id, 10); // Convert to integer
    const action = req.body.action;
    const user_id = req.user.id;

    if (!product_id || isNaN(product_id)) {
      console.log("🚨 Error: product_id is missing or not a number", product_id);
      return res.status(400).send("Invalid product ID");
    }

    let query = '';
    if (action === "increase") {
      query = `UPDATE cart_items 
               SET quantity = quantity + 1 
               WHERE product_id = $1 
               AND cart_id = (SELECT id FROM carts WHERE user_id = $2)`;
    } else if (action === "decrease") {
      query = `UPDATE cart_items 
               SET quantity = GREATEST(quantity - 1, 1) 
               WHERE product_id = $1 
               AND cart_id = (SELECT id FROM carts WHERE user_id = $2)`;
    }

    await pool.query(query, [product_id, user_id]);
    res.redirect('/users/cart');
  } catch (err) {
    console.error("🚨 Error updating quantity:", err);
    res.status(500).send('Server Error');
  }
});

app.post('/cart/remove', async (req, res) => {
  console.log("🚨 Received form data:", req.body);

  try {
    if (!req.isAuthenticated()) {
      return res.redirect('/users/login');
    }

    const product_id = parseInt(req.body.product_id, 10); // Convert to integer
    const user_id = req.user.id;

    if (!product_id || isNaN(product_id)) {
      console.log("🚨 Error: product_id is missing or not a number", product_id);
      return res.status(400).send("Invalid product ID");
    }

    await pool.query(
      `DELETE FROM cart_items 
      WHERE product_id = $1 
      AND cart_id = (SELECT id FROM carts WHERE user_id = $2)`,
      [product_id, user_id]
    );

    res.redirect('/users/cart');
  } catch (err) {
    console.error("🚨 Error removing product:", err);
    res.status(500).send('Server Error');
  }
});

app.get('/users/product/:id', checkNotAuthenticated, async (req, res) => {
  try {
    // Get product ID from URL
    const productId = req.params.id;

    const result = await pool.query('SELECT * FROM products WHERE id = $1', [productId]);

    if (result.rows.length === 0) {
      return res.status(404).send('Product not found');
    }

    const product = result.rows[0];

    // Format price
    product.price = Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    res.render('product', { product, user: req.user.name, email: req.user.email });
    
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

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