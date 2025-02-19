const mongoose = require("mongoose");

const produitSchema = new mongoose.Schema({
    image:{
        type: String,
        required: true,
    },
    titre:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    prix:{
        type: Number,
        required: true,
        min: 0,
    },
    stock:{
        type: Number,
        required: true,
        min: 0,
    }
});

const produitModel = mongoose.model('Produit', produitSchema);

module.exports = produitModel;