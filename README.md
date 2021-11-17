# Clash-of-Clan-Legend-Tracker

Clash of clan Discord Bot to track attack / deffence of player above 5000 trophy.

[![Discord](https://badgen.net/badge/icon/invite?icon=discord&label&color=purple)](https://discord.com/api/oauth2/authorize?client_id=904420216535134328&permissions=281600&scope=bot)

## Quick use

Get a player attacks / deffence sent directly.

Or you can either add players and get an updated message of their attacks / deffence every 10min in a specific channel.

If its the first time a player is searched, only the attack / deffence happening after it was searched will be showned.

If multiple attacks / deffences happen at the same time, the bot will display the sum only.

- Ex: +40 / -30 at the same time will show only 1 attack +10.

![trackerExemple](https://github.com/RomainRouxE/Clash-of-Clan-Legend-Tracker/blop/main/img/trackerExemple.jpg?raw=true)

## Commands

```
Every commands start with the prefix l?

help
  Send commands usage
  Ex : l?help

trophy + #ID
  Send player current attack/def.
  Ex : l?trophy #xxxxxx

add + #ID
  Add a player to get trophy and update it every 10min.
  Ex : l?add #xxxxxx

remove + #ID
  Stop tracking a player trophy.
  Ex : l?remove #xxxxxx

channel + #channel
  Set a channel to send the tracking message. You need to use this command before using the add cmd.
  Ex : l?channel #channel

leaderboard
  Send top 3 most searched player.
  Ex : l?leaderboard


For channel and remove commands, admin, manage server or manage channem permissions is needed.


spy
  Start the loop to get trophy of every player. Repeat every 10min.

updateMessage
  Start the loop to update every embed message sent from add cmd. Repeat every 5min

save_data
  Get data from every csv file and push in array. To use in case of bot crash.

In order to use the spy - updateMessage ad save_data cmd you need to have your account ID
token in the .env as ADMIN_ID to use this command

```

## Usage

The bot is hosted and running, you can invite him on ur server with this invite :

[![Discord](https://badgen.net/badge/icon/invite?icon=discord&label&color=purple)](https://discord.com/api/oauth2/authorize?client_id=904420216535134328&permissions=281600&scope=bot)

But if you want to run the bot by yourself you need npm installed, then run the following commands :

```bash
npm i
npm start
```

You will also need to create a .env file a the root of the project containing some tokens :

```bash
DISCORD_TOKEN=YOUR_DISCORD_TOKEN
ADMIN_ID=YOUR_DISCORD_ACCOUNT_ID
COC_TOKEN=YOUR_CLASHOFCLAN_API_TOKEN
```

## Contributing

Pull requests are welcome.

If you got idea to improve the bot feel free to open a discussion or message me on discord : Absoluty#9999

My first bot... be kind :smile:

## License

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://choosealicense.com/licenses/gpl-3.0/)
