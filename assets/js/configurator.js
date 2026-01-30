/**
 * TechSolutions - Módulo Configurador de PC
 * -----------------------------------------
 * Gerencia o fluxo de vendas e orçamentos, validação de formulários
 * e integração direta com WhatsApp API.
 * 
 * @module Configurator
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Configurações e Constantes ---
    const COMPONENT_LABELS = {
        cpu: 'Processador',
        mobo: 'Placa-mãe',
        ram: 'Memória RAM',
        gpu: 'Placa de Vídeo',
        storage: 'Armazenamento',
        psu: 'Fonte',
        case: 'Gabinete'
    };

    // --- Estado da Aplicação ---
    let currentFlow = null; // 'sale' (venda) | 'budget' (orçamento)
    let selectedComponents = {
        cpu: '', mobo: '', ram: '', gpu: '', storage: '', psu: '', case: ''
    };

    // --- Referências DOM ---
    const modal = document.getElementById('configurator-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalClose = document.getElementById('modal-close');
    const summaryList = document.getElementById('summary-list');
    const priceContainer = document.getElementById('price-container');
    const submitBtn = document.getElementById('submit-config');
    const userForm = document.getElementById('user-form');
    
    // Triggers
    const btnSale = document.getElementById('btn-sale');
    const btnBudget = document.getElementById('btn-budget');

    // Mapeamento de Inputs
    const inputs = {
        cpu: document.getElementById('input-cpu'),
        mobo: document.getElementById('input-mobo'),
        ram: document.getElementById('input-ram'),
        gpu: document.getElementById('input-gpu'),
        storage: document.getElementById('input-storage'),
        psu: document.getElementById('input-psu'),
        case: document.getElementById('input-case')
    };

    // --- Inicialização ---
    init();

    function init() {
        setupEventListeners();
    }

    /**
     * Configura todos os ouvintes de eventos da aplicação
     */
    function setupEventListeners() {
        // Modal Triggers
        if (btnSale) btnSale.addEventListener('click', () => openConfigurator('sale'));
        if (btnBudget) btnBudget.addEventListener('click', () => openConfigurator('budget'));
        
        // Modal Controls
        if (modalClose) modalClose.addEventListener('click', closeConfigurator);
        
        // Fechar ao clicar no overlay
        window.addEventListener('click', (e) => {
            if (e.target === modal) closeConfigurator();
        });

        // Acessibilidade: Navegação por teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                closeConfigurator();
            }
        });

        // Binding bidirecional (Input -> State -> Summary)
        Object.keys(inputs).forEach(key => {
            const input = inputs[key];
            if (input) {
                input.addEventListener('input', (e) => {
                    selectedComponents[key] = e.target.value.trim();
                    updateSummary();
                });
            }
        });

        // Submissão
        if (userForm) {
            userForm.addEventListener('submit', handleFormSubmit);
        }
    }

    /**
     * Abre o modal e configura o contexto (Venda ou Orçamento)
     * @param {string} flow - Tipo de fluxo: 'sale' ou 'budget'
     */
    function openConfigurator(flow) {
        currentFlow = flow;
        modal.style.display = 'flex';
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Previne scroll de fundo

        // Reset visual condicional
        if (priceContainer) priceContainer.style.display = 'none'; 
        
        // Configuração de Textos Dinâmicos
        if (flow === 'sale') {
            modalTitle.textContent = 'Venda seu PC Gamer';
            submitBtn.textContent = 'Enviar para Avaliação';
        } else {
            modalTitle.textContent = 'Monte seu PC Gamer';
            submitBtn.textContent = 'Solicitar Orçamento';
        }

        resetForm();
        updateSummary();
        
        // Acessibilidade: Focar no primeiro input
        const firstInput = inputs.cpu;
        if (firstInput) setTimeout(() => firstInput.focus(), 100);
    }

    function closeConfigurator() {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
    }

    function resetForm() {
        // Reset State
        Object.keys(selectedComponents).forEach(key => selectedComponents[key] = '');
        
        // Reset Inputs
        Object.values(inputs).forEach(input => {
            if (input) input.value = '';
        });
        
        // Reset Contact Form
        if (userForm) userForm.reset();
    }

    /**
     * Atualiza a lista visual de resumo dos componentes selecionados
     */
    function updateSummary() {
        if (!summaryList) return;
        
        summaryList.innerHTML = '';
        let hasItems = false;

        for (const [key, value] of Object.entries(selectedComponents)) {
            if (value) {
                hasItems = true;
                const li = document.createElement('li');
                // Uso de escapeHtml para prevenir XSS básico na renderização
                li.innerHTML = `<strong>${COMPONENT_LABELS[key]}:</strong> ${escapeHtml(value)}`;
                summaryList.appendChild(li);
            }
        }

        if (!hasItems) {
            summaryList.innerHTML = '<li style="color: var(--text-muted); font-style: italic;">Nenhum componente preenchido.</li>';
        }
    }

    /**
     * Gera payload formatado para WhatsApp e valida campos obrigatórios
     * @returns {Object|null} Objeto com corpo da mensagem ou null se inválido
     */
    function generateMessageData() {
        // Regra de Negócio: Campos mínimos para um orçamento válido
        const requiredFields = ['cpu', 'mobo', 'ram', 'psu', 'storage'];
        const missingFields = requiredFields.filter(key => !selectedComponents[key]);
        
        if (missingFields.length > 0) {
            alert(`Por favor, preencha os componentes obrigatórios: ${missingFields.map(k => COMPONENT_LABELS[k]).join(', ')}.`);
            return null;
        }

        const formData = new FormData(userForm);
        const customerName = formData.get('name');
        
        if (!customerName) {
            alert('Por favor, preencha seu nome.');
            return null;
        }

        const customer = {
            name: customerName,
            email: formData.get('email'),
            whatsapp: formData.get('whatsapp'),
            obs: formData.get('obs')
        };

        // Formatação da Lista de Componentes
        const componentList = Object.entries(selectedComponents)
            .filter(([_, value]) => value !== '')
            .map(([key, value]) => `- ${COMPONENT_LABELS[key].toUpperCase()}: ${value}`)
            .join('\n');

        const contextMap = {
            sale: {
                subject: `Avaliação de PC Gamer (Venda) - ${customer.name}`,
                intro: 'O cliente deseja *VENDER* este PC com as seguintes configurações:'
            },
            budget: {
                subject: `Solicitação de Orçamento (Montagem) - ${customer.name}`,
                intro: 'O cliente deseja *MONTAR* um PC com as seguintes configurações:'
            }
        };

        const ctx = contextMap[currentFlow];

        const body = `
*NOVO ORÇAMENTO VIA SITE* 🖥️

*DADOS DO CLIENTE:*
👤 *Nome:* ${customer.name}
📧 *Email:* ${customer.email || 'Não informado'}
📱 *WhatsApp:* ${customer.whatsapp || 'Não informado'}

*${ctx.intro}*

*CONFIGURAÇÃO:*
${componentList}

*OBSERVAÇÕES:*
${customer.obs || 'Nenhuma'}
        `.trim();

        return { body };
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        
        const data = generateMessageData();
        if (!data) return;
        
        const targetPhone = '5535920021630'; 
        const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(data.body)}`;
        
        window.open(whatsappUrl, '_blank');
        closeConfigurator();
    }

    /**
     * Sanitização básica de strings para prevenção de XSS
     * @param {string} text 
     */
    function escapeHtml(text) {
        if (!text) return text;
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});