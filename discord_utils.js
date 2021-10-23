const { create } = require("combined-stream");

const { Client : DiscordClient, Collection, Intents, Guild, GuildMember, Permissions } = require('discord.js');

const guild_id = "691976404983611412";
const enrolled_id = "889597618924167178"; 
const log_channel_id = "706570014458773755";
const client_id = "897248982303117342"; 
const student_services_id = "697302048827506778";


async function send_message_to_user(client, user_id, msg) {
    try {
    await client.users.fetch(user_id).send(msg);
    }
    catch(err) {
        console.log(err);
    }
};

async function check_for_role(client, uid, role_id) {
	guild = await client.guilds.fetch(guild_id);
	member = await guild.members.fetch(uid);
	return member._roles.includes(role_id);
};




module.exports = {
	check_for_role : check_for_role,
  send_message_to_user : send_message_to_user,
	guild_id : guild_id,
	enrolled_id : enrolled_id,
	log_channel_id : log_channel_id,
  client_id : client_id,
  student_services_id : student_services_id,
};