const express = require("express");
const Produit = require("../models/produit.js");
const router = express.Router();


router.post("/", async (req, res) => {
    try {
        const { imageUrl, titre, description, prix, stock } = req.body;

        
        if (!imageUrl || !titre || !description || prix == null || stock == null) {
            return res.status(400).json({ error: "Tous les champs sont requis." });
        }

        const newProduit = new Produit({ imageUrl, titre, description, prix, stock });
        await newProduit.save();

        res.status(201).json({ message: "Produit ajouté avec succès", produit: newProduit });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de l'ajout du produit", details: error.message });
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
        const { imageUrl, titre, description, prix, stock } = req.body;

      
        if (!imageUrl || !titre || !description || prix == null || stock == null) {
            return res.status(400).json({ error: "Tous les champs sont requis pour la mise à jour." });
        }

        const produitUpdated = await Produit.findByIdAndUpdate(
            req.params.id,
            { imageUrl, titre, description, prix, stock },
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
