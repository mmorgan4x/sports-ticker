$(function () {

    api.league = Utils.getParameterByName('league') || 'mlb';
    api.teamId = Utils.getParameterByName('teamId') || api.getTeamId(Utils.getParameterByName('team') || 'CLE');

    getGame();
    function getGame() {
        api.getTodaysGame(todaysGame => {
            if (todaysGame) {
                var gameId = todaysGame.id;
                var gameStart = new Date(todaysGame.date);
                var status = todaysGame.status.name;

                api.getTeamInfo(todaysGame.homeTeam.id, t => renderTeamInfo(t, true));
                api.getTeamInfo(todaysGame.awayTeam.id, t => renderTeamInfo(t, false));

                if (status == 'Pregame') {
                    renderGameStart(gameStart);
                    setTimeout(getGame, (gameStart.getTime() - new Date().getTime()) * .9);
                    console.info(new Date().toLocaleTimeString() + ':', 'Pregame - waiting ' + (((gameStart.getTime() - new Date().getTime()) * .9) / 60000) + ' minutes');
                }
                else if (status == 'In Progress') {
                    updateGame();
                    function updateGame() {
                        api.getScoreUpdate(gameId, gameState => {
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
    selector.find('.record').html(team.record.wins + ' - ' + team.record.losses);
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

    var suffix = ['', 'st', 'nd', 'rd'][gameState.Inning] || 'th';
    var marker = gameState.IsActive ? (gameState.IsInningTop ? 'Top' : 'Bottom') : (gameState.IsInningTop ? 'End' : 'Middle');
    var inning = (marker == 'End' ? gameState.Inning - 1 : gameState.Inning);

    $('#Line1').html(marker + ' ' + inning + suffix)
    $('#Line2').html(gameState.IsActive ? (gameState.Outs + (gameState.Outs == 1 ? ' out' : ' outs')) : '');
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