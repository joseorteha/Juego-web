const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverDiv = document.getElementById('gameOver');
const startMenuDiv = document.getElementById('startMenu');
const scoreDisplay = document.getElementById('score');
const pauseButton = document.getElementById('pauseButton');

// Configuración del juego
const width = canvas.width;
const height = canvas.height;

// Cargar imágenes
const playerImage = new Image();
playerImage.src = 'imgs/hellokitty.jpg';

const bulletImage = new Image();
bulletImage.src = 'imgs/corazón.png';

const enemyImage = new Image();
enemyImage.src = 'imgs/mymelody.png';

// Cargar el sonido para golpear un enemigo
const hitSound = new Audio('sounds/hit.mp3'); // Asegúrate de que la ruta sea correcta

// Función para reproducir el sonido al golpear un enemigo
function playHitSound() {
    hitSound.play();
}

// Jugador
let player = {
    width: 60,
    height: 60,
    x: width / 2 - 30,
    y: height - 70,
    speed: 15,
    image: playerImage
};

// Bala
let bullets = [];
const bulletSpeed = 10;

// Enemigo
let enemies = [];
const enemySpeed = 5;

// Control de teclas
const keysPressed = {};

// Estado del juego
let isGameOver = false;
let isPaused = false;
let score = 0;

function startGame() {
    startMenuDiv.style.display = 'none';
    scoreDisplay.style.display = 'block';
    pauseButton.style.display = 'block';
    gameLoop();
}

function pauseGame() {
    isPaused = !isPaused;
    if (!isPaused) {
        gameLoop();
    }
}

document.addEventListener('keydown', (event) => {
    keysPressed[event.key] = true;
    if (event.key === ' ' && !isGameOver && !isPaused) {
        bullets.push({
            x: player.x + player.width / 2 - 25,
            y: player.y,
            width: 50,
            height: 50,
            image: bulletImage
        });
    }
});

document.addEventListener('keyup', (event) => {
    keysPressed[event.key] = false;
});

function restartGame() {
    isGameOver = false;
    gameOverDiv.style.display = 'none';
    score = 0;
    scoreDisplay.textContent = `Puntos: ${score}`;
    player = {
        width: 60,
        height: 60,
        x: width / 2 - 30,
        y: height - 70,
        speed: 15,
        image: playerImage
    };
    bullets = [];
    enemies = [];
    startMenuDiv.style.display = 'block';
    scoreDisplay.style.display = 'none';
    pauseButton.style.display = 'none';

    // Eliminar el letrero de propuesta si existe
    const proposalDiv = document.getElementById('proposal');
    if (proposalDiv) {
        proposalDiv.remove();
    }

    // Eliminar confeti y corazones
    document.querySelectorAll('.confetti, .heart').forEach(element => element.remove());
}

// Actualizar posición del jugador
function updatePlayer() {
    if (keysPressed['ArrowLeft'] && player.x > 0) {
        player.x -= player.speed;
    }
    if (keysPressed['ArrowRight'] && player.x + player.width < width) {
        player.x += player.speed;
    }
}

// Actualizar posición de las balas
function updateBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y -= bulletSpeed;
        if (bullet.y + bullet.height < 0) {
            bullets.splice(index, 1);
        }
    });
}

// Generar enemigos aleatorios
function generateEnemies() {
    if (Math.random() < 0.02) {
        enemies.push({
            x: Math.random() * (width - 60),
            y: 0,
            width: 60,
            height: 60,
            image: enemyImage
        });
    }
}

// Actualizar posición de los enemigos
function updateEnemies() {
    enemies.forEach((enemy, index) => {
        enemy.y += enemySpeed;
        if (enemy.y > height) {
            enemies.splice(index, 1);
        }
    });
}

// Detección de colisiones
function checkCollisions() {
    bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                bullets.splice(bulletIndex, 1);
                enemies.splice(enemyIndex, 1);
                score += 1;
                scoreDisplay.textContent = `Puntos: ${score}`;
                
                // Reproducir sonido al golpear un enemigo
                playHitSound();

                if (score === 10) {
                    showProposal();
                }
            }
        });
    });

    enemies.forEach((enemy) => {
        if (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y
        ) {
            isGameOver = true;
            gameOverDiv.style.display = 'block';
        }
    });
}

// Dibujar el jugador
function drawPlayer() {
    ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
}

// Dibujar las balas
function drawBullets() {
    bullets.forEach((bullet) => {
        ctx.drawImage(bullet.image, bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

// Dibujar los enemigos
function drawEnemies() {
    enemies.forEach((enemy) => {
        ctx.drawImage(enemy.image, enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

// Mostrar propuesta de matrimonio
function showProposal() {
    isGameOver = true; // Detener el juego
    const proposalDiv = document.createElement('div');
    proposalDiv.id = 'proposal';
    proposalDiv.style.position = 'absolute';
    proposalDiv.style.top = '50%';
    proposalDiv.style.left = '50%';
    proposalDiv.style.transform = 'translate(-50%, -50%)';
    proposalDiv.style.background = 'rgba(0, 0, 0, 0.8)';
    proposalDiv.style.color = 'white';
    proposalDiv.style.padding = '20px';
    proposalDiv.style.borderRadius = '10px';
    proposalDiv.style.textAlign = 'center';
    proposalDiv.style.animation = 'float 3s ease-in-out infinite';
    proposalDiv.innerHTML = '<h1>¿ Quieres ser mi novia?</h1><button onclick="restartGame()">Reiniciar</button>';
    document.body.appendChild(proposalDiv);

    // Animación de confeti y corazones
    const confettiCount = 100;
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.position = 'absolute';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.background = 'red';
        confetti.style.borderRadius = '50%';
        confetti.style.top = `${Math.random() * 100}%`;
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear infinite`;
        document.body.appendChild(confetti);
    }

    const heartCount = 20;
    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.style.position = 'absolute';
        heart.style.width = '20px';
        heart.style.height = '20px';
        heart.style.background = 'pink';
        heart.style.borderRadius = '50%';
        heart.style.top = `${Math.random() * 100}%`;
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.animation = `float ${Math.random() * 3 + 2}s linear infinite`;
        document.body.appendChild(heart);
    }
}

// Bucle principal del juego
function gameLoop() {
    if (isGameOver || isPaused) return;

    ctx.clearRect(0, 0, width, height);
    updatePlayer();
    updateBullets();
    generateEnemies();
    updateEnemies();
    checkCollisions();
    drawPlayer();
    drawBullets();
    drawEnemies();
    requestAnimationFrame(gameLoop);
}

// Mostrar el menú de inicio al cargar la página
startMenuDiv.style.display = 'block';
scoreDisplay.style.display = 'none';
pauseButton.style.display = 'none';
