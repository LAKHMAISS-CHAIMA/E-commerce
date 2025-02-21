import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";

import axios from 'axios';
import { gsap } from 'gsap';

export default function AjoutProduit({ onProductAdded }) {
    const [formProduit, setFormProduit] = useState({
        image: "",
        titre: "",
        description: "",
        prix: "",
        stock: "",
    });
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");
    const [file, setFile] = useState(null);

    useEffect(() => {
        gsap.fromTo(".form-container", { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" });
    }, []);

    const handleChange = (e) => {
        setFormProduit({ ...formProduit, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(URL.createObjectURL(selectedFile));
            setFormProduit((prev) => ({ ...prev, image: selectedFile }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { image, titre, description, prix, stock } = formProduit;

        if (!image || !titre || !description || !prix || !stock) {
            setError("Veuillez remplir tous les champs.");
            setSubmitted(false);
            return;
        }

        const formData = new FormData();
        formData.append('image', image);
        formData.append('titre', titre);
        formData.append('description', description);
        formData.append('prix', prix);
        formData.append('stock', stock);

        try {
            const response = await axios.post('http://localhost:5000/api/produits', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.status === 201) {
                setSubmitted(true);
                setError("");
                console.log("Données envoyées avec succès :", response.data);
                setFormProduit({ image: "", titre: "", description: "", prix: "", stock: "" });
                setFile(null);

                if (onProductAdded) onProductAdded(response.data);
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi du formulaire :", error.response ? error.response.data : error);
            setError("Une erreur est survenue lors de l'envoi du produit.");
            setSubmitted(false);
        }
    };

    return (
        <div className='bg-pink-50 bg-auto'>
            <h2 className="text-xl font-bold text-center mb-9 text-current underline decoration-pink-500">Ajouter un produit</h2>
            <form onSubmit={handleSubmit} className="form-container flex flex-col gap-6 w-full p-6 bg-white shadow-md rounded-xl">
                <div className="grid grid-cols-2 gap-10">
                    <div className="flex flex-col">
                        <label className="font-bold text-slate-600">Titre:</label>
                        <input
                            type="text"
                            name="titre"
                            value={formProduit.titre}
                            onChange={handleChange}
                            required
                            className="bg-purple-500 p-2 border border-black opacity-50 rounded-xl shadow-md text-center"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-bold text-slate-600">Description:</label>
                        <input
                            type="text"
                            name="description"
                            value={formProduit.description}
                            onChange={handleChange}
                            required
                            className="bg-purple-500 p-2 border border-black opacity-50 rounded-xl shadow-md text-center"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-bold text-slate-600">Prix:</label>
                        <input
                            type="number"
                            name="prix"
                            value={formProduit.prix}
                            onChange={handleChange}
                            required
                            className="bg-purple-500 p-2 border border-black opacity-50 rounded-xl shadow-md text-center"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-bold text-slate-600">Stock:</label>
                        <input
                            type="number"
                            name="stock"
                            value={formProduit.stock}
                            onChange={handleChange}
                            required
                            className="bg-purple-500 p-2 border border-black opacity-50 rounded-xl shadow-md text-center"
                        />
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <label className="font-bold text-slate-600">Image:</label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        required
                        className="bg-gray-50 p-2 border rounded-xl w-72"
                    />
                    {file && <img src={file} alt="Prévisualisation" className="mt-2 h-16 w-auto mx-auto rounded-lg shadow" />}
                </div>

                <div className="w-full flex justify-center mt-4">
                    <button type="submit" className="bg-pink-600 hover:bg-pink-400 text-white p-2 rounded-lg w-32 shadow-md shadow-pink-500/50">Ajouter</button>
                    {submitted && <p className="text-green-500 text-center">Produit ajouté avec succès !</p>}
                </div>
            </form>

            {error && <p className="text-red-500 text-center">{error}</p>}
        </div>
    );
}
