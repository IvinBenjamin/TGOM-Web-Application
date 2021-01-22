const sqlite3 = require('sqlite3')

const db = new sqlite3.Database("complete_database.db")
const logindb= new sqlite3.Database("login_database.db")


/**********************staff***********************/
db.run(`
	CREATE TABLE IF NOT EXISTS staffs (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT,
		position TEXT,
		yearOfExperince INTEGER
	)
`)

exports.getALLStaffs = function(callback){
    
	const query = "SELECT * FROM staffs ORDER BY id"
	
    db.all(query, function(error, staffs){
       callback(error, staffs)
    })
}

exports.createStaff = function(name, position, yearOfExperince, callback){
	
    const query = "INSERT INTO staffs (name, position, yearOfExperince) VALUES (?, ?, ?)"
	const values = [name, position, yearOfExperince]    
	
	db.run(query, values, function(error){
		callback(error, this.lastID)
	})
	
}
exports.getStaffById = function(id, callback){
    const query = "SELECT * FROM staffs WHERE id = ?"
	const values = [id]

	db.get(query, values, function(error, staff){
        callback(error, staff)

    })    
		
}
exports.updateStaffById = function(newName, newPosition, newYearOfExperince, id, callback){
    	
	const query = `
		UPDATE
			staffs
		SET
			name = ?,
			position = ?,
			yearOfExperince = ?

		WHERE
			id = ?
	`
	const values = [newName, newPosition, newYearOfExperince, id]

    db.run(query, values, function(error){
        callback(error)
    })
}

exports.deleteStaffById = function(id, callback){

    const query = "DELETE FROM staffs WHERE id = ?"
	const values = [id]
	
	db.run(query, values, function(error){
        callback(error)
    })
}

exports.getStaffsId = function(id, callback){
    const query = "SELECT * FROM staffs WHERE id = ?"
	const values = [id]
	
	db.get(query, values, function(error, staff){
        callback(error, staff)
    })
}
/**********************comment***********************/
db.run(`
	CREATE TABLE IF NOT EXISTS comments (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		title TEXT,
		comment TEXT
	)
`)

exports.getAllComments = function(callback){
    
	const query = "SELECT * FROM comments ORDER BY id"
	
	db.all(query, function(error, comments){
        callback(error,comments)
	
})
}
exports.createComment = function(title, comment, callback){

    const query = "INSERT INTO comments (title, comment) VALUES (?, ?)"
	const values = [title, comment]
	
	db.all(query, values, function(error){
        callback(error, this.lastID)
})
}

exports.getCommentById = function(id, callback){

    const query = "SELECT * FROM comments WHERE id = ?"
	const values = [id]
	
	db.get(query, values, function(error, comment){
        callback(error, comment)
})
}

exports.updateCommentById = function(newTitle, newComment, id, callback){
    const query = `
		UPDATE
			comments
		SET
			title = ?,
			comment = ?
		WHERE
			id = ?
	`
	const values = [newTitle, newComment, id]
	
	db.run(query, values, function(error){
        callback(error)
})
}

exports.deleteCommentById = function(id, callback){
    const query = "DELETE FROM comments WHERE id = ?"
	const values = [id]
	
	db.run(query, values, function(error){
        callback(error)
})
}
/**********************review***********************/
db.run(`
	CREATE TABLE IF NOT EXISTS reviews (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		title TEXT,
		game TEXT,
		comment TEXT
	)
`)

exports.getAllReviews = function(callback){
    
	const query = "SELECT * FROM reviews ORDER BY id"
	
    db.all(query, function(error, staffs){
       callback(error, staffs)
    })
}

exports.createReview = function(title, game, comment, callback){
	
    const query = "INSERT INTO reviews (title, game, comment) VALUES (?, ?, ?)"
	const values = [title, game, comment]    
	
	db.run(query, values, function(error){
		callback(error, this.lastID)
	})
	
}
exports.getReviewById = function(id, callback){
    const query = "SELECT * FROM reviews WHERE id = ?"
	const values = [id]

	db.get(query, values, function(error, review){
        callback(error, review)

    })    
		
}
exports.updateReviewById = function(newTitle, newGame, newComment, id, callback){
    	
	const query = `
		UPDATE
			reviews
		SET
			title = ?,
			game = ?,
			comment = ?
		WHERE
			id = ?
	`
	const values = [newTitle, newGame, newComment, id]

    db.run(query, values, function(error){
        callback(error)
    })
}

exports.deleteReviewById = function(id, callback){

    const query = "DELETE FROM reviews WHERE id = ?"
	const values = [id]
	
	db.run(query, values, function(error){
        callback(error)
    })
}

exports.getReviewById = function(id, callback){
    const query = "SELECT * FROM reviews WHERE id = ?"
	const values = [id]
	
	db.get(query, values, function(error, review){
        callback(error, review)
    })
}
/**********************login***********************/
logindb.run(`
	CREATE TABLE IF NOT EXISTS login (
		password TEXT PRIMARY KEY,
		username TEXT 
	)
`)


exports.LoginInfo= function(password,username,callback){
    const query ='INSERT INTO login(password,username) VALUES (?,?)'
    const values =[password,username]
    logindb.run(query, values, function(error){
        callback(error)
    })
}

exports.getPassword = function(username,callback){
    const query = "SELECT password FROM login WHERE username = ?"
    const values = [username]
    logindb.get(query, values, function(error,hash){
        callback(error,hash)
    })
}