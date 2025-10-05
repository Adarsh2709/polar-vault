import mongoose from 'mongoose';

const surveySchema = new mongoose.Schema({
  name: String,
  phone: String,
  use_case: String,
  capacity: String,
  email: String,
  feedback: String,
}, { timestamps: true });

export default mongoose.models.Survey || mongoose.model('Survey', surveySchema);