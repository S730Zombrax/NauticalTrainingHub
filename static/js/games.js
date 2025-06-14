/**
 * Universidad Marítima del Caribe - Ingeniería Marítima
 * Simuladores Educativos Marítimos Interactivos
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todos los simuladores disponibles
    initShipStabilitySimulator();
    initMarineNavigationSimulator();
    initKnotTyingSimulator();
    initWeatherSimulator();
    initEngineRoomSimulator();
    initMarineQuiz();
});

/**
 * Simulador de Estabilidad de Buque
 */
function initShipStabilitySimulator() {
    const container = document.getElementById('stability-simulator');
    if (!container) return;

    const canvas = container.querySelector('canvas') || document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Configurar canvas
    canvas.width = 600;
    canvas.height = 400;
    canvas.style.border = '2px solid #0077b6';
    canvas.style.borderRadius = '8px';
    
    if (!container.querySelector('canvas')) {
        container.appendChild(canvas);
    }

    // Variables del simulador
    let ship = {
        x: 300,
        y: 200,
        width: 150,
        height: 40,
        angle: 0,
        cargo: [],
        centerOfGravity: { x: 300, y: 200 },
        stability: 100
    };

    let water = {
        level: 300,
        waves: []
    };

    let animationId;
    let time = 0;

    // Controles
    const controls = document.createElement('div');
    controls.className = 'simulator-controls mt-3';
    controls.innerHTML = `
        <div class="row">
            <div class="col-md-3">
                <label for="cargo-weight">Peso de Carga (tons)</label>
                <input type="range" id="cargo-weight" min="0" max="100" value="50" class="form-range">
                <span id="cargo-value">50</span> tons
            </div>
            <div class="col-md-3">
                <label for="cargo-position">Posición de Carga</label>
                <input type="range" id="cargo-position" min="0" max="100" value="50" class="form-range">
                <span id="position-value">Centro</span>
            </div>
            <div class="col-md-3">
                <label for="wave-height">Altura de Olas (m)</label>
                <input type="range" id="wave-height" min="0" max="10" value="2" class="form-range">
                <span id="wave-value">2</span> m
            </div>
            <div class="col-md-3">
                <button id="reset-sim" class="btn btn-primary">Reiniciar</button>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-12">
                <div class="alert alert-info">
                    <strong>Estabilidad:</strong> <span id="stability-value">100</span>% 
                    <span id="stability-status" class="badge bg-success">ESTABLE</span>
                </div>
            </div>
        </div>
    `;
    
    if (!container.querySelector('.simulator-controls')) {
        container.appendChild(controls);
    }

    // Event listeners
    document.getElementById('cargo-weight').addEventListener('input', updateSimulation);
    document.getElementById('cargo-position').addEventListener('input', updateSimulation);
    document.getElementById('wave-height').addEventListener('input', updateSimulation);
    document.getElementById('reset-sim').addEventListener('click', resetSimulation);

    function updateSimulation() {
        const cargoWeight = parseInt(document.getElementById('cargo-weight').value);
        const cargoPos = parseInt(document.getElementById('cargo-position').value);
        const waveHeight = parseInt(document.getElementById('wave-height').value);

        // Actualizar valores mostrados
        document.getElementById('cargo-value').textContent = cargoWeight;
        document.getElementById('wave-value').textContent = waveHeight;
        
        const positions = ['Proa', 'Centro-Proa', 'Centro', 'Centro-Popa', 'Popa'];
        document.getElementById('position-value').textContent = positions[Math.floor(cargoPos / 20)];

        // Calcular estabilidad
        let stability = 100;
        
        // Penalizar carga excesiva
        if (cargoWeight > 80) stability -= (cargoWeight - 80) * 2;
        
        // Penalizar posición desequilibrada
        const centerPos = Math.abs(cargoPos - 50);
        stability -= centerPos * 0.8;
        
        // Penalizar olas altas
        stability -= waveHeight * 5;

        // Actualizar ángulo del barco
        ship.angle = (cargoPos - 50) * 0.3 + Math.sin(time * 0.1) * waveHeight * 0.5;
        
        // Actualizar centro de gravedad
        ship.centerOfGravity.x = 300 + (cargoPos - 50) * 2;
        ship.centerOfGravity.y = 200 - cargoWeight * 0.5;

        stability = Math.max(0, Math.min(100, stability));
        ship.stability = stability;

        // Actualizar UI
        document.getElementById('stability-value').textContent = Math.round(stability);
        const statusBadge = document.getElementById('stability-status');
        
        if (stability > 70) {
            statusBadge.textContent = 'ESTABLE';
            statusBadge.className = 'badge bg-success';
        } else if (stability > 40) {
            statusBadge.textContent = 'PRECAUCIÓN';
            statusBadge.className = 'badge bg-warning';
        } else {
            statusBadge.textContent = 'PELIGRO';
            statusBadge.className = 'badge bg-danger';
        }
    }

    function resetSimulation() {
        document.getElementById('cargo-weight').value = 50;
        document.getElementById('cargo-position').value = 50;
        document.getElementById('wave-height').value = 2;
        updateSimulation();
    }

    function draw() {
        // Limpiar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dibujar cielo
        const gradient = ctx.createLinearGradient(0, 0, 0, water.level);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#E0F6FF');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, water.level);

        // Dibujar agua con olas
        ctx.fillStyle = '#0077b6';
        ctx.beginPath();
        ctx.moveTo(0, water.level);
        
        for (let x = 0; x <= canvas.width; x += 5) {
            const waveHeight = parseInt(document.getElementById('wave-height').value);
            const y = water.level + Math.sin(x * 0.02 + time * 0.1) * waveHeight * 2;
            ctx.lineTo(x, y);
        }
        
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fill();

        // Dibujar barco
        ctx.save();
        ctx.translate(ship.x, ship.y);
        ctx.rotate(ship.angle * Math.PI / 180);

        // Casco del barco
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(-ship.width/2, -ship.height/2, ship.width, ship.height);

        // Cubierta
        ctx.fillStyle = '#D2B48C';
        ctx.fillRect(-ship.width/2, -ship.height/2, ship.width, ship.height/3);

        // Superestructura
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(-30, -ship.height, 60, ship.height/2);

        // Centro de gravedad
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.arc(ship.centerOfGravity.x - ship.x, ship.centerOfGravity.y - ship.y, 5, 0, 2 * Math.PI);
        ctx.fill();

        // Línea de flotación
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-ship.width/2, 0);
        ctx.lineTo(ship.width/2, 0);
        ctx.stroke();

        ctx.restore();

        // Actualizar tiempo para animación
        time += 1;
        
        animationId = requestAnimationFrame(draw);
    }

    // Iniciar animación
    updateSimulation();
    draw();
}

/**
 * Simulador de Navegación Marina
 */
function initMarineNavigationSimulator() {
    const container = document.getElementById('navigation-simulator');
    if (!container) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 600;
    canvas.height = 400;
    canvas.style.border = '2px solid #0077b6';
    canvas.style.borderRadius = '8px';
    container.appendChild(canvas);

    let ship = {
        x: 100,
        y: 200,
        angle: 0,
        speed: 0,
        maxSpeed: 5
    };

    let waypoints = [
        { x: 150, y: 150, reached: false },
        { x: 300, y: 100, reached: false },
        { x: 450, y: 200, reached: false },
        { x: 500, y: 350, reached: false }
    ];

    let wind = { direction: 45, strength: 3 };
    let current = { direction: 135, strength: 2 };

    // Controles
    const controls = document.createElement('div');
    controls.className = 'navigation-controls mt-3';
    controls.innerHTML = `
        <div class="row">
            <div class="col-md-3">
                <label>Rumbo</label>
                <div class="btn-group-vertical w-100">
                    <button class="btn btn-outline-primary" id="turn-left">← Babor</button>
                    <button class="btn btn-outline-primary" id="turn-right">Estribor →</button>
                </div>
            </div>
            <div class="col-md-3">
                <label>Velocidad</label>
                <div class="btn-group-vertical w-100">
                    <button class="btn btn-outline-success" id="speed-up">▲ Acelerar</button>
                    <button class="btn btn-outline-danger" id="speed-down">▼ Reducir</button>
                </div>
            </div>
            <div class="col-md-6">
                <div class="navigation-info">
                    <p><strong>Posición:</strong> <span id="ship-position">100, 200</span></p>
                    <p><strong>Rumbo:</strong> <span id="ship-heading">0°</span></p>
                    <p><strong>Velocidad:</strong> <span id="ship-speed">0</span> nudos</p>
                    <p><strong>Waypoints:</strong> <span id="waypoints-count">0/4</span></p>
                </div>
            </div>
        </div>
    `;
    container.appendChild(controls);

    // Event listeners
    document.getElementById('turn-left').addEventListener('click', () => ship.angle -= 15);
    document.getElementById('turn-right').addEventListener('click', () => ship.angle += 15);
    document.getElementById('speed-up').addEventListener('click', () => {
        ship.speed = Math.min(ship.maxSpeed, ship.speed + 1);
    });
    document.getElementById('speed-down').addEventListener('click', () => {
        ship.speed = Math.max(0, ship.speed - 1);
    });

    function updateNavigation() {
        // Mover barco
        const radians = ship.angle * Math.PI / 180;
        ship.x += Math.cos(radians) * ship.speed;
        ship.y += Math.sin(radians) * ship.speed;

        // Efecto del viento y corriente
        ship.x += Math.cos(wind.direction * Math.PI / 180) * wind.strength * 0.1;
        ship.y += Math.sin(wind.direction * Math.PI / 180) * wind.strength * 0.1;
        ship.x += Math.cos(current.direction * Math.PI / 180) * current.strength * 0.1;
        ship.y += Math.sin(current.direction * Math.PI / 180) * current.strength * 0.1;

        // Mantener en límites
        ship.x = Math.max(20, Math.min(canvas.width - 20, ship.x));
        ship.y = Math.max(20, Math.min(canvas.height - 20, ship.y));

        // Verificar waypoints
        waypoints.forEach((waypoint, index) => {
            if (!waypoint.reached) {
                const distance = Math.sqrt(
                    Math.pow(ship.x - waypoint.x, 2) + Math.pow(ship.y - waypoint.y, 2)
                );
                if (distance < 30) {
                    waypoint.reached = true;
                }
            }
        });

        // Actualizar UI
        document.getElementById('ship-position').textContent = 
            `${Math.round(ship.x)}, ${Math.round(ship.y)}`;
        document.getElementById('ship-heading').textContent = 
            `${Math.round(ship.angle)}°`;
        document.getElementById('ship-speed').textContent = ship.speed;
        
        const reachedCount = waypoints.filter(w => w.reached).length;
        document.getElementById('waypoints-count').textContent = `${reachedCount}/4`;
    }

    function drawNavigation() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Fondo marino
        ctx.fillStyle = '#1e3a8a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Dibujar waypoints
        waypoints.forEach((waypoint, index) => {
            ctx.fillStyle = waypoint.reached ? '#00ff00' : '#ffff00';
            ctx.beginPath();
            ctx.arc(waypoint.x, waypoint.y, 15, 0, 2 * Math.PI);
            ctx.fill();
            
            ctx.fillStyle = '#000';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText((index + 1).toString(), waypoint.x, waypoint.y + 4);
        });

        // Dibujar indicadores de viento y corriente
        drawWindIndicator(50, 50);
        drawCurrentIndicator(50, 100);

        // Dibujar barco
        ctx.save();
        ctx.translate(ship.x, ship.y);
        ctx.rotate(ship.angle * Math.PI / 180);

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-15, -8, 30, 16);
        
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.moveTo(15, 0);
        ctx.lineTo(25, -5);
        ctx.lineTo(25, 5);
        ctx.closePath();
        ctx.fill();

        ctx.restore();

        updateNavigation();
        requestAnimationFrame(drawNavigation);
    }

    function drawWindIndicator(x, y) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(wind.direction * Math.PI / 180);
        
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(wind.strength * 5, 0);
        ctx.stroke();
        
        // Flecha
        ctx.beginPath();
        ctx.moveTo(wind.strength * 5, 0);
        ctx.lineTo(wind.strength * 5 - 5, -3);
        ctx.lineTo(wind.strength * 5 - 5, 3);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.fillText('Viento', x + 20, y + 5);
    }

    function drawCurrentIndicator(x, y) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(current.direction * Math.PI / 180);
        
        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(current.strength * 5, 0);
        ctx.stroke();
        
        ctx.restore();
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.fillText('Corriente', x + 20, y + 5);
    }

    drawNavigation();
}

/**
 * Simulador de Nudos Marinos
 */
function initKnotTyingSimulator() {
    const container = document.getElementById('knot-simulator');
    if (!container) return;

    const knots = [
        {
            name: 'As de Guía',
            description: 'Nudo básico que forma una gaza que no se desliza',
            steps: [
                'Formar un pequeño lazo en la cuerda',
                'Pasar el chicote por el lazo desde abajo',
                'Rodear la cuerda firme',
                'Regresar por el lazo original',
                'Apretar gradualmente'
            ],
            image: '🪢'
        },
        {
            name: 'Ballestrinque',
            description: 'Nudo para amarrar a un poste o bita',
            steps: [
                'Dar una vuelta completa al poste',
                'Cruzar por encima de la primera vuelta',
                'Dar otra vuelta en la misma dirección',
                'Pasar el chicote bajo la última vuelta',
                'Apretar firmemente'
            ],
            image: '⚓'
        },
        {
            name: 'Vuelta de Escota',
            description: 'Para unir dos cabos de diferente grosor',
            steps: [
                'Formar una gaza con el cabo más grueso',
                'Pasar el cabo delgado por la gaza',
                'Dar vuelta por detrás de ambos chicotes',
                'Pasar por debajo de sí mismo',
                'Apretar ambos cabos'
            ],
            image: '🧵'
        }
    ];

    let currentKnot = 0;
    let currentStep = 0;

    const knotInterface = document.createElement('div');
    knotInterface.className = 'knot-simulator-interface';
    knotInterface.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="knot-display text-center p-4" style="font-size: 4rem; background: #f8f9fa; border-radius: 10px;">
                    <div id="knot-visual">${knots[currentKnot].image}</div>
                </div>
                <div class="knot-selector mt-3">
                    <select id="knot-select" class="form-select">
                        ${knots.map((knot, index) => 
                            `<option value="${index}">${knot.name}</option>`
                        ).join('')}
                    </select>
                </div>
            </div>
            <div class="col-md-6">
                <div class="knot-instructions">
                    <h4 id="knot-name">${knots[currentKnot].name}</h4>
                    <p id="knot-description">${knots[currentKnot].description}</p>
                    
                    <h5>Pasos:</h5>
                    <ol id="steps-list">
                        ${knots[currentKnot].steps.map((step, index) => 
                            `<li class="${index === currentStep ? 'current-step' : ''}">${step}</li>`
                        ).join('')}
                    </ol>
                    
                    <div class="step-controls mt-3">
                        <button id="prev-step" class="btn btn-secondary">← Anterior</button>
                        <button id="next-step" class="btn btn-primary">Siguiente →</button>
                        <button id="reset-steps" class="btn btn-outline-secondary">Reiniciar</button>
                    </div>
                    
                    <div class="progress mt-3">
                        <div id="progress-bar" class="progress-bar" style="width: 20%"></div>
                    </div>
                </div>
            </div>
        </div>
        
        <style>
            .current-step {
                background-color: #fff3cd;
                padding: 5px;
                border-radius: 5px;
                font-weight: bold;
            }
        </style>
    `;
    
    container.appendChild(knotInterface);

    // Event listeners
    document.getElementById('knot-select').addEventListener('change', function() {
        currentKnot = parseInt(this.value);
        currentStep = 0;
        updateKnotDisplay();
    });

    document.getElementById('next-step').addEventListener('click', function() {
        if (currentStep < knots[currentKnot].steps.length - 1) {
            currentStep++;
            updateKnotDisplay();
        }
    });

    document.getElementById('prev-step').addEventListener('click', function() {
        if (currentStep > 0) {
            currentStep--;
            updateKnotDisplay();
        }
    });

    document.getElementById('reset-steps').addEventListener('click', function() {
        currentStep = 0;
        updateKnotDisplay();
    });

    function updateKnotDisplay() {
        const knot = knots[currentKnot];
        
        document.getElementById('knot-visual').textContent = knot.image;
        document.getElementById('knot-name').textContent = knot.name;
        document.getElementById('knot-description').textContent = knot.description;
        
        const stepsList = document.getElementById('steps-list');
        stepsList.innerHTML = knot.steps.map((step, index) => 
            `<li class="${index === currentStep ? 'current-step' : ''}">${step}</li>`
        ).join('');
        
        const progress = ((currentStep + 1) / knot.steps.length) * 100;
        document.getElementById('progress-bar').style.width = progress + '%';
        
        // Actualizar botones
        document.getElementById('prev-step').disabled = currentStep === 0;
        document.getElementById('next-step').disabled = currentStep === knot.steps.length - 1;
    }

    updateKnotDisplay();
}

/**
 * Simulador de Condiciones Meteorológicas
 */
function initWeatherSimulator() {
    const container = document.getElementById('weather-simulator');
    if (!container) return;

    let weather = {
        windSpeed: 15,
        windDirection: 90,
        visibility: 10,
        seaState: 3,
        barometricPressure: 1013,
        temperature: 20,
        humidity: 65
    };

    const weatherInterface = document.createElement('div');
    weatherInterface.className = 'weather-simulator-interface';
    weatherInterface.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="weather-visual p-4 text-center" style="background: linear-gradient(to bottom, #87CEEB, #4682B4); border-radius: 10px; color: white;">
                    <div style="font-size: 3rem;" id="weather-icon">⛅</div>
                    <h4 id="weather-condition">Condiciones Moderadas</h4>
                    <div class="row mt-3">
                        <div class="col-6">
                            <div><strong>Temperatura</strong></div>
                            <div style="font-size: 1.5rem;" id="temp-display">20°C</div>
                        </div>
                        <div class="col-6">
                            <div><strong>Viento</strong></div>
                            <div style="font-size: 1.5rem;" id="wind-display">15 kt</div>
                        </div>
                    </div>
                </div>
                
                <div class="mt-3">
                    <button id="generate-weather" class="btn btn-primary w-100">Generar Nuevas Condiciones</button>
                </div>
            </div>
            
            <div class="col-md-6">
                <div class="weather-controls">
                    <h5>Condiciones Meteorológicas</h5>
                    
                    <div class="mb-3">
                        <label>Velocidad del Viento: <span id="wind-speed-val">15</span> kt</label>
                        <input type="range" id="wind-speed" min="0" max="50" value="15" class="form-range">
                    </div>
                    
                    <div class="mb-3">
                        <label>Dirección del Viento: <span id="wind-dir-val">90</span>°</label>
                        <input type="range" id="wind-direction" min="0" max="360" value="90" class="form-range">
                    </div>
                    
                    <div class="mb-3">
                        <label>Visibilidad: <span id="visibility-val">10</span> mn</label>
                        <input type="range" id="visibility" min="0" max="20" value="10" class="form-range">
                    </div>
                    
                    <div class="mb-3">
                        <label>Estado del Mar: <span id="sea-state-val">3</span></label>
                        <input type="range" id="sea-state" min="0" max="9" value="3" class="form-range">
                    </div>
                    
                    <div class="alert" id="weather-alert">
                        <strong>Evaluación:</strong> <span id="weather-assessment">Condiciones navegables</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.appendChild(weatherInterface);

    // Event listeners
    const controls = ['wind-speed', 'wind-direction', 'visibility', 'sea-state'];
    controls.forEach(control => {
        document.getElementById(control).addEventListener('input', function() {
            weather[control.replace('-', '')] = parseInt(this.value);
            if (control === 'wind-direction') weather.windDirection = parseInt(this.value);
            if (control === 'wind-speed') weather.windSpeed = parseInt(this.value);
            updateWeatherDisplay();
        });
    });

    document.getElementById('generate-weather').addEventListener('click', generateRandomWeather);

    function updateWeatherDisplay() {
        // Actualizar valores mostrados
        document.getElementById('wind-speed-val').textContent = weather.windSpeed;
        document.getElementById('wind-dir-val').textContent = weather.windDirection;
        document.getElementById('visibility-val').textContent = weather.visibility;
        document.getElementById('sea-state-val').textContent = weather.seaState;
        
        document.getElementById('temp-display').textContent = weather.temperature + '°C';
        document.getElementById('wind-display').textContent = weather.windSpeed + ' kt';

        // Determinar condiciones
        let condition = 'Condiciones Excelentes';
        let icon = '☀️';
        let alertClass = 'alert-success';
        let assessment = 'Condiciones ideales para navegación';

        if (weather.windSpeed > 25 || weather.seaState > 5 || weather.visibility < 5) {
            condition = 'Condiciones Adversas';
            icon = '⛈️';
            alertClass = 'alert-danger';
            assessment = 'Navegación peligrosa - considerar refugio';
        } else if (weather.windSpeed > 15 || weather.seaState > 3 || weather.visibility < 8) {
            condition = 'Condiciones Moderadas';
            icon = '⛅';
            alertClass = 'alert-warning';
            assessment = 'Navegación con precaución';
        }

        document.getElementById('weather-condition').textContent = condition;
        document.getElementById('weather-icon').textContent = icon;
        document.getElementById('weather-assessment').textContent = assessment;
        
        const alert = document.getElementById('weather-alert');
        alert.className = `alert ${alertClass}`;
    }

    function generateRandomWeather() {
        weather.windSpeed = Math.floor(Math.random() * 40) + 5;
        weather.windDirection = Math.floor(Math.random() * 360);
        weather.visibility = Math.floor(Math.random() * 20) + 1;
        weather.seaState = Math.floor(Math.random() * 8);
        weather.temperature = Math.floor(Math.random() * 30) + 5;

        // Actualizar controles
        document.getElementById('wind-speed').value = weather.windSpeed;
        document.getElementById('wind-direction').value = weather.windDirection;
        document.getElementById('visibility').value = weather.visibility;
        document.getElementById('sea-state').value = weather.seaState;

        updateWeatherDisplay();
    }

    updateWeatherDisplay();
}

/**
 * Simulador de Sala de Máquinas
 */
function initEngineRoomSimulator() {
    const container = document.getElementById('engine-simulator');
    if (!container) return;

    let engine = {
        rpm: 0,
        temperature: 20,
        oilPressure: 0,
        fuelLevel: 100,
        running: false,
        throttle: 0
    };

    const engineInterface = document.createElement('div');
    engineInterface.className = 'engine-simulator-interface';
    engineInterface.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="engine-panel p-4" style="background: #2c3e50; border-radius: 10px; color: white;">
                    <h4 class="text-center">Panel de Control del Motor</h4>
                    
                    <div class="row mt-4">
                        <div class="col-6">
                            <div class="gauge">
                                <label>RPM</label>
                                <div class="gauge-value" id="rpm-display" style="font-size: 2rem; color: #00ff00;">0</div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="gauge">
                                <label>Temperatura (°C)</label>
                                <div class="gauge-value" id="temp-display" style="font-size: 2rem; color: #00ff00;">20</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row mt-3">
                        <div class="col-6">
                            <div class="gauge">
                                <label>Presión de Aceite (bar)</label>
                                <div class="gauge-value" id="oil-display" style="font-size: 2rem; color: #00ff00;">0</div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="gauge">
                                <label>Combustible (%)</label>
                                <div class="gauge-value" id="fuel-display" style="font-size: 2rem; color: #00ff00;">100</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="engine-status mt-4 text-center">
                        <div id="engine-status" class="badge bg-danger" style="font-size: 1.2rem;">MOTOR APAGADO</div>
                    </div>
                </div>
            </div>
            
            <div class="col-md-6">
                <div class="engine-controls">
                    <h5>Controles del Motor</h5>
                    
                    <div class="mb-3">
                        <button id="start-engine" class="btn btn-success w-100">Arrancar Motor</button>
                    </div>
                    
                    <div class="mb-3">
                        <button id="stop-engine" class="btn btn-danger w-100">Parar Motor</button>
                    </div>
                    
                    <div class="mb-3">
                        <label>Acelerador: <span id="throttle-val">0</span>%</label>
                        <input type="range" id="throttle" min="0" max="100" value="0" class="form-range">
                    </div>
                    
                    <div class="emergency-controls mt-4">
                        <h6>Controles de Emergencia</h6>
                        <button id="emergency-stop" class="btn btn-outline-danger w-100">PARADA DE EMERGENCIA</button>
                    </div>
                    
                    <div class="alert mt-3" id="engine-alert">
                        <strong>Estado:</strong> <span id="engine-message">Motor listo para arranque</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.appendChild(engineInterface);

    // Event listeners
    document.getElementById('start-engine').addEventListener('click', startEngine);
    document.getElementById('stop-engine').addEventListener('click', stopEngine);
    document.getElementById('emergency-stop').addEventListener('click', emergencyStop);
    document.getElementById('throttle').addEventListener('input', function() {
        if (engine.running) {
            engine.throttle = parseInt(this.value);
            updateEngineParameters();
        }
    });

    function startEngine() {
        if (!engine.running) {
            engine.running = true;
            engine.oilPressure = 2.5;
            updateEngineDisplay();
            updateEngineParameters();
            
            document.getElementById('engine-message').textContent = 'Motor arrancado correctamente';
            document.getElementById('engine-alert').className = 'alert alert-success';
        }
    }

    function stopEngine() {
        engine.running = false;
        engine.rpm = 0;
        engine.throttle = 0;
        engine.oilPressure = 0;
        engine.temperature = 20;
        
        document.getElementById('throttle').value = 0;
        updateEngineDisplay();
        
        document.getElementById('engine-message').textContent = 'Motor apagado';
        document.getElementById('engine-alert').className = 'alert alert-info';
    }

    function emergencyStop() {
        stopEngine();
        document.getElementById('engine-message').textContent = 'PARADA DE EMERGENCIA ACTIVADA';
        document.getElementById('engine-alert').className = 'alert alert-danger';
    }

    function updateEngineParameters() {
        if (engine.running) {
            // Calcular RPM basado en acelerador
            engine.rpm = Math.floor(500 + (engine.throttle * 15));
            
            // Temperatura aumenta con RPM
            engine.temperature = 20 + (engine.throttle * 0.8);
            
            // Presión de aceite
            engine.oilPressure = 2.5 + (engine.throttle * 0.03);
            
            // Consumo de combustible
            if (engine.throttle > 0) {
                engine.fuelLevel = Math.max(0, engine.fuelLevel - 0.1);
            }
            
            document.getElementById('throttle-val').textContent = engine.throttle;
        }
        
        updateEngineDisplay();
        
        // Continuar actualización si el motor está encendido
        if (engine.running) {
            setTimeout(updateEngineParameters, 1000);
        }
    }

    function updateEngineDisplay() {
        document.getElementById('rpm-display').textContent = engine.rpm;
        document.getElementById('temp-display').textContent = Math.round(engine.temperature);
        document.getElementById('oil-display').textContent = engine.oilPressure.toFixed(1);
        document.getElementById('fuel-display').textContent = Math.round(engine.fuelLevel);

        // Status del motor
        const status = document.getElementById('engine-status');
        if (engine.running) {
            status.textContent = 'MOTOR FUNCIONANDO';
            status.className = 'badge bg-success';
        } else {
            status.textContent = 'MOTOR APAGADO';
            status.className = 'badge bg-danger';
        }

        // Cambiar colores según valores
        const rpmColor = engine.rpm > 1500 ? '#ff6b6b' : '#00ff00';
        const tempColor = engine.temperature > 60 ? '#ff6b6b' : '#00ff00';
        const oilColor = engine.oilPressure < 2 ? '#ff6b6b' : '#00ff00';
        const fuelColor = engine.fuelLevel < 20 ? '#ff6b6b' : '#00ff00';

        document.getElementById('rpm-display').style.color = rpmColor;
        document.getElementById('temp-display').style.color = tempColor;
        document.getElementById('oil-display').style.color = oilColor;
        document.getElementById('fuel-display').style.color = fuelColor;

        // Alertas
        if (engine.temperature > 80) {
            document.getElementById('engine-message').textContent = 'ADVERTENCIA: Temperatura alta del motor';
            document.getElementById('engine-alert').className = 'alert alert-warning';
        } else if (engine.fuelLevel < 10) {
            document.getElementById('engine-message').textContent = 'ADVERTENCIA: Nivel de combustible bajo';
            document.getElementById('engine-alert').className = 'alert alert-warning';
        }
    }

    updateEngineDisplay();
}

/**
 * Cuestionario de Conocimientos Marinos
 */
function initMarineQuiz() {
    const container = document.getElementById('marine-quiz');
    if (!container) return;

    const questions = [
        {
            question: "¿Qué significa la luz verde en la banda de estribor?",
            options: ["Peligro", "Avante", "Estribor (derecha)", "Babor (izquierda)"],
            correct: 2,
            explanation: "La luz verde siempre se coloca en estribor (lado derecho del buque)."
        },
        {
            question: "¿Cuál es la señal internacional de socorro?",
            options: ["SOS", "MAYDAY", "PAN-PAN", "SECURITY"],
            correct: 1,
            explanation: "MAYDAY es la señal internacional de socorro por radio en situaciones de peligro grave."
        },
        {
            question: "¿Qué indica el número 6 en la escala de Beaufort?",
            options: ["Calma", "Brisa fuerte", "Temporal", "Huracán"],
            correct: 1,
            explanation: "El número 6 en la escala de Beaufort indica viento fuerte (22-27 nudos)."
        },
        {
            question: "¿Cuántas millas náuticas tiene un grado de latitud?",
            options: ["50", "60", "70", "80"],
            correct: 1,
            explanation: "Un grado de latitud equivale a 60 millas náuticas."
        },
        {
            question: "¿Qué significa 'adrizar' un buque?",
            options: ["Acelerar", "Frenar", "Enderezar", "Girar"],
            correct: 2,
            explanation: "Adrizar significa enderezar el buque, volver a su posición normal."
        }
    ];

    let currentQuestion = 0;
    let score = 0;
    let answered = false;

    const quizInterface = document.createElement('div');
    quizInterface.className = 'marine-quiz-interface';
    quizInterface.innerHTML = `
        <div class="quiz-header text-center mb-4">
            <h4>Cuestionario de Conocimientos Marinos</h4>
            <div class="progress">
                <div id="quiz-progress" class="progress-bar" style="width: 0%"></div>
            </div>
            <p class="mt-2">Pregunta <span id="question-number">1</span> de ${questions.length}</p>
        </div>
        
        <div class="quiz-content">
            <div class="question-card card">
                <div class="card-body">
                    <h5 id="question-text" class="card-title"></h5>
                    <div id="options-container" class="mt-3"></div>
                    <div id="explanation" class="alert alert-info mt-3" style="display: none;"></div>
                </div>
            </div>
            
            <div class="quiz-controls mt-3 text-center">
                <button id="next-question" class="btn btn-primary" style="display: none;">Siguiente Pregunta</button>
                <button id="finish-quiz" class="btn btn-success" style="display: none;">Finalizar Cuestionario</button>
                <button id="restart-quiz" class="btn btn-outline-secondary" style="display: none;">Reiniciar</button>
            </div>
        </div>
        
        <div id="quiz-results" class="quiz-results" style="display: none;">
            <div class="card">
                <div class="card-body text-center">
                    <h4>¡Cuestionario Completado!</h4>
                    <div style="font-size: 3rem;" id="score-display">0/${questions.length}</div>
                    <div id="score-message" class="mt-3"></div>
                    <button id="restart-from-results" class="btn btn-primary mt-3">Intentar de Nuevo</button>
                </div>
            </div>
        </div>
    `;
    
    container.appendChild(quizInterface);

    // Event listeners
    document.getElementById('next-question').addEventListener('click', nextQuestion);
    document.getElementById('finish-quiz').addEventListener('click', showResults);
    document.getElementById('restart-quiz').addEventListener('click', restartQuiz);
    document.getElementById('restart-from-results').addEventListener('click', restartQuiz);

    function showQuestion() {
        const question = questions[currentQuestion];
        answered = false;
        
        document.getElementById('question-number').textContent = currentQuestion + 1;
        document.getElementById('question-text').textContent = question.question;
        
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = question.options.map((option, index) => 
            `<div class="form-check mb-2">
                <input class="form-check-input" type="radio" name="answer" id="option${index}" value="${index}">
                <label class="form-check-label" for="option${index}">${option}</label>
            </div>`
        ).join('');
        
        // Event listeners para opciones
        document.querySelectorAll('input[name="answer"]').forEach(input => {
            input.addEventListener('change', checkAnswer);
        });
        
        document.getElementById('explanation').style.display = 'none';
        document.getElementById('next-question').style.display = 'none';
        document.getElementById('finish-quiz').style.display = 'none';
        
        // Actualizar barra de progreso
        const progress = ((currentQuestion + 1) / questions.length) * 100;
        document.getElementById('quiz-progress').style.width = progress + '%';
    }

    function checkAnswer() {
        if (answered) return;
        
        const selectedAnswer = parseInt(document.querySelector('input[name="answer"]:checked').value);
        const question = questions[currentQuestion];
        answered = true;
        
        // Deshabilitar todas las opciones
        document.querySelectorAll('input[name="answer"]').forEach(input => {
            input.disabled = true;
            const label = document.querySelector(`label[for="${input.id}"]`);
            
            if (parseInt(input.value) === question.correct) {
                label.style.backgroundColor = '#d4edda';
                label.style.color = '#155724';
                label.style.padding = '5px';
                label.style.borderRadius = '5px';
            } else if (parseInt(input.value) === selectedAnswer) {
                label.style.backgroundColor = '#f8d7da';
                label.style.color = '#721c24';
                label.style.padding = '5px';
                label.style.borderRadius = '5px';
            }
        });
        
        // Mostrar explicación
        const explanation = document.getElementById('explanation');
        explanation.textContent = question.explanation;
        explanation.style.display = 'block';
        
        // Actualizar puntuación
        if (selectedAnswer === question.correct) {
            score++;
            explanation.className = 'alert alert-success mt-3';
        } else {
            explanation.className = 'alert alert-danger mt-3';
        }
        
        // Mostrar botón apropiado
        if (currentQuestion < questions.length - 1) {
            document.getElementById('next-question').style.display = 'inline-block';
        } else {
            document.getElementById('finish-quiz').style.display = 'inline-block';
        }
    }

    function nextQuestion() {
        currentQuestion++;
        showQuestion();
    }

    function showResults() {
        document.querySelector('.quiz-content').style.display = 'none';
        document.querySelector('.quiz-header').style.display = 'none';
        
        const results = document.getElementById('quiz-results');
        results.style.display = 'block';
        
        document.getElementById('score-display').textContent = `${score}/${questions.length}`;
        
        const percentage = (score / questions.length) * 100;
        let message = '';
        
        if (percentage >= 80) {
            message = '¡Excelente conocimiento marítimo! 🚢';
        } else if (percentage >= 60) {
            message = 'Buen conocimiento, sigue estudiando. ⚓';
        } else {
            message = 'Necesitas repasar los conceptos marítimos. 📚';
        }
        
        document.getElementById('score-message').textContent = message;
    }

    function restartQuiz() {
        currentQuestion = 0;
        score = 0;
        answered = false;
        
        document.querySelector('.quiz-content').style.display = 'block';
        document.querySelector('.quiz-header').style.display = 'block';
        document.getElementById('quiz-results').style.display = 'none';
        
        showQuestion();
    }

    // Inicializar quiz
    showQuestion();
}