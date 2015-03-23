var spawn = require('child_process').spawn,
    stripAnsi = require('strip-ansi'),
    util = require('util'),
    EventEmitter = require('events').EventEmitter;

var Tg = function(bin, key) {
    'use strict';

    var instance = this;
    var cli = this.cli = spawn(bin || TG_BIN, ['-k', key || TG_KEY, '-WR']);

    cli.stdout.on('data', function(data) {
        var raw = data.toString().trim();

        instance.emit('raw', raw);

        console.log('==> ' + stripAnsi(raw).trim().split('\n').join('\n  > '));

        var splitted = raw.split(/\u001b[^m]+m/g);
        var cmd = [];
        splitted.forEach(function(token) {
            token = stripAnsi(token).trim();
            if (token !== '') {
                cmd.push(token);
            }
        });

        if (cmd[0][0] === '[' && cmd[cmd.length - 1][0] === '>') {
            var msg = {
                original: cmd,
                time: cmd[0].substr(1, cmd[0].length - 2),
                replyTo: cmd[1].replace(/\s/g, '_'),
                sender: cmd[cmd.length - 2].replace(/\s/g, '_'),
                message: cmd[cmd.length - 1].substr(3).trim()

            };
            instance.emit('message', msg);
        }
    });

    cli.stderr.on('data', function(data) {
        instance.emit('error_', data.toString());
    });

    cli.on('exit', function(code) {
        instance.emit('exit');
    });

};

util.inherits(Tg, EventEmitter);

Tg.prototype.send = function(to, message) {
    this.cli.stdin.write('msg ' + to + ' ' + message + '\n');
};

module.exports = function(bin, key) {
    'use strict';

    return new Tg(bin, key);
};
