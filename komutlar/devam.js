const { canModifyQueue } = require("../util/MuzikUtil");

module.exports = {
  name: "devam",
  aliases: ["resume","devamet"],
  description: "Duraklatılan müziği devam ettirir.",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("Şu anda oynatılan hiçbir şey yok.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    if (!queue.playing) {
      queue.playing = true;
      queue.connection.dispatcher.resume();
      return queue.textChannel.send(`${message.author} ▶ müziği devam ettirdi.!`).catch(console.error);
    }

    return message.reply("Hiçbir müzik duraklatılmamış.").catch(console.error);
  }
};
