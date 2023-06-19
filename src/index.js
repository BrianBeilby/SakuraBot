require("dotenv").config();
const { Client, IntentsBitField, EmbedBuilder, Embed } = require("discord.js");
const Youtube = require("discord-youtube-api");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

const youtube = new Youtube(process.env.GOOGLE_API_KEY);

async function testAll() {
  const video1 = await youtube.getVideo("https://www.youtube.com/watch?v=5NPBIwQyPWE");
  const video2 = await youtube.getVideoByID("5NPBIwQyPWE");
  const video3 = await youtube.searchVideos("big poppa biggie smalls");

  console.log(video1, video2, video3);
}

client.on("ready", (c) => {
  console.log(`${c.user.tag} is online.`);
});

client.on("messageCreate", (msg) => {
  if (msg.author.bot) {
    return;
  }

  if (msg.content === "hello") {
    msg.reply("Hey!");
  }
});

client.on("interactionCreate", (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "hey") {
    interaction.reply("hey!");
  }

  if (interaction.commandName === "add") {
    const num1 = interaction.options.get("first-number").value;
    const num2 = interaction.options.get("second-number").value;

    interaction.reply(`The sum is ${num1 + num2}`);
  }

  if (interaction.commandName === "embed") {
    const embed = new EmbedBuilder()
      .setTitle("Embed title")
      .setDescription("This is an embed description")
      .setColor("Random")
      .addFields({
        name: "Field title",
        value: "Some random value",
        inline: true,
      },
      {
        name: "Second Field title",
        value: "Some random value",
        inline: true,
      });

    interaction.reply({ embeds: [embed] });
  }

  if (interaction.commandName === 'play') {
    testAll();
  }
});

client.login(process.env.TOKEN);
