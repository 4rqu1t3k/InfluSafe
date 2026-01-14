export function estimateImpact(social = {}, score = 0) {
  const followers = social.followers || 0;
  const engagement = social.engagement || 0.02;

  const baseValue = followers * engagement * 0.015;
  const monthlyLoss = Math.round(baseValue * (score / 100));

  return {
    monthly_loss_usd: monthlyLoss,
    annual_loss_usd: monthlyLoss * 12,
    model: "InfluSafe Reputation Impact v1"
  };
}
