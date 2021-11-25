var express = require('express');
var router = express.Router();

var db = require('../conexion/conexion');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* GET seccion contactanos */
router.get('/contactanos', function(req, res, next) {
  res.render('contactanos', { title: 'PC-MOBILRED ESTAMOS ATENTOS A TU SOLICITUD..' });
});


/* GET seccion productos */
router.get('/productos', function(req, res, next) {
  //conexion a base de datos
  db.query("select * from tblproductos", function(err, resultados){
      console.log(resultados);
      res.render('productos', { title: 'PRODUCTOS DISPONIBLES...', libros: resultados });
   });
});


/* GET seccion detalle */
router.get('/detalle/:id', function(req, res, next) {
  const { id } = req.params;

  db.query("select * from tblproductos where id = ?",[id], function(err, resultados){
    console.log(resultados);
    res.render('detalle', { title: 'Detalle Del Producto', producto: resultados });
  });

});

/* GET seccion servicios */
router.get('/servicios', function(req, res, next) {
  res.render('servicios', { title: 'servicios' });
});

/* GET seccion compra */
router.get('/compra/:id', function(req, res, next) {
  const { id } = req.params;

  db.query("select * from tblproductos where id = ?",[id], function(err, resultados){
    console.log(resultados);
    res.render('compra', { title: 'compra', producto: resultados });
  });

});


/* */
router.post('/agregar', (req, res) => {
  const {identificacion, id_producto} = req.body;
  db.query(
    ' INSERT INTO compra SET ?',
    {
      identificacion,
      id_producto
    },
    (err, result) => {
      res.redirect('/productos');
    }
  );
  
});



/* GET seccion buscar */
router.get('/buscar', function(req, res, next) {
  res.render('buscar', { title: 'Buscar' });
});


/* POST seccion buscar */
router.post('/buscar', function(req, res, next) {
  const {identificacion} = req.body;

  db.query("SELECT * FROM compra INNER JOIN tblproductos on compra.id_producto = tblproductos.id and compra.identificacion = ?", [identificacion], function(err, resultados){
    console.log('------------  buscar ------')
    console.log(resultados);

    res.render('carrito', { title: 'mi carito', producto: resultados });
  });

});


/* GET seccion carrito */
router.get('/carrito/:id/:identificacion', function(req, res, next) {
  const { id, identificacion } = req.params;

  db.query("delete from compra where id_producto = ? and identificacion = ? limit 1",[id, identificacion], function(err, resultados){
    console.log(resultados);
  });

  db.query("SELECT * FROM compra INNER JOIN tblproductos on compra.id_producto = tblproductos.id and compra.identificacion = ?", [identificacion], function(err, resultados){
    console.log('------------  buscar ------')
    console.log(resultados);

    res.render('carrito', { title: 'mi carito', producto: resultados });
  });

});


/* GET seccion buscar 
router.get('/facturacion', function(req, res, next) {
  res.render('facturacion', { title: 'facturacion' });
});
*/

/* GET seccion buscar */
router.get('/facturacion/:identificacion', function(req, res, next) {
  const {identificacion} = req.params;

  db.query("SELECT * FROM compra INNER JOIN tblproductos on compra.id_producto = tblproductos.id and compra.identificacion = ?", [identificacion], function(err, resultados){
    console.log('------------  resultado de factura ------')
    console.log(resultados);

    res.render('facturacion', { title: 'mi factura....', producto: resultados });
  });

});


module.exports = router;
