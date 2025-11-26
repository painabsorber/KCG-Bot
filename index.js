import { Client, GatewayIntentBits, AttachmentBuilder } from "discord.js";
import { generateImage } from "./image.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (msg) => {
  if (!msg.content.startsWith("!img")) return;

  const text = msg.content.replace("!img", "").trim() || "Hello";
  const buffer = generateImage(text);
  const attachment = new AttachmentBuilder(buffer, { name: "image.png" });

  await msg.reply({ files: [attachment] });
});

client.login(process.env.DISCORD_TOKEN);
