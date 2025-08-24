let spillBrett = document.getElementById('spillBrett');
let targetBrett = document.getElementById('targetBrett')

let plattform = document.createElement('div');
plattform.id = 'plattform';
spillBrett.appendChild(plattform);

let targets = [];
for (i = 0; i < 56; i++) {
    let target = document.createElement('div');
    target.className = 'target';
    targetBrett.appendChild(target);
    targets.push(target);
}

let ball = document.createElement('div');
ball.id = 'ball';
spillBrett.appendChild(ball);

document.addEventListener('mousemove', (event) => {
    if (event.clientX >= 295 && event.clientX <= 1145) {
        plattform.style.left = `${event.clientX - 295}px`;
    } else if (event.clientX < 295) {
        plattform.style.left = '0px';
    } else if (event.clientX > 1145) {
        plattform.style.left = '850px';
    };
});

let spillStartet = false;
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !spillStartet) {
        spillStartet = true;
        startBall();
    };
});

let ballFart = 0;
let ballFartY = 2;
let reversY = 1;
let reversX = 1;
function startBall() {
    let ballPosisjon = {
        x: 445,
        y: 580
    };

    function animasjon() {
        ballPosisjon.y -= (ballFartY + ballFart) * reversY;
        ballPosisjon.x += 3.3 * reversX;
        ball.style.top = `${ballPosisjon.y}px`;
        ball.style.left = `${ballPosisjon.x}px`;

        let ballRect = ball.getBoundingClientRect();
        let plattformRect = plattform.getBoundingClientRect();

        if (targets.some((target, index) => {
            let targetRect = target.getBoundingClientRect();
            let ballTouchesLeftSide = ballRect.right >= targetRect.left && ballRect.left <= targetRect.left;
            let ballTouchesRightSide = ballRect.left <= targetRect.right && ballRect.right >= targetRect.right;
        
            if (
                ballRect.top < targetRect.bottom &&
                ballRect.bottom > targetRect.top &&
                (ballTouchesLeftSide || ballTouchesRightSide)
            ) {
                console.log('Treff på sidene av target. Element: ', target);
                
                target.style.visibility = 'hidden';
                sjekkTarget()
                
                reversX *= -1;
                return true;
            };
        })) {
            requestAnimationFrame(animasjon);
        } else if (targets.some((target, index) => {
            let targetRect = target.getBoundingClientRect();

            if (
                ballRect.left < targetRect.right &&
                ballRect.right > targetRect.left &&
                ((ballRect.top <= targetRect.top && ballRect.bottom >= targetRect.top) ||
                (ballRect.top <= targetRect.bottom && ballRect.bottom >= targetRect.bottom) ||
                (ballRect.top >= targetRect.top && ballRect.bottom <= targetRect.bottom))
            ) {
                console.log('Treff topp eller bunn. Element: ', target);

                target.style.visibility = 'hidden';
                sjekkTarget()
    
                reversY *= -1;
                return true;
            };
        })) {
            requestAnimationFrame(animasjon);
        } else if (
            ballRect.top < plattformRect.bottom &&
            ballRect.bottom > plattformRect.top &&
            ballRect.left < plattformRect.right &&
            ballRect.right > plattformRect.left
        ) {
            console.log('Treff! Plattform');
            reversY *= -1;
            requestAnimationFrame(animasjon);
        } else if (ballPosisjon.x <= 0 || ballPosisjon.x > (spillBrett.offsetWidth - 12)) {
            console.log('Treff sidevegg!')
            reversX *= -1;
            requestAnimationFrame(animasjon);
        } else if (ballPosisjon.y <= 0) {
            console.log('Treff tak!')
            reversY *= -1;
            requestAnimationFrame(animasjon);
        } else if (ballPosisjon.y >= 592) {
            // Tap
            reversX = 0;
            reversY = 0;
            alert('Du suger.')
        } else {
            requestAnimationFrame(animasjon);
        }
        if (targets.length === 0) {
            alert('Du vant!')
            return;
        }
    }
    requestAnimationFrame(animasjon);
}

function sjekkTarget() {
    targets.forEach((target, index) => {
        if (target.style.visibility === 'hidden') {
            // Sett inn en tom plassholder i stedet for å fjerne elementet
            let placeholder = document.createElement('div');
            placeholder.style.width = '90px';
            placeholder.style.height = '30px';
            placeholder.style.margin = '5px';
            targetBrett.replaceChild(placeholder, target);
        }
    });
}

