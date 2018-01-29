//ALWAYS START mongod BEFORE node app.js !!!!!!!!!!!!!!!

var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer");

//APP CONFIG
var category = "_cars"; //must begin with _
mongoose.connect("mongodb://localhost/restful_blog_app" + category);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"))
const PORT = process.env.PORT || 5000;

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
        err ? console.log("ERROR!") : res.render("index", {blogs: blogs, category: category});
    });
});

//NEW ROUTE
app.get("/blogs/new", function(req, res) {
    res.render("new");
});

//CREATE ROUTE
app.post("/blogs", function(req, res) {
    //create blog
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog) {
        err ? res.render("new") : res.redirect("/blogs");
    })
    //redirect
});

//SHOW ROUTE
app.get("/blogs/:id", function (req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        err ? res.redirect("/blogs") : res.render("show", {blog: foundBlog});
    });
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        err ? res.redirect("/blogs") : res.render("edit", {blog: foundBlog});
    });
});

//UPDATE ROUTE
app.put("/blogs/:id", function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
        err ? res.redirect("/blogs") : res.redirect("/blogs/" + req.params.id);
    });
});

//DELETE ROUTE
app.delete("/blogs/:id", function(req, res) {
    Blog.findByIdAndRemove(req.params.id, function(err) {
        err ? res.redirect("/blogs") : res.redirect("/blogs") ;
    })
})

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
