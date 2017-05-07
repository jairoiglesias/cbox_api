
/*
	Arquivo de conexão para o MariaDb
*/



module.exports = function(){

	var mysql      = require('mysql');
	var connection = mysql.createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  password : '',
		database : 'cbox'
	});

	connection.connect(function(err) {
		if (err) {
			console.error('error connecting: ' + err.stack);
			return;
		}

		console.log('Conexão realizada com sucesso!');

	});

	return connection
}
