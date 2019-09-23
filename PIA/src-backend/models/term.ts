import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let Term = new Schema({
    name: {
        type: String
    },
    type: {
        type: String
    },
    resolveStatus: {
        type: Number
    }
});

export default mongoose.model('Term', Term);