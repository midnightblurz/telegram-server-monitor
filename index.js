require('dotenv').config();

const sys = require('systeminformation');
const Telegraf = require('telegraf');

const Bot = require('./src/bot');
const Helpers = require('./src/utils');


if (process.env.BOT_TOKEN === undefined) {
    console.log('\x1b[31m%s\x1b[0m', 'Bot token environment variable isn\'t defined');
    return;
}

if (process.env.ALLOWED_IDENTIFIERS === undefined) {
    console.log('\x1b[31m%s\x1b[0m', "Please define allowed user identifiers to whom the bot can send messages. Use the command '/my_id' to output your ID");
    return;
}


const bot = new Telegraf(process.env.BOT_TOKEN);
const responder = new Bot(bot);

//Commands
bot.command('my_id', (ctx) => {
    ctx.reply(`Welcome! Your ID is : ${ctx.message.chat.id}`);
});


bot.command('cpu', (ctx) => {

    sys.cpu()
        .then(data => {
            responder.reply(ctx, "``` " + JSON.stringify(data, null, 2) + " ```")
        })
        .catch(error => responder.reply(error));
});


bot.command('memory', (ctx) => {

    sys.mem()
        .then(data => {

            for (let item in data) {
                if (data.hasOwnProperty(item)) {
                    data[item] = Helpers.bytesToSize(data[item]);
                }
            }

            responder.objectReply(ctx, data);

        })
        .catch(error => responder.reply(error));
});


bot.command('os', (ctx) => {

    sys.osInfo()
        .then(data => {

            responder.objectReply(ctx, data);
        })
        .catch(error => responder.reply(error));
});



bot.command('users', (ctx) => {

    sys.users()
        .then(data => {

            responder.objectReply(ctx, data);
        })
        .catch(error => responder.reply(error));
});

bot.command('network', (ctx) => {

    sys.networkStats()
        .then(data => {

            responder.objectReply(ctx, data);
        })
        .catch(error => responder.reply(error));
});

// console.log(sys);

bot.launch();

