const { testServer } = require("../../../config.json");
const areCommandsDifferent = require("../../utils/areCommandsDifferent");
const getApplicationCommands = require("../../utils/getApplicationCommands");
const getLocalCommands = require("../../utils/getLocalCommands");
const { ApplicationCommandType } = require("discord.js");

module.exports = async (client) => {
  try {
    const localCommands = getLocalCommands();
    const applicationCommands = await getApplicationCommands(
      client,
      testServer
    );

    for (const localCommand of localCommands) {
      const { name, description, options, type } = localCommand;

      if (type === "slash") {
        // Process slash commands
        const existingCommand = await applicationCommands.cache.find(
          (cmd) => cmd.name === name
        );

        if (existingCommand) {
          if (localCommand.deleted) {
            await applicationCommands.delete(existingCommand.id);
            console.log(`🗑 Deleted command "${name}".`);
            continue;
          }

          if (areCommandsDifferent(existingCommand, localCommand)) {
            await applicationCommands.edit(existingCommand.id, {
              description,
              options,
            });

            console.log(`🔁 Edited command "${name}".`);
          }
        } else {
          if (localCommand.deleted) {
            console.log(
              `⏭ Skipping registering command "${name}" as it's set to delete.`
            );
            continue;
          }

          await applicationCommands.create({
            name,
            description,
            options,
          });

          console.log(`👍 Registered command "${name}".`);
        }
      } else if (type === "context-menu") {
        // Process context menu commands
        const existingCommand = await applicationCommands.cache.find(
          (cmd) => cmd.name === name && cmd.type === ApplicationCommandType.Message
        );

        if (existingCommand) {
          if (localCommand.deleted) {
            await applicationCommands.delete(existingCommand.id);
            console.log(`🗑 Deleted context menu command "${name}".`);
            continue;
          }

          if (areCommandsDifferent(existingCommand, localCommand)) {
            await applicationCommands.edit(existingCommand.id, {
              name,
              type: ApplicationCommandType.Message,
            });

            console.log(`🔁 Edited context menu command "${name}".`);
          }
        } else {
          if (localCommand.deleted) {
            console.log(
              `⏭ Skipping registering context menu command "${name}" as it's set to delete.`
            );
            continue;
          }

          await applicationCommands.create({
            name,
            type: ApplicationCommandType.Message,
          });

          console.log(`👍 Registered context menu command "${name}".`);
        }
      }
    }
  } catch (error) {
    console.log(`😡 There was an error: ${error}`);
  }
};