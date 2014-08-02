var eztv = require('eztv');
var peerflix = require('peerflix');
var torrentStream = require('torrent-stream');
var fs = require('fs');
var path = require('path');
var http = require('http');
var feed = require("feed-read");
var passport = require('passport');
var flash 	 = require('connect-flash');
var tpb = require('thepiratebay');
// var FB = require('fb');


// recupere la listes des series
exports.index = function(req, res)
{
	res.redirect('/eztv');
}


// exports.facebook = function (req, res)
// {

// FB.setAccessToken('CAADcit8NcMIBAIJ0MBY5ubMFwVwZC4b3TfH2YqsRl54pEFDqx5RrHZAmeXq2IOgkMd0sH7gEixRxSeyz6f3oVziwiBMXbYXMPjRU69HmYHrqUBtegnZBaiZBdnZBH8k8WSHfvO8zFtT49nzwNCZBmeoJJUN8IbsnuJVISwXfTxdmCxndTni920IPkXTjPFwZCSMr5SvCQZB5t68C4hxQ1RAS');



// FB.api('/v2.0/me/friends', function (res) {
//   if(!res || res.error) {
//     console.log(!res ? 'error occurred' : res.error);
//     return;
//   }
//   console.log(res);
//   console.log(res.name);
// });

// }

exports.eztv = function(req, res)
{
	console.log("eztv");
	res.render('eztv.ejs');
}

exports.eztv_search = function(req, res)
{
	console.log("eztv_search");
	console.log(req.body);
	eztv.getShows({query : req.body.user.search}, function(error, results_show) 
	{
		id = results_show[0]['id'];
		eztv.getShowEpisodes((id), function(error, results_episode)
		{
			episodes = results_episode['episodes'];
			// console.log(episodes);
			res.render('eztv_search.ejs', {'page': 'eztv_search', 'results_show': results_show,'episodes': episodes});
		})
	})
}

exports.tpb_search_p = function (req, res)
{
	console.log("tpb_search");
	console.log(req.body);
	tpb.search(req.body.user.search , { category: '200'} , function(error, results_movies) 
	{
		// id = results_show[0]['id'];
		// eztv.getShowEpisodes((id), function(error, results_episode)
		// {
			// episodes = results_episode['episodes'];
			// console.log(episodes);
			console.log(results_movies);
			res.render('tpb_search.ejs', {'page': 'tpb_search', 'results_movies': results_movies});
		// })
	});
}

exports.tpb_search = function (req, res)
{
	console.log("tpb_search");
	res.render('tpb.ejs');
}

exports.tpb_dl = function(req, res)
{
	console.log("tpb_dl");
	magnet = req.query['id'];
	var engine = torrentStream(magnet);
	console.log(engine['path']);
	engine.on('ready', function()
	{
		engine.files.forEach(function(file)
		{
			console.log(file.select('Sample.mp4'));
	    	// console.log(file.createReadStream.readable);
	    	console.log("le path :   " + (path.join(__dirname, file.name)));
	    	var stream = file.createReadStream();
	    	// var out = fs.createWriteStream(path.join(__dirname, file.name));
	    	var pathv = (path.join(engine['path'], file.name));
			console.log(pathv);	    
			console.log("ici4");
			setTimeout(function(error, test){
	
				var stat = fs.statSync(pathv);
				console.log("ici5");
				var total = stat.size;
				console.log("ici3");
				if (req.headers['range'])
				{
					console.log("ici1");
					var range = req.headers.range;
					var parts = range.replace(/bytes=/, "").split("-");
					var partialstart = parts[0];
					var partialend = parts[1];
					console.log("ici2");
					var start = parseInt(partialstart, 10);
					var end = partialend ? parseInt(partialend, 10) : total-1;
					var chunksize = (end-start)+1;
					console.log('RANGE: ' + start + ' - ' + end + ' = ' + chunksize);

					var file = fs.createReadStream(pathv, {start: start, end: end});
					res.writeHead(206, { 'Content-Range': 'bytes ' + start + '-' + end + '/' + total, 'Accept-Ranges': 'bytes', 'Content-Length': chunksize, 'Content-Type': 'video/mp4' });
					file.pipe(res);
				}
				else
				{
					console.log('ALL: ' + total);
					res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'video/mp4' });
					fs.createReadStream(pathv).pipe(res);
				}
		

			console.log('Server running at http://127.0.0.1:1337/');
				// res.redirect('http://127.0.0.1/');
	}, 20000);	
	    	// stream is readable stream to containing the file content
	  	});

	});

}

exports.eztv_dl = function(req, res)
{
	console.log("eztv_dl");
	magnet = req.query['id'];
	var engine = torrentStream(magnet);
	console.log(engine['path']);
	engine.on('ready', function()
	{
		engine.files.forEach(function(file)
		{
	    	console.log(file.createReadStream.readable);
	    	console.log("le path :   " + (path.join(__dirname, file.name)));
	    	var stream = file.createReadStream();
	    	// var out = fs.createWriteStream(path.join(__dirname, file.name));
	    	var pathv = (path.join(engine['path'], file.name));
			console.log(pathv);	    
			console.log("ici4");
			setTimeout(function(error, test){
	
				var stat = fs.statSync(pathv);
				console.log("ici5");
				var total = stat.size;
				console.log("ici3");
				if (req.headers['range'])
				{
					console.log("ici1");
					var range = req.headers.range;
					var parts = range.replace(/bytes=/, "").split("-");
					var partialstart = parts[0];
					var partialend = parts[1];
					console.log("ici2");
					var start = parseInt(partialstart, 10);
					var end = partialend ? parseInt(partialend, 10) : total-1;
					var chunksize = (end-start)+1;
					console.log('RANGE: ' + start + ' - ' + end + ' = ' + chunksize);

					var file = fs.createReadStream(pathv, {start: start, end: end});
					res.writeHead(206, { 'Content-Range': 'bytes ' + start + '-' + end + '/' + total, 'Accept-Ranges': 'bytes', 'Content-Length': chunksize, 'Content-Type': 'video/mp4' });
					file.pipe(res);
				}
				else
				{
					console.log('ALL: ' + total);
					res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'video/mp4' });
					fs.createReadStream(pathv).pipe(res);
				}
		

			console.log('Server running at http://127.0.0.1:1337/');
				// res.redirect('http://127.0.0.1/');
	}, 20000);	
	    	// stream is readable stream to containing the file content
	  	});

	});

}

exports.eztv_news = function(req, res)
{
	
	feed("http://ezrss.it/feed/", function(err, articles)
	{
		  // Each article has the following properties:
		  // 
		  //   * "title"     - The article title (String).
		  //   * "author"    - The author's name (String).
		  //   * "link"      - The original article link (String).
		  //   * "content"   - The HTML content of the article (String).
		  //   * "published" - The date that the article was published (Date).
		  //   * "feed"      - {name, source, link}
		  // 
		  // console.log(articles);
res.render('eztv_news.ejs', {'page': 'eztv_news', 'articles': articles, 'user': req.usercookie.user, 'group': req.usercookie.group});

	});
}