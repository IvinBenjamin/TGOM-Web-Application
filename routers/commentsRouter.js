const express = require('express')
const db = require('../db')



const TITLE_MIN_LENGTH = 2
const COMMENT_MIN_LENGTH = 2
const CharAmount = 0

function getCommentValidationErrors(title, comment){
	
	const validationErrors = []
	
	if(title.length < TITLE_MIN_LENGTH){
		validationErrors.push("Title must be at least "+TITLE_MIN_LENGTH+" characters.")
	}
	if(comment.length < COMMENT_MIN_LENGTH){
		validationErrors.push("Comment must be at least "+COMMENT_MIN_LENGTH+" characters.")
	}
	return validationErrors
	
}

const router = express.Router()


router.get("/", (req, res) =>{
	
	db.getAllComments(function(error, comments){
		if(error){
			const model = {
				dbErrorOccurred: true
			}
			res.render("comments.hbs", model)
		}else{
			const model = {
				comments,
				dbErrorOccurred: false,
				updated: false
			}
			res.render("comments.hbs", model)
		}
		
	})
	
})



router.get('/create', (req, res) => {
	res.render('creat-comment.hbs')
})


router.post("/create", (req, res) => {
	
	const title = req.body.title
	const comment = req.body.comment

	const errors = getCommentValidationErrors(title, comment)

	if(CharAmount < errors.length){
		const model = {
			errors,
			title,
			comment
		}
		res.render("creat-comment.hbs", model)
		return
	}
	
	db.createComment(title, comment,function(error){

		if(error){
			errors.push("An Error Occurred")
		}else{
			res.redirect("/comments")
		}
	})
	
})


router.get("/update/:id", (req, res) => {
	
	const id = req.params.id
	
	db.getCommentById(id,function(error, comment){
		if(error){
			const model = {
				dbErrorOccurred: true
			}
			res.render("update-comment.hbs", model)
		}else{
			if(!comment){
				const model = {
					CommentDeleted: true
				}
				res.render("update-comment.hbs", model)
			}else{
				const model = {
					comment
				}
				res.render("update-comment.hbs", model)
			}
		}
		
	})
	
})




router.post("/update/:id", (req, res) =>{
	
	const id = req.params.id
	const newTitle = req.body.title
	const newComment = req.body.comment

	const errors = getCommentValidationErrors(newTitle, newComment)

	if(!req.session.isLoggedIn){
		errors.push("Must be logged in to update.")
	}
	if(CharAmount < errors.length){
		const model = {
			errors,
			comment:{
			title: newTitle,
			comment: newComment,
			}
		}
		res.render("update-comment.hbs", model)
		return

	}
	db.updateCommentById(newTitle, newComment, id, function(error){
		if(error){
			errors.push("An Error Occurred")
			res.render("comment.hbs", model)	
		}else{
			db.getCommentById(id,function(error, comment){
				if(error){
					errors.push("An Error Occurred")
					res.render("comment.hbs", model)
				}else{					
					const model = {
						comment,
						updated: true
					}				
					res.render("comment.hbs", model)
				}
			})	
		}
	})
})


router.post("/delete/:id", (req, res) => {
	
	const id = req.params.id

	if(!req.session.isLoggedIn){
		res.redirect("/login")
	}

	db.deleteCommentById(id, function(error){
		if(error){
			const model = {
				dbErrorOccurred: true
			}	
			res.render("comments.hbs", model)
		}else{
			res.redirect("/comments")
		}
	})
	
})

router.get("/:id", (req, res) =>{
	
	const id = req.params.id
	
	db.getCommentById(id, function(error, comment){
		if(error){
			const model = {
				dbErrorOccurred: true
			}
			res.render("comment.hbs", model)
		}else{
			const model = {
				comment
			}
			res.render("comment.hbs", model)
		}
	})	
})


module.exports = router