/*********************************************************************************

WEB322 – Assignment 03
I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source (including 3rd party web sites) or distributed to other students.

Name: Shubh Jani 
Student ID: 153660212 
Date: 16 June 2023
Cyclic Web App URL:   https://fair-long-underwear-eel.cyclic.app/
GitHub Repository URL: https://github.com/sjani5/web322-app.git

********************************************************************************/ 

const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const store_service = require('./store-service');
const upload = multer({ dest: 'uploads/'}); // no { storage: storage }
const app = express();
const port = process.env.PORT || 8080;
const exphbs = require('express-handlebars');

app.use(function(req,res,next){
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

const handlebars = require('handlebars');
handlebars.registerHelper('navLink', function(url, options) {
  return (
    '<li class="nav-item">' +
    (url == app.locals.activeroute ?
      '<a class="nav-link active" href="' + url + '">' + options.fn(this) + '</a>' :
      '<a class="nav-link" href="' + url + '">' + options.fn(this) + '</a>'
    ) +
    '</li>'
  );
});

handlebars.registerHelper('equal', function(lvalue, rvalue, options) {
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
  if (req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    async function upload(req) {
      let result = await streamUpload(req);
      console.log(result);
      return result;
    }

    upload(req)
      .then((uploaded) => {
        processItem(uploaded.url);
      })
      .catch((error) => {
        console.log(error);
        processItem("");
      });
  } else {
    processItem("");
  }

  function processItem(imageUrl) {
    req.body.featureImage = imageUrl;

    // TODO: Process the req.body and add it as a new Item before redirecting to /items
    store_service.addItem(req.body)
      .then(() => {
        res.redirect('/items');
      })
      .catch((error) => {
        console.log(error);
        res.redirect('/items');
      });
  }
});

app.get('/', (req, res) => {
  res.redirect("/about");
});

app.get('/about', (req, res) => {
  res.sendFile(__dirname + "/views/about.html");
});


app.get("/shop", async (req, res) => {
  let viewData = {};

  try {
    let items = [];

    if (req.query.category) {
      items = await itemData.getPublishedItemsByCategory(req.query.category);
    } else {
      items = await itemData.getPublishedItems();
    }

    items.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));

    let post = items[0];

    viewData.items = items;
    viewData.item = item;
  } catch (err) {
    viewData.message = "no results";
  }

  try {
    let categories = await itemData.getCategories();

    viewData.categories = categories;
  } catch (err) {
    viewData.categoriesMessage = "no results";
  }

  res.render("shop", { data: viewData });
});



app.get('/items', (req, res) => {
  const re = /^A/;
  const q = req.query.q; 
  const category = re
  app.get('/shop/:id', async (req, res) => {
  
    // Declare an object to store properties for the view
    let viewData = {};
  
    try{
  
        // declare empty array to hold "item" objects
        let items = [];
  
        // if there's a "category" query, filter the returned posts by category
        if(req.query.category){
            // Obtain the published "posts" by category
            items = await itemData.getPublishedItemsByCategory(req.query.category);
        }else{
            // Obtain the published "posts"
            items = await itemData.getPublishedItems();
        }
  
        // sort the published items by postDate
        items.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));
  
        // store the "items" and "item" data in the viewData object (to be passed to the view)
        viewData.items = items;
  
    }catch(err){
        viewData.message = "no results";
    }
  
    try{
        // Obtain the item by "id"
        viewData.item = await itemData.getItemById(req.params.id);
    }catch(err){
        viewData.message = "no results"; 
    }
  
    try{
        // Obtain the full list of "categories"
        let categories = await itemData.getCategories();
  
        // store the "categories" data in the viewData object (to be passed to the view)
        viewData.categories = categories;
    }catch(err){
        viewData.categoriesMessage = "no results"
    }
  
    // render the "shop" view with all of the data (viewData)
    res.render("shop", {data: viewData})
  });q.query.category;

  const minDate = req.query.minDate;

  if (category) {
    store_service.getItemsByCategory(category)
      .then((data) => {
        res.render('items', { items: data });
      })
      .catch((err) => {
        res.render('items', { message: 'no results' });
      });
  } else if (minDate) {
    store_service.getItemsByMinDate(minDate)
      .then((data) => {
        res.render('items', { items: data });
      })
      .catch((err) => {
        res.render('items', { message: 'no results' });
      });
  } else {
    store_service.getAllItems()
      .then((data) => {
        res.render('items', { items: data });
      })
      .catch((err) => {
        res.render('items', { message: 'no results' });
      });
  }
});

app.get('/item/:id', (req, res) => {
  const itemId = parseInt(req.params.id);

  store_service.getItemById(itemId)
    .then((item) => {
      if (item) {
        res.json(item);
      } else {
        res.status(404).json({ message: 'Item not found' });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

app.get('/categories', (req, res) => {
  store_service.getCategories()
    .then((data) => {
      res.render('categories', { categories: data });
    })
    .catch((err) => {
      res.render('categories', { message: 'no categories' });
    });
});

app.get('*', (req, res) => {
  res.send('Page not found, check URL', 404);
});

function onHTTPstart() {
  console.log("Server started on port: " + port);
}

store_service.initialize()
  .then(() => {
    app.listen(port, onHTTPstart);
  })
  .catch((err) => {
    console.log("Unable to start: " + err);
  });

app.use((req, res) => {
  res.status(404).send("Page does not exist");
});