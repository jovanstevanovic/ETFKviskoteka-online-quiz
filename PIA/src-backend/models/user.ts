import mongoose from 'mongoose';

//var bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

let User = new Schema({
    name: {
        type: String
    },
    surname: {
        type: String
    },
    email: {
        type: String
    },
    job: {
        type: String
    },
    username: {
        type: String
    },
    password: {
        type: String
    },
    sex: {
        type: String
    },
    jmbg: {
        type: String
    },
    picture: {
        type: String
    },
    secretQuestion: {
        type: String
    },
    secretQuestionAnswer: {
        type: String
    },
    type: {
        type: String
    },
    isApproved: {
        type : Number
    }
});

// User.statics.generateHash = function generateHash(password: any) {
//     return bcrypt.hashSync(password, bcrypt.genSaltSync(9), null);
// };

export default mongoose.model('User', User);