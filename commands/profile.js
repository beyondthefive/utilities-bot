const { create } = require("combined-stream");

const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client : DiscordClient, Collection, Intents, Guild, GuildMember, Permissions, MessageEmbed } = require('discord.js');
const notion_utils = require('../notion_utils');
const discord_utils = require('../discord_utils');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('profile')
		.setDescription('Run this command to see your student profile'),
	async execute(interaction, notion) {
    filter = {
    "and": [
      {
        "property": "Discord ID",
        "text": {
          "equals": interaction.user.id
        }
      },
      {
        "property": "Application Status",
        "select": {
          "equals": "ACCEPTED"
        }
      },
            ]
    };

    results = await notion_utils.get_records(notion, notion_utils.students_id, filter=filter);

    if(results.results.length !== 0) {

      //console.log(results.results[0]);
  
      //console.log(results.results[0].properties["First Name"].title[0].plain_text)
      name = results.results[0].properties["First Name"].title[0].plain_text + " " + results.results[0].properties["Last Name"].rich_text[0].plain_text;

      email = results.results[0].properties["Email"].email

      course_names = "";
      for (c of results.results[0].properties["Course Names"].rollup.array) {
        course_names += `${c.title[0].plain_text}\n`;
      }

      class_channels = "";
      for (c of results.results[0].properties["Course Channel IDs"].rollup.array) {
        class_channels += `<#${c.rich_text[0].plain_text}>\n`;
      }

      credits = results.results[0].properties["Credits"].rollup.number;

      credit_cap = results.results[0].properties["Credit Cap"].formula.number;

      applied_with_referral = results.results[0].properties["Submitted Referral Code"].rich_text.length == 0 ? false : true

      referral_code = results.results[0].properties["Referral Code"].rich_text[0].plain_text;

      try {
        referral_used = results.results[0].properties["# of Referrals"].rich_text[0].plain_text;
      }
      catch {
        referral_used = "0";
      }

      
    


      embed = new MessageEmbed()
			.setColor('#2c3c53')
			.setTitle('Your Beyond The Five Student Profile')
            .setFooter('Beyond The Five', discord_utils.bt5_logo_link)
            .addFields(
                { name: 'Name', value: name },
                { name: 'Email', value: email},
                { name: 'Courses', value: course_names},
                { name: 'Class Channels', value: class_channels}, 
                { name: 'Credits', value: `You are in ${credits}/${credit_cap} credits.`}, 
                { name: 'Applied Referral Code', value: referral_used ? "You did not apply to BT5 with a referral code. If you have a referral code and would like to apply it to your profile, email admissions. You can only redeem 1 referral code." : "You have already used a referral code."},
                { name: 'Referral Code', value: `Your assigned referral code is \`${referral_code}\`. \n For every person that uses this referral code during registration, not only do they get 2 extra credits, but you also get 2 extra credits!`},
                { name: 'Referral Code Usage', value: `Your referral code has been used \`${referral_used}\` times for a total of \`${referral_used * 2}\` extra credits.`},
                { name: 'Questions?', value: `If you would like to make updates to your student profile, such as adding or dropping classes, email \`admissions@beyondthefive.org\`. If you have questions about BT5, please ask them in <#${discord_utils.student_services_id}>.`}
            )

      interaction.reply({content: "Check your DMs!", ephemeral: true});
      interaction.user.send({ embeds: [embed] });

      // add referral increment (for both) + referral code generation + # of referrals initialization right after email update in course bot (i.e. right before the emailed box is checked--use this box)
      // also remember to generate referral codes for everyone else and refresh commands in the main server + swap out IDs
      // + add to email and announce in announcements (no ping) and enrolled-announcements

    }
    else {
      interaction.reply({content: "Please wait until you are accepted before using this command.", ephemeral: true});
    }
    
		
	},
};