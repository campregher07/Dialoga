// Variáveis globais
let currentMeditationType = '';
let currentBreathingType = '';
let breathingTimer = null;
let breathingPhase = 0;
let breathingCycle = 0;
let isBreathingActive = false;
let isPaused = false;

// Configurações dos exercícios de respiração
const breathingConfigs = {
    diafragmatica: {
        name: 'Respiração Diafragmática',
        phases: [
            { name: 'Inspire', duration: 4, action: 'breathing-in' },
            { name: 'Expire', duration: 6, action: 'breathing-out' }
        ],
        cycles: 10,
        instructions: 'Respire profundamente usando o diafragma. Coloque uma mão no peito e outra no abdômen. A mão do abdômen deve se mover mais que a do peito.'
    },
    '478': {
        name: 'Respiração 4-7-8',
        phases: [
            { name: 'Inspire', duration: 4, action: 'breathing-in' },
            { name: 'Segure', duration: 7, action: 'holding' },
            { name: 'Expire', duration: 8, action: 'breathing-out' }
        ],
        cycles: 4,
        instructions: 'Inspire pelo nariz por 4 segundos, segure a respiração por 7 segundos, expire pela boca por 8 segundos.'
    },
    box: {
        name: 'Respiração Box',
        phases: [
            { name: 'Inspire', duration: 4, action: 'breathing-in' },
            { name: 'Segure', duration: 4, action: 'holding' },
            { name: 'Expire', duration: 4, action: 'breathing-out' },
            { name: 'Segure', duration: 4, action: 'holding' }
        ],
        cycles: 6,
        instructions: 'Respire em um padrão quadrado: inspire, segure, expire, segure - cada fase por 4 segundos.'
    }
};

// Configurações das meditações
const meditationConfigs = {
    relaxamento: {
        name: 'Relaxamento Muscular',
        audio: '/audio/meditacao_relaxamento_muscular.wav',
        instructions: 'Esta meditação irá guiá-la através de um relaxamento muscular progressivo, ajudando a liberar tensões do corpo.'
    },
    foco: {
        name: 'Foco Mental',
        audio: '/audio/meditacao_foco_mental.wav',
        instructions: 'Desenvolva sua capacidade de concentração e clareza mental através desta prática de mindfulness.'
    },
    gratidao: {
        name: 'Gratidão',
        audio: '/audio/meditacao_gratidao.wav',
        instructions: 'Cultive sentimentos de gratidão e conecte-se com os aspectos positivos da sua vida.'
    }
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    loadFavorites();
    loadHistory();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    // Fechar modais clicando fora
    window.addEventListener('click', function(event) {
        const meditationModal = document.getElementById('meditationModal');
        const breathingModal = document.getElementById('breathingModal');
        
        if (event.target === meditationModal) {
            closeMeditationModal();
        }
        if (event.target === breathingModal) {
            closeBreathingModal();
        }
    });

    // Tecla ESC para fechar modais
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeMeditationModal();
            closeBreathingModal();
        }
    });
}

// Funções de Meditação
function startMeditation(type) {
    currentMeditationType = type;
    const config = meditationConfigs[type];
    
    if (!config) {
        console.error('Tipo de meditação não encontrado:', type);
        return;
    }

    // Configurar modal
    document.getElementById('modalTitle').textContent = config.name;
    document.getElementById('meditationInstructions').textContent = config.instructions;
    
    // Configurar áudio
    const audio = document.getElementById('meditationAudio');
    audio.src = config.audio;
    
    // Mostrar modal
    document.getElementById('meditationModal').style.display = 'block';
    
    // Adicionar ao histórico
    addToHistory('meditation', config.name);
    
    // Atualizar botão de favorito
    updateFavoriteButton('meditation', type);
}

function closeMeditationModal() {
    const modal = document.getElementById('meditationModal');
    const audio = document.getElementById('meditationAudio');
    
    // Pausar áudio
    audio.pause();
    audio.currentTime = 0;
    
    // Fechar modal
    modal.style.display = 'none';
    currentMeditationType = '';
}

// Funções de Respiração
function startBreathing(type) {
    currentBreathingType = type;
    const config = breathingConfigs[type];
    
    if (!config) {
        console.error('Tipo de respiração não encontrado:', type);
        return;
    }

    // Configurar modal
    document.getElementById('breathingModalTitle').textContent = config.name;
    document.getElementById('breathingInstructions').textContent = config.instructions;
    
    // Resetar timer
    resetBreathingTimer();
    
    // Mostrar modal
    document.getElementById('breathingModal').style.display = 'block';
    
    // Adicionar ao histórico
    addToHistory('breathing', config.name);
    
    // Atualizar botão de favorito
    updateFavoriteButton('breathing', type);
}

function closeBreathingModal() {
    const modal = document.getElementById('breathingModal');
    
    // Parar timer
    stopBreathingTimer();
    
    // Fechar modal
    modal.style.display = 'none';
    currentBreathingType = '';
}

function startBreathingTimer() {
    if (isBreathingActive && !isPaused) return;
    
    const config = breathingConfigs[currentBreathingType];
    if (!config) return;

    isBreathingActive = true;
    isPaused = false;
    
    // Atualizar botões
    document.getElementById('startBreathingBtn').style.display = 'none';
    document.getElementById('pauseBreathingBtn').style.display = 'inline-flex';
    
    if (breathingCycle === 0 && breathingPhase === 0) {
        // Primeira execução - countdown inicial
        startCountdown();
    } else {
        // Retomar de onde parou
        continueBreathingCycle();
    }
}

function pauseBreathingTimer() {
    isPaused = true;
    isBreathingActive = false;
    
    if (breathingTimer) {
        clearTimeout(breathingTimer);
        breathingTimer = null;
    }
    
    // Atualizar botões
    document.getElementById('startBreathingBtn').style.display = 'inline-flex';
    document.getElementById('pauseBreathingBtn').style.display = 'none';
    
    // Atualizar UI
    document.getElementById('timerPhase').textContent = 'Pausado';
    document.querySelector('.timer-circle').className = 'timer-circle';
}

function stopBreathingTimer() {
    isBreathingActive = false;
    isPaused = false;
    
    if (breathingTimer) {
        clearTimeout(breathingTimer);
        breathingTimer = null;
    }
    
    resetBreathingTimer();
}

function resetBreathingTimer() {
    breathingPhase = 0;
    breathingCycle = 0;
    
    // Resetar UI
    document.getElementById('timerPhase').textContent = 'Prepare-se';
    document.getElementById('timerCount').textContent = '3';
    document.querySelector('.timer-circle').className = 'timer-circle';
    
    // Resetar botões
    document.getElementById('startBreathingBtn').style.display = 'inline-flex';
    document.getElementById('pauseBreathingBtn').style.display = 'none';
}

function startCountdown() {
    let countdown = 3;
    document.getElementById('timerPhase').textContent = 'Prepare-se';
    document.getElementById('timerCount').textContent = countdown;
    
    const countdownInterval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            document.getElementById('timerCount').textContent = countdown;
        } else {
            clearInterval(countdownInterval);
            document.getElementById('timerPhase').textContent = 'Começando...';
            document.getElementById('timerCount').textContent = '';
            
            setTimeout(() => {
                if (isBreathingActive) {
                    continueBreathingCycle();
                }
            }, 1000);
        }
    }, 1000);
}

function continueBreathingCycle() {
    const config = breathingConfigs[currentBreathingType];
    if (!config || !isBreathingActive) return;
    
    if (breathingCycle >= config.cycles) {
        // Exercício completo
        completeBreathingExercise();
        return;
    }
    
    const currentPhaseConfig = config.phases[breathingPhase];
    let timeLeft = currentPhaseConfig.duration;
    
    // Atualizar UI
    document.getElementById('timerPhase').textContent = currentPhaseConfig.name;
    document.getElementById('timerCount').textContent = timeLeft;
    
    // Aplicar classe CSS para animação
    const timerCircle = document.querySelector('.timer-circle');
    timerCircle.className = `timer-circle ${currentPhaseConfig.action}`;
    
    // Timer da fase atual
    const phaseTimer = setInterval(() => {
        if (!isBreathingActive || isPaused) {
            clearInterval(phaseTimer);
            return;
        }
        
        timeLeft--;
        document.getElementById('timerCount').textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(phaseTimer);
            
            // Próxima fase
            breathingPhase++;
            if (breathingPhase >= config.phases.length) {
                breathingPhase = 0;
                breathingCycle++;
            }
            
            // Pequena pausa entre fases
            setTimeout(() => {
                if (isBreathingActive) {
                    continueBreathingCycle();
                }
            }, 500);
        }
    }, 1000);
}

function completeBreathingExercise() {
    isBreathingActive = false;
    
    // Mostrar mensagem de conclusão
    document.getElementById('timerPhase').textContent = 'Concluído!';
    document.getElementById('timerCount').textContent = '✓';
    document.querySelector('.timer-circle').className = 'timer-circle';
    
    // Resetar após alguns segundos
    setTimeout(() => {
        resetBreathingTimer();
    }, 3000);
    
    // Vibração se suportado
    if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
    }
}

// Sistema de Favoritos
function toggleFavorite(type, exerciseType) {
    const favorites = getFavorites();
    const key = `${type}_${exerciseType}`;
    
    if (favorites.includes(key)) {
        // Remover dos favoritos
        const index = favorites.indexOf(key);
        favorites.splice(index, 1);
    } else {
        // Adicionar aos favoritos
        favorites.push(key);
    }
    
    localStorage.setItem('exercicios_favoritos', JSON.stringify(favorites));
    updateFavoriteButton(type, exerciseType);
    loadFavorites();
}

function getFavorites() {
    const stored = localStorage.getItem('exercicios_favoritos');
    return stored ? JSON.parse(stored) : [];
}

function updateFavoriteButton(type, exerciseType) {
    const favorites = getFavorites();
    const key = `${type}_${exerciseType}`;
    const button = document.querySelector('.favorite-button');
    
    if (!button) return;
    
    if (favorites.includes(key)) {
        button.classList.add('favorited');
        button.innerHTML = '<i class="fas fa-heart"></i> Remover dos Favoritos';
    } else {
        button.classList.remove('favorited');
        button.innerHTML = '<i class="far fa-heart"></i> Adicionar aos Favoritos';
    }
}

function loadFavorites() {
    const favorites = getFavorites();
    const favoritesGrid = document.getElementById('favoritesGrid');
    
    if (favorites.length === 0) {
        favoritesGrid.innerHTML = `
            <div class="empty-favorites">
                <i class="fas fa-heart-broken"></i>
                <p>Você ainda não tem exercícios favoritos. Clique no coração dos exercícios para adicioná-los aqui!</p>
            </div>
        `;
        return;
    }
    
    let favoritesHTML = '';
    favorites.forEach(favorite => {
        const [type, exerciseType] = favorite.split('_');
        let config, name, icon;
        
        if (type === 'meditation') {
            config = meditationConfigs[exerciseType];
            name = config?.name || exerciseType;
            icon = 'fas fa-leaf';
        } else {
            config = breathingConfigs[exerciseType];
            name = config?.name || exerciseType;
            icon = 'fas fa-wind';
        }
        
        favoritesHTML += `
            <div class="favorite-item">
                <div class="favorite-icon">
                    <i class="${icon}"></i>
                </div>
                <div class="favorite-info">
                    <h4>${name}</h4>
                    <p>${type === 'meditation' ? 'Meditação' : 'Respiração'}</p>
                </div>
                <button class="quick-start-btn" onclick="${type === 'meditation' ? 'startMeditation' : 'startBreathing'}('${exerciseType}')">
                    <i class="fas fa-play"></i>
                </button>
            </div>
        `;
    });
    
    favoritesGrid.innerHTML = favoritesHTML;
}

// Sistema de Histórico
function addToHistory(type, name) {
    const history = getHistory();
    const entry = {
        type: type,
        name: name,
        date: new Date().toISOString(),
        timestamp: Date.now()
    };
    
    history.unshift(entry);
    
    // Manter apenas os últimos 20 registros
    if (history.length > 20) {
        history.splice(20);
    }
    
    localStorage.setItem('exercicios_historico', JSON.stringify(history));
    loadHistory();
}

function getHistory() {
    const stored = localStorage.getItem('exercicios_historico');
    return stored ? JSON.parse(stored) : [];
}

function loadHistory() {
    const history = getHistory();
    const historyList = document.getElementById('historyList');
    
    if (history.length === 0) {
        historyList.innerHTML = `
            <div class="empty-history">
                <i class="fas fa-clock"></i>
                <p>Seu histórico de atividades aparecerá aqui conforme você pratica os exercícios.</p>
            </div>
        `;
        return;
    }
    
    let historyHTML = '';
    history.forEach(entry => {
        const date = new Date(entry.date);
        const formattedDate = date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const icon = entry.type === 'meditation' ? 'fas fa-leaf' : 'fas fa-wind';
        const typeLabel = entry.type === 'meditation' ? 'Meditação' : 'Respiração';
        
        historyHTML += `
            <div class="history-item">
                <div class="history-item-info">
                    <h4><i class="${icon}"></i> ${entry.name}</h4>
                    <p>${typeLabel}</p>
                </div>
                <div class="history-date">${formattedDate}</div>
            </div>
        `;
    });
    
    historyList.innerHTML = historyHTML;
}

// Utilitários
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Adicionar estilos CSS para favoritos via JavaScript
const additionalStyles = `
    .favorite-item {
        background: var(--white);
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        display: flex;
        align-items: center;
        gap: 15px;
    }
    
    .favorite-icon {
        width: 40px;
        height: 40px;
        background: var(--primary-blue);
        color: var(--white);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .favorite-info {
        flex: 1;
    }
    
    .favorite-info h4 {
        margin: 0 0 5px 0;
        color: var(--dark-grey);
        font-size: 1rem;
    }
    
    .favorite-info p {
        margin: 0;
        color: var(--medium-grey);
        font-size: 0.9rem;
    }
    
    .quick-start-btn {
        background: var(--primary-blue);
        color: var(--white);
        border: none;
        width: 35px;
        height: 35px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
    }
    
    .quick-start-btn:hover {
        background: #0056b3;
        transform: scale(1.1);
    }
`;

// Adicionar estilos ao documento
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

