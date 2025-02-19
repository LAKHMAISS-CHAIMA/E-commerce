const express = require("express");
const Produit = require("../models/produit.js");
const router = express.Router();


router.post("/", async (req, res) => {
    try {
        const produit = new Produit({
            nom: req.body.nom,
            prix: req.body.prix,
            image: req.file ? `/uploads/${req.file.images}` : null 
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


router.put("/:id", async (req, res) => {
    try {
        const { image, titre, description, prix, stock } = req.body;

      
        if (!image || !titre || !description || prix == null || stock == null) {
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
