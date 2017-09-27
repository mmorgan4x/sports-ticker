var api = {

    sport: null,
    league: null,
    teamId: null,
    apiKey: 'jE7yBJVRNAwdDesMgTzTXUUSx1It41Fq',

    getTodaysGame(cb) {
        var date = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toJSON().replace(/-|T|:/g, '').substr(0, 8);
        var url = 'https://api.foxsports.com/sportsdata/v1/' + this.sport + '/' + this.league + '/teams/' + this.teamId + '/events.json?date=' + date + '&apikey=' + this.apiKey;
        $.get(url).done(results => cb(results.page[0]));
    },

    getTeamInfo(teamId, cb) {
        var url = 'https://api.foxsports.com/sportsdata/v1/' + this.sport + '/' + this.league + '/teams/' + teamId + '.json?&apikey=' + this.apiKey;
        $.get(url).done(cb);
    },

    updateTicker(game) {
        console.log(game)
    }
}