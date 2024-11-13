const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;

      // Adding a small offset to create distinguishable markers
      const offset = (parseInt(socket.id.slice(-3), 16) % 50) * 0.0001; // creates a small, unique offset based on the socket ID
      const modifiedLatitude = latitude + offset;
      const modifiedLongitude = longitude + offset;

      socket.emit("send-location", {
        latitude: modifiedLatitude,
        longitude: modifiedLongitude,
      });
    },
    (error) => {
      console.error(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
}

const map = L.map("map").setView([0, 0], 16);

// Add the OpenStreetMap tiles to your map
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "Avinash",
}).addTo(map);

const markers = {};

socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;

  // Set the map view to the latest position received (optional)
  map.setView([latitude, longitude]);

  // Update marker if it exists, or create a new one if it doesn’t
  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude])
      .addTo(map)
      .bindPopup(`User: ${id}`);
  }
});

socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});
