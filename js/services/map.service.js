'use strict'

import { storageService } from "./storage.service.js"

export const mapService = {
    initMap,
    addMarker,
    panTo,
    searchByAddress,
    getGeoLocation,
    getSelectedLocation,
    getMap,
    updateSelectedLocation,
    saveLocation,
    getSavedLocations,
    deleteSavedLocation
}


var gSelectedLocation;


const STORAGE_KEY = 'locationDB'
var gSavedLocations = storageService.load(STORAGE_KEY) || []
var gMap;


function initMap(lat = 32.0749831, lng = 34.9120554) {
    return _connectGoogleApi()
        .then(() => {
            gMap = new google.maps.Map(
                    document.querySelector('#map'), {
                        center: { lat, lng },
                        zoom: 15
                    })
            // gMap.addListener('click', (mapsMouseEvent) => {
            // const clickedLatLng = mapsMouseEvent.latLng.toJSON()
            // gSelectedLocation.pos = clickedLatLng
            //     getGeoLocation(`latlng=${clickedLatLng.lat},${clickedLatLng.lng}`)
            //          .then(res => {gSelectedLocation.name = res.results[0].formatted_address
            //         })
            // })
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

function searchByAddress(address) {
    if (!address) return
    const geoAddress = 'address=' + address.split(' ').join('+')
    getGeoLocation(geoAddress)
        .then(res => res.results[0])
        .then(res => {
            const latlng = {lat:res.geometry.location.lat,lng:res.geometry.location.lng}
            panTo(latlng.lat, latlng.lng)
        })
}

function updateSelectedLocation(value){
    gSelectedLocation = value
}

function getGeoLocation(val) {
    const KEY = 'AIzaSyCh7uEfaluv0jigSn1ekRejf2X82OlYxP0'
    var url = `https://maps.googleapis.com/maps/api/geocode/json?${val}&key=${KEY}` //'latlng=40.714224,-73.961452'
    return axios.get(url)
        .then(res => res.data)
}

function getSelectedLocation() {
    return gSelectedLocation
}

function getMap() {
    return gMap
}

function saveLocation(){
    if(!gSelectedLocation) return
    gSavedLocations.push(gSelectedLocation)
    console.log('pushed!', gSavedLocations)
    storageService.save(STORAGE_KEY,gSavedLocations)
}

function getSavedLocations(){
    return gSavedLocations
}

function deleteSavedLocation(savedLocationName) {
    console.log('savedLocationName',savedLocationName)
    console.log('gSavedLocations',gSavedLocations);
    const idx = gSavedLocations.findIndex((location)=> location.name === savedLocationName)
    gSavedLocations.splice(idx, 1)
    storageService.save(STORAGE_KEY, gSavedLocations)
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


