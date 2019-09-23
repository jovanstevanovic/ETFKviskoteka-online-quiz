import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let Anagram = new Schema({
    question: {
        type: String
    },
    answer: {
        type: String
    }
});

export default mongoose.model('Anagram', Anagram);