(function (socket) {
    var hiddenElem;

    socket.on('replace-plugin:replace', function (data) {
        var regex = new RegExp(data.regex);
        var elems = document.getElementsByTagName('LINK');
        for (var i = 0; i < elems.length; i ++) {
            if (elems[i].href.match(regex)) {
                swapFile(elems[i], 'href', {});
            }
        }
    });

    function getLocation(url) {
        var location = document.createElement("a");
        location.href = url;

        if (location.host === "") {
            location.href = location.href;
        }

        return location;
    }
    /**
     * @param {string} search
     * @param {string} key
     * @param {string} suffix
     */
    function updateSearch(search, key, suffix) {

        if (search === "") {
            return "?" + suffix;
        }

        return "?" + search
                .slice(1)
                .split("&")
                .map(function (item) {
                    return item.split("=");
                })
                .filter(function (tuple) {
                    return tuple[0] !== key;
                })
                .map(function (item) {
                    return [item[0], item[1]].join("=");
                })
                .concat(suffix)
                .join("&");
    }

    function swapFile (elem, attr, options) {
        var currentValue = elem[attr];
        var timeStamp    = new Date().getTime();
        var key          = "rel";
        var suffix       = key + "=" + timeStamp;
        var anchor       = getLocation(currentValue);
        var search       = updateSearch(anchor.search, key, suffix);

        if (options.timestamps === false) {
            elem[attr] = anchor.href;
        } else {
            elem[attr] = anchor.href.split("?")[0] + search;
        }

        var body = document.body;

        setTimeout(function () {
            if (!hiddenElem) {
                hiddenElem = document.createElement("DIV");
                body.appendChild(hiddenElem);
            } else {
                hiddenElem.style.display = "none";
                hiddenElem.style.display = "block";
            }
        }, 200);
    }
})(window.___browserSync___.socket);
