document.getElementById('luca-chat-outer-toggle').addEventListener('click', function (e) {
    e.stopPropagation();
});
document.getElementById('luca-chat-send-message-button').addEventListener('click', function (e) {
    e.stopPropagation();
});
Array.from(document.getElementsByClassName('luca-reaction')).forEach(function (el) {
    el.addEventListener('click', function (e) {
        e.stopPropagation();
    });
});
['click', 'keydown', 'keypress', 'keyup'].forEach(function (ev) {
    document.getElementById('luca-input-field').addEventListener(ev, function (e) {
        if (e.altKey == true && e.keyCode == 90 /*Z*/) {
            return;
        }
        e.stopPropagation();
    });
});
