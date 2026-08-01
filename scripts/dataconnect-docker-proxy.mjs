import net from 'node:net';

const PUBLIC_HOST = '0.0.0.0';
const PUBLIC_PORT = 9400;
const EMULATOR_HOST = '127.0.0.1';
const EMULATOR_PORT = 9399;

const server = net.createServer((clientSocket) => {
  const emulatorSocket = net.createConnection({
    host: EMULATOR_HOST,
    port: EMULATOR_PORT,
  });

  emulatorSocket.once('connect', () => {
    clientSocket.pipe(emulatorSocket);
    emulatorSocket.pipe(clientSocket);
  });

  emulatorSocket.on('error', (error) => {
    if (error.code !== 'ECONNREFUSED') {
      console.error('[proxy] Falha na conexão com o SQL Connect:', error.message);
    }
    clientSocket.destroy();
  });

  clientSocket.on('error', () => emulatorSocket.destroy());
  clientSocket.on('close', () => emulatorSocket.destroy());
});

server.listen(PUBLIC_PORT, PUBLIC_HOST, () => {
  console.log(
    `[proxy] SQL Connect exposto em ${PUBLIC_HOST}:${PUBLIC_PORT} ` +
      `e encaminhado para ${EMULATOR_HOST}:${EMULATOR_PORT}.`,
  );
});

function shutdown() {
  server.close(() => process.exit(0));
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
