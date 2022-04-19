'use strict'

export const mapService = {
    initMap,
    addMarker,
    panTo,
    searchByAddress,
    getGeoLocation
}

var gMap;

function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap');
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                    center: { lat, lng },
                    zoom: 15
                })
            console.log('Map!', gMap);
        })
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    });
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}

function searchByAddress(address){
    if (!address) return
    const geoAddress = 'address=' +address.split(' ').join('+')
    getGeoLocation(geoAddress)
        // .then()
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyCh7uEfaluv0jigSn1ekRejf2X82OlYxP0'; //TODO: Enter your API Key
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

function getGeoLocation(val) {
    const KEY = 'AIzaSyCh7uEfaluv0jigSn1ekRejf2X82OlYxP0'
    var url = `https://maps.googleapis.com/maps/api/geocode/json?${val}&key=${KEY}` //'latlng=40.714224,-73.961452'
    return axios.get(url)
        .then(res => res.data)
}