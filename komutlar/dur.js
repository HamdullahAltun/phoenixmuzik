const { canModifyQueue } = require("../util/MuzikUtil");


module.exports = {
  name: "dur",
  aliases: ["stop","durdur"],
  description: "Müziği durdurur.",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    
    if (!queue) return message.reply("Şu anda hiçbir şey çalınmıyor.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    queue.songs = [];
    queue.connection.dispatcher.end();
    queue.textChannel.send(`${message.author} ⏹ müziği durdurdu!`).catch(console.error);
  }
};
