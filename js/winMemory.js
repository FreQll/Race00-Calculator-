const win = document.getElementById('memory-div');

win.onmousedown = function(event) {
    function moveAt(event) {
        win.style.left = event.pageX - win.offsetWidth / 2 + 'px';
        win.style.top = event.pageY - win.offsetHeight / 2 + 'px';
    }

    document.onmousemove = function(event) {
        moveAt(event)
    }

    win.onmouseup = function() {
        document.onmousemove = null;
        win.onmouseup = null;
    }


}