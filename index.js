require('dotenv').config();

const sys = require('systeminformation');
const os = require('os');

const table = require('table');
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
        .catch(error => responder.reply(ctx, error));
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
        .catch(error => responder.reply(ctx, error));
});


bot.command('os', (ctx) => {

    sys.osInfo()
        .then(data => {
            responder.objectReply(ctx, data);
        })
        .catch(error => responder.reply(ctx, error));
});


bot.command('users', (ctx) => {

    sys.users()
        .then(data => {
            responder.objectReply(ctx, data);
        })
        .catch(error => responder.reply(ctx, error));
});

bot.command('network', (ctx) => {

    sys.networkStats()
        .then(data => {
            responder.objectReply(ctx, data);
        })
        .catch(error => responder.reply(ctx, error));
});


bot.command('io', (ctx) => {

    sys.disksIO()
        .then(data => {
            responder.objectReply(ctx, data);
        })
        .catch(error => responder.reply(ctx, error));
});

bot.command('processes', async (ctx) => {

    const tableConfig = {

        border: {
            topBody: `─`,
            topJoin: `┬`,
            topLeft: `┌`,
            topRight: `┐`,

            bottomBody: `─`,
            bottomJoin: `┴`,
            bottomLeft: `└`,
            bottomRight: `┘`,

            bodyLeft: `│`,
            bodyRight: `│`,
            bodyJoin: `│`,

            joinBody: `─`,
            joinLeft: `├`,
            joinRight: `┤`,
            joinJoin: `┼`
        }
    };

    const res = await sys.processes()
        .then(async data => {

            let parsed = [], result;

            const filteredData = async () => {
                return Promise.all(data.list.filter(process => process.mem_rss > 0
                    && process.mem_vsz > 0
                    && !['unknown'].includes(process.state)
                    && process.user
                    && parseFloat(process.pcpu.toFixed(2)) > 0.00));
            };


            const getData = async () => {

                const filtered = await filteredData();

                return Promise.all(filtered.map(process => {
                    if (!parsed.includes(process.name) && process.pcpu > 0) {

                        parsed.push(process.name);

                        return [
                            process.name.substr(0, 16), Math.round((process.pcpu + Number.EPSILON) * 100) / 100
                        ];

                    }
                }))
            };

            result = getData().then(data => {
                data = data.filter(process => process !== undefined);

                data = data.sort((a, b) => {
                    return b[1] - a[1];
                });

                data.unshift(["NAME", "CPU%"]);
                return data;
            });

            return await result;

        })
        .catch(error => responder.reply(ctx, error));

    responder.reply(ctx, "```" + table.table(res, tableConfig) + "```");

});


bot.command('usage', async (ctx) => {

    const cpuTemperature = await sys.cpuTemperature()
        .then(data => {
            return data;
        })
        .catch(error => responder.reply(error));

    const cpuSpeed = await sys.cpuCurrentspeed()
        .then(data => {
            return data;
        })
        .catch(error => responder.reply(ctx, error));

    const fs = await sys.fsSize()
        .then(data => {

            if (data) {
                data = data.map(disk => {
                    return {
                        device: (disk.fs     ===   undefined) ? "Not defined" : disk.fs,
                        mount:  (disk.mount  ===   undefined) ? "Not defined" : disk.mount,
                        type:   (disk.type   ===   undefined) ? "Not defined" : disk.type,
                        size:   (disk.size   ===   undefined) ? "Not defined" : Helpers.bytesToSize(disk.size),
                        used:   (disk.used   ===   undefined) ? "Not defined" : Helpers.bytesToSize(disk.used),
                    }
                })
            }
            return data;
        })
        .catch(error => responder.reply(ctx, error));


    if (cpuSpeed.cores !== undefined) {
        delete cpuSpeed.cores;
    }


    const usage = {
        cpu: {
            temperature: cpuTemperature.main,
            speed: cpuSpeed
        },
        memory: {
            total: Helpers.bytesToSize(await os.totalmem()),
            free: Helpers.bytesToSize(await os.freemem()),
        },
        disk: fs
    };


    responder.objectReply(ctx, usage);

});

bot.launch();

