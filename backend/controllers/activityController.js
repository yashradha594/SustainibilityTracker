import ActivityLog from '../models/ActivityLog.js';
import User from '../models/User.js';
import { calculateEmissions } from '../utils/emissionCalculator.js';

export const logActivity = async (req, res) => {
  try {
    const { date, transport, food, energy, waste } = req.body;
    const userId = req.user._id;
    const targetDate = date ? new Date(date) : new Date();

    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingActivity = await ActivityLog.findOne({
      userId,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    const emissions = calculateEmissions({ transport, food, energy, waste });
    let activity;

    if (existingActivity) {
      existingActivity.transport = transport;
      existingActivity.food = food;
      existingActivity.energy = energy;
      existingActivity.waste = waste;
      existingActivity.emissions = emissions;
      activity = await existingActivity.save();
    } else {
      activity = await ActivityLog.create({
        userId,
        date: targetDate,
        transport,
        food,
        energy,
        waste,
        emissions
      });

      // Update streak for new activity
      const user = await User.findById(userId);
      
      const lastActivity = await ActivityLog.findOne({ userId, _id: { $ne: activity._id } }).sort({ date: -1 });
      
      if (lastActivity) {
        const lastDate = new Date(lastActivity.date);
        lastDate.setHours(0, 0, 0, 0);
        
        const diffTime = Math.abs(startOfDay - lastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          user.currentStreak += 1; // Consecutive day
        } else if (diffDays > 1) {
          user.currentStreak = 1; // Streak broken
        }
      } else {
        user.currentStreak = 1; // First activity
      }
      
      await user.save();
    }

    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getActivities = async (req, res) => {
  try {
    const activities = await ActivityLog.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTodayActivity = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const activity = await ActivityLog.findOne({
      userId,
      date: { $gte: today, $lte: endOfDay }
    });

    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
