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

// Help command : send help embed
async function help(message) {
  const embed = new MessageEmbed()
    .setColor("#8400ff")
    .attachFiles(attachment)
    .setTitle("Help")
    .addFields(
      {
        name: "Current commands include :",
        value: "The prefix of the bot is l?\n\u200B",
      },
      {
        name: "trophy + #ID",
        value: "Send player current attack/def.\nEx : l?trophy #xxxxxx\n\u200B",
      },
      {
        name: "add + #ID",
        value:
          "Add a player to get trophy and update it every 10min.\nEx : l?add #xxxxxx\n\u200B",
      },
      {
        name: "remove + #ID",
        value: "Stop tracking a player trophy.\nEx : l?remove #xxxxxx\n\u200B",
      },
      {
        name: "channel + #channel",
        value:
          "Set a channel to send the tracking message. You need to use this command before using the add cmd.\nEx : l?channel #channel\n\u200B",
      },
      {
        name: "leaderboard",
        value: "Send top 3 most searched player.\nEx : l?leaderboard\n\u200B",
      },
      {
        name: "For channel and remove command, admin, manage server or manage channem permissions is needed.\n\u200B",
        value:
          "[Invite](https://discord.com/api/oauth2/authorize?client_id=904420216535134328&permissions=281600&scope=bot) | [GitHub](https://github.com/RomainRouxE/Clash-of-Clan-Legend-Tracker)",
      }
    )
    .setTimestamp()
    .setFooter("Clash of clan Legend tracker BOT", "attachment://legend.png");
  message.channel.send(embed);
}

// channel command : admin - mng_guild - mng-chan role needed, set a channel to send legend embed.
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
      message.channel.send("Channel was set successfully");
      channelID.push([message.guild.id, ID]);
      var dataID = message.guild.id + "," + ID + "\n";
      require("fs").appendFileSync("./data/channel.csv", dataID);
    } catch (err) {
      message.channel.send("Something went wrong with the channel ID");
      console.log(err);
    }
  } else {
    message.channel.send(
      "You need admin, manage server or manage channel permissions to use this command."
    );
  }
}

// add command : anyone can use. Add player into guild array and player array if needed. Send first embed msg used to display info, in channel from above.
// Push every data in csv file to save. Only accept legend over 5000 trophy.
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
              value:
                "Please do not delete this message. It will be used to update the player log.\n\u200B",
            },
            {
              name: "Attack :",
              value: "Not yet enought data\n\u200B",
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
          "\n";
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
          String(arg).substr(1) + "," + 0 + "," + 0 + "," + 0 + "," + 0 + "," + 0 + "," + 0 + "," + 0 + "," + 0 + "," + info.trophy + "," + 1 + "\n"
          + info.name + "," + 0 + "," + 0 + "," + 0 + "," + 0 + "," + 0 + "," + 0 + "," + 0 + "," + 0 + "," + info.trophy + "," + info.trophy + "\n";

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

// remove command : admin - mng_guild - mng-chan role needed. Remove player from guild array. Decrease player count in player array and delete it if it reach 0.
async function remove(arg, message, client) {
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
        for (var z = 0; z < channelID.length; z++) {
          if (channelID[z][0] === message.guild.id) {
            var messDelG = client.guilds.cache.get(message.guild.id);

            var messDelC = messDelG.channels.cache.get(channelID[z][1]);
            if (!messDelC) return console.log("Unable to find channel.");
            try {
              var messDelM = await messDelC.messages.fetch(guild[i][2]);
              if (!messDelM) return console.log("Unable to find message.");

              messDelM.delete();
            } catch (err) {
              console.log(err);
            }
            break;
          }
        }

        guild.splice(i, 1);
        message.channel.send("Player successfully removed");
        guildExist = true;
        //          console.log(guild);
      }
    }
    if (guildExist == false) {
      message.channel.send(
        "Player wasn't found, please make sure you used the correct #"
      );
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
      "You need admin, manage server or manage channel permissions to use this command."
    );
  }
}

// save_data command : only owner of bot can use. Get data from every csv file and push in array. To use in case of bot crash.
async function save_data() {
  console.log("save_data command started");
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

// spy command : only owner of bot can use. Start the "spy" loop to get trophy of every player. Update value in array depanding. Repeat every 10min.
// At 5am UTC attack/deffence rest
async function spy() {
  console.log("Spy command started");
  // For every player in player array get trophy from coc api | index = index + 2 because there is 1 line for attack and 1 for def
  for (let indexP = 0; indexP < player.length; indexP = indexP + 2) {
    // get current trophy
    player[indexP][9] = await coc.trophy(player[indexP][0]);
    // if current trophy > trophy 10min ago
    if (player[indexP][9] > player[indexP + 1][9]) {
      var won = player[indexP][9] - player[indexP + 1][9];
      var newA;
      for (newA = 1; player[indexP][newA] != 0; newA++) {}
      if (won > 40) {
        player[indexP][newA] = won - 40;
        player[indexP][newA + 1] = 40;
      } else {
        player[indexP][newA] = won;
      }
      player[indexP + 1][9] = player[indexP][9];
    }
    if (player[indexP][9] < player[indexP + 1][9]) {
      var lost = player[indexP][9] - player[indexP + 1][9];
      var newD;
      for (newD = 1; player[indexP + 1][newD] != 0; newD++) {}
      if (lost < -40) {
        player[indexP + 1][newD] = lost + 40;
        player[indexP + 1][newD + 1] = -40;
      } else {
        player[indexP + 1][newD] = lost;
      }
      player[indexP + 1][9] = player[indexP][9];
    }

    var hour = new Date().getUTCHours();
    var min = new Date().getMinutes();
    if (hour === 5 && min < 10) {
      for (let i = 0; i < player.length; i = i + 2) {
        // player[i + 1][10] == trophy at reset
        player[i + 1][10] = player[i][9];
        for (let j = 1; j < 9; j++) {
          player[i][j] = 0;
          player[i + 1][j] = 0;
        }
      }
    }
    save();
  }
  //console.log(player);
  setTimeout(() => {
    spy();
  }, 600000);
}

// updateMessage command : only owner can use. Start to update the embed message. Update every message on every guild. Repeat every 10min.
async function updateMessage(client) {
  console.log("updateMessage comamand started");
  for (var index = 0; index < player.length; index = index + 2) {
    for (var x = 0; x < guild.length; x++) {
      if (player[index][0] === guild[x][0]) {
        //update msg
        var sendGuildID = guild[x][1];
        var sendMessageID = guild[x][2];
        for (var y = 0; y < channelID.length; y++) {
          if (channelID[y][0] === sendGuildID) {
            var sendChannelID = channelID[y][1];
            var sendGuild = client.guilds.cache.get(sendGuildID);
            if (!sendGuild) return console.log("Unable to find guild.");

            var sendChannel = sendGuild.channels.cache.get(sendChannelID);
            if (!sendChannel) return console.log("Unable to find channel.");
            try {
              var diff = player[index][9] - player[index + 1][10];
              var emote =
                diff >= 0
                  ? "<:won:910374607675084820>"
                  : "<:lost:910374586292502549>";
              var sendMessage = await sendChannel.messages.fetch(sendMessageID);
              if (!sendMessage) return console.log("Unable to find message.");
              const newEmbed = new MessageEmbed()
                .setColor("#8400ff")
                .attachFiles(attachment)
                .setTitle(player[index + 1][0] + " #" + player[index][0])
                .setThumbnail("attachment://legend.png")
                .addFields(
                  {
                    //prettier-ignore
                    name: "Current trophy : " + player[index][9],
                    value: diff + " " + emote + "\n\u200B",
                  },
                  {
                    name: "Attack :",
                    //prettier-ignore
                    value: player[index][1] + "\n" + player[index][2] + "\n" + player[index][3] + "\n" + player[index][4] + "\n" + player[index][5] + "\n" + player[index][6] + "\n" + player[index][7] + "\n" + player[index][8] + "\n\u200B",
                    inline: true,
                  },
                  {
                    name: "Deffence :",
                    //prettier-ignore
                    value: player[index + 1][1] + "\n" + player[index + 1][2] + "\n" + player[index + 1][3] + "\n" + player[index + 1][4] + "\n" + player[index + 1][5] + "\n" + player[index + 1][6] + "\n" + player[index + 1][7] + "\n" + player[index + 1][8] + "\n\u200B",
                    inline: true,
                  }
                )
                .setTimestamp()
                .setFooter(
                  "Clash of clan Legend tracker BOT",
                  "attachment://legend.png"
                );

              sendMessage.edit(newEmbed);
            } catch (err) {
              console.log(err);
            }
            break;
          }
        }
      }
    }
  }
  setTimeout(() => {
    updateMessage(client);
  }, 300000);
}

// save function : at reset push in csv file array data.
async function save() {
  let guildD = guild.map((e) => e.join(",")).join("\n");
  require("fs").writeFile("./data/guild.csv", guildD, function (err) {
    if (err) throw err;
  });
  let playerD = player.map((e) => e.join(",")).join("\n");
  require("fs").writeFile("./data/player.csv", playerD, function (err) {
    if (err) throw err;
  });
  let channelD = channelID.map((e) => e.join(",")).join("\n");
  require("fs").writeFile("./data/channel.csv", channelD, function (err) {
    if (err) throw err;
  });
}

// trophy command : anyone can use. If player exist send his attack / deffence log else add it in player array / csv.
async function simpleSpy(arg, message) {
  var playerExist = false;
  for (
    let playerI = 0;
    playerI < player.length && playerExist == false;
    playerI++
  ) {
    if (player[playerI][0] === String(arg).substr(1)) {
      player[playerI][10] = player[playerI][10] + 1;
      var diff = player[playerI][9] - player[playerI + 1][10];
      var emote =
        diff >= 0 ? "<:won:910374607675084820>" : "<:lost:910374586292502549>";
      const playerEmbed = new MessageEmbed()
        .setColor("#8400ff")
        .attachFiles(attachment)
        .setTitle(player[playerI + 1][0] + " #" + player[playerI][0])
        .setThumbnail("attachment://legend.png")
        .addFields(
          {
            //prettier-ignore
            name: "Current trophy : " + player[playerI][9],
            value: diff + " " + emote + "\n\u200B",
          },
          {
            name: "Attack :",
            //prettier-ignore
            value: player[playerI][1] + "\n" + player[playerI][2] + "\n" + player[playerI][3] + "\n" + player[playerI][4] + "\n" + player[playerI][5] + "\n" + player[playerI][6] + "\n" + player[playerI][7] + "\n" + player[playerI][8] + "\n\u200B",
            inline: true,
          },
          {
            name: "Deffence :",
            //prettier-ignore
            value: player[playerI + 1][1] + "\n" + player[playerI + 1][2] + "\n" + player[playerI + 1][3] + "\n" + player[playerI + 1][4] + "\n" + player[playerI + 1][5] + "\n" + player[playerI + 1][6] + "\n" + player[playerI + 1][7] + "\n" + player[playerI + 1][8] + "\n\u200B",
            inline: true,
          }
        )
        .setTimestamp()
        .setFooter(
          "Clash of clan Legend tracker BOT",
          "attachment://legend.png"
        );

      message.channel.send(playerEmbed);
      playerExist = true;
    }
  }
  if (playerExist === false) {
    var info = await coc.coc(arg, message);

    if (info.trophy > 5000) {
      player.push(
        [String(arg).substr(1), 0, 0, 0, 0, 0, 0, 0, 0, info.trophy, 1],
        [info.name, 0, 0, 0, 0, 0, 0, 0, 0, info.trophy, info.trophy]
      );
      //prettier-ignore
      var dataPLAYER =
        String(arg).substr(1) + "," + 0 + "," + 0 + "," + 0 + "," + 0 + "," + 0 + "," + 0 + "," + 0 + "," + 0 + "," + info.trophy + "," + 1 + "\n"
        + info.name + "," + 0 + "," + 0 + "," + 0 + "," + 0 + "," + 0 + "," + 0 + "," + 0 + "," + 0 + "," + info.trophy + "," + info.trophy + "\n";
      require("fs").appendFileSync("./data/player.csv", dataPLAYER);

      const playerEmbed = new MessageEmbed()
        .setColor("#8400ff")
        .attachFiles(attachment)
        .setTitle(info.name + " " + arg)
        .setThumbnail("attachment://legend.png")
        .addFields(
          {
            //prettier-ignore
            name: "Current trophy : " + info.trophy + "\n\u200B",
            value: "Player wasn't in data base\n\u200B",
          },
          {
            name: "Player is now added, player attack and deffence will be update from now on.",
            value: "\u200B",
          }
        )
        .setTimestamp()
        .setFooter(
          "Clash of clan Legend tracker BOT",
          "attachment://legend.png"
        );

      message.channel.send(playerEmbed);
    }
  }
}

// leaderboard command : anyone can use. Send embed with top 3 most searched player
async function leaderboard(message) {
  var top1 = 0;
  var top1Index = 0;
  var top2 = 0;
  var top2Index = 0;
  var top3 = 0;
  var top3Index = 0;

  for (var lead = 0; lead < player.length; lead = lead + 2) {
    if (player[lead][10] > top1) {
      top3 = top2;
      top3Index = top2Index;
      top2 = top1;
      top2Index = top1Index;
      top1 = player[lead][10];
      top1Index = lead;
    } else if (player[lead][10] > top2) {
      top3 = top2;
      top3Index = top2Index;
      top2 = player[lead][10];
      top2Index = lead;
    } else if (player[lead][10] > top3) {
      top3 = player[lead][10];
      top3Index = lead;
    }
  }
  const playerEmbed = new MessageEmbed()
    .setColor("#ccff00")
    .attachFiles(attachment)
    .setTitle("Spying leaderboard :")
    .setThumbnail("attachment://legend.png")
    .addFields(
      {
        name:
          "Number 1 : " +
          player[top1Index + 1][0] +
          " #" +
          player[top1Index][0],
        value: "Searched :" + player[top1Index][10] + " times\n\u200B",
      },
      {
        name:
          "Number 2 : " +
          player[top2Index + 1][0] +
          " #" +
          player[top2Index][0],
        value: "Searched :" + player[top2Index][10] + " times\n\u200B",
      },
      {
        name:
          "Number 3 : " +
          player[top3Index + 1][0] +
          " #" +
          player[top3Index][0],
        value: "Searched :" + player[top3Index][10] + " times\n\u200B",
      }
    )
    .setTimestamp()
    .setFooter("Clash of clan Legend tracker BOT", "attachment://legend.png");

  message.channel.send(playerEmbed);
}

//prettier-ignore
module.exports = { help, add, remove, save_data, channel, spy, updateMessage, simpleSpy, leaderboard };
