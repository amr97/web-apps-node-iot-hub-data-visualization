$(document).ready(function () {
  var timeData = [],
    temperatureData = [],
    humidityData = [];

  //Get the context of the canvas element we want to select
  var ctx = document.getElementById("myCanvas").getContext("2d");


  var ws = new WebSocket('wss://' + location.host);
  console.log(location.host);
  ws.onopen = function () {
    console.log('Successfully connect WebSocket');
  }
  ws.onmessage = function (message) {
    console.log('receive message' + message.data);
    try {
      var obj = JSON.parse(message.data);
      temperatureData.push(obj.temperature);

      draw(obj.temperature);
    } catch (err) {
      console.error(err);
    }
  }
});
