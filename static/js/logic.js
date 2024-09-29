<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>USGS Earthquake Map</title>
    <!-- Leaflet CSS and JS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
    <style>
        #map {
            height: 600px;
            width: 100%;
        }
    </style>
</head>
<body>

    <h1>Significant Earthquakes: Past Month</h1>
    <div id="map"></div>

    <script>
        // Initialize the maps
        const map = L.map('map').setView([32.411, -102.057], 5); // Centered on Texas

        // Add a tile layer (OpenStreetMap)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Earthquake data (GeoJSON format)
        const earthquakeData = {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": {
                        "mag": 5.1,
                        "place": "2024 North of Tarzan, Texas Earthquake",
                        "time": 1726534182183,
                        "felt": 2073,
                        "cdi": 6.4,
                        "mmi": 5.148,
                        "alert": "green",
                        "sig": 1040,
                        "url": "https://earthquake.usgs.gov/earthquakes/eventpage/tx2024shcj",
                        "title": "M 5.1 - 2024 North of Tarzan, Texas Earthquake"
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [-102.057, 32.411, 6.1279]
                    },
                    "id": "tx2024shcj"
                }
            ]
        };

        // Function to set color based on depth
        function getColor(depth) {
            return depth > 90 ? '#800026' :
                   depth > 70 ? '#BD0026' :
                   depth > 50 ? '#E31A1C' :
                   depth > 30 ? '#FC4E2A' :
                   depth > 10 ? '#FD8D3C' :
                                '#FFEDA0';
        }

        // Function to set radius based on magnitude
        function getRadius(mag) {
            return mag === 0 ? 1 : mag * 4;
        }

        // Add the earthquake marker to the map
        L.geoJSON(earthquakeData, {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: getRadius(feature.properties.mag),
                    fillColor: getColor(feature.geometry.coordinates[2]), // Depth
                    color: '#000',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            },
            onEachFeature: function (feature, layer) {
                layer.bindPopup(`<h3>${feature.properties.title}</h3>
                                 <p>Magnitude: ${feature.properties.mag}</p>
                                 <p>Location: ${feature.properties.place}</p>
                                 <p>Felt by: ${feature.properties.felt} people</p>
                                 <p>Depth: ${feature.geometry.coordinates[2]} km</p>
                                 <p><a href="${feature.properties.url}" target="_blank">More Info</a></p>`);
            }
        }).addTo(map);
    </script>

</body>
</html>
