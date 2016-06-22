(function (socket) {
    socket.on('replace-plugin:replace', function (data) {
        console.log(Array.prototype.slice(null, document.getElementsByTagName('LINK')));
    });
})(window.___browserSync___.socket);
