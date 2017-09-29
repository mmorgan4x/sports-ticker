var Render = {
    clearGame() {
        $('.logo, .abbr, .record').html('');
        clearGameState();
    },

    clearGameState() {
        $('#HomeScore, #AwayScore').html('').removeClass('faded');
        $('#Line1, #Line2').html('');
    },

    teamInfo(team, isHome) {
        var selector = isHome ? $('#HomeTeam') : $('#AwayTeam');
        selector.find('.logo').html('<img src="' + team.links.logos.Medium + '">');
        selector.find('.abbr').html(team.abbreviation);
        // selector.find('.record').html(team.record.wins + ' - ' + team.record.losses);
    },

    noGame(time) {
        this.clearGame();
        $('#Line2').html('No Game Today');
    },

    pregame(time) {
        this.clearGameState();
        $('#Line1').html(time.toLocaleDateString());
        $('#Line2').html(Utils.formatTime(time));
    },

    gameState(gameState) {
        this.clearGameState();
        $('#HomeScore').html(gameState.HomeScore);
        $('#AwayScore').html(gameState.AwayScore);

        if (Api.league == 'mlb') {
            var suffix = ['', 'st', 'nd', 'rd'][gameState.Inning] || 'th';
            var marker = gameState.IsActive ? (gameState.IsInningTop ? 'Top' : 'Bottom') : (gameState.IsInningTop ? 'End' : 'Middle');
            var inning = (marker == 'End' ? gameState.Inning - 1 : gameState.Inning);

            $('#Line1').html(marker + ' ' + inning + suffix)
            $('#Line2').html(gameState.IsActive ? (gameState.Outs + (gameState.Outs == 1 ? ' out' : ' outs')) : '');
        }
        if (Api.league == 'nfl' || Api.league == 'cfb') {
            var suffix = ['', 'st', 'nd', 'rd'][gameState.Quarter] || 'th';
            $('#Line1').html(gameState.Quarter + suffix)
            $('#Line2').html(gameState.Time.slice(3));

            if (gameState.Time == '00:00:00' && !gameState.IsActive) {
                $('#Line1').html(gameState.Quarter == 2 ? 'Halftime' : ('End ' + gameState.Quarter + suffix))
                $('#Line2').html('');
            }
        }
    },

    gameDelayed() {
        $('#Line1').html('Delayed');
        $('#Line2').html('');
    },

    gameFinal(score) {
        this.clearGameState();
        $('#HomeScore').html(score.homeScore);
        $('#AwayScore').html(score.awayScore);

        $('#Line1').html('');
        if (score.homeScore > score.awayScore) {
            $('#AwayScore').addClass('faded');
            $('#Line2').html('<i class="fa fa-caret-left transparent"></i> Final <i class="fa fa-caret-right"></i>');
        }
        else {
            $('#HomeScore').addClass('faded');
            $('#Line2').html('<i class="fa fa-caret-left"></i> Final <i class="fa fa-caret-right transparent"></i>');
        }
    },
}
