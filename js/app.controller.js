import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'


window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onSubmitSearch = onSubmitSearch
window.onGetGeoLocation = onGetGeoLocation
window.toCurrLocation = toCurrLocation
window.onMapClick = onMapClick
window.onCopy = onCopy
window.goToSavedLocation = goToSavedLocation


function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready')
                // renderLocationTitle()
        })
        .catch(() => console.log('Error: cannot init map'))
}

function onGetGeoLocation() { // FOR TESTING NEED TO DELETE!!!!
    mapService.getGeoLocation()
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    console.log('Adding a marker');
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs)
            document.querySelector('.locs').innerText = JSON.stringify(locs)
        })
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}

function onPanTo(lat, lng) {
    console.log('Panning the Map');
    mapService.panTo(lat, lng);
}

function onSubmitSearch(ev) {
    ev.preventDefault()
    mapService.searchByAddress(document.querySelector('form input').value)
}

function toCurrLocation() {
    navigator.geolocation.getCurrentPosition(res => onPanTo(res.coords.latitude, res.coords.longitude))
}

function renderLocationTitle(name) {
    const strHtml = `<span>Location:</span> ${name}`
    document.querySelector('.location-title').innerHTML = strHtml
}

function onMapClick() {
    const map = mapService.getMap()
    map.addListener('click', (mapsMouseEvent) => {
        const clickedLatLng = mapsMouseEvent.latLng.toJSON()
        mapService.getGeoLocation(`latlng=${clickedLatLng.lat},${clickedLatLng.lng}`)
            .then(res => {

                const selectedLocation = {name:res.results[0].formatted_address,latlng:res.results[0].geometry.location}
                mapService.updateSelectedLocation(selectedLocation)
                renderLocationTitle(selectedLocation.name)
            })
    })
}

function onCopy(){
    mapService.saveLocation()

}
    
function goToSavedLocation() {
    const savedLocation = document.querySelector('.saved-list').value
    mapService.searchByAddress(savedLocation)
}