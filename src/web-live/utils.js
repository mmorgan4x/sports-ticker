var Utils = {
    getParameterByName(name) {
        var url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    },

    formatTime(d) {
        function z(n) { return (n < 10 ? '0' : '') + n }
        var h = d.getHours();
        return (h % 12 || 12) + ':' + z(d.getMinutes()) + ' ' + (h < 12 ? 'AM' : 'PM');
    },

    setTimeout(cb, timeout, status) {
        timeout = timeout < 1000 ? 1000 : timeout;
        setTimeout(cb, timeout)

        timeout /= 1000;
        var suffix = '';
        if (timeout < 60) {
            suffix = ' seconds';
        }
        else if (timeout < 60 * 60) {
            suffix = ' minutes'
            timeout /= 60;
        }
        else {
            suffix = ' hours'
            timeout /= 60 * 60;
        }
        
        console.info(new Date().toLocaleTimeString() + ':', status + ' - waiting ' + timeout + suffix + '...');
    }
}