from pydantic import BaseModel, EmailStr
from typing import Optional, List

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    image: Optional[str] = None
    stock: Optional[int] = 0

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int
    class Config:
        orm_mode = True

class CartItemCreate(BaseModel):
    product_id: int
    quantity: int

class CartItemResponse(BaseModel):
    id: int
    product: Product
    quantity: int
    class Config:
        orm_mode = True

class OrderCreate(BaseModel):
    total: float

class OrderResponse(BaseModel):
    id: int
    total: float
    status: str
    class Config:
        orm_mode = True
