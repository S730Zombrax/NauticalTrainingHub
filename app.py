import os
import logging
import datetime
import uuid
from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, login_user, logout_user, login_required, current_user, UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from sqlalchemy.orm import DeclarativeBase

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Base class for SQLAlchemy models
class Base(DeclarativeBase):
    pass

# Create Flask app and database
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev_key_change_in_production")

# Database configuration
database_url = os.environ.get("DATABASE_URL")
if not database_url:
    raise RuntimeError("DATABASE_URL environment variable is not set")

app.config["SQLALCHEMY_DATABASE_URI"] = database_url
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}

# File upload configuration
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100MB max file size

# Initialize database
db = SQLAlchemy(app, model_class=Base)

# Initialize login manager
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
login_manager.login_message = 'Debes iniciar sesión para acceder a esta página.'
login_manager.login_message_category = 'info'

# Define models here to avoid circular imports
class Estudiante(UserMixin, db.Model):
    __tablename__ = 'estudiantes'
    
    id = db.Column(db.Integer, primary_key=True)
    cedula = db.Column(db.String(15), unique=True, nullable=False)
    nombre = db.Column(db.String(100), nullable=False)
    apellido = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    telefono = db.Column(db.String(20))
    fecha_nacimiento = db.Column(db.Date)
    direccion = db.Column(db.Text)
    semestre = db.Column(db.Integer, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    fecha_registro = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    activo = db.Column(db.Boolean, default=True)
    
    def get_nombre_completo(self):
        return f'{self.nombre} {self.apellido}'

class Profesor(UserMixin, db.Model):
    __tablename__ = 'profesores'
    
    id = db.Column(db.Integer, primary_key=True)
    cedula = db.Column(db.String(15), unique=True, nullable=False)
    nombre = db.Column(db.String(100), nullable=False)
    apellido = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    telefono = db.Column(db.String(20))
    departamento = db.Column(db.String(100), nullable=False)
    materias = db.Column(db.Text)
    experiencia_anos = db.Column(db.Integer)
    titulo_academico = db.Column(db.String(200))
    password_hash = db.Column(db.String(256), nullable=False)
    fecha_registro = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    activo = db.Column(db.Boolean, default=True)
    
    def get_nombre_completo(self):
        return f'{self.nombre} {self.apellido}'
    
    def get_materias_lista(self):
        if self.materias:
            return [materia.strip() for materia in self.materias.split(',')]
        return []

class EvaluacionDocente(db.Model):
    __tablename__ = 'evaluaciones_docentes'
    
    id = db.Column(db.Integer, primary_key=True)
    estudiante_id = db.Column(db.Integer, db.ForeignKey('estudiantes.id'), nullable=False)
    profesor_id = db.Column(db.Integer, db.ForeignKey('profesores.id'), nullable=False)
    dominio_materia = db.Column(db.Integer, nullable=False)
    claridad_explicacion = db.Column(db.Integer, nullable=False)
    puntualidad = db.Column(db.Integer, nullable=False)
    disponibilidad = db.Column(db.Integer, nullable=False)
    metodologia = db.Column(db.Integer, nullable=False)
    evaluacion_general = db.Column(db.Integer, nullable=False)
    aspectos_positivos = db.Column(db.Text)
    aspectos_mejorar = db.Column(db.Text)
    comentarios_generales = db.Column(db.Text)
    recomendacion = db.Column(db.String(20), nullable=False)
    semestre = db.Column(db.Integer, nullable=False)
    periodo_academico = db.Column(db.String(10), nullable=False)
    fecha_evaluacion = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    
    estudiante = db.relationship('Estudiante', backref='evaluaciones')
    profesor = db.relationship('Profesor', backref='evaluaciones_recibidas')

class VideoClase(db.Model):
    __tablename__ = 'videos_clases'
    
    id = db.Column(db.Integer, primary_key=True)
    profesor_id = db.Column(db.Integer, db.ForeignKey('profesores.id'), nullable=False)
    titulo = db.Column(db.String(200), nullable=False)
    descripcion = db.Column(db.Text)
    materia = db.Column(db.String(100), nullable=False)
    semestre = db.Column(db.Integer)
    archivo_video = db.Column(db.String(500))
    url_video = db.Column(db.String(500))
    duracion_minutos = db.Column(db.Integer)
    fecha_subida = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    activo = db.Column(db.Boolean, default=True)
    
    profesor = db.relationship('Profesor', backref='videos_subidos')

class TokenQRProfesor(db.Model):
    __tablename__ = 'tokens_qr_profesores'
    
    id = db.Column(db.Integer, primary_key=True)
    profesor_id = db.Column(db.Integer, db.ForeignKey('profesores.id'), nullable=False)
    token = db.Column(db.String(100), unique=True, nullable=False)
    fecha_creacion = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    fecha_expiracion = db.Column(db.DateTime)
    activo = db.Column(db.Boolean, default=True)
    usos = db.Column(db.Integer, default=0)
    
    profesor = db.relationship('Profesor', backref='tokens_qr')

# User loader for login manager
@login_manager.user_loader
def load_user(user_id):
    user = Estudiante.query.get(user_id)
    if user:
        user.user_type = 'estudiante'
        return user
    
    user = Profesor.query.get(user_id)
    if user:
        user.user_type = 'profesor'
        return user
    
    return None

# Create upload directory if it doesn't exist
upload_dir = os.path.join(app.root_path, 'static', 'uploads')
os.makedirs(upload_dir, exist_ok=True)

# Create database tables
with app.app_context():
    db.create_all()

# Context processor to add date information to all templates
@app.context_processor
def inject_now():
    return {'now': datetime.datetime.now()}

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/registro')
def registro():
    return render_template('registro.html')

@app.route('/admision')
def admision():
    return render_template('admision.html')

@app.route('/historia')
def historia():
    return render_template('historia.html')

@app.route('/pasantias')
def pasantias():
    return render_template('pasantias.html')

@app.route('/idiomas')
def idiomas():
    return render_template('idiomas.html')

@app.route('/uniforme')
def uniforme():
    return render_template('uniforme.html')

@app.route('/vida-cadete')
def vida_cadete():
    return render_template('vida_cadete.html')

@app.route('/games')
def games():
    return render_template('games.html')

@app.route('/noticias')
def noticias():
    return render_template('noticias.html')

@app.route('/jornada')
def jornada():
    return render_template('jornada.html')

@app.route('/classroom')
def classroom():
    return render_template('classroom.html')

@app.route('/sugerencias', methods=['GET', 'POST'])
def sugerencias():
    if request.method == 'POST':
        nombre = request.form.get('nombre')
        email = request.form.get('email')
        mensaje = request.form.get('mensaje')
        
        # Esta parte del codigo des para la base de datos
        # De momento solo aparecera este comentario
        flash('¡Gracias por tu sugerencia! La revisaremos pronto.', 'success')
        return redirect(url_for('sugerencias'))
        
    return render_template('sugerencias.html')

@app.route('/biblioteca')
def biblioteca():
    return render_template('biblioteca.html')

@app.route('/docentes')
def docentes():
    # Lista de profesores de la institución
    profesores = [
        {
            'id': 1,
            'nombre': 'Dr. Carlos Navarro',
            'materia': 'Ingeniería Naval',
            'departamento': 'Ciencias Marítimas',
            'email': 'c.navarro@umc.edu.ve',
            'experiencia': '15 años'
        },
        {
            'id': 2,
            'nombre': 'Ing. María Fernández',
            'materia': 'Motores Marinos',
            'departamento': 'Ingeniería Mecánica',
            'email': 'm.fernandez@umc.edu.ve',
            'experiencia': '12 años'
        },
        {
            'id': 3,
            'nombre': 'Capt. Roberto Silva',
            'materia': 'Navegación y Maniobra',
            'departamento': 'Ciencias Náuticas',
            'email': 'r.silva@umc.edu.ve',
            'experiencia': '20 años'
        },
        {
            'id': 4,
            'nombre': 'Dra. Ana Rodríguez',
            'materia': 'Derecho Marítimo',
            'departamento': 'Ciencias Jurídicas',
            'email': 'a.rodriguez@umc.edu.ve',
            'experiencia': '18 años'
        },
        {
            'id': 5,
            'nombre': 'Ing. Pedro Morales',
            'materia': 'Sistemas de Propulsión',
            'departamento': 'Ingeniería Mecánica',
            'email': 'p.morales@umc.edu.ve',
            'experiencia': '10 años'
        },
        {
            'id': 6,
            'nombre': 'Prof. Carmen López',
            'materia': 'Comunicaciones Marítimas',
            'departamento': 'Tecnología Naval',
            'email': 'c.lopez@umc.edu.ve',
            'experiencia': '8 años'
        }
    ]
    return render_template('docentes.html', profesores=profesores)

@app.route('/evaluar-docente/<int:profesor_id>', methods=['GET', 'POST'])
def evaluar_docente(profesor_id):
    # Lista de profesores (misma que en /docentes)
    profesores = [
        {'id': 1, 'nombre': 'Dr. Carlos Navarro', 'materia': 'Ingeniería Naval'},
        {'id': 2, 'nombre': 'Ing. María Fernández', 'materia': 'Motores Marinos'},
        {'id': 3, 'nombre': 'Capt. Roberto Silva', 'materia': 'Navegación y Maniobra'},
        {'id': 4, 'nombre': 'Dra. Ana Rodríguez', 'materia': 'Derecho Marítimo'},
        {'id': 5, 'nombre': 'Ing. Pedro Morales', 'materia': 'Sistemas de Propulsión'},
        {'id': 6, 'nombre': 'Prof. Carmen López', 'materia': 'Comunicaciones Marítimas'}
    ]
    
    # Buscar el profesor por ID
    profesor = next((p for p in profesores if p['id'] == profesor_id), None)
    if not profesor:
        flash('Profesor no encontrado.', 'error')
        return redirect(url_for('docentes'))
    
    if request.method == 'POST':
        # Procesar la evaluación (sin base de datos por ahora)
        estudiante_nombre = request.form.get('estudiante_nombre')
        estudiante_cedula = request.form.get('estudiante_cedula')
        
        flash(f'¡Evaluación enviada exitosamente para {profesor["nombre"]}! Gracias por tu retroalimentación.', 'success')
        return redirect(url_for('docentes'))
    
    return render_template('evaluar_docente.html', profesor=profesor)

# Error handlers
@app.errorhandler(404)
def page_not_found(e):
    return render_template('layout.html', error="404 - Página no encontrada"), 404

@app.errorhandler(500)
def server_error(e):
    return render_template('layout.html', error="500 - Error del servidor"), 500
