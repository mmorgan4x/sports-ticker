var api = {

    sport: null,
    league: null,
    teamId: null,
    apiKey: 'jE7yBJVRNAwdDesMgTzTXUUSx1It41Fq',

    getMlbTeamId(name) {
        let teams = ['BAL', 'BOS', 'CLE', 'DET', 'MIL', 'NYY', 'TOR', 'LAA', 'CHW', 'KC', 'MIN', 'OAK', 'SEA', 'TEX', 'CHC', 'WSH', 'NYM', 'PHI', 'PIT', 'STL', 'ATL', 'CIN', 'HOU', 'LAD', 'SD', 'SF', 'AL', 'NL', 'MIA', 'COL', 'TB', 'ARZ'];
        return teams.indexOf(name) + 1;
    },

    getTodaysGame(cb) {
        var date = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000 * 2).toJSON().replace(/-|T|:/g, '').substr(0, 8);
        var url = 'https://api.foxsports.com/sportsdata/v1/' + this.sport + '/' + this.league + '/teams/' + this.teamId + '/events.json?date=' + date + '&apikey=' + this.apiKey;
        $.get(url).done(results => cb(results.page[0]));
    },

    getTeamInfo(teamId, cb) {
        var url = 'https://api.foxsports.com/sportsdata/v1/' + this.sport + '/' + this.league + '/teams/' + teamId + '.json?&apikey=' + this.apiKey;
        $.get(url).done(cb);
    },

    getScoreUpdate(gameId, cb) {
        var date = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000 * 2).toJSON().replace(/-|T|:/g, '').substr(0, 8);
        var time = new Date().toJSON().replace(/-|T|:/g, '').substr(0, 14);
        var url = 'https://api.foxsports.com/sportsdata/v1/live/' + this.league + '/scores.json?date=' + date + '&t=' + time + '&apikey=' + this.apiKey;
        $.get(url).done(games => {
            var gameState = games.find(t => t.GameState.GameId == gameId).GameState;
            cb(gameState);
        })
    }
}