const getLocalCommands = require("../../utils/getLocalCommands");
const {
  Client,
  Interaction,
  EmbedBuilder,
  ApplicationCommandOptionType,
  userMention,
} = require("discord.js");

module.exports = {
  name: "help",
  description: "Provides information about the bot!",
  type: "slash",
  edited: false,
  embed: new EmbedBuilder()
    .setTitle("**Slash Command: help**")
    .setDescription(
      "This is a command that supports two subcommands: `overview` and `commands`.\nThe `overview` subcommand shows useful information about the bot itself.\nThe `commands` subcommand shows information about a specific command."
    )
    .addFields(
      {
        name: "**Usage**",
        value: "`/help overview\n/help commands <command>\n/help list`",
      },
      {
        name: "**Example**",
        value: "`/help overview\n/help commands play\n/help commands queue\n/help list`",
      }
    ),
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
    {
      name: "list",
      description: "Lists the names of all commands!",
      type: ApplicationCommandOptionType.Subcommand,
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
    const commands = getLocalCommands();

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
              value: `To get help with commands, use \`/help commands\`!\nTo get a list of all commands, use \`/help list\`!`,
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
        const commandInfo = commands.find((cmd) => cmd.name === command);

        if (!commandInfo) {
          interaction.reply({
            content: `The command \`${command}\` does not exist! Commands are case sensitive!`,
            ephemeral: true,
          });
          return;
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
          case "ban":
            commandInfo.embed.addFields({
              name: "**Example**",
              value: `/ban ${userMention(
                interaction.member.id
              )}\n/ban ${userMention(interaction.member.id)} spam`,
            });
            break;
          case "kick":
            commandInfo.embed.addFields({
              name: "**Example**",
              value: `/kick ${userMention(
                interaction.member.id
              )}\n/kick ${userMention(interaction.member.id)} spam`,
            });
            break;
          case "timeout":
            commandInfo.embed.addFields({
              name: "**Example**",
              value: `/timeout ${userMention(
                interaction.member.id
              )} 1hr\n/timeout ${userMention(interaction.member.id)} 1day spam`,
            });
            break;
          case "set-theme-song":
            commandInfo.embed.addFields({
              name: "**Example**",
              value: `/set-theme-song ${userMention(
                interaction.member.id
              )} Mr. Rager`,
            });
            break;
          case "autorole-configure":
            commandInfo.embed.addFields({
              name: "**Example**",
              value: `/autorole-configure ${userMention(
                interaction.member.id
              )}`,
            });
            break;
          default:
            break;
        }

        interaction.reply({ embeds: [commandInfo.embed], ephemeral: true });
        break;

      case "list":
        const commandNames = commands.map((cmd) => `**${cmd.name}**`);
        const commandDescriptions = commands.map((cmd) => cmd.description);

        const embed2 = new EmbedBuilder().setTitle(
          `📜 **|** List of Commands:`
        );

        // Add a single field with all the command names
        embed2.addFields({
          name: "Commands",
          value: commandNames.join(":\n"),
          inline: true,
        });

        // Add a single field with all the command descriptions
        embed2.addFields({
          name: "Descriptions",
          value: commandDescriptions.join("\n"),
          inline: true,
        });

        interaction.reply({ embeds: [embed2], ephemeral: true });
        break;
      default:
        // Code for handling an invalid subcommand
        break;
    }
  },
};
