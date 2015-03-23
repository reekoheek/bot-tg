module.exports = function(param) {
    var splitted = param.split(/\s+/);
    var result = [];
    for(var i = 0; i < splitted.length; i++) {
        result.push(splitted[splitted.length - 1 - i]);
    }

    return result.join(' ');
};