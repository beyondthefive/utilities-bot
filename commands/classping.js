const { create } = require("combined-stream");

const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client : DiscordClient, Collection, Intents, Guild, GuildMember, Permissions, MessageEmbed } = require('discord.js');
const notion_utils = require('../notion_utils');
const discord_utils = require('../discord_utils');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('classping')
		.setDescription('Run this command in a class channel to ping all of its students.'),
	async execute(interaction, notion) {
    filter = {
      "property": "Channel ID",
      "text": {
        "contains": interaction.channelId
      }
    }; 
		result = await notion_utils.get_records(notion, notion_utils.courses_id, filter=filter);
    if(result.results.length !== 0) {
      pings = ``;
      for (id of result.results[0].properties["Student IDs"].rollup.array) {
        pings += `<@${id.rich_text[0].plain_text}> `
      }
      interaction.reply(pings);
    }
    else {
      interaction.reply("INVALID CLASS CHANNEL");
    }
    //console.log(result)
    

	},
};