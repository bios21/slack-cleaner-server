'use strict';

const   moment = require('moment');
        require('colors');

const appname = 'slack-cleaner-server';

module.exports = class Logger {
    static log(message, error) {
        const timestamp = moment().format('DD/MM/YYYY HH:mm:ss');

        console[error ? 'error' : 'log'](`[${appname}]`.yellow, `[${timestamp.green}]`, message);
    }

    static warn(message) {
        Logger.log(message.yellow.inverse);
    }

    static info(message) {
        Logger.log(message.blue);
    }

    static error(message, e) {
        Logger.log(`[ERROR] ${message}`.red, true);
        if (!!e) {
            Logger.log(e, true);
        }
    }

    static debug(...obj) {
        console.log(...obj);
    }
    
    static dir(obj) {
        const timestamp = moment().format('DD/MM/YYYY HH:mm:ss');

        const THE_OBJECT_OF_THE_DEAD = JSON.stringify(obj);
        if (THE_OBJECT_OF_THE_DEAD) {
            console.log(
                `[${appname}]`.yellow,
                `[${timestamp.green}]`,
                (typeof obj).bold,
                THE_OBJECT_OF_THE_DEAD.bold.magenta);
        } else {
            console.log(
                `[${appname}]`.yellow,
                `[${timestamp.green}]`,
                (typeof obj).bold);
            console.dir(obj);
        }
    }
};
