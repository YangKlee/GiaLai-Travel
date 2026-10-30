import { readdirSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const directory = new URL('../integration/', import.meta.url);
const files = readdirSync(directory).filter((name) => name.endsWith('.integration.js')).map((name) => fileURLToPath(new URL(name, directory)));
const child = spawn(process.execPath, ['--test', ...files], { stdio: 'inherit', env: process.env });
child.on('error', () => { process.exitCode = 1; });
child.on('exit', (code) => { process.exitCode = code ?? 1; });
