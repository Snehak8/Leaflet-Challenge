# Leaflet-Challenge

This project visualizes earthquake data on an interactive map using Leaflet, a JavaScript library for mapping. It fetches earthquake data from the USGS API in GeoJSON format and plots the earthquakes as circle markers on the map

Map Initialization: Leaflet map is initialized with a base layer from OpenStreetMap.

Data Fetching: Earthquake data is fetched in GeoJSON format from the USGS API for the past week.

Marker Size and Color: Functions are defined to determine marker size based on magnitude and color based on depth, creating a gradient from neon green to light red.

GeoJSON Layer: Earthquake data is plotted on the map as circle markers, with popup information displaying place, magnitude, and depth.
