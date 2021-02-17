// Creating map object
var myMap = L.map("map", {
    center: [34.0522, -118.2437],
    zoom: 8
  });
  
  // Adding tile layer
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);
  
  // Load in geojson data
  var geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
  
  var geojson;
  
  // Grab data with d3
  d3.json(geoData, function(data) {
  
    // Add functions for magnitude and depth
    function mapStyle(feature) {
        return {
          opacity: 1,
          fillOpacity: 1,
          fillColor: mapColor(feature.properties.mag),
          color: "#000000",
          radius: mapRadius(feature.properties.mag),
          stroke: true,
          weight: 0.5
        };
      }
      function mapColor(mag) {
        switch (true) {
          case mag > 5:
            return "#ea2c2c";
          case mag > 4:
            return "#eaa92c";
          case mag > 3:
            return "#d5ea2c";
          case mag > 2:
            return "#92ea2c";
          case mag > 1:
            return "#2ceabf";
          default:
            return "#2c99ea";
        }
      }
    
      function mapRadius(mag) {
        if (mag === 0) {
          return 1;
        }
    
        return mag * 4;
      }
    
      L.geoJson(data, {
    
        pointToLayer: function(feature, latlng) {
          return L.circleMarker(latlng);
        },
    
        style: mapStyle,
    
        // Binding a pop-up to each layer
        onEachFeature: function(feature, layer) {
          layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    
        }
      }).addTo(myMap);

  
    // Set up the legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
      var limits = geojson.options.limits;
      var colors = geojson.options.colors;
      var labels = [];
  
      // Add min & max
      var legendInfo = "<h1>Median Income</h1>" +
        "<div class=\"labels\">" +
          "<div class=\"min\">" + limits[0] + "</div>" +
          "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
        "</div>";
  
      div.innerHTML = legendInfo;
  
      limits.forEach(function(limit, index) {
        labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
      });
  
      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
    };
  
    // Adding legend to the map
    legend.addTo(myMap);
  
  });
  