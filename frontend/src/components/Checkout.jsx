import React, { useEffect, useState } from "react";
import { getCart, checkout } from "../api";

export default function Checkout({ token, onDone }) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(()=> {
    if (!token) return;
    getCart(token).then(data=>{
      setItems(data);
      setTotal(data.reduce((s,it)=>s + it.product.price * it.quantity, 0));
    }).catch(console.error);
  }, [token]);

  async function handlePlace() {
    try {
      await checkout(token, total);
      alert("Order placed!");
      onDone && onDone();
    } catch (e) {
      alert("Checkout failed: " + e.message);
    }
  }

  if (!token) return <div>Please login to checkout</div>;

  return (
    <div>
      <h3>Checkout</h3>
      {items.map(it => <div key={it.id}>{it.product.name} x {it.quantity} - ₹{(it.product.price * it.quantity).toFixed(2)}</div>)}
      <div style={{marginTop:12}}><strong>Total: ₹{total.toFixed(2)}</strong></div>
      <div style={{marginTop:12}}>
        <button className="button" onClick={handlePlace}>Place order</button>
      </div>
    </div>
  );
}
