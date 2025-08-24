const spillBrett = document.getElementById('spillBrett');
let ctx = spillBrett.getContext("2d")
const scoreHtml = document.getElementById('score');

var ball = {
    x: 150,
    y: 140,
    radius: 1,
    speedX: Math.random(),
    speedY: - 2
};

var rectangles = [];
var rectangleWidth = 20;
var rectangleHeight = 7;

var canvasWidth = spillBrett.width;
var canvasHeight = spillBrett.height;
var rectangleSpacing = 5;
var perLine = Math.floor(canvasWidth / (rectangleWidth + rectangleSpacing));

function createRectangles() {
    let rectangeInput = document.getElementById('rectangleInput').value;
    let numberOfRectangles = rectangeInput ? parseInt(rectangeInput) : 48;

    rectangles = [];  // Clear the rectangles array

    for (var i = 0; i < numberOfRectangles; i++) {
        var x = ((i % perLine) * (rectangleWidth + rectangleSpacing)) + 2;
        var y = Math.floor(i / perLine) * (rectangleHeight + rectangleSpacing) + 10;
        rectangles.push({
            x: x,
            y: y,
            width: rectangleWidth,
            height: rectangleHeight
        });
    }
    drawRectangles()
}

function drawRectangles() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    for (var i = 0; i < rectangles.length; i++) {
        ctx.beginPath();
        ctx.rect(rectangles[i].x, rectangles[i].y, rectangles[i].width, rectangles[i].height);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }
}

var playBar = {
    x: 0,
    y: canvasHeight - 3,
    width: 15,
    height: 3
};

document.addEventListener('mousemove', (event) => {
    var rect = spillBrett.getBoundingClientRect();
    var scaleX = spillBrett.width / rect.width;    // relationship bitmap vs. element for X

    playBar.x = (event.clientX - rect.left - 25) * scaleX;   // scale mouse coordinates after they have

    if (playBar.x < 0) {
        playBar.x = 0;
    } else if (playBar.x > canvasWidth - playBar.width) {
        playBar.x = canvasWidth - playBar.width;
    }
});

function drawplayBar() {
    ctx.beginPath();
    ctx.rect(playBar.x, playBar.y, playBar.width, playBar.height);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
}


let score = 0;
function updateScore() {
    scoreHtml.innerHTML = score;
}

function draw() {
    // Tøm canvas
    ctx.clearRect(0, 0, spillBrett.width, spillBrett.height);

    // Tegn ball og rektangler
    createRectangles();
    drawplayBar()
    drawBall();
    updateScore()

    // Oppdater ballens posisjon
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Håndter kollisjon med vegger
    if (ball.x + ball.radius > spillBrett.width || ball.x - ball.radius < 0) {
        ball.speedX = -ball.speedX;
    }

    if (ball.y - ball.radius < 0) {
        ball.speedY = -ball.speedY;
    }

    if (ball.y + ball.radius > spillBrett.height + 2) {
        alert("GAME OVER");
        return;
    }

    // Håndter kollisjon med playBar
    if (
        ball.x > playBar.x &&
        ball.x < playBar.x + playBar.width &&
        ball.y > playBar.y &&
        ball.y < playBar.y + playBar.height
    ) {
        ball.speedY = -ball.speedY;
    }

    // Håndter kollisjon med rektangler
    for (var i = 0; i < rectangles.length; i++) {
        if (
            ball.x > rectangles[i].x &&
            ball.x < rectangles[i].x + rectangles[i].width &&
            ball.y > rectangles[i].y &&
            ball.y < rectangles[i].y + rectangles[i].height
            ) {
                // Check which side of the rectangle the ball hit
                var prevBallX = ball.x - ball.speedX;
                var prevBallY = ball.y - ball.speedY;
                if (prevBallY < rectangles[i].y || prevBallY > rectangles[i].y + rectangles[i].height) {
                    ball.speedY = -ball.speedY;
                } else if (prevBallX < rectangles[i].x || prevBallX > rectangles[i].x + rectangles[i].width) {
                    ball.speedX = -ball.speedX;
                }
        
                rectangles.splice(i, 1); // Fjern rektangelet ved kollisjon
                score += 1;
                console.log(rectangles.length)
            }
    }

    requestAnimationFrame(draw);
}

let spillStartet = false;

addEventListener("keydown", function (event) {
    if (event.key === 'Enter' && !spillStartet) {
        // Start hovedspillet
        draw();
        rectangleInput.disabled = true;
        spillStartet = true;
    }
});

createRectangles();
drawplayBar();
drawBall();