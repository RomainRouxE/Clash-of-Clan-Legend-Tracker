require("dotenv").config();
var axios = require("axios");
const { Message } = require("discord.js");

async function coc(arg, message) {
  var config = {
    method: "get",
    url:
      "https://api.clashofclans.com/v1/players/%23" + String(arg).substring(1),
    headers: {
      Authorization: "Bearer " + process.env.COC_TOKEN2,
    },
  };
  var trophy;
  var name;
  await axios(config)
    .then(function (response) {
      //console.log(JSON.stringify(response.data));
      //console.log(response.data.trophies);
      name = response.data.name;
      trophy = response.data.trophies;
    })
    .catch(function (error) {
      console.log(error);
      if (error.response.status === 404 || error.response.status === 403) {
        message.channel.send(
          "Player doesn't exist. Make sure you provide a correct player tag"
        );
      } else {
        message.channel.send(
          "Something went wrong. Try again or contact bot owner"
        );
      }
      trophy = 0;
    });
  return { trophy, name };
}

async function trophy(arg) {
  var config = {
    method: "get",
    url: "https://api.clashofclans.com/v1/players/%23" + arg,
    headers: {
      Authorization: "Bearer " + process.env.COC_TOKEN2,
    },
  };
  var trophy;
  await axios(config)
    .then(function (response) {
      //console.log(JSON.stringify(response.data));
      //console.log(response.data.trophies);
      trophy = response.data.trophies;
    })
    .catch(function (error) {
      console.log(error);
    });
  return trophy;
}
module.exports = { coc, trophy };
