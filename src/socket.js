// socket.js

import io from "socket.io-client";

const socket = io.connect("http://localhost:4000"); // Initialize socket connection

export default socket;
