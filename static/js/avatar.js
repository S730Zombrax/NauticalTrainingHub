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
    
    // Define uniform categories and items
    const uniformData = {
        uniforms: [
            {
                id: 'gala',
                name: 'Uniforme de Gala',
                description: 'Uniforme formal para ceremonias oficiales, graduaciones y eventos especiales. Representa la máxima formalidad en la vestimenta de los cadetes marítimos.',
                features: [
                    'Chaqueta azul marino con botones dorados',
                    'Pantalón/falda azul marino con línea dorada',
                    'Camisa blanca de manga larga',
                    'Corbata negra',
                    'Zapatos negros de vestir',
                    'Gorra de plato con distintivo UMC'
                ],
                imageUrl: '/static/images/uniforms/gala.svg',
            },
            {
                id: 'diario',
                name: 'Uniforme Diario',
                description: 'Uniforme estándar para actividades académicas y uso cotidiano en las instalaciones de la universidad.',
                features: [
                    'Camisa blanca tipo polo con logo UMC',
                    'Pantalón/falda azul marino',
                    'Cinturón negro con hebilla institucional',
                    'Zapatos negros',
                    'Gorra azul marino con logo UMC'
                ],
                imageUrl: '/static/images/uniforms/diario.svg',
            },
            {
                id: 'deportivo',
                name: 'Uniforme Deportivo',
                description: 'Uniforme para actividades físicas, deportes y entrenamientos realizados como parte del programa educativo.',
                features: [
                    'Camiseta azul con logo UMC',
                    'Pantalón corto o pants azul marino',
                    'Calzado deportivo blanco',
                    'Medias blancas',
                    'Opcional: sudadera para clima frío'
                ],
                imageUrl: '/static/images/uniforms/deportivo.svg',
            },
            {
                id: 'laboratorio',
                name: 'Uniforme de Laboratorio',
                description: 'Uniforme especializado para prácticas en laboratorios de ingeniería y simuladores.',
                features: [
                    'Bata azul con logo UMC',
                    'Pantalón de jean azul',
                    'Camisa blanca',
                    'Calzado cerrado resistente',
                    'Equipo de protección según actividad'
                ],
                imageUrl: '/static/images/uniforms/laboratorio.svg',
            },
            {
                id: 'pasantias',
                name: 'Uniforme de Pasantías',
                description: 'Uniforme utilizado durante prácticas profesionales y pasantías en buques y empresas del sector marítimo.',
                features: [
                    'Camisa tipo oxford azul celeste con insignias',
                    'Pantalón azul marino',
                    'Chaqueta técnica con identificación UMC',
                    'Calzado de seguridad',
                    'Casco y equipo de protección (según área)'
                ],
                imageUrl: '/static/images/uniforms/pasantias.svg',
            }
        ]
    };
    
    // Create HTML structure for avatar system
    createSimpleAvatarSystem(avatarContainer, uniformData);
}

/**
 * Create a simple avatar system structure
 * @param {HTMLElement} container - The container element
 * @param {Object} uniformData - Data for uniforms and accessories
 */
function createSimpleAvatarSystem(container, uniformData) {
    // Clear container
    container.innerHTML = '';
    
    // Create main elements
    const row = document.createElement('div');
    row.className = 'row';
    
    // Preview column (placeholder)
    const previewCol = document.createElement('div');
    previewCol.className = 'col-md-3 mb-4';
    
    const previewTitle = document.createElement('h4');
    previewTitle.className = 'text-center mb-5';
    previewTitle.textContent = 'Vista Previa del Uniforme';
    previewCol.appendChild(previewTitle);
    
    const previewPlaceholder = document.createElement('div');
    previewPlaceholder.className = 'preview-placeholder text-center p-5 bg-light rounded';
    previewPlaceholder.innerHTML = `
        <div class="tshirt-container">
            <i class="fas fa-tshirt fa-4x text-primary mb-4"></i>
        </div>
        <p><strong>Próximamente:</strong> Visualización en 3D de uniformes</p>
        <p class="text-muted small">Estamos trabajando en esta funcionalidad para brindarte una experiencia visual más completa.</p>
    `;
    previewCol.appendChild(previewPlaceholder);
    
    // Controls column
    const controlsCol = document.createElement('div');
    controlsCol.className = 'col-md-9';
    
    const uniformTitle = document.createElement('h4');
    uniformTitle.className = 'mb-3';
    uniformTitle.textContent = 'Seleccionar Uniforme';
    controlsCol.appendChild(uniformTitle);
    
    // Create uniform options grid
    const uniformGrid = document.createElement('div');
    uniformGrid.className = 'uniform-options';
    
    uniformData.uniforms.forEach(uniform => {
        const option = document.createElement('div');
        option.className = 'uniform-option';
        option.dataset.uniformId = uniform.id;
        
        option.innerHTML = `
            <div class="uniform-option-img">
                <img src="${uniform.imageUrl}" alt="${uniform.name}">
            </div>
            <div class="uniform-option-label">${uniform.name}</div>
        `;
        
        // Add click event
        option.addEventListener('click', () => {
            // Remove active class from all options
            document.querySelectorAll('.uniform-option').forEach(o => 
                o.classList.remove('active'));
            
            // Add active class to clicked option
            option.classList.add('active');
            
            // Update uniform info
            updateUniformInfo(uniform);
        });
        
        uniformGrid.appendChild(option);
    });
    
    controlsCol.appendChild(uniformGrid);
    
    // Uniform info section
    const uniformInfo = document.createElement('div');
    uniformInfo.className = 'uniform-info mt-4 p-3 bg-light rounded';
    uniformInfo.id = 'uniform-info';
    controlsCol.appendChild(uniformInfo);
    
    // Append columns to row
    row.appendChild(previewCol);
    row.appendChild(controlsCol);
    
    // Append row to container
    container.appendChild(row);
    
    // Set initial uniform info
    if (uniformData.uniforms.length > 0) {
        const firstOption = document.querySelector('.uniform-option');
        if (firstOption) {
            firstOption.classList.add('active');
            updateUniformInfo(uniformData.uniforms[0]);
        }
    }
}

/**
 * Update uniform information display
 * @param {Object} uniform - The uniform data object
 */
function updateUniformInfo(uniform) {
    const infoContainer = document.getElementById('uniform-info');
    if (!infoContainer) return;
    
    infoContainer.innerHTML = `
        <h5>${uniform.name}</h5>
        <p>${uniform.description}</p>
        <h6 class="mt-3">Características:</h6>
        <ul class="uniform-features">
            ${uniform.features.map(feature => `<li>${feature}</li>`).join('')}
        </ul>
    `;
}
