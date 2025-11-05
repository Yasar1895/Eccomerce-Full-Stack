import React, { useState } from "react";
import { addToCart } from "../api";

export default function ProductCard({ product, token, onCartChange }) {
  const [loading, setLoading] = useState(false);

  async function handleAdd() {
    if (!token) return alert("Please login first.");
    setLoading(true);
    try {
      await addToCart(token, product.id, 1);
      onCartChange && onCartChange();
      alert("Added to cart");
    } catch (e) {
      alert("Failed to add to cart: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <img src={product.image || "https://picsum.photos/seed/" + product.id + "/300/200"} alt={product.name} />
      <h4>{product.name}</h4>
      <div className="small">{product.description || "No description"}</div>
      <div style={{marginTop:8, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <strong>₹ {product.price.toFixed(2)}</strong>
        <button className="button small" onClick={handleAdd} disabled={loading}>{loading ? "Adding..." : "Add"}</button>
      </div>
    </div>
  );
}
