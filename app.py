import os
import logging
import datetime
from flask import Flask, render_template, request, redirect, url_for, flash

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Create Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev_key_change_in_production")

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
