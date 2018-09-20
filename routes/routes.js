var auth = require('../modules/auth.js')
var db = require('../modules/db.js')

module.exports = function(app){

	app.get('/', function(req, res){
		let user = null;
		let nav = [{id:"login", name:"LOGIN"}]
		let tagsArr = [];

		if(req.session.username){
			user = req.session.username;
			nav = [{link:"/profile?u="+user, name:"PROFILE"},{link:"/logout", name:"LOGOUT"}]
		}

		db.getTags(function(tags){
			tags = JSON.parse(tags);
			for(let i in tags){
				tagsArr.push(tags[i].name.charAt(0).toUpperCase() + tags[i].name.slice(1));
			}

			db.getTagBlogs(tagsArr[0], function(blogs){
				blogs = JSON.parse(blogs);
				for(let i in blogs){
					blogs[i].blog_date = toDate(blogs[i].blog_date);
					blogs[i].content = blogs[i]['LEFT(content,260)'] + '...';
				}
				res.render('index', {user:user, nav:nav, tags:tagsArr, arr:blogs});
			});
		});
		
	});

	app.get('/xbar', function(req, res){
		db.randomBlogs(3, function(arr){
			res.end(arr);
		})
	})

	app.get('/blog', function(req, res){
		if(!req.query.id)
			res.redirect('/');

		let blogId = req.query.id;
		let comments = [];
		let commentBox = null;

		if(req.query.commentBox && req.query.commentBox != ''){
			commentBox = req.query.commentBox;
		}

		let user = null;
		let nav = [{id:"login", name:"LOGIN"}]		
		if(req.session.username){
			user = req.session.username;
			nav = [{link:"/profile?u="+user, name:"PROFILE"},{link:"/logout", name:"LOGOUT"}]
		}

		db.getComments(blogId, function(arr){
			arr = JSON.parse(arr);

			for(let i in arr){
				let ago = getAgo(arr[i].comment_date);
				comments.push({user:arr[i].user_fullname, comment: arr[i].comment, ago:ago, username: arr[i].username})
			}

			db.getBlog(blogId, function(json){
				json = JSON.parse(json);
				json.blog_date = toDate(json.blog_date);
				res.render('article', {user:user, nav:nav, blog_id:json.id, blog_heading:json.heading, blog_content:json.content, blog_date:json.blog_date, blog_username:json.username, blog_user:json.full_name, blog_views:json.views, blog_likes:json.likes, blog_dislikes:json.dislikes, comments:comments, commentb:commentBox});
			});
		});

	});

	app.post('/blog/:blogId/:action', function(req, res){
		let blogId = req.params.blogId;
		let action = req.params.action;

		console.log(action);

		if(action == "view"){
			db.updateView(blogId);
		} else if(action == "like") {
			db.updateLikes(blogId);
		} else if(action == "dislike") {
			db.updateDislikes(blogId);
		}

		res.end();
	});

	app.post('/comment', function(req, res){
		let comment = req.body.comment;
		let blog_id = req.body.blog_id;

		if(req.session.username){
			db.postComment(blog_id, req.session.username, comment, function(){
				res.redirect('/blog?id='+blog_id);
			});
		} else {
			res.redirect('/blog?id='+blog_id);
		}
	});

	app.get('/edit', function(req, res){
		if(!req.session.username) res.redirect('/');
		
		let user = req.session.username;
		let nav = [{link:"/profile?u="+user, name:"PROFILE"},{link:"/logout", name:"LOGOUT"}]
		
		res.render('edit', {user:user, nav:nav});
	});

	app.get('/profile', function(req, res){
		if(!req.query.u && !req.session.username)
			res.redirect('/');

		let user = req.query.u;
		let nav = [{id:"login", name:"LOGIN"}]

		if(req.session.username){
			let xuser = req.session.username;
			nav = [{link:"/profile?u="+xuser, name:"PROFILE"},{link:"/logout", name:"LOGOUT"}]
		}

		db.getProfile(user, function(json){
			if(json == "ERROR") 
				res.redirect('/');
			else {
				json = JSON.parse(json);
				for(let i in json.arr){
					json.arr[i].blog_date = toDate(json.arr[i].blog_date);
					json.arr[i].content = json.arr[i]['LEFT(content,260)'] + '...';
				}
				res.render('profile', {user:user, nav:nav, name:json.name, email:json.email, arr:json.arr});
			}
		});
		
	});

	app.post('/register', function(req, res){
		var username = req.body.username
		var password = req.body.password
		var full_name = req.body.full_name
		var email = req.body.email
		var address = req.body.address

		auth.storeGenHash(username, password)

		db.registerUser(username, full_name, email)

		res.redirect(address);
	});

	app.get('/tag/:tagName', function(req, res){
		let tagName = (req.params.tagName).toLowerCase();

		if(tagName[0] == '!'){
			if(tagName[1] == '!'){
				db.getBlogs(function(blogs){
					blogs = JSON.parse(blogs);
					for(let i in blogs){
						blogs[i].blog_date = toDate(blogs[i].blog_date);
						blogs[i].content = blogs[i]['LEFT(content,260)'] + '...';
					}
					res.end(JSON.stringify(blogs));
				});
			}

			tagName = '#'+tagName.slice(1,tagName.length);
		}

		db.getTagBlogs(tagName, function(blogs){
			blogs = JSON.parse(blogs);
			for(let i in blogs){
				blogs[i].blog_date = toDate(blogs[i].blog_date);
				blogs[i].content = blogs[i]['LEFT(content,260)'] + '...';
			}
			res.end(JSON.stringify(blogs));
		});

	});

	app.post('/postBlog', function(req, res){
		var heading = req.body.heading;
		var tags = req.body.tags;
		var content = req.body.content;

		var arrTags = [null, null, null];

		var arr = tags.split(', ');

		for(var t in arr){
			arrTags[t] = arr[t];
		}

		db.postArticle(req.session.username, heading, content, arrTags);

		res.redirect('/profile');
		
	});

	app.post('/login', function(req, res){
		var username = req.body.username
		var password = req.body.password
		var address = req.body.address

		var commentBox = req.body.commentBox

		auth.checkHash(username, password, function(reply){
			if(reply){
				console.log(reply)
				req.session.username = reply;
			}

			if(commentBox){
				res.redirect(address+'&commentBox='+commentBox);
			} else {
				res.redirect(address);
			}
		})
	});

	app.get('/logout', function(req, res){
		if(req.session.username)
			req.session.destroy(function(err){
				if(err)
					res.end("Error: "+err);
				else
					res.redirect('/');
			});
	});

}

function toDate(dateStr){

	dateStr = dateStr.split(" ");
	dateStr = dateStr[0].split("-");

	let month = [null, 'January', 'Febraury', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'November', 'December'];
	let rd = ['', 'st', 'nd', 'rd', 'th'];
	let day = null;

	let date = parseInt(dateStr[2]);

	if((date % 10) > 3){
		day = date + rd[4];
	} else {
		day = date + rd[(date % 10)];
	}

	let str = month[parseInt(dateStr[1])] + " " + day + ", " +  dateStr[0];

	return str;
}

Date.prototype.correct = function() {    
   this.setTime(this.getTime() + (5*60*60*1000) + (30*60*1000)); 
   return this;   
}

function getAgo(dateStr){
	var t = dateStr.split(/[- :]/);
	console.log(t);

	t[0] = parseInt(t[0]);
	t[1] = parseInt(t[1]) - 1;
	t[2] = parseInt(t[2]);
	t[3] = parseInt(t[3]);
	t[4] = parseInt(t[4]);
	t[5] = parseInt(t[5]);

	console.log(t[0] + ' ' + t[1] + ' ' + t[2] + ' ' + t[3] + ' ' + t[4] + ' ' + t[5]);

	var utc = new Date(Date.UTC(t[0], t[1], t[2], t[3], t[4], t[5], 000));
	var now = new Date();
	now.correct();

	console.log(now);

	var seconds = Math.floor((now - utc) / 1000);

	var interval = Math.floor(seconds / 31536000);

	if (interval > 1) {
		return interval + " years ago";
	}
	
	interval = Math.floor(seconds / 2592000);
	if (interval > 1) {
		return interval + " months ago";
	}
	
	interval = Math.floor(seconds / 86400);
	if (interval > 1) {
		return interval + " days ago";
	}
	
	interval = Math.floor(seconds / 3600);
	if (interval > 1) {
		return interval + " hours ago";
	}
	
	interval = Math.floor(seconds / 60);
	if (interval > 1) {
		return interval + " minutes ago";
	}

	return Math.floor(seconds) + " seconds ago";
}