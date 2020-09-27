const { canModifyQueue } = require("../util/MuzikUtil");

module.exports = {
  name: "karıştır",
  aliases: ["shuffle"],
  description: "Kuyruğu karıştırır.",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send("Karıştıralacak müzik bulunamadı.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    let songs = queue.songs;
    for (let i = songs.length - 1; i > 1; i--) {
      let j = 1 + Math.floor(Math.random() * i);
      [songs[i], songs[j]] = [songs[j], songs[i]];
    }
    queue.songs = songs;
    message.client.queue.set(message.guild.id, queue);
    queue.textChannel.send(`${message.author} 🔀 kuyruğu karıştırdı.`).catch(console.error);
  }
};
