module.exports = function(app){
	/* app get function to render the main website index */  
	app.get('/', function(request, response) {
	  response.render('pages/index');
	});

	/* app get to handle routing for the schilli web pages */
	app.get(/^\/schilli\/(.+)/, function(request, response) {
	  response.render('pages/schilli/'+request.params[0]);
	})

	/*app get function to render the chat web page */
	app.get('/chat', function(request, response) {
	  response.render('pages/chat');
	});

	app.get('/cool', function(request,response){
	  response.send(cool());
	});


	app.get('/times', function(request, response) {
	    var result = ''
	    var times = process.env.TIMES || 5
	    for (i=0; i < times; i++)
	      result += i + ' ';
	  response.send(result);
	});

	app.get('/db', function (request, response) {
	  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	    client.query('SELECT * FROM test_table', function(err, result) {
	      done();
	      if (err)
	       { console.error(err); response.send("Error " + err); }
	      else
	       { response.render('pages/db', {results: result.rows} ); }
	    });
	  });
	});

}