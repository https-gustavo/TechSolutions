/**
 * TechSolutions - Tools Script
 * Interactive tools for the Tools section
 */

const ToolsManager = {
    init() {
        // this.initPasswordGenerator(); // Removido conforme solicitação
        // this.initIpChecker(); // Removido da interface visual
        this.initTerminal();
        this.initFloatingTerminal();
        this.initPortfolioPreview();
        console.log('ToolsManager initialized');
    },

    initFloatingTerminal() {
        const toggleBtn = document.getElementById('terminal-toggle');
        const container = document.getElementById('floating-terminal');
        const closeBtn = document.getElementById('close-terminal');
        const input = document.getElementById('terminal-input');

        if (!toggleBtn || !container) return;

        const toggleTerminal = () => {
            container.classList.toggle('hidden');
            if (!container.classList.contains('hidden')) {
                // Focar no input após a transição
                setTimeout(() => input.focus(), 100);
            }
        };

        toggleBtn.addEventListener('click', toggleTerminal);
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                container.classList.add('hidden');
            });
        }

        // Atalho de teclado (Ctrl + `) para abrir/fechar
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === '`') {
                toggleTerminal();
            }
        });
    },

    initPortfolioPreview() {
        const modal = document.getElementById('template-modal');
        const iframe = document.getElementById('template-frame');
        const closeBtn = document.getElementById('close-modal');
        const previewBtns = document.querySelectorAll('.btn-preview');

        if (!modal || !iframe) return;

        previewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const src = btn.getAttribute('data-src');
                if (src) {
                    iframe.src = src;
                    modal.classList.add('active');
                }
            });
        });

        const closeModal = () => {
            modal.classList.remove('active');
            setTimeout(() => {
                iframe.src = ''; // Limpar src para parar vídeos/sons se houver
            }, 300);
        };

        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        // Fechar ao clicar fora do modal
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Fechar com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    },

    initTerminal() {
        const input = document.getElementById('terminal-input');
        const output = document.getElementById('terminal-output');
        const body = document.getElementById('terminal-body');

        if (!input || !output) return;

        const commands = {
            'ajuda': 'Comandos disponíveis: <br> - <span class="cmd-highlight">sobre</span>: Quem sou eu <br> - <span class="cmd-highlight">skills</span>: Minhas habilidades <br> - <span class="cmd-highlight">contato</span>: Como me encontrar <br> - <span class="cmd-highlight">limpar</span>: Limpa o terminal <br> - <span class="cmd-highlight">matrix</span>: ???',
            'sobre': 'Sou Gustavo Menezes, técnico em informática e desenvolvedor fullstack em formação. Apaixonado por hardware e código.',
            'skills': 'JavaScript, React, Node.js, HTML5, CSS3, Manutenção de Hardware, Redes.',
            'contato': 'WhatsApp: (35) 9200-21630 <br> Email: contato@techsolutions.net.br',
            'matrix': 'Wake up, Neo...',
            'sudo': 'Permissão negada: você não tem privilégios de root aqui. 😉'
        };

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = input.value.trim().toLowerCase();
                
                // Add command to history
                this.printLine(`<span class="prompt">guest@techsolutions:~$</span> ${cmd}`, output);
                
                // Process command
                if (cmd === 'limpar' || cmd === 'cls') {
                    output.innerHTML = '';
                } else if (cmd === 'matrix') {
                    this.startMatrixEffect();
                    this.printLine('Iniciando sequência Matrix...', output);
                } else if (commands[cmd]) {
                    this.printLine(commands[cmd], output);
                } else if (cmd !== '') {
                    this.printLine(`Comando não encontrado: ${cmd}. Digite 'ajuda'.`, output);
                }

                input.value = '';
                // Scroll to bottom
                body.scrollTop = body.scrollHeight;
            }
        });

        // Focus input when clicking on terminal
        body.addEventListener('click', () => input.focus());
    },

    printLine(html, container) {
        const div = document.createElement('div');
        div.className = 'output-line';
        div.innerHTML = html;
        container.appendChild(div);
    },

    startMatrixEffect() {
        const canvas = document.createElement('canvas');
        canvas.classList.add('matrix-mode', 'active');
        document.body.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const fontSize = 16;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);

        function draw() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#0F0';
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = letters.charAt(Math.floor(Math.random() * letters.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        const interval = setInterval(draw, 33);

        // Stop after 5 seconds
        setTimeout(() => {
            clearInterval(interval);
            canvas.classList.remove('active');
            setTimeout(() => canvas.remove(), 1000);
        }, 5000);
    },

    initPasswordGenerator() {
        const generateBtn = document.getElementById('btn-generate-password');
        const copyBtn = document.getElementById('btn-copy-password');
        const passwordOutput = document.getElementById('password-output');
        const lengthInput = document.getElementById('password-length');
        const lengthValue = document.getElementById('password-length-value');

        if (!generateBtn || !passwordOutput) return;

        // Update length display
        lengthInput?.addEventListener('input', (e) => {
            if (lengthValue) lengthValue.textContent = e.target.value;
        });

        generateBtn.addEventListener('click', () => {
            const length = parseInt(lengthInput?.value || 12);
            const includeUppercase = document.getElementById('chk-uppercase')?.checked;
            const includeNumbers = document.getElementById('chk-numbers')?.checked;
            const includeSymbols = document.getElementById('chk-symbols')?.checked;

            const password = this.generatePassword(length, includeUppercase, includeNumbers, includeSymbols);
            passwordOutput.value = password;
            
            // Visual feedback
            passwordOutput.parentElement.classList.add('generated');
            setTimeout(() => passwordOutput.parentElement.classList.remove('generated'), 500);
        });

        copyBtn?.addEventListener('click', () => {
            if (!passwordOutput.value) return;
            
            navigator.clipboard.writeText(passwordOutput.value).then(() => {
                const originalIcon = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="ph ph-check"></i>';
                copyBtn.classList.add('success');
                
                setTimeout(() => {
                    copyBtn.innerHTML = originalIcon;
                    copyBtn.classList.remove('success');
                }, 2000);
            });
        });
    },

    generatePassword(length, useUpper, useNumbers, useSymbols) {
        const lower = 'abcdefghijklmnopqrstuvwxyz';
        const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

        let chars = lower;
        if (useUpper) chars += upper;
        if (useNumbers) chars += numbers;
        if (useSymbols) chars += symbols;

        let password = '';
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return password;
    },

    initIpChecker() {
        const checkBtn = document.getElementById('btn-check-ip');
        const ipDisplay = document.getElementById('ip-display');
        const ipDetails = document.getElementById('ip-details');

        if (!checkBtn) return;

        checkBtn.addEventListener('click', async () => {
            checkBtn.classList.add('loading');
            checkBtn.disabled = true;
            ipDisplay.textContent = 'Verificando...';
            ipDetails.innerHTML = '';

            try {
                // Using a free API (ipapi.co or similar)
                const response = await fetch('https://ipapi.co/json/');
                if (!response.ok) throw new Error('Falha na conexão');
                
                const data = await response.json();
                
                ipDisplay.textContent = data.ip;
                ipDetails.innerHTML = `
                    <div class="ip-detail-item"><i class="ph ph-map-pin"></i> ${data.city}, ${data.region} - ${data.country_name}</div>
                    <div class="ip-detail-item"><i class="ph ph-buildings"></i> ${data.org}</div>
                `;
            } catch (error) {
                ipDisplay.textContent = 'Erro ao verificar';
                console.error(error);
            } finally {
                checkBtn.classList.remove('loading');
                checkBtn.disabled = false;
            }
        });
    }
};

// Auto-init if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ToolsManager.init());
} else {
    ToolsManager.init();
}
