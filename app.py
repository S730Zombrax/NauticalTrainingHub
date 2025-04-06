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

@app.route('/sugerencias', methods=['GET', 'POST'])
def sugerencias():
    if request.method == 'POST':
        nombre = request.form.get('nombre')
        email = request.form.get('email')
        mensaje = request.form.get('mensaje')
        
        # In a real application, this would save to a database
        # For now, just flash a success message
        flash('¡Gracias por tu sugerencia! La revisaremos pronto.', 'success')
        return redirect(url_for('sugerencias'))
        
    return render_template('sugerencias.html')

@app.route('/biblioteca')
def biblioteca():
    return render_template('biblioteca.html')

# Error handlers
@app.errorhandler(404)
def page_not_found(e):
    return render_template('layout.html', error="404 - Página no encontrada"), 404

@app.errorhandler(500)
def server_error(e):
    return render_template('layout.html', error="500 - Error del servidor"), 500
