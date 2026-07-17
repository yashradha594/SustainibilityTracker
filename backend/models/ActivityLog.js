import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  transport: {
    mode: { type: String, enum: ['car', 'bike', 'public transport', 'walking', 'none'], default: 'none' },
    distance: { type: Number, default: 0 }, // in km
  },
  food: {
    diet: { type: String, enum: ['veg', 'non-veg', 'dairy', 'none'], default: 'none' },
  },
  energy: {
    electricity: { type: Number, default: 0 }, // in kWh
    acUsage: { type: Number, default: 0 }, // in hours
  },
  waste: {
    plasticUsage: { type: Number, default: 0 }, // items
    recycled: { type: Boolean, default: false },
  },
  emissions: {
    total: { type: Number, default: 0 }, // in kg CO2
    transport: { type: Number, default: 0 },
    food: { type: Number, default: 0 },
    energy: { type: Number, default: 0 },
  }
}, { timestamps: true });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
export default ActivityLog;
