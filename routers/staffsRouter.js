const express = require('express')
const db = require('../db')

const NAME_MIN_LENGTH = 2
const STAFF_NAME_MIN_LENGTH = 2
const CharAmount = 0

function getStaffValidationErrors(name, position, yearOfExperince){
	
	const validationErrors = []
	
	if(name.length < NAME_MIN_LENGTH){
		validationErrors.push("Name Must Be At Least "+NAME_MIN_LENGTH+" characters.")
	}
	if(position.length < STAFF_NAME_MIN_LENGTH){
		validationErrors.push("Position Must Be At Least "+STAFF_NAME_MIN_LENGTH+" characters.")
	}
	if(isNaN(yearOfExperince)){
		validationErrors.push("Experience Years Must Be A Number.")
	}else if (yearOfExperince < CharAmount){
		validationErrors.push("Years Of Experince Cant Be Negative.")
	}
	return validationErrors
}

const router = express.Router()


router.get("/", (req, res) =>{
	
	db.getALLStaffs(function(error, staffs) {
		
		if(error){			
			const model = {
				dbErrorOccurred: true
			}
			res.render("staffs.hbs", model)
		}else{
			const model = {
				staffs,
				dbErrorOccurred: false,
				updated: false
			}
			res.render("staffs.hbs", model)
		}
			
	})
	
})



router.get('/create', (req, res) => {
	if(!req.session.isLoggedIn){
		res.redirect('/index')
	}else{
		res.render('creat-staff.hbs')
	}		
})


router.post("/create", (req, res) => {
	
	const name = req.body.name
	const position = req.body.position
	const yearOfExperince = parseInt(req.body.yearOfExperince)

	const errors = getStaffValidationErrors(name, position, yearOfExperince)

	if(!req.session.isLoggedIn){
		errors.push("Must Be Logged In To Create A Staff")
	}

	if(CharAmount < errors.length){
		const model = {
			errors,
			name,
			position,
			yearOfExperince
		}
		res.render("creat-staff.hbs", model)
		return
	}
	
	db.createStaff(name, position, yearOfExperince, function(error){
		if(error){
			errors.push("An Error Occurred")
		}else{
			res.redirect("/staffs")
		}
	})
	
})


router.get("/update/:id", (req, res) => {
	
	const id = req.params.id
	
	db.getStaffById(id, function(error, staff){
		
		if(error){
			const model = {
				dbErrorOccurred: true
			}
			res.render("update-staff.hbs", model)	
		}else{
			if(!staff){
				const model = {
					StaffDeleted: true
				}
				res.render("update-staff.hbs", model)
			}else{
				const model = {
					staff
				}
				res.render("update-staff.hbs", model)
			}
		}
	})
	
})


router.post("/update/:id", (req, res) =>{
	
	const id = req.params.id
	const newName = req.body.name
	const newPosition = req.body.position
	const newYearOfExperince = req.body.yearOfExperince
	
	const errors = getStaffValidationErrors(newName, newPosition, newYearOfExperince)

	if(!req.session.isLoggedIn){
		errors.push("Must be logged in.")
	}
	if(CharAmount < errors.length){
		const model = {
			errors,
			staff:{
			name: newName,
			position: newPosition,
			yearOfExperince: newYearOfExperince
		}
	}
		res.render("update-staff.hbs", model)
		return
	}
	db.updateStaffById(newName, newPosition, newYearOfExperince, id, function(error){

		if(error){
			errors.push("An Error Occurred")
			res.render("staff.hbs", model)
		}else{
			db.getStaffById(id, function(error, staff){
				if(error){
					errors.push("An Error Occurred")
					res.render("staff.hbs", model)
				}else{
					const model = {
						staff,
						updated: true
					}
					res.render("staff.hbs", model)
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
	db.deleteStaffById(id, function(error){
		if(error){
			const model = {
				dbErrorOccurred: true
			}
			res.render("staffs.hbs", model)
		}else{
			res.redirect("/staffs")
		}
	})
	
})



router.get("/:id", (req, res) =>{
	
	const id = req.params.id
	
	db.getStaffsId(id, function(error, staff){
		if(error){
			const model = {
				dbErrorOccurred: true
			}
			res.render("staff.hbs", model)
		}else{
			const model = {
				staff
			}
			res.render("staff.hbs", model)
		}
	})
})



module.exports = router