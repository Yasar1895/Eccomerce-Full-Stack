import React from "react";

export default function Header({ token, onLogout, onChangeView }) {
  return (
    <div className="header">
      <h2 style={{cursor:'pointer'}} onClick={()=>onChangeView('products')}>My Store</h2>
      <div style={{display:'flex', gap:10, alignItems:'center'}}>
        <button className="button small" onClick={()=>onChangeView('cart')}>Cart</button>
        {!token ? (
          <>
            <button className="button small" onClick={()=>onChangeView('login')}>Login</button>
            <button className="button small" onClick={()=>onChangeView('signup')}>Sign up</button>
          </>
        ) : (
          <button className="button small" onClick={()=>{ onLogout(); onChangeView('products'); }}>Logout</button>
        )}
      </div>
    </div>
  );
}
