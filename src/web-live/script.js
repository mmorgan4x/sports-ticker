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

                    var timeout = Math.round((gameStart.getTime() - new Date().getTime()) * .9);
                    timeout = timeout < 10000 ? 10000 : timeout;
                    setTimeout(getGame, timeout);
                    Utils.logTimeout(status, timeout)
                }
                else if (status == 'In Progress') {
                    updateGame();
                    function updateGame() {
                        Api.getScoreUpdate(gameId, gameState => {
                            if (gameState.Status == 'In Progress') {
                                renderGameState(gameState);
                                var timeout = 5 * 1000;
                                setTimeout(updateGame, timeout);
                                Utils.logTimeout('Updated', timeout)
                            }
                            else {
                                getGame();
                            }
                        })
                    }
                }
                else if (status == 'Final') {
                    renderGameFinal(todaysGame.score);
                    var timeout = 4 * 60 * 60 * 1000;
                    setTimeout(getGame, timeout);
                    Utils.logTimeout(status, timeout)
                }
                else {
                    var timeout = 10 * 60 * 1000;
                    setTimeout(getGame, timeout);
                    Utils.logTimeout(status, timeout)
                }
            }
            else {
                renderNoGame();
                var timeout = 4 * 60 * 60 * 1000;
                setTimeout(getGame, timeout);
                Utils.logTimeout('No game today', timeout)
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
