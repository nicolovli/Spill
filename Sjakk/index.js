class Brikke {
  constructor(farge, posisjonX, posisjonY) {
    posisjonX = posisjonX.toLowerCase();
    farge = farge.toLowerCase();
    if (!(posisjonX >= "a" && posisjonX <= "h")) {
      throw new Error("Posisjon X må være mellom a og h.");
    }
    if (!(posisjonY >= 1 && posisjonY <= 8)) {
      throw new Error("Posisjon Y må være mellom 1 og 8.");
    }
    if (!(farge === "hvit" || farge === "svart")) {
      throw new Error("Farge må være hvit eller svart.");
    }
    this.farge = farge;
    this.posisjonX = posisjonX;
    this.posisjonY = posisjonY;
  }

  getLovligeTrekk() {
    throw new Error("Denne metoden må implementeres i underklassene");
  }

  flyttTil(nyPosisjonX, nyPosisjonY) {
    this.posisjonX = nyPosisjonX;
    this.posisjonY = nyPosisjonY;
  }

  ledigRute(posisjon, brikker) {
    for (let brikke of brikker) {
      if (brikke.posisjonX === posisjon.x && brikke.posisjonY === posisjon.y) {
        if (brikke.farge === this.farge) {
          return "alliert";
        } else {
          return "fiende";
        }
      }
    }
    return "ledig";
  }
}

class Bonde extends Brikke {
  navn = "bonde";
  constructor(farge, posisjonX, posisjonY) {
    super(farge, posisjonX, posisjonY);
    this.symbol = "♟";
  }

  getLovligeTrekk() {
    let trekk = [];
    let retning = this.farge === "hvit" ? 1 : -1;
    let nyPosisjonY = this.posisjonY + retning;
    let bokstaver = ["a", "b", "c", "d", "e", "f", "g", "h"];
    let index = bokstaver.indexOf(this.posisjonX);
    let potensieltTrekkFramover;

    // Sjekk for å flytte fremover
    potensieltTrekkFramover = { x: this.posisjonX, y: nyPosisjonY };
    if (this.ledigRute(potensieltTrekkFramover, brikker) === "ledig") {
      trekk.push(potensieltTrekkFramover);
      if (this.posisjonY === 2 || this.posisjonY === 7) {
        potensieltTrekkFramover = { x: this.posisjonX, y: nyPosisjonY + retning };
        trekk.push(potensieltTrekkFramover);
      }
    }

    // Sjekk for å angripe diagonalt venstre
    if (index > 0) {
      let potensieltTrekkVenstre = { x: bokstaver[index - 1], y: nyPosisjonY };
      if (this.ledigRute(potensieltTrekkVenstre, brikker) === "fiende") {
        trekk.push(potensieltTrekkVenstre);
      }
    }

    // Sjekk for å angripe diagonalt høyre
    if (index < bokstaver.length - 1) {
      let potensieltTrekkHøyre = { x: bokstaver[index + 1], y: nyPosisjonY };
      if (this.ledigRute(potensieltTrekkHøyre, brikker) === "fiende") {
        trekk.push(potensieltTrekkHøyre);
      }
    }

    return trekk;
  }
}

class Konge extends Brikke {
  navn = "konge";
  constructor(farge, posisjonX, posisjonY) {
    super(farge, posisjonX, posisjonY);
    this.symbol = "♚";
  }

  getLovligeTrekk() {
    let trekk = [];
    let bokstaver = ["a", "b", "c", "d", "e", "f", "g", "h"];
    let index = bokstaver.indexOf(this.posisjonX);
    let muligeTrekk = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ];

    for (let i = 0; i < muligeTrekk.length; i++) {
      let nyXIndex = index + muligeTrekk[i][0];
      let nyY = this.posisjonY + muligeTrekk[i][1];

      if (nyXIndex >= 0 && nyXIndex < bokstaver.length && nyY >= 1 && nyY <= 8) {
        let potensieltTrekk = { x: bokstaver[nyXIndex], y: nyY };
        let status = this.ledigRute(potensieltTrekk, brikker);
        if (status === "ledig") {
          trekk.push(potensieltTrekk);
        } else if (status === "fiende") {
          trekk.push(potensieltTrekk);
          continue;
        } else {
          continue;
        }
      }
    }

    return trekk;
  }
}

class Dronning extends Brikke {
  navn = "Dronning";
  constructor(farge, posisjonX, posisjonY) {
    super(farge, posisjonX, posisjonY);

    this.symbol = "♛";
  }

  getLovligeTrekk() {
    const tårn = new Tårn(this.farge, this.posisjonX, this.posisjonY);
    const løper = new Løper(this.farge, this.posisjonX, this.posisjonY);
    const tårnTrekk = tårn.getLovligeTrekk();
    const løperTrekk = løper.getLovligeTrekk();
    return tårnTrekk.concat(løperTrekk);
  }
}

class Tårn extends Brikke {
  navn = "Tårn";
  constructor(farge, posisjonX, posisjonY) {
    super(farge, posisjonX, posisjonY);

    this.symbol = "♜";
  }

  getLovligeTrekk() {
    let trekk = [];
    let bokstaver = ["a", "b", "c", "d", "e", "f", "g", "h"];
    let index = bokstaver.indexOf(this.posisjonX);

    const leggTilLinjeTrekk = (deltaX, deltaY) => {
      let xIndex = index + deltaX;
      let y = this.posisjonY + deltaY;

      while (xIndex >= 0 && xIndex < bokstaver.length && y >= 1 && y <= 8) {
        let potensieltTrekk = { x: bokstaver[xIndex], y };
        let status = this.ledigRute(potensieltTrekk, brikker);
        if (status === "ledig") {
          trekk.push(potensieltTrekk);
        } else if (status === "fiende") {
          trekk.push(potensieltTrekk);
          break;
        } else {
          break;
        }
        xIndex += deltaX;
        y += deltaY;
      }
    };

    leggTilLinjeTrekk(1, 0); // høyre
    leggTilLinjeTrekk(-1, 0); // venstre
    leggTilLinjeTrekk(0, 1); // opp
    leggTilLinjeTrekk(0, -1); // ned

    return trekk;
  }
}

class Løper extends Brikke {
  navn = "Løper";
  constructor(farge, posisjonX, posisjonY) {
    super(farge, posisjonX, posisjonY);

    this.symbol = "♝";
  }

  getLovligeTrekk() {
    let trekk = [];
    let bokstaver = ["a", "b", "c", "d", "e", "f", "g", "h"];
    let index = bokstaver.indexOf(this.posisjonX);

    const leggTilDiagonaleTrekk = (deltaX, deltaY) => {
      let xIndex = index + deltaX;
      let y = this.posisjonY + deltaY;

      while (xIndex >= 0 && xIndex < bokstaver.length && y >= 1 && y <= 8) {
        let potensieltTrekk = { x: bokstaver[xIndex], y };
        let status = this.ledigRute(potensieltTrekk, brikker);
        if (status === "ledig") {
          trekk.push(potensieltTrekk);
        } else if (status === "fiende") {
          trekk.push(potensieltTrekk);
          break;
        } else {
          break;
        }
        xIndex += deltaX;
        y += deltaY;
      }
    };

    leggTilDiagonaleTrekk(1, 1); // ned høyre
    leggTilDiagonaleTrekk(-1, 1); // ned venstre
    leggTilDiagonaleTrekk(1, -1); // opp høyre
    leggTilDiagonaleTrekk(-1, -1); // opp venstre

    return trekk;
  }
}

class Springer extends Brikke {
  navn = "Springer";
  constructor(farge, posisjonX, posisjonY) {
    super(farge, posisjonX, posisjonY);

    this.symbol = "♞";
  }

  getLovligeTrekk() {
    let trekk = [];
    let bokstaver = ["a", "b", "c", "d", "e", "f", "g", "h"];
    let index = bokstaver.indexOf(this.posisjonX);
    let muligeTrekk = [
      [1, -2],
      [-1, -2], // Oppover
      [2, 1],
      [2, -1], // Høyre
      [1, 2],
      [-1, 2], // Nedover
      [-2, 1],
      [-2, -1], // Venstre
    ];

    for (let i = 0; i < muligeTrekk.length; i++) {
      let nyXIndex = index + muligeTrekk[i][1];
      let nyY = this.posisjonY + muligeTrekk[i][0];

      if (nyXIndex >= 0 && nyXIndex < bokstaver.length && nyY >= 1 && nyY <= 8) {
        let potensieltTrekk = { x: bokstaver[nyXIndex], y: nyY };

        let status = this.ledigRute(potensieltTrekk, brikker);
        if (status === "ledig") {
          trekk.push(potensieltTrekk);
        } else if (status === "fiende") {
          trekk.push(potensieltTrekk);
          continue;
        } else {
          continue;
        }
      }
    }

    return trekk;
  }
}

class SjakkBrikke {
  constructor() {}

  lagBønder() {
    let bønder = [];
    let bokstaver = ["a", "b", "c", "d", "e", "f", "g", "h"];
    for (let i = 0; i < 16; i++) {
      if (i < 8) {
        let bondeHvit = new Bonde("hvit", bokstaver[i], 2);
        bønder.push(bondeHvit);
      }
      if (i >= 8) {
        let bondeSvart = new Bonde("svart", bokstaver[i - 8], 7);
        bønder.push(bondeSvart);
      }
    }

    return bønder;
  }

  lagKonger() {
    let konger = [];
    let kongeHvit = new Konge("hvit", "e", 1);
    let kongeSvart = new Konge("svart", "e", 8);
    konger.push(kongeHvit, kongeSvart);
    return konger;
  }

  lagDronninger() {
    let dronninger = [];
    let dronningHvit = new Dronning("hvit", "d", 1);
    let dronningSvart = new Dronning("svart", "d", 8);
    dronninger.push(dronningHvit, dronningSvart);
    return dronninger;
  }

  lagTårn() {
    let tårn = [];
    let bokstaver = ["a", "h"];
    for (let i = 1; i <= 4; i++) {
      if (i <= 2) {
        let tårnHvit = new Tårn("hvit", bokstaver[i - 1], 1);
        tårn.push(tårnHvit);
      }
      if (i > 2) {
        let tårnSvart = new Tårn("svart", bokstaver[i - 3], 8);
        tårn.push(tårnSvart);
      }
    }
    return tårn;
  }

  lagLøpere() {
    let løpere = [];
    let bokstaver = ["c", "f"];
    for (let i = 1; i <= 4; i++) {
      if (i <= 2) {
        let løperHvit = new Løper("hvit", bokstaver[i - 1], 1);
        løpere.push(løperHvit);
      }
      if (i > 2) {
        let løperSvart = new Løper("svart", bokstaver[i - 3], 8);
        løpere.push(løperSvart);
      }
    }
    return løpere;
  }

  lagSpringere() {
    let springere = [];
    let bokstaver = ["b", "g"];
    for (let i = 1; i <= 4; i++) {
      if (i <= 2) {
        let springerHvit = new Springer("hvit", bokstaver[i - 1], 1);
        springere.push(springerHvit);
      }
      if (i > 2) {
        let springerSvart = new Springer("svart", bokstaver[i - 3], 8);
        springere.push(springerSvart);
      }
    }
    return springere;
  }

  opprettSpillebrikker() {
    let brikker = [].concat(
      this.lagBønder(),
      this.lagDronninger(),
      this.lagKonger(),
      this.lagSpringere(),
      this.lagTårn(),
      this.lagLøpere()
    );
    return brikker;
  }
}

let sjakkBrikke = new SjakkBrikke();

class Brett {
  constructor() {
    this.valgtBrikke = null;
    this.eventListeners = [];
    this.tur = "hvit";
    this.turText = document.createElement("div");
    this.lostPiecesWhite = document.getElementById("lostPiecesWhite");
    this.lostPiecesBlack = document.getElementById("lostPiecesBlack");
  }

  lagBrett(brikker) {
    let bokstaver = ["a", "b", "c", "d", "e", "f", "g", "h"];
    let firkanter = [];
    for (let i = 1; i <= 8; i++) {
      for (let j = 0; j < 8; j++) {
        let firkant = document.createElement("div");
        firkant.classList.add("firkant");
        firkant.id = `${i}${bokstaver[j]}`;
        board.appendChild(firkant);
        if ((i + j) % 2 === 0) {
          firkant.classList.add("lys");
        } else {
          firkant.classList.add("mørk");
        }
        firkanter.push(firkant);

        brikker.forEach((brikke) => {
          if (brikke.posisjonX == bokstaver[j] && brikke.posisjonY == i) {
            let span = document.createElement("span");
            span.textContent = brikke.symbol;
            span.classList.add("brikke");

            if (brikke.farge === "svart") {
              span.classList.add("svart");
            } else if (brikke.farge === "hvit") {
              span.classList.add("hvit");
            }

            span.addEventListener("click", () => this.sjekkTrekk(brikke));

            firkant.appendChild(span);
          }
        });
      }
    }

    this.turText.classList.add("container");
    this.turText.classList.add("turn-indicator");
    this.turText.innerHTML = "Tur: " + this.tur;
    document.body.appendChild(this.turText);
  }

  sjekkTrekk(brikke) {
    if (
      (brikke.farge === "hvit" && this.tur === "svart") ||
      (brikke.farge === "svart" && this.tur === "hvit")
    ) {
      return;
    }

    if (brikke === this.valgtBrikke) {
      this.valgtBrikke = null;
      this.clearHighlights();
      return;
    }

    this.clearHighlights();
    this.valgtBrikke = brikke;
    let lovligeTrekk = brikke.getLovligeTrekk();

    lovligeTrekk.forEach((trekk) => {
      let firkantId = `${trekk.y}${trekk.x}`;
      let firkant = document.getElementById(firkantId);

      if (firkant) {
        firkant.classList.add("highlight");
        let movePiece = () => this.flyttBrikke(brikke, trekk);
        firkant.addEventListener("click", movePiece);
        this.eventListeners.push({ element: firkant, type: "click", listener: movePiece });
      }
    });
  }

  flyttBrikke(brikke, nyPosisjon) {
    let gammelFirkant = document.getElementById(`${brikke.posisjonY}${brikke.posisjonX}`);
    let nyFirkant = document.getElementById(`${nyPosisjon.y}${nyPosisjon.x}`);

    if (!nyFirkant.classList.contains("highlight")) {
      return;
    }

    let fiendeBrikke = this.finnBrikkePaaPosisjon(nyPosisjon.x, nyPosisjon.y);
    if (fiendeBrikke) {
      this.fjernBrikke(fiendeBrikke);
    }

    let brikkeElement = gammelFirkant.querySelector(".brikke");
    if (brikkeElement) {
      gsap.to(brikkeElement, {
        duration: 0.3,
        x: nyFirkant.offsetLeft - gammelFirkant.offsetLeft,
        y: nyFirkant.offsetTop - gammelFirkant.offsetTop,
        ease: "sine",
        onComplete: () => {
          nyFirkant.appendChild(gammelFirkant.removeChild(brikkeElement));
          gsap.set(brikkeElement, { x: 0, y: 0 });
        },
      });
    }

    // nyFirkant.appendChild(gammelFirkant.removeChild(gammelFirkant.querySelector(".brikke")));

    this.eventListeners.forEach(({ element, type, listener }) => {
      element.removeEventListener(type, listener);
    });
    this.eventListeners = [];

    brikke.flyttTil(nyPosisjon.x, nyPosisjon.y);
    this.valgtBrikke = null;
    this.clearHighlights();

    this.tur = this.tur === "hvit" ? "svart" : "hvit";
    this.turText.innerHTML = "Tur: " + this.tur;
    console.log("flyttet brikke");

    if (brikke.navn === "bonde" && (brikke.posisjonY === 8 || brikke.posisjonY === 1)) {
      this.byttUtBrikke(brikke);
    }
  }

  clearHighlights() {
    let highligths = document.querySelectorAll(".highlight");
    highligths.forEach((highlight) => {
      highlight.classList.remove("highlight");
    });
  }

  finnBrikkePaaPosisjon(x, y) {
    return brikker.find((brikke) => brikke.posisjonX === x && brikke.posisjonY === y);
  }

  fjernBrikke(brikke) {
    let firkant = document.getElementById(`${brikke.posisjonY}${brikke.posisjonX}`);
    let span = firkant.querySelector(".brikke");
    if (span) {
      firkant.removeChild(span);

      if (brikke.farge === "hvit") {
        let lostPiece = document.createElement("span");
        lostPiece.textContent = brikke.symbol;
        lostPiece.classList.add("tapteBrikker");
        lostPiece.classList.add("grå");
        this.lostPiecesWhite.appendChild(lostPiece);
      } else if (brikke.farge === "svart") {
        let lostPiece = document.createElement("span");
        lostPiece.classList.add("tapteBrikker");
        lostPiece.classList.add("svart");
        lostPiece.textContent = brikke.symbol;

        this.lostPiecesBlack.appendChild(lostPiece);
      }
    }

    let index = brikker.indexOf(brikke);
    if (index !== -1) {
      brikker.splice(index, 1);
    }
  }

  byttUtBrikke(brikke) {
    let modal = document.createElement("div");
    modal.classList.add("modal");

    let options = ["Dronning", "Tårn", "Løper", "Springer"];
    options.forEach((option) => {
      let button = document.createElement("button");
      button.textContent = option;
      button.addEventListener("click", () => {
        this.byttBrikke(brikke, option.toLowerCase());
        document.body.removeChild(modal);
      });
      modal.appendChild(button);
    });

    document.body.appendChild(modal);
  }

  byttBrikke(gammelBrikke, nyBrikkeType) {
    let posX = gammelBrikke.posisjonX;
    let posY = gammelBrikke.posisjonY;
    let farge = gammelBrikke.farge;

    let index = brikker.indexOf(gammelBrikke);
    if (index !== -1) {
      brikker.splice(index, 1);
    }

    let nyBrikke;
    switch (nyBrikkeType) {
      case "dronning":
        nyBrikke = new Dronning(farge, posX, posY);
        break;
      case "tårn":
        nyBrikke = new Tårn(farge, posX, posY);
        break;
      case "løper":
        nyBrikke = new Løper(farge, posX, posY);
        break;
      case "springer":
        nyBrikke = new Springer(farge, posX, posY);
        break;
      default:
        throw new Error("Ugyldig brikketype");
    }

    let nyBrikkeElement = document.createElement("span");
    nyBrikkeElement.textContent = nyBrikke.symbol;
    nyBrikkeElement.classList.add("brikke");
    if (nyBrikke.farge === "svart") {
      nyBrikkeElement.classList.add("svart");
    } else if (nyBrikke.farge === "hvit") {
      nyBrikkeElement.classList.add("hvit");
    }
    nyBrikkeElement.addEventListener("click", () => this.sjekkTrekk(nyBrikke));
    firkant.appendChild(nyBrikkeElement);

    brikker.push(nyBrikke);
  }
}

let brett = new Brett();
let brikker = sjakkBrikke.opprettSpillebrikker();
brett.lagBrett(brikker);
