
const moment = require('moment');
const { now } = moment;
const Discord = require('discord.js')
const client = new Discord.Client();
const MongooseConnection = require('./bootstrap/modules/mongoose');
const { config } = require('./config/environments/default')
const FilmModel = require('./models/Film')
const FilmDatabase = require('./database/FilmDatabase')
const db = new FilmDatabase();

function Film(name, date, username) {
    return { name, date, username }
}

client.once('ready', () => {

    const mongooseConnection = new MongooseConnection();
    mongooseConnection.start();
    console.log('Discord client is ready.');
})

client.on('message', message => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();
    const today = moment.utc().startOf('day').format(config.dateformat);
    if (command === "filmekle") {
        // checking if the args are given correctly
        if (!args.length || args.length > 2) {
            return message.channel.send(`Geçersiz komut veya komut bilgileri lütfen kontrol ediniz. ${message.author}`);
        }
        // checking the date is valid or not
        const wantedDate = moment.utc(args[1], config.dateformat);
        if (!moment(wantedDate, true).isValid()) {
            return message.channel.send("Lütfen geçerli bir tarih giriniz.");
        }
        // checking if the date is before the creation time of the film
        if (moment(today).isSameOrBefore(wantedDate)) {
            let film = new Film(args[0], moment(args[1]).format(config.dateformat), message.author.username);
            createFilmAndResponse(film, message);
        } else {
            return message.channel.send("Şu anki tarihten daha önce bir tarihe film ekleymezsiniz");
        }
    } else if (command === "bugün") {
        db.getFilmByDate({ filmdate: today }).then(
            data => {
                return message.channel.send(`Bugün ${data.username} tarafından eklenen ${data.name}'u izleyeceğiz! :movie_camera:`)
            })
    }
});
function createFilmAndResponse(film, message) {
    console.log(film)
    FilmModel.create(film)
        .then(result => {
            return message.channel.send('Film isteğiniz kaydedildi.')
        }).catch(e => {
            return message.channel.send('Girdiğiniz tarihe başka bir film atanmıştır. Lütfen başka bir tarih giriniz.')
        });
}

client.login(config.token)