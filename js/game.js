class Game {
    constructor() {
        this.currentScreen = 'loading';
        this.gameData = null;
        this.player = null;
        this.ui = null;
        this.battle = null;
        this.isLoaded = false;
        
        this.init();
    }

    async init() {
        console.log('🎮 Iniciando Realm Quest...');
        
        await this.showLoadingScreen();
        await this.loadGameData();
        await this.initializeComponents();
        await this.setupEventListeners();
        
        this.showMainScreen();
        this.startGameLoop();
        
        console.log('✅ Juego inicializado correctamente');
    }

    async showLoadingScreen() {
        const loadingFill = document.querySelector('.loading-fill');
        const loadingText = document.querySelector('.loading-text');
        
        const messages = [
            'Preparando tu aventura...',
            'Cargando personaje...',
            'Generando mundo...',
            'Afilando espadas...',
            '¡Listo para la aventura!'
        ];
        
        for (let i = 0; i < messages.length; i++) {
            loadingText.textContent = messages[i];
            loadingFill.style.width = `${(i + 1) * 20}%`;
            await this.delay(600);
        }
        
        await this.delay(500);
    }

    async loadGameData() {
        try {
            const savedData = localStorage.getItem('realmquest_save');
            if (savedData) {
                this.gameData = JSON.parse(savedData);
                console.log('💾 Datos guardados cargados');
            } else {
                this.createNewGame();
                console.log('🆕 Nueva partida creada');
            }
        } catch (error) {
            console.error('❌ Error cargando datos:', error);
            this.createNewGame();
        }
    }

    createNewGame() {
        this.gameData = {
            player: {
                name: 'Aventurero',
                level: 1,
                experience: 0,
                experienceToNext: 100,
                health: 100,
                maxHealth: 100,
                mana: 50,
                maxMana: 50,
                strength: 10,
                dexterity: 10,
                intelligence: 10,
                vitality: 10,
                gold: 0,
                inventory: [],
                equipment: {
                    weapon: null,
                    armor: null,
                    accessory: null
                }
            },
            progress: {
                totalBattles: 0,
                totalGold: 0,
                playTime: 0,
                dailyBattles: 0,
                dailyQuests: 0,
                lastLogin: Date.now(),
                unlockedAreas: ['bosque']
            },
            settings: {
                soundEnabled: true,
                musicEnabled: true,
                difficulty: 'normal'
            }
        };
        
        this.saveGame();
    }

    async initializeComponents() {
        this.player = new Player(this.gameData.player);
        this.ui = new UI(this);
        this.battle = new BattleSystem(this);
        
        this.ui.updatePlayerDisplay();
    }

    setupEventListeners() {
        document.getElementById('quick-battle').addEventListener('click', () => {
            this.startQuickBattle();
        });

        document.getElementById('daily-reward').addEventListener('click', () => {
            this.claimDailyReward();
        });

        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                this.ui.switchTab(tab);
            });
        });

        document.querySelectorAll('.map-location.available').forEach(location => {
            location.addEventListener('click', (e) => {
                const locationName = e.currentTarget.dataset.location;
                this.exploreLocation(locationName);
            });
        });

        window.addEventListener('beforeunload', () => {
            this.saveGame();
        });

        setInterval(() => {
            this.saveGame();
            this.updatePlayTime();
        }, 30000);
    }

    startQuickBattle() {
        const enemies = [
            { name: 'Goblin', health: 30, attack: 8, experience: 15, gold: 5 },
            { name: 'Lobo', health: 45, attack: 12, experience: 22, gold: 8 },
            { name: 'Bandido', health: 60, attack: 15, experience: 30, gold: 12 }
        ];
        
        const randomEnemy = enemies[Math.floor(Math.random() * enemies.length)];
        this.battle.startBattle(randomEnemy);
    }

    exploreLocation(locationName) {
        const locations = {
            bosque: {
                name: 'Bosque Susurrante',
                enemies: [
                    { name: 'Goblin', health: 30, attack: 8, experience: 15, gold: 5 },
                    { name: 'Araña Gigante', health: 40, attack: 10, experience: 20, gold: 7 },
                    { name: 'Ent Joven', health: 80, attack: 18, experience: 40, gold: 15 }
                ]
            }
        };
        
        const location = locations[locationName];
        if (location && this.gameData.progress.unlockedAreas.includes(locationName)) {
            const randomEnemy = location.enemies[Math.floor(Math.random() * location.enemies.length)];
            this.battle.startBattle(randomEnemy, location.name);
        }
    }

    claimDailyReward() {
        const now = Date.now();
        const lastLogin = this.gameData.progress.lastLogin;
        const dayInMs = 24 * 60 * 60 * 1000;
        
        if (now - lastLogin >= dayInMs) {
            const reward = {
                gold: 50 + (this.player.level * 10),
                experience: 25 + (this.player.level * 5)
            };
            
            this.player.addGold(reward.gold);
            this.player.addExperience(reward.experience);
            
            this.gameData.progress.lastLogin = now;
            this.saveGame();
            
            this.ui.showNotification(`¡Recompensa diaria! +${reward.gold} oro, +${reward.experience} XP`, 'success');
        } else {
            this.ui.showNotification('Ya reclamaste tu recompensa diaria', 'info');
        }
    }

    updatePlayTime() {
        this.gameData.progress.playTime += 0.5;
        this.ui.updateStats();
    }

    showMainScreen() {
        this.switchScreen('main');
    }

    showBattleScreen() {
        this.switchScreen('battle');
    }

    switchScreen(screenName) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        document.getElementById(`${screenName}-screen`).classList.add('active');
        this.currentScreen = screenName;
    }

    startGameLoop() {
        const gameLoop = () => {
            this.update();
            requestAnimationFrame(gameLoop);
        };
        
        requestAnimationFrame(gameLoop);
    }

    update() {
        if (this.battle && this.battle.isActive) {
            this.battle.update();
        }
    }

    saveGame() {
        try {
            this.gameData.player = this.player.getData();
            localStorage.setItem('realmquest_save', JSON.stringify(this.gameData));
        } catch (error) {
            console.error('❌ Error guardando:', error);
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    createParticleEffect(x, y, color = '#00d4ff', count = 10) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.background = color;
            particle.style.animationDelay = (i * 50) + 'ms';
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1000);
        }
    }

    showDamageNumber(x, y, damage, type = 'normal') {
        const damageEl = document.createElement('div');
        damageEl.className = `damage-number ${type}`;
        damageEl.textContent = `-${damage}`;
        damageEl.style.left = x + 'px';
        damageEl.style.top = y + 'px';
        
        if (type === 'heal') {
            damageEl.textContent = `+${damage}`;
            damageEl.style.color = '#00ff88';
        }
        
        document.body.appendChild(damageEl);
        
        setTimeout(() => {
            if (damageEl.parentNode) {
                damageEl.parentNode.removeChild(damageEl);
            }
        }, 1000);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});