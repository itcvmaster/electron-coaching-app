export default (player = {}, teamKills) => {
  return (player.stats?.kills + player.stats?.assists) / (teamKills || 1);
};
