
module.exports = function(app){

  // Importa modulos nativos
  var rp = require('request-promise');
  var request = require('request');

  // Custom Modules
  var db = require('./../libs/connectdb.js')();

  var ACCESS_TOKEN_ASSERTIVA = '210DB58D-2492-4152-AAD9-4A9647771670';
  var ACCESS_TOKEN_DATAHOLICS = '2d8d596a0b97569f9226a8c33ed9c6dbc8d88120';

  // Função para obter os dados da API da Assertiva

  function getInfoAssetiva(tipoConsulta, valor, callback){

    switch(tipoConsulta){

      case 'cpf':

        console.log('Pesquisando dados de '+valor);

        var options = {
          method: 'POST',
          uri: 'https://services.assertivasolucoes.com.br/v1/localize/1000/consultar',
          form: {
            'cpf': valor
          },
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36',
            'Authorization' : ACCESS_TOKEN_ASSERTIVA
          },
          json: true
        }

        rp(options).then(function(response){
          callback(response);
        });

        break;

      case 'cnpj':

        console.log('Pesquisando dados de '+valor);

        var options = {
          method: 'POST',
          uri: 'https://services.assertivasolucoes.com.br/v1/localize/1001/consultar',
          form: {
            'cnpj': valor
          },
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36',
            'Authorization' : ACCESS_TOKEN_ASSERTIVA
          },
          json: true,
          timeout: 9999999,
        }

        rp(options).then(function(response){
          callback(response);
        });

        break;

      default:
        callback('Tipo de Operação Invalida');
    }

  }

  function getInfoDataHolics(email, callback){

    var options = {
      resolveWithFullResponse: true,
      method: 'GET',
      uri: 'http://api.dataholics.io/profile',
      qs: {
        email : email,
        accessKey : ACCESS_TOKEN_DATAHOLICS
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36',
      },
      json: true
    }

    rp(options).then(function(response){

      if(response.body.message == 'Request sent to queue.'){
        callback(null)
      }

      callback(response.body);

    }).catch(function(err){
      console.log('ERRO: ');
    });

  }

  app.get('/', function(req, res){
    res.render('index');
  });

  // Rota para dados da Assertiva

  app.get('/assertiva/:tipoconsulta/:valor', function(req, res, next){

    var tipoConsulta = req.params.tipoconsulta;
    var valor = req.params.valor;

    getInfoAssetiva(tipoConsulta, valor, function(response){
      res.send(response);
    });

  });

  // Rota para dados do Facebook
  app.get('/fb/:email', function(req, res, next){

    var email = req.params.email;

    getInfoDataHolics(email, function(response){
      res.send(response);
    });

  });

  // Rota unica para permitir request por tipo de consulta

  app.get('/cbox/:tipoconsulta/:valor', function(req, res, next){

    var assertivaJSON;
    var dataHolicsJSON;
    var cboxJSON = {};

    var tipoConsulta = req.params.tipoconsulta;
    var valor = req.params.valor;

    var promise = new Promise(function(resolve, reject){

      switch (tipoConsulta) {

        case 'email':

          getInfoDataHolics(valor, function(response){

            dataHolicsJSON = response;

            cboxJSON.assertiva = null;
            cboxJSON.dataholics = dataHolicsJSON;

            resolve(cboxJSON);

          });

        break;

        case 'cpf':

          getInfoAssetiva(tipoConsulta, valor, function(response){

            assertivaJSON = response;

            var emails = response.emails;

            if (emails == null){
              res.send('Cliente não possui email cadastrado na Assertiva')
            }

            var curEmail = emails[0].email;

            getInfoDataHolics(curEmail, function(response){

              dataHolicsJSON = response;

              cboxJSON.assertiva = assertivaJSON;
              cboxJSON.dataholics = dataHolicsJSON;

              resolve(cboxJSON);

            });

          });

          break;

        default:

      }
    });

    promise.then(function(){

      res.send(cboxJSON);

    });

  });

  app.get('/get_temp', function(req, res, next){

    console.log('Iniciando captura de dados no Facebook')

    db.query('select * from tbEmpregados', function (error, rows, fields) {
      if (error) throw error;

      var timeout = 0;

      // Percorre os resultados e submete o request
      rows.forEach(function(row){

        // Submete request para a DataHolics para recuperar os dados do Facebook
        var curEmail = row.EMAIL1;

        getInfoDataHolics(curEmail, function(response){

          var likes = response.profile.socialProfiles[0].likes;

          likes.forEach(function(like){

            // console.log(row.CPF);
            // console.log(like);
            // console.log('=======================')

            var cpf = row.CPF;
            var link = like.link;
            var categoria = like.category;
            var nome = like.name;

            var promise = new Promise(function(resolve, reject){

              db.query("INSERT INTO tbGostos SET CPF = " + db.escape(cpf) + ", Link = " + db.escape(link), function (error, results, fields) {
                if (error) throw error;
                console.log('Registros de Like Inserido');
                resolve();
              });

            })

            /*
            promise.then(function(){

              // Insere o registro na tabela de Links
              // db.query("SELECT * FROM tbLink WHERE Link = "+ db.escape(link) + " AND Categoria = " + db.escape(categoria), function(error, results, fields){
              //   if (error) throw error;
              //
              //   if(results.length === 0){
                //
                //   // var sql = "INSERT INTO tbLink SET Link = '" + db.escape(link) + "', Categoria = '" + db.escape(categoria) + "', Nome = '" + db.escape(nome) + "'";
                  var sql = "INSERT INTO tbLink SET Link = " + db.escape(link) + ", Categoria = " + db.escape(categoria) + ", Nome = " + db.escape(nome);
                  // console.log(sql)

                  db.query(sql, function (error, results, fields) {
                    // if (error) {
                    //   console.log(link);
                    //   console.log(categoria);
                    //   console.log(nome)
                    //   process.exit();
                    // };
                    console.log('Registro de Link Inserido')

                  });

              //   }
              //
              //
              // });

            })
            */


          });

        });

      });

    });

  });

  app.get('/get_companies', function(req, res, next){

    var sql = 'select CNAEEMPRESASOCIO from tbEmpregados where CNAEEMPRESASOCIO is not null GROUP BY CNAEEMPRESASOCIO';

    db.query(sql, function(err, results, fields){
      res.send(results);
    });

  });

  app.get('/get_occupations/:empresa', function(req, res, next){

    var empresa = req.params.empresa;

    var sql = "select CBODESCRICAO1 from tbEmpregados where CNAEEMPRESASOCIO = '"+ empresa + "'";

    db.query(sql, function(err, results, fields){
      res.send(results);
    });

  });

  app.get('/get_pages/', function(req, res, next){

    var sql = "SELECT e.sexo, count(g.cpf) as qtde, g.link, l.nome FROM tbGostos AS g INNER JOIN tbEmpregados AS e ON e.cpf = g.cpf INNER JOIN tbLink AS l ON g.link = l.link GROUP BY g.link, e.sexo ORDER BY count(g.cpf) LIMIT 200";

    db.query(sql, function(err, results, fields){
      res.send(results);
    });

  });

}
