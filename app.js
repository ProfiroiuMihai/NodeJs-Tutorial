const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');

const app = express();

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images');
    },
    filename: (req, file, cb) => {
      cb(null, new Date().toISOString() + '-' + file.originalname);
    },
  });
  
  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

  const upload = multer({ storage: fileStorage, 
    fileFilter: fileFilter });
  

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

app.use(upload.array('image'));
// app.use(
//     upload.single('image')
//   );

app.use('/images', express.static(path.join(__dirname, 'images')))

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin',"*")
    res.setHeader('Access-Control-Allow-Methods',"GET, POST, PUT ")
    res.setHeader('Access-Control-Allow-Headers',"Content-Type, Authorization")
    next()
})

app.use('/feed',feedRoutes);
app.use('/auth',authRoutes);
app.use('/admin',adminRoutes);

mongoose.connect('mongodb+srv://profiroiu:profiroiu@cluster0-efvob.mongodb.net/test?retryWrites=true&w=majority',{useUnifiedTopology: true,
useNewUrlParser: true})
.then(result=>{
    app.listen(8080);
})
.catch(err=>{
    console.log(err)
})
