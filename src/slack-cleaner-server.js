'use strict';

/*
 * slack-cleaner-server
 * https://github.com/bios21/slack-cleaner-server
 *
 * Copyright (c) 2016 Lilian Saget-Lethias <lilian.sagetlethias@gmail.com>
 * Licensed under the ISC license.
 */

const   Logger = require('./utils/logger'),
        express = require('express'),
        slack = require('slack'),
        bodyParser = require('body-parser');

var overflow_indicator = 0;

/**
 * @param token
 * @param channel_id
 * @returns {Promise}
 */
function deleteSlackMessages(token, channel_id) {
    return (new Promise((ok, ko) => {
        slack.channels.history({token: token, channel: channel_id}, (err, data) => {
            if (err) {
                Logger.error(`Can't get history message`);
                ko(err);
            }

            if (data.messages) {
                overflow_indicator--;
                if (overflow_indicator < 0) {
                    overflow_indicator = 0;
                }
                ok(data.messages);
            } else {
                if (overflow_indicator < 3) {
                    ko('Overflow');
                } else {
                    ko();
                }
                overflow_indicator++;
            }
        });
    })).then(messages => {
        messages.forEach(m => {
            slack.chat.delete({token: token, ts: m.ts, channel: channel_id}, (err, data) => {
                if (err) {
                    Logger.error(`Can't delete message`);
                }
            });
        });
        return true;
    });
}

module.exports = () => {
    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.all('/delete/:secret/', (req, res) => {
        let token = req.params.secret,
            channel_id = req.body.channel_id,
            team_domain = req.body.team_domain,
            channel_name = req.body.channel_name;

        Logger.info(`Called for ${team_domain} on channel ${channel_name} (id:${channel_id}) with token ${token}`);

        deleteSlackMessages(token, channel_id).then(good => {
            if (good === true) {
                res.status(200);
            } else {
                res.status(500);
            }
            res.end(null);
        }).catch(err => {
            err && Logger.error(err);
            res.status(500);
            res.end(null);
        });
    });

    var server = app.listen(5140, () => {
        Logger.log(`Slack cleaner server will be ready soon on ${server.address().address}:${server.address().port}`);
    });
};
