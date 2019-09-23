import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose, { Aggregate } from 'mongoose';

import CryptoJS from "crypto-js";

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/k2');

const connection = mongoose.connection;

connection.once('open', ()=>{
    console.log('Mongo connection established!');
})

const router = express.Router();

import User from './models/user';
import Game from './models/game';
import { UserScore } from './models/user-score';
import { UsersGames } from './models/users-games';
import { UnresolvedTerm } from './models/unresolved-term';
import Term from './models/term';
import Anagram from './models/anagram';
import { UnsresolvedReq } from './models/unresolved-req';
import DayGame from './models/day-game';
import { AnagramModule } from './models/anagram-module';

router.route('/login').post((req, res)=>{
    let username = req.body.username;
    let password = req.body.password;
    
    var hash = CryptoJS.HmacSHA256(password, "secretKey123");
    password = CryptoJS.enc.Base64.stringify(hash);

    User.findOne({'username' : username, 'password' : password, 'isApproved' : 1},
        (err,user) => {
        if(err) {
            console.log(err);
        } else {
            res.json(user);
        }
    });
});

router.route('/register').post((req, res)=>{
    let name = req.body.name;
    let surname = req.body.surname;
    let email = req.body.email;
    let job = req.body.job;
    let username = req.body.username;
    let password = req.body.password
    let sex = req.body.sex;
    let jmbg = req.body.jmbg;
    let secretQuestion = req.body.secretQuestion;
    let secretQuestionAnswer = req.body.secretQuestionAnswer;
    let picture = req.body.picture;

    var hash = CryptoJS.HmacSHA256(password, "secretKey123");
    password = CryptoJS.enc.Base64.stringify(hash);

    User.findOne({'username' : username},
       async (err,user1)=>{
        if(err) {
            console.log(err);
        } else {
            if(user1) {
                res.json({'isApproved' : -1});
            } else {
                await User.insertMany([ 
                    { 'name' : name, 'surname' : surname, 'email' : email, 'job' : job, 
                    'username' : username, 'password' : password, 'sex' : sex,
                    'jmbg' : jmbg, 'secretQuestion' : secretQuestion, 'secretQuestionAnswer' : secretQuestionAnswer,
                    'picture' : picture, 'isApproved' : 0, type : 'user' } 
                ]).then(user => {
                        res.status(200).json(user[0]);
                    }).catch(err=>{
                        res.status(400).json(null);
                    });
            } 
        }
    });
});

router.route('/changePassword').post((req, res)=>{
    let username = req.body.username;
    let oldPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword;

    var hash = CryptoJS.HmacSHA256(oldPassword, "secretKey123");
    oldPassword = CryptoJS.enc.Base64.stringify(hash);

    hash = CryptoJS.HmacSHA256(newPassword, "secretKey123");
    newPassword = CryptoJS.enc.Base64.stringify(hash);

    User.findOne({'username' : username, 'password' : oldPassword},
         (err,user)=>{
            if(err) {
                console.log(err);
            } else {
                if(user) {
                    User.findOneAndUpdate({'username' : username}, {'password' : newPassword}, (err, user) => {
                        if(err) {
                            console.log(err);
                        } else {
                            res.status(200).json(user);
                        }
                    });
                } else {
                    res.json(user);
                }
            }
    });
});

router.route('/forgotPasswordChange').post((req, res)=>{
    let username = req.body.username;
    let jmbg = req.body.jmbg;
    let secretQuestion = req.body.secretQuestion;
    let secretQuestionAnswer = req.body.secretQuestionAnswer;
    let newPassword = req.body.newPassword;

    var hash = CryptoJS.HmacSHA256(newPassword, "secretKey123");
    newPassword = CryptoJS.enc.Base64.stringify(hash);

    User.findOne({'username' : username, 'jmbg' : jmbg, 'secretQuestion' : secretQuestion, 'secretQuestionAnswer' : secretQuestionAnswer},
         (err,user)=>{
            if(err) {
                console.log(err);
            } else {
                if(user) {
                    User.findOneAndUpdate({'username' : username}, {'password': newPassword}, (err, user) => {
                        if(err) {
                            console.log(err);
                        } else {
                            res.status(200).json(user);
                        }
                    })
                } else {
                    res.json(user);
                }
            }
    });
});

router.route('/bestPlayerForCurrentMonth').get(
    async (req, res)=>{

        let month: number = new Date().getMonth();
        
        let firstArray : UserScore[] = await Game.aggregate([
            { $match: { month: month } },
            { $group: { _id: "$username1", total: { $sum: "$user1score" } } }
        ]).exec();

        let secondArray : UserScore[] = await Game.aggregate([
            { $match: { month: month } },
            { $group: { _id: "$username2", total: { $sum: "$user2score" } } }
        ]).exec();

        let finalResultScore : UserScore[] = new Array<UserScore>();
        for(let i = 0; i < firstArray.length; i++) {
            for(let j = 0; j < secondArray.length; j++) {
                if(firstArray[i]._id == secondArray[j]._id) {
                    firstArray[i].total += secondArray[j].total;
                }
            }

            if(firstArray[i]._id != '') {
                finalResultScore.push(firstArray[i]);
            }
        }

        for(let i = 0; i < secondArray.length; i++) {
            let found : boolean = false;
            for(let j = 0; j < firstArray.length; j++) {
                if(firstArray[j]._id == secondArray[i]._id) {
                    found = true;
                }
            }

            if(!found) {
                if(secondArray[i]._id != '') {
                    finalResultScore.push(secondArray[i]);
                }
            }
        }

        finalResultScore.sort((n1,n2) => n2.total - n1.total);

        res.json(finalResultScore);
    }
);

router.route('/getBestPlayerForPast20Days').get(
    async (req, res)=>{

        let currentTime: number = new Date().getTime() / 1000;
        
        let firstArray : UserScore[] = await Game.aggregate([
            { $match: { time : { $gte : currentTime - 1728000 } } },
            { $group: { _id: "$username1", total: { $sum: "$user1score" } } }
        ]).exec();

        let secondArray : UserScore[] = await Game.aggregate([
            { $match: { time : { $gte : currentTime - 1728000 } } },
            { $group: { _id: "$username2", total: { $sum: "$user2score" } } }
        ]).exec();

        let finalResultScore : UserScore[] = new Array<UserScore>();
        for(let i = 0; i < firstArray.length; i++) {
            for(let j = 0; j < secondArray.length; j++) {
                if(firstArray[i]._id == secondArray[j]._id) {
                    firstArray[i].total += secondArray[j].total;
                }
            }
            
            if(firstArray[i]._id != '') {
                finalResultScore.push(firstArray[i]);
            }
        }

        for(let i = 0; i < secondArray.length; i++) {
            let found : boolean = false;
            for(let j = 0; j < firstArray.length; j++) {
                if(firstArray[j]._id == secondArray[i]._id) {
                    found = true;
                }
            }

            if(!found) {
                if(secondArray[i]._id != '') {
                    finalResultScore.push(secondArray[i]);
                }
            }
        }

        finalResultScore.sort((n1,n2) => n2.total - n1.total);

        res.json(finalResultScore);
    }
);

router.route('/allPlayedGamesIn7Days').post(
    async (req, res)=>{
        let username = req.body.username;
        let currentTime: number = new Date().getTime() / 1000;
        
        let resultArray = await Game.aggregate([
            { $match: { $and : [ { time : { $gte : currentTime - 604800 } } , { $or: [ { username1: username }, { username2 : username } ] } ] } }
        ]).exec();

        res.json(resultArray);
    }
);

router.route('/getBestPlayersForToday').get(
    async (req, res)=>{

        let month: number = new Date().getMonth();
        let day : number = new Date().getDate();

        let firstArray : UserScore[] = await Game.aggregate([
            { $match: { $and : [ { month: month }, { day : day } ] } },
            { $group: { _id: "$username1", total: { $sum: "$user1score" } } }
        ]).exec();

        let secondArray : UserScore[] = await Game.aggregate([
            { $match: { $and : [ { month: month }, { day : day } ] } },
            { $group: { _id: "$username2", total: { $sum: "$user2score" } } }
        ]).exec();

        let finalResultScore : UserScore[] = new Array<UserScore>();
        for(let i = 0; i < firstArray.length; i++) {
            for(let j = 0; j < secondArray.length; j++) {
                if(firstArray[i]._id == secondArray[j]._id) {
                    firstArray[i].total += secondArray[j].total;
                }
            }

            if(firstArray[i]._id != '') {
                finalResultScore.push(firstArray[i]);
            }
        }

        for(let i = 0; i < secondArray.length; i++) {
            let found : boolean = false;
            for(let j = 0; j < firstArray.length; j++) {
                if(firstArray[j]._id == secondArray[i]._id) {
                    found = true;
                }
            }

            if(!found) {
                if(secondArray[i]._id != '') {
                    finalResultScore.push(secondArray[i]);
                }
            }
        }

        finalResultScore.sort((n1,n2) => n2.total - n1.total);

        res.json(finalResultScore);
    }
);

router.route('/createNewGame').post(
    async (req, res) => {
        let username : string = req.body.username;

        let date : Date = new Date();
        let month: number = date.getMonth();
        let day : number = date.getDate();
        let time : number = date.getTime();

        await Game.insertMany([ 
            { 'username1' : username, 'username2' : "", 'user1score' : 0, 'user2score' : 0, 'time' : time, 'day' : day, 'month' : month, 'secondPlayerInGame' : false } 
        ]).then(game => {
                res.status(200).json(game);
            }).catch(err=>{
                res.status(400).json(null);
            });
    }
);

router.route('/joinGame').post(
    async (req, res) => {
        let username2 : string = req.body.username;

        let games : UsersGames[] = await Game.aggregate([
            { $match: { secondPlayerInGame : false } }
        ]).exec();

        if(games.length == 0) {
            res.json(null);
        } else {
            Game.findOneAndUpdate({'username1' : games[0].username1, 'secondPlayerInGame' : false }, {'username2' : username2, 'secondPlayerInGame' : true }, (err, game) => {
                if(err) {
                    console.log(err);
                    res.json(null);
                } else {
                    res.status(200).json(game);
                }
            });
        }
    }
);

router.route('/isReqApproved').post(
    async (req, res)=>{
        let username : string = req.body.username;

        let user : any[] = await User.aggregate([
            { $match: { username : username } }
        ]).exec();

        if(user) {
            res.status(200).json(user[0]);
        } else {
            res.status(400).json(null);
        }
    }
);

router.route('/insertNewAnagram').post(
    async (req, res) => {
        let anagramQuestion : string = req.body.question;
        let anagramAnswer : string = req.body.answer;

        if(anagramAnswer == "") {
            let anagrami = JSON.parse(anagramQuestion); // anagramQuestion == anagramFile, anagramAnswer is indicatior.
            
            await Anagram.insertMany(anagrami.Anagrami).then(anagram => {
                res.status(200).json(anagram);
            }).catch(err=>{
                res.status(400).json(null);
            });
        } else {
            await Anagram.insertMany([ 
                { 'question' : anagramQuestion, 'answer' : anagramAnswer } 
            ]).then(anagram => {
                    res.status(200).json(anagram);
                }).catch(err=>{
                    res.status(400).json(null);
                });
        }
    }
);

router.route('/getAllUnresolvedTerms').get(
    async (req, res) => {

        let unresolvedTerms : UnresolvedTerm[] = await Term.aggregate([
            { $match: { resolveStatus : 0 } }
        ]).exec();

        if(unresolvedTerms.length == 0) {
            res.json(null);
        } else {
             res.status(200).json(unresolvedTerms);
        }
    }
);

router.route('/acceptTerm').post(
    async (req, res) => {
        let name : string = req.body.term;

        Term.findOneAndUpdate({'name' : name }, {'resolveStatus' : 1 }, (err, term) => {
            if(err) {
                console.log(err);
                res.json(null);
            } else {
                res.status(200).json(term);
            }
        });
    }
);

router.route('/declineTerm').post(
    async (req, res) => {
        let name : string = req.body.term;

        Term.findOneAndUpdate({'name' : name }, {'resolveStatus' : 2 }, (err, term) => {
            if(err) {
                console.log(err);
                res.json(null);
            } else {
                res.status(200).json(term);
            }
        });
    }
);

router.route('/getAllUnresolvedReqs').get(
    async (req, res) => {

        let unresolvedReqs : UnsresolvedReq[] = await User.aggregate([
            { $match: { isApproved : 0 } }
        ]).exec();

        if(unresolvedReqs.length == 0) {
            res.json(null);
        } else {
            res.status(200).json(unresolvedReqs);
        }
    }
);

router.route('/acceptReq').post(
    async (req, res) => {
        let username : string = req.body.username;

        User.findOneAndUpdate({'username' : username }, {'isApproved' : 1 }, (err, user) => {
            if(err) {
                console.log(err);
                res.json(null);
            } else {
                res.status(200).json(user);
            }
        });
    }
);

router.route('/declineReq').post(
    async (req, res) => {
        let username : string = req.body.username;

        User.findOneAndUpdate({'username' : username }, {'isApproved' : 2 }, (err, user) => {
            if(err) {
                console.log(err);
                res.json(null);
            } else {
                res.status(200).json(user);
            }
        });
    }
);

router.route('/insertNewDayGame').post(
    async (req, res) => {
        let dayGameDate : string = req.body.dayGameDate;
        let dayGameName : string = req.body.dayGameName;

        DayGame.findOne({'date' : dayGameDate}, 
            (err,dayGame)=>{
                if(err) {
                    console.log(err);
                } else {
                    if(dayGame != null) {
                        res.json(null);
                    } else {
                        DayGame.insertMany([ 
                            { 'date' : dayGameDate, 'name' : dayGameName, 'question' : "", 'answer' : "" } 
                        ]).then(dayGame => {
                                res.status(200).json(dayGame);
                            }).catch(err=>{
                                res.status(400).json(null);
                            });
                    }
                    
                }
        });
    }
);

router.route('/getAllApprovedAnagrams').get(
    async (req, res) => {

        let approvedAnagrams = await Anagram.find().exec();

        if(approvedAnagrams == null) {
            res.json(null);
        } else {
            res.status(200).json(approvedAnagrams);
        }
    }
);

router.route('/acceptAnagram').post(
    async (req, res) => {
        let dayGameDate : string = req.body.dayGameDate;
        let dayGameName : string = req.body.dayGameName;
        let question : string = req.body.question;
        let answer : string = req.body.answer;

        await DayGame.findOneAndRemove({'date' : dayGameDate, 'name' : dayGameName, 'question' : "", 'answer' : ""}); // Deletes empty row for anagram day game.

        DayGame.insertMany([ 
            { 'date' : dayGameDate, 'name' : dayGameName, 'question' : question, 'answer' : answer } 
        ]).then(anagram => {
                res.status(200).json(anagram);
            }).catch(err=>{
                res.status(400).json(null);
            });
    }
);

router.route('/getAnagramsForDate').post(
    async (req, res) => {
        let date : string = req.body.date;

        let anagrams : AnagramModule[] = await DayGame.aggregate([
            { $match: { date : date } }
        ]).exec();

        if(anagrams.length == 0) {
            res.json(null);
        } else {
            res.status(200).json(anagrams);
        }
    }
);

router.route('/isSomeoneJoinedGame').post(
    async (req, res)=>{
        let username : string = req.body.username;

        let users : any[] = await Game.aggregate([
            { $match: { secondPlayerInGame : true, username1 : username } }
        ]).exec();

        if(users.length > 0) {
            res.status(200).json(users[0]);
        } else {
            res.status(400).json(null);
        }
    }
);

router.route('/evaluateExpression').post(
    async (req, res)=>{
        let expression : string = req.body.expression;
        let expressionValue;
        let isExpressionValid : boolean = true;

        try {
            expressionValue = eval(expression);
            if (expression == "" || (expressionValue - Math.floor(expressionValue) != 0)) {
                expressionValue = 0;
                isExpressionValid = false;
            }
        } catch (e) {
            if (e instanceof SyntaxError) {
                expressionValue = 0;
                isExpressionValid = false;
            }
        }

        res.json({'expressionValue' : expressionValue, 'expressionStatus' : isExpressionValid});
    }
);

router.route('/isTermValid').post(
    async (req, res)=>{
        let type : string = req.body.type;
        let answer : string = req.body.answer;
        
        let terms : any[] = await Term.aggregate([
            { $match: { name : answer, type : type, resolveStatus : 1 } }
        ]).exec();

        if(terms.length > 0) {
            res.status(200).json({'isTermValid' : true, 'waitForApproval' : false});
        } else {
            let terms2 : any[] = await Term.aggregate([
                { $match: { name : answer, type : type, resolveStatus : 2 } }
            ]).exec();

            if(terms2.length > 0) {
                res.json({'isTermValid' : false, 'waitForApproval' : false});
            } else {
                Term.insertMany([ 
                    { 'name' : answer, 'type' : type, 'resolveStatus' : 0 } 
                ]);
                res.json({'isTermValid' : false, 'waitForApproval' : true});
            }
        }
    }
);

router.route('/checkTermNewState').post(
    async (req, res)=>{
        let type : string = req.body.type;
        let answer : string = req.body.answer;
        
        let terms : any[] = await Term.aggregate([
            { $match: { name : answer, type : type, resolveStatus : 2 } }
        ]).exec();

        if(terms.length > 0) {
            res.status(200).json({'isTermValid' : false, 'waitForApproval' : false});
        } else {
            let terms2 : any[] = await Term.aggregate([
                { $match: { name : answer, type : type, resolveStatus : 1 } }
            ]).exec();

            if(terms2.length > 0) {
                res.json({'isTermValid' : true, 'waitForApproval' : false});
            } else {
                res.json({'isTermValid' : false, 'waitForApproval' : true});
            }
        }
    }
);

router.route('/getTodayGame').get(
    async (req, res)=>{
        let date : Date = new Date();
        let dateString : string = date.getFullYear() + "-";

        if(date.getMonth() + 1 < 10) {
            dateString = dateString + "0" + (date.getMonth() + 1) + "-";
        } else {
            dateString = dateString + (date.getMonth() + 1) + "-";
        }

        if(date.getDate() < 10) {
            dateString = dateString + "0" + date.getDate();
        } else {
            dateString = dateString + date.getDate();
        }

        let resultArray = await DayGame.aggregate([
            { $match: { 'date' : dateString } }
        ]).exec();

        res.json(resultArray);
    }
);

router.route('/isAlreadyPlayed').post(
    async (req, res)=>{
        let username : string = req.body.username;
        let date : Date = new Date();

        let resultArray = await Game.aggregate([
            { $match: { 'username1' : username, 'day' : date.getDate(), 'month' : date.getMonth() } }
        ]).exec();

        res.json(resultArray);
    }
);


router.route('/updateGameResult').post(
    async (req, res)=>{
        let username : string = req.body.username;
        let finalScore : number = req.body.finalScore;
        let date : Date = new Date();

        Game.findOneAndUpdate({'username1' : username, 'day' : date.getDate(), 'month' : date.getMonth()}, {'user1score': finalScore}, (err, game) => {
            if(err) {
                console.log(err);
                res.json(null);
            } else {
                res.status(200).json(game);
            }
        });
    }
);

router.route('/insertNewGeo').post(
    (req, res)=>{
        let type : string = req.body.type;
        let term : number = req.body.term;

        Term.insertMany([ 
            { 'type' : type, 'name' : term, 'resolveStatus' : 1 } 
        ]).then(term => {
                console.log(term);
                res.status(200).json(term[0]);
            }).catch(err=>{
                res.status(400).json(null);
            });
    }
);

app.use('/', router);
app.listen(4000, () => console.log(`Express server running on port 4000`));