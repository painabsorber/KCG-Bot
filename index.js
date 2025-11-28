// index.js
import { Client, GatewayIntentBits, AttachmentBuilder } from 'discord.js';
import dotenv from 'dotenv';
import express from 'express';
import { generateDeckImageWithSideDeck } from './generateImage.js';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const deckURL = message.content.match(/https:\/\/kamitsubaki-decksite(\.pc)?\.painabsorber\.workers\.dev.*deck=[^\s]+/);
    if (!deckURL) return;

    // デッキを復号して取得
    const { mainDeck, sideDeck } = await importDeckFromURL(deckURL);

    // 画像生成
    const imageBuffer = await generateDeckImageWithSideDeck(mainDeck, sideDeck, 'Deck');

    // Discord に送信
    const attachment = new MessageAttachment(imageBuffer, 'deck.png');
    message.channel.send({ files: [attachment] });
});

// Koyeb用簡易Webサーバー
const app = express();
app.get('/', (req, res) => res.send('Bot is running!'));
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server listening on port ${port}`));

client.login(process.env.DISCORD_TOKEN);
