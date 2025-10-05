import mongoose from 'mongoose';
import Survey from './surveyModel.js';

export default async function handler(req, res) {
  // Connect to MongoDB (reuse connection if already open)
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  if (req.method === 'POST') {
    const { name, phone, use_case, capacity, email, feedback } = req.body;
    if (!name || !phone || !email) {
      return res.status(400).json({ error: 'Name, phone, and email are required.' });
    }
    try {
      const newSurvey = new Survey({ name, phone, use_case, capacity, email, feedback });
      await newSurvey.save();
      return res.status(200).json({ message: 'Survey submitted successfully' });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to save survey.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
