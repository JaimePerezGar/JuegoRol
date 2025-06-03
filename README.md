# 🎮 Realm Quest - RPG Web

Un juego de rol web completo y adictivo que combina la nostalgia de los RPGs clásicos con mecánicas modernas y un diseño visual impactante.

## 🌟 Características

### 🎯 Mecánicas de Juego Clásicas
- Sistema de niveles con experiencia (XP) y progresión satisfactoria
- Atributos básicos: Fuerza, Destreza, Inteligencia, Vitalidad
- Sistema de combate por turnos estratégico
- Inventario con equipo que afecta las estadísticas
- Misiones con recompensas progresivas
- Exploración de diferentes áreas/mazmorras

### ⚡ Elementos Modernos y Adictivos
- Feedback visual inmediato: animaciones de daño, level up, looting
- Sistema de logros desbloqueables
- Daily rewards y streaks de juego
- Micro-progresión: múltiples barras de progreso simultáneas
- Random drops con rareza visual (común, raro, épico, legendario)
- Auto-save constante

### 🎨 Diseño Visual
- Paleta de colores vibrante con gradientes modernos
- Tipografía: mezcla de fuentes pixel-art y sans-serif modernas
- Iconografía: sprites pixelados con toques de neón/glow
- Animaciones suaves: micro-interacciones y transiciones
- Partículas y efectos: brillos, explosiones, trails
- Dark mode con acentos de color

### 📱 Compatibilidad
- Responsive design optimizado para desktop y móvil
- Controles táctiles para dispositivos móviles
- Performance optimizado para carga rápida
- Compatible con todos los navegadores modernos

## 🚀 Instalación y Despliegue

### Despliegue en Coolify (Recomendado)

1. **Preparación del repositorio:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Realm Quest RPG"
   git branch -M main
   git remote add origin [tu-repositorio-github]
   git push -u origin main
   ```

2. **Configuración en Coolify:**
   - Accede a tu panel de Coolify
   - Crea un nuevo proyecto → "Docker Compose"
   - Conecta tu repositorio de GitHub
   - Coolify detectará automáticamente el `docker-compose.yml`
   - Configura tu dominio (opcional)
   - Deploy!

3. **Configuración manual:**
   - Repository: Tu repositorio de GitHub
   - Build Pack: Docker Compose
   - Port: 80
   - Health Check: `/health`

### Despliegue en Netlify (Alternativo)

1. **Despliegue automático:**
   - Ve a [Netlify](https://netlify.com)
   - Conecta tu repositorio de GitHub
   - Netlify detectará automáticamente la configuración desde `netlify.toml`
   - El sitio se desplegará automáticamente

2. **Configuración manual:**
   - Build command: `echo 'No build process needed'`
   - Publish directory: `.` (directorio raíz)

### Ejecución Local

#### Opción 1: Archivo directo
Simplemente abre `index.html` en tu navegador web preferido.

#### Opción 2: Servidor local (recomendado)
```bash
# Con Python 3
python -m http.server 8000

# Con Node.js
npx serve .

# Con PHP
php -S localhost:8000
```

#### Opción 3: Docker local
```bash
# Construir imagen
docker build -t realm-quest .

# Ejecutar contenedor
docker run -p 8080:80 realm-quest

# O usar docker-compose
docker-compose up
```

## 🎮 Cómo Jugar

### Primeros Pasos
1. **Carga inicial:** El juego se carga automáticamente al abrir la página
2. **Dashboard:** Consulta tu progreso diario y estadísticas
3. **Batalla rápida:** Usa el botón de "Batalla Rápida" para comenzar a ganar experiencia
4. **Explorar:** Visita diferentes ubicaciones para enfrentar enemigos específicos

### Controles
- **Navegación:** Usa el menú lateral izquierdo para cambiar entre secciones
- **Combate:** Selecciona acciones durante las batallas (Atacar, Defender, Magia, Objeto)
- **Inventario:** Haz clic en objetos para equiparlos
- **Móvil:** Todos los controles son táctiles

### Progresión
- **Experiencia:** Gana XP en batallas para subir de nivel
- **Oro:** Úsalo para comprar objetos (próximamente)
- **Equipo:** Encuentra y equipa armas, armaduras y accesorios
- **Logros:** Desbloquea logros completando objetivos específicos

## 🏗️ Estructura del Proyecto

```
JuegoRol/
├── index.html              # Página principal
├── styles/
│   └── main.css            # Estilos principales
├── js/
│   ├── game.js             # Lógica principal del juego
│   ├── player.js           # Sistema del jugador
│   ├── battle.js           # Sistema de combate
│   └── ui.js               # Interfaz de usuario
├── Dockerfile              # Configuración Docker
├── docker-compose.yml      # Docker Compose para Coolify
├── nginx.conf              # Configuración Nginx
├── coolify.yml             # Configuración específica Coolify
├── netlify.toml            # Configuración de Netlify
├── _redirects              # Redirects para SPA
├── .dockerignore           # Archivos ignorados por Docker
├── .gitignore              # Archivos ignorados por Git
└── README.md               # Este archivo
```

## 🛠️ Tecnologías Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript ES6+
- **Estilos:** CSS Grid, Flexbox, Custom Properties
- **Almacenamiento:** LocalStorage para guardado de partida
- **Fuentes:** Google Fonts (Press Start 2P, Inter)
- **Contenedorización:** Docker + Nginx
- **Despliegue:** Coolify, Netlify
- **Control de versiones:** Git

## 🎨 Personalizaciones

### Modificar Enemigos
Edita el array de enemigos en `js/game.js`:
```javascript
const enemies = [
    { name: 'Nuevo Enemigo', health: 50, attack: 15, experience: 25, gold: 10 }
];
```

### Agregar Nuevas Áreas
Añade ubicaciones en el objeto `locations` en `js/game.js`:
```javascript
const locations = {
    nueva_area: {
        name: 'Nueva Área',
        enemies: [/* array de enemigos */]
    }
};
```

### Modificar Rareza de Objetos
Ajusta las probabilidades en `generateLoot()` en `js/battle.js`:
```javascript
if (rarityRoll < 0.01) { // 1% legendario
    // lógica para objetos legendarios
}
```

## 🔧 Características Técnicas

### Rendimiento
- **Lazy Loading:** Carga progresiva de contenido
- **Optimización CSS:** Uso eficiente de CSS custom properties
- **Gestión de memoria:** Limpieza automática de elementos temporales
- **Guardado automático:** Cada 30 segundos

### Responsive Design
- **Breakpoints:** 768px para móvil
- **Layout adaptativo:** Grid y Flexbox responsive
- **Controles táctiles:** Optimizado para touch

### Seguridad
- **CSP:** Content Security Policy configurado
- **Headers:** Headers de seguridad en Netlify
- **Validación:** Validación de datos del jugador

## 🚀 Próximas Características

- [ ] Sistema de tienda
- [ ] Más áreas y enemigos
- [ ] Sistema de gremios
- [ ] Eventos especiales
- [ ] Modo multijugador básico
- [ ] Sistema de crafting expandido
- [ ] Música y efectos de sonido
- [ ] Tutorial interactivo

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Siéntete libre de usarlo, modificarlo y distribuirlo.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios mayores:

1. Fork el proyecto
2. Crea una rama para tu característica (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Añadir nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📞 Soporte

Si encuentras algún bug o tienes sugerencias, por favor abre un issue en GitHub.

---

**¡Disfruta tu aventura en Realm Quest! ⚔️✨**