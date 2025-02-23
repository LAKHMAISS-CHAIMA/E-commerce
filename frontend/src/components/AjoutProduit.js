import React, { useState, useEffect } from "react";
import axios from "axios";
import { gsap } from "gsap";

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
        <div className='bg-pink-100 min-h-screen flex items-center justify-center p-6'>
            <div className="max-w-2xl w-full bg-white shadow-xl rounded-lg p-8 form-container">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">Ajouter un produit</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex flex-col">
                            <label className="font-semibold text-gray-600">Titre:</label>
                            <input type="text" name="titre" value={formProduit.titre} onChange={handleChange} required className="bg-purple-200 p-3 border border-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800" />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-semibold text-gray-600">Description:</label>
                            <input type="text" name="description" value={formProduit.description} onChange={handleChange} required className="bg-purple-200 p-3 border border-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800" />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-semibold text-gray-600">Prix:</label>
                            <input type="number" name="prix" value={formProduit.prix} onChange={handleChange} required className="bg-purple-200 p-3 border border-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800" />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-semibold text-gray-600">Stock:</label>
                            <input type="number" name="stock" value={formProduit.stock} onChange={handleChange} required className="bg-purple-200 p-3 border border-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800" />
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <label className="font-semibold text-gray-600">Image:</label>
                        <input type="file" onChange={handleFileChange} required className="bg-gray-50 p-3 border rounded-lg shadow-sm w-full" />
                        {file && <img src={file} alt="Prévisualisation" className="mt-3 h-24 w-auto rounded-lg shadow-md" />}
                    </div>
                    <button type="submit" className="bg-pink-600 hover:bg-pink-500 text-white font-semibold p-3 rounded-lg shadow-md transform hover:scale-105 transition-transform">Ajouter</button>
                    {submitted && <p className="text-green-500 text-center mt-4">Produit ajouté avec succès !</p>}
                    {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                </form>
            </div>
        </div>
    );
}
