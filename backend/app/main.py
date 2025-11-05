from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from . import models, schemas, crud, auth
from .database import engine
from .deps import get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Ecommerce API")

# Allow CORS from frontend (adjust in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/auth/signup", response_model=schemas.Token)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = crud.get_user_by_email(db, user.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    u = crud.create_user(db, user)
    token = auth.create_access_token({"sub": u.email, "user_id": u.id})
    return {"access_token": token, "token_type": "bearer"}

@app.post("/auth/token", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    token = auth.create_access_token({"sub": user.email, "user_id": user.id})
    return {"access_token": token, "token_type": "bearer"}

@app.get("/products", response_model=list[schemas.Product])
def list_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_products(db, skip, limit)

@app.get("/products/{product_id}", response_model=schemas.Product)
def get_product(product_id: int, db: Session = Depends(get_db)):
    p = crud.get_product(db, product_id)
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    return p

@app.post("/cart")
def add_to_cart(item: schemas.CartItemCreate, token: str = Depends(auth.oauth2_scheme), db: Session = Depends(get_db)):
    # decode token to get user id
    from jose import jwt, JWTError
    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        user_id = int(payload.get("user_id"))
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    it = crud.add_cart_item(db, user_id, item.product_id, item.quantity)
    return {"status": "ok", "item_id": it.id}

@app.get("/cart")
def get_cart(token: str = Depends(auth.oauth2_scheme), db: Session = Depends(get_db)):
    from jose import jwt, JWTError
    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        user_id = int(payload.get("user_id"))
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    items = crud.get_cart_items(db, user_id)
    return [{"id": i.id, "quantity": i.quantity, "product": {
        "id": i.product.id,
        "name": i.product.name,
        "price": i.product.price,
        "image": i.product.image,
        "description": i.product.description
    }} for i in items]

@app.post("/checkout")
def checkout(order: schemas.OrderCreate, token: str = Depends(auth.oauth2_scheme), db: Session = Depends(get_db)):
    from jose import jwt, JWTError
    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        user_id = int(payload.get("user_id"))
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    created = crud.create_order(db, user_id, order.total)
    crud.clear_cart(db, user_id)
    return {"status": "order_placed", "order_id": created.id}
