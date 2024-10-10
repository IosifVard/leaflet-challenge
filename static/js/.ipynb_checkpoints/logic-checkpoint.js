// Initialize the maps
const map = L.map('map').setView([32.411, -102.057], 5); // Centered on Texas

// Add a tile layer (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// GeoJSON URL for USGS earthquake data (past month)
const earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

// Function to set the color based on earthquake depth
function getColor(depth) {
    return depth > 90 ? '#800026' :
           depth > 70 ? '#BD0026' :
           depth > 50 ? '#E31A1C' :
           depth > 30 ? '#FC4E2A' :
           depth > 10 ? '#FD8D3C' :
                        '#FFEDA0';
}

// Function to set the radius based on earthquake magnitude
function getRadius(mag) {
    return mag === 0 ? 1 : mag * 4;    // If magnitude is 0, use radius of 1; otherwise, scale by 4
}

// Load GeoJSON data using D3
d3.json(earthquakeUrl).then(function(data) {

     // Add GeoJSON layer to the map
    L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: getRadius(feature.properties.mag), // Set the marker radius based on magnitude
                fillColor: getColor(feature.geometry.coordinates[2]), // Set the marker color based on depth
                color: '#000', // Border color of the marker
                weight: 1, // Border thickness
                opacity: 1,
                fillOpacity: 0.8 // Opacity of the circle marker
            });
        },

        // Create popups for each earthquake marker
        onEachFeature: function (feature, layer) {
            layer.bindPopup(`
                <h3>${feature.properties.title}</h3>
                <p>Magnitude: ${feature.properties.mag}</p>
                <p>Location: ${feature.properties.place}</p>
                <p>Depth: ${feature.geometry.coordinates[2]} km</p>
                <p><a href="${feature.properties.url}" target="_blank">More Info</a></p>
            `);
        }
    }).addTo(map);

}).catch(function(error) {
    console.error("Error loading the GeoJSON data:", error);
});