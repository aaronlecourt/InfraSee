import { wss } from "../server.js";

export const loggerMiddleware = (req, res, next) => {
  const originalSend = res.send.bind(res);

  // Log the request details
  console.log(`${req.method} ${req.originalUrl}`);

  // Capture the response data
  res.send = (body) => {
    // Log the response details
    console.log(`Response: ${body}`);

    // Prepare the log data
    const logData = {
      method: req.method,
      url: req.originalUrl,
      responseBody: body,
      timestamp: new Date().toISOString(),
    };

    // Broadcast to all WebSocket clients
    wss.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify(logData));
      }
    });

    // Call the original send function
    return originalSend(body);
  };

  next();
};
