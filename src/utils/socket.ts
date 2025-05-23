import {io, Socket} from 'socket.io-client';

// Define the TypeScript type for the socket
export interface ServerToClientEvents {
  message: (data: string) => void;
  chatCreated: (data: any) => void;
  messageSent: (data: any) => void;
  newPrivateMessage: (data: any) => void;
  userTyping: (data: any) => void;
  userStoppedTyping: (data: any) => void;
  userJoined: (data: any) => void;
  userLeft: (data: any) => void;
  typing: (data: any) => void;
  stopTyping: (data: any) => void;
}

export interface ClientToServerEvents {
  sendPrivateMessage: (data: any) => void;
  initiateChat: (data: any) => void;
  joinPrivateChat: (data: any) => void;
  typing: (data: any) => void;
  stopTyping: (data: any) => void;
  read: (data: any) => void;
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
