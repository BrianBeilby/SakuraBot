const { Client, Interaction } = require("discord.js");
const User = require("../../models/User");

const dailyAmount = 1000;

module.exports = {
  name: "daily",
  description: "Gives you your daily reward!",

  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: "You can only run this command inside a server.",
        ephemeral: true,
      });
      return;
    }

    try {
      await interaction.deferReply();

      let query = {
        userId: interaction.user.id,
        guildId: interaction.guild.id,
      };

      let user = await User.findOne(query);

      if (user) {
        const lastDailyDate = user.lastDaily.toDateString();
        const currentDate = new Date().toDateString();

        if (lastDailyDate === currentDate) {
          interaction.editReply(
            "You have already claimed your daily reward today!"
          );
          return;
        }
      } else {
        user = new User({
          ...query,
          lastDaily: new Date(),
        });
      }

      user.balance += dailyAmount;
      await user.save();

      interaction.editReply(
        `${dailyAmount} was added to your balance. Your new balance is ${user.balance}!`
      );
    } catch (error) {
      console.log(`Error with /daily command: ${error}`);
    }
  },
};
