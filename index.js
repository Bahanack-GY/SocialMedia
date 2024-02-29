import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import mongoose from 'mongoose';
import usr_post from './models/usr_post.js';


const app = express();
const port = 3000;
const uri = "mongodb+srv://root:Cassandra12@cluster0.6uhtjk8.mongodb.net/nodeApi?retryWrites=true&w=majority&appName=Cluster0";

let picturePath = '';
let caption = '';
let hashtags = '';

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'public/img/uploads'); // Define the destination directory for uploaded files
    },
    filename: function(req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Define the file name
    }
  });
  // Initialize multer
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // Set file size limit (optional)
  }).single('picture'); // 'picture' is the name attribute of the file input field in your form
  
app.use(express.static("public"));

app.set("view engine", "ejs");


app.get("/",(req,res) =>{
    res.render("index", { picturePath, caption, hashtags });
});
app.get("/messages",(req,res) =>{
    res.render("messages");
});
app.get("/profile",(req,res) =>{
    res.render("profile");
});
app.get("/post",(req,res) =>{
    res.render("post");
});
// Handle form submission and file upload
app.post("/upload", async(req, res) => {
  upload(req, res, async(err) => {
      if(err) {
          console.error(err);
          return res.send('Error uploading file.');
      }
      
      // Access form fields and uploaded file details
      const caption = req.body.caption;
      const hashtags = req.body.hashtags;
      const pictureFileName = req.file.filename;
      const picturePath = `/img/uploads/${pictureFileName}`;

      try {
          // Create a new user post in the database
          const newPost = await usr_post.create({
              caption: caption,
              hashtags: hashtags,
              picturePath: picturePath,
          });

          // Render the index page with the new data
          res.render("index", { picturePath, caption, hashtags });
      } catch (error) {
          console.error(error);
          res.status(500).send('Internal Server Error');
      }
  });
});

mongoose.connect(uri)
.then(()=>{
  app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
});
  console.log("Connected to mongoDB database");
}).catch((err)=>{
  console.log(err);
})