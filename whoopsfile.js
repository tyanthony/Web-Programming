var express = require('express');
var redis = require('redis');
var bluebird = require('bluebird');
var auth = require('basic-auth');
var body = require('body-parser');
var app = express();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);


var authorize = function (req, res, next) {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.sendStatus(401);
  };

  var user = auth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  };

  if (user.name === 'teacher' && user.pass === 't1g3rTester!@#') {
    return next();
  } 
    else {
        return unauthorized(res);
    };
};

app.use(body.json());
app.use(body.urlencoded({extended: false}));

databaseClient = redis.createClient();

app.get('/', authorize, function ( req, res) {
	console.log("homescreen connected");
	res.status(200);
});

app.post('/students', authorize, function ( req, res) {

	var username = req.body.username;
	var name = req.body.name;
	var newStudent = 0;

	if(!username || !name){
		console.log(' [ERROR] missing username or name');
		res.status(400).send('missing username or name');
	} else {
		databaseClient.sismemberAsync("students", username ).then( function (contents) {
			if(!contents){
				newStudent = true;
			}	
			if( newStudent) {
				databaseClient.saddAsync("students", username  ).then( function(contents) {
 				databaseClient.hmset(  username, {"_ref": "/students/username", "name": name, "username": username})
					console.log(" [ " + contents + "  ] adding student to the database");
					res.status(200).json( {_ref : "/students/" + username });
				}).catch( function (error) {
					console.log(" [ " + error + " ] adding student to the database");
				});
            } 
            else{
				console.log(" [ " + true + "] student already exists");
				res.status(400).send("student already exists");
			}
		}).catch( function (error) {
			console.log(" [ " + error + "  ] checking for existing student");
		});
	}
});

app.delete('/students/:username', authorize,function ( req, res) {

	var username = req.params.username;
	if(!username){
		//username DNE
		res.status(400).send('missing username');
    } 
    else {
		databaseClient.sismemberAsync("students", username).then( function (contents) {
			if(contents){
				databaseClient.sremAsync( "students", username).then( function (contents) {
					console.log(" [ " + contents + "  ] removing student from the database");
					res.status(200).send(username + " removed from the table");
				}).catch( function ( error) {
				console.log(" [ " + error + " ] removing student in the database");
				});
            } 
            else {
				res.status(400).send(username + " does not exist in the database");
			}
		}).catch( function (error) {
			console.log(" [ " + error + " ] making hexist in removing student");
		});
	}
});

app.patch('/students/:username', authorize,function ( req, res) {
	var name = req.body.name;
	var username = req.params.username;
	var patchUser = req.body.username;
	if(patchUser){
		res.status(400).send('ERROR can not patch username');
	}
	else{	
	
			databaseClient.hmsetAsync(username, ["name", name]).then( function (contents){
				res.status(200).send(' student updated');
			}).catch( function (error) {
				res.status(404).send('student patched');
			});
           } 

});

app.get('/students/:username', authorize,function ( req, res) {
	var username = req.params.username;
	if(!username){
		res.status(400).send('missing username');
	} else {
		databaseClient.sismemberAsync("students", username).then( function (contents) {
		
		if(contents){
			console.log(contents);
			databaseClient.getAsync("students:"+username).then( function (contents){
				res.status(200).json({"username": username, "name": contents.name, "_ref": "/students/"+username});
			}).catch(function ( error){
				res.status(500).send(" [ " + error + " ] error getting student");
			})
		}
		else{
			res.status(500).send(" [ error ] student does not exist");
		}
    		}).catch( function (error) {
			console.log(" [ " + error + " ] making hexist in getting student");
			});
	}
});

app.get('/students', authorize, function ( req, res) {

	databaseClient.smembersAsync('students').then( function (contents){
		var promises = [];
		var students = [];
		console.log(contents);
		for(var student in contents){
			var promise = databaseClient.hgetallAsync("students:"+student).then(function (student){
				var studObject = {"username": student.username, "name": student.name};
				students.push(studObject);
			}).catch(function (error){
				res.status(500).send("[ " + error + " ] in hgetallAsync");
			})
	
		promises.push(promise); 
		}
	
		Promise.all(promises).then(function (){	
		res.status(200).json(students);
	}).catch(function (error){
		res.status(500).send("[ " + error + "]  getting all promises");	
	});

	}).catch(function (error){
		res.status(500).send("[ " + error + " ] in smembersAsync");
	});
});	
/*
	databaseClient.smembersAsync("students").then( function ( contents) {
		if(contents){
			console.log(" [ OK   ] getting all students");
			res.status(200).json( contents);
			return;
		} else {
			console.log(" [ OK   ] getting all students");
			res.status(200).end();
			return;
		}
	}).catch( function (error) {
		console.log(" [ " + error + " ] error in hgetall in getting /Students");
		res.status(404).send('error');
	});
*/

app.post('/grades', authorize, function ( req, res) {
	var ready = 1,
	username = req.body.username,
	type = req.body.type,
	max = req.body.max,
	grade = req.body.grade;
	if( !username){
		ready = 0;
    } 
    else if( !type){
		ready = 0;
    } 
    else if( !max){
		ready = 0;
    } 
    else if( !grade){
		ready = 0;
	}
	if(!ready){
		res.status(400).send('missing something');
    } 
    else {
	databaseClient.incrAsync("gradeNum").then( function (vals){
		var gradeid = vals;
		
		databaseClient.hmsetAsync(gradeid,["type", type, "max", max, "grade", grade, "_ref", "/grades/"+gradeid]).then( function (contents){
			res.status(200).json({"username":username, "type": type, "max":max, "grade":grade, "_ref": "/grades/"+gradeid});
		});
	}).catch(function(error){
		res.status(400).send("[ " + error +" ] getting gradenum from database");
	});	
    }
});
app.get('/grades/:gradeid', authorize, function ( req, res) {
/*	console.log('get a grade');
	var gradeid = req.params.gradeid;
	
	if(!gradeid){
		res.status(400).send("missing gradeid");
	}else{
	databaseClient.hexistsAsync("grades", gradeid).then( function (contents) {
		if (contents){
			databaseClient.hgetAsync("grades", gradeid).then( function(contents){
				res.status(200).json( {_ref : "/grades/" + gradeid});	
			}).catch( function (error){
				res.status(400).send('error getting grade');
		});
	}else{
		res.status(400).send('error getting grade');
	     }
	});
	}*/
	var gradeid = req.params.gradeid;
	databaseClient.hgetallAsync(gradeid).then( function (contents){
		console.log(contents);
		res.status(200).json(contents);
	}).catch( function( error){
	});
	console.log('get a grade');
});

app.patch('/grades/:gradeid', authorize, function ( req, res) {
	var id = req.params.gradeid;
	var max = req.body.max;
	var grade = req.body.grade;
	var type = req.body.type;
	var username = req.body.username;	
	var patch = {};
	
	if(!id){
	  res.status(400).send("missing ID");	
	}
	if(max){
	  patch["max"] = max; 
	}	
	if(grade){
	  patch["grade"] = grade;
	}
	if(type){
	  patch["type"] = type;
	}
	if(username){
	  patch["username"] = username;
	}
	
	databaseClient.hmsetAsync(id,patch).then(function(contents){
		res.status(200).json(JSON.stringify(patch));
	}).catch(function(error){
		res.status(404).send("does not exist");
	});
});

app.delete('/grades/:gradeid', authorize, function ( req, res) {
/*	var gradeid = req.params.gradeid;
	if(!gradeid){
		//username DNE
		res.status(400).send('missing gradeid');
    } 
    else {
		databaseClient.sismemberAsync("grades", gradeid).then( function (contents) {
			if(contents){
				databaseClient.sremAsync( "grades", gradeid).then( function (contents) {
					console.log(" [ " + contents + "  ] removing grades from the database");
					res.status(200).send(gradeid + " is removed from the table");
				}).catch( function ( error) {
				console.log(" [ " + error + " ] removing grades in the database");
				});
            } 
            else {
				res.status(404).send(gradeid + " does not exist in the database");
				console.log("404 in delete grades not lit");
			}
		}).catch( function (error) {
			console.log(" [ " + error + " ] removing grades");
		});
	}*/
	var id = req.params.gradeid;
	databaseClient.existsAsync(id).then( function (contents){
		if(!contents){
			res.status(404).send("grade does not exist");	
		}
		databaseClient.delAsync(id).then( function (contents){
			res.status(200).end();

			return;
		}).catch( function (error){
			res.status(404).send("[ " + error + " ] grade does not exist");
			//error in del
		});
	}).catch( function (error){
		//error in hexist
		res.status(404).send("[ " + error + " ] grade does not exist");
	});
});

app.get('/grades', authorize, function ( req, res) {
	console.log('getting all the grades');
	
	
	//res.status(200).send.('no grades exist');
});

app.delete('/db', authorize, function ( req, res) {
	databaseClient.flushallAsync().then( function (contents){
		console.log( " [ " + contents + "  ] table cleared");
		res.status(200).send("table cleared");
	}).catch( function (error) {
		res.status(400).send("error");

	});
});

app.listen(3000, function () {
  console.log('app listening on port 3000!')
});