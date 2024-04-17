// Initialize the map
var myMap = L.map("map", {
    center: [0, 0],
    zoom: 2
});

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// GeoJSON URL for "All Earthquakes from the Past 7 Days"
var geojsonURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Fetch the earthquake data from the GeoJSON URL using Fetch API
fetch(geojsonURL)
    .then(response => response.json())
    .then(data => {
        // Function to determine marker size based on earthquake magnitude
        function markerSize(magnitude) {
            return magnitude * 5;
        }

        // Function to determine marker color based on earthquake depth
        function markerColor(depth) {
            // Convert depth to a value between 0 and 1 for gradient calculation
            var normalizedDepth = (depth + 10) / 100; // Normalize depth to range from -10 to 90
            // Calculate color gradient from green (#00FF00) to yellow (#FFFF00) to orange (#FFA500) to light red (#FF9999)
            var r, g, b;
            if (normalizedDepth < 0) {
                r = 0;
                g = 255;
            } else if (normalizedDepth < 0.5) {
                r = 255;
                g = Math.round(255 * (normalizedDepth * 2));
            } else {
                r = Math.round(255 * (1 - (normalizedDepth - 0.5) * 2));
                g = 255;
            }
            b = 0;
            return '#' + (0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1);
        }

        // Create a GeoJSON layer with the earthquake data
        var earthquakes = L.geoJSON(data.features, {
            pointToLayer: function(feature, latlng) {
                var marker = L.circleMarker(latlng, {
                    radius: markerSize(feature.properties.mag),
                    fillColor: markerColor(feature.geometry.coordinates[2]),
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
                marker.bindPopup("<h3>" + feature.properties.place +
                    "</h3><hr><p>Magnitude: " + feature.properties.mag +
                    "<br>Depth: " + feature.geometry.coordinates[2] + " km</p>");
                return marker;
            }
        }).addTo(myMap);

        // Legend
        var legend = L.control({ position: "bottomright" });

        legend.onAdd = function() {
            var div = L.DomUtil.create("div", "info legend"),
                depths = [-10, 10, 30, 50, 70, 90], // Adjusted depth intervals
                labels = [];

            // Loop through the depth intervals and generate a label with a colored square for each interval
            for (var i = 0; i < depths.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + markerColor(depths[i] + 1) + '"></i> ' +
                    depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' <br>' : '+');
            }

            return div;
        };

        legend.addTo(myMap);
    })
    .catch(error => console.error('Error fetching earthquake data:', error));



