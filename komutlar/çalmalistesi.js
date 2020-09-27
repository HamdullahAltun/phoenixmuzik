const { MessageEmbed } = require("discord.js");
const { play } = require("../include/play");
const { YOUTUBE_API_KEY, MAX_PLAYLIST_SIZE, SOUNDCLOUD_CLIENT_ID } = require("../config.json");
const YouTubeAPI = require("simple-youtube-api");
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);
const scdl = require("soundcloud-downloader")

module.exports = {
  name: "çalmalistesi",
  cooldown: 3,
  aliases: ["pl","playlist","çl"],
  description: "YouTube'den bir çalma listesi oynatırsınız.",
  async execute(message, args) {
    const { PRUNING } = require("../config.json");
    const { channel } = message.member.voice;

    const serverQueue = message.client.queue.get(message.guild.id);
    if (serverQueue && channel !== message.guild.me.voice.channel)
      return message.reply(`${message.client.user} ile aynı kanalda olmalısınız.`).catch(console.error);

    if (!args.length)
      return message
        .reply(`Kullanım: ${message.client.prefix}çalmalistesi <YouTube Çalmalistesi URL | Çalmalistesi adı>`)
        .catch(console.error);
    if (!channel) return message.reply("Önce bir ses kanalına katılmanız gerekiyor!").catch(console.error);

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT"))
      return message.reply("Ses kanalına bağlanılamıyor, `BAĞLAN` izini eksik.");
    if (!permissions.has("SPEAK"))
      return message.reply("Müzik çalınamıyor, `KONUŞ` izini eksik.");

    const search = args.join(" ");
    const pattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
    const url = args[0];
    const urlValid = pattern.test(args[0]);

    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      loop: false,
      volume: 100,
      playing: true
    };

    let song = null;
    let playlist = null;
    let videos = [];

    if (urlValid) {
      try {
        playlist = await youtube.getPlaylist(url, { part: "snippet" });
        videos = await playlist.getVideos(MAX_PLAYLIST_SIZE || 10, { part: "snippet" });
      } catch (error) {
        console.error(error);
        return message.reply("Çalma Listesi bulunamadı :(").catch(console.error);
      }
    } else if (scdl.isValidUrl(args[0])) {
      if (args[0].includes('/sets/')) {
        message.channel.send('⌛ çalma listesi getiriliyor ...')
        playlist = await scdl.getSetInfo(args[0], SOUNDCLOUD_CLIENT_ID)
        videos = playlist.tracks.map(track => ({
          title: track.title,
          url: track.permalink_url,
          duration: track.duration / 1000
        }))
      }
    } else {
      try {
        const results = await youtube.searchPlaylists(search, 1, { part: "snippet" });
        playlist = results[0];
        videos = await playlist.getVideos(MAX_PLAYLIST_SIZE || 10, { part: "snippet" });
      } catch (error) {
        console.error(error);
        return message.reply("Çalma listesi bulunamadı :(").catch(console.error);
      }
    }

    videos.forEach((video) => {
      song = {
        title: video.title,
        url: video.url,
        duration: video.durationSeconds
      };

      if (serverQueue) {
        serverQueue.songs.push(song);
        if (!PRUNING)
          message.channel
            .send(`✅ **${song.title}**, ${message.author} tarafından kuyruğa eklendi.`)
            .catch(console.error);
      } else {
        queueConstruct.songs.push(song);
      }
    });

    let playlistEmbed = new MessageEmbed()
      .setTitle(`${playlist.title}`)
      .setURL(playlist.url)
      .setColor("#F8AA2A")
      .setTimestamp();

    if (!PRUNING) {
      playlistEmbed.setDescription(queueConstruct.songs.map((song, index) => `${index + 1}. ${song.title}`));
      if (playlistEmbed.description.length >= 2048)
        playlistEmbed.description =
          playlistEmbed.description.substr(0, 2007) + "\Çalma listesi karakter sınırından büyük ...";
    }

    message.channel.send(`${message.author} Bir çalma listesi başlattı`, playlistEmbed);

    if (!serverQueue) message.client.queue.set(message.guild.id, queueConstruct);

    if (!serverQueue) {
      try {
        queueConstruct.connection = await channel.join();
        await queueConstruct.connection.voice.setSelfDeaf(true);
        play(queueConstruct.songs[0], message);
      } catch (error) {
        console.error(error);
        message.client.queue.delete(message.guild.id);
        await channel.leave();
        return message.channel.send(`Kanala katılınamıyor: ${error}`).catch(console.error);
      }
    }
  }
};
