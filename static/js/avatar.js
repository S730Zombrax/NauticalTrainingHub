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
                components: {
                    head: {
                        id: 'gorra-gala',
                        url: 'background-image: linear-gradient(to bottom, #003366, #002244); border-radius: 30% 30% 0 0; height: 40px; width: 80px; position: relative;',
                        icon: '🎖️'
                    },
                    torso: {
                        id: 'chaqueta-gala',
                        url: 'background: linear-gradient(to right, #002244 10%, #003366 25%, #002855 75%, #001c39 90%);',
                        icon: '🧥'
                    },
                    legs: {
                        id: 'pantalon-gala',
                        url: 'background-color: #002244;',
                        icon: '👖'
                    },
                    accessories: [
                        {
                            id: 'insignia-gala',
                            url: 'background-image: url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'40\' fill=\'%23f9a826\'/%3E%3Cpath d=\'M50 10 L54 40 L85 40 L60 60 L70 90 L50 70 L30 90 L40 60 L15 40 L46 40 Z\' fill=\'%23003366\'/%3E%3C/svg%3E"); width: 50px; height: 50px; top: 120px; left: 125px;',
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
                        url: 'background-color: #003366; border-radius: 40% 40% 0 0; height: 30px; width: 70px; position: relative;',
                        icon: '🧢'
                    },
                    torso: {
                        id: 'polo-diario',
                        url: 'background-color: white; border: 2px solid #003366; border-top-width: 10px;',
                        icon: '👕'
                    },
                    legs: {
                        id: 'pantalon-diario',
                        url: 'background-color: #003366;',
                        icon: '👖'
                    },
                    accessories: [
                        {
                            id: 'logo-diario',
                            url: 'background-image: url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'45\' fill=\'%23003366\'/%3E%3Ctext x=\'50\' y=\'65\' text-anchor=\'middle\' font-family=\'Arial\' font-size=\'30\' fill=\'%23ffffff\'%3EUMC%3C/text%3E%3C/svg%3E"); width: 40px; height: 40px; top: 120px; left: 130px;',
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
                        url: 'background: transparent;',
                        icon: '🚫'
                    },
                    torso: {
                        id: 'camiseta-deportiva',
                        url: 'background-color: #0077b6; color: white; display: flex; align-items: center; justify-content: center;',
                        icon: '👕'
                    },
                    legs: {
                        id: 'shorts-deportivos',
                        url: 'background-color: #003366; height: 80px;',
                        icon: '🩳'
                    },
                    accessories: [
                        {
                            id: 'texto-umc',
                            url: 'display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 16px; top: 140px; left: 130px; width: 40px; height: 40px;',
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
                        url: 'background-color: #f9a826; border-radius: 50% 50% 0 0; height: 30px; width: 70px; position: relative;',
                        icon: '⛑️'
                    },
                    torso: {
                        id: 'bata-laboratorio',
                        url: 'background-color: #90e0ef; border: 1px solid #0077b6;',
                        icon: '🥼'
                    },
                    legs: {
                        id: 'jean-laboratorio',
                        url: 'background-color: #274c77;',
                        icon: '👖'
                    },
                    accessories: [
                        {
                            id: 'gafas-seguridad',
                            url: 'background-image: url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 50\'%3E%3Cpath d=\'M10 25 C10 15 20 15 30 25 L70 25 C80 15 90 15 90 25 L90 30 C90 40 80 40 70 30 L30 30 C20 40 10 40 10 30 Z\' fill=\'%23caf0f8\'/%3E%3C/svg%3E"); width: 60px; height: 20px; top: 85px; left: 120px;',
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
                        url: 'background-color: white; border-radius: 50% 50% 0 0; height: 35px; width: 75px; position: relative;',
                        icon: '⛑️'
                    },
                    torso: {
                        id: 'camisa-pasantias',
                        url: 'background-color: #a8dadc; border: 1px solid #457b9d;',
                        icon: '👔'
                    },
                    legs: {
                        id: 'pantalon-pasantias',
                        url: 'background-color: #1d3557;',
                        icon: '👖'
                    },
                    accessories: [
                        {
                            id: 'chaleco-reflectante',
                            url: 'background-color: #f9c74f; opacity: 0.7; width: 80px; height: 100px; top: 120px; left: 110px;',
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
}

/**
 * Create the avatar system HTML structure
 * @param {HTMLElement} container - The container element
 * @param {Object} uniformData - Data for uniforms and accessories
 */
function createAvatarSystem(container, uniformData) {
    // Clear container
    container.innerHTML = '';
    
    // Create preview section container
    const previewContainer = document.createElement('div');
    previewContainer.className = 'avatar-preview-container';
    
    // Create avatar label
    const avatarLabel = document.createElement('div');
    avatarLabel.className = 'avatar-label';
    avatarLabel.textContent = 'Vista Previa del Uniforme';
    previewContainer.appendChild(avatarLabel);
    
    // Create avatar preview
    const previewSection = document.createElement('div');
    previewSection.className = 'avatar-preview';
    
    // Add a human silhouette as the base
    const silhouette = document.createElement('div');
    silhouette.className = 'avatar-silhouette';
    silhouette.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 450" width="100%" height="100%">
            <path d="M150 50 A40 40 0 0 1 190 90 V110 A60 60 0 0 1 200 150 V300 L180 350 V420 H150 V350 L120 300 V150 A60 60 0 0 1 130 110 V90 A40 40 0 0 1 150 50Z" fill="#e0e0e0" stroke="#777" stroke-width="2"/>
            <circle cx="150" cy="50" r="35" fill="#f5d7b5" stroke="#777" stroke-width="2"/>
        </svg>
    `;
    previewSection.appendChild(silhouette);
    
    // Add uniform layers
    previewSection.innerHTML += `
        <div class="avatar-base"></div>
        <div class="avatar-head"></div>
        <div class="avatar-body"></div>
        <div class="avatar-legs"></div>
        <div class="avatar-accessory"></div>
    `;
    previewContainer.appendChild(previewSection);
    
    // Create controls section
    const controlsSection = document.createElement('div');
    controlsSection.className = 'avatar-controls';
    
    // Create uniform category section
    const uniformCategory = document.createElement('div');
    uniformCategory.className = 'uniform-category';
    
    const uniformCategoryTitle = document.createElement('h3');
    uniformCategoryTitle.className = 'uniform-category-title';
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
                    <img src="${uniform.imageUrl}" alt="${uniform.name}" width="60" height="60">
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
    controlsSection.appendChild(uniformCategory);
    
    // Create uniform description container
    const uniformDescription = document.createElement('div');
    uniformDescription.className = 'uniform-description';
    uniformDescription.innerHTML = `
        <h4 class="uniform-description-title">${uniformData.uniforms[0].name}</h4>
        <p class="uniform-description-text">${uniformData.uniforms[0].description}</p>
        <h5>Características:</h5>
        <ul class="uniform-features">
            ${uniformData.uniforms[0].features.map(feature => `<li>${feature}</li>`).join('')}
        </ul>
    `;
    controlsSection.appendChild(uniformDescription);
    
    // Create action buttons
    const actionButtons = document.createElement('div');
    actionButtons.className = 'avatar-actions';
    
    actionButtons.innerHTML = `
        <button class="avatar-action-btn secondary" id="reset-avatar">
            <i class="fas fa-undo"></i> Reiniciar
        </button>
        <button class="avatar-action-btn" id="save-avatar">
            <i class="fas fa-save"></i> Guardar Imagen
        </button>
    `;
    
    controlsSection.appendChild(actionButtons);
    
    // Append both sections to container
    container.appendChild(previewContainer);
    container.appendChild(controlsSection);
    
    // Set initial uniform
    if (uniformData.uniforms.length > 0) {
        applyUniform(uniformData.uniforms[0]);
        uniformOptions.querySelector('.uniform-option').classList.add('active');
    }
}

/**
 * Initialize event listeners for avatar system
 * @param {Object} uniformData - Data for uniforms and accessories
 */
function initAvatarEvents(uniformData) {
    // Uniform selection
    const uniformOptions = document.querySelectorAll('.uniform-option');
    
    uniformOptions.forEach(option => {
        option.addEventListener('click', () => {
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
            alert('Funcionalidad de guardar imagen - próximamente');
        });
    }
}

/**
 * Apply the selected uniform to the avatar
 * @param {Object} uniform - The uniform data object
 */
function applyUniform(uniform) {
    // Apply head item
    const avatarHead = document.querySelector('.avatar-head');
    if (avatarHead && uniform.components.head) {
        avatarHead.style.cssText = uniform.components.head.url || '';
    }
    
    // Apply torso item
    const avatarBody = document.querySelector('.avatar-body');
    if (avatarBody && uniform.components.torso) {
        avatarBody.style.cssText = uniform.components.torso.url || '';
    }
    
    // Apply legs item
    const avatarLegs = document.querySelector('.avatar-legs');
    if (avatarLegs && uniform.components.legs) {
        avatarLegs.style.cssText = uniform.components.legs.url || '';
    }
    
    // Apply accessories
    const avatarAccessory = document.querySelector('.avatar-accessory');
    if (avatarAccessory && uniform.components.accessories && uniform.components.accessories.length > 0) {
        const accessory = uniform.components.accessories[0];
        avatarAccessory.style.cssText = accessory.url || '';
        
        if (accessory.text) {
            avatarAccessory.textContent = accessory.text;
        } else {
            avatarAccessory.textContent = '';
        }
    }
}

/**
 * Update the uniform description section
 * @param {Object} uniform - The uniform data object
 */
function updateUniformDescription(uniform) {
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
}
