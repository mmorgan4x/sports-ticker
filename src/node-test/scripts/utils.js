"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var apiKey = 'jE7yBJVRNAwdDesMgTzTXUUSx1It41Fq';
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.prototype.getTeamInfo = function (id) {
        return "https://api.foxsports.com/sportsdata/v1/basketball/nba/teams/" + id + ".json?&apikey=" + apiKey;
    };
    return Utils;
}());
exports.utils = new Utils();
