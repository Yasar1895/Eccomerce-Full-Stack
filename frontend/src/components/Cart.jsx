import React, { useEffect, useState } from "react";
import { getCart } from "../api";

export default function Cart({ token, onCheckout, refresh }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getCart(token).then(data => {
      setItems(data);
    }).catch(e => {
      alert("Error loading cart: " + e.message);
    }).finally(()=>setLoading(false));
  }, [token, refresh]);

  const total = items.reduce((s, it) => s + (it.product.price * it.quantity), 0);

  if (!token) return <div>Please login to view cart.</div>;

  return (
    <div>
      <h3>Your Cart</h3>
      {loading ? <div>Loading...</div> : (
        <>
          <div className="cart-list">
            {items.length === 0 ? <div>No items in cart</div> : items.map(it => (
              <div key={it.id} style={{padding:8, borderBottom:'1px solid #eee'}}>
                <strong>{it.product.name}</strong> - {it.quantity} × ₹{it.product.price.toFixed(2)}
              </div>
            ))}
          </div>
          <div style={{marginTop:12}}>
            <strong>Total: ₹{total.toFixed(2)}</strong>
          </div>
          <div style={{marginTop:12}}>
            <button className="button" onClick={()=>onCheckout()}>Proceed to Checkout</button>
          </div>
        </>
      )}
    </div>
  );
}
