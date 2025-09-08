import { exec } from 'child_process';

console.log('Starting Next.js development server...');

const nextProcess = exec('npx next dev -p 5000', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error}`);
    return;
  }
  console.log(stdout);
  if (stderr) {
    console.error(stderr);
  }
});

nextProcess.stdout.on('data', (data) => {
  console.log(data);
});

nextProcess.stderr.on('data', (data) => {
  console.error(data);
});

process.on('SIGINT', () => {
  console.log('\nShutting down Next.js server...');
  nextProcess.kill('SIGINT');
  process.exit(0);
});