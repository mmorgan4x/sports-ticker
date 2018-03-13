import * as http from 'request-promise';

const apiKey = 'jE7yBJVRNAwdDesMgTzTXUUSx1It41Fq';

(async () => {
  for (let i = 0; i < 32; i++) {
    try {
      let res = JSON.parse(await http.get(getTeamInfo(i)))
      console.log(res.location);
    }
    catch {
      console.log('err');
    }
  }
})();


function getTeamInfo(id: number) {
  return `https://api.foxsports.com/sportsdata/v1/basketball/nba/teams/${id}.json?&apikey=${apiKey}`;
}