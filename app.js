const express = require("express");
const ejs = require("ejs");
const multer = require("multer");
const bodyparser = require("body-parser");
const path = require("path");
const shortid = require('shortid');
var cors = require('cors')
var sleep = require('system-sleep');
const {spawn} = require("child_process");
var NI ; 
var F = 1;

const app = express();
const port = process.env.PORT || 3000;
app.use(cors())

//set for ejs
app.set("view engine", "ejs");
// static folder
app.use(express.static("./public"));

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
      if(F==1)
      {
        NI = shortid.generate();
        F = 0;
      }
      cb(null, file.fieldname + '-' + NI + path.extname(file.originalname))
    }
  })
   
var upload = multer({ storage: storage })

var cpUpload = upload.fields(
[
{ name: 'F1' }, 
{ name: 'F2', maxCount:  1 }, 
{ name: 'F3', maxCount: 1 },
{ name: 'F4', maxCount: 1 },
{ name: 'F5', maxCount: 1 },
{ name: 'Files', maxCount: 15 }
]
)

//Middleware for bodyparser
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());


//actual routes
app.get("/", (req, res) => {
    F = 1;
    res.render("index");
});

app.get("/Work", (req, res) => {
    F = 1;
    res.render("Work");
});


app.get("/Features", (req, res) => {
    F = 1;
    res.render("features");
});



app.post("/uploadfile", cpUpload,(req, res,next,) => {
    console.log("Dekiho");
    
    if(req.files)
    {
        console.log(req.files);
        console.log("Successfully uploaded");
    }
    const A = 1;
    const B = 2;
    console.log('Answer ',A,"+",B,"=")


    const python = spawn('python',["Predict.py", NI, B]);
    var Json={}
    python.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
        const Temp = data.toString();
        Json = JSON.parse(Temp);
        console.log(Json);
        console.log(NI);
        res.render("test",{"prob":[Json.P1,Json.P2,Json.P3]});
    });

});

app.get("/u001",(req,res) =>{
    res.json({"prob":[1,3,5]});
});

app.get("/Contact",(req,res) =>{
    res.render("Contact");
});
app.get("/test",(req,res) =>{
    res.render("test");
});

app.listen(port, () => console.log(`App is running at ${port}`));