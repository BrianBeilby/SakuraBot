const {
  EmbedBuilder,
  Client,
  Interaction,
  ApplicationCommandOptionType,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");
const JishoAPI = require("unofficial-jisho-api");

module.exports = {
  name: "japanese-sentence",
  description: "Generates a random Japanese sentence!",
  type: "slash",
  edited: false,
  options: [
    {
      name: "character",
      description: "The Kanji character you want to generate a sentence for.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  embed: new EmbedBuilder()
    .setTitle("**Slash Command: japanese-sentence**")
    .setDescription("Generate a random Japanese sentence given a Kanji character.\nThis command uses the unofficial Jisho API\nto generate a random Japanese sentence.")
    .addFields(
      { name: "**Usage**", value: "`/japanese-sentence <character>`" },
      { name: "**Example**", value: "`/japanese-sentence 愛`" }
    ),
  // devOnly: Boolean,
  // testOnly: Boolean,
  // deleted: Boolean,

  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    const jisho = new JishoAPI();
    const query = interaction.options.getString("character", true);

    const result = await jisho.searchForExamples(query);

    let randomResult;
    if (result && result.results && result.results.length > 0) {
      const randomIndex = Math.floor(Math.random() * result.results.length);
      randomResult = result.results[randomIndex];
    } else {
      return interaction.reply("No results found!");
    }

    let showEnglish = false;
    let showKana = false;

    const embed = new EmbedBuilder()
      .setTitle("📋 **|** 成功: Generated Successfully")
      .setColor("Fuchsia")
      .setDescription(`Jisho URI: ${result.uri}`)
      .addFields({ name: "Kanji", value: `\`\`\`${randomResult.kanji}\`\`\`` });

    const englishButton = new ButtonBuilder()
      .setCustomId("english")
      .setLabel("English")
      .setStyle("Primary");

    const kanaButton = new ButtonBuilder()
      .setCustomId("kana")
      .setLabel("Kana")
      .setStyle("Primary");

    const row = new ActionRowBuilder().addComponents(englishButton, kanaButton);

    await interaction.reply({ embeds: [embed], components: [row] });

    // Create an interaction collector to listen for button clicks
    const filter = (i) => i.customId === "english" || i.customId === "kana";
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 60000,
    });

    collector.on("collect", async (i) => {
      // Edit the original embed to show English or Kana based on the button clicked
      if (i.customId === "english") {
        showEnglish = true;
        showKana = false;
      } else if (i.customId === "kana") {
        showEnglish = false;
        showKana = true;
      }

      const fields = [];

      if (showEnglish) {
        fields.push({
          name: "English",
          value: `\`\`\`${randomResult.english}\`\`\``,
        });
        englishButton.setDisabled(true);
        kanaButton.setDisabled(false);
      } else if (showKana) {
        fields.push({
          name: "Kana",
          value: `\`\`\`${randomResult.kana}\`\`\``,
        });
        kanaButton.setDisabled(true);
        englishButton.setDisabled(false);
      }

      embed.spliceFields(1, 2, ...fields);
      await i.update({ embeds: [embed], components: [row] });
    });

    collector.on("end", async (i) => {
      row.components.forEach((c) => c.setDisabled(true));
      interaction.editReply({ embeds: [embed], components: [row] });
    });
  },
};
