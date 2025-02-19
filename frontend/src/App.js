import React from 'react';
import AjoutProduit from "./components/AjoutProduit";
import ProduitListe from "./components/ProduitListe";
import './index.css';

export default function App() {
  return (
    <div className="min-h-screen bg-pink-50 ">
      <div className="w-[100%] mx-auto p-8">
        <h1 className="italic text-3xl font-bold text-center underline decoration-dashed uppercase mb-8">Site e-commerce</h1>

        <AjoutProduit />
        <ProduitListe />
      </div>
    </div>
  )
}
