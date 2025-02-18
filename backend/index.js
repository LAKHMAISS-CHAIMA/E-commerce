const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// require("dotenv").config();

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/produits').then(()=>{
    console.log('Connected to mongoDB');
}).catch((err)=>console.log(err));

const produitRoutes = require("./routes/produits");
app.use("/api/produits", produitRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));