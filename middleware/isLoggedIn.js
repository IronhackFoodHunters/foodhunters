function isLoggedIn(req, res, next) {
	console.log("User in the session", req.session.currentUser)
	if (req.session.currentUser) {
		console.log("User in the session", req.session.currentUser)
		next();
	} else {
		res.redirect('/auth/login');
	}
}

module.exports = isLoggedIn;