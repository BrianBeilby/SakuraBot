const fs = require("fs");
const path = require("path");
const getAllFiles = require("./getAllFiles");

module.exports = (commandName) => {
  // Get the path to the commands folder
  const commandCategories = getAllFiles(
    path.join(__dirname, "..", "commands"),
    true
  );

  // Iterate through the command files and find the command with the same name
  for (const commandCategory of commandCategories) {
    const commandFiles = getAllFiles(commandCategory);

    for (const commandFile of commandFiles) {
      const commandObject = require(commandFile);

      if (commandObject.name === commandName) {
        return commandObject;
      }
    }
  }

  // If no command is found, return null
  return null;
};
