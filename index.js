import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import mongoose from 'mongoose';
import usr_post from './models/usr_post.js';

const app = express();
const port = 3000;
const uri = "mongodb+srv://root:Cassandra12@cluster0.6uhtjk8.mongodb.net/nodeApi?retryWrites=true&w=majority&appName=Cluster0";

// Set up middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/img/uploads');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }
}).single('picture');

// Custom middleware for form submission and file upload
const handleFormSubmission = async(req, res, next) => {
    upload(req, res, async(err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error uploading file.');
        }
        
        const { caption, hashtags } = req.body;
        const pictureFileName = req.file.filename;
        req.picturePath = `/img/uploads/${pictureFileName}`;

        next(); // Proceed to the next middleware or route handler
    });
};

// View engine setup
app.set("view engine", "ejs");

// Routes
app.get("/", (req, res) => {
    res.render("index", { picturePath: '', caption: '', hashtags: '' });
});

app.get("/messages", (req, res) => {
    res.render("messages");
});

app.get("/profile", (req, res) => {
    res.render("profile");
});

app.get("/post", (req, res) => {
    res.render("post");
});

// Handle form submission and file upload
app.post("/upload", handleFormSubmission, async(req, res) => {
    const { caption, hashtags } = req.body;
    const picturePath = req.picturePath;

    try {
        const newPost = await usr_post.create({
            caption: caption,
            hashtags: hashtags,
            picturePath: picturePath,
        });

        res.render("index", { picturePath, caption, hashtags });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
mongoose.connect(uri)
    .then(() => {
        app.listen(port, () => {
            console.log(`Server started on port ${port}`);
        });
        console.log("Connected to MongoDB database");
    })
    .catch((err) => {
        console.error(err);
    });
