import { useEffect, useState, useCallback } from "react";
import { initializeSocket, emitEvent, onEvent, cleanupSocket, SOCKET } from "../util/socketClient";
import { useSocketStore } from '../stores/socketStore';

// Custom hook to handle socket connection and status
const url = _SOCKET_URL_;

export const useSocket = (options = {}) => {
  const [socketStatus, setSocketStatus] = useState(SOCKET.CONNECTING);

  useEffect(() => {
    const onStatusChange = (status) => {
      setSocketStatus(status);
    };

    // Initialize socket connection and pass the status change callback
    initializeSocket(url, options, onStatusChange);

    return () => {
      //   cleanupSocket();
    };
  }, [url, options]);

  const emit = (event, data) => emitEvent(event, data);
  const listen = (event, callback) => onEvent(event, callback);

  return { emit, listen, socketStatus };
};

// Socket Query Hook (handles real-time data fetching)
export const useSocketQuery = (event, append = false) => {
  const [data, setData] = useState([]);
  const { listen, socketStatus } = useSocketStore(); // Get listen function from the store

  useEffect(() => {
    const handleDataWrapper = (newData) => {
      if (append) {
        setData((prevData) => [...prevData, ...newData]); // Append new data
      } else {
        setData(newData); // Replace previous data
      }
    };

    // Start listening to the event
    const unsubscribe = listen(event, handleDataWrapper);

    // Cleanup on unmount or event change
    return () => {
      unsubscribe(); // Cleanup the listener
    };
  }, [event, append, listen, socketStatus]); // Dependencies include event, append, and listen

  return {
    data, // Return the accumulated or replaced data
  };
};
