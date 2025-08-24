let spillBrett = document.getElementById('spillBrett');

let firkanter = [];
for (i = 0; i < 400; i++) {
    let firkant = document.createElement('div');
    firkant.classList.add('firkant');
    spillBrett.appendChild(firkant);
    firkanter.push(firkant);
}

let slange = document.createElement('div');
slange.classList.add('slange');
spillBrett.appendChild(slange);

let spilletHarStartet = false;
let infoTekst = document.getElementById('infoTekst');

let retning = [];
let slangefart = 2;
document.addEventListener('keydown', (event) => {
    if (!spilletHarStartet) {
        spilletHarStartet = true;
        infoTekst.style.visibility = 'hidden';
    }

    switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            if (retning[0] !== 'ned') {
                retning.unshift('opp');
                spilletHarStartet = true;
            }
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            if (retning[0] !== 'opp') {
                retning.unshift('ned');
                spilletHarStartet = true;
            }
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (retning[0] !== 'hoyre') {
                retning.unshift('venstre');
                spilletHarStartet = true;
            }
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (retning[0] !== 'venstre') {
                retning.unshift('hoyre');
                spilletHarStartet = true;
            }
            break;
        default:
            break;
    }
});

function oppdaterSlangeposisjon() {
    let a = 25;
    let bevegelse = { x: 0, y: 0 };
    switch (retning[0]) {
        case 'opp':
            bevegelse.y = -a;
            break;
        case 'ned':
            bevegelse.y = a;
            break;
        case 'venstre':
            bevegelse.x = -a;
            break;
        case 'hoyre':
            bevegelse.x = a;
            break;
        default:
            break;
    };

    slange.style.top = (parseInt(slange.style.top) || 0) + bevegelse.y + 'px';
    slange.style.left = (parseInt(slange.style.left) || 0) + bevegelse.x + 'px';

    if (
        parseInt(slange.style.top) < 0 || 
        parseInt(slange.style.top) > 475 || 
        parseInt(slange.style.left) < 0 || 
        parseInt(slange.style.left) > 475 ||
        slangeKropp.some(kropp => 
            parseInt(slange.style.top) === parseInt(kropp.style.top) &&
            parseInt(slange.style.left) === parseInt(kropp.style.left)
        )
        ) {
            gameOver();
            return;
        };

    let b = 0;
    if (
        parseInt(slange.style.top) >= parseInt(mat.style.top) - b &&
        parseInt(slange.style.top) <= parseInt(mat.style.top) + b &&
        parseInt(slange.style.left) >= parseInt(mat.style.left) - b &&
        parseInt(slange.style.left) <= parseInt(mat.style.left) + b
        ) {
            plasserMat();
            oppdaterScore();
            oppdaterSlangeKropp();
            slangefart += 0.05;

            clearInterval(intervall);
            intervall = setInterval(oppdaterSlangeposisjon, (300 / slangefart));
    };
    oppdaterSlangeKroppPosisjon();
};
let intervall = setInterval(oppdaterSlangeposisjon, (300 / slangefart));


function gameOver() {
    clearInterval(intervall);
    setTimeout(() => {
    alert('Du tapte! Din score var: ' + score);
    }, 20);
};

let mat = document.createElement('div');
mat.classList.add('mat');
spillBrett.appendChild(mat);

function plasserMat() {
    const stilFirkant = window.getComputedStyle(firkanter[0]);
    const firkantBredde = parseInt(stilFirkant.width);
    const firkantHoyde = parseInt(stilFirkant.height);

    const tilfeldigFirkantX = Math.floor(Math.random() * (spillBrett.offsetWidth / firkantBredde));
    const tilfeldigFirkantY = Math.floor(Math.random() * (spillBrett.offsetHeight / firkantHoyde));

    mat.style.top = tilfeldigFirkantY * firkantHoyde + 'px';
    mat.style.left = tilfeldigFirkantX * firkantBredde + 'px';
}

plasserMat();

let scoreTeller = document.getElementById('score');
let score = -1;
function oppdaterScore() {
    score++;
    scoreTeller.innerText = 'Score: ' + score;
}

let slangeKropp = [];

let alpha = 1;

function oppdaterSlangeKropp() {
    let kropp = document.createElement('div');
    kropp.classList.add('kropp');
    slangeKropp.unshift(kropp);
    spillBrett.appendChild(kropp);

    alpha -= 0.05;
    kropp.style.backgroundColor = `rgba(127, 226, 98, ${alpha})`;

    kropp.style.top = "-1000px";
    kropp.style.left = "-1000px";
};

let bakTop;
let bakLeft;

let slangeKroppPosisjon = []

function oppdaterSlangeKroppPosisjon() {
    slangeKroppPosisjon = [];

    for (let i = slangeKropp.length - 1; i > 0; i--) {
        slangeKropp[i].style.top = slangeKropp[i - 1].style.top;
        slangeKropp[i].style.left = slangeKropp[i - 1].style.left;

        let alpha = 1 - (i * 0.02);
        slangeKropp[i].style.backgroundColor = `rgba(127, 226, 98, ${alpha})`;
        slangeKroppPosisjon.push({top: slangeKropp[i].style.top, left: slangeKropp[i].style.left});
    }

    if (slangeKropp.length > 0) {
        slangeKropp[0].style.top = parseInt(slange.style.top) + 'px';
        slangeKropp[0].style.left = parseInt(slange.style.left) + 'px';

        slangeKropp[0].style.backgroundColor = `rgba(127, 226, 98, 1)`;

        switch (retning[0]) {
            case 'opp':
                slangeKropp[0].style.top = parseInt(slange.style.top) + 25 + 'px';
                break;
            case 'ned':
                slangeKropp[0].style.top = parseInt(slange.style.top) - 25 + 'px';
                break;
            case 'venstre':
                slangeKropp[0].style.left = parseInt(slange.style.left) + 25 + 'px';
                break;
            case 'hoyre':
                slangeKropp[0].style.left = parseInt(slange.style.left) - 25 + 'px';
                break;
            default:
                break;
        }
    }
    console.log(slangeKroppPosisjon);
}





oppdaterScore();