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

cloudinary.config({
  cloud_name: 'dnec2tgvq',
  api_key: '244459785948447',
  api_secret: 'JS0jza-oPnXSVUJEzn9qc1lrDTk',
  secure: true
});


app.use(express.static('public'));
app.set('view engine', 'ejs');

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

app.get('/shop', (req, res) => {
  store_service.getPublishedItems()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      return { 'message': err };
    });
});

app.get('/items', (req, res) => {
  const category = req.query.category;
  const minDate = req.query.minDate;

  if (category) {
    store_service.getItemsByCategory(category)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  } else if (minDate) {
    store_service.getItemsByMinDate(minDate)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  } else {
    store_service.getAllItems()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.status(500).json({ message: err });
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
      res.json(data);
    })
    .catch((err) => {
      return { 'message': err };
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
