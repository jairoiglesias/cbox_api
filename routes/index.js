
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
      vereador:       req.query.vereador,
      anexo:          req.query.anexo
    }

    global.dados.push(registro);

    console.log(dados);

    res.send('1');

  });

  app.get('/json', function(req, res){

    res.send(global.dados);

  });

  app.get('/prestacoes', function(req, res){

    global.dados = [];

    var regMocado = [
      {cnpj:'00006878000134', nf: '12', data: '10/05/2017', valor: '107,25', local: 'São Paulo - SP', vereador: 'Mathes Wagner de Souza', anexo: 'Sim'},
      {cnpj:'02428624000130', nf: '55', data: '02/04/2017', valor: '96,00', local: 'Curitiba - SP', vereador: 'Armando Ernandes Silva', anexo: 'Sim'},
      {cnpj:'07319605000199', nf: '36', data: '25/04/2017*', valor: '58,00', local: 'São Paulo - SP', vereador: 'Armando Ernandes Silva', anexo: 'Sim'},
      {cnpj:'02931466000136', nf: '63', data: '21/05/2017', valor: '12,14', local: 'São Paulo - SP', vereador: 'Matheus Wagner de Souza', anexo: 'Sim'},
      {cnpj:'05348926000196', nf: '16', data: '04/04/2017', valor: '18,47', local: 'São Paulo - SP', vereador: 'Luara Antunes Martinez', anexo: 'Sim'},
      {cnpj:'09414163000195', nf: '31', data: '07/03/2017', valor: '70,50', local: 'Curitiba - SP', vereador: 'Armando Ernandes Silva', anexo: 'Sim'},
    ]

    global.dados = regMocado;

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
