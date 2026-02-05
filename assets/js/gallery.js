
const galleryData = [
    {
        id: 'landing-lawyer',
        title: 'Landing Page Advocacia',
        category: 'landing',
        description: 'Página de alta conversão projetada para escritórios jurídicos. Apresenta design sóbrio que transmite autoridade, com seções estratégicas para serviços, equipe e captação de leads.',
        image: 'ph-scales',
        imageUrl: 'https://images.unsplash.com/photo-1589829542926-0373fd8fb7f0?auto=format&fit=crop&w=1200&q=80',
        tags: ['Alta Conversão', 'Design Responsivo', 'SEO Otimizado'],
        previewUrl: 'templates/landing.html',
        repoUrl: null
    },
    {
        id: 'store-tech',
        title: 'Tech Store E-commerce',
        category: 'ecommerce',
        description: 'Loja virtual moderna com experiência de compra fluida. Inclui carrinho interativo, sistema de notificações em tempo real e layout focado em maximizar vendas.',
        image: 'ph-storefront',
        imageUrl: 'https://images.unsplash.com/photo-1511381932060-8bf2bda24484?auto=format&fit=crop&w=1200&q=80',
        tags: ['Carrinho Dinâmico', 'UI/UX Moderno', 'Interatividade'],
        previewUrl: 'templates/store.html',
        repoUrl: null
    },
    {
        id: 'app-finance',
        title: 'Dashboard Financeiro',
        category: 'app',
        description: 'Aplicação web mobile-first para gestão financeira pessoal. Interface limpa com gráficos interativos, controle de despesas e dashboard administrativo completo.',
        image: 'ph-device-mobile',
        imageUrl: 'https://images.unsplash.com/photo-1553729489-0b4378d33269?auto=format&fit=crop&w=1200&q=80',
        tags: ['Mobile First', 'Dashboard', 'Gestão Financeira'],
        previewUrl: 'templates/app-dashboard.html',
        repoUrl: null
    }
];

class GalleryManager {
    constructor() {
        this.grid = document.getElementById('gallery-grid');
        this.init();
    }

    init() {
        if (!this.grid) return;
        this.renderGallery();
        this.setupModal();
    }

    renderGallery() {
        this.grid.innerHTML = '';
        
        galleryData.forEach(item => {
            const card = this.createCard(item);
            this.grid.appendChild(card);
        });

        this.attachCardListeners();
    }

    createCard(item) {
        const article = document.createElement('article');
        article.className = 'project-card fade-in';
        
        // Tags generation
        const tagsHtml = item.tags.map(tag => `<span>${tag}</span>`).join('');
        
        // Button generation (Preview or Github)
        let actionBtn = '';
        if (item.previewUrl) {
            actionBtn = `<button class="btn-preview" data-src="${item.previewUrl}" data-category="${item.category}" aria-label="Visualizar ${item.title}"><i class="ph ph-eye"></i> Ver Demo</button>`;
        } else if (item.repoUrl) {
            actionBtn = `<a href="${item.repoUrl}" target="_blank" class="btn-github" aria-label="Ver código"><i class="ph ph-github-logo"></i> Code</a>`;
        } else {
            actionBtn = `<button class="btn-disabled" disabled>Em Breve</button>`;
        }

        article.innerHTML = `
            <div class="project-header">
                <i class="ph ${item.image} folder-icon"></i>
                <div class="project-links">
                    ${item.repoUrl ? `<a href="${item.repoUrl}" target="_blank" title="Código"><i class="ph ph-github-logo"></i></a>` : ''}
                </div>
            </div>
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <div class="project-tech-list">
                ${tagsHtml}
            </div>
            <div class="project-footer">
                ${actionBtn}
                <div class="project-copyright">
                    © Direitos Reservados a Tech Solutions
                </div>
            </div>
        `;
        
        return article;
    }

    setupModal() {
        const modal = document.getElementById('template-modal');
        const iframe = document.getElementById('template-frame');
        const closeBtn = document.getElementById('close-modal');
        
        if (!modal || !iframe) return;

        const closeModal = () => {
            modal.classList.remove('active');
            setTimeout(() => iframe.src = '', 300);
        };

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });

        const deviceBtns = modal.querySelectorAll('.device-btn');
        const frameContainer = modal.querySelector('.modal-frame-container');
        
        if (frameContainer && deviceBtns.length > 0) {
            deviceBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    deviceBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    const mode = btn.getAttribute('data-device');
                    frameContainer.className = 'modal-frame-container'; // reset
                    frameContainer.classList.add(mode);
                });
            });
        }
    }

    attachCardListeners() {
        const previewBtns = document.querySelectorAll('.btn-preview');
        const modal = document.getElementById('template-modal');
        const iframe = document.getElementById('template-frame');
        const frameContainer = modal ? modal.querySelector('.modal-frame-container') : null;
        const deviceBtns = modal ? modal.querySelectorAll('.device-btn') : [];

        previewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const src = btn.getAttribute('data-src');
                const category = btn.getAttribute('data-category');

                if (src && modal && iframe) {
                    iframe.src = src;
                    modal.classList.add('active');

                    if (frameContainer && deviceBtns.length > 0) {
                        const targetMode = category === 'app' ? 'mobile' : 'desktop';
                        
                        deviceBtns.forEach(b => {
                            if (b.getAttribute('data-device') === 'desktop') {
                                b.style.display = category === 'app' ? 'none' : 'flex';
                            }
                        });

                        frameContainer.className = 'modal-frame-container';
                        frameContainer.classList.add(targetMode);

                        deviceBtns.forEach(b => {
                            if (b.getAttribute('data-device') === targetMode) {
                                b.classList.add('active');
                            } else {
                                b.classList.remove('active');
                            }
                        });
                    }
                }
            });
        });
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    new GalleryManager();
});
