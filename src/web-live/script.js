$(function () {

    Api.league = Utils.getParameterByName('league') || 'mlb';
    Api.teamId = Utils.getParameterByName('teamId') || Api.getTeamId(Utils.getParameterByName('team') || 'CLE');

    getGame();
    function getGame() {
        Api.getTodaysGame(todaysGame => {
            if (todaysGame) {
                var gameId = todaysGame.id;
                var gameStart = new Date(todaysGame.date);
                var status = todaysGame.status.name;

                Api.getTeamInfo(todaysGame.homeTeam.id, t => renderTeamInfo(t, true));
                Api.getTeamInfo(todaysGame.awayTeam.id, t => renderTeamInfo(t, false));

                if (status == 'Pregame') {
                    renderGameStart(gameStart);

                    var timeout = Math.round((gameStart.getTime() - new Date().getTime()) / 1000 * .9);
                    timeout = timeout < 10 ? 10 : timeout;
                    setTimeout(getGame, timeout * 1000);
                    console.info(new Date().toLocaleTimeString() + ':', 'Pregame - waiting ' + Math.round(timeout / 60) + ' minutes');
                }
                else if (status == 'In Progress') {
                    updateGame();
                    function updateGame() {
                        Api.getScoreUpdate(gameId, gameState => {
                            if (gameState.Status == 'In Progress') {
                                renderGameState(gameState);
                                setTimeout(updateGame, 5 * 1000);
                                console.info(new Date().toLocaleTimeString() + ':', 'Updated - waiting 5 seconds...');
                            }
                            else {
                                getGame();
                            }
                        })
                    }
                }
                else if (status == 'Final') {
                    renderGameFinal(todaysGame.score);
                    setTimeout(getGame, 4 * 60 * 60 * 1000);
                    console.info(new Date().toLocaleTimeString() + ':', 'Final - waiting 4 hours...');
                }
            }
            else {
                renderNoGame();
                setTimeout(getGame, 4 * 60 * 60 * 1000);
                console.info(new Date().toLocaleTimeString() + ':', 'No Game Today - waiting 4 hours...');
            }
        });
    }
});

function clearGameState() {
    $('#HomeScore, #AwayScore').html('').removeClass('faded');
    $('#Line1, #Line2').html('');
}

function renderTeamInfo(team, isHome) {
    var selector = isHome ? $('#HomeTeam') : $('#AwayTeam');
    selector.find('.logo').html('<img src="' + team.links.logos.Medium + '">');
    selector.find('.abbr').html(team.abbreviation);
    // selector.find('.record').html(team.record.wins + ' - ' + team.record.losses);
}

function renderNoGame(time) {
    clearGameState();
    $('.logo, .abbr, .record').html('');
    $('#Line2').html('No Game Today');
}

function renderGameStart(time) {
    clearGameState();
    $('#Line1').html(time.toLocaleDateString());
    $('#Line2').html(Utils.formatTime(time));
}

function renderGameState(gameState) {
    clearGameState();
    $('#HomeScore').html(gameState.HomeScore);
    $('#AwayScore').html(gameState.AwayScore);

    if (Api.league == 'mlb') {
        var suffix = ['', 'st', 'nd', 'rd'][gameState.Inning] || 'th';
        var marker = gameState.IsActive ? (gameState.IsInningTop ? 'Top' : 'Bottom') : (gameState.IsInningTop ? 'End' : 'Middle');
        var inning = (marker == 'End' ? gameState.Inning - 1 : gameState.Inning);

        $('#Line1').html(marker + ' ' + inning + suffix)
        $('#Line2').html(gameState.IsActive ? (gameState.Outs + (gameState.Outs == 1 ? ' out' : ' outs')) : '');
    }
    if (Api.league == 'nfl' || Api.league == 'ncf') {
        var suffix = ['', 'st', 'nd', 'rd'][gameState.Quarter] || 'th';
        $('#Line1').html(gameState.Quarter + suffix)
        $('#Line2').html(gameState.Time.slice(3));
    }
}

function renderGameFinal(score) {
    clearGameState();
    $('#HomeScore').html(score.homeScore);
    $('#AwayScore').html(score.awayScore);

    $('#Line1').html('')
    if (score.homeScore > score.awayScore) {
        $('#AwayScore').addClass('faded');
        $('#Line2').html('Final <i class="fa fa-caret-right"></i>');
    }
    else {
        $('#HomeScore').addClass('faded');
        $('#Line2').html('<i class="fa fa-caret-left"></i> Final');
    }
}
