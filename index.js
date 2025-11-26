import { Client, GatewayIntentBits } from "discord.js";

// Bot初期化
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

// 起動確認
client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// メッセージ受信
client.on("messageCreate", (message) => {
  if (message.author.bot) return;
  if (message.content === "!ping") {
    message.reply("pong");
  }
});

// Discordトークンでログイン
client.login(process.env.DISCORD_TOKEN);
