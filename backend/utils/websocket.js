import { useEffect, useRef, useCallback } from 'react';

const useWebSocket = (url, handleWebSocketUpdate, parseData) => {
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const isReconnecting = useRef(false); // Track if a reconnect attempt is in progress

  const connectWebSocket = useCallback(() => {
    // Create a new WebSocket connection
    socketRef.current = new WebSocket(url);

    socketRef.current.onopen = () => {
      console.log('WebSocket connection established');
      clearTimeout(reconnectTimeoutRef.current); // Clear reconnection timeout
      isReconnecting.current = false; // Reset reconnection state
    };

    socketRef.current.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);
        console.log('New Data from WebSocket:', newData);

        const parsedData = parseData(newData);
        handleWebSocketUpdate(newData, parsedData);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    socketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socketRef.current.onclose = () => {
      if (!isReconnecting.current) { // Only log if not already reconnecting
        console.log('WebSocket connection closed. Attempting to reconnect...');
        isReconnecting.current = true; // Set reconnecting state
      }
      reconnectWebSocket(); // Attempt to reconnect
    };
  }, [url, handleWebSocketUpdate, parseData]);

  const reconnectWebSocket = () => {
    // Attempt to reconnect after a delay
    reconnectTimeoutRef.current = setTimeout(() => {
      console.log('Reconnecting to WebSocket...');
      connectWebSocket();
    }, 3000); // Adjust delay as needed (e.g., 3 seconds)
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      clearTimeout(reconnectTimeoutRef.current); // Clear timeout on unmount
    };
  }, [connectWebSocket]);

  return socketRef.current; // Optional: return socket instance for further management if needed
};

export default useWebSocket;
