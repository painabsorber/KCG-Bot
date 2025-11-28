// watch.js
import { spawn } from 'child_process';

function startBot() {
  const botProcess = spawn('node', ['index.js'], { stdio: 'inherit' });

  botProcess.on('close', (code) => {
    console.log(`Bot exited with code ${code}. Restarting in 3 seconds...`);
    setTimeout(startBot, 3000); // 3秒後に再起動
  });

  botProcess.on('error', (err) => {
    console.error('Failed to start bot:', err);
    setTimeout(startBot, 3000);
  });
}

startBot();
