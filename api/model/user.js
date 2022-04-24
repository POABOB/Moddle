const mysql = require('../utils/mysql')

//查
const getUserId = async (email, provider) => {
	let sql = `SELECT user_id FROM USERS WHERE email='${email}' and provider='${provider}' LIMIT 1;`;
	return mysql.exec(sql);
};

const getUser = async (email, provider) => {
	let sql = `SELECT user_id, email, name, password FROM USERS WHERE email='${email}' and provider='${provider}' LIMIT 1;`;
	return mysql.exec(sql);
};

const register = async (name, email, password, provider, totalScore) => {
	let sql = `INSERT INTO Users(name, email, password, provider, totalScore) VALUES('${name}', '${email}', '${password}', '${provider}', '${totalScore}');`;
	return mysql.exec(sql).then(data => {
		return { id: data.insertId }
	});
};

const getUserInfo = async (user_id) => {
	let sql = `SELECT email, name, totalScore FROM Users WHERE user_id = ${user_id} LIMIT 1;`;
	return mysql.exec(sql);
};

const getStatistic = async (user_id) => {
	let sql = `SELECT * FROM History WHERE user_id = ${user_id};`;
	return mysql.exec(sql);
};

const getRank = async (user_id) => {
	let sql = `
    SELECT user_id, b.rank, totalScore, name
    FROM (SELECT a.rank AS 'Rank', a.totalScore, a.user_id, a.name
           FROM (SELECT user_id, totalScore, name, @prev := @curr, @curr := totalScore, @rank := IF(@prev = @curr, @rank, @rank+1) AS rank
                 FROM Users, (SELECT @curr := null, @prev := null, @rank := 0) s
                 ORDER BY totalScore DESC) a) b
    WHERE user_id = ${user_id} LIMIT 1;
    `;
	return mysql.exec(sql);
};


module.exports = {
    getUserId,
    getUser,
    register,
    getUserInfo,
    getStatistic,
    getRank
};