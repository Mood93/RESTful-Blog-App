//ALWAYS START mongod BEFORE node app.js !!!!!!!!!!!!!!!

var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose");

//APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
const PORT = process.env.PORT || 5000

//MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

//RESTful ROUTES

app.get("/", function(req, res) {
    res.redirect("/blogs");
});
//INDEX ROUTE
app.get("/blogs", function(req, res) {
    Blog.find({}, function(err, blogs) {
        err ? console.log("ERROR!") : res.render("index", {blogs: blogs});
    });
});

//NEW ROUTE
app.get("/blogs/new", function(req, res) {
    res.render("new");
});


//CREATE ROUTE
app.post("/blogs", function(req, res) {
    //create blog
    Blog.create(req.body.blog, function(err, newBlog) {
        err ? res.render("new") : res.redirect("/blogs");
    })
    //redirect
});

//SHOW ROUTE
app.get("/blogs/:id", function (req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        err ? res.redirect("/blogs") : res.render("show", {blog: foundBlog});
    })
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
