$(function () {

    api.sport = getParameterByName('sport') || 'baseball';
    api.league = getParameterByName('league') || 'mlb';
    api.teamId = api.getMlbTeamId(getParameterByName('team') || 'CLE');

    getGame();
    function getGame() {
        api.getTodaysGame(todaysGame => {
            if (todaysGame) {
                var gameId = todaysGame.id;
                var gameStart = new Date(todaysGame.date);
                var status = todaysGame.status.name;

                clearGameState();
                api.getTeamInfo(todaysGame.homeTeam.id, t => renderTeamInfo(t, true));
                api.getTeamInfo(todaysGame.awayTeam.id, t => renderTeamInfo(t, false));

                if (status == 'Pregame') {
                    renderGameStart(gameStart);
                    setTimeout(getGame, 10000);
                }
                else {
                    updateGame();
                    var gameStateInterval = setInterval(updateGame, 5000);

                    function updateGame() {
                        api.getScoreUpdate(gameId, gameState => {
                            renderGameState(gameState);
                            if (gameState.Status == 'Final') {
                                clearInterval(gameStateInterval);
                                setTimeout(getGame, 10000);
                            }
                        })
                    }
                }
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
    $('#Line1').html(time.toLocaleDateString())
    $('#Line2').html(formatTime(time));
}

function renderGameState(gameState) {
    if (gameState.Status == 'In Progress') {
        $('#HomeScore').html(gameState.HomeScore);
        $('#AwayScore').html(gameState.AwayScore);

        var suffix = ['', 'st', 'nd', 'rd'][gameState.Inning] || 'th';
        var desc = gameState.IsActive ? (gameState.IsInningTop ? 'Top ' : 'Bottom ') : (gameState.IsInningTop ? 'End ' : 'Middle ');
        $('#Line1').html(desc + gameState.Inning + suffix)
        $('#Line2').html(gameState.IsActive ? (gameState.Outs + (gameState.Outs == 1 ? ' out' : ' outs')) : '');
    }
    else if (gameState.Status == 'Final') {
        $('#HomeScore').html(gameState.HomeScore);
        $('#AwayScore').html(gameState.AwayScore);

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
}


function getParameterByName(name) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function formatTime(d) {
    function z(n) { return (n < 10 ? '0' : '') + n }
    var h = d.getHours();
    return (h % 12 || 12) + ':' + z(d.getMinutes()) + ' ' + (h < 12 ? 'AM' : 'PM');
}