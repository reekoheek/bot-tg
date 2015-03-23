var tg = require('./tg');

var TG_BIN = '/tg/bin/telegram-cli';
var TG_KEY = '/tg/tg-server.pub';

var PolyfillPromise = require('promise');
if (global.Promise) {
    for(var i in PolyfillPromise) {
        if (!global.Promise[i]) {
            global.Promise[i] = PolyfillPromise[i];
        }
    }
} else {
    global.Promise = PolyfillPromise;
}

var instance = tg(TG_BIN, TG_KEY);
instance.on('message', function(data) {
    if (data.message[0] === '!') {
        var splitted = data.message.split(/\s+/);
        var command = splitted[0].substr(1);
        var params = splitted.slice(1).join(' ');

        try {
            var c = require('./commands/' + command);
            Promise.resolve(c(params))
                .then(function(retval) {
                    instance.send(data.replyTo, retval);
                    console.log(retval);
                });
        } catch(e) {
            instance.send(data.replyTo, 'Perintah tidak dikenali: !' + command);
        }
    }
});
