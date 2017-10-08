var Api = {

    league: null,
    teamId: null,

    apiKey: 'jE7yBJVRNAwdDesMgTzTXUUSx1It41Fq',
    gameDate: null,

    setLeague(league) {
        this.league = league || 'mlb';
    },

    setTeamId(teamId) {
        this.teamId = teamId || this.getTeamId('CLE');
    },

    getTeamId(name) {
        name = name && name.toUpperCase();
        var mlbTeams = ['BAL', 'BOS', 'CLE', 'DET', 'MIL', 'NYY', 'TOR', 'LAA', 'CHW', 'KC', 'MIN', 'OAK', 'SEA', 'TEX', 'CHC', 'WSH', 'NYM', 'PHI', 'PIT', 'STL', 'ATL', 'CIN', 'HOU', 'LAD', 'SD', 'SF', 'AL', 'NL', 'MIA', 'COL', 'TB', 'ARZ'];
        var nbaTeams = ['BOS', 'MIA', 'BKN', 'NY', 'ORL', 'PHI', 'WSH', 'ATL', 'NO', 'CHI', 'CLE', 'DET', 'IND', 'MIL', 'DAL', 'DEN', 'HOU', 'MIN', 'SA', 'UTA', 'GS', 'LAC', 'LAL', 'PHX', 'POR', 'SAC', 'OKC', 'ECS', 'WCS', 'TOR', 'MEM', 'CHA'];
        var nflTeams = ['BUF', 'IND', 'MIA', 'NE', 'NYJ', 'CIN', 'CLE', 'TEN', 'PIT', 'DEN', 'KC', 'OAK', 'LAC', 'SEA', 'DAL', 'NYG', 'PHI', 'ARZ', 'WSH', 'CHI', 'DET', 'GB', 'MIN', 'TB', 'ATL', 'LAR', 'NO', 'SF', 'AFC', 'NFC', 'JAX', 'CAR', 'BAL', 'HOU']

        var teams = [];
        if (this.league == 'mlb') { teams = mlbTeams }
        if (this.league == 'nba') { teams = nbaTeams }
        if (this.league == 'nfl') { teams = nflTeams }

        return teams.indexOf(name) + 1;
    },

    getSport() {
        return {
            mlb: 'baseball',
            nba: 'basketball',
            nfl: 'football',
            cfb: 'football'
        }[this.league];
    },

    getTodaysGame(cb) {
        this.gameDate = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000 * 2).toJSON().replace(/-|T|:/g, '').substr(0, 8);
        var url = 'https://api.foxsports.com/sportsdata/v1/' + this.getSport() + '/' + this.league + '/teams/' + this.teamId + '/events.json?date=' + this.gameDate + '&apikey=' + this.apiKey;
        $.get(url).done(results => cb(results.page[0]));
    },

    getTeamInfo(teamId, cb) {
        var url = 'https://api.foxsports.com/sportsdata/v1/' + this.getSport() + '/' + this.league + '/teams/' + teamId + '.json?&apikey=' + this.apiKey;
        $.get(url).done(cb);
    },

    getGameState(gameId, cb) {
        var time = new Date().toJSON().replace(/-|T|:/g, '').substr(0, 14);
        var url = ''
        if (this.league == 'nfl' || this.league == 'cfb') {
            url = 'https://api.foxsports.com/sportsdata/v1/live/' + this.league + '/scores.json?season=2017&seasontype=reg&week=5&t=' + time + '&apikey=' + this.apiKey;
        }
        else {
            url = 'https://api.foxsports.com/sportsdata/v1/live/' + this.league + '/scores.json?date=' + this.gameDate + '&t=' + time + '&apikey=' + this.apiKey;
        }
        $.get(url).done(games => {
            var gameState = games.find(t => t.GameState.GameId == gameId).GameState;
            cb(gameState);
        })
    }
}
