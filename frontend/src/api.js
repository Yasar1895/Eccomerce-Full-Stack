const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(path, opts = {}) {
  const res = await fetch(`${API_URL}${path}`, opts);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json();
}

export async function listProducts() {
  return request("/products");
}

export async function signup(email, password) {
  return request("/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

export async function login(email, password) {
  // OAuth2 password expects form data
  const fd = new URLSearchParams();
  fd.append("username", email);
  fd.append("password", password);
  const res = await fetch(`${API_URL}/auth/token`, {
    method: "POST",
    body: fd,
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

export async function addToCart(token, product_id, quantity = 1) {
  return request("/cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ product_id, quantity }),
  });
}

export async function getCart(token) {
  return request("/cart", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function checkout(token, total) {
  return request("/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ total }),
  });
}
