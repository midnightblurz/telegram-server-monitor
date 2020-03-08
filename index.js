require('dotenv').config();

const sys = require('systeminformation');
const Telegraf = require('telegraf');


if (process.env.BOT_TOKEN === undefined) {
    console.log('\x1b[31m%s\x1b[0m', 'Bot token environment variable isn\'t defined');
    return;
}
// console.log(sys.getAllData());

console.log(process.env.BOT_TOKEN);
// sys.getAllData()
//     .then(data => console.log(data))
//     .catch(error => console.log(error));

//
// sys.cpu(function(data) {
//     console.log('CPU-Information:');
//     console.log(data);
// });

//
// // promises style - new in versyson 3
// sys.cpu()
//     .then(data => console.log(data))
//     .catch(error => console.error(error));
