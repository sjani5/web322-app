/*********************************************************************************

WEB322 – Assignment 02
I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source (including 3rd party web sites) or distributed to other students.

Name: Shubh Jani 
Student ID: 153660212 
Date: 2 June 2023
Cyclic Web App URL:  https://long-puce-cobra-hose.cyclic.app
GitHub Repository URL: https://github.com/sjani5/web322-app.git

********************************************************************************/ 


const express = require('express')
const store_service = require('./store-service')
const app = express()
const port = process.env.PORT || 8080

app.use(express.static('public')); 
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.redirect("/about")
});

app.get('/about', (req, res) => {
    res.sendFile(__dirname + "/views/about.html")
  });

app.get('/shop', (req, res) => {
  store_service.getPublishedItems().then((data)=>{
    res.json(data)
  }).catch((err)=>{
    return {'message': err}
  })
});

app.get('/items', (req, res) => {
  store_service.getAllItems().then((data)=>{
    res.json(data)
  }).catch((err)=>{
    return {'message': err}
  })
});

app.get('/categories', (req, res) => {
    store_service.getCategories().then((data)=>{
      res.json(data)
    }).catch((err)=>{
      return {'message': err}
    })
  });


  app.get('*', function(req, res){
    res.send('Page not found, check URL', 404);
  });



function onHTTPstart(){
  console.log("server started on port: " + port)
}

store_service.initialize().then(function(){
  app.listen(port,onHTTPstart);
}).catch(function(err){
  console.log("unable to start" + err)
})


app.use((req,res)=>{
  res.status(404).send("Page does not exist")
})
