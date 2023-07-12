const {
  ApplicationCommandOptionType,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const { REPLICATE_API_KEY } = require("../../../config.json");
const models = require("../../models/ImageGeneration");

module.exports = {
  name: "imagine",
  description: "Generate an image using a prompt!",
  type: "slash",
  embed: new EmbedBuilder()
    .setTitle("**Slash Command: imagine**")
    .setDescription("Generates an image given a prompt using AI.\nYou can also specify which AI model to use although it is optional.")
    .addFields(
      { name: "**Usage**", value: "`/imagine <prompt> [model]`" },
      { name: "**Example**", value: "`/imagine hyperrealistic rick sanchez\n/imagine Roko's Basilisk Mini DALL-E`" }
    ),
  options: [
    {
      name: "prompt",
      description: "Enter your prompt",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "model",
      description: "The image model",
      type: ApplicationCommandOptionType.String,
      choices: models,
      required: false,
    },
  ],

    callback: async (client, interaction) => {
        try {
            await interaction.deferReply();
      
            const { default: Replicate } = await import('replicate');
      
            const replicate = new Replicate({
              auth: REPLICATE_API_KEY,
            });
      
            const prompt = interaction.options.getString('prompt');
            const model = interaction.options.getString('model') || models[0].value;
      
            const output = await replicate.run(model, { input: { prompt } });
      
            const row = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setLabel(`Download`)
                .setStyle(ButtonStyle.Link)
                .setURL(`${output[0]}`)
                .setEmoji('1101133529607327764')
            );
      
            const resultEmbed = new EmbedBuilder()
              .setTitle('Image Generated')
              .addFields({ name: 'Prompt', value: prompt })
              .setImage(output[0])
              .setColor('#44a3e3')
              .setFooter({
                text: `Requested by ${interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
              });
      
            await interaction.editReply({
              embeds: [resultEmbed],
              components: [row],
            });
          } catch (error) {
            const errEmbed = new EmbedBuilder()
              .setTitle('An error occurred')
              .setDescription('```' + error + '```')
              .setColor(0xe32424);
      
            interaction.editReply({ embeds: [errEmbed] });
          }
    }
};
