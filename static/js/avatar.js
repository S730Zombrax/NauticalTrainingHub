/**
 * Universidad Marítima del Caribe - Marine Engineering
 * Avatar System for Uniform Visualization
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log("Avatar system initializing...");
    initAvatarSystem();
});

/**
 * Initialize the avatar uniform system
 */
function initAvatarSystem() {
    const avatarContainer = document.querySelector('.avatar-container');
    
    if (!avatarContainer) {
        console.error("Avatar container not found!");
        return;
    }
    
    console.log("Found avatar container, setting up system...");
    
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
                components: {
                    head: {
                        id: 'gorra-gala',
                        style: 'background-image: linear-gradient(to bottom, #003366, #002244); border-radius: 30% 30% 0 0; height: 40px; width: 80px; position: relative; top: 0; left: 110px;',
                        icon: '🎖️'
                    },
                    torso: {
                        id: 'chaqueta-gala',
                        style: 'background: linear-gradient(to right, #002244 10%, #003366 25%, #002855 75%, #001c39 90%); height: 150px; top: 90px;',
                        icon: '🧥'
                    },
                    legs: {
                        id: 'pantalon-gala',
                        style: 'background-color: #002244; height: 180px; top: 240px;',
                        icon: '👖'
                    },
                    accessories: [
                        {
                            id: 'insignia-gala',
                            style: 'background-image: url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'40\' fill=\'%23f9a826\'/%3E%3Cpath d=\'M50 10 L54 40 L85 40 L60 60 L70 90 L50 70 L30 90 L40 60 L15 40 L46 40 Z\' fill=\'%23003366\'/%3E%3C/svg%3E"); width: 40px; height: 40px; top: 120px; left: 130px;',
                            icon: '⭐'
                        }
                    ]
                }
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
                components: {
                    head: {
                        id: 'gorra-diario',
                        style: 'background-color: #003366; border-radius: 40% 40% 0 0; height: 30px; width: 70px; position: relative; top: 10px; left: 115px;',
                        icon: '🧢'
                    },
                    torso: {
                        id: 'polo-diario',
                        style: 'background-color: white; border: 2px solid #003366; border-top-width: 10px; height: 150px; top: 90px;',
                        icon: '👕'
                    },
                    legs: {
                        id: 'pantalon-diario',
                        style: 'background-color: #003366; height: 180px; top: 240px;',
                        icon: '👖'
                    },
                    accessories: [
                        {
                            id: 'logo-diario',
                            style: 'background-image: url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'45\' fill=\'%23003366\'/%3E%3Ctext x=\'50\' y=\'65\' text-anchor=\'middle\' font-family=\'Arial\' font-size=\'30\' fill=\'%23ffffff\'%3EUMC%3C/text%3E%3C/svg%3E"); width: 40px; height: 40px; top: 120px; left: 130px;',
                            icon: '🏫'
                        }
                    ]
                }
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
                components: {
                    head: {
                        id: 'ninguno',
                        style: 'background: transparent;',
                        icon: '🚫'
                    },
                    torso: {
                        id: 'camiseta-deportiva',
                        style: 'background-color: #0077b6; color: white; display: flex; align-items: center; justify-content: center; height: 150px; top: 90px;',
                        icon: '👕',
                        text: 'UMC'
                    },
                    legs: {
                        id: 'shorts-deportivos',
                        style: 'background-color: #003366; height: 100px; top: 240px;',
                        icon: '🩳'
                    },
                    accessories: [
                        {
                            id: 'texto-umc',
                            style: 'color: white; font-weight: bold; font-size: 24px; top: 160px; left: 135px; width: 40px; height: 40px;',
                            text: 'UMC'
                        }
                    ]
                }
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
                components: {
                    head: {
                        id: 'casco-seguridad',
                        style: 'background-color: #f9a826; border-radius: 50% 50% 0 0; height: 30px; width: 70px; position: relative; top: 10px; left: 115px;',
                        icon: '⛑️'
                    },
                    torso: {
                        id: 'bata-laboratorio',
                        style: 'background-color: #90e0ef; border: 1px solid #0077b6; height: 180px; top: 90px;',
                        icon: '🥼'
                    },
                    legs: {
                        id: 'jean-laboratorio',
                        style: 'background-color: #274c77; height: 150px; top: 270px;',
                        icon: '👖'
                    },
                    accessories: [
                        {
                            id: 'gafas-seguridad',
                            style: 'background-image: url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 50\'%3E%3Cpath d=\'M10 25 C10 15 20 15 30 25 L70 25 C80 15 90 15 90 25 L90 30 C90 40 80 40 70 30 L30 30 C20 40 10 40 10 30 Z\' fill=\'%23caf0f8\'/%3E%3C/svg%3E"); width: 60px; height: 20px; top: 70px; left: 120px;',
                            icon: '🥽'
                        }
                    ]
                }
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
                components: {
                    head: {
                        id: 'casco-pasantias',
                        style: 'background-color: white; border-radius: 50% 50% 0 0; height: 35px; width: 75px; position: relative; top: 5px; left: 113px;',
                        icon: '⛑️'
                    },
                    torso: {
                        id: 'camisa-pasantias',
                        style: 'background-color: #a8dadc; border: 1px solid #457b9d; height: 150px; top: 90px;',
                        icon: '👔'
                    },
                    legs: {
                        id: 'pantalon-pasantias',
                        style: 'background-color: #1d3557; height: 180px; top: 240px;',
                        icon: '👖'
                    },
                    accessories: [
                        {
                            id: 'chaleco-reflectante',
                            style: 'background-color: #f9c74f; opacity: 0.7; width: 80px; height: 100px; top: 120px; left: 110px;',
                            icon: '🦺'
                        }
                    ]
                }
            }
        ]
    };
    
    // Create HTML structure for avatar system
    createAvatarSystem(avatarContainer, uniformData);
    
    // Initialize event listeners
    initAvatarEvents(uniformData);
    
    console.log("Avatar system initialized successfully");
}

/**
 * Create the avatar system HTML structure
 * @param {HTMLElement} container - The container element
 * @param {Object} uniformData - Data for uniforms and accessories
 */
function createAvatarSystem(container, uniformData) {
    console.log("Creating avatar system structure...");
    
    // Clear container
    container.innerHTML = '';
    
    // Create row for layout
    const row = document.createElement('div');
    row.className = 'row';
    
    // Create preview section container
    const previewCol = document.createElement('div');
    previewCol.className = 'col-md-6';
    
    const previewContainer = document.createElement('div');
    previewContainer.className = 'avatar-preview-container';
    
    // Create avatar label
    const avatarLabel = document.createElement('h4');
    avatarLabel.className = 'avatar-label text-center mb-3';
    avatarLabel.textContent = 'Vista Previa del Uniforme';
    previewContainer.appendChild(avatarLabel);
    
    // Create avatar preview
    const previewSection = document.createElement('div');
    previewSection.className = 'avatar-preview';
    
    // Add a human silhouette as the base
    const silhouette = document.createElement('div');
    silhouette.className = 'avatar-silhouette';
    silhouette.innerHTML = `
        <img src="/static/images/avatars/silhouette.svg" alt="Silueta humana" width="100%" height="100%">
    `;
    previewSection.appendChild(silhouette);
    
    // Add uniform layers
    const avatarLayers = document.createElement('div');
    avatarLayers.className = 'avatar-layers';
    avatarLayers.innerHTML = `
        <div class="avatar-head"></div>
        <div class="avatar-body"></div>
        <div class="avatar-legs"></div>
        <div class="avatar-accessory"></div>
    `;
    previewSection.appendChild(avatarLayers);
    
    previewContainer.appendChild(previewSection);
    previewCol.appendChild(previewContainer);
    
    // Create controls section
    const controlsCol = document.createElement('div');
    controlsCol.className = 'col-md-6';
    
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'avatar-controls';
    
    // Create uniform category section
    const uniformCategory = document.createElement('div');
    uniformCategory.className = 'uniform-category';
    
    const uniformCategoryTitle = document.createElement('h4');
    uniformCategoryTitle.className = 'uniform-category-title mb-3';
    uniformCategoryTitle.textContent = 'Seleccionar Uniforme';
    uniformCategory.appendChild(uniformCategoryTitle);
    
    // Create uniform options
    const uniformOptions = document.createElement('div');
    uniformOptions.className = 'uniform-options';
    
    uniformData.uniforms.forEach(uniform => {
        const option = document.createElement('div');
        option.className = 'uniform-option';
        option.dataset.uniformId = uniform.id;
        
        if (uniform.imageUrl) {
            option.innerHTML = `
                <div class="uniform-option-img">
                    <img src="${uniform.imageUrl}" alt="${uniform.name}">
                </div>
                <div class="uniform-option-label">${uniform.name}</div>
            `;
        } else {
            option.innerHTML = `
                <div class="uniform-option-img">
                    ${uniform.components.torso.icon}
                </div>
                <div class="uniform-option-label">${uniform.name}</div>
            `;
        }
        
        uniformOptions.appendChild(option);
    });
    
    uniformCategory.appendChild(uniformOptions);
    controlsContainer.appendChild(uniformCategory);
    
    // Create uniform description container
    const uniformDescription = document.createElement('div');
    uniformDescription.className = 'uniform-description mt-4';
    uniformDescription.innerHTML = `
        <h4 class="uniform-description-title">${uniformData.uniforms[0].name}</h4>
        <p class="uniform-description-text">${uniformData.uniforms[0].description}</p>
        <h5>Características:</h5>
        <ul class="uniform-features">
            ${uniformData.uniforms[0].features.map(feature => `<li>${feature}</li>`).join('')}
        </ul>
    `;
    controlsContainer.appendChild(uniformDescription);
    
    // Create action buttons
    const actionButtons = document.createElement('div');
    actionButtons.className = 'avatar-actions mt-4';
    
    actionButtons.innerHTML = `
        <button class="btn btn-outline-primary me-3" id="reset-avatar">
            <i class="fas fa-undo me-1"></i> Reiniciar
        </button>
        <button class="btn btn-primary" id="save-avatar">
            <i class="fas fa-save me-1"></i> Guardar Imagen
        </button>
    `;
    
    controlsContainer.appendChild(actionButtons);
    controlsCol.appendChild(controlsContainer);
    
    // Append both columns to row
    row.appendChild(previewCol);
    row.appendChild(controlsCol);
    
    // Append row to container
    container.appendChild(row);
    
    // Set initial uniform
    if (uniformData.uniforms.length > 0) {
        applyUniform(uniformData.uniforms[0]);
        const firstOption = uniformOptions.querySelector('.uniform-option');
        if (firstOption) {
            firstOption.classList.add('active');
        }
    }
    
    console.log("Avatar system structure created");
}

/**
 * Initialize event listeners for avatar system
 * @param {Object} uniformData - Data for uniforms and accessories
 */
function initAvatarEvents(uniformData) {
    console.log("Initializing avatar system events...");
    
    // Uniform selection
    const uniformOptions = document.querySelectorAll('.uniform-option');
    
    uniformOptions.forEach(option => {
        option.addEventListener('click', () => {
            console.log(`Uniform selected: ${option.dataset.uniformId}`);
            
            // Remove active class from all options
            uniformOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            option.classList.add('active');
            
            // Get selected uniform
            const uniformId = option.dataset.uniformId;
            const selectedUniform = uniformData.uniforms.find(u => u.id === uniformId);
            
            if (selectedUniform) {
                applyUniform(selectedUniform);
                updateUniformDescription(selectedUniform);
            }
        });
    });
    
    // Reset button
    const resetButton = document.getElementById('reset-avatar');
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            console.log("Reset avatar");
            
            // Reset to first uniform
            const firstUniform = uniformData.uniforms[0];
            applyUniform(firstUniform);
            updateUniformDescription(firstUniform);
            
            // Reset active uniform option
            uniformOptions.forEach(opt => opt.classList.remove('active'));
            uniformOptions[0].classList.add('active');
        });
    }
    
    // Save button (placeholder functionality)
    const saveButton = document.getElementById('save-avatar');
    if (saveButton) {
        saveButton.addEventListener('click', () => {
            console.log("Save avatar image (placeholder functionality)");
            alert('Funcionalidad de guardar imagen - próximamente');
        });
    }
    
    console.log("Avatar system events initialized");
}

/**
 * Apply the selected uniform to the avatar
 * @param {Object} uniform - The uniform data object
 */
function applyUniform(uniform) {
    console.log(`Applying uniform: ${uniform.name}`);
    
    // Apply head item
    const avatarHead = document.querySelector('.avatar-head');
    if (avatarHead && uniform.components.head) {
        avatarHead.style.cssText = uniform.components.head.style || '';
        avatarHead.innerHTML = '';
    }
    
    // Apply torso item
    const avatarBody = document.querySelector('.avatar-body');
    if (avatarBody && uniform.components.torso) {
        avatarBody.style.cssText = uniform.components.torso.style || '';
        avatarBody.innerHTML = uniform.components.torso.text ? uniform.components.torso.text : '';
    }
    
    // Apply legs item
    const avatarLegs = document.querySelector('.avatar-legs');
    if (avatarLegs && uniform.components.legs) {
        avatarLegs.style.cssText = uniform.components.legs.style || '';
        avatarLegs.innerHTML = '';
    }
    
    // Apply accessories
    const avatarAccessory = document.querySelector('.avatar-accessory');
    if (avatarAccessory && uniform.components.accessories && uniform.components.accessories.length > 0) {
        const accessory = uniform.components.accessories[0];
        avatarAccessory.style.cssText = accessory.style || '';
        
        if (accessory.text) {
            avatarAccessory.textContent = accessory.text;
        } else {
            avatarAccessory.textContent = '';
        }
    }
    
    console.log(`Uniform applied: ${uniform.name}`);
}

/**
 * Update the uniform description section
 * @param {Object} uniform - The uniform data object
 */
function updateUniformDescription(uniform) {
    console.log(`Updating description for: ${uniform.name}`);
    
    const descriptionElement = document.querySelector('.uniform-description');
    if (descriptionElement) {
        descriptionElement.innerHTML = `
            <h4 class="uniform-description-title">${uniform.name}</h4>
            <p class="uniform-description-text">${uniform.description}</p>
            <h5>Características:</h5>
            <ul class="uniform-features">
                ${uniform.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
        `;
    }
    
    console.log(`Description updated for: ${uniform.name}`);
}
