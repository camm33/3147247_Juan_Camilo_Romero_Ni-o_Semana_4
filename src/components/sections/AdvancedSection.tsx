import { ContentCard } from "@/components/ContentCard";
import { CodeBlock } from "@/components/CodeBlock";
import { Badge } from "@/components/ui/badge";
import { 
  Zap,
  Users,
  Link,
  Database,
  Code,
  CheckCircle,
  BookOpen,
  Settings
} from "lucide-react";

export const AdvancedSection = () => {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center py-8 bg-gradient-to-r from-primary/10 via-accent/10 to-primary-glow/10 rounded-xl border border-primary/20">
        <Zap className="w-12 h-12 mx-auto mb-4 text-primary" />
        <h1 className="text-3xl font-bold mb-2">SQLAlchemy Avanzado</h1>
        <p className="text-muted-foreground">Modelos completos, relaciones y operaciones avanzadas</p>
      </div>

      {/* Modelos Completos */}
      <ContentCard title="Modelos SQLAlchemy Completos" icon={Database} variant="primary">
        <CodeBlock 
          title="models.py - Con relaciones"
          code={`from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relación con posts
    posts = relationship("Post", back_populates="owner")

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    content = Column(Text, nullable=False)
    published = Column(Boolean, default=False)
    owner_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relación con usuario
    owner = relationship("User", back_populates="posts")`}
        />
      </ContentCard>

      {/* Esquemas Pydantic */}
      <ContentCard title="Esquemas Pydantic Avanzados" icon={Code}>
        <CodeBlock 
          title="schemas.py - Con relaciones y validaciones"
          code={`from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional

# Esquemas base
class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    is_active: Optional[bool] = None

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Esquemas para Post
class PostBase(BaseModel):
    title: str
    content: str
    published: bool = False

class PostCreate(PostBase):
    pass

class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    published: Optional[bool] = None

class Post(PostBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    owner: User

    class Config:
        from_attributes = True

# Esquemas con relaciones
class UserWithPosts(User):
    posts: List[Post] = []`}
        />
      </ContentCard>

      {/* Operaciones CRUD Avanzadas */}
      <ContentCard title="Operaciones CRUD Avanzadas" icon={Settings} variant="accent">
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3">Configuración de Contraseñas</h4>
            <CodeBlock 
              code={`from passlib.context import CryptContext

# Configuración de hash de contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)`}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">CRUD para Usuario</h4>
            <CodeBlock 
              code={`def create_user(db: Session, user: schemas.UserCreate) -> models.User:
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        username=user.username,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_email(db: Session, email: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[models.User]:
    return db.query(models.User).offset(skip).limit(limit).all()`}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">CRUD para Posts</h4>
            <CodeBlock 
              code={`def create_post(db: Session, post: schemas.PostCreate, user_id: int) -> models.Post:
    db_post = models.Post(**post.dict(), owner_id=user_id)
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

def get_posts_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[models.Post]:
    return db.query(models.Post).filter(models.Post.owner_id == user_id).offset(skip).limit(limit).all()

def get_published_posts(db: Session) -> List[models.Post]:
    """Obtener solo posts publicados"""
    return db.query(models.Post).filter(models.Post.published == True).all()`}
            />
          </div>
        </div>
      </ContentCard>

      {/* API Endpoints Completos */}
      <ContentCard title="API Endpoints Completos" icon={Link}>
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3">Endpoints para Usuarios</h4>
            <CodeBlock 
              code={`@app.post("/users/", response_model=schemas.User, status_code=status.HTTP_201_CREATED)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Verificar si el usuario ya existe
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    return crud.create_user(db=db, user=user)

@app.get("/users/{user_id}", response_model=schemas.UserWithPosts)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user`}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">Endpoints para Posts</h4>
            <CodeBlock 
              code={`@app.post("/users/{user_id}/posts/", response_model=schemas.Post)
def create_post_for_user(user_id: int, post: schemas.PostCreate, db: Session = Depends(get_db)):
    # Verificar que el usuario existe
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    return crud.create_post(db=db, post=post, user_id=user_id)

@app.get("/posts/", response_model=List[schemas.Post])
def read_posts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    posts = crud.get_posts(db, skip=skip, limit=limit)
    return posts`}
            />
          </div>
        </div>
      </ContentCard>

      {/* Consultas Avanzadas */}
      <ContentCard title="Consultas Avanzadas" icon={Database} variant="primary">
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3">Filtros y Búsquedas</h4>
            <CodeBlock 
              code={`def search_users(db: Session, search_term: str) -> List[models.User]:
    """Buscar usuarios por email o username"""
    return db.query(models.User).filter(
        or_(
            models.User.email.contains(search_term),
            models.User.username.contains(search_term)
        )
    ).all()

def get_active_users(db: Session) -> List[models.User]:
    """Obtener solo usuarios activos"""
    return db.query(models.User).filter(models.User.is_active == True).all()

def get_posts_with_users(db: Session) -> List[models.Post]:
    """Obtener posts con información del usuario (JOIN)"""
    return db.query(models.Post).join(models.User).all()`}
            />
          </div>
        </div>
      </ContentCard>

      {/* Requirements */}
      <ContentCard title="Requirements.txt Completo" icon={Settings}>
        <CodeBlock 
          title="requirements.txt"
          language="text"
          code={`fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
alembic==1.12.1
python-dotenv==1.0.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
email-validator==2.1.0

# Para PostgreSQL
psycopg2-binary==2.9.9

# Para MySQL
# PyMySQL==1.1.0`}
        />
      </ContentCard>

      {/* Comandos Útiles */}
      <ContentCard title="Comandos Útiles" icon={Code}>
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3">Desarrollo</h4>
            <CodeBlock 
              language="bash"
              code={`# Ejecutar la aplicación
uvicorn main:app --reload

# Crear migración con Alembic
alembic init alembic
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head`}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">Pruebas con curl</h4>
            <CodeBlock 
              language="bash"
              code={`# Crear usuario
curl -X POST "http://localhost:8000/users/" \\
     -H "Content-Type: application/json" \\
     -d '{
       "email": "user@example.com",
       "username": "testuser",
       "password": "secretpassword"
     }'

# Crear post para usuario
curl -X POST "http://localhost:8000/users/1/posts/" \\
     -H "Content-Type: application/json" \\
     -d '{
       "title": "Mi primer post",
       "content": "Contenido del post",
       "published": true
     }'`}
            />
          </div>
        </div>
      </ContentCard>

      {/* Mejores Prácticas */}
      <ContentCard title="Mejores Prácticas" icon={CheckCircle} variant="accent">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-4">Arquitectura</h4>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                <span className="text-sm">Separación de responsabilidades: modelos, esquemas y CRUD</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                <span className="text-sm">Validación de datos con Pydantic</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                <span className="text-sm">Manejo apropiado de errores HTTP</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                <span className="text-sm">Variables de entorno para configuración</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Base de Datos</h4>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                <span className="text-sm">Usar Alembic para migraciones</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                <span className="text-sm">Siempre cerrar sesiones de base de datos</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                <span className="text-sm">Agregar índices apropiados</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                <span className="text-sm">Implementar soft delete cuando sea necesario</span>
              </li>
            </ul>
          </div>
        </div>
      </ContentCard>

      {/* Ejercicios Prácticos */}
      <ContentCard title="Ejercicios Prácticos" icon={BookOpen}>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Badge variant="secondary" className="mt-1">Básico</Badge>
            <span>Agrega un modelo Category y relación con Post</span>
          </div>
          <div className="flex items-start space-x-3">
            <Badge variant="default" className="mt-1">Intermedio</Badge>
            <span>Implementa paginación avanzada con metadatos</span>
          </div>
          <div className="flex items-start space-x-3">
            <Badge variant="outline" className="mt-1">Avanzado</Badge>
            <span>Agrega full-text search usando PostgreSQL</span>
          </div>
          <div className="flex items-start space-x-3">
            <Badge className="mt-1 bg-gradient-primary text-primary-foreground">Bonus</Badge>
            <span>Implementa soft delete (borrado lógico)</span>
          </div>
        </div>
      </ContentCard>

      {/* Recursos */}
      <ContentCard title="Recursos Adicionales" icon={BookOpen} variant="primary">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-3">Documentación Oficial</h4>
            <ul className="space-y-2 text-sm">
              <li>• <a href="#" className="text-primary hover:underline">Documentación de SQLAlchemy</a></li>
              <li>• <a href="#" className="text-primary hover:underline">FastAPI con bases de datos</a></li>
              <li>• <a href="#" className="text-primary hover:underline">Alembic Documentation</a></li>
              <li>• <a href="#" className="text-primary hover:underline">Pydantic Documentation</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Debugging y Logs</h4>
            <CodeBlock 
              language="python"
              code={`# En database.py - Para debugging SQL
import logging

logging.basicConfig()
logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)

# Engine con echo para ver SQL queries
engine = create_engine(DATABASE_URL, echo=True)`}
            />
          </div>
        </div>
      </ContentCard>
    </div>
  );
};