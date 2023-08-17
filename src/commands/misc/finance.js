const {
  EmbedBuilder,
  Client,
  Interaction,
  ApplicationCommandOptionType,
} = require("discord.js");
const twelvedata = require("twelvedata");
const { TWELVE_DATA_API_KEY } = require("../../../config.json");

module.exports = {
  name: "finance",
  description: "Replies with the bot's ping!",
  type: "slash",
  edited: false,
  options: [
    {
      name: "symbol",
      description: "The symbol of the asset you want to search for.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  embed: new EmbedBuilder()
    .setTitle("**Slash Command: ping**")
    .setDescription("Shows the bots latency time.")
    .addFields(
      { name: "**Usage**", value: "`/ping`" },
      { name: "**Example**", value: "`/ping`" }
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
    const symbol = interaction.options.getString("symbol", true);

    try {
      const config = {
        key: TWELVE_DATA_API_KEY,
      };
      const twelveClient = twelvedata(config);

      let symbolParams = {
        symbol: symbol,
        outputsize: 1,
      };

      const data = await twelveClient.symbolSearch(symbolParams);
      console.log(data);

      let priceParams = {
        symbol: data.data[0].symbol,
      }
      const price = await twelveClient.price(priceParams);
      console.log(price);

      const embed = new EmbedBuilder()
        .setTitle(`📈 **|** ${data.data[0].instrument_name}`)
        .setColor("DarkGreen").addFields(
            {
                name: "Symbol",
                value: `\`\`\`${data.data[0].symbol}\`\`\``,
            },
            {
                name: "Price",
                value: `\`\`\`$${Number(price.price).toFixed(2)}\`\`\``,
            },
            {
                name: "Exchange",
                value: `\`\`\`${data.data[0].exchange}\`\`\``,
            }
        );

      return interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.log(error);
    }
  },
};
