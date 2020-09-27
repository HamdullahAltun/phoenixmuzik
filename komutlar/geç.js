const { canModifyQueue } = require("../util/MuzikUtil");

module.exports = {
  name: "geç",
  aliases: ["s","skip","atla"],
  description: "Çalınan müziği geçer.",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue)
      return message.reply("Atlanabilecek bir müzik bulunmuyor.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    queue.playing = true;
    queue.connection.dispatcher.end();
    queue.textChannel.send(`${message.author} ⏭ müziği atladı.`).catch(console.error);
  }
};
