const { canModifyQueue } = require("../util/MuzikUtil");

module.exports = {
  name: "döngü",
  aliases: ['l',"loop"],
  description: "Müzik döngüsünü ayarlarsınız.",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("Hiçbir şey oynatılmıyor.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    // toggle from false to true and reverse
    queue.loop = !queue.loop;
    return queue.textChannel
      .send(`Döngü ${queue.loop ? "**açık**" : "**kapalı**"}`)
      .catch(console.error);
  }
};
