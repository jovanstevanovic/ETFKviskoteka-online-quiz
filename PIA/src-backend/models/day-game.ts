import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let DayGame = new Schema({
    date: {
        type: String
    },
    name: {
        type: String
    },
    answer: {
        type: String
    },
    question: {
        type: String
    }
});

export default mongoose.model('daygame', DayGame);