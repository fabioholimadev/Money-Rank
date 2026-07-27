import {
  connectDataConnectEmulator,
  getDataConnect,
} from 'firebase/data-connect';
import { connectorConfig } from '@money-rank/dataconnect';
import { firebaseApp } from './firebaseConfig';

function isEnabled(value) {
  return value === 'true';
}

function getEmulatorPort(value) {
  const parsedPort = Number.parseInt(value, 10);
  return Number.isInteger(parsedPort) && parsedPort > 0
    ? parsedPort
    : 9399;
}

export const isDataConnectEmulatorEnabled =
  import.meta.env.DEV &&
  isEnabled(import.meta.env.VITE_USE_DATA_CONNECT_EMULATOR);

export const isDataConnectEnabled =
  isEnabled(import.meta.env.VITE_DATA_CONNECT_ENABLED) ||
  isDataConnectEmulatorEnabled;

export const dataConnect = getDataConnect(firebaseApp, connectorConfig);

if (isDataConnectEmulatorEnabled) {
  const emulatorHost =
    import.meta.env.VITE_DATA_CONNECT_EMULATOR_HOST || '127.0.0.1';
  const emulatorPort = getEmulatorPort(
    import.meta.env.VITE_DATA_CONNECT_EMULATOR_PORT,
  );
  const emulatorConnectionKey = Symbol.for(
    'money-rank:data-connect-emulator-connected',
  );

  // O símbolo global impede uma segunda conexão durante o HMR do Vite.
  if (!globalThis[emulatorConnectionKey]) {
    connectDataConnectEmulator(dataConnect, emulatorHost, emulatorPort);
    globalThis[emulatorConnectionKey] = true;
  }
}
