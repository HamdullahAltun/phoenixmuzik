const fs = require("fs");
const config = require("../config.json");

module.exports = {
  name: "temizleme",
  description: "Bot mesajlarının temizlenmesini ayarlarsınız.",
  execute(message) {
    config.PRUNING = !config.PRUNING;

    fs.writeFile("./config.json", JSON.stringify(config, null, 2), (err) => {
      if (err) {
        console.log(err);
        return message.channel.send("Komut ayarlanırken bir hata oluştu.").catch(console.error);
      }

      return message.channel
        .send(`Mesaj temizleme ${config.PRUNING ? "**aktif**" : "**deaktif**"}`)
        .catch(console.error);
    });
  }
};
