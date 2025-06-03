class UI {
    constructor(game) {
        this.game = game;
        this.currentTab = 'dashboard';
        this.notifications = [];
        
        this.createNotificationContainer();
        this.setupTabSwitching();
    }

    createNotificationContainer() {
        if (!document.getElementById('notifications-container')) {
            const container = document.createElement('div');
            container.id = 'notifications-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }
    }

    setupTabSwitching() {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                this.switchTab(tab);
            });
        });
    }

    switchTab(tabName) {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const targetBtn = document.querySelector(`[data-tab="${tabName}"]`);
        const targetContent = document.getElementById(`${tabName}-tab`);
        
        if (targetBtn && targetContent) {
            targetBtn.classList.add('active');
            targetContent.classList.add('active');
            this.currentTab = tabName;
            
            this.onTabSwitch(tabName);
        }
    }

    onTabSwitch(tabName) {
        switch (tabName) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'character':
                this.updateCharacterTab();
                break;
            case 'inventory':
                this.updateInventoryTab();
                break;
            case 'quests':
                this.updateQuestsTab();
                break;
            case 'achievements':
                this.updateAchievementsTab();
                break;
        }
    }

    updatePlayerDisplay() {
        const player = this.game.player;
        
        document.getElementById('player-level').textContent = player.level;
        document.getElementById('player-name').textContent = player.name;
        document.getElementById('gold-amount').textContent = player.gold.toLocaleString();
        
        const healthPercent = (player.health / player.maxHealth) * 100;
        const manaPercent = (player.mana / player.maxMana) * 100;
        const expPercent = (player.experience / player.experienceToNext) * 100;
        
        document.getElementById('health-fill').style.width = `${healthPercent}%`;
        document.getElementById('health-text').textContent = `${player.health}/${player.maxHealth}`;
        
        document.getElementById('mana-fill').style.width = `${manaPercent}%`;
        document.getElementById('mana-text').textContent = `${player.mana}/${player.maxMana}`;
        
        document.getElementById('exp-fill').style.width = `${expPercent}%`;
        document.getElementById('exp-text').textContent = `${player.experience}/${player.experienceToNext}`;
        
        document.getElementById('battle-player-name').textContent = player.name;
    }

    updateDashboard() {
        const progress = this.game.gameData.progress;
        
        this.updateProgressBar('.daily-progress .progress-item:nth-child(1) .progress-fill', 
                              progress.dailyBattles, 10);
        this.updateProgressBar('.daily-progress .progress-item:nth-child(2) .progress-fill', 
                              progress.dailyQuests, 3);
        
        document.querySelector('.daily-progress .progress-item:nth-child(1) .progress-text')
                .textContent = `${progress.dailyBattles}/10`;
        document.querySelector('.daily-progress .progress-item:nth-child(2) .progress-text')
                .textContent = `${progress.dailyQuests}/3`;
        
        this.updateStats();
    }

    updateProgressBar(selector, current, max) {
        const element = document.querySelector(selector);
        if (element) {
            const percent = Math.min((current / max) * 100, 100);
            element.style.width = `${percent}%`;
        }
    }

    updateStats() {
        const progress = this.game.gameData.progress;
        
        document.getElementById('total-battles').textContent = progress.totalBattles.toLocaleString();
        document.getElementById('total-gold').textContent = progress.totalGold.toLocaleString();
        document.getElementById('play-time').textContent = `${Math.floor(progress.playTime)}h`;
    }

    updateCharacterTab() {
        const characterTab = document.getElementById('character-tab');
        if (!characterTab) return;
        
        const player = this.game.player;
        const stats = player.getStats();
        
        characterTab.innerHTML = `
            <div class="character-container">
                <h2>Personaje</h2>
                
                <div class="character-grid">
                    <div class="character-card">
                        <h3>Información Básica</h3>
                        <div class="character-info">
                            <div class="info-row">
                                <span class="info-label">Nombre:</span>
                                <span class="info-value">${player.name}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Nivel:</span>
                                <span class="info-value">${stats.level}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Experiencia:</span>
                                <span class="info-value">${stats.experience}/${stats.experienceToNext}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="character-card">
                        <h3>Atributos</h3>
                        <div class="attributes-grid">
                            <div class="attribute-item">
                                <span class="attr-icon">💪</span>
                                <span class="attr-name">Fuerza</span>
                                <span class="attr-value">${stats.strength}</span>
                            </div>
                            <div class="attribute-item">
                                <span class="attr-icon">🏃</span>
                                <span class="attr-name">Destreza</span>
                                <span class="attr-value">${stats.dexterity}</span>
                            </div>
                            <div class="attribute-item">
                                <span class="attr-icon">🧠</span>
                                <span class="attr-name">Inteligencia</span>
                                <span class="attr-value">${stats.intelligence}</span>
                            </div>
                            <div class="attribute-item">
                                <span class="attr-icon">❤️</span>
                                <span class="attr-name">Vitalidad</span>
                                <span class="attr-value">${stats.vitality}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="character-card">
                        <h3>Estadísticas de Combate</h3>
                        <div class="combat-stats">
                            <div class="stat-row">
                                <span class="stat-label">Ataque:</span>
                                <span class="stat-value">${stats.attack}</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">Defensa:</span>
                                <span class="stat-value">${stats.defense}</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">Poder Mágico:</span>
                                <span class="stat-value">${Math.floor(stats.magicPower)}</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">Prob. Crítico:</span>
                                <span class="stat-value">${stats.criticalChance}%</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="character-card">
                        <h3>Equipamiento</h3>
                        <div class="equipment-slots">
                            <div class="equipment-slot" data-slot="weapon">
                                <div class="slot-icon">⚔️</div>
                                <div class="slot-name">Arma</div>
                                <div class="slot-item">${player.equipment.weapon?.name || 'Vacío'}</div>
                            </div>
                            <div class="equipment-slot" data-slot="armor">
                                <div class="slot-icon">🛡️</div>
                                <div class="slot-name">Armadura</div>
                                <div class="slot-item">${player.equipment.armor?.name || 'Vacío'}</div>
                            </div>
                            <div class="equipment-slot" data-slot="accessory">
                                <div class="slot-icon">💍</div>
                                <div class="slot-name">Accesorio</div>
                                <div class="slot-item">${player.equipment.accessory?.name || 'Vacío'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.addCharacterTabStyles();
    }

    updateInventoryTab() {
        const inventoryTab = document.getElementById('inventory-tab');
        if (!inventoryTab) return;
        
        const player = this.game.player;
        
        inventoryTab.innerHTML = `
            <div class="inventory-container">
                <h2>Inventario</h2>
                
                <div class="inventory-grid">
                    ${player.inventory.map((item, index) => `
                        <div class="inventory-item ${item.rarity}" data-index="${index}">
                            <div class="item-icon">${this.getItemIcon(item.type)}</div>
                            <div class="item-name">${item.name}</div>
                            <div class="item-rarity">${item.rarity}</div>
                            ${item.attack ? `<div class="item-stat">+${item.attack} ATK</div>` : ''}
                            ${item.defense ? `<div class="item-stat">+${item.defense} DEF</div>` : ''}
                            ${item.value ? `<div class="item-value">${item.value} oro</div>` : ''}
                        </div>
                    `).join('')}
                    
                    ${Array.from({length: Math.max(0, 20 - player.inventory.length)}, (_, i) => 
                        `<div class="inventory-slot empty"></div>`
                    ).join('')}
                </div>
            </div>
        `;
        
        this.setupInventoryEvents();
        this.addInventoryTabStyles();
    }

    setupInventoryEvents() {
        document.querySelectorAll('.inventory-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                const inventoryItem = this.game.player.inventory[index];
                
                if (inventoryItem && (inventoryItem.type === 'weapon' || inventoryItem.type === 'armor' || inventoryItem.type === 'accessory')) {
                    this.game.player.equipItem(inventoryItem);
                    this.game.player.removeItem(index);
                    this.updateInventoryTab();
                    this.updatePlayerDisplay();
                }
            });
        });
    }

    getItemIcon(type) {
        const icons = {
            weapon: '⚔️',
            armor: '🛡️',
            accessory: '💍',
            consumable: '🧪',
            default: '📦'
        };
        return icons[type] || icons.default;
    }

    updateQuestsTab() {
        const questsTab = document.getElementById('quests-tab');
        if (!questsTab) return;
        
        questsTab.innerHTML = `
            <div class="quests-container">
                <h2>Misiones</h2>
                
                <div class="quests-grid">
                    <div class="quest-card active">
                        <h3>🏹 Primera Batalla</h3>
                        <p>Gana tu primera batalla para demostrar tu valor como aventurero.</p>
                        <div class="quest-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${this.game.gameData.progress.totalBattles > 0 ? '100%' : '0%'}"></div>
                            </div>
                            <span class="progress-text">${Math.min(this.game.gameData.progress.totalBattles, 1)}/1</span>
                        </div>
                        <div class="quest-reward">Recompensa: 50 XP, 25 Oro</div>
                    </div>
                    
                    <div class="quest-card ${this.game.player.level >= 5 ? 'active' : 'locked'}">
                        <h3>📈 Alcanzar Nivel 5</h3>
                        <p>Entrena y mejora hasta alcanzar el nivel 5.</p>
                        <div class="quest-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${Math.min((this.game.player.level / 5) * 100, 100)}%"></div>
                            </div>
                            <span class="progress-text">${Math.min(this.game.player.level, 5)}/5</span>
                        </div>
                        <div class="quest-reward">Recompensa: 200 XP, 100 Oro, Espada de Hierro</div>
                    </div>
                    
                    <div class="quest-card ${this.game.gameData.progress.totalBattles >= 10 ? 'active' : 'locked'}">
                        <h3>⚔️ Veterano de Guerra</h3>
                        <p>Completa 10 batallas para convertirte en un guerrero experimentado.</p>
                        <div class="quest-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${Math.min((this.game.gameData.progress.totalBattles / 10) * 100, 100)}%"></div>
                            </div>
                            <span class="progress-text">${Math.min(this.game.gameData.progress.totalBattles, 10)}/10</span>
                        </div>
                        <div class="quest-reward">Recompensa: 300 XP, 200 Oro, Armadura de Cuero</div>
                    </div>
                </div>
            </div>
        `;
        
        this.addQuestsTabStyles();
    }

    updateAchievementsTab() {
        const achievementsTab = document.getElementById('achievements-tab');
        if (!achievementsTab) return;
        
        const achievements = [
            {
                name: 'Primer Paso',
                description: 'Inicia tu primera aventura',
                icon: '👶',
                unlocked: true,
                progress: '1/1'
            },
            {
                name: 'Cazador de Goblins',
                description: 'Derrota 5 enemigos',
                icon: '👹',
                unlocked: this.game.gameData.progress.totalBattles >= 5,
                progress: `${Math.min(this.game.gameData.progress.totalBattles, 5)}/5`
            },
            {
                name: 'Acumulador de Riquezas',
                description: 'Acumula 1000 de oro total',
                icon: '💰',
                unlocked: this.game.gameData.progress.totalGold >= 1000,
                progress: `${Math.min(this.game.gameData.progress.totalGold, 1000)}/1000`
            },
            {
                name: 'Maestro de Armas',
                description: 'Alcanza nivel 10',
                icon: '🗡️',
                unlocked: this.game.player.level >= 10,
                progress: `${Math.min(this.game.player.level, 10)}/10`
            }
        ];
        
        achievementsTab.innerHTML = `
            <div class="achievements-container">
                <h2>Logros</h2>
                
                <div class="achievements-grid">
                    ${achievements.map(achievement => `
                        <div class="achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}">
                            <div class="achievement-icon">${achievement.icon}</div>
                            <div class="achievement-info">
                                <h3>${achievement.name}</h3>
                                <p>${achievement.description}</p>
                                <div class="achievement-progress">${achievement.progress}</div>
                            </div>
                            ${achievement.unlocked ? '<div class="achievement-badge">✅</div>' : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        this.addAchievementsTabStyles();
    }

    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 12px 20px;
            margin-bottom: 10px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            transform: translateX(300px);
            transition: all 0.3s ease;
            font-weight: 500;
            max-width: 300px;
            word-wrap: break-word;
            pointer-events: auto;
            cursor: pointer;
        `;
        
        const container = document.getElementById('notifications-container');
        container.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        const removeNotification = () => {
            notification.style.transform = 'translateX(300px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        };
        
        notification.addEventListener('click', removeNotification);
        setTimeout(removeNotification, duration);
    }

    getNotificationColor(type) {
        const colors = {
            info: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            success: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            warning: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            error: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            legendary: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
        };
        return colors[type] || colors.info;
    }

    addCharacterTabStyles() {
        if (!document.getElementById('character-tab-styles')) {
            const style = document.createElement('style');
            style.id = 'character-tab-styles';
            style.textContent = `
                .character-container h2 {
                    color: var(--accent-primary);
                    margin-bottom: 2rem;
                    font-size: 1.8rem;
                }
                
                .character-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 1.5rem;
                }
                
                .character-card {
                    background: var(--bg-card);
                    padding: 1.5rem;
                    border-radius: var(--border-radius);
                    border: 1px solid var(--bg-tertiary);
                    box-shadow: var(--shadow-card);
                }
                
                .character-card h3 {
                    color: var(--accent-primary);
                    margin-bottom: 1rem;
                    font-size: 1.1rem;
                }
                
                .info-row, .stat-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.5rem;
                }
                
                .info-label, .stat-label {
                    color: var(--text-secondary);
                }
                
                .info-value, .stat-value {
                    color: var(--text-primary);
                    font-weight: bold;
                }
                
                .attributes-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1rem;
                }
                
                .attribute-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem;
                    background: var(--bg-secondary);
                    border-radius: var(--border-radius-small);
                }
                
                .attr-icon {
                    font-size: 1.2rem;
                }
                
                .attr-name {
                    flex: 1;
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                }
                
                .attr-value {
                    color: var(--accent-success);
                    font-weight: bold;
                }
                
                .equipment-slots {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                
                .equipment-slot {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    background: var(--bg-secondary);
                    border-radius: var(--border-radius-small);
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .equipment-slot:hover {
                    background: var(--bg-tertiary);
                }
                
                .slot-icon {
                    font-size: 1.5rem;
                }
                
                .slot-name {
                    flex: 1;
                    color: var(--text-secondary);
                }
                
                .slot-item {
                    color: var(--text-primary);
                    font-weight: bold;
                }
            `;
            document.head.appendChild(style);
        }
    }

    addInventoryTabStyles() {
        if (!document.getElementById('inventory-tab-styles')) {
            const style = document.createElement('style');
            style.id = 'inventory-tab-styles';
            style.textContent = `
                .inventory-container h2 {
                    color: var(--accent-primary);
                    margin-bottom: 2rem;
                    font-size: 1.8rem;
                }
                
                .inventory-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
                    gap: 1rem;
                    max-height: 70vh;
                    overflow-y: auto;
                }
                
                .inventory-item, .inventory-slot {
                    aspect-ratio: 1;
                    background: var(--bg-card);
                    border: 2px solid var(--bg-tertiary);
                    border-radius: var(--border-radius-small);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    padding: 0.5rem;
                }
                
                .inventory-item:hover {
                    transform: scale(1.05);
                    box-shadow: var(--shadow-glow);
                }
                
                .inventory-item.common {
                    border-color: #888;
                }
                
                .inventory-item.uncommon {
                    border-color: #4ade80;
                }
                
                .inventory-item.rare {
                    border-color: #3b82f6;
                }
                
                .inventory-item.epic {
                    border-color: #a855f7;
                }
                
                .inventory-item.legendary {
                    border-color: #f59e0b;
                    box-shadow: 0 0 20px rgba(245, 158, 11, 0.3);
                }
                
                .inventory-slot.empty {
                    border-style: dashed;
                    opacity: 0.5;
                    cursor: default;
                }
                
                .item-icon {
                    font-size: 2rem;
                    margin-bottom: 0.5rem;
                }
                
                .item-name {
                    font-size: 0.8rem;
                    font-weight: bold;
                    color: var(--text-primary);
                    margin-bottom: 0.25rem;
                }
                
                .item-rarity {
                    font-size: 0.7rem;
                    color: var(--text-muted);
                    text-transform: capitalize;
                }
                
                .item-stat {
                    font-size: 0.7rem;
                    color: var(--accent-success);
                    font-weight: bold;
                }
                
                .item-value {
                    font-size: 0.7rem;
                    color: var(--accent-warning);
                }
            `;
            document.head.appendChild(style);
        }
    }

    addQuestsTabStyles() {
        if (!document.getElementById('quests-tab-styles')) {
            const style = document.createElement('style');
            style.id = 'quests-tab-styles';
            style.textContent = `
                .quests-container h2 {
                    color: var(--accent-primary);
                    margin-bottom: 2rem;
                    font-size: 1.8rem;
                }
                
                .quests-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                
                .quest-card {
                    background: var(--bg-card);
                    padding: 1.5rem;
                    border-radius: var(--border-radius);
                    border: 1px solid var(--bg-tertiary);
                    box-shadow: var(--shadow-card);
                    transition: all 0.3s ease;
                }
                
                .quest-card.active {
                    border-color: var(--accent-success);
                    box-shadow: 0 0 15px rgba(0, 255, 136, 0.2);
                }
                
                .quest-card.locked {
                    opacity: 0.6;
                    border-color: var(--text-muted);
                }
                
                .quest-card h3 {
                    color: var(--accent-primary);
                    margin-bottom: 0.5rem;
                    font-size: 1.1rem;
                }
                
                .quest-card p {
                    color: var(--text-secondary);
                    margin-bottom: 1rem;
                    line-height: 1.5;
                }
                
                .quest-progress {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }
                
                .quest-progress .progress-bar {
                    flex: 1;
                    height: 10px;
                    background: rgba(0, 0, 0, 0.3);
                    border-radius: 5px;
                    overflow: hidden;
                }
                
                .quest-reward {
                    color: var(--accent-warning);
                    font-weight: bold;
                    font-size: 0.9rem;
                }
            `;
            document.head.appendChild(style);
        }
    }

    addAchievementsTabStyles() {
        if (!document.getElementById('achievements-tab-styles')) {
            const style = document.createElement('style');
            style.id = 'achievements-tab-styles';
            style.textContent = `
                .achievements-container h2 {
                    color: var(--accent-primary);
                    margin-bottom: 2rem;
                    font-size: 1.8rem;
                }
                
                .achievements-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 1rem;
                }
                
                .achievement-card {
                    background: var(--bg-card);
                    padding: 1.5rem;
                    border-radius: var(--border-radius);
                    border: 1px solid var(--bg-tertiary);
                    box-shadow: var(--shadow-card);
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    position: relative;
                    transition: all 0.3s ease;
                }
                
                .achievement-card.unlocked {
                    border-color: var(--accent-success);
                    box-shadow: 0 0 15px rgba(0, 255, 136, 0.2);
                }
                
                .achievement-card.locked {
                    opacity: 0.6;
                }
                
                .achievement-icon {
                    font-size: 2rem;
                    flex-shrink: 0;
                }
                
                .achievement-info {
                    flex: 1;
                }
                
                .achievement-info h3 {
                    color: var(--accent-primary);
                    margin-bottom: 0.5rem;
                    font-size: 1rem;
                }
                
                .achievement-info p {
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                    margin-bottom: 0.5rem;
                }
                
                .achievement-progress {
                    color: var(--text-muted);
                    font-size: 0.8rem;
                }
                
                .achievement-badge {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    font-size: 1.2rem;
                }
            `;
            document.head.appendChild(style);
        }
    }
}