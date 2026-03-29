/**
 * WebSocket fan-out for real-time approval updates (used by server.js).
 */
import { WebSocketServer } from 'ws';

export function attachWebSocket(httpServer, path = '/ws') {
  const wss = new WebSocketServer({ server: httpServer, path });

  wss.on('connection', (socket) => {
    socket.send(JSON.stringify({ type: 'connected', ts: Date.now() }));
  });

  return {
    broadcast: (payload) => {
      const data = typeof payload === 'string' ? payload : JSON.stringify(payload);
      for (const client of wss.clients) {
        if (client.readyState === 1) client.send(data);
      }
    },
    close: () => wss.close(),
  };
}
