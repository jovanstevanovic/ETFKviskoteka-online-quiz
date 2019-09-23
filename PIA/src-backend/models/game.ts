import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let Game = new Schema({
    username1: {
        type: String
    },
    username2: {
        type: String
    },
    user1score: {
        type: Number
    },
    user2score: {
        type: Number
    },
    month: {
        type: Number
    },
    time: {
        type: Number
    },
    day: {
        type: Number
    },
    secondPlayerInGame: {
        type: Boolean
    }
});

export default mongoose.model('Game', Game);