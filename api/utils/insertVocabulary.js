const mysql = require('./mysql')

/*將一維陣列轉為二維陣列
    *arr，一維陣列；
    *split，分割位數;
    */
function transArray(arr, split) {
    var newArr = []
    var len = arr.length
    for (let i = 0, j = 0; i < len; i += split, j++) {
        newArr[j] = arr.splice(0, split)
    }
    console.log(newArr)
	return newArr
}

//查
const insert = async (id) => {
	console.log(transArray(words.words, 1).length)
	// // console.log(mysql.config);
	// let sql = `INSERT INTO vocabulary(value) VALUES ?`;
	// //返回promise
	// return mysql.exec(sql, []);
};

insert()