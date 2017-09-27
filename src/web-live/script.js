$(function () {

    api.sport = 'baseball';
    api.league = 'mlb';
    api.teamId = api.getMlbTeamId('HOU');

    api.getTodaysGame(todaysGame => {
        if (todaysGame) {
            var gameId = todaysGame.id;
            api.getTeamInfo(todaysGame.homeTeam.id, t => renderTeamInfo(t, true));
            api.getTeamInfo(todaysGame.awayTeam.id, t => renderTeamInfo(t, false));

            api.getScoreUpdate(gameId, gameState => renderGameState(gameState));
            setInterval(() => {
                api.getScoreUpdate(gameId, gameState => renderGameState(gameState));
            }, 5000);
        }
    });
});

function renderTeamInfo(team, isHome) {
    var selector = isHome ? $('#HomeTeam') : $('#AwayTeam');
    selector.find('.logo').html('<img src="' + team.links.logos.Medium + '">');
    selector.find('.abbr').html(team.abbreviation);
    selector.find('.record').html(team.record.wins + ' - ' + team.record.losses);
}

function renderGameState(gameState) {
    if (gameState.Status == 'Final') {
        $('#Line1').html('')
        if (gameState.HomeScore > gameState.AwayScore) {
            $('#AwayScore').addClass('faded');
            $('#Line2').html('Final <i class="fa fa-caret-right"></i>');
        }
        else {
            $('#HomeScore').addClass('faded');
            $('#Line2').html('<i class="fa fa-caret-left"></i> Final');
        }
    }
    else {
        var suffix = ['', 'st', 'nd', 'rd'][gameState.Inning] || 'th';
        var desc = gameState.IsActive ? (gameState.IsInningTop ? 'Top ' : 'Bottom ') : (gameState.IsInningTop ? 'End ' : 'Middle ');
        $('#Line1').html(desc + gameState.Inning + suffix)
        $('#Line2').html(gameState.IsActive ? (gameState.Outs + (gameState.Outs == 1 ? ' out' : ' outs')) : '');
    }

    $('#HomeScore').html(gameState.HomeScore);
    $('#AwayScore').html(gameState.AwayScore);
}
