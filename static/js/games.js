/**
 * Universidad Marítima del Caribe - Ingeniería Marítima
 * Juegos Educativos Interactivos
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar simulador de estabilidad de buque si existe
    initStabilitySimulator();
    
    // Inicializar cuestionario de conocimientos marinos si existe
    initMarineQuiz();
    
    // Inicializar herramienta de navegación si existe
    initNavigationTool();
});

/**
 * Inicializar simulador de estabilidad de buque
 */
function initStabilitySimulator() {
    const simulator = document.getElementById('stability-simulator');
    if (!simulator) return;
    
    const canvas = simulator.querySelector('canvas');
    const context = canvas.getContext('2d');
    const controlPanel = simulator.querySelector('.simulator-controls');
    
    // Configurar tamaño del canvas
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = 400;
    
    // Propiedades del buque
    const ship = {
        width: canvas.width * 0.6,
        height: canvas.height * 0.3,
        x: canvas.width * 0.2,
        y: canvas.height * 0.5,
        angle: 0,
        waterLevel: canvas.height * 0.6,
        cargo: []
    };
    
    // Propiedades del agua
    const water = {
        level: canvas.height * 0.6,
        color: '#0077b6',
        waveAmplitude: 3,
        waveFrequency: 0.05,
        wavePhase: 0
    };
    
    // Función para dibujar el buque
    function drawShip() {
        context.save();
        
        // Trasladar al centro del buque para rotación
        context.translate(ship.x + ship.width / 2, ship.y + ship.height / 2);
        context.rotate(ship.angle);
        
        // Dibujar casco
        context.fillStyle = '#343a40';
        context.beginPath();
        context.moveTo(-ship.width / 2, -ship.height / 2);
        context.lineTo(ship.width / 2, -ship.height / 2);
        context.lineTo(ship.width / 2 + 20, 0);
        context.lineTo(ship.width / 2, ship.height / 2);
        context.lineTo(-ship.width / 2, ship.height / 2);
        context.lineTo(-ship.width / 2 - 20, 0);
        context.closePath();
        context.fill();
        
        // Dibujar cubierta
        context.fillStyle = '#6c757d';
        context.fillRect(-ship.width / 2, -ship.height / 2, ship.width, 10);
        
        // Dibujar carga
        ship.cargo.forEach(item => {
            context.fillStyle = item.color;
            context.fillRect(item.x - ship.width / 2, -ship.height / 2 + 10, item.width, item.height);
        });
        
        context.restore();
    }
    
    // Función para dibujar agua con olas
    function drawWater() {
        context.fillStyle = water.color;
        
        context.beginPath();
        context.moveTo(0, water.level);
        
        // Dibujar superficie del agua con olas
        for (let x = 0; x < canvas.width; x += 10) {
            const y = water.level + Math.sin(x * water.waveFrequency + water.wavePhase) * water.waveAmplitude;
            context.lineTo(x, y);
        }
        
        context.lineTo(canvas.width, canvas.height);
        context.lineTo(0, canvas.height);
        context.closePath();
        context.fill();
    }
    
    // Función para actualizar la simulación
    function updateSimulation() {
        // Calcular torque total y distribución de peso
        let totalTorque = 0;
        let totalWeight = 0;
        
        ship.cargo.forEach(item => {
            const relativeX = item.x - ship.width / 2;
            totalTorque += relativeX * item.weight;
            totalWeight += item.weight;
        });
        
        // Calcular nuevo ángulo basado en el torque
        const stabilityFactor = 0.00005;
        const dampingFactor = 0.95;
        
        // Aplicar torque para crear rotación
        ship.angle = totalWeight > 0 ? 
            (totalTorque / totalWeight) * stabilityFactor : 0;
        
        // Limitar ángulo a valores razonables
        ship.angle = Math.max(Math.min(ship.angle, Math.PI / 6), -Math.PI / 6);
        
        // Actualizar animación de olas de agua
        water.wavePhase += 0.05;
        
        // Limpiar canvas y redibujar
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawWater();
        drawShip();
        
        // Actualizar indicador de estabilidad
        const stabilityIndicator = document.getElementById('stability-indicator');
        const angle = Math.abs(ship.angle * (180 / Math.PI));
        
        if (stabilityIndicator) {
            // Actualizar estado de estabilidad
            if (angle < 5) {
                stabilityIndicator.textContent = 'Estable';
                stabilityIndicator.className = 'badge bg-success';
            } else if (angle < 15) {
                stabilityIndicator.textContent = 'Precaución';
                stabilityIndicator.className = 'badge bg-warning';
            } else {
                stabilityIndicator.textContent = 'Inestable';
                stabilityIndicator.className = 'badge bg-danger';
            }
        }
        
        // Continuar bucle de animación
        requestAnimationFrame(updateSimulation);
    }
    
    // Crear elemento de carga al hacer clic en el botón añadir carga
    const addCargoBtn = simulator.querySelector('#add-cargo');
    if (addCargoBtn) {
        addCargoBtn.addEventListener('click', () => {
            const weightInput = simulator.querySelector('#cargo-weight');
            const positionInput = simulator.querySelector('#cargo-position');
            
            const weight = parseFloat(weightInput.value) || 100;
            const position = parseFloat(positionInput.value) || 0;
            
            // Calcular posición relativa (-50 a 50) a coordenadas de píxeles
            const positionX = ship.width * (position + 50) / 100;
            
            // Añadir nueva carga
            ship.cargo.push({
                x: positionX,
                width: 40,
                height: 30,
                weight: weight,
                color: '#f9a826'
            });
        });
    }
    
    // Reiniciar simulación al hacer clic en el botón de reinicio
    const resetBtn = simulator.querySelector('#reset-simulation');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            ship.cargo = [];
            ship.angle = 0;
        });
    }
    
    // Iniciar la simulación
    updateSimulation();
    
    // Manejar redimensión de ventana
    window.addEventListener('resize', () => {
        canvas.width = canvas.parentElement.offsetWidth;
        ship.width = canvas.width * 0.6;
        ship.x = canvas.width * 0.2;
    });
}

/**
 * Inicializar cuestionario de conocimientos marinos
 */
function initMarineQuiz() {
    const quizContainer = document.getElementById('marine-quiz');
    if (!quizContainer) return;
    
    // Preguntas del cuestionario
    const questions = [
        {
            question: "¿Cuál es la principal función de un ingeniero marino a bordo de un buque?",
            options: [
                "Navegación y pilotaje",
                "Operación y mantenimiento de los sistemas de propulsión",
                "Atención médica a la tripulación",
                "Comunicaciones con tierra"
            ],
            answer: 1
        },
        {
            question: "¿Qué tipo de motor es el más común en grandes buques mercantes?",
            options: [
                "Motor de gasolina de 4 tiempos",
                "Motor diésel de 2 tiempos",
                "Turbina de gas",
                "Motor eléctrico"
            ],
            answer: 1
        },
        {
            question: "¿Qué significa la sigla MARPOL?",
            options: [
                "Maritime Police",
                "Marine Pollution Logistics",
                "Maritime Pollution Prevention Convention",
                "Marine Policy Law"
            ],
            answer: 2
        },
        {
            question: "¿Cuál de estos NO es un sistema crítico en la sala de máquinas?",
            options: [
                "Sistema de refrigeración",
                "Sistema de lubricación",
                "Sistema de decoración interior",
                "Sistema de combustible"
            ],
            answer: 2
        },
        {
            question: "¿Qué es el calado de un buque?",
            options: [
                "La distancia vertical entre la quilla y la línea de flotación",
                "La altura total del buque",
                "La distancia entre proa y popa",
                "El peso máximo que puede transportar"
            ],
            answer: 0
        }
    ];
    
    let currentQuestion = 0;
    let score = 0;
    
    // Crear estructura HTML del cuestionario
    function createQuiz() {
        const quizContent = document.createElement('div');
        quizContent.className = 'quiz-content';
        
        quizContent.innerHTML = `
            <div class="quiz-header">
                <h3>Prueba tus conocimientos marítimos</h3>
                <p>Responde las siguientes preguntas para evaluar tu comprensión de ingeniería marina.</p>
                <div class="quiz-progress">
                    <span>Pregunta <span id="current-question">1</span> de <span id="total-questions">${questions.length}</span></span>
                    <div class="progress">
                        <div class="progress-bar bg-primary" style="width: ${(1/questions.length)*100}%"></div>
                    </div>
                </div>
            </div>
            
            <div class="quiz-question-container" id="question-container">
                <!-- Question will be inserted here -->
            </div>
            
            <div class="quiz-controls">
                <button id="next-question" class="btn btn-primary">Siguiente pregunta</button>
            </div>
            
            <div class="quiz-results" id="quiz-results" style="display: none;">
                <h3>Resultados</h3>
                <p>Has completado el cuestionario.</p>
                <div class="result-score">
                    <span id="final-score">0</span>/<span id="max-score">${questions.length}</span>
                </div>
                <p id="result-message"></p>
                <button id="restart-quiz" class="btn btn-primary">Reiniciar cuestionario</button>
            </div>
        `;
        
        quizContainer.appendChild(quizContent);
        showQuestion(currentQuestion);
        
        // Manejadores de eventos
        document.getElementById('next-question').addEventListener('click', nextQuestion);
        document.getElementById('restart-quiz').addEventListener('click', restartQuiz);
    }
    
    // Mostrar pregunta actual
    function showQuestion(index) {
        const questionData = questions[index];
        const questionContainer = document.getElementById('question-container');
        
        // Actualizar progreso
        document.getElementById('current-question').textContent = index + 1;
        document.querySelector('.progress-bar').style.width = `${((index+1)/questions.length)*100}%`;
        
        // Crear HTML de la pregunta
        const questionHTML = `
            <div class="quiz-question">
                <h4>${questionData.question}</h4>
                <div class="quiz-options">
                    ${questionData.options.map((option, i) => `
                        <div class="quiz-option">
                            <input type="radio" name="quiz-option" id="option-${i}" value="${i}">
                            <label for="option-${i}">${option}</label>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        questionContainer.innerHTML = questionHTML;
    }
    
    // Pasar a la siguiente pregunta
    function nextQuestion() {
        // Verificar si se ha seleccionado una opción
        const selectedOption = document.querySelector('input[name="quiz-option"]:checked');
        
        if (!selectedOption) {
            alert('Por favor selecciona una respuesta');
            return;
        }
        
        // Verificar si la respuesta es correcta
        const answer = parseInt(selectedOption.value);
        if (answer === questions[currentQuestion].answer) {
            score++;
        }
        
        // Pasar a la siguiente pregunta or show results
        currentQuestion++;
        
        if (currentQuestion < questions.length) {
            showQuestion(currentQuestion);
        } else {
            showResults();
        }
    }
    
    // Mostrar resultados del cuestionario
    function showResults() {
        document.getElementById('question-container').style.display = 'none';
        document.getElementById('next-question').style.display = 'none';
        document.getElementById('quiz-results').style.display = 'block';
        
        document.getElementById('final-score').textContent = score;
        
        // Mensaje de resultado basado en la puntuación
        const resultMessage = document.getElementById('result-message');
        const percentage = (score / questions.length) * 100;
        
        if (percentage >= 80) {
            resultMessage.textContent = '¡Excelente! Tienes un gran conocimiento de ingeniería marina.';
            resultMessage.className = 'text-success';
        } else if (percentage >= 60) {
            resultMessage.textContent = 'Buen trabajo. Tienes un conocimiento sólido, pero puedes mejorar.';
            resultMessage.className = 'text-primary';
        } else {
            resultMessage.textContent = 'Necesitas estudiar más sobre ingeniería marina.';
            resultMessage.className = 'text-danger';
        }
    }
    
    // Reiniciar cuestionario
    function restartQuiz() {
        currentQuestion = 0;
        score = 0;
        showQuestion(currentQuestion);
        
        document.getElementById('question-container').style.display = 'block';
        document.getElementById('next-question').style.display = 'block';
        document.getElementById('quiz-results').style.display = 'none';
    }
    
    // Inicializar cuestionario
    createQuiz();
}

/**
 * Inicializar herramienta de navegación
 */
function initNavigationTool() {
    const navTool = document.getElementById('navigation-tool');
    if (!navTool) return;
    
    const canvas = navTool.querySelector('canvas');
    const context = canvas.getContext('2d');
    
    // Configurar tamaño del canvas
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = 400;
    
    // Datos de navegación
    const navigation = {
        ship: {
            x: canvas.width / 2,
            y: canvas.height / 2,
            angle: 0,
            speed: 0,
            turnRate: 0,
            size: 20
        },
        map: {
            scale: 1,
            offsetX: 0,
            offsetY: 0
        },
        waypoints: [
            { x: canvas.width * 0.2, y: canvas.height * 0.2, label: 'A' },
            { x: canvas.width * 0.8, y: canvas.height * 0.3, label: 'B' },
            { x: canvas.width * 0.7, y: canvas.height * 0.7, label: 'C' }
        ],
        obstacles: [
            { x: canvas.width * 0.4, y: canvas.height * 0.5, radius: 30 }
        ],
        wind: {
            direction: Math.PI / 4, // 45 degrees
            strength: 10
        },
        current: {
            direction: Math.PI, // 180 degrees
            strength: 5
        }
    };
    
    // Dibujar la escena de navegación
    function drawNavigation() {
        // Limpiar canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // Dibujar fondo de océano
        context.fillStyle = '#e9f4fd';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Dibujar cuadrícula
        context.strokeStyle = '#cfe5f7';
        context.lineWidth = 1;
        
        const gridSize = 40;
        for (let x = 0; x < canvas.width; x += gridSize) {
            context.beginPath();
            context.moveTo(x, 0);
            context.lineTo(x, canvas.height);
            context.stroke();
        }
        
        for (let y = 0; y < canvas.height; y += gridSize) {
            context.beginPath();
            context.moveTo(0, y);
            context.lineTo(canvas.width, y);
            context.stroke();
        }
        
        // Dibujar obstáculos (aguas poco profundas o rocas)
        context.fillStyle = 'rgba(150, 120, 100, 0.6)';
        navigation.obstacles.forEach(obstacle => {
            context.beginPath();
            context.arc(obstacle.x, obstacle.y, obstacle.radius, 0, Math.PI * 2);
            context.fill();
        });
        
        // Dibujar puntos de navegación
        context.fillStyle = '#0077b6';
        navigation.waypoints.forEach(waypoint => {
            context.beginPath();
            context.arc(waypoint.x, waypoint.y, 8, 0, Math.PI * 2);
            context.fill();
            
            context.fillStyle = '#ffffff';
            context.font = '12px Arial';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(waypoint.label, waypoint.x, waypoint.y);
            context.fillStyle = '#0077b6';
        });
        
        // Dibujar indicador de viento
        drawWindIndicator(canvas.width - 70, 70, navigation.wind.direction, navigation.wind.strength);
        
        // Dibujar indicador de corriente
        drawCurrentIndicator(canvas.width - 70, 140, navigation.current.direction, navigation.current.strength);
        
        // Dibujar barco
        context.save();
        context.translate(navigation.ship.x, navigation.ship.y);
        context.rotate(navigation.ship.angle);
        
        context.fillStyle = '#343a40';
        context.beginPath();
        context.moveTo(navigation.ship.size, 0);
        context.lineTo(-navigation.ship.size / 2, -navigation.ship.size / 2);
        context.lineTo(-navigation.ship.size / 2, navigation.ship.size / 2);
        context.closePath();
        context.fill();
        
        context.restore();
    }
    
    // Dibujar indicador de viento
    function drawWindIndicator(x, y, direction, strength) {
        context.save();
        
        // Dibujar círculo de fondo
        context.fillStyle = 'rgba(255, 255, 255, 0.8)';
        context.beginPath();
        context.arc(x, y, 30, 0, Math.PI * 2);
        context.fill();
        
        context.strokeStyle = '#0077b6';
        context.lineWidth = 1;
        context.stroke();
        
        // Dibujar flecha de dirección
        context.translate(x, y);
        context.rotate(direction);
        
        context.strokeStyle = '#0077b6';
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(0, -20);
        context.lineTo(0, 20);
        context.stroke();
        
        context.beginPath();
        context.moveTo(-5, -15);
        context.lineTo(0, -20);
        context.lineTo(5, -15);
        context.stroke();
        
        // Dibujar líneas de intensidad
        const lines = Math.min(Math.floor(strength / 5), 5);
        for (let i = 0; i < lines; i++) {
            context.beginPath();
            context.moveTo(-8 + i * -4, -10 + i * 5);
            context.lineTo(-3 + i * -4, -10 + i * 5);
            context.stroke();
        }
        
        context.restore();
        
        // Etiqueta
        context.fillStyle = '#343a40';
        context.font = '12px Arial';
        context.textAlign = 'center';
        context.fillText('Viento', x, y + 40);
    }
    
    // Dibujar indicador de corriente
    function drawCurrentIndicator(x, y, direction, strength) {
        context.save();
        
        // Dibujar círculo de fondo
        context.fillStyle = 'rgba(255, 255, 255, 0.8)';
        context.beginPath();
        context.arc(x, y, 30, 0, Math.PI * 2);
        context.fill();
        
        context.strokeStyle = '#15b383';
        context.lineWidth = 1;
        context.stroke();
        
        // Dibujar flecha de dirección
        context.translate(x, y);
        context.rotate(direction);
        
        context.strokeStyle = '#15b383';
        context.lineWidth = 2;
        
        // Dibujar línea ondulada para la corriente
        context.beginPath();
        context.moveTo(0, -20);
        
        for (let i = -15; i <= 20; i += 5) {
            if ((i - -15) % 10 === 0) {
                context.lineTo(5, i);
            } else {
                context.lineTo(-5, i);
            }
        }
        
        context.stroke();
        
        // Dibujar punta de flecha
        context.beginPath();
        context.moveTo(-5, -15);
        context.lineTo(0, -20);
        context.lineTo(5, -15);
        context.stroke();
        
        context.restore();
        
        // Etiqueta
        context.fillStyle = '#343a40';
        context.font = '12px Arial';
        context.textAlign = 'center';
        context.fillText('Corriente', x, y + 40);
    }
    
    // Manejar controles del barco
    function handleShipControls() {
        const speedControl = navTool.querySelector('#ship-speed');
        const turnControl = navTool.querySelector('#ship-turn');
        
        if (speedControl) {
            speedControl.addEventListener('input', () => {
                navigation.ship.speed = parseFloat(speedControl.value);
                updateShipStatus();
            });
        }
        
        if (turnControl) {
            turnControl.addEventListener('input', () => {
                navigation.ship.turnRate = parseFloat(turnControl.value) * (Math.PI / 180);
                updateShipStatus();
            });
        }
    }
    
    // Actualizar visualización del estado del barco
    function updateShipStatus() {
        const speedDisplay = navTool.querySelector('#speed-value');
        const headingDisplay = navTool.querySelector('#heading-value');
        
        if (speedDisplay) {
            speedDisplay.textContent = navigation.ship.speed.toFixed(1);
        }
        
        if (headingDisplay) {
            const headingDegrees = Math.round((navigation.ship.angle * 180 / Math.PI) % 360);
            headingDisplay.textContent = headingDegrees >= 0 ? headingDegrees : 360 + headingDegrees;
        }
    }
    
    // Actualizar simulación
    function updateSimulation() {
        // Actualizar posición del barco según la velocidad
        navigation.ship.x += Math.cos(navigation.ship.angle) * navigation.ship.speed / 10;
        navigation.ship.y += Math.sin(navigation.ship.angle) * navigation.ship.speed / 10;
        
        // Aplicar tasa de giro
        navigation.ship.angle += navigation.ship.turnRate / 10;
        
        // Aplicar efecto del viento (simplificado)
        const windEffect = navigation.wind.strength * 0.01;
        navigation.ship.x += Math.cos(navigation.wind.direction) * windEffect;
        navigation.ship.y += Math.sin(navigation.wind.direction) * windEffect;
        
        // Aplicar efecto de la corriente (simplificado)
        const currentEffect = navigation.current.strength * 0.02;
        navigation.ship.x += Math.cos(navigation.current.direction) * currentEffect;
        navigation.ship.y += Math.sin(navigation.current.direction) * currentEffect;
        
        // Mantener el barco en pantalla
        navigation.ship.x = Math.max(0, Math.min(canvas.width, navigation.ship.x));
        navigation.ship.y = Math.max(0, Math.min(canvas.height, navigation.ship.y));
        
        // Actualizar visualización del estado del barco
        updateShipStatus();
        
        // Redibujar escena
        drawNavigation();
        
        // Continuar animación
        requestAnimationFrame(updateSimulation);
    }
    
    // Inicializar controles
    handleShipControls();
    
    // Iniciar simulación
    updateSimulation();
    
    // Manejar redimensión de ventana
    window.addEventListener('resize', () => {
        canvas.width = canvas.parentElement.offsetWidth;
        drawNavigation();
    });
}
