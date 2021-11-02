require("dotenv").config();
const commands = require("../commands/commands");

const {
  Client,
  DiscordAPIError,
  MessageEmbed,
  Message,
} = require("discord.js");

const client = new Client();
const PREFIX = "*";

client.on("ready", () => {
  client.user.setActivity("Legend league", { type: "WATCHING" });
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
      commands.add(arg, message);
    }

    if (CMD_NAME === "remove") {
      commands.remove(arg, message);
    }
    if (
      CMD_NAME === "save_data" &&
      message.author.id === process.env.ADMIN_ID
    ) {
      commands.save_data();
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
