require("dotenv").config();

const {
  Client,
  DiscordAPIError,
  MessageEmbed,
  Message,
} = require("discord.js");

const client = new Client();
const PREFIX = "*";

var player = [];
var guild = [];
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
      const embed = new MessageEmbed()
        .setTitle("Command")
        .setColor(000000)
        .setAuthor("ucutsdyuctuyt")
        .setDescription("desc");
      message.channel.send(embed);
    }

    if (CMD_NAME === "add") {
      var exist = new Boolean(false);
      for (let i = 0; i < guild.length; i++) {
        if (
          guild[i][0] === String(arg).substr(1) &&
          guild[i][1] === message.guild.id
        ) {
          message.channel.send("Player is already set");
          exist = true;
        }
      }
      if (exist === false) {
        guild.push([String(arg).substr(1), message.guild.id]);
        player.push(
          [String(arg).substr(1), "e", "e", "e", "e", "e"],
          ["player trophy", "e", "e", "e", "e", "e"]
        );
      }
      console.log(player);
      //      console.log(String(arg).substr(1));
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
