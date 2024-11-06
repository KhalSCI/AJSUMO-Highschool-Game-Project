var mojCanvas;
var kontekst;
var oknoSzerokosc;
var oknoWysokosc;
var oknoMinimum;
var jednostka;
var licznikKlatek=0;
var wcisnietePrzyciski=[];
var mojePoleGry = new poleGry(2, "rgb(200,100,100,0.8)", "rgb(255,255,255,0.2)", 80, 0);
var gracze=[];
var animacja;
var graj=true;

var debug=false;
var powerUps = [];
var divPunktacja;
gracze.push(new Gracz(1,1,"rgb(50,150,50)", 6, 0.05,0.2,'ArrowUp','ArrowDown','ArrowLeft','ArrowRight'));
gracze.push(new Gracz(-10,-10,"rgb(50,150,150)", 6, 0.05,0.2,'w','s','a','d'));

window.onload=function() {
    window.addEventListener('resize', zmienRozmiarOkna);
    window.addEventListener('keydown', wcisnietyPrzycisk);
    window.addEventListener('keyup', odtegowanyPrzycisk);
    window.addEventListener('click', debugowanie);
    mojCanvas=document.getElementById("poleDoRysowania");
    kontekst=mojCanvas.getContext('2d');
    divPunktacja=document.getElementById('punktacja');
    zmienRozmiarOkna();
    animacja=setInterval(nastepnaKlatka, 1000/40);
    wyswietlPunkty();
    setInterval(generatePowerUps,Math.random() * 1000 + 5000);
}
function generatePowerUps() {
    const types = ['speed', 'points'];
    const type = types[Math.floor(Math.random() * types.length)];
    const radius = Math.min(oknoSzerokosc, oknoWysokosc) / 2.5;
    let angle = Math.random() * 2 * Math.PI;
    let r = Math.random() * radius;
    const x = r * Math.cos(angle);
    const y = r * Math.sin(angle);
    powerUps.push(new PowerUp(x / jednostka, y / jednostka, type));
}
function wyswietlPunkty() {
    let kodHTML = "<h2>Scores:</h2>";
    for (let i = 0; i < gracze.length; i++) {
        kodHTML += `<p>Player ${i + 1}: <b>${gracze[i].punkty}</b></p>`;
    }
    divPunktacja.innerHTML = kodHTML;
}

function zmienRozmiarOkna() {
    oknoSzerokosc=window.innerWidth;
    oknoWysokosc=window.innerHeight;
    oknoMinimum=Math.min(oknoSzerokosc, oknoWysokosc);
    jednostka=oknoMinimum/200;
    mojCanvas.width=oknoSzerokosc;
    mojCanvas.height=oknoWysokosc;
}

function nastepnaKlatka() {
    kontekst.clearRect(0, 0, oknoSzerokosc, oknoWysokosc);
    mojePoleGry.narysuj();
    for (let powerUp of powerUps) {
        powerUp.draw();
    }
    for (let i = 0; i < gracze.length; i++) {
        gracze[i].wykryjKolizje();
    }
    for (let i = 0; i < gracze.length; i++) gracze[i].narysuj();
    licznikKlatek++;
}

function wcisnietyPrzycisk(e) {
    if (!wcisniety(e.key))  wcisnietePrzyciski.push(e.key);
    //console.log(wcisnietePrzyciski);
}

function odtegowanyPrzycisk(e) {
    let indexPrzycisku=wcisnietePrzyciski.indexOf(e.key);
    if (wcisniety(e.key)) wcisnietePrzyciski.splice(indexPrzycisku,1);
    if (debug && e.key==" ") {
        if (graj) clearInterval(animacja);
        else animacja=setInterval(nastepnaKlatka, 1000/40);
        graj=1-graj;
    }
    if (debug && !graj && e.key=="m") nastepnaKlatka();
    //console.log(wcisnietePrzyciski);
}

function wcisniety(klawisz) {
    let indexPrzycisku=wcisnietePrzyciski.indexOf(klawisz);
    if (indexPrzycisku==-1) return false;
    else return true;
}

function narysujLinie(x,y,dlugosc,kat,srodek) {
	var koniecX=dlugosc*Math.cos(kat);
    var koniecY=dlugosc*Math.sin(kat);
	kontekst.beginPath();
    kontekst.lineWidth=oknoMinimum/200;
	if (srodek) {
		kontekst.moveTo(x-koniecX,y-koniecY);
	} else {
		kontekst.moveTo(x,y);
	}
	
	kontekst.lineTo(x+koniecX,y+koniecY);
    kontekst.strokeStyle="rgb(255,0,0)";
	kontekst.stroke();
}

function debugowanie() {
    debug=1-debug;
}

function zaokroglij(liczba,ileCyfr) {
    let wynik=liczba*Math.pow(10,ileCyfr);
    wynik=Math.round(wynik);
    wynik/=Math.pow(10,ileCyfr);
    return wynik;
}



