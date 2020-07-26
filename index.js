const displayBoka = require("./boka.js");
const startRace = require("./race.js");
const Discord = require("discord.js");
const showAvatar = require("./avatar.js");

(function () {
  const bot = new Discord.Client();

  const token = process.env.TOKEN;

  const PREFIX = "`";

  bot.on("ready", () => {
    console.log("Bot is online!");
  });

  bot.on("message", message => {
    let args = message.content.substring(PREFIX.length).split(" ");
    if (message.content.startsWith(PREFIX)) {
      switch (args[0]) {
        case "baka":
          displayBoka(args, message);
          break;
        case "avatar":
          showAvatar(message);
          break;
        case "race":
          startRace(args, message, bot);
          break;
        case "gn":
          message.channel.send(`Good Night ${args[1]}`);
          break;
      }
    }
  });

  bot.login(token);
})();
