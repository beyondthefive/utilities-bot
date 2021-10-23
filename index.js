require("./server")();
const { Client : DiscordClient, Collection, Intents, Guild, GuildMember, Permissions } = require('discord.js');
const { Client : NotionClient} = require("@notionhq/client");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const notion_utils = require('./notion_utils');
const discord_utils = require('./discord_utils');
const fs = require('fs');
require('dotenv').config();

const notion = new NotionClient({
  auth: process.env.notion_key,
});


const client = new DiscordClient({ intents: [Intents.FLAGS.GUILDS] });
client.once('ready', () => {
	console.log('Ready!');
	client.user.setActivity('beyondthefive.org', { type: 'WATCHING' });
  //client.user.setAvatar('./assets/bt5logo.png');
});
client.login(process.env.token);
client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction, notion);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});