import { fileURLToPath } from 'node:url';
import { generateAuthKeyFiles } from '../src/config/key-files.js';

const directory = process.argv[2] || fileURLToPath(new URL('../.local/auth/', import.meta.url));
generateAuthKeyFiles(directory);
console.log('Local RSA keys created. Configure AUTH_KEY_ID and AUTH_PRIVATE_KEY_FILE; keep private.pem outside Git.');
