var mysql = require('mysql');
var auth = require('./auth.js');

var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "write_app"
});

db.connect(function(err){
	if(err) throw err;
})

module.exports = {

	getUsers: function(callback){
		
		db.query("SELECT * FROM user", function(err, result, fields){
			if(err) throw err;
			callback(JSON.stringify(result));
		})
	},

	getUserDetails: function(username, callback){
		db.query('SELECT * FROM user WHERE username="'+String(username)+'"', function(err, result, fields){
			if(err) throw err;
			callback(JSON.stringify(result[0]));
		})
	},

	registerUser: function(username, full_name, email){
		db.query('INSERT INTO user (username, full_name, email) VALUES ("'+username+'", "'+full_name+'", "'+email+'")', function(err, result){
			if(err) console.log("ERROR: "+err);
			console.log("User: "+full_name+ " has been registered!");
		});
	},

	getProfile: function(username, callback){
		db.query('SELECT * FROM user WHERE username="'+String(username)+'"', function(err, result, fields){
			if(err) console.log(err);
			if(result[0]){
				let json = {name:result[0].full_name, email:result[0].email, arr:null};
			
				db.query('SELECT id,heading,LEFT(content,260),blog_date FROM blog WHERE username="'+String(username)+'"', function(xerr, xresult, xfields){
					if(xerr) console.log(xerr);
					json.arr = xresult;
					//console.log(xresult);
					callback(JSON.stringify(json));
				})
			} else {
				callback("ERROR");
			}
			
		})
	},

	getTags: function(callback){
		let sql = 'select name from tag order by popularity desc LIMIT 3'
		db.query(sql, function(err, result, fields){
			if(err) console.log(err);
			callback(JSON.stringify(result));
		});
	},

	getTagBlogs: function(tagName, callback){
		let sql = 'select id,heading,LEFT(content,260),blog_date,full_name,user.username from blog_tags,blog,user where blog.id=blog_tags.blog_id and blog_tags.tag_name="'+tagName+'" and user.username=blog.username ORDER BY RAND() LIMIT 15;'
		db.query(sql, function(err, result, fields){
			if(err) console.log(err);
			callback(JSON.stringify(result));
		});
	},

	getBlogs: function(callback){
		let sql = 'SELECT id,heading,LEFT(content,260),blog_date,full_name,user.username FROM blog,user WHERE user.username=blog.username ORDER BY RAND()';

		db.query(sql, function(err, result, fields){
			if(err) console.log(err);
			callback(JSON.stringify(result));
		});
	},

	randomBlogs: function(limit, callback){
		let sql = 'SELECT id,heading FROM blog ORDER BY RAND() LIMIT '+limit;

		db.query(sql, function(err, result, fields){
			if(err) console.log(err);
			callback(JSON.stringify(result));
		})
	},

	getBlog: function(blogId, callback){
		let sql = 'SELECT b.id,b.heading,b.content,b.blog_date,b.username,u.full_name,s.views,s.likes,s.dislikes FROM blog b,user u,blog_stats s WHERE id="'+blogId+'" AND u.username=b.username AND s.blog_id=b.id';

		db.query(sql, function(err, result, fields){
			if(err) console.log(err);
			callback(JSON.stringify(result[0]));
		});
	},

	getComments: function(blog_id, callback){
		let sql = 'SELECT * FROM comment WHERE blog_id="'+blog_id+'"';

		db.query(sql, function(err, result, fields){
			if(err) console.log(err);
			callback(JSON.stringify(result));
		});
	},

	updateView: function(blogId){
		let sql = "UPDATE blog_stats SET views=views+1 WHERE blog_id='"+blogId+"'";

		db.query(sql, function(err, result, fields){
			if(err) console.log(err);
		});
	},

	updateLikes: function(blogId){
		let sql = "UPDATE blog_stats SET likes=likes+1 WHERE blog_id='"+blogId+"'";

		db.query(sql, function(err, result, fields){
			if(err) console.log(err);
		});
	},

	updateDislikes: function(blogId){
		let sql = "UPDATE blog_stats SET dislikes=dislikes+1 WHERE blog_id='"+blogId+"'";

		db.query(sql, function(err, result, fields){
			if(err) console.log(err);
		});
	},

	postArticle: function(username, blogHeading, blogContent, blogTags){
		addT(blogHeading, blogContent, blogTags, username)
	},

	postComment: function(blog_id, username, comment, callback){
		let sql = 'INSERT INTO comment VALUES ("'+blog_id+'", "'+username+'", (SELECT full_name FROM user WHERE username="'+username+'"), "'+String(comment)+'", NOW())';

		db.query(sql, function(err, result, fields){
			if(err) console.log(err);
			callback();
		});
	}
}

function addT(heading, content, tags, userId){

	 var rand = randomStr(6);

	 let sql = 'SELECT * FROM blog WHERE id="'+rand+'"';

	 db.query(sql, function(err, result, fields){
	 	if(result.length){
			addT(heading, content, tags, userId);
			console.log("NEXT ADDT();");
		} else {
			console.log("INSERTING DATA: "+ userId);
			sql = "INSERT INTO blog VALUES ('"+ rand +"', '"+ heading +"', '"+ content +"', NOW(), '" + userId +"')";
			console.log("SQL QUERY: "+sql);
			db.query(sql, function(err, result){
				if(err) console.log("ERROR: "+err);

				sql = 'call inputTags("'+ rand +'", "'+ tags[0] +'"';
			
				if(tags[1]){
					sql += ', "'+ tags[1] +'"';
				} else {
					sql += ', NULL';
				}

				if(tags[2]){
					sql += ', "'+ tags[2] +'"';
				} else {
					sql += ', NULL';
				}

				sql += ')';

				console.log("SQL QUERY: "+sql);

				db.query(sql, function(err, result){
					if(err) console.log(err);
				});
			});
	
		}
		
	});
}

function randomStr(_num){
	var charachters = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
	var string = "";
	while(_num--){
		var x = Math.floor((Math.random() * 61) + 1);
		string += charachters[x];
	}
	return string;
}