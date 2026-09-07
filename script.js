// Canvas and context
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Paddle dimensions
const paddleWidth = 10;
const paddleHeight = 80;

// Ball dimensions
const ballRadius = 8;

// Game objects
const playerPaddle = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: 6
};

const computerPaddle = {
    x: canvas.width - paddleWidth - 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: 4
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    dx: 5,
    dy: 5,
    radius: ballRadius,
    speed: 5
};

const scores = {
    player: 0,
    computer: 0
};

// Keyboard input
const keys = {
    ArrowUp: false,
    ArrowDown: false
};

// Mouse position
let mouseY = canvas.height / 2;

// Event listeners
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        keys[e.key] = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        keys[e.key] = false;
    }
});

document.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseY = e.clientY - rect.top;
});

// Update player paddle position
function updatePlayerPaddle() {
    // Use mouse position
    playerPaddle.y = mouseY - playerPaddle.height / 2;

    // Also allow arrow keys
    if (keys.ArrowUp && playerPaddle.y > 0) {
        playerPaddle.y -= playerPaddle.speed;
    }
    if (keys.ArrowDown && playerPaddle.y < canvas.height - playerPaddle.height) {
        playerPaddle.y += playerPaddle.speed;
    }

    // Keep paddle within bounds
    if (playerPaddle.y < 0) {
        playerPaddle.y = 0;
    }
    if (playerPaddle.y + playerPaddle.height > canvas.height) {
        playerPaddle.y = canvas.height - playerPaddle.height;
    }
}

// Update computer paddle position (AI)
function updateComputerPaddle() {
    const computerPaddleCenter = computerPaddle.y + computerPaddle.height / 2;
    
    // Simple AI: follow the ball
    if (computerPaddleCenter < ball.y - 35) {
        computerPaddle.y += computerPaddle.speed;
    } else if (computerPaddleCenter > ball.y + 35) {
        computerPaddle.y -= computerPaddle.speed;
    }

    // Keep paddle within bounds
    if (computerPaddle.y < 0) {
        computerPaddle.y = 0;
    }
    if (computerPaddle.y + computerPaddle.height > canvas.height) {
        computerPaddle.y = canvas.height - computerPaddle.height;
    }
}

// Update ball position
function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collision (top and bottom)
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy = -ball.dy;
        ball.y = ball.y - ball.radius < 0 ? ball.radius : canvas.height - ball.radius;
    }

    // Paddle collision
    if (
        ball.x - ball.radius < playerPaddle.x + playerPaddle.width &&
        ball.y > playerPaddle.y &&
        ball.y < playerPaddle.y + playerPaddle.height
    ) {
        ball.dx = -ball.dx;
        ball.x = playerPaddle.x + playerPaddle.width + ball.radius;
        
        // Add spin based on paddle position
        const collidePoint = ball.y - (playerPaddle.y + playerPaddle.height / 2);
        ball.dy = (collidePoint / (playerPaddle.height / 2)) * ball.speed;
    }

    // Computer paddle collision
    if (
        ball.x + ball.radius > computerPaddle.x &&
        ball.y > computerPaddle.y &&
        ball.y < computerPaddle.y + computerPaddle.height
    ) {
        ball.dx = -ball.dx;
        ball.x = computerPaddle.x - ball.radius;
        
        // Add spin based on paddle position
        const collidePoint = ball.y - (computerPaddle.y + computerPaddle.height / 2);
        ball.dy = (collidePoint / (computerPaddle.height / 2)) * ball.speed;
    }

    // Score points
    if (ball.x - ball.radius < 0) {
        scores.computer++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        scores.player++;
        resetBall();
    }
}

// Reset ball to center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
    ball.dy = (Math.random() - 0.5) * ball.speed;
}

// Draw rectangle
function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

// Draw circle
function drawCircle(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

// Draw center line
function drawCenterLine() {
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.3)';
    ctx.setLineDash([10, 10]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

// Render game
function draw() {
    // Clear canvas
    drawRect(0, 0, canvas.width, canvas.height, '#0f172a');

    // Draw center line
    drawCenterLine();

    // Draw paddles
    drawRect(playerPaddle.x, playerPaddle.y, playerPaddle.width, playerPaddle.height, '#fbbf24');
    drawRect(computerPaddle.x, computerPaddle.y, computerPaddle.width, computerPaddle.height, '#fbbf24');

    // Draw ball
    drawCircle(ball.x, ball.y, ball.radius, '#fbbf24');
}

// Update scores display
function updateScoresDisplay() {
    document.getElementById('playerScore').textContent = scores.player;
    document.getElementById('computerScore').textContent = scores.computer;
}

// Game loop
function gameLoop() {
    updatePlayerPaddle();
    updateComputerPaddle();
    updateBall();
    draw();
    updateScoresDisplay();

    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();