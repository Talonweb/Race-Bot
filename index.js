const Discord = require("discord.js");
const fs = require("fs");
const keepAlive = require("./server.js");
const config = require("./config.json");
const { TOKEN, PREFIX, variables } = config;

const client = new Discord.Client();
client.config = config;

["commands", "aliases"].forEach(x => client[x] = new Discord.Collection());


const load = (dir = "./commands") => {
	fs.readdirSync(dir).forEach(subDir => {
		const commands = fs.readdirSync(`${dir}\\${subDir}\\`).filter(file => file.endsWith('.js'))

		for (const file of commands) {
			const pull = require(`${dir}/${subDir}/${file}`);
			// we check here if the command name or command category is a string or not or check if they exist
			if (pull.help && typeof (pull.help.name) === "string" && typeof (pull.help.category) === "string") {
				if (client.commands.get(pull.help.name)) return console.warn(`${warning} Two or more commands have the same name ${pull.help.name}.`);
				// we add the the comamnd to the collection, Map.prototype.set() for more info
				client.commands.set(pull.help.name, pull);
				// we log if the command was loaded.
				console.log(`Loaded command |${pull.help.name}| ✅`);

			}
			else {
				// we check if the command is loaded else throw a error saying there was command it didn't load
				console.log(`Error loading command in ${dir}/${subDir}/${pull.help.name}. You have a missing help.name or help.name is not a string. or you have a missing help.category or help.category is not a string`);
				// we use continue to load other commands or else it will stop here
				continue;
			}
			// we check if the command has aliases, is so we add it to the collection
			if (pull.help.aliases && typeof (pull.help.aliases) === "object") {
				pull.help.aliases.forEach(alias => {
					// we check if there is a conflict with any other aliases which have same name
					if (client.aliases.get(alias)) return console.warn(`${warning} Two commands or more commands have the same aliases ${alias}`);
					client.aliases.set(alias, pull.help.name);
				});
			}
		}
	});
}

load();

client.on("ready", async () => {
	console.log("Bot is online!");
	client.user.setActivity(" `help", { type: "WATCHING" });
});

client.on("message", message => {
	if (message.author.bot || !message.guild) return;

	let args = message.content.substring(PREFIX.length).split(" ");
	const commandName = args[0];


	if (variables.isBee && message.author.id == "667444572632121375") {
		if (message.content == "yes ma'am") {
			message.channel.reply(
				"https://cdn.discordapp.com/attachments/747074718879842334/747080409652920361/B1wRd_XP-.gif"
			);
		}
	}

	if (!message.content.startsWith(PREFIX)) return;

	if (message.member.hasPermission("MANAGE_MESSAGES")) {
		client.commands.get("Scribble").execute(message, args, fs);
	}

	if (!client.commands.has(commandName)) return;

	const command = client.commands.has(commandName) ? client.commands.get(commandName) : client.aliases.get(commandName);

	try {
		if (command) command.execute(message, args, client);
	} catch (err) {
		console.log(err);
		message.reply("There was an error executing the command");
	}
});
keepAlive();
client.login(TOKEN);
