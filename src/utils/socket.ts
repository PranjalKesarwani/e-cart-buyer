import {io, Socket} from 'socket.io-client';

// Define the TypeScript type for the socket
export interface ServerToClientEvents {
  message: (data: string) => void;
}

export interface ClientToServerEvents {
  sendMessage: (data: string) => void;
}

const SOCKET_URL = 'http://10.0.2.2:8080'; // Replace with your backend URL

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  SOCKET_URL,
  {
    transports: ['websocket'], // Ensures it works in React Native
    reconnection: true, // Auto-reconnect
    reconnectionAttempts: 5,
    timeout: 10000,
  },
);

export default socket;
