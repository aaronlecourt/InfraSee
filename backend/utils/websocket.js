import { useEffect, useRef } from 'react';

const useWebSocket = (url, handleWebSocketUpdate, parseData) => {
  useEffect(() => {
    const socket = new WebSocket(url);

    socket.onopen = () => console.log('WebSocket connection established');

    socket.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);
        console.log('New Data from WebSocket:', newData);

        const parsedData = parseData(newData);
        handleWebSocketUpdate(newData, parsedData);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    socket.onclose = () => console.log('WebSocket connection closed');

    return () => {
      socket.close();
    };
  }, [url, handleWebSocketUpdate, parseData]);
};

export default useWebSocket;
