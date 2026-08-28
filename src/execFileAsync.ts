import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

// Mocking this in tests is much simpler than having to mock `promisify` and `execFile`
export default promisify(execFile);
