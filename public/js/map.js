mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 14 // starting zoom
});

// create a HTML element for each feature
const el = document.createElement('div');
el.className = 'marker';

// adds a marker on map 
const marker = new mapboxgl.Marker(el)
    .setLngLat(listing.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 }) // add popups
            .setHTML(
                `<h3>${listing.location}</h3><p>Full address provided after booking.</p>`
            )
    )
    .addTo(map);

