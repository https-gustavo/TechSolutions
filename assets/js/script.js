const GITHUB_USER = 'https-gustavo';
const THEME_STORAGE_KEY = 'theme';
const SCROLL_THRESHOLD = 50;
const ANIMATION_THRESHOLD = 0.1;

const LANGUAGE_ICONS = {
    'javascript': 'devicon-javascript-plain',
    'typescript': 'devicon-typescript-plain',
    'python': 'devicon-python-plain',
    'html': 'devicon-html5-plain',
    'css': 'devicon-css3-plain',
    'java': 'devicon-java-plain',
    'c#': 'devicon-csharp-plain',
    'php': 'devicon-php-plain',
    'ruby': 'devicon-ruby-plain',
    'go': 'devicon-go-original-wordmark',
    'rust': 'devicon-rust-plain',
    'c++': 'devicon-cplusplus-plain',
    'c': 'devicon-c-plain',
    'swift': 'devicon-swift-plain',
    'kotlin': 'devicon-kotlin-plain',
    'dart': 'devicon-dart-plain',
    'shell': 'devicon-bash-plain',
    'powershell': 'devicon-powershell-plain',
    'vue': 'devicon-vuejs-plain',
    'react': 'devicon-react-original',
    'angular': 'devicon-angularjs-plain',
    'svelte': 'devicon-svelte-plain',
    'docker': 'devicon-docker-plain',
    'kubernetes': 'devicon-kubernetes-plain'
};

const CUSTOM_DESCRIPTIONS = {
    'Processo-Seletivo---ESO': 'Projeto de E-commerce desenvolvido para processo seletivo da Sistema ESO, implementando consumo de API e atendendo a uma rigorosa lista de requisitos técnicos.',
    'controle-estoque': 'Sistema de gestão para pequenos comerciantes, desenvolvido como projeto acadêmico para a UNIVESP, focado em organização e controle eficiente de fluxo de produtos.',
    'ProjetoIntegrador': 'Ferramenta estratégica para precificação e análise de margens, desenvolvida academicamente para auxiliar pequenos empreendedores na gestão financeira inteligente.'
};

function getLanguageIconClass(language) {
    if (!language) return 'ph ph-code';
    return LANGUAGE_ICONS[language.toLowerCase()] || 'ph ph-code';
}

const MobileMenu = {
    init() {
        const menuBtn = document.getElementById('mobile-menu');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        if (!menuBtn || !navMenu) return;

        function toggle() {
            const isOpen = navMenu.classList.toggle('open');
            const icon = menuBtn.querySelector('i');
            if (icon) {
                icon.classList.replace(isOpen ? 'ph-list' : 'ph-x', isOpen ? 'ph-x' : 'ph-list');
            }
            menuBtn.setAttribute('aria-expanded', isOpen);
        }

        menuBtn.addEventListener('click', toggle);
        menuBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle();
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('open')) toggle();
            });
        });

        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('open') && 
                !navMenu.contains(e.target) && 
                !menuBtn.contains(e.target)) {
                toggle();
            }
        });
    }
};

const ThemeManager = {
    init() {
        const toggleBtn = document.getElementById('theme-toggle-btn');
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        }

        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem(THEME_STORAGE_KEY, newTheme);
            });
            toggleBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleBtn.click();
                }
            });
        }
    }
};

const ScrollEffects = {
    init() {
        this.headerShadow();
        this.activeLink();
        this.progressBar();
        this.revealAnimations();
    },

    headerShadow() {
        const header = document.getElementById('header');
        if (!header) return;

        window.addEventListener('scroll', () => {
            header.style.boxShadow = window.scrollY > SCROLL_THRESHOLD 
                ? 'var(--shadow-hover)' 
                : 'var(--shadow)';
        });
    },

    activeLink() {
        const sections = document.querySelectorAll('section[id]');
        
        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;

            sections.forEach(current => {
                const sectionHeight = current.offsetHeight;
                const sectionTop = current.offsetTop - 100;
                const sectionId = current.getAttribute('id');
                const link = document.querySelector(`.nav-menu a[href*=${sectionId}]`);

                if (link) {
                    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                }
            });
        });
    },
    
    progressBar() {
        const progress = document.querySelector('.scroll-progress');
        if (!progress) return;
        
        window.addEventListener('scroll', () => {
            const totalScroll = document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = totalScroll / height;
            progress.style.width = `${scrolled * 100}%`;
        });
    },
    
    revealAnimations() {
        const observerOptions = {
            threshold: ANIMATION_THRESHOLD,
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const elements = document.querySelectorAll('.service-card, .project-card, .contact-card, .section-title, .section-subtitle, .hero-content, .hero-image, .about-visual, .about-text, .skills-wrapper, .store-actions, .check-list li, .col-text p');
        
        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
        
        // Expose observer for dynamic elements
        window.revealObserver = observer;
    }
};

const GithubIntegration = {
    async init() {
        const container = document.getElementById('portfolio-container');
        if (!container || !GITHUB_USER) return;

        try {
            const repos = await this.fetchRepos();
            this.renderRepos(repos, container);
        } catch (error) {
            console.error('GitHub integration failed:', error);
        }
    },

    async fetchRepos() {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&direction=desc`);
        if (!response.ok) throw new Error('API Error');
        const repos = await response.json();
        
        return repos.filter(repo => 
            !repo.fork && 
            !repo.name.toUpperCase().includes('TQI') &&
            !repo.name.toUpperCase().includes('TECHSOLUTIONS')
        ).slice(0, 6);
    },

    renderRepos(repos, container) {
        if (repos.length === 0) return;
        
        container.innerHTML = '';

        repos.forEach(repo => {
            const card = document.createElement('article');
            card.className = 'project-card';
            
            const description = CUSTOM_DESCRIPTIONS[repo.name] || repo.description || 'Projeto desenvolvido com foco em performance e qualidade de código.';
            const language = repo.language || 'Dev';
            const iconClass = getLanguageIconClass(repo.language);
            
            card.innerHTML = `
                <div class="project-header">
                    <i class="ph ph-folder-open folder-icon"></i>
                    <div class="project-links">
                        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="link-icon" title="Ver Código" aria-label="Ver código do projeto ${repo.name}"><i class="ph ph-github-logo"></i></a>
                        ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" rel="noopener noreferrer" class="link-icon" title="Ver Demo" aria-label="Ver demo do projeto ${repo.name}"><i class="ph ph-arrow-square-out"></i></a>` : ''}
                    </div>
                </div>
                
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-title-link">
                    <h3>${repo.name}</h3>
                </a>
                
                <p>${description}</p>
                
                <div class="project-tech-list">
                    <span><i class="${iconClass}"></i> ${language}</span>
                </div>
            `;
            
            container.appendChild(card);
            
            if (window.TiltEffect) window.TiltEffect.applyTo(card);
            if (window.revealObserver) {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                window.revealObserver.observe(card);
            }
        });
    }
};

const VisualEffects = {
    init() {
        this.typewriter();
        this.magneticButtons();
        this.spotlight();
        this.binaryBackground();
        this.tilt();
    },

    typewriter() {
        const el = document.querySelector('.typing-text');
        if (!el) return;

        const words = ["Tecnologia", "Hardware", "Performance", "Inovação", "Web Design"];
        let wordIndex = 0, charIndex = 0, isDeleting = false;
        
        const type = () => {
            const currentWord = words[wordIndex];
            const speed = isDeleting ? 50 : 150;
            
            if (isDeleting) {
                charIndex--;
            } else {
                charIndex++;
            }
            
            el.textContent = currentWord.substring(0, charIndex);

            let nextSpeed = speed;

            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                nextSpeed = 2000;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                nextSpeed = 500;
            }

            setTimeout(type, nextSpeed);
        };

        setTimeout(type, 1000);
    },

    magneticButtons() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(btn => {
            btn.classList.add('btn-magnetic');
            
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    },

    spotlight() {
        const storeCard = document.querySelector('.store-showcase');
        if (storeCard) {
            storeCard.addEventListener('mousemove', (e) => {
                const rect = storeCard.getBoundingClientRect();
                storeCard.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                storeCard.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
            });
        }
    },

    binaryBackground() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        const container = document.createElement('div');
        container.className = 'binary-bg';
        hero.insertBefore(container, hero.firstChild);

        setInterval(() => {
            const digit = document.createElement('span');
            digit.className = 'binary-digit';
            digit.textContent = Math.random() > 0.5 ? '1' : '0';
            digit.style.left = `${Math.random() * 100}%`;
            digit.style.top = `${Math.random() * 100}%`;
            digit.style.animationDuration = `${2 + Math.random() * 3}s`;
            
            container.appendChild(digit);
            setTimeout(() => digit.remove(), 5000);
        }, 100);
    },

    tilt() {
        window.TiltEffect = {
            applyTo(card) {
                card.style.transition = 'transform 0.1s ease, box-shadow 0.3s ease';
                
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    const rotateX = ((y - rect.height / 2) / rect.height * 2) * -5;
                    const rotateY = ((x - rect.width / 2) / rect.width * 2) * 5;

                    card.style.transition = 'none';
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                });

                card.addEventListener('mouseleave', () => {
                    card.style.transition = 'transform 0.5s ease, box-shadow 0.3s ease';
                    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
                });
            }
        };

        const cards = document.querySelectorAll('.service-card, .project-card, .contact-card');
        cards.forEach(card => window.TiltEffect.applyTo(card));
    }
};

const AboutFlip = {
    init() {
        const card = document.getElementById('about-flip');
        if (!card) return;
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', 'Virar cartão Sobre Nós');
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.classList.toggle('flipped');
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    MobileMenu.init();
    ThemeManager.init();
    ScrollEffects.init();
    GithubIntegration.init();
    VisualEffects.init();
    AboutFlip.init();
});
