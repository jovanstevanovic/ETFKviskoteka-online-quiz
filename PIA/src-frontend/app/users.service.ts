import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private uri = 'http://localhost:4000';

  constructor(private http: HttpClient) { }

  login(username, password) {
    
    const data = {
      username: username,
      password: password
    };

    return this.http.post(`${this.uri}/login`, data);
  }

  register(name, surname, email, job, username, password, sex, jmbg,
    secretQuestion, secretQuestionAnswer, picture) {

    const data = {
      name : name,
      surname : surname,
      email : email,
      job : job,
      username: username,
      password: password,
      sex : sex,
      jmbg : jmbg,
      secretQuestion : secretQuestion,
      secretQuestionAnswer : secretQuestionAnswer,
      picture : picture
    };

    return this.http.post(`${this.uri}/register`, data);
  }

  changePassword(username, oldPassword, newPassword) {

    const data = {
      username: username,
      oldPassword: oldPassword,
      newPassword : newPassword
    };

    return this.http.post(`${this.uri}/changePassword`, data);
  }

  forgotPasswordChange(username, jmbg, secretQuestion, secretQuestionAnswer, newPassword) {

    const data = {
      username: username,
      jmbg: jmbg,
      secretQuestion : secretQuestion,
      secretQuestionAnswer : secretQuestionAnswer,
      newPassword : newPassword
    };

    return this.http.post(`${this.uri}/forgotPasswordChange`, data);
  }

  getBestPlayersForCurrentMonth() {
    return this.http.get(`${this.uri}/bestPlayerForCurrentMonth`);
  }

  getBestPlayersForPast20Days() {
    return this.http.get(`${this.uri}/getBestPlayerForPast20Days`);
  }

  getBestPlayersForToday() {
    return this.http.get(`${this.uri}/getBestPlayersForToday`);
  }

  getAllPlayedGamesIn7Days(username) {
    
    const data = {
      username: username,
    };

    return this.http.post(`${this.uri}/allPlayedGamesIn7Days`, data);
  }

  createNewGame(username) {

    const data = {
      username: username,
    };

    return this.http.post(`${this.uri}/createNewGame`, data);
  }

  joinGame(username) {

    const data = {
      username: username,
    };

    return this.http.post(`${this.uri}/joinGame`, data);
  }

  insertNewAnagram(question, answer) {

    const data = {
      question: question,
      answer : answer
    };

    return this.http.post(`${this.uri}/insertNewAnagram`, data);
  }
  
  getAllUnresolvedTerms() {
    return this.http.get(`${this.uri}/getAllUnresolvedTerms`);
  }

  acceptTerm(term) {

    const data = {
      term: term
    };

    return this.http.post(`${this.uri}/acceptTerm`, data);
  }

  declineTerm(term) {

    const data = {
      term: term
    };

    return this.http.post(`${this.uri}/declineTerm`, data);
  }

  getAllUnresolvedReqs() {
    return this.http.get(`${this.uri}/getAllUnresolvedReqs`);
  }

  acceptReq(username) {

    const data = {
      username: username
    };

    return this.http.post(`${this.uri}/acceptReq`, data);
  }

  declineReq(username) {

    const data = {
      username: username
    };

    return this.http.post(`${this.uri}/declineReq`, data);
  }

  insertNewDayGame(dayGameDate, dayGameName) {

    const data = {
      dayGameDate: dayGameDate,
      dayGameName : dayGameName
    };

    return this.http.post(`${this.uri}/insertNewDayGame`, data);
  }

  getAllApprovedAnagrams() {
    return this.http.get(`${this.uri}/getAllApprovedAnagrams`);
  }

  acceptAnagram(dayGameDate, dayGameName, question, answer) {

    const data = {
      dayGameDate: dayGameDate,
      dayGameName : dayGameName,
      question : question,
      answer : answer
    };

    return this.http.post(`${this.uri}/acceptAnagram`, data);
  }

  isReqApproved(username) {

    const data = {
      username: username
    };

    return this.http.post(`${this.uri}/isReqApproved`, data);
  }

  getAnagramsForDate(dateString) {

    const data = {
      date: dateString
    };

    return this.http.post(`${this.uri}/getAnagramsForDate`, data);
  }

  isSomeoneJoinedGame(username) {

    const data = {
      username: username
    };

    return this.http.post(`${this.uri}/isSomeoneJoinedGame`, data);
  }

  submitMojBrojAnswer(expression) {

    const data = {
      expression: expression
    };

    return this.http.post(`${this.uri}/evaluateExpression`, data);
  }

  isTermValid(type, answer) {

    const data = {
      type : type,
      answer: answer
    };

    return this.http.post(`${this.uri}/isTermValid`, data);
  }

  checkTermNewState(type, answer) {

    const data = {
      type : type,
      answer: answer
    };

    return this.http.post(`${this.uri}/checkTermNewState`, data);
  }

  getTodayGame() {
    return this.http.get(`${this.uri}/getTodayGame`);
  }

  isAlreadyPlayed(username) {

    const data = {
      username : username
    };

    return this.http.post(`${this.uri}/isAlreadyPlayed`, data);
  }

  updateGameResult(username, finalScore) {

    const data = {
      username : username,
      finalScore : finalScore
    };

    return this.http.post(`${this.uri}/updateGameResult`, data);
  }

  insertNewGeo(type, term) {

    const data = {
      type : type,
      term : term
    };

    return this.http.post(`${this.uri}/insertNewGeo`, data);
  }
}
