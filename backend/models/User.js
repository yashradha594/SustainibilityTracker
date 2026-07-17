import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  currentStreak: {
    type: Number,
    default: 0,
  },
  lastLogin: {
    type: Date,
  },
  badges: {
    type: [String],
    default: [],
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
