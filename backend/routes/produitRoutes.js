const express = require("express");
const multer = require("multer");
const Produit = require("../models/Produit.js");
const router = express.Router();
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = "images/";
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-';
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post("/", upload.single('image'), async (req, res) => {
    try {
        if (!req.body.titre || !req.body.prix || !req.body.description || req.body.stock == null) {
            return res.status(400).json({ message: "Tous les champs sont requis." });
        }

        const produit = new Produit({
            titre: req.body.titre,
            prix: req.body.prix,
            description: req.body.description,
            stock: req.body.stock,
            image: req.file ? `images/${req.file.filename}` : "",
        });

        await produit.save();
        res.status(201).json(produit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const produits = await Produit.find();
        res.json(produits);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des produits" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const produit = await Produit.findByIdAndDelete(req.params.id);
        if (!produit) {
            return res.status(404).json({ error: "Produit non trouvé" });
        }
        res.json({ message: "Produit supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la suppression", details: error.message });
    }
});

router.put("/:id", upload.single('image'), async (req, res) => {
    try {
        const { titre, description, prix, stock } = req.body;
        let image = req.body.image;

        if (req.file) {
            image = `images/${req.file.filename}`;
        }

        if (!titre || !description || prix == null || stock == null) {
            return res.status(400).json({ error: "Tous les champs sont requis pour la mise à jour." });
        }

        const produitUpdated = await Produit.findByIdAndUpdate(
            req.params.id,
            { image, titre, description, prix, stock },
            { new: true }
        );

        if (!produitUpdated) {
            return res.status(404).json({ error: "Produit non trouvé" });
        }

        res.json({ message: "Produit mis à jour avec succès", produit: produitUpdated });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la mise à jour", details: error.message });
    }
});

module.exports = router;
