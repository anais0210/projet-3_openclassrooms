/* ----------------------------------------------------------------------------------------------- */
/* --   Ce fichier rassemble la validation du formulaire de réservation et le session storage   -- */
/* ----------------------------------------------------------------------------------------------- */


HTMLElement.prototype.show = function() {
    this.removeAttribute('hidden');
};
HTMLElement.prototype.hide = function(){
    this.setAttribute('hidden', 'true');
};

var Reservation = function (){

    var formReservation = document.getElementById("form-reservation");

    formReservation.addEventListener("submit", function (e) {
        var firstname = document.getElementById("firstname");
        var lastname = document.getElementById("lastname");
        var station = document.querySelector('#nom-station');
        if (firstname.value.length == 0){
            firstname.setAttribute('class', 'error');
        }
        if (lastname.value.length == 0){
            lastname.setAttribute('class', 'error');
        }
        if(checkSignature == false){
            document.getElementById('canvas').setAttribute('class', 'error')
        }
        if (firstname.value.length == 0 || lastname.value.length == 0 || checkSignature == false) {
            document.getElementById("form-error").innerHTML = "Tous les champs sont obligatoires";
        } else {
            e.target.setAttribute('hidden', 'true');
            document.getElementById('reservation-success').removeAttribute('hidden');
            setReservation(lastname.value, firstname.value, station.textContent);
        }

        e.preventDefault();
    });

    //Annuler la réservation courante
    var annuler = document.getElementById('annuler');
    annuler.addEventListener("click", function() {
        cancelReservation();
    });

    displayIfExistReservation();

//Afficher la réservation courante
    function showReservation(reservation) {

        document.getElementById('reservation-current-firstname').innerHTML = reservation.firstname;
        document.getElementById('reservation-current-lastname').innerHTML = reservation.lastname;
        document.getElementById('reservation-current-station').innerHTML = reservation.station;
        document.getElementById('empty-reservation').setAttribute('hidden', 'true');
        document.getElementById("reservation-current-valid").removeAttribute('hidden');

        document.getElementById('boutton-reservation').setAttribute('hidden', 'true');
        document.getElementById('annuler').removeAttribute('hidden');
        document.getElementById('reservation-current-body').removeAttribute('hidden');

// Mise en place du timer 20 minutes pour une réservation
        var timer = setInterval(function timerReservation() {

            var endDate = sessionStorage.getItem('end-date');
            var countDownDate = new Date(endDate);

            var dateNow = new Date().getTime();
            var distance = countDownDate - dateNow;
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            document.getElementById('timer').innerHTML = minutes + "m " + seconds + "s ";
            if (distance < 0) {
                clearInterval(timer);
                document.getElementById("timer").innerHTML = " Votre réservation est expirer";
                showEmptyReservation();
            }

            1000;
        });

    }

// Si il n'y a pas de reservation
    function showEmptyReservation() {
        document.getElementById('empty-reservation').show();
        document.getElementById('reservation-current-valid').hide();
        document.getElementById('boutton-reservation').show();
        document.getElementById('annuler').hide();
        document.getElementById('form-reservation').show();
        document.getElementById('reservation-success').hide();
    }

//Mise en session de la reservation courante
    function setReservation(lastname, firstname, station) {
        localStorage.setItem('firstname', firstname);
        console.log(firstname);
        localStorage.setItem('lastname', lastname);
        sessionStorage.setItem('station', station);
        var dateLimit = new Date();
        dateLimit.setMinutes(dateLimit.getMinutes() + 20);
        sessionStorage.setItem('end-date', dateLimit.toString());

        showReservation(getCurrentReservation());
    }

// Vérifie si il y a une réservation et affiche le message correspondant
    function getCurrentReservation() {
        return {
            'firstname': localStorage.getItem('firstname'),
            'lastname': localStorage.getItem('lastname'),
            'station': sessionStorage.getItem('station'),
            'end-date': sessionStorage.getItem('end-date'),
        }
    }

// Vérifie si il y a des données en session et les affiches si présentes
    function displayIfExistReservation(){
        var currentReservation = getCurrentReservation();
        if (currentReservation.firstname != null) {
            showReservation(currentReservation);

        } else {
            showEmptyReservation();
        }
    }

// fonction pour annuler la réservation
    function cancelReservation() {
        localStorage.removeItem('firstname');
        localStorage.removeItem('lastname');
        sessionStorage.removeItem('station');
        sessionStorage.removeItem('end-date');
        showEmptyReservation();
    }
};

var reservation = new Reservation();

document.getElementById('header-information-reservation').addEventListener('click', function(){
    var body = document.getElementById("reservation-current-body");
    if (body.getAttribute('hidden')) {
        body.show();
    } else {
        body.hide();
    }
});
