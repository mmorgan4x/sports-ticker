import * as request from 'request-promise';
const apiKey = 'jE7yBJVRNAwdDesMgTzTXUUSx1It41Fq';

class Utils {
    getTeamInfo(id: number) {
        return `https://api.foxsports.com/sportsdata/v1/basketball/nba/teams/${id}.json?&apikey=${apiKey}`;
    }
}

export let utils = new Utils()