const { canModifyQueue } = require("../util/MuzikUtil");

module.exports = {
  name: "şarkıyaatla",
  aliases: ["şarkıyageç","skipto"],
  description: "Kuyruktaki sıra numarasını girdiğiniz müziği çalmaya başlar.",
  execute(message, args) {
    if (!args.length)
      return message
        .reply(`Kullanım: ${message.client.prefix}${module.exports.name} <Kuyruk Numarası>`)
        .catch(console.error);

    if (isNaN(args[0]))
      return message
        .reply(`Kullanım: ${message.client.prefix}${module.exports.name} <Kuyruk Numarası>`)
        .catch(console.error);

    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send("Kuyruk yok.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    if (args[0] > queue.songs.length)
      return message.reply(`Geçersiz sayı!`).catch(console.error);

    queue.playing = true;
    if (queue.loop) {
      for (let i = 0; i < args[0] - 2; i++) {
        queue.songs.push(queue.songs.shift());
      }
    } else {
      queue.songs = queue.songs.slice(args[0] - 2);
    }
    queue.connection.dispatcher.end();
    queue.textChannel.send(`${message.author} ⏭ **${args[0] - 1}** adet şarkıyı geçti.`).catch(console.error);
  }
};
