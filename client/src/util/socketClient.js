import _ from "lodash";
import { io } from "socket.io-client";

// Singleton Socket Manager
class SocketManager {
  constructor() {
    if (SocketManager.instance) {
      return SocketManager.instance;
    }
    
    this.socket = null;
    this.statusCallback = null;
    this.retryAttempts = 0;
    this.reconnectTimer = null;
    this.url = null;
    this.options = null;
    this.listeners = new Map(); // Added to track listeners
    
    SocketManager.instance = this;
  }

  // Socket connection status states
  SOCKET_STATUS = {
    CONNECTING: "connecting",
    CONNECTED: "connected",
    DISCONNECTED: "disconnected",
    RECONNECTING: "reconnecting",
    RECONNECTED: "reconnected",
  };

  // Initialize Socket connection
  initializeSocket(url, options = {}, onStatusChange) {
    // Prevent duplicate initialization with different URLs
    if (this.socket && this.url && this.url !== url) {
      console.warn("Socket already initialized with different URL. Use cleanupSocket first.");
      return;
    }

    if (this.socket && this.socket.connected) {
      // console.log("Socket already connected");
      if (typeof onStatusChange === "function") {
        onStatusChange(this.SOCKET_STATUS.CONNECTED);
      }
      return;
    }

    this.url = url;
    this.options = options;

    this.socket = io(url, {
      ...options,
      path: _SOCKET_PATH_,
      transports: _SOCKET_TRANSPORTS_,
      autoConnect: true,
      forceNew: false,
      reconnection: true,
      timeout: 10000,
    });

    this.setupSocketListeners(url, options, onStatusChange);

    if (typeof onStatusChange === "function") {
      this.statusCallback = onStatusChange;
      onStatusChange(this.socket.connected ? this.SOCKET_STATUS.CONNECTED : this.SOCKET_STATUS.CONNECTING);
    }
  }

  // Setup socket event listeners
  setupSocketListeners(url, options, onStatusChange) {
    this.socket.on("connect", () => {
      this.retryAttempts = 0;
      clearTimeout(this.reconnectTimer);
      if (this.statusCallback) {
        const status = this.retryAttempts > 0 ? this.SOCKET_STATUS.RECONNECTED : this.SOCKET_STATUS.CONNECTED;
        this.statusCallback(status);
      }
      this.reattachListeners(); // Ensure listeners are attached on connect
    });

    this.socket.on("disconnect", (reason) => {
      if (this.statusCallback) {
        this.statusCallback(this.SOCKET_STATUS.DISCONNECTED);
      }
      this.handleReconnection(url, options);
    });

    this.socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      if (this.statusCallback) {
        this.statusCallback(this.SOCKET_STATUS.RECONNECTING);
      }
      this.handleReconnection(url, options);
    });

    this.socket.on("error", (error) => {
      console.error("Socket error:", error);
      this.handleReconnection(url, options);
    });
  }

  // Reattach preserved listeners to new socket instance
  reattachListeners() {
    if (!this.socket || !this.listeners) return;
    
    this.listeners.forEach((callback, event) => {
      this.socket.off(event); // Remove any existing listeners to prevent duplicates
      this.socket.on(event, callback);
    });
  }

  // Handle reconnection logic
  handleReconnection(url, options) {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    if (this.socket && this.socket.connected) {
      return;
    }

    this.retryAttempts++;
    // console.log(`Reconnection attempt ${this.retryAttempts}`);

    this.reconnectTimer = setTimeout(() => {
      if (this.statusCallback) {
        this.statusCallback(this.SOCKET_STATUS.RECONNECTING);
      }

      if (this.socket) {
        this.socket.disconnect();
        this.socket = null;
      }

      this.socket = io(url, {
        ...options,
        path: _SOCKET_PATH_,
        transports: _SOCKET_TRANSPORTS_,
        autoConnect: true,
        forceNew: false,
        timeout: 10000,
      });

      this.setupSocketListeners(url, options);
      // Listeners will be reattached in the 'connect' event handler
    }, 10000); // RETRY_DELAY
  }

  // Emit event
  emitEvent(event, data) {
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn(`Cannot emit '${event}' - Socket not connected`);
    }
  }

  // Listen to events
  onEvent(event, callback) {
    if (this.socket) {
      const wrappedCallback = (...args) => {
        try {
          callback(...args);
        } catch (error) {
          console.error(`Error in socket event '${event}':`, error);
        }
      };
      
      this.socket.on(event, wrappedCallback);
      this.listeners.set(event, wrappedCallback);
    }
  }

  // Remove specific event listener
  offEvent(event) {
    if (this.socket && this.listeners.has(event)) {
      this.socket.off(event);
      this.listeners.delete(event);
    }
  }

  // Cleanup socket connection
  cleanupSocket() {
    if (this.socket) {
      clearTimeout(this.reconnectTimer);
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
      this.retryAttempts = 0;
      this.url = null;
      this.options = null;
      this.statusCallback = null;
      this.listeners = new Map();
    }
  }

  // Get current socket status
  getSocketStatus() {
    if (!this.socket) return this.SOCKET_STATUS.DISCONNECTED;
    return this.socket.connected ? this.SOCKET_STATUS.CONNECTED : this.SOCKET_STATUS.DISCONNECTED;
  }
}

// Create singleton instance
const socketManager = new SocketManager();

// Export functions using the singleton instance
export const initializeSocket = (url, options, onStatusChange) => 
  socketManager.initializeSocket(url, options, onStatusChange);

export const emitEvent = (event, data) => 
  socketManager.emitEvent(event, data);

export const onEvent = (event, callback) => 
  socketManager.onEvent(event, callback);

export const offEvent = (event) => 
  socketManager.offEvent(event);

export const cleanupSocket = () => 
  socketManager.cleanupSocket();

export const getSocketStatus = () => 
  socketManager.getSocketStatus();

export const SOCKET = socketManager.SOCKET_STATUS;