# 📦 Cómo obtener Realm Quest RPG

## Opción 1: Descargar ZIP directo

1. **Desde tu computadora actual:**
   - El juego está en: `/Users/skllz/Documents/Claude/JuegoRol/`
   - Puedes comprimir toda la carpeta en un ZIP

2. **Comando para crear ZIP:**
   ```bash
   cd /Users/skllz/Documents/Claude
   zip -r realm-quest.zip JuegoRol/
   ```

## Opción 2: Subir a GitHub (Recomendado)

1. **Crear repositorio en GitHub:**
   ```bash
   cd /Users/skllz/Documents/Claude/JuegoRol
   git init
   git add .
   git commit -m "Realm Quest RPG - Juego completo"
   git branch -M main
   ```

2. **Crear repositorio en GitHub.com:**
   - Ve a https://github.com/new
   - Nombre: `realm-quest-rpg`
   - Descripción: "Juego de rol web completo con mecánicas RPG clásicas"
   - Público o Privado (tu elección)
   - NO inicialices con README (ya tenemos uno)

3. **Conectar y subir:**
   ```bash
   git remote add origin https://github.com/TU-USUARIO/realm-quest-rpg.git
   git push -u origin main
   ```

4. **Descargar desde GitHub:**
   - Botón verde "Code" → "Download ZIP"
   - O clonar: `git clone https://github.com/TU-USUARIO/realm-quest-rpg.git`

## Opción 3: Transferencia directa

Si quieres mover los archivos a otro lugar:

```bash
# Copiar a otro directorio
cp -r /Users/skllz/Documents/Claude/JuegoRol /ruta/destino/

# O crear un archivo tar.gz
tar -czf realm-quest.tar.gz -C /Users/skllz/Documents/Claude JuegoRol/
```

## 📁 Contenido del juego

El juego incluye:
- `index.html` - Archivo principal
- `styles/main.css` - Todos los estilos
- `js/` - Toda la lógica del juego
  - `game.js` - Motor principal
  - `player.js` - Sistema de jugador
  - `battle.js` - Sistema de combate
  - `ui.js` - Interfaz de usuario
- Archivos Docker para Coolify
- Configuración para Netlify
- README completo con instrucciones

## 🎮 Para jugar localmente

Una vez descargado:
1. Abre `index.html` en tu navegador
2. ¡Listo para jugar!

## 🚀 Para deployment

El juego está listo para:
- **Coolify**: Usa los archivos Docker incluidos
  - Si el puerto 80 está ocupado, usa `docker-compose.coolify.yml`
  - O cambia el puerto en `docker-compose.yml` (línea 10)
- **Netlify**: Arrastra la carpeta al dashboard de Netlify
- **Cualquier hosting estático**: Sube todos los archivos

### Solución de problemas en Coolify

Si aparece el error "port is already allocated":
1. Usa el archivo `docker-compose.coolify.yml` en lugar del `docker-compose.yml`
2. O edita el puerto en `docker-compose.yml` (cambiar `"80:80"` a `"8080:80"`)
3. Coolify manejará automáticamente el proxy reverso

## 💾 Tamaño total

- Aproximadamente 50KB (sin comprimir)
- ~15KB comprimido en ZIP
- Muy ligero y rápido de transferir