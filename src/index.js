require("dotenv").config();
const commands = require("../commands/commands");
const coc = require("../commands/cocapi");

const {
  Client,
  DiscordAPIError,
  MessageEmbed,
  Message,
} = require("discord.js");

const client = new Client();
const PREFIX = "-";

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
      commands.add(arg, message, client);
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
    if (CMD_NAME === "channel") {
      commands.channel(arg, message, client);
    }
    if (CMD_NAME === "coc") {
      coc.coc(arg, message);
    }
    if (CMD_NAME === "spy" && message.author.id === process.env.ADMIN_ID) {
      commands.spy(message);
    }
    if (CMD_NAME === "test") {
      commands.test(client);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
