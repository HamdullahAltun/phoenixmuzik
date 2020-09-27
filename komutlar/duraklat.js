const { canModifyQueue } = require("../util/MuzikUtil");

module.exports = {
  name: "duraklat",
  aliases: ["stop","durdur"],
  description: "Oynatılan müziği duraklatır",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("Oynatılan hiçbir şey yok.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    if (queue.playing) {
      queue.playing = false;
      queue.connection.dispatcher.pause(true);
      return queue.textChannel.send(`${message.author} ⏸ müziği duraklattı.`).catch(console.error);
    }
  }
};
