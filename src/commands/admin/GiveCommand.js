/**
 * Allow an admin to give an item to somebody
 * @param {("fr"|"en")} language - Language to use in the response
 * @param {module:"discord.js".Message} message - Message from the discord server
 * @param {String[]} args=[] - Additional arguments sent with the command
 */

const GiveCommand = async function (language, message, args) {
    // if ((await canPerformCommand(language, message,
    //     PERMISSION.ROLE.ADMINISTRATOR)) !== true) {
    //   return;
    // }
    let embed = new discord.MessageEmbed();
    let entity;
    let player = getUserFromMention(args[0]);;
    [entity] = await Entities.getOrRegister(player.id);
    let itemType = args[1];
    let itemId = args[2];
    await entity.Player.Inventory.giveObject(itemId, itemType);
    await Promise.all([
        entity.save(),
        entity.Player.save(),
        entity.Player.Inventory.save()
    ]);
    embed.setColor(JsonReader.bot.embed.default)
    .setAuthor(format(JsonReader.commands.giveCommand.getTranslation(language).giveSuccess, { pseudo: message.author.username }), message.author.displayAvatarURL())
    .setDescription(format(JsonReader.commands.giveCommand.getTranslation(language).descGive, { type: itemType, id: itemId, player: player }));
    return await message.channel.send(embed);
};

function getUserFromMention(mention) {
	if (!mention) return;

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		return client.users.cache.get(mention);
	}
}

module.exports = {
    'give': GiveCommand,
  };



