import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import mongoose from 'mongoose';
import usr_post from './models/usr_post'

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
        res.send('Error uploading file.');
      } else {
        // Access form fields
        const caption = req.body.caption;
        const hashtags = req.body.hashtags;
        // Access uploaded file details
        const pictureFileName = req.file.filename;
        const picturePath = `/img/uploads/${pictureFileName}`
        const new_usr_post = await usr_post.create({
          caption: caption,
          hastags: hashtags,
          picturePath: picturePath,
        })
        // Perform further processing (e.g., save to database)
        // For now, just render the index page with the new data
        res.render("index", { picturePath, caption, hashtags });
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