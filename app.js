var express = require("express"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer");

var app = express();

app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(express.static("public"));

mongoose.connect('mongodb+srv://tbeachley:%26G4A6t0CtV%25m@cluster0-ifhgm.mongodb.net/restful_blog_app?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log('Connected to DB!');
}).catch(err => {
	console.log('ERROR: ', err.message);
});

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// ROOT ROUTE
app.get("/", function(req, res) {
    res.redirect("/blogs");
});

// INDEX ROUTE
app.get("/blogs", function(req, res) {
    Blog.find({}, function(err, blogs) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("index", { blogs: blogs });
        }
    });
});

// NEW ROUTE
app.get("/blogs/new", function(req, res) {
    res.render("new");
});

// CREATE ROUTE
app.post("/blogs", function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, blog) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("CREATED");
            console.log(blog);
            res.redirect("/blogs");
        }
    });
})

// SHOW ROUTE
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, blog) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("show", { blog: blog });
        }
    });
});

// EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, blog) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("edit", { blog: blog });
        }
    });
});

// UPDATE ROUTE
app.put("/blogs/:id", function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, blog) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// DESTROY ROUTE
app.delete("/blogs/:id", function(req, res) {
    Blog.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/blogs");
        }
    });
});

app.listen(3000, function() {
    console.log("Listening on port 3000...");
});
