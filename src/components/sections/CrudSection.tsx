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
  AlertCircle
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

      {/* Resumen */}
      <ContentCard title="Resumen de Mejoras" icon={AlertCircle} variant="primary">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold mb-4 text-primary">Lo que Añadiste</h4>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                <span className="text-sm">Validaciones Pydantic - Datos siempre correctos</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                <span className="text-sm">Funciones CRUD separadas - Código más organizado</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                <span className="text-sm">Paginación - Manejo de listas grandes</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                <span className="text-sm">Búsqueda - Filtrar productos por texto</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                <span className="text-sm">Actualización parcial - PATCH en lugar de PUT</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                <span className="text-sm">Estadísticas básicas - Insights de los datos</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-accent">Conceptos Aprendidos</h4>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-info mt-0.5" />
                <span className="text-sm">Validadores Pydantic - @validator para validaciones custom</span>
              </li>
              <li className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-info mt-0.5" />
                <span className="text-sm">Separación de responsabilidades - CRUD en archivo separado</span>
              </li>
              <li className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-info mt-0.5" />
                <span className="text-sm">Query Parameters - Parámetros de consulta en FastAPI</span>
              </li>
              <li className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-info mt-0.5" />
                <span className="text-sm">Operaciones SQL - contains(), count(), paginación</span>
              </li>
              <li className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-info mt-0.5" />
                <span className="text-sm">Manejo de errores - try/except y HTTPException</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 p-4 bg-success/10 border border-success/20 rounded-lg">
          <p className="text-success font-medium">
            🎉 ¡Tu API ahora es mucho más robusta! En la siguiente práctica aprenderemos sobre relaciones entre tablas.
          </p>
        </div>
      </ContentCard>
    </div>
  );
};