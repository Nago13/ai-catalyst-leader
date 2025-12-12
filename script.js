// ========================================
// N8N Configuration
// ========================================
// Configure a URL do seu webhook do N8N aqui
// Exemplo: 'https://seu-n8n.com/webhook/create-report'
const N8N_WEBHOOK_URL = 'https://seu-n8n.com/webhook/create-report';
const N8N_GET_REPORT_URL = 'https://seu-n8n.com/webhook/get-report';

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
const totalSteps = 3;

// Form data storage
const formData = {
    area: null,
    cargo: null,
    senioridade: 50,
    autonomia: 50,
    nivelTecnico: 50,
    tarefas: null,
    usaIA: null
};

const usageLabels = {
    frequente: 'Uso frequente de IA no dia a dia',
    eventual: 'Uso eventual, ainda explorando',
    comecar: 'Quer começar a usar IA',
    empresa: 'Empresa já oferece, quer otimizar'
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
        const areaInput = document.querySelector('input[name="area"]:checked');
        if (areaInput) {
            formData.area = areaInput.value;
        }
        const cargoSelect = document.getElementById('cargo');
        if (cargoSelect) {
            formData.cargo = cargoSelect.value;
        }
        const senioridadeSlider = document.getElementById('senioridade');
        if (senioridadeSlider) {
            formData.senioridade = parseInt(senioridadeSlider.value, 10);
        }
        const autonomiaSlider = document.getElementById('autonomia');
        if (autonomiaSlider) {
            formData.autonomia = parseInt(autonomiaSlider.value, 10);
        }
        const nivelTecnicoSlider = document.getElementById('nivelTecnico');
        if (nivelTecnicoSlider) {
            formData.nivelTecnico = parseInt(nivelTecnicoSlider.value, 10);
        }
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

    // After a brief delay, show results
    setTimeout(() => {
        updateStackRecommendation(formData.area);

        // Hide loading overlay
        if (loadingOverlay) {
            loadingOverlay.classList.remove('active');
        }

        const stepsWrapper = document.getElementById('questionnaireSteps');
        const resultsSection = document.getElementById('resultsSection');
        if (stepsWrapper) stepsWrapper.classList.add('hidden');
        if (resultsSection) resultsSection.classList.remove('hidden');

        scrollToElement('#stack-builder');
    }, 1200);
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
    formData.cargo = null;
    formData.senioridade = 50;
    formData.autonomia = 50;
    formData.nivelTecnico = 50;
    formData.tarefas = null;
    formData.usaIA = null;
    
    // Reset form inputs
    document.querySelectorAll('input[type="radio"]').forEach(input => input.checked = false);
    const cargoSelect = document.getElementById('cargo');
    if (cargoSelect) cargoSelect.value = '';
    const senioridadeSlider = document.getElementById('senioridade');
    if (senioridadeSlider) {
        senioridadeSlider.value = 50;
        updateSliderProgress('senioridade', 'senioridadeProgress');
    }
    const autonomiaSlider = document.getElementById('autonomia');
    if (autonomiaSlider) {
        autonomiaSlider.value = 50;
        updateSliderProgress('autonomia', 'autonomiaProgress');
    }
    const nivelTecnicoSlider = document.getElementById('nivelTecnico');
    if (nivelTecnicoSlider) {
        nivelTecnicoSlider.value = 50;
        updateSliderProgress('nivelTecnico', 'nivelTecnicoProgress');
    }
    document.getElementById('tarefas').value = '';

    const stepsWrapper = document.getElementById('questionnaireSteps');
    const resultsSection = document.getElementById('resultsSection');
    if (stepsWrapper) stepsWrapper.classList.remove('hidden');
    if (resultsSection) resultsSection.classList.add('hidden');
    
    // Go back to step 1
    showStep(1);
    scrollToElement('#stack-builder');
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
// Profile Sliders Setup
// ========================================
function updateSliderProgress(sliderId, progressId) {
    const slider = document.getElementById(sliderId);
    const progress = document.getElementById(progressId);
    if (slider && progress) {
        const value = parseInt(slider.value, 10);
        const percentage = value;
        progress.style.width = `${percentage}%`;
    }
}

function setupProfileSliders() {
    // Senioridade slider
    const senioridadeSlider = document.getElementById('senioridade');
    if (senioridadeSlider) {
        // Inicializar progresso
        updateSliderProgress('senioridade', 'senioridadeProgress');
        
        senioridadeSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value, 10);
            formData.senioridade = value;
            updateSliderProgress('senioridade', 'senioridadeProgress');
        });
    }

    // Autonomia slider
    const autonomiaSlider = document.getElementById('autonomia');
    if (autonomiaSlider) {
        // Inicializar progresso
        updateSliderProgress('autonomia', 'autonomiaProgress');
        
        autonomiaSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value, 10);
            formData.autonomia = value;
            updateSliderProgress('autonomia', 'autonomiaProgress');
        });
    }

    // Nível Técnico slider
    const nivelTecnicoSlider = document.getElementById('nivelTecnico');
    if (nivelTecnicoSlider) {
        // Inicializar progresso
        updateSliderProgress('nivelTecnico', 'nivelTecnicoProgress');
        
        nivelTecnicoSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value, 10);
            formData.nivelTecnico = value;
            updateSliderProgress('nivelTecnico', 'nivelTecnicoProgress');
        });
    }
}

// ========================================
// Event Listeners
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize progress bar
    updateProgressBar();
    
    // Initialize profile sliders
    setupProfileSliders();
    
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

const stackAreaMeta = {
    marketing: { label: 'Marketing' },
    tecnologia: { label: 'Tecnologia' },
    vendas: { label: 'Vendas' },
    financeiro: { label: 'Financeiro' },
    personalizado: { label: 'Personalizado' },
    juridico: { label: 'Jurídico' },
    rh: { label: 'RH / Pessoas' },
    operacoes: { label: 'Operações / Logística' },
    design: { label: 'Design / Criativo' },
    produto: { label: 'Produto / Inovação' },
    outros: { label: 'Outros' }
};

const stackRecommendations = {
    marketing: [
        { name: 'Zapier', category: 'Automação', badge: 'Compatível', reason: 'Automatize distribuição e notificações cross-channel.', logo: 'images/zapier-logo.png' },
        { name: 'Perplexity', category: 'Pesquisa', badge: 'Compatível', reason: 'Pesquisa rápida para benchmarks e referências.', logo: 'images/perplexity-logo.png?v=2' },
        { name: 'OpenAI GPT-4o', category: 'LLM Core', badge: 'Compatível', reason: 'Texto, voz e visão para copy de campanhas e assets.', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg' },
        { name: 'Notion AI', category: 'Knowledge', badge: 'Compatível', reason: 'Fonte única para briefing, roteiros e histórico.', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png' },
        { name: 'Microsoft Copilot', category: 'LLM Core', badge: 'Compatível', reason: 'Integração nativa com Office 365 e Teams.', logo: 'images/copilot-logo.jpg?v=4' },
        { name: 'Google Gemini', category: 'LLM Core', badge: 'Compatível', reason: 'Análise multimodal e integração com Google Workspace.', logo: 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg' },
        { name: 'Canva', category: 'Design', badge: 'Compatível', reason: 'Criação visual rápida com templates profissionais.', logo: 'images/canva-logo.jpg?v=5' },
        { name: 'Gamma', category: 'Apresentações', badge: 'Compatível', reason: 'Apresentações e documentos prontos em minutos.', logo: 'images/gamma-logo.jpg?v=4' }
    ],
    tecnologia: [
        { name: 'Claude 3.5 Sonnet', category: 'LLM Core', badge: 'Compatível', reason: 'Contexto extenso para revisão de código e design docs.', logo: 'images/claude-logo.png?v=10' },
        { name: 'GitHub Copilot', category: 'Assistente de Código', badge: 'Compatível', reason: 'Acelera pull requests e testes.', logo: 'images/copilot-logo.jpg?v=4' },
        { name: 'LangGraph / LangChain', category: 'Orquestração', badge: 'Compatível', reason: 'Fluxos controlados e agentes com governança.', logo: 'images/langchain-logo.png' },
        { name: 'Weights & Biases', category: 'Observabilidade', badge: 'Compatível', reason: 'Métricas de experimentos e monitoramento de modelos.', logo: 'https://raw.githubusercontent.com/wandb/assets/main/wandb-dots-logo.svg' },
        { name: 'Microsoft Copilot', category: 'LLM Core', badge: 'Compatível', reason: 'Integração nativa com Office 365 e Teams.', logo: 'images/copilot-logo.jpg?v=4' },
        { name: 'Google Gemini', category: 'LLM Core', badge: 'Compatível', reason: 'Análise multimodal e integração com Google Workspace.', logo: 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg' },
        { name: 'Canva', category: 'Design', badge: 'Compatível', reason: 'Criação visual rápida com templates profissionais.', logo: 'images/canva-logo.jpg?v=5' },
        { name: 'Gamma', category: 'Apresentações', badge: 'Compatível', reason: 'Apresentações e documentos prontos em minutos.', logo: 'images/gamma-logo.jpg?v=4' }
    ],
    vendas: [
        { name: 'Zapier', category: 'Automação', badge: 'Compatível', reason: 'Handoff automático entre CRM, e-mail e suporte.', logo: 'images/zapier-logo.png' },
        { name: 'Perplexity', category: 'Pesquisa', badge: 'Compatível', reason: 'Prospeção e enriquecimento de contas em tempo real.', logo: 'images/perplexity-logo.png?v=2' },
        { name: 'OpenAI GPT-4o mini', category: 'LLM Core', badge: 'Compatível', reason: 'Respostas rápidas e econômicas para pré-venda.', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg' },
        { name: 'Grain / Gong', category: 'Knowledge', badge: 'Compatível', reason: 'Call intelligence e coaching com playbooks.', logo: 'https://assets.website-files.com/615c8f19ebec7b00918f0ca6/6196f5b7d04cf9611d0fafff_gong-logo.svg' },
        { name: 'Microsoft Copilot', category: 'LLM Core', badge: 'Compatível', reason: 'Integração nativa com Office 365 e Teams.', logo: 'images/copilot-logo.jpg?v=4' },
        { name: 'Google Gemini', category: 'LLM Core', badge: 'Compatível', reason: 'Análise multimodal e integração com Google Workspace.', logo: 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg' },
        { name: 'Canva', category: 'Design', badge: 'Compatível', reason: 'Criação visual rápida com templates profissionais.', logo: 'images/canva-logo.jpg?v=5' },
        { name: 'Gamma', category: 'Apresentações', badge: 'Compatível', reason: 'Apresentações e documentos prontos em minutos.', logo: 'images/gamma-logo.jpg?v=4' }
    ],
    financeiro: [
        { name: 'Zapier', category: 'Automação', badge: 'Compatível', reason: 'Robôs para fluxos de aprovação e lançamentos.', logo: 'images/zapier-logo.png' },
        { name: 'Perplexity', category: 'Pesquisa', badge: 'Compatível', reason: 'Busca estruturada para benchmarks e compliance.', logo: 'images/perplexity-logo.png?v=2' },
        { name: 'Microsoft Copilot', category: 'LLM Core', badge: 'Compatível', reason: 'Nativo em Excel e Teams para conciliações rápidas.', logo: 'images/copilot-logo.jpg?v=4' },
        { name: 'Notion AI', category: 'Knowledge', badge: 'Compatível', reason: 'Fonte única de políticas e trilhas de auditoria.', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png' },
        { name: 'Microsoft Copilot', category: 'LLM Core', badge: 'Compatível', reason: 'Integração nativa com Office 365 e Teams.', logo: 'images/copilot-logo.jpg?v=4' },
        { name: 'Google Gemini', category: 'LLM Core', badge: 'Compatível', reason: 'Análise multimodal e integração com Google Workspace.', logo: 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg' },
        { name: 'Canva', category: 'Design', badge: 'Compatível', reason: 'Criação visual rápida com templates profissionais.', logo: 'images/canva-logo.jpg?v=5' },
        { name: 'Gamma', category: 'Apresentações', badge: 'Compatível', reason: 'Apresentações e documentos prontos em minutos.', logo: 'images/gamma-logo.jpg?v=4' }
    ],
    juridico: [
        { name: 'Zapier', category: 'Automação', badge: 'Compatível', reason: 'Automatize intake e notificações de prazos.', logo: 'images/zapier-logo.png' },
        { name: 'Perplexity', category: 'Pesquisa', badge: 'Compatível', reason: 'Pesquisa jurisprudencial com citações.', logo: 'images/perplexity-logo.png?v=2' },
        { name: 'OpenAI GPT-4o', category: 'LLM Core', badge: 'Compatível', reason: 'Contexto amplo para análise de contratos e peças.', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg' },
        { name: 'Notion AI', category: 'Knowledge', badge: 'Compatível', reason: 'Repositório de cláusulas e políticas atualizadas.', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png' },
        { name: 'Microsoft Copilot', category: 'LLM Core', badge: 'Compatível', reason: 'Integração nativa com Office 365 e Teams.', logo: 'images/copilot-logo.jpg?v=4' },
        { name: 'Google Gemini', category: 'LLM Core', badge: 'Compatível', reason: 'Análise multimodal e integração com Google Workspace.', logo: 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg' },
        { name: 'Canva', category: 'Design', badge: 'Compatível', reason: 'Criação visual rápida com templates profissionais.', logo: 'images/canva-logo.jpg?v=5' },
        { name: 'Gamma', category: 'Apresentações', badge: 'Compatível', reason: 'Apresentações e documentos prontos em minutos.', logo: 'images/gamma-logo.jpg?v=4' }
    ],
    rh: [
        { name: 'Zapier', category: 'Automação', badge: 'Compatível', reason: 'Fluxos entre ATS, planilhas e e-mail.', logo: 'images/zapier-logo.png' },
        { name: 'Perplexity', category: 'Pesquisa', badge: 'Compatível', reason: 'Benchmarks de cargos e políticas.', logo: 'images/perplexity-logo.png?v=2' },
        { name: 'OpenAI GPT-4o mini', category: 'LLM Core', badge: 'Compatível', reason: 'Roteiros de entrevistas e feedback rápido.', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg' },
        { name: 'Notion AI', category: 'Knowledge', badge: 'Compatível', reason: 'Base viva de onboarding e playbooks.', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png' },
        { name: 'Microsoft Copilot', category: 'LLM Core', badge: 'Compatível', reason: 'Integração nativa com Office 365 e Teams.', logo: 'images/copilot-logo.jpg?v=4' },
        { name: 'Google Gemini', category: 'LLM Core', badge: 'Compatível', reason: 'Análise multimodal e integração com Google Workspace.', logo: 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg' },
        { name: 'Canva', category: 'Design', badge: 'Compatível', reason: 'Criação visual rápida com templates profissionais.', logo: 'images/canva-logo.jpg?v=5' },
        { name: 'Gamma', category: 'Apresentações', badge: 'Compatível', reason: 'Apresentações e documentos prontos em minutos.', logo: 'images/gamma-logo.jpg?v=4' }
    ],
    operacoes: [
        { name: 'Zapier', category: 'Automação', badge: 'Compatível', reason: 'Integra timesheets, tickets e alertas.', logo: 'images/zapier-logo.png' },
        { name: 'Perplexity', category: 'Pesquisa', badge: 'Compatível', reason: 'Consulta rápida a políticas e SLAs.', logo: 'images/perplexity-logo.png?v=2' },
        { name: 'OpenAI GPT-4o', category: 'LLM Core', badge: 'Compatível', reason: 'Resumos de incidentes e SOPs claros.', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg' },
        { name: 'Notion AI', category: 'Knowledge', badge: 'Compatível', reason: 'Documentação única para operações e logística.', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png' },
        { name: 'Microsoft Copilot', category: 'LLM Core', badge: 'Compatível', reason: 'Integração nativa com Office 365 e Teams.', logo: 'images/copilot-logo.jpg?v=4' },
        { name: 'Google Gemini', category: 'LLM Core', badge: 'Compatível', reason: 'Análise multimodal e integração com Google Workspace.', logo: 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg' },
        { name: 'Canva', category: 'Design', badge: 'Compatível', reason: 'Criação visual rápida com templates profissionais.', logo: 'images/canva-logo.jpg?v=5' },
        { name: 'Gamma', category: 'Apresentações', badge: 'Compatível', reason: 'Apresentações e documentos prontos em minutos.', logo: 'images/gamma-logo.jpg?v=4' }
    ],
    design: [
        { name: 'Midjourney', category: 'Imagem', badge: 'Compatível', reason: 'Exploração visual rápida para concepts.', logo: 'images/midjourney-logo.png?v=2' },
        { name: 'Adobe Firefly', category: 'Imagem', badge: 'Compatível', reason: 'Integração direta com Creative Cloud.', logo: 'https://www.adobe.com/content/dam/cc/icons/firefly.svg' },
        { name: 'Gamma', category: 'Apresentações', badge: 'Compatível', reason: 'Pitches e slides prontos em minutos.', logo: 'images/gamma-logo.jpg?v=4' },
        { name: 'Notion AI', category: 'Knowledge', badge: 'Compatível', reason: 'Organize referências e feedbacks.', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png' },
        { name: 'Microsoft Copilot', category: 'LLM Core', badge: 'Compatível', reason: 'Integração nativa com Office 365 e Teams.', logo: 'images/copilot-logo.jpg?v=4' },
        { name: 'Google Gemini', category: 'LLM Core', badge: 'Compatível', reason: 'Análise multimodal e integração com Google Workspace.', logo: 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg' },
        { name: 'Canva', category: 'Design', badge: 'Compatível', reason: 'Criação visual rápida com templates profissionais.', logo: 'images/canva-logo.jpg?v=5' },
        { name: 'Gamma', category: 'Apresentações', badge: 'Compatível', reason: 'Apresentações e documentos prontos em minutos.', logo: 'images/gamma-logo.jpg?v=4' }
    ],
    produto: [
        { name: 'Zapier', category: 'Automação', badge: 'Compatível', reason: 'Automatize handoffs entre backlog e suporte.', logo: 'images/zapier-logo.png' },
        { name: 'Perplexity', category: 'Pesquisa', badge: 'Compatível', reason: 'Pesquisa de mercado com fontes citadas.', logo: 'images/perplexity-logo.png?v=2' },
        { name: 'Claude 3.5 Sonnet', category: 'LLM Core', badge: 'Compatível', reason: 'Contexto extenso para PRDs e discovery.', logo: 'images/claude-logo.png?v=10' },
        { name: 'Notion AI', category: 'Knowledge', badge: 'Compatível', reason: 'Roadmaps e decisões centralizadas.', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png' },
        { name: 'Microsoft Copilot', category: 'LLM Core', badge: 'Compatível', reason: 'Integração nativa com Office 365 e Teams.', logo: 'images/copilot-logo.jpg?v=4' },
        { name: 'Google Gemini', category: 'LLM Core', badge: 'Compatível', reason: 'Análise multimodal e integração com Google Workspace.', logo: 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg' },
        { name: 'Canva', category: 'Design', badge: 'Compatível', reason: 'Criação visual rápida com templates profissionais.', logo: 'images/canva-logo.jpg?v=5' },
        { name: 'Gamma', category: 'Apresentações', badge: 'Compatível', reason: 'Apresentações e documentos prontos em minutos.', logo: 'images/gamma-logo.jpg?v=4' }
    ],
    personalizado: [
        { name: 'Zapier', category: 'Automação', badge: 'Compatível', reason: 'Automação leve para validar ROI rápido.', logo: 'images/zapier-logo.png' },
        { name: 'Perplexity', category: 'Pesquisa', badge: 'Compatível', reason: 'Pesquisa factual com citações.', logo: 'images/perplexity-logo.png?v=2' },
        { name: 'OpenAI GPT-4o', category: 'LLM Core', badge: 'Compatível', reason: 'Modelo versátil para múltiplos fluxos.', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg' },
        { name: 'Notion AI', category: 'Knowledge', badge: 'Compatível', reason: 'Base de conhecimento viva.', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png' },
        { name: 'Microsoft Copilot', category: 'LLM Core', badge: 'Compatível', reason: 'Integração nativa com Office 365 e Teams.', logo: 'images/copilot-logo.jpg?v=4' },
        { name: 'Google Gemini', category: 'LLM Core', badge: 'Compatível', reason: 'Análise multimodal e integração com Google Workspace.', logo: 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg' },
        { name: 'Canva', category: 'Design', badge: 'Compatível', reason: 'Criação visual rápida com templates profissionais.', logo: 'images/canva-logo.jpg?v=5' },
        { name: 'Gamma', category: 'Apresentações', badge: 'Compatível', reason: 'Apresentações e documentos prontos em minutos.', logo: 'images/gamma-logo.jpg?v=4' }
    ],
    outros: [
        { name: 'Zapier', category: 'Automação', badge: 'Compatível', reason: 'Automação rápida sem código.', logo: 'images/zapier-logo.png' },
        { name: 'Perplexity', category: 'Pesquisa', badge: 'Compatível', reason: 'Busca factual com citações.', logo: 'images/perplexity-logo.png?v=2' },
        { name: 'OpenAI GPT-4o', category: 'LLM Core', badge: 'Compatível', reason: 'Versátil para vários formatos de tarefa.', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg' },
        { name: 'Notion AI', category: 'Knowledge', badge: 'Compatível', reason: 'Organize conhecimento do time.', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png' },
        { name: 'Microsoft Copilot', category: 'LLM Core', badge: 'Compatível', reason: 'Integração nativa com Office 365 e Teams.', logo: 'images/copilot-logo.jpg?v=4' },
        { name: 'Google Gemini', category: 'LLM Core', badge: 'Compatível', reason: 'Análise multimodal e integração com Google Workspace.', logo: 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg' },
        { name: 'Canva', category: 'Design', badge: 'Compatível', reason: 'Criação visual rápida com templates profissionais.', logo: 'images/canva-logo.jpg?v=5' },
        { name: 'Gamma', category: 'Apresentações', badge: 'Compatível', reason: 'Apresentações e documentos prontos em minutos.', logo: 'images/gamma-logo.jpg?v=4' }
    ]
};

const stackBuilderState = {
    selectedArea: 'marketing',
    teamMembers: []
};

// Initialize Stack Builder
function initializeStackBuilder() {
    const buildId = Math.floor(Math.random() * 10000);
    const buildIdElement = document.getElementById('buildId');
    if (buildIdElement) {
        buildIdElement.textContent = buildId.toString().padStart(4, '0');
    }

    setupAreaSelection();

    const addBtn = document.getElementById('addMemberBtn');
    if (addBtn) {
        addBtn.addEventListener('click', addTeamMember);
    }

    const generateBtn = document.getElementById('generateStackBtn');
    if (generateBtn) {
        generateBtn.addEventListener('click', generateStackReport);
    }

    const lockUnlockBtn = document.getElementById('stackLockUnlockBtn');
    if (lockUnlockBtn) {
        lockUnlockBtn.addEventListener('click', handleStackEmailSubmit);
    }

    // Start with one member to facilitar a configuração
    addTeamMember();
}

function setupAreaSelection() {
    const areaCards = document.querySelectorAll('.area-card');
    if (!areaCards.length) return;

    areaCards.forEach(card => {
        card.addEventListener('click', () => {
            const area = card.dataset.area;
            setSelectedArea(area);
        });
    });

    const defaultArea = stackBuilderState.selectedArea || areaCards[0].dataset.area;
    setSelectedArea(defaultArea);
}

function setSelectedArea(area) {
    stackBuilderState.selectedArea = area;

    document.querySelectorAll('.area-card').forEach(card => {
        card.classList.toggle('active', card.dataset.area === area);
    });

    updateAllTeamMembers();

    const note = document.getElementById('stackRecommendationNote');
    if (note) {
        const label = stackAreaMeta[area]?.label || 'Personalizado';
        note.textContent = `Stack baseada na área de ${label}. Ajuste os membros para refinar a arquitetura.`;
    }
}

// Add team member
function addTeamMember() {
    const membersList = document.getElementById('teamMembersList');
    if (!membersList) return;

    const placeholder = document.getElementById('teamMembersPlaceholder');
    if (placeholder) {
        placeholder.remove();
    }

    const memberId = Date.now() + Math.random();
    const member = {
        id: memberId,
        role: '',
        sliders: {}
    };
    stackBuilderState.teamMembers.push(member);

    const memberCard = createTeamMemberCard(memberId, member);
    membersList.appendChild(memberCard);
}

// Create team member card
function createTeamMemberCard(memberId, existingMember) {
    const area = stackBuilderState.selectedArea || 'personalizado';
    const roles = teamAreaRoles[area] || teamAreaRoles.personalizado;
    const sliders = teamAreaSliders[area] || teamAreaSliders.personalizado;

    const card = document.createElement('div');
    card.className = 'team-member-card';
    card.dataset.memberId = memberId;

    const member = existingMember || stackBuilderState.teamMembers.find(m => m.id === memberId);

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
    if (member?.role) {
        roleSelect.value = member.role;
    }
    roleSelect.addEventListener('change', (e) => {
        const localMember = stackBuilderState.teamMembers.find(m => m.id === memberId);
        if (localMember) localMember.role = e.target.value;
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

        const sliderValue = document.createElement('span');
        sliderValue.className = 'slider-value';
        sliderValue.textContent = member?.sliders?.[sliderConfig.id] ?? sliderConfig.value;

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.className = 'member-slider';
        slider.min = sliderConfig.min;
        slider.max = sliderConfig.max;
        slider.value = member?.sliders?.[sliderConfig.id] ?? sliderConfig.value;
        slider.dataset.sliderId = sliderConfig.id;

        slider.addEventListener('input', (e) => {
            const localMember = stackBuilderState.teamMembers.find(m => m.id === memberId);
            if (localMember) {
                localMember.sliders[sliderConfig.id] = parseInt(e.target.value, 10);
                sliderValue.textContent = e.target.value;
            }
        });

        // Initialize slider value
        const localMember = stackBuilderState.teamMembers.find(m => m.id === memberId);
        if (localMember) {
            localMember.sliders[sliderConfig.id] = slider.valueAsNumber;
        }

        sliderWrapper.appendChild(sliderLabel);
        sliderWrapper.appendChild(slider);
        sliderWrapper.appendChild(sliderValue);
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

    if (!stackBuilderState.teamMembers.length) {
        const membersList = document.getElementById('teamMembersList');
        if (membersList) {
            membersList.innerHTML = '';
            membersList.appendChild(createMembersPlaceholder());
        }
    }
}

// Update all team members when area changes
function updateAllTeamMembers() {
    const membersList = document.getElementById('teamMembersList');
    if (!membersList) return;

    membersList.innerHTML = '';

    if (!stackBuilderState.teamMembers.length) {
        membersList.appendChild(createMembersPlaceholder());
        return;
    }

    stackBuilderState.teamMembers.forEach(member => {
        const card = createTeamMemberCard(member.id, member);
        membersList.appendChild(card);
    });
}

function createMembersPlaceholder() {
    const placeholder = document.createElement('div');
    placeholder.className = 'team-members-placeholder';
    placeholder.id = 'teamMembersPlaceholder';
    placeholder.innerHTML = `
        <div class="placeholder-icon">✦</div>
        <p>Nenhum membro adicionado. Adicione alguém para configurar.</p>
    `;
    return placeholder;
}

function generateStackReport() {
    const area = stackBuilderState.selectedArea;
    if (!area) {
        shakeElement('.area-cards');
        return;
    }

    if (!stackBuilderState.teamMembers.length) {
        shakeElement('#teamMembersList');
        return;
    }

    const allRolesSelected = stackBuilderState.teamMembers.every(member => member.role);
    if (!allRolesSelected) {
        shakeElement('#teamMembersList');
        return;
    }

    const sliderStats = getSliderStats();
    renderStackSummary(area, sliderStats);
    const stack = stackRecommendations[area] || stackRecommendations.personalizado;
    renderStackCards(stack);

    const section = document.getElementById('stackRecommendation');
    if (section) {
        section.classList.remove('hidden');
    }
    scrollToElement('#stackRecommendation');
}

function renderStackCards(cards) {
    const container = document.getElementById('stackCards');
    if (!container) return;
    container.innerHTML = '';

    cards.forEach((cardInfo, index) => {
        const iconContent = cardInfo.logo
            ? `<img src="${cardInfo.logo}" alt="${cardInfo.name}" onerror="this.style.display='none';this.parentElement.textContent='${cardInfo.icon || cardInfo.name?.[0] || 'AI'}';">`
            : (cardInfo.icon || cardInfo.name?.[0] || 'AI');

        const card = document.createElement('div');
        card.className = 'stack-tool-card';
        if (index >= 4) {
            card.classList.add('locked');
        }
        card.innerHTML = `
            <div class="stack-tool-head">
                <div class="stack-tool-icon">${iconContent}</div>
                <span class="stack-pill">${cardInfo.badge || 'Compatível'}</span>
            </div>
            <div class="stack-tool-info">
                <p class="stack-tool-category">${cardInfo.category}</p>
                <h4>${cardInfo.name}</h4>
                <p class="stack-tool-reason">${cardInfo.reason}</p>
            </div>
        `;
        container.appendChild(card);
    });
}

function updateStackRecommendation(area) {
    const stack = stackRecommendations[area] || stackRecommendations.personalizado;
    const areaLabel = stackAreaMeta[area]?.label || stackAreaMeta.personalizado.label;
    const usageText = usageLabels[formData.usaIA] || 'Começando com IA';

    const areaEl = document.getElementById('stackSummaryArea');
    const tasksEl = document.getElementById('stackSummaryMembers');
    const focusEl = document.getElementById('stackSummaryFocus');
    const noteEl = document.getElementById('stackRecommendationNote');

    if (areaEl) areaEl.textContent = `Área: ${areaLabel}`;
    if (tasksEl) tasksEl.textContent = `Tarefas: ${truncateText(formData.tarefas, 120)}`;
    if (noteEl) noteEl.textContent = `Stack baseada na área de ${areaLabel}.`;

    if (focusEl) {
        focusEl.innerHTML = '';
        const chip = document.createElement('span');
        chip.className = 'focus-chip';
        chip.textContent = usageText;
        focusEl.appendChild(chip);
    }

    renderStackCards(stack);
}

function getSliderStats() {
    const stats = {};
    stackBuilderState.teamMembers.forEach(member => {
        Object.entries(member.sliders || {}).forEach(([id, value]) => {
            if (!stats[id]) {
                stats[id] = { sum: 0, count: 0 };
            }
            stats[id].sum += value;
            stats[id].count += 1;
        });
    });
    return stats;
}

function renderStackSummary(area, sliderStats) {
    const areaEl = document.getElementById('stackSummaryArea');
    const membersEl = document.getElementById('stackSummaryMembers');
    const focusEl = document.getElementById('stackSummaryFocus');
    if (!areaEl || !membersEl || !focusEl) return;

    const areaLabel = stackAreaMeta[area]?.label || 'Personalizado';
    const roles = stackBuilderState.teamMembers.map(m => m.role).filter(Boolean);

    areaEl.textContent = `Área: ${areaLabel}`;
    membersEl.textContent = `${roles.length} membro(s): ${roles.join(', ')}`;

    focusEl.innerHTML = '';

    const slidersSorted = Object.entries(sliderStats)
        .map(([id, { sum, count }]) => ({ id, avg: Math.round(sum / count) }))
        .sort((a, b) => b.avg - a.avg)
        .slice(0, 3);

    if (!slidersSorted.length) {
        const chip = document.createElement('span');
        chip.className = 'focus-chip';
        chip.textContent = 'Ajuste os sliders para ver o foco';
        focusEl.appendChild(chip);
        return;
    }

    slidersSorted.forEach(item => {
        const label = findSliderLabel(item.id, area);
        const chip = document.createElement('span');
        chip.className = 'focus-chip';
        chip.textContent = `${label}: ${item.avg}%`;
        focusEl.appendChild(chip);
    });
}

function findSliderLabel(id, area) {
    const sliders = teamAreaSliders[area] || teamAreaSliders.personalizado;
    const slider = sliders.find(s => s.id === id);
    return slider?.label || id;
}

function handleStackEmailSubmit() {
    const emailInputLock = document.getElementById('stackLockEmail');
    const email = emailInputLock?.value?.trim() || '';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        shakeElement('.stack-lock-form');
        emailInputLock?.focus();
        return;
    }

    // Preparar todos os dados do formulário
    const fullData = {
        email: email,
        area: formData.area,
        cargo: formData.cargo,
        senioridade: formData.senioridade,
        autonomia: formData.autonomia,
        nivelTecnico: formData.nivelTecnico,
        tarefas: formData.tarefas,
        usaIA: formData.usaIA,
        stackRecommendation: getCurrentStackRecommendation()
    };

    // Mostrar loading
    const unlockBtn = document.getElementById('stackLockUnlockBtn');
    if (unlockBtn) {
        unlockBtn.disabled = true;
        unlockBtn.textContent = 'Gerando relatório...';
    }

    // Enviar para o N8N
    createUserPage(fullData);
}

function getCurrentStackRecommendation() {
    const stackCards = document.querySelectorAll('.stack-tool-card:not(.locked)');
    const stack = [];
    
    stackCards.forEach(card => {
        const name = card.querySelector('h4')?.textContent || '';
        const category = card.querySelector('.stack-tool-category')?.textContent || '';
        const reason = card.querySelector('.stack-tool-reason')?.textContent || '';
        const logoImg = card.querySelector('.stack-tool-icon img');
        const logo = logoImg ? logoImg.src : '';
        const badge = card.querySelector('.stack-pill')?.textContent || '';
        
        stack.push({ name, category, reason, logo, badge });
    });
    
    return stack;
}

async function createUserPage(data) {
    try {
        // Se não tiver N8N configurado ainda, usar fallback
        if (N8N_WEBHOOK_URL.includes('seu-n8n.com')) {
            console.warn('N8N webhook não configurado. Configure a URL em script.js');
            // Fallback: mostrar modal de sucesso
            document.getElementById('successModal').classList.add('active');
            const emailInputLock = document.getElementById('stackLockEmail');
            if (emailInputLock) emailInputLock.value = '';
            const unlockBtn = document.getElementById('stackLockUnlockBtn');
            if (unlockBtn) {
                unlockBtn.disabled = false;
                unlockBtn.textContent = 'Desbloquear';
            }
            return;
        }
        
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const result = await response.json();
            
            // Redirecionar para a nova página
            if (result.url) {
                window.location.href = result.url;
            } else if (result.slug) {
                window.location.href = `relatorio.html?slug=${result.slug}`;
            } else {
                // Fallback
                document.getElementById('successModal').classList.add('active');
                const emailInputLock = document.getElementById('stackLockEmail');
                if (emailInputLock) emailInputLock.value = '';
            }
        } else {
            throw new Error('Erro ao criar relatório');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao gerar relatório. Tente novamente.');
        const unlockBtn = document.getElementById('stackLockUnlockBtn');
        if (unlockBtn) {
            unlockBtn.disabled = false;
            unlockBtn.textContent = 'Desbloquear';
        }
    }
}
