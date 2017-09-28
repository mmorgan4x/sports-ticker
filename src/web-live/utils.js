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
    }
}