/**
 * Universidad Marítima del Caribe - Marine Engineering
 * Interactive Educational Games
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize ship stability simulator if it exists
    initStabilitySimulator();
    
    // Initialize marine knowledge quiz if it exists
    initMarineQuiz();
    
    // Initialize navigation tool if it exists
    initNavigationTool();
});

/**
 * Initialize ship stability simulator
 */
function initStabilitySimulator() {
    const simulator = document.getElementById('stability-simulator');
    if (!simulator) return;
    
    const canvas = simulator.querySelector('canvas');
    const context = canvas.getContext('2d');
    const controlPanel = simulator.querySelector('.simulator-controls');
    
    // Set canvas size
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = 400;
    
    // Ship properties
    const ship = {
        width: canvas.width * 0.6,
        height: canvas.height * 0.3,
        x: canvas.width * 0.2,
        y: canvas.height * 0.5,
        angle: 0,
        waterLevel: canvas.height * 0.6,
        cargo: []
    };
    
    // Water properties
    const water = {
        level: canvas.height * 0.6,
        color: '#0077b6',
        waveAmplitude: 3,
        waveFrequency: 0.05,
        wavePhase: 0
    };
    
    // Function to draw the ship
    function drawShip() {
        context.save();
        
        // Translate to ship center for rotation
        context.translate(ship.x + ship.width / 2, ship.y + ship.height / 2);
        context.rotate(ship.angle);
        
        // Draw hull
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
        
        // Draw deck
        context.fillStyle = '#6c757d';
        context.fillRect(-ship.width / 2, -ship.height / 2, ship.width, 10);
        
        // Draw cargo
        ship.cargo.forEach(item => {
            context.fillStyle = item.color;
            context.fillRect(item.x - ship.width / 2, -ship.height / 2 + 10, item.width, item.height);
        });
        
        context.restore();
    }
    
    // Function to draw water with waves
    function drawWater() {
        context.fillStyle = water.color;
        
        context.beginPath();
        context.moveTo(0, water.level);
        
        // Draw wavy water surface
        for (let x = 0; x < canvas.width; x += 10) {
            const y = water.level + Math.sin(x * water.waveFrequency + water.wavePhase) * water.waveAmplitude;
            context.lineTo(x, y);
        }
        
        context.lineTo(canvas.width, canvas.height);
        context.lineTo(0, canvas.height);
        context.closePath();
        context.fill();
    }
    
    // Function to update the simulation
    function updateSimulation() {
        // Calculate total torque and weight distribution
        let totalTorque = 0;
        let totalWeight = 0;
        
        ship.cargo.forEach(item => {
            const relativeX = item.x - ship.width / 2;
            totalTorque += relativeX * item.weight;
            totalWeight += item.weight;
        });
        
        // Calculate new angle based on torque
        const stabilityFactor = 0.00005;
        const dampingFactor = 0.95;
        
        // Apply torque to create rotation
        ship.angle = totalWeight > 0 ? 
            (totalTorque / totalWeight) * stabilityFactor : 0;
        
        // Limit angle to reasonable values
        ship.angle = Math.max(Math.min(ship.angle, Math.PI / 6), -Math.PI / 6);
        
        // Update water wave animation
        water.wavePhase += 0.05;
        
        // Clear canvas and redraw
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawWater();
        drawShip();
        
        // Update stability indicator
        const stabilityIndicator = document.getElementById('stability-indicator');
        const angle = Math.abs(ship.angle * (180 / Math.PI));
        
        if (stabilityIndicator) {
            // Update stability status
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
        
        // Continue animation loop
        requestAnimationFrame(updateSimulation);
    }
    
    // Create cargo item when clicking add cargo button
    const addCargoBtn = simulator.querySelector('#add-cargo');
    if (addCargoBtn) {
        addCargoBtn.addEventListener('click', () => {
            const weightInput = simulator.querySelector('#cargo-weight');
            const positionInput = simulator.querySelector('#cargo-position');
            
            const weight = parseFloat(weightInput.value) || 100;
            const position = parseFloat(positionInput.value) || 0;
            
            // Calculate relative position (-50 to 50) to pixel coordinates
            const positionX = ship.width * (position + 50) / 100;
            
            // Add new cargo
            ship.cargo.push({
                x: positionX,
                width: 40,
                height: 30,
                weight: weight,
                color: '#f9a826'
            });
        });
    }
    
    // Reset simulation when clicking reset button
    const resetBtn = simulator.querySelector('#reset-simulation');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            ship.cargo = [];
            ship.angle = 0;
        });
    }
    
    // Start the simulation
    updateSimulation();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = canvas.parentElement.offsetWidth;
        ship.width = canvas.width * 0.6;
        ship.x = canvas.width * 0.2;
    });
}

/**
 * Initialize marine knowledge quiz
 */
function initMarineQuiz() {
    const quizContainer = document.getElementById('marine-quiz');
    if (!quizContainer) return;
    
    // Quiz questions
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
    
    // Create quiz HTML structure
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
        
        // Event listeners
        document.getElementById('next-question').addEventListener('click', nextQuestion);
        document.getElementById('restart-quiz').addEventListener('click', restartQuiz);
    }
    
    // Show current question
    function showQuestion(index) {
        const questionData = questions[index];
        const questionContainer = document.getElementById('question-container');
        
        // Update progress
        document.getElementById('current-question').textContent = index + 1;
        document.querySelector('.progress-bar').style.width = `${((index+1)/questions.length)*100}%`;
        
        // Create question HTML
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
    
    // Move to next question
    function nextQuestion() {
        // Check if an option is selected
        const selectedOption = document.querySelector('input[name="quiz-option"]:checked');
        
        if (!selectedOption) {
            alert('Por favor selecciona una respuesta');
            return;
        }
        
        // Check if answer is correct
        const answer = parseInt(selectedOption.value);
        if (answer === questions[currentQuestion].answer) {
            score++;
        }
        
        // Move to next question or show results
        currentQuestion++;
        
        if (currentQuestion < questions.length) {
            showQuestion(currentQuestion);
        } else {
            showResults();
        }
    }
    
    // Show quiz results
    function showResults() {
        document.getElementById('question-container').style.display = 'none';
        document.getElementById('next-question').style.display = 'none';
        document.getElementById('quiz-results').style.display = 'block';
        
        document.getElementById('final-score').textContent = score;
        
        // Result message based on score
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
    
    // Restart quiz
    function restartQuiz() {
        currentQuestion = 0;
        score = 0;
        showQuestion(currentQuestion);
        
        document.getElementById('question-container').style.display = 'block';
        document.getElementById('next-question').style.display = 'block';
        document.getElementById('quiz-results').style.display = 'none';
    }
    
    // Initialize quiz
    createQuiz();
}

/**
 * Initialize navigation tool
 */
function initNavigationTool() {
    const navTool = document.getElementById('navigation-tool');
    if (!navTool) return;
    
    const canvas = navTool.querySelector('canvas');
    const context = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = 400;
    
    // Navigation data
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
    
    // Draw the navigation scene
    function drawNavigation() {
        // Clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw ocean background
        context.fillStyle = '#e9f4fd';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid
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
        
        // Draw obstacles (shallow waters or rocks)
        context.fillStyle = 'rgba(150, 120, 100, 0.6)';
        navigation.obstacles.forEach(obstacle => {
            context.beginPath();
            context.arc(obstacle.x, obstacle.y, obstacle.radius, 0, Math.PI * 2);
            context.fill();
        });
        
        // Draw waypoints
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
        
        // Draw wind indicator
        drawWindIndicator(canvas.width - 70, 70, navigation.wind.direction, navigation.wind.strength);
        
        // Draw current indicator
        drawCurrentIndicator(canvas.width - 70, 140, navigation.current.direction, navigation.current.strength);
        
        // Draw ship
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
    
    // Draw wind indicator
    function drawWindIndicator(x, y, direction, strength) {
        context.save();
        
        // Draw circle background
        context.fillStyle = 'rgba(255, 255, 255, 0.8)';
        context.beginPath();
        context.arc(x, y, 30, 0, Math.PI * 2);
        context.fill();
        
        context.strokeStyle = '#0077b6';
        context.lineWidth = 1;
        context.stroke();
        
        // Draw direction arrow
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
        
        // Draw strength lines
        const lines = Math.min(Math.floor(strength / 5), 5);
        for (let i = 0; i < lines; i++) {
            context.beginPath();
            context.moveTo(-8 + i * -4, -10 + i * 5);
            context.lineTo(-3 + i * -4, -10 + i * 5);
            context.stroke();
        }
        
        context.restore();
        
        // Label
        context.fillStyle = '#343a40';
        context.font = '12px Arial';
        context.textAlign = 'center';
        context.fillText('Viento', x, y + 40);
    }
    
    // Draw current indicator
    function drawCurrentIndicator(x, y, direction, strength) {
        context.save();
        
        // Draw circle background
        context.fillStyle = 'rgba(255, 255, 255, 0.8)';
        context.beginPath();
        context.arc(x, y, 30, 0, Math.PI * 2);
        context.fill();
        
        context.strokeStyle = '#15b383';
        context.lineWidth = 1;
        context.stroke();
        
        // Draw direction arrow
        context.translate(x, y);
        context.rotate(direction);
        
        context.strokeStyle = '#15b383';
        context.lineWidth = 2;
        
        // Draw wavy line for current
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
        
        // Draw arrowhead
        context.beginPath();
        context.moveTo(-5, -15);
        context.lineTo(0, -20);
        context.lineTo(5, -15);
        context.stroke();
        
        context.restore();
        
        // Label
        context.fillStyle = '#343a40';
        context.font = '12px Arial';
        context.textAlign = 'center';
        context.fillText('Corriente', x, y + 40);
    }
    
    // Handle ship controls
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
    
    // Update ship status display
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
    
    // Update simulation
    function updateSimulation() {
        // Update ship position based on speed
        navigation.ship.x += Math.cos(navigation.ship.angle) * navigation.ship.speed / 10;
        navigation.ship.y += Math.sin(navigation.ship.angle) * navigation.ship.speed / 10;
        
        // Apply turn rate
        navigation.ship.angle += navigation.ship.turnRate / 10;
        
        // Apply wind effect (simplified)
        const windEffect = navigation.wind.strength * 0.01;
        navigation.ship.x += Math.cos(navigation.wind.direction) * windEffect;
        navigation.ship.y += Math.sin(navigation.wind.direction) * windEffect;
        
        // Apply current effect (simplified)
        const currentEffect = navigation.current.strength * 0.02;
        navigation.ship.x += Math.cos(navigation.current.direction) * currentEffect;
        navigation.ship.y += Math.sin(navigation.current.direction) * currentEffect;
        
        // Keep ship on screen
        navigation.ship.x = Math.max(0, Math.min(canvas.width, navigation.ship.x));
        navigation.ship.y = Math.max(0, Math.min(canvas.height, navigation.ship.y));
        
        // Update ship status display
        updateShipStatus();
        
        // Redraw scene
        drawNavigation();
        
        // Continue animation
        requestAnimationFrame(updateSimulation);
    }
    
    // Initialize controls
    handleShipControls();
    
    // Start simulation
    updateSimulation();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = canvas.parentElement.offsetWidth;
        drawNavigation();
    });
}
