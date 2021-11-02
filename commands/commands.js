const {
  Client,
  DiscordAPIError,
  MessageEmbed,
  Message,
} = require("discord.js");

var player = [];
var guild = [];

async function help(message) {
  const embed = new MessageEmbed()
    .setTitle("Command")
    .setColor(000000)
    .setAuthor("ucutsdyuctuyt")
    .setDescription("desc");
  message.channel.send(embed);
}

async function add(arg, message) {
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
  //  console.log(guild);
  //  console.log(player);
}

async function remove(arg, message) {
  if (
    message.member.hasPermission("ADMINISTRATOR") ||
    message.member.hasPermission("MANAGE_GUILD") ||
    message.member.hasPermission("MANAGE_CHANNELS")
  ) {
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
  } else {
    message.channel.send("You don t have the right");
  }
}

async function save_data() {
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

module.exports = { help, add, remove, save_data };
