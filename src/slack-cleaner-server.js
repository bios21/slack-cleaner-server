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
        slack = require('slack');

/**
 * @param token
 * @param channel_id
 * @returns {Promise}
 */
function deleteSlackMessages(token, channel_id) {
    return (new Promise((ok, ko) => {
        slack.channels.history({token:token, channel: channel_id}, (err, data) => {
            if (err) {
                Logger.error(`Can't get history message`);
                ko(err);
            }
            
            ok(data.messages);
        });
    })).then(messages => {
        Logger.log(messages);
        messages.forEach(m => {
            slack.chat.delete({token:token, ts:m.ts, channel:channel_id}, (err, data) => {
                if (err) {
                    Logger.error(`Can't delete message`);
                    throw err;
                }
            });
        });
        return true;
    });
}

module.exports = () => {
    const app = express();
    
    app.all('/delete/:token/:channel_id', (req, res) => {
        Logger.log(req.params);
        let token = req.params.token,
            channel_id = req.params.channel_id,
            team_domain = req.params.team_domain,
            channel_name = req.params.channel_name;
        
        Logger.info(`Called for ${team_domain} on channel ${channel_name} with token ${token}`);

        deleteSlackMessages(token, channel_id).then(good => {
            if (good === true) {
                res.status(200);
            } else {
                res.status(500);
            }
            res.end(null);
        }).catch(err => {
            Logger.error(err);
            res.status(500);
            res.end(null);
        });
    });
    
    var server = app.listen(5140, () => {
        Logger.log(`Slack cleaner server will be ready soon on ${server.address().address}:${server.address().port}`);
    });
};
