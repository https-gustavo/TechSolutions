document.addEventListener('DOMContentLoaded', () => {
    
    // Menu Mobile
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    function toggleMenu() {
        navMenu.classList.toggle('open');
        const icon = mobileMenuBtn.querySelector('i');
        
        if (navMenu.classList.contains('open')) {
            icon.classList.replace('ph-list', 'ph-x');
        } else {
            icon.classList.replace('ph-x', 'ph-list');
        }
    }

    mobileMenuBtn.addEventListener('click', toggleMenu);

    // Fechar menu ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) {
                toggleMenu();
            }
        });
    });

    // Fechar menu ao clicar fora
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target) && navMenu.classList.contains('open')) {
            toggleMenu();
        }
    });

    // Alternar Tema (Dark/Light Mode)
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const savedTheme = localStorage.getItem('theme');

    // Aplicar tema salvo ou padrão
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            let newTheme = 'light';

            if (currentTheme === 'dark') {
                document.documentElement.setAttribute('data-theme', 'light');
                newTheme = 'light';
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                newTheme = 'dark';
            }

            localStorage.setItem('theme', newTheme);
        });
    }

    // Sombra no Cabeçalho ao Rolar
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = 'var(--shadow-hover)';
        } else {
            header.style.boxShadow = 'var(--shadow)';
        }
    });

    // Link Ativo na Navegação ao Rolar
    const sections = document.querySelectorAll('section[id]');
    
    function scrollActive() {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            const sectionsClass = document.querySelector('.nav-menu a[href*=' + sectionId + ']');

            if (sectionsClass) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    sectionsClass.classList.add('active');
                } else {
                    sectionsClass.classList.remove('active');
                }
            }
        });
    }

    window.addEventListener('scroll', scrollActive);

    // Animações de Scroll (Scroll Reveal)
    const observerOptions = {
        threshold: 0.1,
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

    // Selecionar elementos para animar
    const animatedElements = document.querySelectorAll('.service-card, .project-card, .contact-card, .section-title, .section-subtitle, .hero-content, .hero-image, .about-visual, .about-text, .skills-wrapper, .store-actions, .check-list li, .col-text p');
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        // Adiciona um pequeno atraso para efeito escalonado
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Integração com API do GitHub
    // CONFIGURAÇÃO: Coloque seu nome de usuário do GitHub abaixo
    const githubUser = 'https-gustavo'; 
    const portfolioContainer = document.getElementById('portfolio-container');

    // Mapeamento de linguagens para ícones do Devicon
    const languageIcons = {
        'JavaScript': 'devicon-javascript-plain',
        'TypeScript': 'devicon-typescript-plain',
        'Python': 'devicon-python-plain',
        'HTML': 'devicon-html5-plain',
        'CSS': 'devicon-css3-plain',
        'Java': 'devicon-java-plain',
        'C#': 'devicon-csharp-plain',
        'C++': 'devicon-cplusplus-plain',
        'C': 'devicon-c-plain',
        'PHP': 'devicon-php-plain',
        'Ruby': 'devicon-ruby-plain',
        'Go': 'devicon-go-plain',
        'Rust': 'devicon-rust-plain',
        'Swift': 'devicon-swift-plain',
        'Kotlin': 'devicon-kotlin-plain',
        'Dart': 'devicon-dart-plain',
        'Shell': 'devicon-bash-plain',
        'PowerShell': 'devicon-powershell-plain',
        'Vue': 'devicon-vuejs-plain',
        'React': 'devicon-react-original',
        'Angular': 'devicon-angularjs-plain',
        'Svelte': 'devicon-svelte-plain',
        'Docker': 'devicon-docker-plain',
        'Kubernetes': 'devicon-kubernetes-plain'
    };

    // Helper para obter classe do ícone baseado na linguagem
    function getLanguageIconClass(language) {
        if (!language) return 'ph ph-code';
        const lang = language.toLowerCase();
        
        const map = {
            'javascript': 'devicon-javascript-plain',
            'typescript': 'devicon-typescript-plain',
            'html': 'devicon-html5-plain',
            'css': 'devicon-css3-plain',
            'python': 'devicon-python-plain',
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
            'dart': 'devicon-dart-plain'
        };
        
        return map[lang] || 'ph ph-code';
    }

    async function getGitHubProjects() {
        // Se o usuário não estiver configurado, sai da função
        if (!githubUser) return;

        try {
            // Busca repositórios ordenados por atualização
            const response = await fetch(`https://api.github.com/users/${githubUser}/repos?sort=updated&direction=desc`);
            
            if (!response.ok) {
                console.log('Usuário do GitHub não encontrado ou erro na API');
                return;
            }
            
            const repos = await response.json();
            
            // Filtra para remover forks e projetos específicos
            const myRepos = repos.filter(repo => 
                !repo.fork && 
                !repo.name.toUpperCase().includes('TQI')
            ).slice(0, 6);

            if (myRepos.length > 0) {
                portfolioContainer.innerHTML = ''; // Limpa os projetos estáticos
                
                myRepos.forEach(repo => {
                    const card = document.createElement('article');
                    card.classList.add('project-card');
                    
                    const description = repo.description || 'Projeto desenvolvido com foco em performance e qualidade de código.';
                    const language = repo.language || 'Dev';
                    const iconClass = getLanguageIconClass(repo.language);
                    
                    // Cria o card do projeto
                    card.innerHTML = `
                        <div class="project-header">
                            <i class="ph ph-folder-open folder-icon"></i>
                            <div class="project-links">
                                <a href="${repo.html_url}" target="_blank" class="link-icon" title="Ver Código"><i class="ph ph-github-logo"></i></a>
                                ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="link-icon" title="Ver Demo"><i class="ph ph-arrow-square-out"></i></a>` : ''}
                            </div>
                        </div>
                        
                        <a href="${repo.html_url}" target="_blank" class="project-title-link">
                            <h3>${repo.name}</h3>
                        </a>
                        
                        <p>${description}</p>
                        
                        <div class="project-tech-list">
                            <span><i class="${iconClass}"></i> ${language}</span>
                        </div>
                    `;
                    
                    portfolioContainer.appendChild(card);
                    
                    // Aplica o efeito Tilt 3D
                    applyTiltEffect(card);
                    
                    // Adiciona animação de entrada
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(30px)';
                    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    observer.observe(card);
                });
            }
        } catch (error) {
            console.error('Erro ao carregar projetos do GitHub:', error);
        }
    }

    // Efeito de Digitação (Typewriter)
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const words = ["Tecnologia", "Hardware", "Performance", "Inovação", "Web Design"];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function type() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                typingText.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50;
            } else {
                typingText.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 150;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typeSpeed = 2000; // Pausa no final
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500; // Pausa antes da próxima palavra
            }

            setTimeout(type, typeSpeed);
        }

        // Iniciar digitação
        setTimeout(type, 1000);
    }

    // Barra de Progresso de Rolagem
    const scrollProgress = document.querySelector('.scroll-progress');
    
    window.addEventListener('scroll', () => {
        const totalScroll = document.documentElement.scrollTop;
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scroll = `${totalScroll / windowHeight}`;
        
        if (scrollProgress) {
            scrollProgress.style.width = `${scroll * 100}%`;
        }
    });

    // Botões Magnéticos
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

    // Animação de Fundo Binário
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        // Criar container
        const bgContainer = document.createElement('div');
        bgContainer.classList.add('binary-bg');
        heroSection.insertBefore(bgContainer, heroSection.firstChild);
        
        // Função para criar dígitos
        function createDigit() {
            const digit = document.createElement('span');
            digit.classList.add('binary-digit');
            digit.textContent = Math.random() > 0.5 ? '1' : '0';
            
            // Posição aleatória
            digit.style.left = `${Math.random() * 100}%`;
            digit.style.top = `${Math.random() * 100}%`;
            
            // Tamanho e duração aleatórios
            const duration = 2 + Math.random() * 3;
            digit.style.animationDuration = `${duration}s`;
            
            bgContainer.appendChild(digit);
            
            // Remover após animação
            setTimeout(() => {
                digit.remove();
            }, duration * 1000);
        }
        
        // Criar dígitos periodicamente
        setInterval(createDigit, 100);
    }

    // Efeito Tilt 3D
    function applyTiltEffect(card) {
        // Adiciona transição para retorno suave
        card.style.transition = 'transform 0.1s ease, box-shadow 0.3s ease';

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calcular rotação baseada na posição do cursor
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -5; // Rotação reduzida para sutileza
            const rotateY = ((x - centerX) / centerX) * 5;

            // Remove transição durante movimento para resposta instantânea
            card.style.transition = 'none';
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            // Restaura transição para retorno suave
            card.style.transition = 'transform 0.5s ease, box-shadow 0.3s ease';
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    }

    // Aplicar a elementos existentes
    const tiltCards = document.querySelectorAll('.service-card, .project-card, .contact-card');
    tiltCards.forEach(card => applyTiltEffect(card));
});
