
/*
	Arquivo de conexão para o MariaDb
*/



module.exports = function(){

	var mysql      = require('mysql');
	var connection = mysql.createConnection({
	  host     : 'er7lx9km02rjyf3n.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
	  user     : 'gydf6hgwmn5xptzl',
	  password : 'l7fvehji3jqntqcj',
		database : 'vx723fkuqlddlnp6',
		port: '3306'
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
