const mysql = require('../utils/mysql')
const wordList = require("../utils/words")

//查
const getRanks = async (id) => {
	let sql = `
        SELECT a.rank AS 'rank', a.totalScore, a.user_id, a.name
        FROM (SELECT user_id, totalScore, name, @prev := @curr, @curr := totalScore, @rank := IF(@prev = @curr, @rank, @rank+1) AS rank
        FROM Users, (SELECT @curr := null, @prev := null, @rank := 0) s
        ORDER BY totalScore DESC) a;
    `;
	return mysql.exec(sql);
};

// 確認單字
const getWords = async (id) => {
	const word = wordList.words[id]
	return word;
};

// 判斷是否符合規則
const checkValid = async (word) => {
	return wordList.valid.find(d => d === word)
};

// 判斷是否存在
const checkHistoryExists = async (user_id, date) => {
	let sql = `SELECT * from History WHERE user_id=${user_id} and date='${date}' LIMIT 1;`;
	return mysql.exec(sql);
};

const insertHistory = async (date, score, times, user_id) => {
	let sql = `INSERT INTO History(date, score, times, user_id) VALUES('${date}', ${score}, ${times}, ${user_id})`;
	return mysql.exec(sql);
};

const updateHistory = async (score, times, history_id) => {
	let sql = `UPDATE History SET score=${score}, times=${times} WHERE history_id=${history_id}`;
	return mysql.exec(sql);
};

const updateUser = async (score, user_id) => {
	let sql = `UPDATE Users SET totalScore=${score} WHERE user_id=${user_id}`;
	return mysql.exec(sql);
};

const getScore = async (user_id) => {
	let sql = `SELECT history_id from History WHERE user_id=${user_id} and score=1;`;
	return mysql.exec(sql);
};

module.exports = {
	getRanks,
	getWords,
	checkValid,
	checkHistoryExists,
	insertHistory,
	updateHistory,
	getScore,
    updateUser
};