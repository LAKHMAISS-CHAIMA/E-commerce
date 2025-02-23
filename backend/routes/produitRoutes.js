const express = require("express");
const Produit = require("../models/produit");
const router = express.Router();
const { io } = require("../server");

router.post("/", async (req, res) => {
  try {
    const produit = new produit(req.body);
    await produit.save();
    io.emit("produit_updated", { action: "add", produit });
    res.status(201).json(produit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const produit = await produit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    io.emit("produit_updated", { action: "update", produit });
    res.json(produit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Produit.findByIdAndDelete(req.params.id);
    io.emit("produit_updated", { action: "delete", produitId: req.params.id });
    res.json({ message: "Produit supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
