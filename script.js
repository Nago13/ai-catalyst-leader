// ========================================
// AI Recommendations Database
// ========================================
const aiRecommendations = {
    tecnologia: {
        popular: {
            name: "GitHub Copilot",
            logo: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
            users: "1.8 milhões"
        },
        recommended: {
            name: "Claude Pro",
            logo: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Claude_AI_logo.svg",
            desc: "Análise profunda de código, documentação técnica e debugging com contexto de 200K tokens"
        }
    },
    marketing: {
        popular: {
            name: "ChatGPT Plus",
            logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
            users: "2.4 milhões"
        },
        recommended: {
            name: "Jasper AI",
            logo: "https://www.jasper.ai/favicon.ico",
            desc: "Criação de conteúdo otimizado para conversão, com templates específicos para marketing"
        }
    },
    financeiro: {
        popular: {
            name: "Microsoft Copilot",
            logo: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Microsoft_365_Copilot_Icon.svg",
            users: "1.2 milhões"
        },
        recommended: {
            name: "Google Gemini Advanced",
            logo: "https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg",
            desc: "Análise de planilhas, geração de relatórios e integração nativa com Google Workspace"
        }
    },
    juridico: {
        popular: {
            name: "ChatGPT Plus",
            logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
            users: "890 mil"
        },
        recommended: {
            name: "Claude Pro",
            logo: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Claude_AI_logo.svg",
            desc: "Análise de contratos extensos, pesquisa jurídica e redação legal com janela de contexto de 200K"
        }
    },
    rh: {
        popular: {
            name: "ChatGPT Plus",
            logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
            users: "1.5 milhões"
        },
        recommended: {
            name: "Notion AI",
            logo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
            desc: "Gestão de documentação, criação de políticas e automação de processos de RH integrados"
        }
    },
    operacoes: {
        popular: {
            name: "Microsoft Copilot",
            logo: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Microsoft_365_Copilot_Icon.svg",
            users: "980 mil"
        },
        recommended: {
            name: "Google Gemini Advanced",
            logo: "https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg",
            desc: "Análise de dados operacionais, otimização de processos e integração com ferramentas Google"
        }
    },
    design: {
        popular: {
            name: "Midjourney",
            logo: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Midjourney_Emblem.png",
            users: "2.1 milhões"
        },
        recommended: {
            name: "Adobe Firefly",
            logo: "https://www.adobe.com/content/dam/cc/icons/firefly.svg",
            desc: "Integração nativa com Creative Cloud, geração comercialmente segura e edição vetorial"
        }
    },
    produto: {
        popular: {
            name: "Claude",
            logo: "https://www.anthropic.com/favicon.ico",
            users: "1.8 milhões"
        },
        recommended: {
            name: "Notion AI",
            logo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
            desc: "Gestão de roadmap, documentação de features e colaboração em equipe para produtos"
        }
    },
    outros: {
        popular: {
            name: "ChatGPT Plus",
            logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
            users: "2.4 milhões"
        },
        recommended: {
            name: "Claude Pro",
            logo: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Claude_AI_logo.svg",
            desc: "Versatilidade para múltiplas tarefas, análise profunda e conversas contextuais longas"
        }
    }
};

// ========================================
// Form State Management
// ========================================
let currentStep = 1;
const totalSteps = 4;

// Form data storage
const formData = {
    area: null,
    tarefas: null,
    usaIA: null
};

// ========================================
// Navigation Functions
// ========================================
function updateProgressBar() {
    const progressFill = document.getElementById('progressFill');
    const progressSteps = document.querySelectorAll('.progress-step');
    
    const percentage = (currentStep / totalSteps) * 100;
    progressFill.style.width = `${percentage}%`;
    
    progressSteps.forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNum < currentStep) {
            step.classList.add('completed');
        } else if (stepNum === currentStep) {
            step.classList.add('active');
        }
    });
}

function showStep(step) {
    const formSteps = document.querySelectorAll('.form-step');
    
    formSteps.forEach((formStep) => {
        formStep.classList.remove('active');
        if (parseInt(formStep.dataset.step) === step) {
            formStep.classList.add('active');
        }
    });
    
    currentStep = step;
    updateProgressBar();
}

function nextStep(currentStepNum) {
    // Validate current step
    if (!validateStep(currentStepNum)) {
        return;
    }
    
    // Save data
    saveStepData(currentStepNum);
    
    // Move to next step
    showStep(currentStepNum + 1);
    
    // Smooth scroll to form
    scrollToElement('.diagnostic-section');
}

function prevStep(currentStepNum) {
    showStep(currentStepNum - 1);
    scrollToElement('.diagnostic-section');
}

function validateStep(step) {
    if (step === 1) {
        const selectedArea = document.querySelector('input[name="area"]:checked');
        if (!selectedArea) {
            shakeElement('.options-grid');
            return false;
        }
    } else if (step === 2) {
        const tarefas = document.getElementById('tarefas').value.trim();
        if (!tarefas || tarefas.length < 10) {
            shakeElement('.textarea-container');
            return false;
        }
    } else if (step === 3) {
        const selectedUsaIA = document.querySelector('input[name="usaIA"]:checked');
        if (!selectedUsaIA) {
            shakeElement('.radio-options');
            return false;
        }
    }
    return true;
}

function saveStepData(step) {
    if (step === 1) {
        formData.area = document.querySelector('input[name="area"]:checked').value;
    } else if (step === 2) {
        formData.tarefas = document.getElementById('tarefas').value.trim();
    } else if (step === 3) {
        formData.usaIA = document.querySelector('input[name="usaIA"]:checked').value;
    }
}

// ========================================
// Results Functions
// ========================================
function showResults() {
    // Validate step 3
    if (!validateStep(3)) {
        return;
    }
    
    // Save step 3 data
    saveStepData(3);
    
    // Show loading overlay
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('active');
    }
    
    // Hide current step
    const currentStep = document.querySelector('.form-step.active');
    if (currentStep) {
        currentStep.classList.remove('active');
    }
    
    // After 4 seconds, show results
    setTimeout(() => {
        // Generate recommendations
        const recommendation = aiRecommendations[formData.area] || aiRecommendations.outros;
        
        // Update results display
        document.getElementById('resultTask').textContent = truncateText(formData.tarefas, 100);
        
        // Popular AI
        document.getElementById('popularAIName').textContent = recommendation.popular.name;
        document.getElementById('popularAIUsers').innerHTML = `Usado por <strong>${recommendation.popular.users}</strong> de profissionais em empresas`;
        document.getElementById('popularAILogo').innerHTML = `<img src="${recommendation.popular.logo}" alt="${recommendation.popular.name}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22><rect fill=%22%233b82f6%22 width=%2224%22 height=%2224%22 rx=%224%22/><text x=%2212%22 y=%2216%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2210%22>AI</text></svg>'">`;
        
        // Recommended AI
        document.getElementById('recommendedAIName').textContent = recommendation.recommended.name;
        document.getElementById('recommendedAIDesc').textContent = recommendation.recommended.desc;
        document.getElementById('recommendedAILogo').innerHTML = `<img src="${recommendation.recommended.logo}" alt="${recommendation.recommended.name}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22><rect fill=%22%2306b6d4%22 width=%2224%22 height=%2224%22 rx=%224%22/><text x=%2212%22 y=%2216%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2210%22>AI</text></svg>'">`;
        
        // Hide loading overlay
        if (loadingOverlay) {
            loadingOverlay.classList.remove('active');
        }
        
        // Show results step
        showStep(4);
        scrollToElement('.diagnostic-section');
    }, 4000);
}

function submitEmail() {
    const emailInput = document.getElementById('emailInput');
    const email = emailInput.value.trim();
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        shakeElement('.email-form');
        emailInput.focus();
        return;
    }
    
    // Store form data (in real app, would send to server)
    const fullData = {
        ...formData,
        email: email,
        timestamp: new Date().toISOString()
    };
    
    console.log('Form submitted:', fullData);
    
    // Show success modal
    document.getElementById('successModal').classList.add('active');
    
    // Clear email input
    emailInput.value = '';
}

function closeModal() {
    document.getElementById('successModal').classList.remove('active');
}

function resetForm() {
    // Reset form data
    formData.area = null;
    formData.tarefas = null;
    formData.usaIA = null;
    
    // Reset form inputs
    document.querySelectorAll('input[type="radio"]').forEach(input => input.checked = false);
    document.getElementById('tarefas').value = '';
    
    // Go back to step 1
    showStep(1);
    scrollToElement('.diagnostic-section');
}

// ========================================
// Utility Functions
// ========================================
function scrollToElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
        const offset = 100;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
            top: elementPosition - offset,
            behavior: 'smooth'
        });
    }
}

function shakeElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

// Add shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// ========================================
// Event Listeners
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize progress bar
    updateProgressBar();
    
    // Add click event to option cards for immediate feedback
    document.querySelectorAll('.option-card, .radio-option').forEach(card => {
        card.addEventListener('click', () => {
            // Small haptic-like visual feedback
            card.style.transform = 'scale(0.98)';
            setTimeout(() => {
                card.style.transform = '';
            }, 100);
        });
    });
    
    // Close modal on backdrop click
    document.getElementById('successModal').addEventListener('click', (e) => {
        if (e.target.id === 'successModal') {
            closeModal();
        }
    });
    
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({
                    top: elementPosition - offset,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.background = 'rgba(10, 13, 20, 0.95)';
        } else {
            navbar.style.background = 'rgba(10, 13, 20, 0.8)';
        }
        
        lastScroll = currentScroll;
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.problem-card, .blog-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Initialize Stack Builder
    initializeStackBuilder();
});

// ========================================
// Stack Builder Functions
// ========================================

// Team area roles configuration
const teamAreaRoles = {
    marketing: ['CMO', 'Analista de SEO', 'Copywriter', 'Designer', 'Social Media', 'Growth Hacker', 'Outro'],
    tecnologia: ['CTO', 'Dev Fullstack', 'DevOps', 'Data Scientist', 'QA Engineer', 'Product Manager', 'Outro'],
    vendas: ['Head of Sales', 'SDR', 'Closer', 'Account Executive', 'Sales Ops', 'Outro'],
    financeiro: ['CFO', 'Analista Financeiro', 'Controller', 'Contador', 'Auditor', 'Outro'],
    personalizado: ['Diretor', 'Gerente', 'Analista', 'Assistente', 'Estagiário', 'Especialista', 'Outro']
};

// Team area sliders configuration
const teamAreaSliders = {
    marketing: [
        { id: 'criatividade', label: 'Criatividade', min: 0, max: 100, value: 50 },
        { id: 'foco', label: 'Foco Principal', min: 0, max: 100, value: 50 },
        { id: 'seo', label: 'SEO/Dados', min: 0, max: 100, value: 50 }
    ],
    tecnologia: [
        { id: 'senioridade', label: 'Senioridade', leftLabel: 'Jr', rightLabel: 'Sr', min: 0, max: 100, value: 50 },
        { id: 'autonomia', label: 'Autonomia', leftLabel: 'Assistido', rightLabel: 'Agente', min: 0, max: 100, value: 50 },
        { id: 'tecnico', label: 'Nível Técnico', leftLabel: 'NoCode', rightLabel: 'ProCode', min: 0, max: 100, value: 50 }
    ],
    vendas: [
        { id: 'senioridade', label: 'Senioridade', leftLabel: 'Jr', rightLabel: 'Sr', min: 0, max: 100, value: 50 },
        { id: 'autonomia', label: 'Autonomia', leftLabel: 'Assistido', rightLabel: 'Agente', min: 0, max: 100, value: 50 },
        { id: 'tecnico', label: 'Nível Técnico', leftLabel: 'NoCode', rightLabel: 'ProCode', min: 0, max: 100, value: 50 }
    ],
    financeiro: [
        { id: 'automacao', label: 'Automação vs Supervisão', leftLabel: 'Automação', rightLabel: 'Humano', min: 0, max: 100, value: 50 }
    ],
    personalizado: [
        { id: 'senioridade', label: 'Senioridade', leftLabel: 'Jr', rightLabel: 'Sr', min: 0, max: 100, value: 50 },
        { id: 'autonomia', label: 'Autonomia', leftLabel: 'Assistido', rightLabel: 'Agente', min: 0, max: 100, value: 50 },
        { id: 'tecnico', label: 'Nível Técnico', leftLabel: 'NoCode', rightLabel: 'ProCode', min: 0, max: 100, value: 50 }
    ]
};

// Stack Builder state
let stackBuilderState = {
    selectedArea: null,
    customArea: null,
    teamMembers: []
};

// Initialize Stack Builder
function initializeStackBuilder() {
    // Generate random BUILD_ID
    const buildId = Math.floor(Math.random() * 10000);
    const buildIdElement = document.getElementById('buildId');
    if (buildIdElement) {
        buildIdElement.textContent = buildId.toString().padStart(4, '0');
    }

    // Add first team member
    addTeamMember();

    // Handle area selection - add listeners to both radio buttons and labels
    document.querySelectorAll('input[name="teamArea"]').forEach(radio => {
        radio.addEventListener('change', handleAreaChange);
    });

    // Also add click listeners to labels for better compatibility
    document.querySelectorAll('.area-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't prevent default - let label behavior work naturally
            const radio = card.querySelector('input[type="radio"]');
            if (radio) {
                // Force check the radio
                radio.checked = true;
                // Trigger change event manually
                handleAreaChange({ target: radio });
            }
        });
    });
}

// Handle area change
function handleAreaChange(e) {
    const area = e.target.value;
    stackBuilderState.selectedArea = area;
    
    // Update area cards visual state
    document.querySelectorAll('.area-card').forEach(card => {
        card.classList.remove('selected');
    });
    const selectedCard = e.target.closest('.area-card');
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }

    // Show/hide custom area input
    const customInput = document.getElementById('customAreaInput');
    if (area === 'personalizado') {
        if (customInput) customInput.style.display = 'block';
    } else {
        if (customInput) customInput.style.display = 'none';
        stackBuilderState.customArea = null;
    }

    // Update all team members with new roles and sliders
    updateAllTeamMembers();

    // Handle custom area input
    const customAreaText = document.getElementById('customAreaText');
    if (customAreaText) {
        customAreaText.addEventListener('input', (e) => {
            stackBuilderState.customArea = e.target.value;
        });
    }
}

// Add team member
function addTeamMember() {
    const membersList = document.getElementById('teamMembersList');
    if (!membersList) return;

    const memberId = Date.now();
    const member = {
        id: memberId,
        role: '',
        sliders: {}
    };
    stackBuilderState.teamMembers.push(member);

    const memberCard = createTeamMemberCard(memberId);
    membersList.appendChild(memberCard);
}

// Create team member card
function createTeamMemberCard(memberId) {
    const area = stackBuilderState.selectedArea || 'personalizado';
    const roles = teamAreaRoles[area] || teamAreaRoles.personalizado;
    const sliders = teamAreaSliders[area] || teamAreaSliders.personalizado;

    const card = document.createElement('div');
    card.className = 'team-member-card';
    card.dataset.memberId = memberId;

    // Role dropdown
    const roleSelect = document.createElement('select');
    roleSelect.className = 'member-role-select';
    roleSelect.innerHTML = `<option value="">Selecione um cargo...</option>`;
    roles.forEach(role => {
        const option = document.createElement('option');
        option.value = role;
        option.textContent = role;
        roleSelect.appendChild(option);
    });
    roleSelect.addEventListener('change', (e) => {
        const member = stackBuilderState.teamMembers.find(m => m.id === memberId);
        if (member) member.role = e.target.value;
    });

    // Sliders container
    const slidersContainer = document.createElement('div');
    slidersContainer.className = 'member-sliders';

    sliders.forEach(sliderConfig => {
        const sliderWrapper = document.createElement('div');
        sliderWrapper.className = 'member-slider-wrapper';

        const sliderLabel = document.createElement('div');
        sliderLabel.className = 'slider-label';
        sliderLabel.innerHTML = `
            <span>${sliderConfig.leftLabel || ''}</span>
            <span class="slider-name">${sliderConfig.label}</span>
            <span>${sliderConfig.rightLabel || ''}</span>
        `;

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.className = 'member-slider';
        slider.min = sliderConfig.min;
        slider.max = sliderConfig.max;
        slider.value = sliderConfig.value;
        slider.dataset.sliderId = sliderConfig.id;

        slider.addEventListener('input', (e) => {
            const member = stackBuilderState.teamMembers.find(m => m.id === memberId);
            if (member) {
                member.sliders[sliderConfig.id] = parseInt(e.target.value);
            }
        });

        // Initialize slider value
        const member = stackBuilderState.teamMembers.find(m => m.id === memberId);
        if (member) {
            member.sliders[sliderConfig.id] = sliderConfig.value;
        }

        sliderWrapper.appendChild(sliderLabel);
        sliderWrapper.appendChild(slider);
        slidersContainer.appendChild(sliderWrapper);
    });

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'member-delete-btn';
    deleteBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
    `;
    deleteBtn.addEventListener('click', () => {
        removeTeamMember(memberId);
    });

    card.appendChild(roleSelect);
    card.appendChild(slidersContainer);
    card.appendChild(deleteBtn);

    return card;
}

// Remove team member
function removeTeamMember(memberId) {
    stackBuilderState.teamMembers = stackBuilderState.teamMembers.filter(m => m.id !== memberId);
    const card = document.querySelector(`[data-member-id="${memberId}"]`);
    if (card) {
        card.remove();
    }
}

// Update all team members when area changes
function updateAllTeamMembers() {
    const membersList = document.getElementById('teamMembersList');
    if (!membersList) return;

    // Clear and recreate all member cards
    membersList.innerHTML = '';
    stackBuilderState.teamMembers.forEach(member => {
        const card = createTeamMemberCard(member.id);
        membersList.appendChild(card);
    });
}

// Generate stack report
function generateStackReport() {
    // Validate form
    if (!stackBuilderState.selectedArea) {
        alert('Por favor, selecione a área principal do time.');
        return;
    }

    if (stackBuilderState.teamMembers.length === 0) {
        alert('Por favor, adicione pelo menos um membro ao time.');
        return;
    }

    // Hide form and show results
    const form = document.getElementById('stackBuilderForm');
    const results = document.getElementById('stackResults');
    
    if (form) form.style.display = 'none';
    if (results) {
        results.style.display = 'block';
        displayStackResults();
    }

    // Scroll to results
    scrollToElement('.stack-results');
}

// Display stack results
function displayStackResults() {
    // Sample stack tools (in real app, this would be calculated based on team configuration)
    const stackTools = [
        { name: 'OpenAI GPT-4o', category: 'LLM Core', compatible: true, color: '#10b981' },
        { name: 'Perplexity', category: 'Pesquisa', compatible: true, color: '#3b82f6' },
        { name: 'Zapier', category: 'Automação', compatible: true, color: '#f97316' },
        { name: 'Notion AI', category: 'Knowledge', compatible: true, color: '#1e40af' }
    ];

    const toolsGrid = document.getElementById('stackToolsGrid');
    if (!toolsGrid) return;

    toolsGrid.innerHTML = '';

    stackTools.forEach(tool => {
        const toolCard = document.createElement('div');
        toolCard.className = 'stack-tool-card';
        
        const initial = tool.name.charAt(0);
        toolCard.innerHTML = `
            <div class="tool-icon" style="background: ${tool.color}20; border-color: ${tool.color}40;">
                <span style="color: ${tool.color};">${initial}</span>
            </div>
            <div class="tool-info">
                <h4>${tool.name}</h4>
                <p>${tool.category}</p>
            </div>
            <div class="tool-badge ${tool.compatible ? 'compatible' : ''}">
                ${tool.compatible ? '✓ Compatível' : 'Incompatível'}
            </div>
        `;

        toolsGrid.appendChild(toolCard);
    });
}

// Unlock stack analysis
function unlockStackAnalysis() {
    const emailInput = document.getElementById('stackEmailInput');
    const email = emailInput?.value.trim();

    if (!email) {
        alert('Por favor, insira seu e-mail corporativo.');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, insira um e-mail válido.');
        return;
    }

    // In real app, this would send data to server
    console.log('Unlock analysis:', {
        ...stackBuilderState,
        email: email,
        timestamp: new Date().toISOString()
    });

    // Show success modal
    const successModal = document.getElementById('successModal');
    if (successModal) {
        successModal.classList.add('active');
    }
}
