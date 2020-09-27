const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "yardım",
  aliases: ["h","help","y"],
  description: "Bütün komutları ve açıklamalarını gösterir.",
  execute(message) {
    let commands = message.client.commands.array();

    let helpEmbed = new MessageEmbed()
      .setTitle("Phoenix Müzik Yardım Menüsü")
      .setDescription("Bütün komutların listesi")
      .setColor("#F8AA2A");

    commands.forEach((cmd) => {
      helpEmbed.addField(
        `**${message.client.prefix}${cmd.name} ${cmd.aliases ? `(${cmd.aliases})` : ""}**`,
        `${cmd.description}`,
        true
      );
    });

    helpEmbed.setTimestamp();

    return message.channel.send(helpEmbed).catch(console.error);
  }
};
