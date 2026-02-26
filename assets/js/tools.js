const ToolsManager = {
    currentGame: null,
    gameData: {},
    flappy: null,
    snake: null,
    init() {
        this.initTerminal();
        this.initFloatingTerminal();
        this.initPortfolioPreview();
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
                setTimeout(() => input.focus(), 100);
            } else {
                // Ao fechar o terminal, encerra qualquer jogo ativo e remove overlays
                if (this.currentGame === 'flappy') {
                    this.endFlappy();
                }
                this.currentGame = null;
                this.gameData = {};
            }
        };

        toggleBtn.addEventListener('click', toggleTerminal);
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                container.classList.add('hidden');
                if (this.currentGame === 'flappy') {
                    this.endFlappy();
                }
                this.currentGame = null;
                this.gameData = {};
            });
        }

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
                iframe.src = '';
            }, 300);
        };

        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

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
            'ajuda': 'Comandos disponíveis: <br> - <span class=\"cmd-highlight\">sobre</span>: Quem sou eu <br> - <span class=\"cmd-highlight\">skills</span>: Minhas habilidades <br> - <span class=\"cmd-highlight\">contato</span>: Como me encontrar <br> - <span class=\"cmd-highlight\">limpar</span>: Limpa o terminal <br> - <span class=\"cmd-highlight\">matrix</span>: ??? <br> - <span class=\"cmd-highlight\">jogos</span>: Lista jogos disponíveis',
            'sobre': 'Sou Gustavo Menezes, técnico em informática e desenvolvedor fullstack em formação. Apaixonado por hardware e código.',
            'skills': 'JavaScript, React, Node.js, HTML5, CSS3, Manutenção de Hardware, Redes.',
            'contato': 'WhatsApp: (35) 9200-21630 <br> Email: contato@techsolutions.net.br',
            'matrix': 'Wake up, Neo...',
            'sudo': 'Permissão negada: você não tem privilégios de root aqui. 😉'
        };

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                try {
                    const cmd = input.value.trim().toLowerCase();
                    
                    this.printLine(`<span class="prompt">guest@techsolutions:~$</span> ${cmd}`, output);
                    
                    if (this.currentGame === 'flappy' && !this.flappy) {
                        this.currentGame = null;
                        this.gameData = {};
                    }
                    if (this.currentGame === 'snake' && !this.snake) {
                        this.currentGame = null;
                        this.gameData = {};
                    }
    
                    if (this.currentGame) {
                        this.handleGameInput(cmd, output);
                    } else if (cmd === 'limpar' || cmd === 'cls') {
                        output.innerHTML = '';
                    } else if (cmd === 'matrix') {
                        this.startMatrixEffect();
                        this.printLine('Iniciando sequência Matrix...', output);
                    } else if (cmd === 'jogos') {
                        this.printLine('Jogos: <br> - <span class="cmd-highlight">jogo jokenpo</span> (pedra/papel/tesoura) <br> - <span class="cmd-highlight">jogo flappy</span> (voe pelos canos) <br> - <span class="cmd-highlight">jogo snake</span> (clássico) <br>Digite <span class="cmd-highlight">sair</span> para encerrar um jogo.', output);
                    } else if (cmd.startsWith('jogo')) {
                        this.startGame(cmd, output);
                    } else if (cmd === 'reiniciar' || cmd === 'restart') {
                        if (this.currentGame === 'flappy') {
                            this.endFlappy();
                            this.startFlappy(output);
                            this.printLine('Flappy reiniciado.', output);
                        } else if (this.currentGame === 'snake') {
                            this.endSnake();
                            this.startSnake(output);
                            this.printLine('Snake reiniciado.', output);
                        } else {
                            this.printLine('Nenhum jogo ativo para reiniciar.', output);
                        }
                    } else if (commands[cmd]) {
                        this.printLine(commands[cmd], output);
                    } else if (cmd !== '') {
                        this.printLine(`Comando não encontrado: ${cmd}. Digite 'ajuda'.`, output);
                    }
                } catch (err) {
                    this.printLine(`Erro: ${err && err.message ? err.message : String(err)}`, output);
                } finally {
                    input.value = '';
                    body.scrollTop = body.scrollHeight;
                }
            }
        });

        body.addEventListener('click', () => input.focus());
    },

    startGame(cmd, output) {
        if (cmd.includes('jokenpo')) {
            this.currentGame = 'jokenpo';
            this.gameData = {};
            this.printLine('Jokenpô iniciado. Escolha: <span class="cmd-highlight">pedra</span>, <span class="cmd-highlight">papel</span> ou <span class="cmd-highlight">tesoura</span>. Digite <span class="cmd-highlight">sair</span> para encerrar.', output);
        } else if (cmd.includes('flappy')) {
            this.currentGame = 'flappy';
            this.startFlappy(output);
            this.printLine('Flappy iniciado. Espaço/clique: voar | R: reiniciar | ESC: sair', output);
        } else if (cmd.includes('snake')) {
            this.currentGame = 'snake';
            this.startSnake(output);
            this.printLine('Snake iniciado. Setas/WASD: mover | R: reiniciar | ESC: sair', output);
        } else {
            this.printLine('Jogo não reconhecido. Use <span class="cmd-highlight">jogos</span> para ver a lista.', output);
        }
    },

    handleGameInput(cmd, output) {
        if (cmd === 'sair') {
            if (this.currentGame === 'flappy') {
                this.endFlappy();
            }
            if (this.currentGame === 'snake') {
                this.endSnake();
            }
            this.currentGame = null;
            this.gameData = {};
            this.printLine('Jogo encerrado.', output);
            return;
        }
        if (this.currentGame === 'jokenpo') {
            const choices = ['pedra', 'papel', 'tesoura'];
            if (!choices.includes(cmd)) {
                this.printLine('Escolha inválida. Use pedra, papel ou tesoura, ou <span class="cmd-highlight">sair</span>.', output);
                return;
            }
            const ai = choices[Math.floor(Math.random() * 3)];
            let res = '';
            if (cmd === ai) res = 'Empate.';
            else if ((cmd === 'pedra' && ai === 'tesoura') || (cmd === 'papel' && ai === 'pedra') || (cmd === 'tesoura' && ai === 'papel')) res = 'Você venceu.';
            else res = 'Você perdeu.';
            this.printLine(`Você: ${cmd} | Bot: ${ai} -> ${res}`, output);
            this.printLine('Jogue novamente ou digite <span class="cmd-highlight">sair</span>.', output);
        } else if (this.currentGame === 'flappy') {
            this.flappyFlap();
        } else if (this.currentGame === 'snake') {
            this.printLine('Use as setas ou WASD. Digite sair para encerrar.', output);
        }
    },

    startFlappy(output) {
        const self = this;
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.background = 'rgba(17, 24, 39, 0.25)';
        canvas.style.zIndex = '9999';
        canvas.style.cursor = 'pointer';
        document.body.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        const birdImg = new Image();
        const pipeImg = new Image();
        let birdReady = false, pipeReady = false;
        birdImg.onload = () => birdReady = true;
        pipeImg.onload = () => pipeReady = true;
        birdImg.src = 'imagem/flappy.png';
        pipeImg.src = 'imagem/cano.png';
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        const state = {
            y: canvas.height / 2,
            v: 0,
            g: 0.5,
            impulse: -8,
            pipes: [],
            frame: 0,
            score: 0,
            alive: true,
            running: true,
            started: false,
            wingPhase: 0,
            speed: 3,
            sinceSpawn: 0
        };
        const addPipe = () => {
            const baseGap = Math.round(canvas.height * 0.32);
            let gap = Math.max(170, Math.min(260, baseGap));
            gap = Math.max(150, gap - Math.min(60, state.score * 3)); // reduz conforme score
            const top = Math.floor(Math.random() * (canvas.height - gap - 200)) + 50;
            state.pipes.push({ x: canvas.width, top: top, bottom: top + gap, w: 64, passed: false });
        };
        addPipe();
        const flap = () => {
            if (!state.alive) return;
            if (!state.started) state.started = true;
            state.v = state.impulse;
        };
        const onKey = (e) => {
            if (e.key === ' ') {
                e.preventDefault();
                flap();
            } else if (e.key.toLowerCase() === 'r') {
                self.endFlappy();
                self.startFlappy(output);
            } else if (e.key === 'Escape') {
                self.endFlappy();
                self.currentGame = null;
                self.gameData = {};
                self.printLine('Jogo encerrado.', output);
            }
        };
        const onClick = () => {
            if (!state.alive) {
                self.endFlappy();
                self.startFlappy(output);
            } else {
                flap();
            }
        };
        window.addEventListener('resize', resize);
        window.addEventListener('keydown', onKey);
        canvas.addEventListener('click', onClick);
        const loop = () => {
            if (!self.flappy || !state.running) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (state.started && state.alive) {
                state.v += state.g;
                state.y += state.v;
            }
            state.frame++;
            const spawnEvery = Math.max(90, 120 - state.score * 2); // janela mais curta e progressiva
            if (state.started) {
                state.sinceSpawn++;
                if (state.sinceSpawn >= spawnEvery) {
                    addPipe();
                    state.sinceSpawn = 0;
                }
            }
            for (let i = 0; i < state.pipes.length; i++) {
                const p = state.pipes[i];
                if (state.started) p.x -= state.speed;
            }
            state.pipes = state.pipes.filter(p => p.x + p.w > 0);
            state.pipes.forEach(p => {
                ctx.save();
                ctx.shadowColor = 'rgba(0,0,0,0.3)';
                ctx.shadowBlur = 8;
                if (pipeReady) {
                    // Recorte para eliminar possíveis bordas do sprite
                    const sx = 1, sy = 1, sw = Math.max(1, pipeImg.width - 2), sh = Math.max(1, pipeImg.height - 2);
                    // Desenha relativo ao canto superior do canvas
                    ctx.save();
                    ctx.translate(p.x, 0);
                    // Topo: da borda superior (0) até p.top
                    ctx.save();
                    ctx.translate(0, p.top);
                    ctx.scale(1, -1);
                    ctx.drawImage(pipeImg, sx, sy, sw, sh, 0, 0, p.w, p.top);
                    ctx.restore();
                    // Base: de p.bottom até o fim da tela
                    ctx.drawImage(pipeImg, sx, sy, sw, sh, 0, p.bottom, p.w, canvas.height - p.bottom);
                    ctx.restore();
                } else {
                    const pipeGrad = ctx.createLinearGradient(p.x, 0, p.x + p.w, 0);
                    pipeGrad.addColorStop(0, '#15803d');
                    pipeGrad.addColorStop(0.5, '#16a34a');
                    pipeGrad.addColorStop(1, '#166534');
                    ctx.fillStyle = pipeGrad;
                    ctx.fillRect(p.x, 0, p.w, p.top);
                    ctx.fillRect(p.x, p.bottom, p.w, canvas.height - p.bottom);
                }
                ctx.restore();
            });
            const r = birdReady ? 22 : 16;
            ctx.save();
            ctx.translate(100, state.y);
            const angle = Math.max(-0.5, Math.min(0.5, state.v / 10));
            ctx.rotate(angle);
            ctx.save();
            ctx.shadowColor = 'rgba(0,0,0,0.35)';
            ctx.shadowBlur = 10;
            if (birdReady) {
                const birdW = 60, birdH = 48;
                ctx.drawImage(birdImg, -birdW / 2, -birdH / 2, birdW, birdH);
            } else {
                // corpo (fallback)
                ctx.fillStyle = '#facc15';
                ctx.beginPath();
                ctx.ellipse(0, 0, r, r * 0.85, 0, 0, Math.PI * 2);
                ctx.fill();
                // asa animada
                state.wingPhase += 0.25;
                const wingAngle = Math.sin(state.wingPhase) * 0.5;
                ctx.save();
                ctx.rotate(wingAngle);
                ctx.fillStyle = '#ef4444';
                ctx.beginPath();
                ctx.moveTo(-4, 0);
                ctx.lineTo(-18, -8);
                ctx.lineTo(-18, 8);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
                // bico
                ctx.fillStyle = '#fb923c';
                ctx.beginPath();
                ctx.moveTo(r - 6, 0);
                ctx.lineTo(r - 14, -4);
                ctx.lineTo(r - 14, 4);
                ctx.closePath();
                ctx.fill();
                // olho
                ctx.fillStyle = '#fff';
                ctx.beginPath();
                ctx.arc(4, -4, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#000';
                ctx.beginPath();
                ctx.arc(5, -4, 1.5, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
            ctx.restore();
            for (let i = 0; i < state.pipes.length; i++) {
                const p = state.pipes[i];
                if (100 + r > p.x && 100 - r < p.x + p.w) {
                    if (state.y - r < p.top || state.y + r > p.bottom) {
                        state.alive = false;
                    }
                }
                if (!p.passed && p.x + p.w < 100 - r) {
                    p.passed = true;
                    state.score++;
                    state.speed = Math.min(10, 3 + Math.floor(state.score / 10));
                }
            }
            if (state.y + r >= canvas.height || state.y - r <= 0) state.alive = false;
            ctx.fillStyle = 'rgba(2,6,23,0.6)';
            ctx.fillRect(0, canvas.height - 24, canvas.width, 24);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 28px monospace';
            ctx.save();
            ctx.shadowColor = 'rgba(0,0,0,0.6)';
            ctx.shadowBlur = 8;
            ctx.fillText(`Score: ${state.score}`, 20, 40);
            ctx.font = '16px monospace';
            ctx.fillText('ESPACO/CLIQUE: VOAR | R: REINICIAR | ESC: SAIR', 20, 70);
            ctx.restore();
            if (!state.started) {
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 36px monospace';
                ctx.fillText('Pressione ESPAÇO ou clique para iniciar', 20, 120);
                ctx.font = '18px monospace';
                ctx.fillText('R: reiniciar | ESC: sair', 20, 150);
            }
            if (!state.alive) {
                ctx.font = 'bold 36px monospace';
                ctx.fillStyle = '#f87171';
                ctx.fillText('GAME OVER', 20, 120);
                ctx.fillStyle = '#fff';
                ctx.font = '18px monospace';
                ctx.fillText('R: reiniciar | ESC: sair', 20, 150);
                return;
            }
            requestAnimationFrame(loop);
        };
        this.flappy = { canvas, ctx, state, onKey, onClick, resize, loop };
        requestAnimationFrame(loop);
    },

    flappyFlap() {
        if (!this.flappy) return;
        this.flappy.state.v = this.flappy.state.impulse;
    },

    endFlappy() {
        if (!this.flappy) return;
        const { canvas, onKey, onClick, resize } = this.flappy;
        window.removeEventListener('keydown', onKey);
        window.removeEventListener('resize', resize);
        canvas.removeEventListener('click', onClick);
        canvas.remove();
        this.flappy = null;
    },

    startSnake(output) {
        const self = this;
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.background = 'rgba(17, 24, 39, 0.25)';
        canvas.style.zIndex = '9999';
        document.body.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        const cell = 24;
        const state = {
            cols: Math.floor(canvas.width / cell),
            rows: Math.floor(canvas.height / cell),
            snake: [],
            dir: { x: 1, y: 0 },
            next: { x: 1, y: 0 },
            food: null,
            started: false,
            alive: true,
            score: 0,
            speed: 120
        };
        const center = { x: Math.floor(state.cols / 2), y: Math.floor(state.rows / 2) };
        state.snake = [center, { x: center.x - 1, y: center.y }];
        const placeFood = () => {
            let fx, fy, ok = false;
            while (!ok) {
                fx = Math.floor(Math.random() * state.cols);
                fy = Math.floor(Math.random() * state.rows);
                ok = !state.snake.some(s => s.x === fx && s.y === fy);
            }
            state.food = { x: fx, y: fy };
        };
        placeFood();
        const onKey = (e) => {
            if (['ArrowUp', 'w', 'W'].includes(e.key)) {
                if (state.dir.y !== 1) state.next = { x: 0, y: -1 };
                state.started = true;
            } else if (['ArrowDown', 's', 'S'].includes(e.key)) {
                if (state.dir.y !== -1) state.next = { x: 0, y: 1 };
                state.started = true;
            } else if (['ArrowLeft', 'a', 'A'].includes(e.key)) {
                if (state.dir.x !== 1) state.next = { x: -1, y: 0 };
                state.started = true;
            } else if (['ArrowRight', 'd', 'D'].includes(e.key)) {
                if (state.dir.x !== -1) state.next = { x: 1, y: 0 };
                state.started = true;
            } else if (e.key.toLowerCase() === 'r') {
                self.endSnake();
                self.startSnake(output);
            } else if (e.key === 'Escape') {
                self.endSnake();
                self.currentGame = null;
                self.gameData = {};
                self.printLine('Jogo encerrado.', output);
            }
        };
        const tick = () => {
            if (!self.snake || !state.alive) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(2,6,23,0.6)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            if (state.started && state.alive) {
                state.dir = state.next;
                const head = { x: state.snake[0].x + state.dir.x, y: state.snake[0].y + state.dir.y };
                if (head.x < 0 || head.y < 0 || head.x >= state.cols || head.y >= state.rows) {
                    state.alive = false;
                } else if (state.snake.some(s => s.x === head.x && s.y === head.y)) {
                    state.alive = false;
                } else {
                    state.snake.unshift(head);
                    if (head.x === state.food.x && head.y === state.food.y) {
                        state.score++;
                        placeFood();
                        if (state.speed > 60) state.speed -= 2;
                        clearInterval(loop);
                        loop = setInterval(tick, state.speed);
                    } else {
                        state.snake.pop();
                    }
                }
            }
            ctx.fillStyle = '#22c55e';
            state.snake.forEach((s, i) => {
                const x = s.x * cell, y = s.y * cell;
                ctx.fillRect(x + 2, y + 2, cell - 4, cell - 4);
                if (i === 0) {
                    ctx.fillStyle = '#16a34a';
                    ctx.fillRect(x + 4, y + 4, cell - 8, cell - 8);
                    ctx.fillStyle = '#22c55e';
                }
            });
            ctx.fillStyle = '#facc15';
            ctx.beginPath();
            ctx.arc(state.food.x * cell + cell / 2, state.food.y * cell + cell / 2, cell * 0.35, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 24px monospace';
            ctx.fillText(`Score: ${state.score}`, 20, 36);
            if (!state.started) {
                ctx.font = 'bold 28px monospace';
                ctx.fillText('Setas/WASD: mover | R: reiniciar | ESC: sair', 20, 70);
            }
            if (!state.alive) {
                ctx.fillStyle = '#f87171';
                ctx.font = 'bold 36px monospace';
                ctx.fillText('GAME OVER', 20, 120);
                ctx.fillStyle = '#fff';
                ctx.font = '18px monospace';
                ctx.fillText('R: reiniciar | ESC: sair', 20, 150);
            }
        };
        window.addEventListener('keydown', onKey);
        let loop = setInterval(tick, state.speed);
        this.snake = { canvas, ctx, state, onKey, loop, resize };
        window.addEventListener('resize', resize);
    },

    endSnake() {
        if (!this.snake) return;
        const { canvas, onKey, loop, resize } = this.snake;
        window.removeEventListener('keydown', onKey);
        window.removeEventListener('resize', resize);
        clearInterval(loop);
        canvas.remove();
        this.snake = null;
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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ToolsManager.init());
} else {
    ToolsManager.init();
}
