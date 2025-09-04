import { ContentCard } from "@/components/ContentCard";
import { CodeBlock } from "@/components/CodeBlock";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  BookOpen, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  Database, 
  Link,
  RotateCcw,
  FileText,
  Settings
} from "lucide-react";

export const TheorySection = () => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-hero rounded-2xl text-white shadow-strong">
        <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-90" />
        <h1 className="text-4xl font-bold mb-4">Bases de Datos Básicas</h1>
        <p className="text-xl opacity-90 max-w-2xl mx-auto">
          Aprende a usar SQLAlchemy con FastAPI para hacer que tus datos sean permanentes
        </p>
        <Badge variant="secondary" className="mt-4 bg-white/20 text-white">
          Semana 4
        </Badge>
      </div>

      {/* Objetivos */}
      <ContentCard 
        title="Objetivos de Aprendizaje" 
        icon={Target}
        variant="primary"
        badge="Metas"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-success mt-0.5" />
            <span>Entender por qué necesitamos bases de datos</span>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-success mt-0.5" />
            <span>Configurar SQLite con FastAPI</span>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-success mt-0.5" />
            <span>Crear modelos básicos con SQLAlchemy</span>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-success mt-0.5" />
            <span>Realizar operaciones CRUD simples</span>
          </div>
        </div>
      </ContentCard>

      {/* Por qué Bases de Datos */}
      <ContentCard 
        title="¿Por qué Bases de Datos?" 
        icon={Database}
        variant="accent"
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold flex items-center space-x-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <span>Problema: Datos en Memoria</span>
            </h3>
            <CodeBlock 
              title="❌ Se pierden al reiniciar"
              code={`# ❌ Se pierden al reiniciar
productos = [
    {"id": 1, "nombre": "Laptop", "precio": 999.99}
]

@app.post("/productos")
def crear_producto(producto: dict):
    productos.append(producto)  # ¡Se pierde!
    return producto`}
            />
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold flex items-center space-x-2 mb-4">
              <CheckCircle className="w-5 h-5 text-success" />
              <span>Solución: Base de Datos</span>
            </h3>
            <CodeBlock 
              title="✅ Los datos persisten"
              code={`# ✅ Los datos persisten
@app.post("/productos")
def crear_producto(producto: ProductoCreate, db: Session = Depends(get_db)):
    db_producto = Producto(**producto.dict())
    db.add(db_producto)
    db.commit()  # Guardado permanente
    return db_producto`}
            />
          </div>
        </div>
      </ContentCard>

      {/* SQLite */}
      <ContentCard 
        title="¿Qué es SQLite?" 
        icon={Database}
        description="Una base de datos simple y perfecta para aprender"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-success mt-0.5" />
            <div>
              <p className="font-medium">Un solo archivo</p>
              <p className="text-sm text-muted-foreground">No necesita servidor</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-success mt-0.5" />
            <div>
              <p className="font-medium">Fácil configuración</p>
              <p className="text-sm text-muted-foreground">Cero setup</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-success mt-0.5" />
            <div>
              <p className="font-medium">Ideal para desarrollo</p>
              <p className="text-sm text-muted-foreground">Sin complicaciones</p>
            </div>
          </div>
        </div>
        
        <CodeBlock 
          title="Crear base de datos SQLite"
          code={`# Crear base de datos SQLite (un archivo)
SQLALCHEMY_DATABASE_URL = "sqlite:///./app.db"`}
        />
      </ContentCard>

      {/* SQLAlchemy ORM */}
      <ContentCard 
        title="¿Qué es SQLAlchemy (ORM)?" 
        icon={Link}
        description="Object-Relational Mapping - Trabajar con objetos Python en lugar de SQL directo"
      >
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-warning mb-3">Sin ORM (Difícil)</h4>
            <CodeBlock 
              code={`import sqlite3
cursor.execute("INSERT INTO productos (nombre, precio) VALUES (?, ?)", (nombre, precio))`}
            />
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold text-success mb-3">Con ORM (Fácil)</h4>
            <CodeBlock 
              code={`producto = Producto(nombre="Laptop", precio=999.99)
db.add(producto)
db.commit()`}
            />
          </div>
        </div>
      </ContentCard>

      {/* Tipos de Modelos */}
      <ContentCard 
        title="Tipos de Modelos" 
        icon={FileText}
      >
        <div className="space-y-8">
          <div>
            <h4 className="text-lg font-semibold mb-4">1. Modelo SQLAlchemy (Tabla)</h4>
            <CodeBlock 
              title="models.py"
              code={`from sqlalchemy import Column, Integer, String, Float

class Producto(Base):
    __tablename__ = "productos"

    id = Column(Integer, primary_key=True)
    nombre = Column(String)
    precio = Column(Float)`}
            />
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">2. Modelo Pydantic (API)</h4>
            <CodeBlock 
              title="schemas.py"
              code={`class ProductoCreate(BaseModel):
    nombre: str
    precio: float

class ProductoResponse(BaseModel):
    id: int
    nombre: str
    precio: float`}
            />
          </div>
        </div>
      </ContentCard>

      {/* Operaciones CRUD */}
      <ContentCard 
        title="Operaciones CRUD Básicas" 
        icon={RotateCcw}
        variant="primary"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-primary mb-3">Create (Crear)</h4>
            <CodeBlock 
              code={`@app.post("/productos")
def crear_producto(producto: ProductoCreate, db: Session = Depends(get_db)):
    db_producto = Producto(**producto.dict())
    db.add(db_producto)
    db.commit()
    return db_producto`}
            />
          </div>

          <div>
            <h4 className="font-semibold text-accent mb-3">Read (Leer)</h4>
            <CodeBlock 
              code={`@app.get("/productos")
def listar_productos(db: Session = Depends(get_db)):
    return db.query(Producto).all()

@app.get("/productos/{id}")
def obtener_producto(id: int, db: Session = Depends(get_db)):
    return db.query(Producto).filter(Producto.id == id).first()`}
            />
          </div>

          <div>
            <h4 className="font-semibold text-info mb-3">Update (Actualizar)</h4>
            <CodeBlock 
              code={`@app.put("/productos/{id}")
def actualizar_producto(id: int, producto: ProductoCreate, db: Session = Depends(get_db)):
    db_producto = db.query(Producto).filter(Producto.id == id).first()
    db_producto.nombre = producto.nombre
    db_producto.precio = producto.precio
    db.commit()
    return db_producto`}
            />
          </div>

          <div>
            <h4 className="font-semibold text-warning mb-3">Delete (Eliminar)</h4>
            <CodeBlock 
              code={`@app.delete("/productos/{id}")
def eliminar_producto(id: int, db: Session = Depends(get_db)):
    db_producto = db.query(Producto).filter(Producto.id == id).first()
    db.delete(db_producto)
    db.commit()
    return {"mensaje": "Producto eliminado"}`}
            />
          </div>
        </div>
      </ContentCard>

      {/* Configuración Básica */}
      <ContentCard 
        title="Configuración Básica" 
        icon={Settings}
      >
        <div className="space-y-8">
          <div>
            <h4 className="text-lg font-semibold mb-4">1. Conexión a la Base de Datos</h4>
            <CodeBlock 
              title="database.py"
              code={`from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./app.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()`}
            />
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">2. Dependencia para la Sesión</h4>
            <CodeBlock 
              code={`def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()`}
            />
          </div>
        </div>
      </ContentCard>

      {/* Resumen */}
      <ContentCard 
        title="Resumen" 
        icon={CheckCircle}
        variant="accent"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold mb-4">Conceptos Clave</h4>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                <span className="text-sm"><strong>Persistencia</strong> - Los datos se guardan permanentemente</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                <span className="text-sm"><strong>SQLite</strong> - Base de datos simple en un archivo</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                <span className="text-sm"><strong>ORM</strong> - Trabajar con objetos Python en lugar de SQL</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                <span className="text-sm"><strong>CRUD</strong> - Create, Read, Update, Delete</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                <span className="text-sm"><strong>Sesiones</strong> - Conexiones a la base de datos</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Lo que Aprendiste</h4>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                <span className="text-sm">Por qué usar bases de datos</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                <span className="text-sm">Configurar SQLite con FastAPI</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                <span className="text-sm">Crear modelos básicos</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                <span className="text-sm">Operaciones CRUD simples</span>
              </li>
            </ul>
          </div>
        </div>
      </ContentCard>
    </div>
  );
};