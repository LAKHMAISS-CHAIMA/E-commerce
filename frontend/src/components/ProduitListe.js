import React, { useState, useEffect } from "react";
import axios from "axios";
import { gsap } from "gsap";

export default function ProduitListe() {
    const [produits, setProduits] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);
    const [notification, setNotification] = useState("");
    const [formData, setFormData] = useState({
        titre: "",
        description: "",
        prix: "",
        stock: "",
        image: null,
    });
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        gsap.fromTo(".table-container", { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" });
        gsap.fromTo(".table-row", { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 1, stagger: 0.2, ease: "power2.out" });
        fetchProduits();
    }, []);

    const fetchProduits = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/produits", {
                headers: { "Accept": "application/json" },
                timeout: 5000
            });
            setProduits(response.data);
            setTimeout(() => {
                gsap.fromTo(".table-row", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, stagger: 0.2 });
            }, 200);
        } catch (err) {
            setError("Erreur de connexion au serveur. Assurez-vous que votre backend est en cours d'exécution.");
            console.error("Erreur Axios:", err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/produits/${id}`);
            setProduits(produits.filter(produit => produit._id !== id));
            setNotification("Produit supprimé avec succès!");
            setTimeout(() => setNotification(""), 3000);
        } catch (err) {
            setError("Erreur lors de la suppression du produit.");
            console.error(err);
        }
    };

    return (
        <div className="bg-blue-100 p-6 min-h-screen flex flex-col items-center">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">Liste des produits</h2>
            {loading ? <p className="text-gray-600">Chargement...</p> : error && <p className="text-red-500">{error}</p>}
            {notification && <p className="text-green-500">{notification}</p>}
            <div className="table-container w-full max-w-5xl bg-white shadow-xl rounded-lg p-6">
                <table className="table-auto w-full border-collapse border border-gray-300 shadow-md">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-3">Image</th>
                            <th className="border p-3">Titre</th>
                            <th className="border p-3">Prix</th>
                            <th className="border p-3">Stock</th>
                            <th className="border p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {produits.map((produit) => (
                            <tr key={produit._id} className="border table-row">
                                <td className="border p-3 text-center">
                                    <img src={`http://localhost:5000/images/${produit.image}`} alt={produit.titre} className="h-16 w-auto mx-auto rounded-lg shadow-md" />
                                </td>
                                <td className="border p-3 text-center">{produit.titre}</td>
                                <td className="border p-3 text-center">{produit.prix} DH</td>
                                <td className="border p-3 text-center">{produit.stock}</td>
                                <td className="border p-3 text-center space-x-2">
                                    <button className="bg-yellow-500 hover:bg-yellow-400 text-white px-4 py-2 rounded-lg shadow-md">Modifier</button>
                                    <button onClick={() => handleDelete(produit._id)} className="bg-red-600 hover:bg-red-400 text-white px-4 py-2 rounded-lg shadow-md">Supprimer</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
