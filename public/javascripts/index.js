$(document).ready(function () {
  var temperatureData = [];
  var coordinateData = [];
  //Get the context of the canvas element we want to select
  var ctx = document.getElementById("myCanvas").getContext("2d");


  var ws = new WebSocket('wss://' + location.host);
  console.log(location.host);
  ws.onopen = function () {
    console.log('Successfully connect WebSocket');
  }
  mapboxgl.accessToken = 'pk.eyJ1IjoiYW1yOTciLCJhIjoiY2pnZGNtZTZiMDdhNTJ4cWFheHo2MTcxbSJ9.HbYDR0RfFKdul5e7xIAunA';
  var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v10',
      center: [77.575947,28.526013],
      zoom: 17
  });
  map.on('load', function () {
      map.addLayer({
          "id": "route",
          "type": "line",
          "source": {
              "type": "geojson",
              "data": {
                  "type": "Feature",
                  "properties": {},
                  "geometry": {
                      "type": "LineString",
                      "coordinates": coordinateData
                  }
              }
          },
          "layout": {
              "line-join": "round",
              "line-cap": "round"
          },
          "paint": {
              "line-color": "yellow",
              "line-opacity": 0.75,
              "line-width": 5
          }
      });
  });
  ws.onmessage = function (message) {
    console.log('receive message' + message.data);
    try {
      var obj = JSON.parse(message.data);
      if(!obj.temperature || !obj.coordinates)
          return;
      temperatureData.push(obj.temperature);
      coordinateData.push(obj.coordinates);
      draw(obj.temperature);
    } catch (err) {
      console.error(err);
    }
  }
    var timer = window.setInterval(function() {
            map.getSource('route').setData({
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "LineString",
                    "coordinates": coordinateData
                }
            });
            map.panTo(coordinateData[coordinateData.length-1],{
            "duration": 200,
            "animate": true
        });


    }, 2000);
});
