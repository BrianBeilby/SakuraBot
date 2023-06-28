require("dotenv").config();
const { Client, Message } = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");

const config = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(config);

/**
 *
 * @param {Client} client
 * @param {Message} message
 */
module.exports = async (client, message) => {
  message = message[0];
  if (message.author.bot) return;
  if (message.channel.id !== process.env.CHANNEL_ID) return;
  if (message.content.startsWith("!")) return;

  let conversationLog = [
    { role: "system", content: "You are a witty and sarcastic chatbot." },
  ];

  await message.channel.sendTyping();

  let prevMessages = await message.channel.messages.fetch({ limit: 15 });
  prevMessages.reverse();

  prevMessages.forEach((msg) => {
    if (message.content.startsWith("!")) return;
    if (msg.author.id !== client.user.id && message.author.bot) return;
    if (msg.author.id !== message.author.id) return;

    conversationLog.push({
      role: "user",
      content: msg.content,
    });
  });

  const result = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: conversationLog,
  });

  message.reply(result.data.choices[0].message);
};
