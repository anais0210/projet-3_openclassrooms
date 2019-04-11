document.addEventListener( 'DOMContentLoaded', function () {
    initMaps();
}, false );

// Initialisation de la carte google //
function initMaps() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 43.3036943, lng: 5.4098},
        zoom: 10
    });


    const Station = {
        nom: null,
        adresse: null,
        etat: null,
        nbVelo: null,
        nbAttache: null,
        emplacementDonnees: document.getElementById("liste-info").querySelectorAll("span"),
        autorisation: null,

        // Méthode Ajax qui permet de récupérer la liste des stations Vélib'
        ajaxGet: function (url, callback) {
            req = new XMLHttpRequest();
            req.open("GET", url);
            req.addEventListener("load", function () {
                if (req.status >= 200 && req.status < 400) {
                    callback(req.responseText);
                } else {
                    console.error(req.status + " " + req.statusText + " " + url);
                }
            });
            req.addEventListener("error", function () {
                console.error("Erreur réseau avec l'URL " + url);
            });
            req.send(null);
        },

    };

    Station.ajaxGet("https://api.jcdecaux.com/vls/v1/stations?contract=Marseille&apiKey=2f70d086ae715fc9bd256666c718da41fc3c7b92", function (reponse) {

        const listeStations = JSON.parse(reponse);

        const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        const markers = [];
        $.each(listeStations, function(i, station) {
            const marker = new google.maps.Marker({
                position: station.position,
                label: labels[i % labels.length]
            });
            google.maps.event.addListener(marker, 'click', function() {
                if(station.banking && station.available_bikes > 0) {
                    $("#boutton-reservation").removeAttr('disabled');
                    $("#message-erreur").attr("hidden", "true");
                }else {
                    $("#message-erreur").removeAttr("hidden");
                    $("#boutton-reservation").attr('disabled', "true");

                }
                $("#nom-station").html(station.name);
                $("#adresse-station").html(station.position);
                $("#adresse-station").html(station.address);
                $("#etat-station").html(station.banking ? 'ouverte' : 'fermée');
                $("#velo-dispo").html(station.available_bikes);
                $("#attache-dispo").html(station.available_bike_stands);
            });
            markers.push(marker);
        });

        const markerCluster = new MarkerClusterer(map, markers,
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
    });
}

