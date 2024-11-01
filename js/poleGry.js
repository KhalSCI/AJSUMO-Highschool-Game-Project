class poleGry {
    constructor(gruboscLinii, kolorLinii, kolorTla, wielkosc, limitCzasu) {
        this.gruboscLinii=gruboscLinii;
        this.kolorLinii=kolorLinii;
        this.kolorTla=kolorTla;
        this.wielkosc=wielkosc;
        this.limitCzasu=limitCzasu;
    }

    //narysuj() {
    //    kontekst.beginPath();
    //    kontekst.lineWidth=this.gruboscLinii*jednostka;
    //    kontekst.fillStyle=this.kolorTla;
    //    kontekst.strokeStyle=this.kolorLinii;
    //    kontekst.rect(1, 1, oknoSzerokosc/2, oknoWysokosc/2,);
    //    kontekst.fill();
    //    kontekst.stroke();
    //}
    narysuj() {
        kontekst.beginPath();
        kontekst.arc(oknoSzerokosc / 2, oknoWysokosc / 2, Math.min(oknoSzerokosc, oknoWysokosc) / 2.5, 0, 2 * Math.PI);
        kontekst.fillStyle = this.kolorTla;
        kontekst.fill();
        kontekst.lineWidth = this.gruboscLinii * jednostka;
        kontekst.strokeStyle = this.kolorLinii;
        kontekst.stroke();
    }

}