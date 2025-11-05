from sqlalchemy.orm import Session
from . import models, schemas, auth

def create_user(db: Session, user: schemas.UserCreate):
    hashed = auth.get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_product(db: Session, product: schemas.ProductCreate):
    db_p = models.Product(**product.dict())
    db.add(db_p)
    db.commit()
    db.refresh(db_p)
    return db_p

def get_products(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Product).offset(skip).limit(limit).all()

def get_product(db: Session, product_id: int):
    return db.query(models.Product).filter(models.Product.id == product_id).first()

def add_cart_item(db: Session, user_id: int, product_id: int, quantity: int):
    item = db.query(models.CartItem).filter(models.CartItem.user_id==user_id, models.CartItem.product_id==product_id).first()
    if item:
        item.quantity += quantity
    else:
        item = models.CartItem(user_id=user_id, product_id=product_id, quantity=quantity)
        db.add(item)
    db.commit()
    return item

def get_cart_items(db: Session, user_id: int):
    items = db.query(models.CartItem).filter(models.CartItem.user_id==user_id).all()
    # attach product
    result = []
    for it in items:
        product = get_product(db, it.product_id)
        it.product = product
        result.append(it)
    return result

def clear_cart(db: Session, user_id: int):
    db.query(models.CartItem).filter(models.CartItem.user_id==user_id).delete()
    db.commit()

def create_order(db: Session, user_id: int, total: float):
    order = models.Order(user_id=user_id, total=total)
    db.add(order)
    db.commit()
    db.refresh(order)
    return order
