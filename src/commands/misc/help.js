const getLocalCommands = require("../../utils/getLocalCommands");
const {
  Client,
  Interaction,
  EmbedBuilder,
  ApplicationCommandOptionType,
  userMention,
  ButtonBuilder,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  name: "help",
  description: "Provides information about the bot!",
  type: "slash",
  edited: false,
  embedLevel1: new EmbedBuilder()
    .setTitle("🌀 Help Inception - Level 1")
    .setColor("#FFD700")
    .setDescription("Welcome to Level 1 of the help inception menu!")
    .addFields(
      {
        name: "\u200b",
        value: "Level 2, To go deeper, click the button below!",
      },
      { name: "\u200b", value: "Visual, <a:loading_spinner:1234567890>" }
    ),
  embedLevel2: new EmbedBuilder()
    .setTitle("🌀 Help Inception - Level 2")
    .setColor("#FFD700")
    .setDescription("Welcome to Level 2 of the help inception menu!")
    .addFields({
      name: "\u200b",
      value: "Level 3, To go even deeper, click the button below!",
    })
    .setImage("https://example.com/animated_gif.gif"),
  embedLevel3: new EmbedBuilder()
    .setTitle("🌀 Help Inception - Level 3")
    .setColor("#FFD700")
    .setDescription(
      "Congratulations, you've reached the deepest level of the help inception menu!"
    )
    .addFields({
      name: "\u200b",
      value: "Visual, ```\nYour ASCII animation here\n```",
    }),
  level1Button: new ButtonBuilder()
    .setCustomId("level1")
    .setLabel("Go to Level 2")
    .setStyle("Primary"),
  level2Button: new ButtonBuilder()
    .setCustomId("level2")
    .setLabel("Go to Level 3")
    .setStyle("Primary"),
  options: [
    {
      name: "overview",
      description: "Provides an overview!",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "commands",
      description: "Get help with commands!",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "command",
          description: "The command you want to get help with!",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },
  ],
  // devOnly: Boolean,
  // testOnly: Boolean,
  // options: Object[],
  // deleted: Boolean,

  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    const subcommand = interaction.options.getSubcommand();
    const command = interaction.options.getString("command");

    switch (subcommand) {
      case "overview":
        const embed = new EmbedBuilder()
          .setTitle("📜 Help")
          .setColor("Blue")
          .setFooter({
            text: "SakuraBot v1.0.0",
            iconURL:
              "https://i.imgur.com/jfW4cn6_d.jpg?maxwidth=520&shape=thumb&fidelity=high",
          })
          .setDescription(
            "Welcome to the help menu! Here you can learn about the bot and its commands!"
          )
          .addFields(
            {
              name: "Commands",
              value: `To get help with commands, use \`/help commands\`!`,
            },
            { name: "Support", value: `To get support, just ask Brian!` },
            {
              name: "Invite",
              value: `To invite the bot to your server, use [this link](https://discord.com/api/oauth2/authorize?client_id=1119368678635475026&permissions=8&scope=bot%20applications.commands)!`,
            },
            {
              name: "Source",
              value: `To view the source code, go to [this repository](https://github.com/BrianBeilby/SakuraBot)!`,
            }
          );

        interaction.reply({ embeds: [embed], ephemeral: true });
        break;

      case "commands":
        const command = interaction.options.getString("command");
        const commands = getLocalCommands();
        const commandInfo = commands.find((cmd) => cmd.name === command);

        if (!commandInfo) {
          interaction.reply({
            content: `The command \`${command}\` does not exist! Commands are case sensitive!`,
            ephemeral: true,
          });
          return;
        }

        if (commandInfo.name === "help") {
          const row1 = new ActionRowBuilder().addComponents(commandInfo.level1Button);
          return interaction.reply({
            embeds: [commandInfo.embedLevel1],
            components: [row1],
            ephemeral: true,
          });
        }

        switch (commandInfo.name) {
          case "balance":
            commandInfo.embed.addFields({
              name: "**Example**",
              value: `/balance\n/balance ${userMention(interaction.member.id)}`,
            });
            break;
          case "level":
            commandInfo.embed.addFields({
              name: "**Example**",
              value: `/level\n/level ${userMention(interaction.member.id)}`,
            });
            break;
          default:
            break;
        }

        interaction.reply({ embeds: [commandInfo.embed], ephemeral: true });
        break;

      default:
        // Code for handling an invalid subcommand
        break;
    }
  },
};
