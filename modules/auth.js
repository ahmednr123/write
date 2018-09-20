var bcrypt = require('bcrypt')

var redis = require('redis')
var rclient = redis.createClient()

module.exports = {
	
	storeGenHash: (username, password) => {
		var salt = bcrypt.genSaltSync(10)
		var hash = bcrypt.hashSync(password, salt)

		rclient.set(username, hash, redis.print)
	},

	checkHash: (username, password, callback) => {

		rclient.get(username, (err, reply) => {
			bcrypt.compare(password, reply, function(err, res){
				console.log(res)
				if(res) callback(username)
				else {
					callback(false);
				}
			})
		})
	}
}