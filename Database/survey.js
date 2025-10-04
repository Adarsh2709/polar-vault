import mongoose from "mongoose";

const surveySchema = new mongoose.Schema({
    name: String,
    phone: String,
    use_case: String,
    capacity: String,
    email: String,
    feedback: String,
}, {
    timestamps: true
});

const Survey = mongoose.model("Survey", surveySchema);

export default Survey;