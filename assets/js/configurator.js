// Lógica do Configurador de PC (Venda e Orçamento)
document.addEventListener('DOMContentLoaded', () => {
    
    // Estado
    let currentFlow = null; // 'sale' (Vender meu PC) ou 'budget' (Montar meu PC)
    let selectedComponents = {
        cpu: '',
        mobo: '',
        ram: '',
        gpu: '',
        storage: '',
        psu: '',
        case: ''
    };

    // Elementos DOM
    const modal = document.getElementById('configurator-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalClose = document.getElementById('modal-close');
    const summaryList = document.getElementById('summary-list');
    const priceContainer = document.getElementById('price-container');
    const submitBtn = document.getElementById('submit-config');
    const userForm = document.getElementById('user-form');

    // Botões de Abertura
    const btnSale = document.getElementById('btn-sale');
    const btnBudget = document.getElementById('btn-budget');

    // Entradas do Formulário
    const inputs = {
        cpu: document.getElementById('input-cpu'),
        mobo: document.getElementById('input-mobo'),
        ram: document.getElementById('input-ram'),
        gpu: document.getElementById('input-gpu'),
        storage: document.getElementById('input-storage'),
        psu: document.getElementById('input-psu'),
        case: document.getElementById('input-case')
    };

    // Inicialização dos Event Listeners
    setupListeners();

    if (btnSale) btnSale.addEventListener('click', () => openConfigurator('sale'));
    if (btnBudget) btnBudget.addEventListener('click', () => openConfigurator('budget'));
    if (modalClose) modalClose.addEventListener('click', closeConfigurator);
    
    // Fechar ao clicar fora do modal
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeConfigurator();
    });

    // Envio do Formulário
    if (userForm) {
        userForm.addEventListener('submit', handleFormSubmit);
    }

    function setupListeners() {
        Object.keys(inputs).forEach(key => {
            const input = inputs[key];
            if (input) {
                input.addEventListener('input', (e) => {
                    selectedComponents[key] = e.target.value.trim();
                    updateSummary();
                });
            }
        });
    }

    function openConfigurator(flow) {
        currentFlow = flow;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Impede rolagem do fundo

        // Sempre esconde container de preço (funcionalidade futura)
        if (priceContainer) priceContainer.style.display = 'none';
        
        // Ajusta UI baseada no fluxo
        if (flow === 'sale') {
            modalTitle.textContent = 'Venda seu PC Gamer';
            submitBtn.textContent = 'Enviar para Avaliação';
        } else {
            modalTitle.textContent = 'Monte seu PC Gamer';
            submitBtn.textContent = 'Solicitar Orçamento';
        }

        // Resetar e popular campos
        resetInputs();
        updateSummary();
    }

    function closeConfigurator() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function resetInputs() {
        selectedComponents = {
            cpu: '',
            mobo: '',
            ram: '',
            gpu: '',
            storage: '',
            psu: '',
            case: ''
        };
        
        Object.values(inputs).forEach(input => {
            if (input) input.value = '';
        });
    }

    function updateSummary() {
        summaryList.innerHTML = '';
        let hasItems = false;

        const labels = {
            cpu: 'Processador',
            mobo: 'Placa-mãe',
            ram: 'Memória RAM',
            gpu: 'Placa de Vídeo',
            storage: 'Armazenamento',
            psu: 'Fonte',
            case: 'Gabinete'
        };

        for (const [key, value] of Object.entries(selectedComponents)) {
            if (value) {
                hasItems = true;
                const li = document.createElement('li');
                li.innerHTML = `<strong>${labels[key]}:</strong> ${value}`;
                summaryList.appendChild(li);
            }
        }

        if (!hasItems) {
            summaryList.innerHTML = '<li style="color: var(--text-muted); font-style: italic;">Nenhum componente preenchido.</li>';
        }
    }

    function generateMessageData() {
        // Validação básica (verificamos se há componentes essenciais)
        const required = ['cpu', 'mobo', 'ram', 'psu', 'storage'];
        const missing = required.filter(k => !selectedComponents[k]);
        
        if (missing.length > 0) {
            alert('Por favor, preencha pelo menos: Processador, Placa-mãe, RAM, Armazenamento e Fonte.');
            return null;
        }

        const formData = new FormData(userForm);
        
        // Validação de contato
        if (!formData.get('name')) {
            alert('Por favor, preencha seu nome.');
            return null;
        }

        const customer = {
            name: formData.get('name'),
            email: formData.get('email'),
            whatsapp: formData.get('whatsapp'),
            obs: formData.get('obs')
        };

        // Montar corpo da mensagem
        const componentList = Object.entries(selectedComponents)
            .filter(([_, value]) => value !== '')
            .map(([key, value]) => {
                const labels = {
                    cpu: 'Processador',
                    mobo: 'Placa-mãe',
                    ram: 'Memória RAM',
                    gpu: 'Placa de Vídeo',
                    storage: 'Armazenamento',
                    psu: 'Fonte',
                    case: 'Gabinete'
                };
                return `- ${labels[key].toUpperCase()}: ${value}`;
            })
            .join('\n');

        const subject = currentFlow === 'sale' 
            ? `Avaliação de PC Gamer (Venda) - ${customer.name}` 
            : `Solicitação de Orçamento (Montagem) - ${customer.name}`;

        const contextText = currentFlow === 'sale'
            ? 'O cliente deseja *VENDER* este PC com as seguintes configurações:'
            : 'O cliente deseja *MONTAR* um PC com as seguintes configurações:';

        const body = `
*NOVO ORÇAMENTO VIA SITE* 🖥️

*DADOS DO CLIENTE:*
👤 *Nome:* ${customer.name}
📧 *Email:* ${customer.email}
📱 *WhatsApp:* ${customer.whatsapp}

*${contextText}*

*CONFIGURAÇÃO:*
${componentList}

*OBSERVAÇÕES:*
${customer.obs || 'Nenhuma'}
        `.trim();

        return { customer, subject, body };
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        
        const data = generateMessageData();
        if (!data) return;
        
        const { body } = data;
        
        // Número do WhatsApp de destino
        const targetPhone = '5535920021630'; 
        
        const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(body)}`;
        window.open(whatsappUrl, '_blank');
        closeConfigurator();
    }
});
