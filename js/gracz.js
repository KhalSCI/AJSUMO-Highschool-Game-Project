class Gracz {
    constructor(x,y,kolor, wielkosc, silaPrzycisku, silaPrzycisku2, przyciskPrzod, przyciskTyl, przyciskLewo,przyciskPrawo) {
        //numer w tablicy graczy
        this.numerek=gracze.length;
        this.punkty=0;
        this.stickLength = 15; // Length of the stick or sword
        this.stickWidth = 2; // Width of the stick or sword
        this.stickHitbox = { x1: 0, y1: 0, x2: 0, y2: 0 }; // Hitbox coordinates
        this.przyciskPrzod=przyciskPrzod;
        this.przyciskTyl=przyciskTyl;
        this.przyciskLewo=przyciskLewo;
        this.przyciskPrawo=przyciskPrawo;
        this.poczatkowyX=x;
        this.poczatkowyY=y;
        this.lastForwardAngle = this.kat; // Track the last forward angle
        this.stickAngle = this.kat; // Track the stick's angle separately

        //pozycja
        this.x=x;
        this.y=y;
        //predkosc
        this.maxSpeed = 2;
        this.vX=0;
        this.vY=0;
        //przyspieszenie
        this.aX=0;
        this.aY=0;
        //sila
        this.fX=0;
        this.fY=0;

        this.kolor=kolor;
        this.wielkosc=wielkosc;

        this.kat=Math.PI/1.1;
        this.predkosc=0;
        this.silaPrzycisku=silaPrzycisku;
        this.silaPrzycisku2=silaPrzycisku2;
        this.pozaPolemGry=false;
        this.jakDlugoJestPozaPolem=0;
        this.przegral=false;
    }

    narysuj() {
        this.rusz();
        this.checkPowerUpCollision();
        kontekst.beginPath();
        kontekst.lineWidth=oknoMinimum/100;
        kontekst.fillStyle=this.kolor;
        if (this.pozaPolemGry) kontekst.fillStyle="red";
        kontekst.strokeStyle="rgb(0,0,0)";
        let promien=this.wielkosc*jednostka;
        let x=oknoSzerokosc/2 + this.x*jednostka;
        let y=oknoWysokosc/2 + this.y*jednostka;
        kontekst.arc(x, y, promien, 0, 2*Math.PI);
        kontekst.fill();
        kontekst.stroke();
        
        kontekst.beginPath();
        kontekst.lineWidth = this.stickWidth * jednostka;
        kontekst.strokeStyle = "brown"; // Color of the stick or sword
        let stickX = x + Math.cos(this.kat) * this.stickLength * jednostka;
        let stickY = y + Math.sin(this.kat) * this.stickLength * jednostka;
        kontekst.moveTo(x, y);
        kontekst.lineTo(stickX, stickY);
        kontekst.stroke();

        // Update the stick's hitbox coordinates
        this.stickHitbox.x1 = this.x;
        this.stickHitbox.y1 = this.y;
        this.stickHitbox.x2 = this.x + Math.cos(this.kat) * this.stickLength;
        this.stickHitbox.y2 = this.y + Math.sin(this.kat) * this.stickLength;


        if (this.jakDlugoJestPozaPolem>mojePoleGry.limitCzasu) this.przegral=true;
		if (debug) this.debug();
        this.zresetujSile();
    }
    checkStickCollision(targetX, targetY, targetRadius) {
        // Convert target coordinates to the same scale as the stick hitbox
        const targetXScaled = targetX * jednostka;
        const targetYScaled = targetY * jednostka;
    
        // Calculate the distance from the target to the stick's line segment
        const dx = (this.stickHitbox.x2 - this.stickHitbox.x1) * jednostka;
        const dy = (this.stickHitbox.y2 - this.stickHitbox.y1) * jednostka;
        const length = Math.sqrt(dx * dx + dy * dy);
        const dot = ((targetXScaled - this.stickHitbox.x1 * jednostka) * dx + (targetYScaled - this.stickHitbox.y1 * jednostka) * dy) / (length * length);
    
        // Clamp the dot product to the range [0, 1] to ensure the closest point is on the segment
        const clampedDot = Math.max(0, Math.min(1, dot));
        const closestX = this.stickHitbox.x1 * jednostka + clampedDot * dx;
        const closestY = this.stickHitbox.y1 * jednostka + clampedDot * dy;
        const distanceX = targetXScaled - closestX;
        const distanceY = targetYScaled - closestY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        // Check ifthe distance is less than the sum of the radii (collision)
        return distance < targetRadius * jednostka;
    }
    checkPowerUpCollision() {
        for (let powerUp of powerUps) {
            if (!powerUp.collected) {
                let distance = Math.sqrt((this.x - powerUp.x) ** 2 + (this.y - powerUp.y) ** 2);
                if (distance < this.wielkosc) {
                    powerUp.collected = true;
                    this.applyPowerUp(powerUp.type);
                }
            }
        }
    }
    applyPowerUp(type) {
        switch (type) {
            case 'speed':
                this.silaPrzycisku *= 2;
                this.silaPrzycisku2 *= 1.5;
                this.maxSpeed *= 1.25;
                setTimeout(() => this.silaPrzycisku /= 2, 5000);
                setTimeout(() => this.silaPrzycisku2 /= 1.5, 5000);
                setTimeout(() => this.maxSpeed /= 1.25, 5000);
                break;
            case 'points':
                this.punkty += 1;
                wyswietlPunkty();
                break;
        }
    }

    debug() {
        let x=oknoSzerokosc/2 + this.x*jednostka;
        let y=oknoWysokosc/2 + this.y*jednostka;
        narysujLinie(x,y, this.predkosc*jednostka*5, this.kat,0);
        kontekst.font = "12px Arial";
        kontekst.fillStyle="rgb(255,0,0)";
        let linia1="Pozycja: x=" +zaokroglij(this.x,2)+ ", y=" +zaokroglij(this.y,2);
        let linia2="Predkosc: x=" +zaokroglij(this.vX,2)+ ", y=" +zaokroglij(this.vY,2);
        let linia3="Predkosc=" +zaokroglij(this.predkosc,2)+ ", Kąt=" +zaokroglij(this.kat,2);
        let linia4="SiłaX=" +zaokroglij(this.fX,2)+ ", Siła Y=" +zaokroglij(this.fY,2);
        kontekst.fillText(linia1, x+this.wielkosc*jednostka, y);    
        kontekst.fillText(linia2, x+this.wielkosc*jednostka, y+15);  
        kontekst.fillText(linia3, x+this.wielkosc*jednostka, y+30);  
        kontekst.fillText(linia4, x+this.wielkosc*jednostka, y+45); 

            // Draw the stick hitbox for debugging
        kontekst.beginPath();
        kontekst.strokeStyle = "green";
        kontekst.moveTo(oknoSzerokosc / 2 + this.stickHitbox.x1 * jednostka, oknoWysokosc / 2 + this.stickHitbox.y1 * jednostka);
        kontekst.lineTo(oknoSzerokosc / 2 + this.stickHitbox.x2 * jednostka, oknoWysokosc / 2 + this.stickHitbox.y2 * jednostka);
        kontekst.stroke();
    }

    reset() {
        this.x=this.poczatkowyX;
        this.y=this.poczatkowyY;
        this.predkosc=0;
        this.vX=0;
        this.vY=0;
        this.punkty--;
        wyswietlPunkty();
    }
	
	wykryjKolizje() {
		for (let i=0; i<gracze.length; i++) {
			if (i!=this.numerek) {
				//pozycja przeciwnika
				let przeciwnikX=gracze[i].x;
				let przeciwnikY=gracze[i].y;
				
				//odległość od przeciwnika
				let odlegloscX=this.x-przeciwnikX;
				let odlegloscY=this.y-przeciwnikY;
				
				let odleglosc=Math.sqrt((odlegloscX*odlegloscX)+(odlegloscY*odlegloscY));
				
				if (odleglosc<=(this.wielkosc+gracze[i].wielkosc)) {
						//tan(kat) = tangens kąta = odlegloscY/odlegloscX
						//atan - odwrotnosc tangensa   tan(alfa)=x   więc  atan(x)=alfa
						//tak jak pierwiastek jest odwrotnością kwadratu (x^2=y   więc sqrt(y)=x)
						let katZderzenia=Math.atan2(odlegloscY,odlegloscX);
						let roznicaKatow=this.kat-katZderzenia;
                        let silaUderzenia=Math.sin(roznicaKatow)*this.predkosc;
                        let silaX=silaUderzenia*Math.cos(roznicaKatow);
                        let silaY=silaUderzenia*Math.sin(roznicaKatow);
                        gracze[i].dodajSile(-silaX,-silaY);
						//punkt zderzenia - środek linii między odkami okregów
						let zderzenieX=(this.x+przeciwnikX)/2;
						let zderzenieY=(this.y+przeciwnikY)/2;
						
						if (debug) narysujLinie(oknoSzerokosc/2 + zderzenieX*jednostka, oknoWysokosc/2 + zderzenieY*jednostka, 100, katZderzenia-Math.PI/2, 1);
				}
                if (this.checkStickCollision(przeciwnikX, przeciwnikY, gracze[i].wielkosc)) {
                    this.punkty++;
                    wyswietlPunkty();
                }
			}
		}
	}

    rusz() {
        this.obliczPrzyspieszenie();
        this.obliczPredkosc();
        this.katIPredkosc();
        this.klawisze();
        this.iksyIIgreki();
        this.obliczPozycje();
    
        if (this.x * this.x + this.y * this.y > mojePoleGry.wielkosc * mojePoleGry.wielkosc) {
            this.pozaPolemGry = true;
            this.jakDlugoJestPozaPolem++;
            if (this.jakDlugoJestPozaPolem > 50) this.reset();
        } else {
            this.pozaPolemGry = false;
            this.jakDlugoJestPozaPolem = 0;
        }
    }

    zresetujSile() {
        this.fX=0;
        this.fY=0;
    }

    dodajSile(fX, fY) {
        this.fX+=fX;
        this.fY+=fY;
    }

    obliczPrzyspieszenie() {
        //F=m*a czyli a = F/m
        this.aX=this.fX/this.wielkosc;
        this.aY=this.fY/this.wielkosc;
    }

    obliczPredkosc() {
        // V = V0 + A*t  -- czas to jedna klatka, więc nie jest nam potrzebny
        this.vX += this.aX;
        this.vY += this.aY;
    
        // Cap the speed
        const currentSpeed = Math.sqrt(this.vX * this.vX + this.vY * this.vY);
        if (currentSpeed > this.maxSpeed) {
            const scale = this.maxSpeed / currentSpeed;
            this.vX *= scale;
            this.vY *= scale;
        }

    }

    obliczPozycje() {
      //d = d0 + V*t  -- czas to jedna klatka, więc nie jest nam potrzebny
      this.x+=this.vX;
      this.y+=this.vY;  
    }

    katIPredkosc() {
        // Calculate speed using Pythagorean theorem
        this.predkosc = Math.sqrt(this.vX * this.vX + this.vY * this.vY);
        if (this.vX == 0 && this.vY == 0) {
            // Do not change the angle if the player is stationary
            return;
        }
        if (this.vX == 0) {
            if (this.vY > 0) this.kat = 0;
            else this.kat = Math.PI;
        } else {
            this.kat = Math.atan2(this.vY, this.vX);
        }
    }

    iksyIIgreki() {
        this.vX=this.predkosc*Math.cos(this.kat);
        this.vY=this.predkosc*Math.sin(this.kat);
    }

    klawisze() {
        if (wcisniety(this.przyciskPrzod)) {
            this.predkosc += this.silaPrzycisku;
            this.stickAngle = this.kat; // Update the stick's angle
        }
        if (wcisniety(this.przyciskTyl)) {
            this.predkosc -= this.silaPrzycisku*1.5;
            if (this.predkosc < 0) this.predkosc = 0; // Prevent negative speed
        }
        if (wcisniety(this.przyciskLewo)) {
            this.kat -= this.silaPrzycisku2;
            this.stickAngle = this.kat; // Update the stick's angle
        }
        if (wcisniety(this.przyciskPrawo)) {
            this.kat += this.silaPrzycisku2;
            this.stickAngle = this.kat; // Update the stick's angle
        }
        this.kat %= 2 * Math.PI;
    
        // Cap the speed
        if (this.predkosc > this.maxSpeed) this.predkosc = this.maxSpeed;
    }
}