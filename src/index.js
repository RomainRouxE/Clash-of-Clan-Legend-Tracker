require("dotenv").config();
const commands = require("../commands/commands");

const {
  Client,
  DiscordAPIError,
  MessageEmbed,
  Message,
} = require("discord.js");

const client = new Client();
const PREFIX = "l?";

client.on("ready", () => {
  client.user.setActivity("l?help", { type: "WATCHING" });
});

client.on("message", (message) => {
  //console.log(message.content);
  if (message.content.startsWith(PREFIX)) {
    const [CMD_NAME, ...arg] = message.content
      .trim()
      .substring(PREFIX.length)
      .split(/\s+/);
    //    console.log(CMD_NAME);
    //    console.log(arg);

    if (CMD_NAME === "help") {
      commands.help(message);
    }
    if (CMD_NAME === "add") {
      commands.add(arg, message, client);
    }
    if (CMD_NAME === "remove") {
      commands.remove(arg, message, client);
    }
    if (
      CMD_NAME === "save_data" &&
      message.author.id === process.env.ADMIN_ID
    ) {
      commands.save_data();
    }
    if (CMD_NAME === "channel") {
      commands.channel(arg, message, client);
    }
    if (CMD_NAME === "spy" && message.author.id === process.env.ADMIN_ID) {
      commands.spy();
    }
    if (
      CMD_NAME === "updateMessage" &&
      message.author.id === process.env.ADMIN_ID
    ) {
      commands.updateMessage(client);
    }
    if (CMD_NAME === "trophy") {
      commands.simpleSpy(arg, message);
    }
    if (CMD_NAME === "leaderboard") {
      commands.leaderboard(message);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
