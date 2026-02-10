interface Hook {
  total_votes: number;
  green_percentage: number;
}

export function calculateDashboardMetrics(hooks: Hook[]) {
  const totalHooks = hooks.length;
  const totalVotes = hooks.reduce((sum, h) => sum + h.total_votes, 0);
  const winningHooks = hooks.filter(h => h.green_percentage > 50).length;
  const winningPercentage = totalHooks > 0
    ? ((winningHooks / totalHooks) * 100).toFixed(1)
    : '0';
  const avgVotes = totalHooks > 0
    ? (totalVotes / totalHooks).toFixed(1)
    : '0';

  return {
    totalHooks,
    winningPercentage: `${winningPercentage}%`,
    avgVotesPerHook: avgVotes,
    topCategory: 'All'
  };
}
