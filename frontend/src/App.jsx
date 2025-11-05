import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Checkout from "./components/Checkout";
import { listProducts } from "./api";

export default function App() {
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [view, setView] = useState("products");
  const [cartNeedsRefresh, setCartNeedsRefresh] = useState(false);

  useEffect(() => {
    listProducts().then(setProducts).catch(console.error);
  }, []);

  function handleLogin(token) {
    setToken(token);
    localStorage.setItem("token", token);
    setView("products");
  }

  function handleLogout() {
    setToken(null);
    localStorage.removeItem("token");
  }

  return (
    <div className="app">
      <Header token={token} onLogout={handleLogout} onChangeView={setView} />
      {view === "products" && (
        <ProductList products={products} token={token} onCartChange={() => setCartNeedsRefresh(s=>!s)} />
      )}
      {view === "cart" && <Cart token={token} onCheckout={()=>setView("checkout")} refresh={cartNeedsRefresh} />}
      {view === "login" && <Login onLogin={handleLogin} />}
      {view === "signup" && <Signup onSignup={handleLogin} />}
      {view === "checkout" && <Checkout token={token} onDone={()=>setView("products")} />}
    </div>
  );
}
