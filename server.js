/*********************************************************************************

WEB322 – Assignment 05
I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
of this assignment has been copied manually or electronically from any other source (including 3rd party web sites) or distributed to other students.

Name: Shubh Jani
Student ID: 153660212
Date: 14 August 2023
Cyclic Web App URL: https://fair-long-underwear-eel.cyclic.app/
GitHub Repository URL: https://github.com/sjani5/web322-app.git

********************************************************************************/

const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const { initialize } = require('./store-service');
const upload = multer({ dest: 'uploads/' }); // no { storage: storage }
const app = express();
const port = process.env.PORT || 8080;
const exphbs = require('express-handlebars');

app.use(express.urlencoded({ extended: true })); // Add the urlencoded middleware

app.use(function (req, res, next) {
  let route = req.path.substring(1);
  app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
  app.locals.viewingCategory = req.query.category;
  next();
});

app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs'
}));
app.set('view engine', 'hbs');


initialize();


const handlebars = require('handlebars');
handlebars.registerHelper('navLink', function (url, options) {
  return (
    '<li class="nav-item">' +
    (url == app.locals.activeroute ?
      '<a class="nav-link active" href="' + url + '">' + options.fn(this) + '</a>' :
      '<a class="nav-link" href="' + url + '">' + options.fn(this) + '</a>'
    ) +
    '</li>'
  );
});

handlebars.registerHelper('equal', function (lvalue, rvalue, options) {
  if (arguments.length < 3)
    throw new Error("Handlebars Helper equal needs 2 parameters");
  if (lvalue != rvalue) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
});

cloudinary.config({
  cloud_name: 'dnec2tgvq',
  api_key: '244459785948447',
  api_secret: 'JS0jza-oPnXSVUJEzn9qc1lrDTk',
  secure: true
});

app.get('/about', (req, res) => {
  res.render('about.hbs');
});

app.use(express.static('public'));
app.set('view engine', 'hbs');

// Route to serve "/views/addItem.html"
app.get('/items/add', (req, res) => {
  res.sendFile(__dirname + "/views/addItem.html");
});

app.post('/items/add', upload.single('featureImage'), (req, res) => {
  // ... (existing code for adding an item)
});

app.get('/', (req, res) => {
  res.redirect("/about");
});

app.get('/about', (req, res) => {
  res.sendFile(__dirname + "/views/about.html");
});

app.get("/shop", async (req, res) => {
  // ... (existing code for rendering the shop view)
});

app.get('/items', (req, res) => {
  // ... (existing code for rendering the items view)
});

app.get('/item/:id', (req, res) => {
  // ... (existing code for getting an item by id)
});

app.get('../views/categories', (req, res) => {
  // ... (existing code for rendering the categories view)
});

// Route to serve "/views/addCategory.html"
app.get('../views/categories/add', (req, res) => {
  res.sendFile(__dirname + "/views/addCategory.html");
});

app.post('../views/categories/add', (req, res) => {
  // Process the req.body and add it as a new Category before redirecting to /categories
  store_service.addCategory(req.body)
    .then(() => {
      res.redirect('s/categories');
    })
    .catch((error) => {
      console.log(error);
      res.redirect('/categories');
    });
});

// Route to delete a Category by its id
app.post('/categories/delete/:id', (req, res) => {
  const categoryId = parseInt(req.params.id);
  store_service.deleteCategoryById(categoryId)
    .then(() => {
      res.redirect('/categories');
    })
    .catch((error) => {
      console.log(error);
      res.redirect('/categories');
    });
});

// Route to delete an Item by its id
app.post('/items/delete/:id', (req, res) => {
  const itemId = parseInt(req.params.id);
  store_service.deletePostById(itemId)
    .then(() => {
      res.redirect('../views/items');
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Unable to Remove Post / Post not found");
    });
});

function onHTTPstart() {
  console.log("Server started on port: " + port);
}

initialize()
  .then(() => {
    app.listen(port, onHTTPstart);
  })
  .catch((err) => {
    console.log("Unable to start: " + err);
  });

app.use((req, res) => {
  res.status(404).send("Page does not exist");
});
