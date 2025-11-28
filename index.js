// index.js
import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

// Discord Bot
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', message => {
  if (message.author.bot) return;
  if (message.content === '!ping') {
    message.reply('Pong!');
  }
});

client.login(process.env.DISCORD_TOKEN);

// Koyeb用簡易Webサーバー（ヘルスチェック用）
const app = express();
app.get('/', (req, res) => res.send('Bot is running!'));
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
