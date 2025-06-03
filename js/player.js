class Player {
    constructor(data) {
        this.name = data.name || 'Aventurero';
        this.level = data.level || 1;
        this.experience = data.experience || 0;
        this.experienceToNext = data.experienceToNext || 100;
        
        this.health = data.health || 100;
        this.maxHealth = data.maxHealth || 100;
        this.mana = data.mana || 50;
        this.maxMana = data.maxMana || 50;
        
        this.strength = data.strength || 10;
        this.dexterity = data.dexterity || 10;
        this.intelligence = data.intelligence || 10;
        this.vitality = data.vitality || 10;
        
        this.gold = data.gold || 0;
        this.inventory = data.inventory || [];
        this.equipment = data.equipment || {
            weapon: null,
            armor: null,
            accessory: null
        };
        
        this.calculateStats();
    }

    calculateStats() {
        this.baseAttack = this.strength * 2 + this.level;
        this.baseDefense = this.vitality + Math.floor(this.level / 2);
        this.criticalChance = Math.min(5 + this.dexterity, 50);
        this.magicPower = this.intelligence * 1.5 + this.level;
        
        if (this.equipment.weapon) {
            this.baseAttack += this.equipment.weapon.attack || 0;
        }
        if (this.equipment.armor) {
            this.baseDefense += this.equipment.armor.defense || 0;
        }
    }

    addExperience(amount) {
        this.experience += amount;
        
        let leveledUp = false;
        while (this.experience >= this.experienceToNext) {
            this.experience -= this.experienceToNext;
            this.levelUp();
            leveledUp = true;
        }
        
        if (window.game && window.game.ui) {
            window.game.ui.updatePlayerDisplay();
            if (leveledUp) {
                this.onLevelUp();
            }
        }
        
        return leveledUp;
    }

    levelUp() {
        this.level++;
        
        const healthIncrease = 15 + Math.floor(this.vitality / 2);
        const manaIncrease = 8 + Math.floor(this.intelligence / 3);
        
        this.maxHealth += healthIncrease;
        this.maxMana += manaIncrease;
        this.health = this.maxHealth;
        this.mana = this.maxMana;
        
        this.experienceToNext = Math.floor(this.experienceToNext * 1.2);
        
        this.strength += 1;
        this.dexterity += 1;
        this.intelligence += 1;
        this.vitality += 1;
        
        this.calculateStats();
        
        console.log(`🎉 ¡Nivel ${this.level}! +${healthIncrease} HP, +${manaIncrease} MP`);
    }

    onLevelUp() {
        if (window.game && window.game.ui) {
            window.game.ui.showNotification(`🎉 ¡NIVEL ${this.level}! ¡Estadísticas mejoradas!`, 'legendary');
            
            const playerSprite = document.getElementById('player-sprite');
            if (playerSprite) {
                const rect = playerSprite.getBoundingClientRect();
                window.game.createParticleEffect(
                    rect.left + rect.width / 2,
                    rect.top + rect.height / 2,
                    '#ffd700',
                    20
                );
            }
        }
    }

    takeDamage(amount) {
        const actualDamage = Math.max(1, amount - this.baseDefense);
        this.health = Math.max(0, this.health - actualDamage);
        
        if (window.game && window.game.ui) {
            window.game.ui.updatePlayerDisplay();
        }
        
        return actualDamage;
    }

    heal(amount) {
        const healAmount = Math.min(amount, this.maxHealth - this.health);
        this.health += healAmount;
        
        if (window.game && window.game.ui) {
            window.game.ui.updatePlayerDisplay();
        }
        
        return healAmount;
    }

    useMana(amount) {
        if (this.mana >= amount) {
            this.mana -= amount;
            if (window.game && window.game.ui) {
                window.game.ui.updatePlayerDisplay();
            }
            return true;
        }
        return false;
    }

    restoreMana(amount) {
        const restoreAmount = Math.min(amount, this.maxMana - this.mana);
        this.mana += restoreAmount;
        
        if (window.game && window.game.ui) {
            window.game.ui.updatePlayerDisplay();
        }
        
        return restoreAmount;
    }

    addGold(amount) {
        this.gold += amount;
        
        if (window.game) {
            window.game.gameData.progress.totalGold += amount;
            if (window.game.ui) {
                window.game.ui.updatePlayerDisplay();
                window.game.ui.updateStats();
            }
        }
    }

    spendGold(amount) {
        if (this.gold >= amount) {
            this.gold -= amount;
            if (window.game && window.game.ui) {
                window.game.ui.updatePlayerDisplay();
            }
            return true;
        }
        return false;
    }

    addItem(item) {
        this.inventory.push(item);
        
        if (window.game && window.game.ui) {
            window.game.ui.showNotification(`¡Objeto obtenido! ${item.name}`, 'success');
        }
    }

    removeItem(itemIndex) {
        if (itemIndex >= 0 && itemIndex < this.inventory.length) {
            return this.inventory.splice(itemIndex, 1)[0];
        }
        return null;
    }

    equipItem(item) {
        if (!item.type) return false;
        
        const currentEquipped = this.equipment[item.type];
        if (currentEquipped) {
            this.addItem(currentEquipped);
        }
        
        this.equipment[item.type] = item;
        this.calculateStats();
        
        if (window.game && window.game.ui) {
            window.game.ui.showNotification(`¡${item.name} equipado!`, 'success');
            window.game.ui.updatePlayerDisplay();
        }
        
        return true;
    }

    unequipItem(slot) {
        const item = this.equipment[slot];
        if (item) {
            this.equipment[slot] = null;
            this.addItem(item);
            this.calculateStats();
            
            if (window.game && window.game.ui) {
                window.game.ui.showNotification(`${item.name} desequipado`, 'info');
                window.game.ui.updatePlayerDisplay();
            }
            
            return true;
        }
        return false;
    }

    getAttackDamage() {
        const baseDamage = this.baseAttack + Math.floor(Math.random() * 5);
        const isCritical = Math.random() * 100 < this.criticalChance;
        
        if (isCritical) {
            return {
                damage: Math.floor(baseDamage * 1.5),
                critical: true
            };
        }
        
        return {
            damage: baseDamage,
            critical: false
        };
    }

    getMagicDamage() {
        if (!this.useMana(10)) {
            return null;
        }
        
        const baseDamage = this.magicPower + Math.floor(Math.random() * 8);
        return {
            damage: baseDamage,
            magical: true
        };
    }

    defend() {
        this.isDefending = true;
        return Math.floor(this.baseDefense * 1.5);
    }

    isAlive() {
        return this.health > 0;
    }

    resetDefense() {
        this.isDefending = false;
    }

    getStats() {
        return {
            level: this.level,
            health: this.health,
            maxHealth: this.maxHealth,
            mana: this.mana,
            maxMana: this.maxMana,
            experience: this.experience,
            experienceToNext: this.experienceToNext,
            attack: this.baseAttack,
            defense: this.baseDefense,
            criticalChance: this.criticalChance,
            magicPower: this.magicPower,
            strength: this.strength,
            dexterity: this.dexterity,
            intelligence: this.intelligence,
            vitality: this.vitality,
            gold: this.gold
        };
    }

    getData() {
        return {
            name: this.name,
            level: this.level,
            experience: this.experience,
            experienceToNext: this.experienceToNext,
            health: this.health,
            maxHealth: this.maxHealth,
            mana: this.mana,
            maxMana: this.maxMana,
            strength: this.strength,
            dexterity: this.dexterity,
            intelligence: this.intelligence,
            vitality: this.vitality,
            gold: this.gold,
            inventory: this.inventory,
            equipment: this.equipment
        };
    }

    fullRestore() {
        this.health = this.maxHealth;
        this.mana = this.maxMana;
        
        if (window.game && window.game.ui) {
            window.game.ui.updatePlayerDisplay();
        }
    }

    canUsePotion() {
        return this.health < this.maxHealth;
    }

    useHealthPotion() {
        if (!this.canUsePotion()) return false;
        
        const healAmount = Math.floor(this.maxHealth * 0.3);
        this.heal(healAmount);
        
        if (window.game && window.game.ui) {
            window.game.ui.showNotification(`+${healAmount} HP restaurados`, 'success');
        }
        
        return true;
    }

    useManaPotion() {
        if (this.mana >= this.maxMana) return false;
        
        const restoreAmount = Math.floor(this.maxMana * 0.5);
        this.restoreMana(restoreAmount);
        
        if (window.game && window.game.ui) {
            window.game.ui.showNotification(`+${restoreAmount} MP restaurados`, 'success');
        }
        
        return true;
    }
}