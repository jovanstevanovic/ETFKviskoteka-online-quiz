import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let Pen = new Schema({
    tip: {
        type: String
    },
    vlasnik: {
        type: String
    }
});

export default mongoose.model('Pen', Pen);