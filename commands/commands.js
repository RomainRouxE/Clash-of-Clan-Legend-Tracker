const coc = require("./cocapi");

const {
  Client,
  DiscordAPIError,
  MessageEmbed,
  Message,
  MessageAttachment,
} = require("discord.js");

var player = [];
var guild = [];
var channelID = [];
const attachment = new MessageAttachment("./img/legend.png", "legend.png");

async function help(message) {
  const embed = new MessageEmbed()
    .setColor(000000)
    .attachFiles(attachment)
    .setTitle("Help")
    .setThumbnail("attachment://legend.png")
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
    .setFooter("Clash of clan Legend tracker BOT", "attachment://legend.png");
  message.channel.send(embed);
}

async function add(arg, message, client) {
  var channelSet = false;
  for (let i = 0; i < channelID.length; i++) {
    if (channelID[i][0] === message.guild.id) {
      channelSet = channelID[i][1];
    }
  }
  if (channelSet != false) {
    var guildExist = false;
    var playerExist = false;
    var info = await coc.coc(arg, message);

    if (info.trophy > 5000) {
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
        const embed = new MessageEmbed()
          .setColor(000000)
          .attachFiles(attachment)
          .setTitle(info.name + " " + arg)
          .setThumbnail("attachment://legend.png")
          .addFields(
            {
              name: "Current trophy : " + info.trophy,
              value: "\u200B",
            },
            {
              name: "Attack :",
              value: "Not yet enought data",
              inline: true,
            },
            {
              name: "Deffence :",
              value: "Not yet enought data",
              inline: true,
            }
          )
          .setTimestamp()
          .setFooter(
            "Clash of clan Legend tracker BOT",
            "attachment://legend.png"
          );
        var messPlayerID = await client.channels.cache
          .get(channelSet)
          .send(embed);
        //console.log(messPlayerID.id);
        message.channel.send("Player was added");
        guild.push([String(arg).substr(1), message.guild.id, messPlayerID.id]);
        var dataGUILD =
          String(arg).substr(1) +
          "," +
          message.guild.id +
          "," +
          messPlayerID.id +
          ",\n";
        require("fs").appendFileSync("./data/guild.csv", dataGUILD);
      }

      // Search if player exist.
      for (let i = 0; i < player.length && playerExist == false; i++) {
        if (player[i][0] === String(arg).substr(1)) {
          playerExist = true;
          if (guildExist === false) {
            player[i][10] = player[i][10] + 1;
          }
        }
      }
      if (playerExist === false) {
        player.push(
          [String(arg).substr(1), 0, 0, 0, 0, 0, 0, 0, 0, info.trophy, 1],
          [info.name, 0, 0, 0, 0, 0, 0, 0, 0, info.trophy, info.trophy]
        );
        //prettier-ignore
        var dataPLAYER =
          String(arg).substr(1) + "," + 0 + "," + 0 + "," + 0 + "," + 0 + "," + 0 + "," + 0 + "," + 0 + "," + 0 + "," + info.trophy + "," + 1 + ",\n"
          + info.name + "," + 0 + "," + 0 + "," + 0 + "," + 0 + "," + 0 + "," + 0 + "," + 0 + "," + 0 + "," + info.trophy + "," + info.trophy + ",\n";

        require("fs").appendFileSync("./data/player.csv", dataPLAYER);
      }
      //  console.log(guild);
      //  console.log(player);
    } else if (info.trophy != 0) {
      message.channel.send(
        "Player #" + arg + " only have " + info.trophy + " trophy."
      );
    }
  } else {
    message.channel.send("must use the channel command first");
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
      i = i + 2
    ) {
      if (player[i][0] === String(arg).substr(1)) {
        player[i][10] = player[i][10] - 1;
        //console.log(player[i][9]);
        if (player[i][10] == 0) {
          player.splice(i + 1, 1);
          player.splice(i, 1);
        }
      }
    }
    //console.log(player);
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
      var dataID = message.guild.id + "," + ID + ",\n";
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
}

async function spy() {
  for (let i = 0; i < player.length; i = i + 2) {
    var change = false;
    // get current trophy
    player[i][9] = await coc.trophy(player[i][0]);
    // if current trophy > trophy 10min ago
    if (player[i][9] > player[i + 1][9]) {
      var won = player[i][9] - player[i + 1][9];
      for (x = 1; player[i][x] != 0; x++) {}
      if (won > 40) {
        player[i][x] = won - 40;
        player[i][x + 1] = 40;
      } else {
        player[i][x] = won;
      }
      player[i + 1][9] = player[i][9];
      change = true;
    }
    if (player[i][9] < player[i + 1][9]) {
      var lost = player[i][9] - player[i + 1][9];
      for (x = 1; player[i + 1][x] != 0; x++) {}
      if (lost > 40) {
        player[i + 1][x] = lost + 40;
        player[i + 1][x + 1] = -40;
      } else {
        player[i + 1][x] = lost;
      }
      player[i + 1][9] = player[i][9];
      change = true;
    }
    // update message with att / def
    if (change == true) {
      console.log("aaa");
    }
  }

  var hour = new Date().getUTCHours();
  var min = new Date().getMinutes();
  if (hour === 20 && min < 10) {
    for (let i = 0; i < player.length; i = i + 2) {
      // player[i + 1][10] == trophy at reset
      player[i + 1][10] = player[i][9];
      for (let j = 1; j < 9; j++) {
        player[i][j] = 0;
        player[i + 1][j] = 0;
      }
    }
  }
}

async function test(client) {
  var guidID = "719886728470593628";
  var chanID = "720038951586365471";
  var messID = "908551252487573555";
  const guild = client.guilds.cache.get(guidID);
  if (!guild) return console.log("Unable to find guild.");

  const channel = guild.channels.cache.get(chanID);
  if (!channel) return console.log("Unable to find channel.");

  try {
    const message = await channel.messages.fetch(messID);
    if (!message) return console.log("Unable to find message.");
    const newEmbed = new MessageEmbed()
      .setColor(000000)
      .attachFiles(attachment)
      .setTitle("eeee")
      .setThumbnail("attachment://legend.png")
      .addFields(
        {
          name: "Current trophy :" + "rrrr",
          value: "\u200B",
        },
        {
          name: "Attack :",
          value: guidID + "\n" + chanID + "\n" + messID,
          inline: true,
        },
        {
          name: "Deffence :",
          value: "Not yet enought data",
          inline: true,
        }
      )
      .setTimestamp()
      .setFooter("Clash of clan Legend tracker BOT", "attachment://legend.png");

    message.edit(newEmbed);
  } catch (err) {
    console.log(err);
  }
}

module.exports = { help, add, remove, save_data, channel, spy, test };
