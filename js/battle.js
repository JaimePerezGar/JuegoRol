class BattleSystem {
    constructor(game) {
        this.game = game;
        this.isActive = false;
        this.currentEnemy = null;
        this.battleLocation = '';
        this.turnQueue = [];
        this.currentTurn = 0;
        this.battleLog = [];
        this.playerAction = null;
        this.isPlayerTurn = true;
        
        this.setupBattleEvents();
    }

    setupBattleEvents() {
        document.getElementById('attack-btn').addEventListener('click', () => {
            if (this.isPlayerTurn && this.isActive) {
                this.playerAttack();
            }
        });

        document.getElementById('defend-btn').addEventListener('click', () => {
            if (this.isPlayerTurn && this.isActive) {
                this.playerDefend();
            }
        });

        document.getElementById('magic-btn').addEventListener('click', () => {
            if (this.isPlayerTurn && this.isActive) {
                this.playerMagic();
            }
        });

        document.getElementById('item-btn').addEventListener('click', () => {
            if (this.isPlayerTurn && this.isActive) {
                this.playerUseItem();
            }
        });

        document.getElementById('flee-battle').addEventListener('click', () => {
            this.fleeBattle();
        });
    }

    startBattle(enemy, location = 'Batalla') {
        this.isActive = true;
        this.currentEnemy = {
            ...enemy,
            maxHealth: enemy.health,
            isDefending: false
        };
        this.battleLocation = location;
        this.battleLog = [];
        this.isPlayerTurn = true;
        
        this.game.switchScreen('battle');
        this.updateBattleDisplay();
        this.addToBattleLog(`¡Combate contra ${enemy.name} en ${location}!`);
        
        document.getElementById('battle-location').textContent = location;
        
        this.game.player.resetDefense();
        
        setTimeout(() => {
            this.addToBattleLog('¡El combate ha comenzado! ¡Elige tu acción!');
        }, 500);
    }

    playerAttack() {
        if (!this.isPlayerTurn) return;
        
        const attackResult = this.game.player.getAttackDamage();
        const finalDamage = this.calculateDamage(attackResult.damage, this.currentEnemy.defense || 0);
        
        this.currentEnemy.health = Math.max(0, this.currentEnemy.health - finalDamage);
        
        let logMessage = `Atacas a ${this.currentEnemy.name} causando ${finalDamage} de daño`;
        if (attackResult.critical) {
            logMessage += ' ¡CRÍTICO!';
            this.showBattleEffect('critical');
        }
        
        this.addToBattleLog(logMessage);
        this.updateBattleDisplay();
        
        if (this.currentEnemy.health <= 0) {
            this.endBattle(true);
        } else {
            this.endPlayerTurn();
        }
    }

    playerDefend() {
        if (!this.isPlayerTurn) return;
        
        this.game.player.defend();
        this.addToBattleLog('Te preparas para defenderte, reduciendo el daño recibido');
        this.showBattleEffect('defend');
        
        this.endPlayerTurn();
    }

    playerMagic() {
        if (!this.isPlayerTurn) return;
        
        const magicResult = this.game.player.getMagicDamage();
        if (!magicResult) {
            this.addToBattleLog('¡No tienes suficiente MP para usar magia!');
            return;
        }
        
        const finalDamage = this.calculateDamage(magicResult.damage, Math.floor((this.currentEnemy.defense || 0) / 2));
        this.currentEnemy.health = Math.max(0, this.currentEnemy.health - finalDamage);
        
        this.addToBattleLog(`Lanzas un hechizo a ${this.currentEnemy.name} causando ${finalDamage} de daño mágico`);
        this.showBattleEffect('magic');
        this.updateBattleDisplay();
        
        if (this.currentEnemy.health <= 0) {
            this.endBattle(true);
        } else {
            this.endPlayerTurn();
        }
    }

    playerUseItem() {
        if (!this.isPlayerTurn) return;
        
        if (this.game.player.canUsePotion() && Math.random() > 0.5) {
            this.game.player.useHealthPotion();
            this.addToBattleLog('Usas una poción de vida');
            this.showBattleEffect('heal');
            this.updateBattleDisplay();
            this.endPlayerTurn();
        } else if (this.game.player.mana < this.game.player.maxMana) {
            this.game.player.useManaPotion();
            this.addToBattleLog('Usas una poción de maná');
            this.showBattleEffect('mana');
            this.updateBattleDisplay();
            this.endPlayerTurn();
        } else {
            this.addToBattleLog('No tienes objetos útiles que usar en este momento');
        }
    }

    enemyTurn() {
        if (!this.isActive || this.isPlayerTurn) return;
        
        setTimeout(() => {
            const actions = ['attack', 'attack', 'defend'];
            const action = actions[Math.floor(Math.random() * actions.length)];
            
            if (action === 'attack') {
                this.enemyAttack();
            } else {
                this.enemyDefend();
            }
        }, 1000);
    }

    enemyAttack() {
        const baseDamage = (this.currentEnemy.attack || 10) + Math.floor(Math.random() * 5);
        let finalDamage = this.calculateDamage(baseDamage, this.game.player.baseDefense);
        
        if (this.game.player.isDefending) {
            finalDamage = Math.floor(finalDamage * 0.5);
            this.addToBattleLog(`${this.currentEnemy.name} ataca, pero tu defensa reduce el daño`);
        } else {
            this.addToBattleLog(`${this.currentEnemy.name} te ataca`);
        }
        
        const actualDamage = this.game.player.takeDamage(finalDamage);
        this.addToBattleLog(`Recibes ${actualDamage} puntos de daño`);
        
        this.updateBattleDisplay();
        
        if (!this.game.player.isAlive()) {
            this.endBattle(false);
        } else {
            this.endEnemyTurn();
        }
    }

    enemyDefend() {
        this.currentEnemy.isDefending = true;
        this.addToBattleLog(`${this.currentEnemy.name} se prepara para defenderse`);
        this.endEnemyTurn();
    }

    endPlayerTurn() {
        this.game.player.resetDefense();
        this.isPlayerTurn = false;
        this.currentEnemy.isDefending = false;
        
        setTimeout(() => {
            this.enemyTurn();
        }, 500);
    }

    endEnemyTurn() {
        this.isPlayerTurn = true;
        this.addToBattleLog('Es tu turno. ¡Elige tu acción!');
    }

    calculateDamage(baseDamage, defense) {
        const finalDamage = Math.max(1, baseDamage - defense);
        return finalDamage + Math.floor(Math.random() * 3);
    }

    endBattle(playerWon) {
        this.isActive = false;
        
        if (playerWon) {
            const expGained = this.currentEnemy.experience || 10;
            const goldGained = this.currentEnemy.gold || 5;
            
            this.addToBattleLog(`¡Victoria! ${this.currentEnemy.name} ha sido derrotado`);
            this.addToBattleLog(`Ganas ${expGained} XP y ${goldGained} oro`);
            
            const leveledUp = this.game.player.addExperience(expGained);
            this.game.player.addGold(goldGained);
            
            this.game.gameData.progress.totalBattles++;
            this.game.gameData.progress.dailyBattles++;
            
            if (leveledUp) {
                this.addToBattleLog('¡Has subido de nivel!');
            }
            
            this.showBattleEffect('victory');
            
            const lootChance = Math.random();
            if (lootChance < 0.3) {
                this.generateLoot();
            }
            
        } else {
            this.addToBattleLog('Has sido derrotado...');
            this.addToBattleLog('Pierdes algo de oro y regresas al pueblo');
            
            const goldLost = Math.floor(this.game.player.gold * 0.1);
            this.game.player.spendGold(goldLost);
            this.game.player.fullRestore();
            
            this.showBattleEffect('defeat');
        }
        
        this.updateBattleDisplay();
        
        setTimeout(() => {
            this.returnToMain();
        }, 3000);
    }

    generateLoot() {
        const lootTable = [
            { name: 'Poción de Vida', type: 'consumable', rarity: 'common', value: 25 },
            { name: 'Poción de Maná', type: 'consumable', rarity: 'common', value: 20 },
            { name: 'Espada de Hierro', type: 'weapon', rarity: 'uncommon', attack: 5, value: 50 },
            { name: 'Armadura de Cuero', type: 'armor', rarity: 'uncommon', defense: 3, value: 40 },
            { name: 'Anillo de Fuerza', type: 'accessory', rarity: 'rare', strength: 2, value: 100 },
            { name: 'Espada Flamígera', type: 'weapon', rarity: 'epic', attack: 12, value: 200 },
            { name: 'Corona del Héroe', type: 'accessory', rarity: 'legendary', strength: 5, intelligence: 5, value: 500 }
        ];
        
        let loot;
        const rarityRoll = Math.random();
        
        if (rarityRoll < 0.01) {
            loot = lootTable.filter(item => item.rarity === 'legendary');
        } else if (rarityRoll < 0.05) {
            loot = lootTable.filter(item => item.rarity === 'epic');
        } else if (rarityRoll < 0.15) {
            loot = lootTable.filter(item => item.rarity === 'rare');
        } else if (rarityRoll < 0.4) {
            loot = lootTable.filter(item => item.rarity === 'uncommon');
        } else {
            loot = lootTable.filter(item => item.rarity === 'common');
        }
        
        if (loot.length > 0) {
            const item = loot[Math.floor(Math.random() * loot.length)];
            this.game.player.addItem(item);
            this.addToBattleLog(`¡Objeto encontrado! ${item.name} (${item.rarity})`);
            
            this.showBattleEffect('loot');
        }
    }

    fleeBattle() {
        if (!this.isActive) return;
        
        const fleeChance = 0.7 + (this.game.player.dexterity / 100);
        
        if (Math.random() < fleeChance) {
            this.addToBattleLog('Logras escapar del combate');
            this.isActive = false;
            
            setTimeout(() => {
                this.returnToMain();
            }, 1500);
        } else {
            this.addToBattleLog('¡No pudiste escapar!');
            this.endPlayerTurn();
        }
    }

    returnToMain() {
        this.game.switchScreen('main');
        this.currentEnemy = null;
        this.battleLocation = '';
        this.isPlayerTurn = true;
        
        if (this.game.ui) {
            this.game.ui.updatePlayerDisplay();
            this.game.ui.updateStats();
        }
    }

    addToBattleLog(message) {
        this.battleLog.push(message);
        
        const logElement = document.getElementById('battle-log');
        if (logElement) {
            logElement.innerHTML += `<p>${message}</p>`;
            logElement.scrollTop = logElement.scrollHeight;
        }
        
        if (this.battleLog.length > 20) {
            this.battleLog = this.battleLog.slice(-15);
            if (logElement) {
                const paragraphs = logElement.querySelectorAll('p');
                if (paragraphs.length > 15) {
                    for (let i = 0; i < paragraphs.length - 15; i++) {
                        paragraphs[i].remove();
                    }
                }
            }
        }
    }

    updateBattleDisplay() {
        const playerHealthFill = document.getElementById('battle-player-health');
        const playerHealthText = document.getElementById('battle-player-health-text');
        const playerManaFill = document.getElementById('battle-player-mana');
        const playerManaText = document.getElementById('battle-player-mana-text');
        
        const enemyHealthFill = document.getElementById('battle-enemy-health');
        const enemyHealthText = document.getElementById('battle-enemy-health-text');
        const enemyName = document.getElementById('enemy-name');
        
        if (playerHealthFill && playerHealthText) {
            const healthPercent = (this.game.player.health / this.game.player.maxHealth) * 100;
            playerHealthFill.style.width = `${healthPercent}%`;
            playerHealthText.textContent = `${this.game.player.health}/${this.game.player.maxHealth}`;
        }
        
        if (playerManaFill && playerManaText) {
            const manaPercent = (this.game.player.mana / this.game.player.maxMana) * 100;
            playerManaFill.style.width = `${manaPercent}%`;
            playerManaText.textContent = `${this.game.player.mana}/${this.game.player.maxMana}`;
        }
        
        if (this.currentEnemy) {
            if (enemyHealthFill && enemyHealthText) {
                const enemyHealthPercent = (this.currentEnemy.health / this.currentEnemy.maxHealth) * 100;
                enemyHealthFill.style.width = `${enemyHealthPercent}%`;
                enemyHealthText.textContent = `${this.currentEnemy.health}/${this.currentEnemy.maxHealth}`;
            }
            
            if (enemyName) {
                enemyName.textContent = this.currentEnemy.name;
            }
        }
        
        this.updateBattleButtons();
    }

    updateBattleButtons() {
        const attackBtn = document.getElementById('attack-btn');
        const defendBtn = document.getElementById('defend-btn');
        const magicBtn = document.getElementById('magic-btn');
        const itemBtn = document.getElementById('item-btn');
        
        const isPlayerTurnAndActive = this.isPlayerTurn && this.isActive;
        
        if (attackBtn) attackBtn.disabled = !isPlayerTurnAndActive;
        if (defendBtn) defendBtn.disabled = !isPlayerTurnAndActive;
        if (magicBtn) {
            magicBtn.disabled = !isPlayerTurnAndActive || this.game.player.mana < 10;
        }
        if (itemBtn) itemBtn.disabled = !isPlayerTurnAndActive;
    }

    showBattleEffect(type) {
        const playerSprite = document.getElementById('player-sprite');
        const enemySprite = document.getElementById('enemy-sprite');
        
        switch (type) {
            case 'critical':
                if (enemySprite) {
                    enemySprite.style.animation = 'none';
                    enemySprite.offsetHeight;
                    enemySprite.style.animation = 'shake 0.5s ease';
                    enemySprite.style.filter = 'brightness(1.5) hue-rotate(60deg)';
                    setTimeout(() => {
                        enemySprite.style.filter = '';
                        enemySprite.style.animation = 'bounce 2s infinite';
                    }, 500);
                }
                break;
                
            case 'magic':
                if (enemySprite) {
                    enemySprite.style.filter = 'brightness(1.2) hue-rotate(240deg)';
                    setTimeout(() => {
                        enemySprite.style.filter = '';
                    }, 800);
                }
                break;
                
            case 'defend':
                if (playerSprite) {
                    playerSprite.style.filter = 'brightness(1.3) sepia(0.3)';
                    setTimeout(() => {
                        playerSprite.style.filter = '';
                    }, 1000);
                }
                break;
                
            case 'heal':
                if (playerSprite) {
                    playerSprite.style.filter = 'brightness(1.4) hue-rotate(120deg)';
                    setTimeout(() => {
                        playerSprite.style.filter = '';
                    }, 800);
                }
                break;
                
            case 'victory':
                if (enemySprite) {
                    enemySprite.style.animation = 'fadeOut 1s ease';
                    enemySprite.style.opacity = '0.3';
                }
                break;
        }
    }

    update() {
    }
}

const shakeKeyframes = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}

@keyframes fadeOut {
    from { opacity: 1; transform: scale(1); }
    to { opacity: 0.3; transform: scale(0.8); }
}
`;

if (!document.getElementById('battle-animations')) {
    const style = document.createElement('style');
    style.id = 'battle-animations';
    style.textContent = shakeKeyframes;
    document.head.appendChild(style);
}