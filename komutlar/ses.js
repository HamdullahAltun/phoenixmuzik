const { canModifyQueue } = require("../util/MuzikUtil");

module.exports = {
  name: "ses",
  aliases: ["v","volume","sesdüzeyi"],
  description: "Şu anda çalan müziğin ses seviyesini değiştirir.",
  execute(message, args) {
    const queue = message.client.queue.get(message.guild.id);

    if (!queue) return message.reply("Oynatılan hiçbir şey yok.").catch(console.error);
    if (!canModifyQueue(message.member))
      return message.reply("Önce bir ses kanalına katılmanız gerekiyor!").catch(console.error);

    if (!args[0]) return message.reply(`🔊 Şimdiki ses seviyesi: **%${queue.volume}**`).catch(console.error);
    if (isNaN(args[0])) return message.reply("Lütfen ses seviyesini ayarlamak için bir sayı kullanın.").catch(console.error);
    if (parseInt(args[0]) > 100 || parseInt(args[0]) < 0)
      return message.reply("Lütfen 0-100 arasında bir sayı kullanın.").catch(console.error);

    queue.volume = args[0];
    queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);

    return queue.textChannel.send(`Ses seviyesi **%${args[0]}** olarak ayarlandı.`).catch(console.error);
  }
};
