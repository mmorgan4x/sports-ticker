$(function main() {

    Api.league = Utils.getParameterByName('league') || 'mlb';
    Api.teamId = Utils.getParameterByName('teamId') || Api.getTeamId(Utils.getParameterByName('team') || 'CLE');

    getGame();
    function getGame() {
        Api.getTodaysGame(todaysGame => {
            if (todaysGame) {
                var gameId = todaysGame.id;
                var gameStart = new Date(todaysGame.date);
                var status = todaysGame.status.name;

                Api.getTeamInfo(todaysGame.homeTeam.id, t => Render.teamInfo(t, true));
                Api.getTeamInfo(todaysGame.awayTeam.id, t => Render.teamInfo(t, false));

                if (status == 'Pregame') {
                    Render.pregame(gameStart);

                    var timeout = Math.round((gameStart.getTime() - new Date().getTime()) * .9);
                    timeout = timeout < 10000 ? 10000 : timeout;
                    Utils.setTimeout(getGame, timeout, status);
                }
                else if (status == 'In Progress') {
                    updateGame();
                    function updateGame() {
                        Api.getScoreUpdate(gameId, gameState => {
                            if (gameState.Status == 'In Progress') {
                                Render.gameState(gameState);
                                Utils.setTimeout(updateGame, 5 * 1000, gameState.Status);
                            }
                            else {
                                getGame();
                            }
                        })
                    }
                }
                else if (status == 'Final') {
                    Render.gameFinal(todaysGame.score);
                    Utils.setTimeout(getGame, 4 * 60 * 60 * 1000, status);
                }
                else if (status == 'Delayed') {
                    Render.gameDelayed(todaysGame.score);
                    Utils.setTimeout(getGame, 4 * 60 * 60 * 1000, status);
                }
                else {
                    Utils.setTimeout(getGame, 10 * 60 * 1000, status);
                }
            }
            else {
                Render.noGame();
                Utils.setTimeout(getGame, 4 * 60 * 60 * 1000, 'No game today');
            }
        });
    }
});