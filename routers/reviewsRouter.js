const express = require('express')
const db = require('../db')

const TITLE_MIN_LENGTH = 4
const GAME_NAME_MIN_LENGTH = 4
const REVIEW_MIN_LENGTH = 3
const CharAmount = 0


function getReviewValidationErrors(title, game, comment){
	
	const validationErrors = []
	
	if(title.length < TITLE_MIN_LENGTH){
		validationErrors.push("Title must be at least "+TITLE_MIN_LENGTH+" characters.")
	}
	if(game.length < GAME_NAME_MIN_LENGTH){
		validationErrors.push("Game must be at least "+GAME_NAME_MIN_LENGTH+" characters.")
	}
	if(comment.length < REVIEW_MIN_LENGTH){
		validationErrors.push("Comment must be at least "+REVIEW_MIN_LENGTH+" characters.")
	}
	
	return validationErrors
	
}

const router = express.Router()


router.get("/", (req, res) =>{
	
	db.getAllReviews(function(error, reviews){
		if(error){
			
			const model = {
				dbErrorOccurred: true
			}
			res.render("reviews.hbs", model)
		}else{
			const model = {
				reviews,
				dbErrorOccurred: false,
				updated: false
			}
			res.render("reviews.hbs", model)
			
		}
		
	})
	
})



router.get('/create', (req, res) => {
	res.render('creat-review.hbs')
})


router.post("/create", (req, res) => {
	
    const title = req.body.title
    const game = req.body.game
	const comment = req.body.comment

	const errors = getReviewValidationErrors(title, game, comment)

	if(CharAmount < errors.length){
		const model = {
			errors,
			title,
			game,
			comment
		}
		res.render("creat-review.hbs", model)
		return
	}
	db.createReview(title,game, comment,function(error){
		if(error){	
			errors.push("An Error Occurred")	
		}else{
			res.redirect("/reviews")
		}
	})
})

router.get("/update/:id", (req, res) => {
	
	const id = req.params.id
	
	db.getReviewById(id,function(error, review){
		if(error){
			const model = {
				dbErrorOccurred: true
			}
			res.render("update-review.hbs", model)
		}else{
			if(!review){
				const model = {
					ReviewDeleted: true
				}
				res.render("update-review.hbs", model)
			}else{
				const model = {
					review
				}
				res.render("update-review.hbs", model)
			}
		}
	})
})


router.post("/update/:id", (req, res) =>{
	
	const id = req.params.id
    const newTitle = req.body.title
    const newGame = req.body.game
	const newComment = req.body.comment

	const errors = getReviewValidationErrors(newTitle, newGame, newComment)

	if(!req.session.isLoggedIn){
		errors.push("Must be logged in.")
	}
	if(CharAmount < errors.length){
		const model = {
			errors,
			review:{
			title: newTitle,
			game: newGame,
			comment: newComment
		}
	}
		res.render("update-review.hbs", model)
		return
	}
	db.updateReviewById(newTitle,newGame, newComment, id, function(error){
		if(error){
			errors.push("An Error Occurred")
			res.render("review.hbs", model)
		}else{
			db.getReviewById(id,function(error, review){
				if(error){
					errors.push("An Error Occurred")
					res.render("review.hbs", model)
				}else{
					const model = {
						review,
						updated:true
					}
					res.render("review.hbs", model)
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
	db.deleteReviewById(id, function(error){
		if(error){
			const model = {
				dbErrorOccurred: true
			}
			res.render("review.hbs", model)
		}else{
			res.redirect("/reviews")
		}
	})
})

router.get("/:id", (req, res) =>{
	
	const id = req.params.id
	
	db.getReviewById(id, function(error, review){
		if(error){
			const model = {
				dbErrorOccurred: true
			}
			res.render("review.hbs", model)
		}else{
			const model = {
				review
			}
			res.render("review.hbs", model)
		}
	})
})


module.exports = router