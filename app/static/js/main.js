/**
 * Script principal da aplicação
 * Contém funcionalidades JavaScript para melhorar a experiência do usuário
 */

// ========================================
// AUTO-FECHAR ALERTAS
// ========================================

/**
 * Fecha automaticamente os alertas após 5 segundos
 * e adiciona botão de fechar manual
 */
document.addEventListener('DOMContentLoaded', function() {
    // Selecionar todos os elementos com classe 'alert'
    const alerts = document.querySelectorAll('.alert');
    
    // Iterar sobre cada alerta encontrado
    alerts.forEach(alert => {
        // Agendar remoção automática após 5 segundos (5000ms)
        setTimeout(() => {
            // Adicionar transição suave de opacidade
            alert.style.transition = 'opacity 0.3s ease-out';
            alert.style.opacity = '0';
            // Remover do DOM após a animação
            setTimeout(() => alert.remove(), 300);
        }, 5000);
    });
});

// ========================================
// VALIDAÇÃO DE FORMULÁRIO DE LOGIN
// ========================================

/**
 * Adiciona validação ao formulário de login
 * Remove espaços em branco e valida campos obrigatórios
 */
const loginForm = document.querySelector('.auth-form');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        // Obter referências aos campos de entrada
        const username = document.getElementById('username');
        const password = document.getElementById('password');
        
        // Remover espaços em branco do início e fim do username
        if (username) username.value = username.value.trim();
        
        // Validar se o username foi preenchido
        if (username && !username.value) {
            e.preventDefault(); // Impedir envio do formulário
            showAlert('Por favor, digite seu usuário.', 'warning');
            username.focus(); // Focar no campo
            return false;
        }
        
        // Validar se a senha foi preenchida
        if (password && !password.value) {
            e.preventDefault(); // Impedir envio do formulário
            showAlert('Por favor, digite sua senha.', 'warning');
            password.focus(); // Focar no campo
            return false;
        }
    });
}

// ========================================
// FUNÇÃO AUXILIAR PARA ALERTAS DINÂMICOS
// ========================================

/**
 * Exibe um alerta dinâmico na página
 * 
 * @param {string} message - Mensagem a ser exibida
 * @param {string} type - Tipo do alerta (info, success, warning, danger)
 */
function showAlert(message, type = 'info') {
    // Buscar o container principal
    const container = document.querySelector('.container');
    if (!container) return;
    
    // Criar elemento div para o alerta
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        ${message}
        <button class="alert-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    // Inserir o alerta no início do conteúdo principal
    const mainContent = document.querySelector('.main-content');
    if (mainContent && mainContent.firstChild) {
        mainContent.insertBefore(alert, mainContent.firstChild);
    } else {
        container.insertBefore(alert, container.firstChild);
    }
    
    // Auto-remover após 5 segundos com animação
    setTimeout(() => {
        alert.style.transition = 'opacity 0.3s ease-out';
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 300);
    }, 5000);
}

// ========================================
// CONFIRMAÇÃO DE LOGOUT
// ========================================

/**
 * Adiciona confirmação antes de fazer logout
 * Previne logout acidental
 */
const logoutLinks = document.querySelectorAll('.btn-logout');
logoutLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        // Exibir caixa de confirmação
        if (!confirm('Tem certeza que deseja sair?')) {
            e.preventDefault(); // Cancelar o logout se usuário clicar em "Cancelar"
        }
    });
});

// ========================================
// EFEITO DE LOADING NOS FORMULÁRIOS
// ========================================

/**
 * Adiciona feedback visual ao enviar formulários
 * Desabilita botão de submit e mostra mensagem "Processando..."
 */
const forms = document.querySelectorAll('form');
forms.forEach(form => {
    form.addEventListener('submit', function() {
        // Buscar botão de submit dentro do formulário
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            // Desabilitar botão para evitar cliques duplos
            submitBtn.disabled = true;
            // Alterar texto do botão
            submitBtn.textContent = 'Processando...';
            // Reduzir opacidade para indicar estado desabilitado
            submitBtn.style.opacity = '0.7';
        }
    });
});

// ========================================
// VALIDADOR DE FORÇA DE SENHA
// ========================================

/**
 * Avalia a força de uma senha baseado em diversos critérios
 * 
 * @param {string} password - Senha a ser avaliada
 * @returns {object} Objeto com pontuação e mensagem
 */
function checkPasswordStrength(password) {
    let strength = 0;
    
    // Critério 1: Comprimento mínimo de 8 caracteres
    if (password.length >= 8) strength++;
    // Critério 2: Comprimento ideal de 12+ caracteres
    if (password.length >= 12) strength++;
    // Critério 3: Possui letras maiúsculas E minúsculas
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    // Critério 4: Possui números
    if (/\d/.test(password)) strength++;
    // Critério 5: Possui caracteres especiais
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    
    // Retornar objeto com pontuação e mensagem
    return {
        score: strength,
        message: strength < 2 ? 'Fraca' : strength < 4 ? 'Média' : 'Forte'
    };
}

// ========================================
// INDICADOR DE FORÇA DE SENHA NO REGISTRO
// ========================================

/**
 * Adiciona indicador visual de força de senha no formulário de registro
 * Mostra em tempo real a qualidade da senha digitada
 */
const passwordInput = document.getElementById('password');
// Verificar se estamos na página de registro
if (passwordInput && window.location.pathname.includes('register')) {
    // Criar elemento para exibir a força da senha
    const strengthIndicator = document.createElement('div');
    strengthIndicator.className = 'password-strength';
    strengthIndicator.style.cssText = 'margin-top: 0.5rem; font-size: 0.875rem;';
    // Inserir indicador após o campo de senha
    passwordInput.parentElement.appendChild(strengthIndicator);
    
    // Atualizar indicador a cada tecla digitada
    passwordInput.addEventListener('input', function() {
        // Avaliar força da senha atual
        const strength = checkPasswordStrength(this.value);
        // Definir cores para cada nível de força
        const colors = {
            'Fraca': '#ef4444',    // Vermelho
            'Média': '#f59e0b',    // Laranja
            'Forte': '#10b981'     // Verde
        };
        
        // Atualizar texto e cor do indicador
        strengthIndicator.textContent = `Força da senha: ${strength.message}`;
        strengthIndicator.style.color = colors[strength.message];
    });
}

// ========================================
// ANIMAÇÃO DE CARREGAMENTO DA PÁGINA
// ========================================

/**
 * Adiciona fade-in suave ao carregar a página
 * Melhora a transição visual
 */
document.addEventListener('DOMContentLoaded', function() {
    // Iniciar com opacidade 0
    document.body.style.opacity = '0';
    // Após 10ms, adicionar transição e tornar visível
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.3s ease-in';
        document.body.style.opacity = '1';
    }, 10);
});

// ========================================
// LOG DE INICIALIZAÇÃO
// ========================================

// Mensagem no console para desenvolvedores
console.log('Sistema Template Flask - IENH Dev Sistemas II 2025');
