window.addEventListener('load', function() {
    'use strict';
    var elems = window.document.getElementsByClassName('animate');
    var i = 0;
    window.addEventListener('keydown', function(e) {
        if (e.keyCode == 13) {
            if (i < elems.length) {
                var elem = elems[i++];
                elem.classList.add('animated');
            }
        } else if (e.keyCode == 27) {
            if (i > 0) {
                var elem = elems[--i];
                elem.classList.remove('animated');
            }
        }
    });
});
