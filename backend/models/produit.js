const mongoose = require("mongoose");

const produitSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
    },
    titre: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    prix: {
        type: Number,
        required: true,
        min: [0, "Le prix doit être un nombre positif."],
        validate: {
            validator: (v) => v >= 0,
            message: "Le prix ne peut pas être négatif."
        }
    },
    stock: {
        type: Number,
        required: true,
        min: [0, "Le stock doit être un nombre positif."]
    }
});

const produitModel = mongoose.model('Produit', produitSchema);

module.exports = produitModel;