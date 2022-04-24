const mysql = require('mysql');

require('dotenv').config()
//不使用箭頭函數原因是因為不能使用this
module.exports = {
	config: {
        host: process.env.MYSQL_CONF_HOST,
		user: process.env.MYSQL_CONF_USER,
		password: process.env.MYSQL_CONF_PASSWORD,
		port: process.env.MYSQL_CONF_PORT,
		database: process.env.MYSQL_CONF_DATABASE,
		waitForConnections : process.env.MYSQL_CONF_waitForConnections,
		connectionLimit : process.env.MYSQL_CONF_connectionLimit,
		acquireTimeout: process.env.MYSQL_CONF_acquireTimeout
    },
	pool: null,
	create: function () {
		if(!this.pool) {
			this.pool = mysql.createPool(this.config)
		}
	},
	exec: async function (sql, values)  {
		return new Promise(( resolve, reject ) => {
			try {
				this.create();
				this.pool.getConnection(function(err, connection) {
					if (err) {
						reject(err);
					} else {
						connection.query(sql, values, (err, result) => {

							if (err) {
								reject(err);
									console.error(err);
							} else {
								resolve(result);
								
							}
							connection.release();
						});
					}
				});
			} catch (e) {
				reject(e);
				console.error(e);
			}
		});
	},
	end: function() {
        this.pool.end((err) => {
            if (err) throw err;
			process.exit();
        });
	},
	escape: mysql.escape
}