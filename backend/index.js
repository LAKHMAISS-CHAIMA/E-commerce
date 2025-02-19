const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 5000;

// Configuration de multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/images')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  
  
const upload = multer({ storage: storage });

app.use(express.json());
app.use(cors());


mongoose.connect('mongodb://127.0.0.1:27017/produits')
    .then(() => {
        console.log('Connected to mongoDB');
    })
    .catch((err) => console.log(err));

const produitRoutes = require("./routes/produits");
app.use("/api/produits", produitRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));