/**
 * Universidad Marítima del Caribe - Ingeniería Marítima
 * Sistema de Avatar para Visualización de Uniformes
 */

document.addEventListener('DOMContentLoaded', function() {
    initAvatarSystem();
});

/**
 * Inicializar el sistema de uniforme de avatar
 */
function initAvatarSystem() {
    const avatarContainer = document.querySelector('.avatar-container');
    
    if (!avatarContainer) return;
    
    // Definir categorías y elementos de uniformes
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
    
    // Crear estructura HTML para el sistema de avatar
    createSimpleAvatarSystem(avatarContainer, uniformData);
}

/**
 * Crear una estructura simple para el sistema de avatar
 * @param {HTMLElement} container - El elemento contenedor
 * @param {Object} uniformData - Datos para uniformes y accesorios
 */
function createSimpleAvatarSystem(container, uniformData) {
    // Limpiar contenedor
    container.innerHTML = '';
    
    // Crear elementos principales
    const row = document.createElement('div');
    row.className = 'row';
    
    // Columna de vista previa (placeholder)
    const previewCol = document.createElement('div');
    previewCol.className = 'col-md-4 mb-4';
    
    const previewTitle = document.createElement('h4');
    previewTitle.className = 'text-center mb-4';
    previewTitle.innerHTML = 'Vista Previa<br>del Uniforme';
    previewCol.appendChild(previewTitle);
    
    const previewPlaceholder = document.createElement('div');
    previewPlaceholder.className = 'preview-placeholder text-center p-5 bg-light rounded';
    previewPlaceholder.innerHTML = `
        <p><strong>Próximamente:</strong> Visualización en 3D de uniformes</p>
        <p class="text-muted small">Estamos trabajando en esta funcionalidad para brindarte una experiencia visual más completa.</p>
    `;
    previewCol.appendChild(previewPlaceholder);
    
    // Columna de controles
    const controlsCol = document.createElement('div');
    controlsCol.className = 'col-md-8';
    
    const uniformTitle = document.createElement('h4');
    uniformTitle.className = 'mb-4';
    uniformTitle.textContent = 'Seleccionar Uniforme';
    controlsCol.appendChild(uniformTitle);
    
    // Crear cuadrícula de opciones de uniforme
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
        
        // Agregar evento de clic
        option.addEventListener('click', () => {
            // Quitar clase activa de todas las opciones
            document.querySelectorAll('.uniform-option').forEach(o => 
                o.classList.remove('active'));
            
            // Agregar clase activa a la opción seleccionada
            option.classList.add('active');
            
            // Actualizar información del uniforme
            updateUniformInfo(uniform);
        });
        
        uniformGrid.appendChild(option);
    });
    
    controlsCol.appendChild(uniformGrid);
    
    // Sección de información del uniforme
    const uniformInfo = document.createElement('div');
    uniformInfo.className = 'uniform-info mt-4 p-3 bg-light rounded';
    uniformInfo.id = 'uniform-info';
    controlsCol.appendChild(uniformInfo);
    
    // Agregar columnas a la fila
    row.appendChild(previewCol);
    row.appendChild(controlsCol);
    
    // Agregar fila al contenedor
    container.appendChild(row);
    
    // Establecer información inicial del uniforme
    if (uniformData.uniforms.length > 0) {
        const firstOption = document.querySelector('.uniform-option');
        if (firstOption) {
            firstOption.classList.add('active');
            updateUniformInfo(uniformData.uniforms[0]);
        }
    }
}

/**
 * Actualizar información del uniformermation display
 * @param {Object} uniform - El objeto de datos del uniforme
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
