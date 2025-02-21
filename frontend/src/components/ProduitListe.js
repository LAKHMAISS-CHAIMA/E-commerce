import React, { useState, useEffect } from 'react'; 
import axios from 'axios';

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

    const fetchProduits = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/produits');
            setProduits(response.data);
        } catch (err) {
            setError("Erreur lors de la récupération des produits.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduits();
    }, []);

    const handleEdit = (produit) => {
        setEditingProduct(produit._id);
        setFormData({
            titre: produit.titre,
            description: produit.description,
            prix: produit.prix,
            stock: produit.stock,
            image: null,
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            let updatedData = new FormData();
            updatedData.append("titre", formData.titre);
            updatedData.append("description", formData.description);
            updatedData.append("prix", formData.prix);
            updatedData.append("stock", formData.stock);
            if (formData.image) {
                updatedData.append("image", formData.image);
            }

            await axios.put(`http://localhost:5000/api/produits/${editingProduct}`, updatedData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            fetchProduits();
            setNotification('Produit mis à jour avec succès!');
            setTimeout(() => setNotification(''), 3000);
            setEditingProduct(null);
        } catch (error) {
            console.error("Erreur lors de la mise à jour du produit:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/produits/${id}`);
            setProduits(produits.filter(produit => produit._id !== id));
            setNotification("Produit supprimé avec succès!");
            setTimeout(() => setNotification(''), 3000);
        } catch (err) {
            setError("Erreur lors de la suppression du produit.");
            console.error(err);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file)); // Affiche la prévisualisation de l'image
            setFormData({ ...formData, image: file }); // Met à jour l'image dans le formData
        }
    };

    return (
        <div className="bg-pink-50 bg-auto mt-9">
            {/* <AjoutProduit onProductAdded={fetchProduits} /> */}
            <h2 className="text-xl font-bold text-center mb-9 text-current underline decoration-pink-500">
                Liste des produits
            </h2>

            {loading ? <p>Chargement...</p> : error && <p className="text-red-500">{error}</p>}
            {notification && <p className="text-green-500">{notification}</p>}

            {editingProduct && (
                <div className="mt-4 p-4 border">
                    <h3 className="font-semibold">Modifier le produit</h3>
                    <form onSubmit={handleUpdate}>
                        <input
                            type="text"
                            placeholder="Titre"
                            value={formData.titre}
                            onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                            className="border p-2 mb-2 w-full rounded-lg shadow-md"
                            required
                        />
                        <textarea
                            placeholder="Description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="border p-2 mb-2 w-full rounded-lg shadow-md"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Prix"
                            value={formData.prix}
                            onChange={(e) => setFormData({ ...formData, prix: e.target.value })}
                            className="border p-2 mb-2 w-full rounded-lg shadow-md"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Stock"
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            className="border p-2 mb-2 w-full rounded-lg shadow-md"
                            required
                        />
                        
                        {/* Ajout du champ pour la prévisualisation de l'image */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Image</label>
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full p-2"
                            />
                            {imagePreview && (
                                <div className="mt-2">
                                    <label className="block text-sm font-medium text-gray-700">Aperçu</label>
                                    <img 
                                        src={imagePreview}
                                        alt="Aperçu du produit" 
                                        className="w-full h-40 object-cover rounded border mx-auto w-[30%]"
                                    />
                                </div>
                            )}
                        </div>

                        <button type="submit" className="bg-purple-500 text-black rounded-lg shadow-md p-1">
                            Mettre à jour le produit
                        </button>
                        <button type="button" onClick={() => setEditingProduct(null)} className="bg-gray-500 text-white rounded-lg shadow-md p-1 ml-2">
                            Annuler
                        </button>
                    </form>
                </div>
            )}

            <table className="table-auto w-full p-6 bg-white shadow-md rounded-xl">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border rounded-lg shadow-md">Titre</th>
                        <th className="px-4 py-2 border rounded-lg shadow-md">Prix</th>
                        <th className="px-4 py-2 border rounded-lg shadow-md">Stock</th>
                        <th className="px-4 py-2 border rounded-lg shadow-md">Description</th>
                        <th className="px-4 py-2 border rounded-lg shadow-md">Image</th>
                        <th className="px-4 py-2 border rounded-lg shadow-md">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {produits.map((produit) => (
                        <tr key={produit._id}>
                            <td className="px-4 py-2 border rounded-lg shadow-md">{produit.titre}</td>
                            <td className="px-4 py-2 border rounded-lg shadow-md">{produit.prix} DH</td>
                            <td className="px-4 py-2 border rounded-lg shadow-md">{produit.stock}</td>
                            <td className="px-4 py-2 border rounded-lg shadow-md">{produit.description}</td>
                            <td className="px-4 py-2 border rounded-lg shadow-md">
                                <img src={`http://localhost:5000/images/${produit.image}`} alt={produit.titre} className="h-16 w-auto mx-auto" />
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
