import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ProduitListe() {
    const [produits, setProduits] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        titre: "",
        description: "",
        prix: "",
        stock: "",
        image: ""
    });

    useEffect(() => {
        const fetchProduits = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/produits');
                setProduits(response.data);
            } catch (err) {
                setError("Erreur lors de la récupération des produits.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduits();
    }, []);

    const handleEdit = (produit) => {
        setEditingProduct(produit._id);
        setFormData({
            titre: produit.titre,
            description: produit.description,
            prix: produit.prix,
            stock: produit.stock,
            image: produit.image 
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:5000/api/produits/${editingProduct}`, formData);
            setProduits(produits.map(prod => (prod._id === editingProduct ? response.data : prod)));
            setEditingProduct(null);
            setFormData({ titre: "", description: "", prix: "", stock: "", image: "" }); 
        } catch (err) {
            setError("Erreur lors de la mise à jour du produit.");
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/produits/${id}`);
            setProduits(produits.filter(produit => produit._id !== id));
        } catch (err) {
            setError("Erreur lors de la suppression du produit.");
            console.error(err);
        }
    };

    return (
        <div className="bg-pink-50 bg-auto mt-9">
            <h2 className="text-xl font-bold text-center mb-9 text-current underline decoration-pink-500">Liste des produits</h2>
            {loading ? <p>Chargement...</p> : error && <p className="text-red-500">{error}</p>}
            {editingProduct && (
                <div className="mt-4 p-4 border">
                    <h3 className="font-semibold">Modifier le produit</h3>
                    <form onSubmit={handleUpdate} >
                        <input
                            type="text"
                            placeholder="Titre"
                            value={formData.titre}
                            onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                            className="border p-2 mb-2 w-full"
                            required
                        />
                        <textarea
                            placeholder="Description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="border p-2 mb-2 w-full"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Prix"
                            value={formData.prix}
                            onChange={(e) => setFormData({ ...formData, prix: e.target.value })}
                            className="border p-2 mb-2 w-full"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Stock"
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            className="border p-2 mb-2 w-full"
                            required
                        />
                        <button type="submit" className="bg-blue-500 text-white p-1">Mettre à jour le produit</button>
                        <button type="button" onClick={() => setEditingProduct(null)} className="bg-gray-500 text-white p-1 ml-2">Annuler</button>
                    </form>
                </div>
            )}
            <table className="table-auto w-full w-full p-6 bg-white shadow-md rounded-xl">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border">Titre</th>
                        <th className="px-4 py-2 border">Prix</th>
                        <th className="px-4 py-2 border">Stock</th>
                        <th className="px-4 py-2 border">Description</th>
                        <th className="px-4 py-2 border">Image</th>
                        <th className="px-4 py-2 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {produits.map(produit => (
                        <tr key={produit._id}>
                            <td className="px-4 py-2 border">{produit.titre}</td>
                            <td className="px-4 py-2 border">{produit.prix}€</td>
                            <td className="px-4 py-2 border">{produit.stock}</td>
                            <td className="px-4 py-2 border">{produit.description}</td>
                            <td className="px-4 py-2 border">
                            <img src={`http://localhost:5000${produit.image}`} alt={produit.nom} className="h-16 w-auto mx-auto" />
                            </td>
                            <td className="px-4 py-2 border space-x-4">
                                <button onClick={() => handleEdit(produit)} className="bg-yellow-500 text-white p-2 rounded-lg">Modifier</button>
                                <button onClick={() => handleDelete(produit._id)} className="bg-pink-900 hover:bg-pink-400 text-white p-2 rounded-lg">Supprimer</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}