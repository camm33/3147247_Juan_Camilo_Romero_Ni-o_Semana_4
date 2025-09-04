import { ContentCard } from "@/components/ContentCard";
import { CodeBlock } from "@/components/CodeBlock";
import { Badge } from "@/components/ui/badge";
import { 
  RotateCcw,
  Shield,
  Search,
  Timer,
  Target,
  Code,
  Play,
  CheckCircle,
  AlertCircle,
  Link,
  BookOpen
} from "lucide-react";

export const CrudSection = () => {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center py-8 bg-gradient-to-r from-accent/10 to-primary/10 rounded-xl border border-accent/20">
        <RotateCcw className="w-12 h-12 mx-auto mb-4 text-accent" />
        <h1 className="text-3xl font-bold mb-2">CRUD Mejorado</h1>
        <p className="text-muted-foreground">Operaciones avanzadas con validaciones y manejo de errores</p>
        <div className="flex items-center justify-center space-x-4 mt-4">
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Timer className="w-3 h-3" />
            <span>45 minutos</span>
          </Badge>
        </div>
      </div>

      {/* Objetivos */}
      <ContentCard title="Objetivo" icon={Target} variant="primary">
        <p className="mb-4">Mejorar las operaciones CRUD básicas añadiendo validaciones simples y manejo de errores comunes. Aprenderás a:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-success mt-0.5" />
            <span>Validar datos antes de guardar</span>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-success mt-0.5" />
            <span>Manejar errores comunes de base de datos</span>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-success mt-0.5" />
            <span>Implementar búsquedas básicas</span>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-success mt-0.5" />
            <span>Añadir funcionalidades útiles</span>
          </div>
        </div>
      </ContentCard>

      {/* Paso 1: Mejorar Validaciones */}
      <ContentCard title="Paso 1: Mejorar Validaciones" icon={Shield} variant="accent">
        <div className="mb-4 flex items-center space-x-2">
          <Timer className="w-4 h-4 text-accent" />
          <span className="text-sm text-muted-foreground">15 minutos</span>
        </div>
        
        <h4 className="font-semibold mb-4">Actualizar schemas.py</h4>
        <CodeBlock 
          title="schemas.py - Con validaciones mejoradas"
          code={`from pydantic import BaseModel, validator

class ProductoBase(BaseModel):
    nombre: str
    precio: float
    descripcion: str

    @validator('nombre')
    def validar_nombre(cls, v):
        if not v or len(v.strip()) == 0:
            raise ValueError('El nombre no puede estar vacío')
        return v.strip()

    @validator('precio')
    def validar_precio(cls, v):
        if v <= 0:
            raise ValueError('El precio debe ser mayor a 0')
        return v

class ProductoCreate(ProductoBase):
    pass

class ProductoUpdate(BaseModel):
    nombre: str = None
    precio: float = None
    descripcion: str = None

    @validator('precio')
    def validar_precio(cls, v):
        if v is not None and v <= 0:
            raise ValueError('El precio debe ser mayor a 0')
        return v

class Producto(ProductoBase):
    id: int

    class Config:
        from_attributes = True`}
        />
      </ContentCard>

      {/* Paso 2: Funciones CRUD Mejoradas */}
      <ContentCard title="Paso 2: Funciones CRUD Mejoradas" icon={Code}>
        <div className="mb-4 flex items-center space-x-2">
          <Timer className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">15 minutos</span>
        </div>
        
        <h4 className="font-semibold mb-4">Crear archivo crud.py</h4>
        <CodeBlock 
          title="crud.py - Funciones mejoradas"
          code={`from sqlalchemy.orm import Session
from sqlalchemy import or_
import models, schemas

def crear_producto(db: Session, producto: schemas.ProductoCreate):
    """Crear un nuevo producto"""
    db_producto = models.Producto(**producto.dict())
    db.add(db_producto)
    db.commit()
    db.refresh(db_producto)
    return db_producto

def obtener_producto(db: Session, producto_id: int):
    """Obtener producto por ID"""
    return db.query(models.Producto).filter(models.Producto.id == producto_id).first()

def obtener_productos(db: Session, skip: int = 0, limit: int = 10):
    """Obtener lista de productos con paginación"""
    return db.query(models.Producto).offset(skip).limit(limit).all()

def buscar_productos(db: Session, busqueda: str):
    """Buscar productos por nombre o descripción"""
    return db.query(models.Producto).filter(
        or_(
            models.Producto.nombre.contains(busqueda),
            models.Producto.descripcion.contains(busqueda)
        )
    ).all()

def actualizar_producto(db: Session, producto_id: int, producto: schemas.ProductoUpdate):
    """Actualizar producto existente"""
    db_producto = db.query(models.Producto).filter(models.Producto.id == producto_id).first()
    if db_producto:
        # Solo actualizar campos que no sean None
        update_data = producto.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_producto, field, value)
        db.commit()
        db.refresh(db_producto)
    return db_producto

def eliminar_producto(db: Session, producto_id: int):
    """Eliminar producto"""
    db_producto = db.query(models.Producto).filter(models.Producto.id == producto_id).first()
    if db_producto:
        db.delete(db_producto)
        db.commit()
    return db_producto

def contar_productos(db: Session):
    """Contar total de productos"""
    return db.query(models.Producto).count()`}
        />
      </ContentCard>

      {/* Paso 3: Actualizar API Principal */}
      <ContentCard title="Paso 3: Actualizar API Principal" icon={Play} variant="primary">
        <div className="mb-4 flex items-center space-x-2">
          <Timer className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">10 minutos</span>
        </div>
        
        <CodeBlock 
          title="main.py - API mejorada"
          code={`from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session
import models, schemas, crud
from database import SessionLocal, engine, get_db

# Crear tablas
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="API Productos Mejorada")

# CREATE - Crear producto con validaciones
@app.post("/productos/", response_model=schemas.Producto)
def crear_producto(producto: schemas.ProductoCreate, db: Session = Depends(get_db)):
    try:
        return crud.crear_producto(db=db, producto=producto)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# READ - Listar productos con paginación
@app.get("/productos/")
def listar_productos(
    skip: int = Query(0, ge=0, description="Saltar elementos"),
    limit: int = Query(10, ge=1, le=100, description="Límite de elementos"),
    db: Session = Depends(get_db)
):
    productos = crud.obtener_productos(db, skip=skip, limit=limit)
    total = crud.contar_productos(db)
    return {
        "productos": productos,
        "total": total,
        "pagina": skip // limit + 1,
        "por_pagina": limit
    }

# READ - Buscar productos
@app.get("/productos/buscar/")
def buscar_productos(
    q: str = Query(..., min_length=1, description="Término de búsqueda"),
    db: Session = Depends(get_db)
):
    productos = crud.buscar_productos(db, busqueda=q)
    return {
        "busqueda": q,
        "productos": productos,
        "total": len(productos)
    }

# READ - Obtener producto por ID
@app.get("/productos/{producto_id}", response_model=schemas.Producto)
def obtener_producto(producto_id: int, db: Session = Depends(get_db)):
    producto = crud.obtener_producto(db, producto_id=producto_id)
    if producto is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return producto

# UPDATE - Actualizar producto parcialmente
@app.patch("/productos/{producto_id}", response_model=schemas.Producto)
def actualizar_producto(
    producto_id: int,
    producto: schemas.ProductoUpdate,
    db: Session = Depends(get_db)
):
    db_producto = crud.actualizar_producto(db, producto_id=producto_id, producto=producto)
    if db_producto is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return db_producto

# DELETE - Eliminar producto
@app.delete("/productos/{producto_id}")
def eliminar_producto(producto_id: int, db: Session = Depends(get_db)):
    producto = crud.eliminar_producto(db, producto_id=producto_id)
    if producto is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return {"mensaje": f"Producto {producto_id} eliminado correctamente"}

# STATS - Estadísticas básicas
@app.get("/productos/stats/resumen")
def estadisticas_productos(db: Session = Depends(get_db)):
    total = crud.contar_productos(db)
    productos = crud.obtener_productos(db, limit=total)

    if not productos:
        return {"total": 0, "precio_promedio": 0, "precio_max": 0, "precio_min": 0}

    precios = [p.precio for p in productos]
    return {
        "total": total,
        "precio_promedio": sum(precios) / len(precios),
        "precio_max": max(precios),
        "precio_min": min(precios)
    }`}
        />
      </ContentCard>

      {/* Paso 4: Probar Nuevas Funcionalidades */}
      <ContentCard title="Paso 4: Probar las Nuevas Funcionalidades" icon={Play}>
        <div className="mb-4 flex items-center space-x-2">
          <Timer className="w-4 h-4 text-accent" />
          <span className="text-sm text-muted-foreground">5 minutos</span>
        </div>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3">Probar Paginación</h4>
            <CodeBlock 
              language="bash"
              code={`# Primera página (10 productos)
curl "http://localhost:8000/productos/?skip=0&limit=10"

# Segunda página
curl "http://localhost:8000/productos/?skip=10&limit=10"`}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">Probar Búsqueda</h4>
            <CodeBlock 
              language="bash"
              code={`# Buscar productos que contengan "laptop"
curl "http://localhost:8000/productos/buscar/?q=laptop"`}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">Probar Actualización Parcial</h4>
            <CodeBlock 
              language="bash"
              code={`# Solo actualizar el precio
curl -X PATCH "http://localhost:8000/productos/1" \\
     -H "Content-Type: application/json" \\
     -d '{"precio": 1299.99}'

# Solo actualizar nombre y descripción
curl -X PATCH "http://localhost:8000/productos/1" \\
     -H "Content-Type: application/json" \\
     -d '{"nombre": "Laptop Gaming Pro", "descripcion": "Laptop para gaming profesional"}'`}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">Probar Estadísticas</h4>
            <CodeBlock 
              language="bash"
              code={`# Ver resumen de productos
curl "http://localhost:8000/productos/stats/resumen"`}
            />
          </div>
        </div>
      </ContentCard>

      {/* Verificación */}
      <ContentCard title="Verificación" icon={CheckCircle} variant="accent">
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-4">Nuevas Funcionalidades</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                <span className="text-sm">Validaciones - Los datos se validan antes de guardar</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                <span className="text-sm">Paginación - Puedes navegar por páginas de productos</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                <span className="text-sm">Búsqueda - Puedes buscar productos por texto</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                <span className="text-sm">Actualización parcial - Puedes actualizar solo algunos campos</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                <span className="text-sm">Estadísticas - Puedes ver resumen de datos</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                <span className="text-sm">Manejo de errores - Los errores se muestran claramente</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Estructura Final</h4>
            <CodeBlock 
              language="text"
              code={`semana-04-practica/
├── main.py          # ✅ API mejorada con nuevas funciones
├── crud.py          # ✅ Funciones CRUD separadas
├── database.py      # ✅ Configuración (sin cambios)
├── models.py        # ✅ Modelo (sin cambios)
├── schemas.py       # ✅ Schemas con validaciones
├── requirements.txt # ✅ Dependencias (sin cambios)
└── productos.db     # ✅ Base de datos`}
            />
          </div>
        </div>
      </ContentCard>

      {/* Práctica 13: Relaciones */}
      <ContentCard title="Práctica 13: Relaciones Básicas entre Tablas" icon={Link} variant="primary">
        <div className="mb-4 flex items-center space-x-2">
          <Timer className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">40 minutos</span>
        </div>
        
        <p className="mb-6">Aprende a crear relaciones One-to-Many entre categorías y productos.</p>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3">Paso 1: Crear Modelo de Categoría</h4>
            <CodeBlock 
              title="models.py - Con relaciones"
              code={`from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

# Modelo existente de Producto (actualizar)
class Producto(Base):
    __tablename__ = "productos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    precio = Column(Float)
    descripcion = Column(String)

    # NUEVO: Relación con categoría
    categoria_id = Column(Integer, ForeignKey("categorias.id"))
    categoria = relationship("Categoria", back_populates="productos")

# NUEVO: Modelo de Categoría
class Categoria(Base):
    __tablename__ = "categorias"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, unique=True, index=True)
    descripcion = Column(String)

    # Relación: una categoría tiene muchos productos
    productos = relationship("Producto", back_populates="categoria")`}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">Paso 2: Schemas con Relaciones</h4>
            <CodeBlock 
              title="schemas.py - Con relaciones"
              code={`from pydantic import BaseModel
from typing import List, Optional

# Schemas para Categoría
class CategoriaBase(BaseModel):
    nombre: str
    descripcion: str

class CategoriaCreate(CategoriaBase):
    pass

class Categoria(CategoriaBase):
    id: int
    class Config:
        from_attributes = True

# Schemas actualizados para Producto
class ProductoBase(BaseModel):
    nombre: str
    precio: float
    descripcion: str
    categoria_id: Optional[int] = None

# Producto con información de categoría incluida
class ProductoConCategoria(ProductoBase):
    id: int
    categoria: Optional[Categoria] = None
    class Config:
        from_attributes = True

# Categoría con lista de productos
class CategoriaConProductos(Categoria):
    productos: List[ProductoBase] = []
    class Config:
        from_attributes = True`}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">Paso 3: CRUD con Relaciones</h4>
            <CodeBlock 
              title="crud.py - Funciones con relaciones"
              code={`from sqlalchemy.orm import Session, joinedload
import models, schemas

# Funciones CRUD para Categorías
def crear_categoria(db: Session, categoria: schemas.CategoriaCreate):
    """Crear una nueva categoría"""
    db_categoria = models.Categoria(**categoria.dict())
    db.add(db_categoria)
    db.commit()
    db.refresh(db_categoria)
    return db_categoria

def obtener_categoria_con_productos(db: Session, categoria_id: int):
    """Obtener categoría con sus productos"""
    return db.query(models.Categoria).options(
        joinedload(models.Categoria.productos)
    ).filter(models.Categoria.id == categoria_id).first()

# Funciones actualizadas para Productos
def obtener_productos_con_categoria(db: Session, skip: int = 0, limit: int = 10):
    """Obtener productos con información de categoría"""
    return db.query(models.Producto).options(
        joinedload(models.Producto.categoria)
    ).offset(skip).limit(limit).all()

def obtener_productos_por_categoria(db: Session, categoria_id: int):
    """Obtener productos de una categoría específica"""
    return db.query(models.Producto).filter(
        models.Producto.categoria_id == categoria_id
    ).all()`}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">Probar las Relaciones</h4>
            <CodeBlock 
              language="bash"
              code={`# Crear categoría
curl -X POST "http://localhost:8000/categorias/" \\
     -H "Content-Type: application/json" \\
     -d '{"nombre": "Electrónicos", "descripcion": "Dispositivos electrónicos"}'

# Crear producto con categoría
curl -X POST "http://localhost:8000/productos/" \\
     -H "Content-Type: application/json" \\
     -d '{"nombre": "Laptop", "precio": 999.99, "descripcion": "Laptop gaming", "categoria_id": 1}'

# Ver productos con categoría
curl "http://localhost:8000/productos/"

# Ver categoría con productos
curl "http://localhost:8000/categorias/1"`}
            />
          </div>
        </div>
      </ContentCard>

      {/* Práctica 14: Testing */}
      <ContentCard title="Práctica 14: Testing Básico con Base de Datos" icon={Play}>
        <div className="mb-4 flex items-center space-x-2">
          <Timer className="w-4 h-4 text-accent" />
          <span className="text-sm text-muted-foreground">35 minutos</span>
        </div>
        
        <p className="mb-6">Aprende a escribir tests básicos para verificar que tu API funciona correctamente.</p>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3">Configurar Testing</h4>
            <CodeBlock 
              title="conftest.py - Configuración de tests"
              code={`import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

from main import app
from database import get_db, Base

# Base de datos de prueba (en memoria)
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture
def client():
    # Crear tablas de prueba
    Base.metadata.create_all(bind=engine)
    yield TestClient(app)
    # Limpiar después de cada test
    Base.metadata.drop_all(bind=engine)
    if os.path.exists("test.db"):
        os.remove("test.db")`}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">Tests para API</h4>
            <CodeBlock 
              title="test_productos.py - Tests básicos"
              code={`import pytest
from fastapi.testclient import TestClient

def test_crear_producto(client: TestClient):
    """Test crear un nuevo producto"""
    response = client.post(
        "/productos/",
        json={
            "nombre": "Producto Test",
            "precio": 99.99,
            "descripcion": "Producto de prueba"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["nombre"] == "Producto Test"
    assert data["precio"] == 99.99

def test_listar_productos(client: TestClient):
    """Test listar productos"""
    response = client.get("/productos/")
    assert response.status_code == 200

def test_validacion_precio_negativo(client: TestClient):
    """Test validación de precio negativo"""
    response = client.post(
        "/productos/",
        json={
            "nombre": "Producto Inválido",
            "precio": -10.99,
            "descripcion": "Precio negativo"
        }
    )
    assert response.status_code == 400

def test_producto_no_encontrado(client: TestClient):
    """Test error cuando producto no existe"""
    response = client.get("/productos/999")
    assert response.status_code == 404`}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">Ejecutar Tests</h4>
            <CodeBlock 
              language="bash"
              code={`# Instalar dependencias de testing
pip install pytest httpx

# Ejecutar todos los tests
pytest

# Ejecutar con más detalles
pytest -v

# Ejecutar un test específico
pytest test_productos.py::test_crear_producto`}
            />
          </div>
        </div>
      </ContentCard>

      {/* Ejercicios de Práctica */}
      <ContentCard title="Ejercicios de Práctica" icon={BookOpen} variant="accent">
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold mb-4">Ejercicio 1: Tienda de Libros (25 min)</h4>
            <p className="mb-4">Crear una API simple para una tienda de libros con autores y libros relacionados.</p>
            
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h5 className="font-medium mb-2">Objetivos:</h5>
                <ul className="text-sm space-y-1">
                  <li>• Crear modelos Autor y Libro con relación One-to-Many</li>
                  <li>• Implementar schemas con relaciones anidadas</li>
                  <li>• Crear endpoints CRUD básicos</li>
                  <li>• Probar relaciones entre entidades</li>
                </ul>
              </div>
              
              <CodeBlock 
                title="models.py - Modelos de la librería"
                code={`class Autor(Base):
    __tablename__ = "autores"
    
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    nacionalidad = Column(String)
    
    # Relación: un autor tiene muchos libros
    libros = relationship("Libro", back_populates="autor")

class Libro(Base):
    __tablename__ = "libros"
    
    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, index=True)
    precio = Column(Float)
    paginas = Column(Integer)
    
    # Relación con autor
    autor_id = Column(Integer, ForeignKey("autores.id"))
    autor = relationship("Autor", back_populates="libros")`}
              />
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Ejercicio 2: Validaciones y Búsquedas (20 min)</h4>
            <p className="mb-4">Mejorar la API de libros con validaciones y funciones de búsqueda.</p>
            
            <CodeBlock 
              title="Validaciones y búsquedas"
              code={`# Validaciones en schemas
@validator('precio')
def validar_precio(cls, v):
    if v <= 0:
        raise ValueError('El precio debe ser mayor a 0')
    return v

# Funciones de búsqueda en crud.py
def buscar_libros_por_titulo(db: Session, busqueda: str):
    return db.query(models.Libro).filter(
        models.Libro.titulo.contains(busqueda)
    ).all()

def buscar_libros_por_autor(db: Session, nombre_autor: str):
    return db.query(models.Libro).join(models.Autor).filter(
        models.Autor.nombre.contains(nombre_autor)
    ).all()`}
            />
          </div>

          <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
            <h5 className="font-medium text-success mb-2">🎯 Lista de Verificación</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>Modelos relacionados creados</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>Schemas con validaciones</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>Endpoints CRUD funcionando</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>Búsquedas implementadas</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>Tests básicos pasando</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>Estadísticas funcionando</span>
              </div>
            </div>
          </div>
        </div>
      </ContentCard>
    </div>
  );
};