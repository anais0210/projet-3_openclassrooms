/* ----------------------------------------------------------------------------------------------- */
/* --                                   Canvas                                                  -- */
/* ----------------------------------------------------------------------------------------------- */

var checkSignature = false;


var CreateCanvas = function () {
    this.mouseX = 0 // Variables pour la position de la souris
    this.mouseY = 0
    this.lastX = -1 // Variables pour la précédente position de la souris
    this.lastY = -1
    this.mouseDown = false
    this.context = null
    const canvas = document.getElementById('canvas');

    this.init = () => { // Pour créer le canvas
        this.context = canvas.getContext('2d');
        canvas.width = 310; // Largeur du canvas
        canvas.height = 100; // Hauteur du canvas
        this.context.fillStyle = "#fff"; // Couleur de fond
        this.context.lineWidth = 2; // Epaisseur du trait
        this.context.strokeStyle = "#64a19d"; // Couleur du trait
        this.context.lineCap = 'round'; // Extrémité du trait
        this.draw(); // Pour dessiner
        this.erase(); // Pour effacer le contenu du canvas
    }

    this.getMousePos = (e) => { // Pour avoir la position de la souris
        if (e.offsetX) {
            this.mouseX = e.offsetX; // Position sur l'axe X
            this.mouseY = e.offsetY; // Position sur l'axe Y
        } else if (e.layerX) {
            this.mouseX = e.layerX; // Retourne les coordonnées sur l'axe verticale sur l'event en cours
            this.mouseY = e.layerY; // Retourne les coordonnées sur l'axe horizontale sur l'event en cours
        }
    }

    this.getTouchPos = (e) => {
             // Pour avoir la position du doigt (Pour smartphone et tablette)
        if (e.touches) {
            if (e.touches.length == 1) {
                const touch = e.touches[0];
                this.touchX = touch.pageX - touch.target;
                this.touchY = touch.pageY - touch.target;
            }
        }
    }

    this.drawLine = (x, y) => { // Pour dessiner des traits
        if (this.lastX == -1) {                         // Si c'est un nouveau chemin
            this.lastX = x;                         // Le premier point et le point du clic
            this.lastY = y;
        }
        checkSignature = true;
        this.context.beginPath();                       // Début du chemin
        this.context.moveTo(this.lastX, this.lastY);    // Point de départ
        this.context.lineTo(x, y);                      // Tracé de la ligne
        this.lastX = x;
        this.lastY = y;
        this.context.stroke();
        $("#bouton_valider").show(0); // Affiche le bouton "Valider"
    }

    this.draw = () => {
        canvas.addEventListener('mousedown',  (e) => {
            this.mouseDown = true;                                      // Quand la bouton de la souris est cliquer
            this.getMousePos(e);                                        // On regarde sa position
            this.drawLine(this.mouseX, this.mouseY);    // On commence à dessiner
        }, false);

        canvas.addEventListener('mousemove',  (e) => {
            this.getMousePos(e);                                         // Quand la souris bouge
            if (this.mouseDown === true) {                               // On regarde si le bouton est cliquer
                this.drawLine(this.mouseX, this.mouseY); // Et s'il l'est on dessine
            }
        }, false);

        window.addEventListener('mouseup',  () => {               // Quand le bouton de la souris n'est plus clicquer
            this.mouseDown = false;                                       // La souris n'est plus cliquer
            this.lastX = -1;                                             // La dernière position de la souris est -1 pour indiquer qu'il y a un nouveau chemin
            this.lastY = -1;
        }, false);

        // Même chose mais pour les tablettes et smartphones
        canvas.addEventListener('touchstart',  (e) => {
            this.getTouchPos(e);
            this.drawLine(this.touchX, this.touchY);
            e.preventDefault();
        }, false);

        canvas.addEventListener('touchmove',  (e) => {
            this.getTouchPos(e);
            this.drawLine(this.touchX, this.touchY);
            e.preventDefault();
        }, false);

        canvas.addEventListener('touchend',  (e) => {
            this.lastX = -1;
            this.lastY = -1;
        }, false);
    }

    this.erase = () => { // Pour effacer le canvas
        $('#effacer').on('click',  () => {
            this.context.clearRect(0, 0, canvas.width, canvas.height); // Efface le contenu du canvas
            checkSignature = false;
        });
    }
    this.init();
};
document.addEventListener('DOMContentLoaded', () => {
    var newCanvas = new CreateCanvas();
}, false);