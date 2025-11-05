import React from "react";
import ProductCard from "./ProductCard";

export default function ProductList({ products = [], token, onCartChange }) {
  return (
    <div>
      <h3>Products</h3>
      <div className="products">
        {products.map(p => <ProductCard key={p.id} product={p} token={token} onCartChange={onCartChange} />)}
      </div>
    </div>
  );
}
