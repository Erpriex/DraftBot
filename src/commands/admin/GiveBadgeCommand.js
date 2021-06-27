module.exports.help = {
	name: "givebadge",
	aliases: ["gb"],
	userPermissions: ROLES.USER.BADGE_MANAGER
};

/**
 * Allow the bot owner or a badgemanager to give an item to somebody
 * @param {module:"discord.js".Message} message - Message from the discord server
 * @param {("fr"|"en")} language - Language to use in the response
 * @param {String[]} args=[] - Additional arguments sent with the command
 */
const GiveBadgeCommand = async (message, language, args) => {
	const embed = new discord.MessageEmbed();
	if (message.mentions.users.last() === undefined) {
		return sendErrorMessage(message.author, message.channel, language, JsonReader.commands.giveBadgeCommand.getTranslation(language).descError);
	}
	const playerId = message.mentions.users.last().id;
	[entity] = await Entities.getOrRegister(playerId);
	await entity.Player.addBadge(args[0]);
	await entity.Player.save();

	embed.setColor(JsonReader.bot.embed.default)
		.setAuthor(format(JsonReader.commands.giveBadgeCommand.getTranslation(language).giveSuccess, {pseudo: message.author.username}), message.author.displayAvatarURL())
		.setDescription(format(JsonReader.commands.giveBadgeCommand.getTranslation(language).descGive, {
			badge: args[0],
			player: message.mentions.users.last()
		}));
	return await message.channel.send(embed);
};

module.exports.execute = GiveBadgeCommand;