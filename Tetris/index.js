class Figur {
  constructor() {
    this.farge = this.lagFarger();
    this.navn;
    this.x = 4;
    this.y = 0;
  }

  lagFarger() {
    let rød = "#aa0000";
    let grey = "#a6a8ab";
    let purple = "#652d90";
    let blue = "#2b388f";
    let green = "#006837";
    let brown = "#603712";
    let cyan = "#009588";

    let farger = [rød, grey, purple, blue, green, brown, cyan];
    const i = Math.floor(Math.random() * farger.length);

    return farger[i];
  }

  figurForm(shape) {
    this.shape = shape;
  }
}

class T extends Figur {
  constructor() {
    super();
    this.navn = "t";
    this.figurForm([
      [1, 0],
      [0, 1],
      [1, 1],
      [2, 1],
    ]);
  }
}

class L_1 extends Figur {
  constructor() {
    super();
    this.navn = "l_1";
    this.figurForm([
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 2],
    ]);
  }
}

class L_2 extends Figur {
  constructor() {
    super();
    this.navn = "l_2";
    this.figurForm([
      [1, 0],
      [1, 1],
      [1, 2],
      [0, 2],
    ]);
  }
}

class Z_1 extends Figur {
  constructor() {
    super();
    this.navn = "z_1";
    this.figurForm([
      [0, 0],
      [1, 0],
      [1, 1],
      [2, 1],
    ]);
  }
}

class Z_2 extends Figur {
  constructor() {
    super();
    this.navn = "z_2";
    this.figurForm([
      [1, 0],
      [2, 0],
      [0, 1],
      [1, 1],
    ]);
  }
}

class Kube extends Figur {
  constructor() {
    super();
    this.navn = "kube";
    this.figurForm([
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ]);
  }
}

class Pinne extends Figur {
  constructor() {
    super();
    this.navn = "pinne";
    this.figurForm([
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
    ]);
  }
}

class SpillBrett {
  constructor() {
    this.spillBrettElement = document.getElementById("spillBrett");
    this.grid = Array.from({ length: 20 }, () => Array(10).fill(null));
    this.raskFart = 50;
    this.normalFart = 800;
    this.currentFart = this.normalFart;
  }

  initEventListeners() {
    window.addEventListener("keydown", (e) => {
      if (e.code === "space") {
        this.settFart(this.raskFart);
        console.log("keydown");
      }
    });

    window.addEventListener("keyup", (e) => {
      if (e.code === "space") {
        this.settFart(this.normalFart);
      }
    });
  }

  settFart(fart) {
    if (this.currentFart !== fart) {
      this.currentFart = fart;
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
      this.startGameLoop();
    }
  }

  startGameLoop() {
    this.intervalId = setInterval(() => {
      if (!this.checkCollisions()) {
        this.update();
      } else {
        this.settFigur();
        this.aktivFigur = this.nesteFigur();
        this.tegnFigur(this.aktivFigur);
      }
    }, this.currentFart);
  }

  nesteFigur() {
    let t = new T();
    let l_1 = new L_1();
    let l_2 = new L_2();
    let z_1 = new Z_1();
    let z_2 = new Z_2();
    let kube = new Kube();
    let pinne = new Pinne();

    let figurer = [t, l_1, l_2, z_1, z_2, kube, pinne];
    let i = Math.floor(Math.random() * figurer.length);
    const figur = figurer[i];
    figur.x = 4;
    figur.y = 0;
    return figur;
  }

  lagFirkanter() {
    this.spillBrettElement.innerHTML = "";

    for (let i = 1; i <= 10; i++) {
      for (let j = 1; j < 20; j++) {
        const firkant = document.createElement("div");
        firkant.classList.add("firkant");
        this.spillBrettElement.appendChild(firkant);
      }
    }
  }

  tegnFigur(figur) {
    const existingFigurFirkanter = this.spillBrettElement.querySelectorAll(".figurFirkant");
    existingFigurFirkanter.forEach((firkant) => firkant.remove());

    figur.shape.forEach(([dx, dy]) => {
      const firkant = document.createElement("div");
      firkant.classList.add("figurFirkant");
      firkant.style.backgroundColor = figur.farge;
      firkant.style.gridColumnStart = figur.x + dx + 1;
      firkant.style.gridRowStart = figur.y + dy + 1;
      this.spillBrettElement.appendChild(firkant);
    });

    this.grid.forEach((row, y) => {
      row.forEach((color, x) => {
        if (color) {
          const firkant = document.createElement("div");
          firkant.classList.add("figurFirkant");
          firkant.style.backgroundColor = color;
          firkant.style.gridColumnStart = x + 1;
          firkant.style.gridRowStart = y + 1;
          this.spillBrettElement.appendChild(firkant);
        }
      });
    });
  }

  gameLoop() {
    this.aktivFigur = this.nesteFigur();
    this.tegnFigur(this.aktivFigur);
    this.startGameLoop();
  }

  update() {
    if (this.aktivFigur) {
      this.aktivFigur.y += 1;
      this.tegnFigur(this.aktivFigur);
    }
  }

  checkCollisions() {
    return this.aktivFigur.shape.some(([dx, dy]) => {
      const nyY = this.aktivFigur.y + dy + 1;
      const nyX = this.aktivFigur.x + dx;
      if (nyY >= 20 || (nyY < 20 && this.grid[nyY] && this.grid[nyY][nyX])) {
        return true;
      }
      return false;
    });
  }

  settFigur() {
    this.aktivFigur.shape.forEach(([dx, dy]) => {
      const x = this.aktivFigur.x + dx;
      const y = this.aktivFigur.y + dy;
      if (y >= 0 && y < 20 && x >= 0 && x < 10) {
        this.grid[y][x] = this.aktivFigur.farge;
      }
    });
  }
}

let spillBrett = new SpillBrett();
spillBrett.lagFirkanter();
spillBrett.gameLoop();
