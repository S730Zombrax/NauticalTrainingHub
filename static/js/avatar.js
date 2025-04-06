/**
 * Universidad Marítima del Caribe - Marine Engineering
 * Avatar System for Uniform Visualization
 */

document.addEventListener('DOMContentLoaded', function() {
    initAvatarSystem();
});

/**
 * Initialize the avatar uniform system
 */
function initAvatarSystem() {
    const avatarContainer = document.querySelector('.avatar-container');
    
    if (!avatarContainer) return;
    
    // Define the uniform types
    const uniformTypes = [
        {
            id: 'formal',
            name: 'Gala',
            description: 'Uniforme formal para ceremonias oficiales y eventos especiales.',
            svgData: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400">
                <rect x="100" y="150" width="100" height="200" fill="#ffffff"/>
                <rect x="100" y="150" width="100" height="50" fill="#003559"/>
                <rect x="100" y="200" width="100" height="150" fill="#ffffff"/>
                <rect x="70" y="150" width="30" height="200" fill="#003559"/>
                <rect x="200" y="150" width="30" height="200" fill="#003559"/>
                <rect x="85" y="350" width="50" height="30" fill="#003559"/>
                <rect x="165" y="350" width="50" height="30" fill="#003559"/>
                <circle cx="150" cy="170" r="10" fill="#f9a826"/>
                <circle cx="150" cy="190" r="5" fill="#f9a826"/>
                <circle cx="150" cy="210" r="5" fill="#f9a826"/>
            </svg>`
        },
        {
            id: 'daily',
            name: 'Diario',
            description: 'Uniforme estándar para actividades diarias y clases regulares.',
            svgData: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400">
                <rect x="100" y="150" width="100" height="200" fill="#ffffff"/>
                <rect x="70" y="150" width="30" height="200" fill="#0077b6"/>
                <rect x="200" y="150" width="30" height="200" fill="#0077b6"/>
                <rect x="100" y="150" width="100" height="20" fill="#0077b6"/>
                <rect x="85" y="350" width="50" height="30" fill="#0077b6"/>
                <rect x="165" y="350" width="50" height="30" fill="#0077b6"/>
                <rect x="115" y="170" width="70" height="15" fill="#0077b6"/>
                <line x1="150" y1="170" x2="150" y2="350" stroke="#0077b6" stroke-width="2"/>
            </svg>`
        },
        {
            id: 'physical',
            name: 'Educación Física',
            description: 'Uniforme deportivo para actividades físicas y entrenamientos.',
            svgData: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400">
                <rect x="100" y="150" width="100" height="70" fill="#e9f4fd"/>
                <rect x="100" y="220" width="100" height="130" fill="#0077b6"/>
                <text x="150" y="190" font-family="Arial" font-size="15" text-anchor="middle" fill="#0077b6">UMC</text>
                <rect x="85" y="350" width="50" height="30" fill="#0077b6"/>
                <rect x="165" y="350" width="50" height="30" fill="#0077b6"/>
            </svg>`
        },
        {
            id: 'practice',
            name: 'Prácticas',
            description: 'Uniforme específico para prácticas en el simulador y laboratorios.',
            svgData: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400">
                <rect x="100" y="150" width="100" height="200" fill="#f4a261"/>
                <rect x="70" y="150" width="30" height="200" fill="#e76f51"/>
                <rect x="200" y="150" width="30" height="200" fill="#e76f51"/>
                <rect x="115" y="150" width="70" height="30" fill="#e76f51"/>
                <rect x="85" y="350" width="50" height="30" fill="#e76f51"/>
                <rect x="165" y="350" width="50" height="30" fill="#e76f51"/>
                <rect x="125" y="190" width="50" height="10" fill="#e76f51"/>
                <rect x="125" y="210" width="50" height="10" fill="#e76f51"/>
            </svg>`
        },
        {
            id: 'internship',
            name: 'Pasantías',
            description: 'Uniforme de marinero para prácticas y pasantías en buques.',
            svgData: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400">
                <rect x="100" y="150" width="100" height="200" fill="#003559"/>
                <rect x="85" y="350" width="50" height="30" fill="#003559"/>
                <rect x="165" y="350" width="50" height="30" fill="#003559"/>
                <rect x="100" y="150" width="100" height="50" fill="#ffffff"/>
                <path d="M100,200 L200,200 L200,190 L100,190 Z" fill="#003559"/>
                <path d="M130,150 L170,150 L170,190 L130,190 Z" fill="#003559"/>
            </svg>`
        }
    ];
    
    // Create HTML structure for avatar system
    createAvatarSystem(avatarContainer, uniformTypes);
    
    // Initialize event listeners
    initAvatarEvents(uniformTypes);
}

/**
 * Create the avatar system HTML structure
 * @param {HTMLElement} container - The container element
 * @param {Array} uniformTypes - Array of uniform data
 */
function createAvatarSystem(container, uniformTypes) {
    // Create avatar preview
    const previewSection = document.createElement('div');
    previewSection.className = 'avatar-preview';
    previewSection.innerHTML = `
        <div class="avatar-figure"></div>
        <div class="avatar-clothing"></div>
    `;
    
    // Create options section
    const controlsSection = document.createElement('div');
    controlsSection.className = 'avatar-controls';
    
    // Create uniform options
    const uniformOptionsSection = document.createElement('div');
    uniformOptionsSection.innerHTML = `
        <h3 class="avatar-options-title">Seleccionar Uniforme</h3>
        <div class="avatar-options" id="uniform-options"></div>
    `;
    
    // Create uniform description section
    const uniformInfoSection = document.createElement('div');
    uniformInfoSection.className = 'uniform-info';
    uniformInfoSection.innerHTML = `
        <h3 class="uniform-info-title">Uniforme de Gala</h3>
        <p class="uniform-description">Uniforme formal para ceremonias oficiales y eventos especiales.</p>
        <h4>Reglamento de uso:</h4>
        <ul class="uniform-regulations">
            <li>El uniforme debe estar limpio y planchado en todo momento.</li>
            <li>Los botones deben estar correctamente abrochados.</li>
            <li>El calzado debe estar limpio y lustrado.</li>
            <li>No se permiten modificaciones al diseño oficial.</li>
            <li>Los distintivos de rango deben colocarse según el protocolo.</li>
        </ul>
    `;
    
    // Add options for each uniform type
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'avatar-options';
    optionsContainer.id = 'uniform-options';
    
    uniformTypes.forEach(uniform => {
        const option = document.createElement('div');
        option.className = 'avatar-option';
        option.dataset.uniform = uniform.id;
        
        option.innerHTML = `
            <div class="avatar-option-img">
                <i class="fas fa-tshirt"></i>
            </div>
            <div class="avatar-option-label">${uniform.name}</div>
        `;
        
        optionsContainer.appendChild(option);
    });
    
    uniformOptionsSection.querySelector('#uniform-options').replaceWith(optionsContainer);
    
    // Append all sections
    controlsSection.appendChild(uniformOptionsSection);
    container.appendChild(previewSection);
    container.appendChild(controlsSection);
    container.appendChild(uniformInfoSection);
    
    // Set initial uniform
    if (uniformTypes.length > 0) {
        setUniform(uniformTypes[0]);
        optionsContainer.querySelector('.avatar-option').classList.add('active');
    }
}

/**
 * Initialize event listeners for avatar system
 * @param {Array} uniformTypes - Array of uniform data
 */
function initAvatarEvents(uniformTypes) {
    const options = document.querySelectorAll('.avatar-option');
    
    options.forEach(option => {
        option.addEventListener('click', () => {
            // Remove active class from all options
            options.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            option.classList.add('active');
            
            // Get selected uniform
            const uniformId = option.dataset.uniform;
            const selectedUniform = uniformTypes.find(u => u.id === uniformId);
            
            if (selectedUniform) {
                setUniform(selectedUniform);
            }
        });
    });
}

/**
 * Set the active uniform
 * @param {Object} uniform - The uniform data object
 */
function setUniform(uniform) {
    const avatarClothing = document.querySelector('.avatar-clothing');
    const uniformInfo = document.querySelector('.uniform-info');
    
    if (avatarClothing && uniformInfo) {
        // Set SVG content
        avatarClothing.innerHTML = uniform.svgData;
        
        // Update info
        uniformInfo.querySelector('.uniform-info-title').textContent = `Uniforme de ${uniform.name}`;
        uniformInfo.querySelector('.uniform-description').textContent = uniform.description;
    }
}
