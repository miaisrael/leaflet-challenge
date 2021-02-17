// Creating map object
var myMap = L.map("map", {
    center: [35.7465, 39.4629],
    zoom: 3
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
  
    // Add functions for data markers: depth (color) and magnitude (size)
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
            return "#8B0000";
          case mag > 4:
            return "#FF0000";
          case mag > 3:
            return "#FFA500";
          case mag > 2:
            return "#FFD700";
          case mag > 1:
            return "#ADFF2F";
          default:
            return "#00FFFF";
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
    
        // Binding a pop-up to each layer (magnitude and location)
        onEachFeature: function(feature, layer) {
          layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    
        }
      }).addTo(myMap);

  
    // Set up the legend
    var legend = L.control({position: 'bottomleft'});
    legend.onAdd = function (map) {
    
    var div = L.DomUtil.create('div', 'info legend');
    labels = ['<strong>Magnitudes</strong>'],
    categories = ['0-1','1-2','2-3','3-4', '4-5'];
    
    for (var i = 0; i < categories.length; i++) {
    
            div.innerHTML += 
            labels.push(
                '<i class="circle" style="background:' + getColor(categories[i]) + '"></i> ' +
            (categories[i] ? categories[i] : '+'));
    
        }
        div.innerHTML = labels.join('<br>');
    return div;
    };
    legend.addTo(map);
  
  });
  