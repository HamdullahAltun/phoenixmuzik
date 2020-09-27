const { canModifyQueue } = require("../util/MuzikUtil");

module.exports = {
  name: "sil",
  aliases: ["remove"],
  description: "Kuyruktaki şarkıyı kaldırır",
  execute(message, args) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send("Kuyruk yok.").catch(console.error);
    if (!canModifyQueue(message.member)) return;
    
    if (!args.length) return message.reply(`Kullanım: ${message.client.prefix}sil <Kuyruk numarası>`);
    if (isNaN(args[0])) return message.reply(`Kullanım: ${message.client.prefix}sil <Kuyruk numarası>`);

    const song = queue.songs.splice(args[0] - 1, 1);
    queue.textChannel.send(`${message.author} ❌ **${song[0].title}** müziğini kuyruktan kaldırdı..`);
  }
};
