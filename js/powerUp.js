class PowerUp {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.collected = false;
    }

    draw() {
        if (!this.collected) {
            kontekst.beginPath();
            kontekst.arc(oknoSzerokosc / 2 + this.x * jednostka, oknoWysokosc / 2 + this.y * jednostka, 2 * jednostka, 0, 2 * Math.PI);
            kontekst.fillStyle = this.getColor();
            kontekst.fill();
            kontekst.stroke();
        }
    }

    getColor() {
        switch (this.type) {
            case 'speed':
                return 'blue';
            case 'points':
                return 'green';
            default:
                return 'white';
        }
    }
}