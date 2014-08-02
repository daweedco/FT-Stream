// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		'clientID' 		: '242489005797570', // your App ID
		'clientSecret' 	: '681983791cda2754477226a4cac3842d', // your App Secret
		'callbackURL' 	: 'http://localhost:3000/auth/facebook/callback'
	},
};
