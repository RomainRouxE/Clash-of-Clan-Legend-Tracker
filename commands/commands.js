const coc = require("./cocapi");

const {
  Client,
  DiscordAPIError,
  MessageEmbed,
  Message,
} = require("discord.js");

var player = [];
var guild = [];
var channelID = [];

async function help(message) {
  const embed = new MessageEmbed()
    .setColor(000000)
    .setTitle("Help")
    .setThumbnail(
      "https://static.wikia.nocookie.net/clashofclans/images/1/10/Legend.png/revision/latest?cb=20160401051113"
    )
    .addFields(
      {
        name: "Current commands include :",
        value: "The prefix of the bot is s!",
      },
      {
        name: "add + #ID",
        value: "Add a player to track trophy.\nEx : s!add #xxxxxx",
      },
      {
        name: "remove + #ID",
        value: "Stop tracking a player trophy.\nEx : s!remove #xxxxxx",
      },
      {
        name: "channel + #channel",
        value:
          "Set a channel to send the tracking message.\nEx : s!channel #channel",
      },
      {
        name: "\u200B",
        value:
          "For channel and remove command, admin, manage server or manage channem permissions is needed.",
      }
    )
    .setTimestamp()
    .setFooter(
      "Clash of clan Legend tracker BOT",
      "https://static.wikia.nocookie.net/clashofclans/images/1/10/Legend.png/revision/latest?cb=20160401051113"
    );
  message.channel.send(embed);
}

async function add(arg, message) {
  var guildExist = false;
  var playerExist = false;
  var trophy = await coc.coc(arg, message);

  if (trophy > 5000) {
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
      var dataGUILD =
        String(arg).substr(1) + "," + message.guild.id + "," + "" + ",\n";
      require("fs").appendFileSync("./data/guild.csv", dataGUILD);
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
        [trophy, null, null, null, null, null, null, null, null, 1]
      );
      var dataPLAYER =
        String(arg).substr(1) + "," + message.guild.id + "," + "" + ",\n";
      require("fs").appendFileSync("./data/player.csv", dataPLAYER);
    }
    //  console.log(guild);
    //  console.log(player);
  } else if (trophy != 0) {
    message.channel.send("Player #" + arg + "only have " + trophy);
  }
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
    message.channel.send(
      "You need admin, manage server or manage channem permissions to use this command."
    );
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
  var stream = require("fs").createReadStream("./data/channel.csv");
  var reader = require("readline").createInterface({ input: stream });
  reader.on("line", (row) => {
    channelID.push(row.split(","));
  });
  setTimeout(function () {
    console.log(channelID);
  }, 10);
}

async function channel(arg, message, client) {
  if (
    message.member.hasPermission("ADMINISTRATOR") ||
    message.member.hasPermission("MANAGE_GUILD") ||
    message.member.hasPermission("MANAGE_CHANNELS")
  ) {
    var ID = String(arg);
    ID = ID.substring(0, ID.length - 1).substring(2);
    try {
      client.channels.cache
        .get(ID)
        .send("I will send player legend trophy here.");
      channelID.push([message.guild.id, ID]);
      var dataID =
        String(arg).substr(1) + "," + message.guild.id + "," + "" + ",\n";
      require("fs").appendFileSync("./data/channel.csv", dataID);
    } catch (err) {
      message.channel.send("Somethinw went wrong with the channel ID");
      console.log(err);
    }
  } else {
    message.channel.send(
      "You need admin, manage server or manage channem permissions to use this command."
    );
  }
  //  console.log(channelID);
}

module.exports = { help, add, remove, save_data, channel };
