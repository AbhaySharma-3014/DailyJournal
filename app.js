//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");
// const {MongoClient} =require("mongodb");

const homeStartingContent = "";
const aboutContent = "";
const contactContent = "";
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-abhay:test123@cluster0.ho7x9.mongodb.net/blogDB", {useNewUrlParser: true});


const postSchema = {
 title: String,
 content: String
};

// let posts = [];
const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      postArray: posts
      });
  });

});

app.get("/compose",function(req,res){
  res.render("compose");
});


app.post("/compose",function(req,res){
  // console.log(req.body.postTitle);
  // const post = {
  //   title: req.body.postTitle,
  //   content: req.body.postBody
  // };

  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody

  });

  post.save();
  res.redirect("/");

});



app.get("/posts/:postId",function(req,res){
  // const requestedTitle = _.lowerCase(req.params.postName);
  const requestedPostId = req.params.postId;
  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
   });
 });

  // posts.forEach(function(post){
  //   const storedTitle= _.lowerCase(post.title);
  //
  //   if(storedTitle===requestedTitle){
  //     // console.log("Match Found!");
  //     res.render("post",{
  //       title:post.title,
  //       content:post.content
  //     })
  //
  //   }
  //
  // })
});

const uri="mongodb+srv://admin-abhay:test123@cluster0.ho7x9.mongodb.net/blogDB";
var MongoClient = require('mongodb').MongoClient;


app.get("/del/:postId",function(req,res){
  // const requestedTitle = _.lowerCase(req.params.postName);
  const requestedPostId = req.params.postId;
  console.log(requestedPostId);
  Post.findOne({_id: requestedPostId}, function(err, post){
      // console.log(post.title);
      MongoClient.connect(uri, function(err, db) {
        if (err) throw err;
        var dbo = db.db("blogDB");
        var myquery = { title: post.title};
        dbo.collection("posts").deleteOne(myquery, function(err, obj) {
          if (err) throw err;
          console.log("1 document deleted");
          db.close();
          res.redirect("/");
        });
      });
   });
   // location.reload();
   // res.redirect("/");
 });

app.get("/contact",function(req,res){
  res.render("contact",{contactCon : contactContent});
});

app.get("/about",function(req,res){
  res.render("about",{aboutCon : aboutContent});
});


//Hosting Section
let port=process.env.PORT;
if(port==null ||port==""){
  port=3000;
}

app.listen(port, function() {
  console.log("Server has started on port succesfully");
});
