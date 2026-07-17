import ActivityLog from '../models/ActivityLog.js';

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const activities = await ActivityLog.find({ userId }).sort({ date: 1 });

    if (!activities || activities.length === 0) {
      return res.json({
        totalEmissions: 0,
        sustainabilityScore: 0,
        tips: ["Start tracking your daily activities to get personalized tips!"],
        chartData: [],
        equivalentTrees: 0
      });
    }

    // Calculate totals
    let totalEmissions = 0;
    let transportEm = 0;
    let foodEm = 0;
    let energyEm = 0;
    
    const chartData = activities.map(act => {
      totalEmissions += act.emissions.total;
      transportEm += act.emissions.transport;
      foodEm += act.emissions.food;
      energyEm += act.emissions.energy;
      
      return {
        date: new Date(act.date).toLocaleDateString(),
        total: act.emissions.total,
        transport: act.emissions.transport,
        food: act.emissions.food,
        energy: act.emissions.energy
      };
    });

    // Score out of 100 based on average daily emissions (lower is better)
    // Let's assume average person emits 10kg CO2 per day.
    const avgDailyEmissions = totalEmissions / activities.length;
    let score = 100 - (avgDailyEmissions * 5); // Just a simple formula
    if (score > 100) score = 100;
    if (score < 0) score = 0;

    // Tips generator
    const tips = [];
    const latest = activities[activities.length - 1];
    if (latest.transport.mode === 'car') tips.push("Try using public transport tomorrow to reduce your carbon footprint.");
    if (latest.food.diet === 'non-veg') tips.push("Consider having a vegetarian meal today to lower food emissions.");
    if (latest.energy.acUsage > 2) tips.push("Try turning off the AC and opening a window to save energy.");
    if (tips.length === 0) tips.push("Great job! You're making eco-friendly choices.");

    // 1 tree absorbs ~21 kg of CO2 per year. 
    // This is just a gamification metric: savings compared to a baseline.
    // Let's assume baseline is 15kg/day.
    const baseline = 15 * activities.length;
    const savedCO2 = baseline - totalEmissions;
    const equivalentTrees = savedCO2 > 0 ? (savedCO2 / 21).toFixed(2) : 0;

    res.json({
      totalEmissions: parseFloat(totalEmissions.toFixed(2)),
      avgDailyEmissions: parseFloat(avgDailyEmissions.toFixed(2)),
      sustainabilityScore: Math.round(score),
      tips,
      chartData,
      equivalentTrees,
      breakdown: {
        transport: parseFloat(transportEm.toFixed(2)),
        food: parseFloat(foodEm.toFixed(2)),
        energy: parseFloat(energyEm.toFixed(2))
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
