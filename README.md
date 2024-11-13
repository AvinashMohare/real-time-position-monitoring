# Real-Time Tracking App

A real-time location tracking application built with Node.js, Express, Socket.io, and Leaflet.js that enables multiple users to share and view their locations on an interactive map. Each user's position is represented by a marker that updates in real-time as they move.

## Features

- 📍 Real-time location tracking using the Geolocation API
- 🗺️ Interactive map interface powered by Leaflet.js
- 👥 Support for multiple simultaneous users
- 🔄 Bi-directional real-time communication via Socket.io
- 🚫 Automatic cleanup of disconnected user markers
- 📱 Responsive design that works on both desktop and mobile devices

## Prerequisites

Before you begin, ensure you have installed:

- Node.js (v14.0.0 or higher)
- npm (usually comes with Node.js)
- Git

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/real-time-tracking-app.git
   cd real-time-tracking-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   node app.js
   ```

4. Access the application:
   - Open your web browser
   - Navigate to `http://localhost:3000`

## Project Structure

```
.
├── public/                 # Static assets directory
│   ├── css/               # CSS stylesheets
│   │   └── style.css      # Main stylesheet
│   └── js/                # Client-side JavaScript
│       └── script.js      # Main client logic
├── views/                 # Template files
│   └── index.ejs         # Main HTML template
├── app.js                # Server entry point
├── package.json          # Project dependencies
└── README.md            # This documentation
```

## How It Works

### Server-Side (app.js)

The server is built with Express and Socket.io to handle real-time communication:

```javascript
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  // Handle new connections
  socket.on('send-location', (location) => {
    // Broadcast location to other clients
    socket.broadcast.emit('receive-location', {
      id: socket.id,
      location: location
    });
  });

  socket.on('disconnect', () => {
    // Remove disconnected user's marker
    socket.broadcast.emit('user-disconnected', socket.id);
  });
});
```

### Client-Side (script.js)

The client uses the Geolocation API and Leaflet.js to handle mapping:

```javascript
// Initialize Leaflet map
const map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Connect to Socket.io
const socket = io();

// Track and send location updates
navigator.geolocation.watchPosition((position) => {
  const location = {
    lat: position.coords.latitude,
    lng: position.coords.longitude
  };
  socket.emit('send-location', location);
});
```

## Features in Detail

### Real-Time Location Tracking

- Uses the browser's Geolocation API to get user coordinates
- Implements `watchPosition()` for continuous location updates
- Handles location permission requests gracefully

### Map Implementation

- Leaflet.js provides the map interface
- Custom markers indicate user positions
- Smooth marker transitions for location updates
- Automatic map centering on user's location

### Socket Communication

- Bi-directional real-time updates via Socket.io
- Efficient broadcasting of location changes
- Automatic handling of disconnections
- Minimal latency for position updates

## Browser Support

- Chrome 50+
- Firefox 50+
- Safari 10+
- Edge 79+
- Opera 36+

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Leaflet.js for the amazing mapping library
- Socket.io team for the real-time engine
- OpenStreetMap contributors for map data

## Support

For support, email support@yourdomain.com or open an issue in the GitHub repository.
