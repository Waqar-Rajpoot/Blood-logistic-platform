export const getDonorRank = (points: number) => {
  if (points >= 50) return { name: "Platinum", color: "#E5E4E2", icon: "🏆" };
  if (points >= 25) return { name: "Gold", color: "#FFD700", icon: "👑" };
  if (points >= 10) return { name: "Silver", color: "#C0C0C0", icon: "🥈" };
  return { name: "Bronze", color: "#CD7F32", icon: "🥉" };
};