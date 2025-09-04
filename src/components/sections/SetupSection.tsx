import { ContentCard } from "@/components/ContentCard";
import { CodeBlock } from "@/components/CodeBlock";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Settings, 
  Package, 
  FileText, 
  Play, 
  CheckCircle, 
  AlertTriangle,
  Database,
  Timer,
  Target
} from "lucide-react";

export const SetupSection = () => {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center py-8 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20">
        <Settings className="w-12 h-12 mx-auto mb-4 text-primary" />
        <h1 className="text-3xl font-bold mb-2">SQLAlchemy Setup</h1>
        <p className="text-muted-foreground">Configuración de Base de Datos</p>
        <div className="flex items-center justify-center space-x-4 mt-4">
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Timer className="w-3 h-3" />
            <span>30 minutos</span>
          </Badge>
        </div>
      </div>

      {/* Objetivos */}
      <ContentCard title="Objetivos" icon={Target} variant="primary">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-success mt-0.5" />
            <span>Instalar SQLAlchemy y dependencias</span>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-success mt-0.5" />
            <span>Configurar la conexión a base de datos</span>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-success mt-0.5" />
            <span>Crear el primer modelo simple</span>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-success mt-0.5" />
            <span>Conectar FastAPI con la base de datos</span>
          </div>
        </div>
      </ContentCard>

      {/* Instalación */}
      <ContentCard title="Instalación" icon={Package} variant="accent">
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3">Dependencias Básicas</h4>
            <CodeBlock 
              title="Terminal"
              language="bash"
              code={`pip install sqlalchemy
pip install python-dotenv`}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">Para Diferentes Bases de Datos</h4>
            <CodeBlock 
              title="Opcionales"
              language="bash"
              code={`# SQLite (ya incluido en Python)
# No necesitas instalar nada adicional

# PostgreSQL (si planeas usar PostgreSQL)
pip install psycopg2-binary

# MySQL (si planeas usar MySQL)
pip install pymysql`}
            />
          </div>
        </div>
      </ContentCard>

      {/* Estructura de Archivos */}
      <ContentCard title="Estructura de Archivos" icon={FileText}>
        <CodeBlock 
          title="Organización del proyecto"
          language="text"
          code={`proyecto/
├── .env              # Variables de entorno
├── database.py       # Configuración de la base de datos
├── models.py        # Modelos SQLAlchemy (básicos)
└── main.py          # Aplicación FastAPI`}
        />
      </ContentCard>

      {/* Variables de Entorno */}
      <ContentCard title="Variables de Entorno" icon={Settings}>
        <CodeBlock 
          title=".env"
          language="bash"
          code={`# Para desarrollo local con SQLite
DATABASE_URL=sqlite:///./fastapi_app.db

# Para PostgreSQL (comentado por ahora)
# DATABASE_URL=postgresql://username:password@localhost/dbname`}
        />
      </ContentCard>

      {/* Configuración de Base de Datos */}
      <ContentCard title="Configuración de Base de Datos" icon={Database} variant="primary">
        <CodeBlock 
          title="database.py"
          code={`from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# URL de la base de datos
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")

# Crear engine
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}  # Solo necesario para SQLite
)

# Crear sesión
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para los modelos
Base = declarative_base()

# Función para obtener la sesión de base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()`}
        />
      </ContentCard>

      {/* Primer Modelo */}
      <ContentCard title="Primer Modelo Simple" icon={FileText}>
        <CodeBlock 
          title="models.py"
          code={`from sqlalchemy import Boolean, Column, Integer, String, DateTime
from sqlalchemy.sql import func
from database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(String, nullable=True)
    price = Column(Integer, nullable=False)  # Precio en centavos
    is_available = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())`}
        />
      </ContentCard>

      {/* Integración con FastAPI */}
      <ContentCard title="Integración con FastAPI" icon={Play} variant="accent">
        <CodeBlock 
          title="main.py"
          code={`from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
import models
from database import engine, get_db

# Crear las tablas en la base de datos
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="FastAPI con SQLAlchemy",
    description="Setup básico de base de datos",
    version="1.0.0"
)

@app.get("/")
def read_root():
    return {"message": "FastAPI con SQLAlchemy funcionando!"}

@app.get("/test-db")
def test_database(db: Session = Depends(get_db)):
    """Endpoint para probar la conexión a la base de datos"""
    try:
        # Realizar una consulta simple
        result = db.execute("SELECT 1").fetchone()
        return {"database": "connected", "test_query": result[0]}
    except Exception as e:
        return {"database": "error", "message": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)`}
        />
      </ContentCard>

      {/* Probar la Configuración */}
      <ContentCard title="Probar la Configuración" icon={Play}>
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3">1. Ejecutar la aplicación</h4>
            <CodeBlock 
              language="bash"
              code={`uvicorn main:app --reload`}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">2. Probar endpoints</h4>
            <CodeBlock 
              language="bash"
              code={`# Endpoint básico
curl http://localhost:8000/

# Probar conexión a base de datos
curl http://localhost:8000/test-db`}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">3. Verificación</h4>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                <span className="text-sm">Deberías ver un archivo <code>fastapi_app.db</code> en tu directorio</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                <span className="text-sm">El endpoint <code>/test-db</code> debería retornar <code>{`{"database": "connected", "test_query": 1}`}</code></span>
              </li>
            </ul>
          </div>
        </div>
      </ContentCard>

      {/* Estructura Final */}
      <ContentCard title="Estructura Final" icon={CheckCircle} variant="primary">
        <div className="space-y-4">
          <p>Al completar esta práctica tendrás:</p>
          <CodeBlock 
            language="text"
            code={`proyecto/
├── .env              # ✅ Variables de entorno
├── database.py       # ✅ Configuración de SQLAlchemy
├── models.py         # ✅ Modelo Product básico
├── main.py           # ✅ FastAPI con conexión a BD
└── fastapi_app.db    # ✅ Base de datos SQLite (se crea automáticamente)`}
          />
        </div>
      </ContentCard>

      {/* Verificación */}
      <ContentCard title="Lista de Verificación" icon={CheckCircle}>
        <div className="space-y-3">
          <p className="font-medium mb-4">Marca como completado cuando:</p>
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="rounded border-border" />
              <span>La aplicación inicia sin errores</span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="rounded border-border" />
              <span>El endpoint <code>/</code> responde correctamente</span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="rounded border-border" />
              <span>El endpoint <code>/test-db</code> muestra "connected"</span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="rounded border-border" />
              <span>Se creó el archivo de base de datos</span>
            </label>
          </div>
        </div>
      </ContentCard>

      {/* Troubleshooting */}
      <ContentCard title="Troubleshooting" icon={AlertTriangle}>
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-warning mb-3">Error común 1: ImportError: No module named 'sqlalchemy'</h4>
            <CodeBlock 
              language="bash"
              code={`# Solución: Instalar SQLAlchemy
pip install sqlalchemy`}
            />
          </div>

          <div>
            <h4 className="font-semibold text-warning mb-3">Error común 2: RuntimeError: There is no current event loop</h4>
            <CodeBlock 
              language="bash"
              code={`# Solución: Usar uvicorn en lugar de python directamente
uvicorn main:app --reload`}
            />
          </div>

          <div>
            <h4 className="font-semibold text-warning mb-3">Error común 3: No se encuentra el archivo .env</h4>
            <CodeBlock 
              language="bash"
              code={`# Solución: Crear el archivo .env en el directorio raíz
echo "DATABASE_URL=sqlite:///./fastapi_app.db" > .env`}
            />
          </div>
        </div>
      </ContentCard>
    </div>
  );
};