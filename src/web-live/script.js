$(function () {

    api.sport = 'baseball';
    api.league = 'mlb';
    api.teamId = 3;

    api.getTodaysGame(todaysGame => {
        if (todaysGame) {

            var gameId = todaysGame.id;
            api.getTeamInfo(todaysGame.homeTeam.id, t => renderTeamInfo($('#HomeTeam'), t));
            api.getTeamInfo(todaysGame.awayTeam.id, t => renderTeamInfo($('#AwayTeam'), t));
            var home = todaysGame.homeTeam.abbreviation;
            var away = todaysGame.awayTeam.abbreviation;

            setInterval(() => {
                var time = new Date().toJSON().replace(/-|T|:/g, '').substr(0, 14);
                var url = 'https://api.foxsports.com/sportsdata/v1/live/' + league + '/scores.json?date=' + date + '&t=' + time + '&apikey=' + apiKey;
                $.get(url).done(games => {

                    var gameState = games.find(t => t.GameState.GameId == gameId).GameState;
                    var game = {
                        inning: (gameState.IsInningTop ? 'Top ' : 'Bottom ') + gameState.Inning,
                        outs: gameState.Outs,
                        home: {
                            score: gameState.HomeScore,
                            abbreviation: todaysGame.homeTeam.abbreviation,
                            logUrl: todaysGame.homeTeam.abbreviation,
                        },
                        awayScore: gameState.awayScore,
                    }

                    api.updateTicker(game);
                    // var text = '';
                    // text += home + ': ' + game.HomeScore + ', ';
                    // text += away + ': ' + game.AwayScore;
                    // if (sport == 'baseball') {
                    //     text += '  ' + (game.IsInningTop ? 'TOP' : 'BOT');
                    //     text += game.Inning;
                    //     text += '  Balls:' + game.Balls;
                    //     text += '  Strikes:' + game.Strikes;
                    //     text += '  Outs:' + game.Outs;
                    //     text += '    ';
                    //     text += (game.RunnerOn1BId ? 'first, ' : '');
                    //     text += (game.RunnerOn2BId ? 'second, ' : '');
                    //     text += (game.RunnerOn3BId ? 'third, ' : '');
                    // }
                    // console.log(text)
                });
            }, 2000);
        }
    });
});

function renderTeamInfo(selector, team) {
    selector.find('.logo').html('<img src="' + team.links.logos.Medium + '">');
    selector.find('.abbr').html(team.abbreviation);
    selector.find('.record').html(team.record.wins + ' - ' + team.record.losses);
}