import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

function resolveWindowsNpxCli() {
  const candidates = [
    process.env.npm_execpath
      ? path.join(path.dirname(process.env.npm_execpath), 'npx-cli.js')
      : null,
    path.join(path.dirname(process.execPath), 'node_modules', 'npm', 'bin', 'npx-cli.js'),
  ].filter(Boolean);

  const npxCli = candidates.find((candidate) => existsSync(candidate));
  if (!npxCli) {
    throw new Error(
      'Não foi possível localizar npx-cli.js. Reinstale o Node.js com npm/npx ou execute o script por npm run.',
    );
  }
  return npxCli;
}

export function spawnNpx(parameters, options = {}) {
  if (process.platform === 'win32') {
    // Node 22+ não inicia arquivos .cmd diretamente com spawn sem shell.
    // Executar o CLI JavaScript com o próprio Node evita EINVAL e também
    // evita interpolar argumentos em um shell.
    return spawn(process.execPath, [resolveWindowsNpxCli(), ...parameters], options);
  }
  return spawn('npx', parameters, options);
}
