
var mymap = L.map('mapid').setView([ 37.8,-96], 4);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoibW9zdGFxdWltIiwiYSI6ImNqN2ZlcGY0NzB4bmkzMm8zZHc5a3F5dzMifQ.aq_Hta6L-_t8zYouQ46GDw'
}).addTo(mymap);
var geojson;
function getColor(d) {
    return d > 1000 ? '#800026' :
           d > 500  ? '#BD0026' :
           d > 200  ? '#E31A1C' :
           d > 100  ? '#FC4E2A' :
           d > 50   ? '#FD8D3C' :
           d > 20   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      '#FFEDA0';
}
function style(feature) {
    return {
        fillColor: getColor(feature.properties.density),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    }
}
function highlightFeature(e) {
    var layer = e.target;
    layer.setStyle({
        weight:5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7,
        
    });
    info.update(layer.feature.properties);
                  
     if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}
function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}
function zoomToFeature(e) {
    mymap.fitBounds(e.target.getBounds());
}
function onEachFeature(feature,layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
        
    })
}

geojson = L.geoJson(statesData, {style:style,
                      onEachFeature: onEachFeature}).addTo(mymap);

var info = L.control();

info.onAdd = function (mymap) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>US Population Density</h4>' +  (props ?
        '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
        : 'Hover over a state');
};

info.addTo(mymap);