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
      var guildExist = false;
      var playerExist = false;

      // Search if player exist for guild.
      for (let i = 0; i < guild.length && guildExist == false; i++) {
        if (
          guild[i][0] === String(arg).substr(1) &&
          guild[i][1] === message.guild.id
        ) {
          message.channel.send("Player is already set");
          guildExist = true;
        }
      }
      if (guildExist === false) {
        guild.push([String(arg).substr(1), message.guild.id, ""]);
        var data =
          String(arg).substr(1) + "," + message.guild.id + "," + "" + ",\n";
        require("fs").appendFileSync("./data/guild.csv", data);
      }

      // Search if player exist.
      for (let i = 0; i < player.length && playerExist == false; i++) {
        if (player[i][0] === String(arg).substr(1)) {
          playerExist = true;
          if (guildExist === false) {
            player[i][9] = player[i][9] + 1;
          }
        }
      }
      if (playerExist === false) {
        player.push(
          [
            String(arg).substr(1),
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            1,
          ],
          ["player trophy", null, null, null, null, null, null, null, null, 1]
        );
        var data =
          String(arg).substr(1) + "," + message.guild.id + "," + "" + ",\n";
        require("fs").appendFileSync("./data/player.csv", data);
      }
      //     console.log(guild);
      //     console.log(player);
    }

    if (CMD_NAME === "remove") {
      var playerExist = false;
      var guildExist = false;
      for (let i = 0; i < guild.length && guildExist == false; i++) {
        if (
          guild[i][0] === String(arg).substr(1) &&
          guild[i][1] === message.guild.id
        ) {
          guild.splice(i, 1);
          message.channel.send("Player was deleted");
          guildExist = true;
          //          console.log(guild);
        }
      }
      if (guildExist == false) {
        message.channel.send("Player wasn t found");
      }

      for (
        let i = 0;
        i < player.length && playerExist == false && guildExist == true;
        i++
      ) {
        if (player[i][0] === String(arg).substr(1)) {
          player[i][9] = player[i][9] - 1;
          console.log(player[i][9]);
          if (player[i][9] == 0) {
            player.splice(i + 1, 1);
            player.splice(i, 1);
          }
        }
      }
      console.log(player);
    }
    if (CMD_NAME === "copy" && message.author.id === process.env.ADMIN_ID) {
      var stream = require("fs").createReadStream("./data/guild.csv");
      var reader = require("readline").createInterface({ input: stream });
      reader.on("line", (row) => {
        guild.push(row.split(","));
      });
      setTimeout(function () {
        console.log(guild);
      }, 10);
      var stream = require("fs").createReadStream("./data/player.csv");
      var reader = require("readline").createInterface({ input: stream });
      reader.on("line", (row) => {
        player.push(row.split(","));
      });
      setTimeout(function () {
        console.log(player);
      }, 10);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
