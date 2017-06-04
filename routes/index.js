
global.dados = [];

module.exports = function(app){

  // Importa modulos nativos
  var rp = require('request-promise');
  var request = require('request');

  // Custom Modules
  // var db = require('./../libs/connectdb.js')();

  app.get('/', function(req, res){
    res.render('index');
  });

  app.get('/salvar', function(req, res){

    var registro = {
      cnpj:           req.query.cnpj,
      nf:             req.query.nf,
      data:           req.query.data,
      valor:          req.query.valor,
      local:          req.query.local,
      vereador:       req.query.vereador
    }

    global.dados.push(registro);

    console.log(dados);

    res.send('1');

  });

  app.get('/json', function(req, res){

    res.send(global.dados);

  });

  app.get('/prestacoes', function(req, res){

    res.render('prestacoes')

  });

  app.get('/teste', function(req, res){
    res.render('teste');
  });

  app.get('/clear', function(req, res){
    global.dados = [];
    res.send('Data cleared')
  });

}
