const { json } = require('express');
var express = require('express');
var router = express.Router();

var db = require('../conexion/conexion');

//Metodo GET para la ruta principal
router.get('/', function(req, res, next) {
  res.render('index', { title: 'PRINCIPAL' });
});


//Metodo GET para la ruta de contactanos
router.get('/contactanos', function(req, res, next) {
  res.render('contactanos', { title: 'PC-MOBILRED ESTAMOS ATENTOS A TU SOLICITUD.' });
});

//Metodo GET para la ruta de productos
router.get('/productos', function(req, res, next) {
  //conexion a base de datos, y consulta para traer los productos
  db.query("select * from producto", function(err, resultados){
      //se renderisa en la pagina de productos, el resultado de la consulta
      res.render('productos', { title: 'PRODUCTOS DISPONIBLES.', productos: resultados });
   });
});


//Metodo GET para la ruta detalle del producto
router.get('/detalle/:id', function(req, res, next) {
  //se resibe el id como parametro
  const { id } = req.params;
  //conexion a base de datos, y consulta de los detalles del parametro utilizando el id del producto 
  db.query("select * from producto where id = ?",[id], function(err, resultados){
    res.render('detalle', { title: 'DETALLE DEL PRODUCTO.', producto: resultados });
  });
});


//Metodo GET para la ruta de compra
router.get('/compra/:id', function(req, res, next) {
  const { id } = req.params;
  db.query("select * from producto where id = ?",[id], function(err, resultados){
    res.render('compra', { title: 'COMPRA.', producto: resultados });
  });
});


//Metodo POST para el metodo de gregar productos al carrito 
router.post('/agregar', (req, res) => {
  //obtenemos identificacion y id_producto como constantes
  const {identificacion, id_producto} = req.body;
  const estado = 'activo';

  //conexion y consulta a base de datos
  db.query(' INSERT INTO carrito SET ?',{
      identificacion,
      estado,
      id_producto
    },(err, result) => {
      //redirigimos a una ventana anterior
      res.redirect('/productos');
    }
  );
});


//Metodo GET para la ruta buscar
//simplemente nos redirecciona a la pantalla de buscar
router.get('/buscar', function(req, res, next) {
  res.render('buscar', { title: 'BUSCAR CON IDENTIFICACIÓN.' });
});


//Metodo POST para la ruta buscar
//aqui buscamos el numero de identificacion qeu colocamos en la busqueda
//para hacer la consulta de los productos asociados a la identificacion que estan 
//en el carrito
router.post('/buscar', function(req, res, next) {
  const {identificacion} = req.body;
  const estado = 'activo';
  
  db.query("SELECT COUNT(*) FROM carrito INNER JOIN producto on carrito.id_producto = producto.id and carrito.identificacion = ? and carrito.estado = ?",[identificacion, estado], function(err, cantidad){ 
    
    if(Object.values(cantidad[0]) > 0) {
      db.query("SELECT * FROM carrito INNER JOIN producto on carrito.id_producto = producto.id and carrito.identificacion = ? and carrito.estado = ?", [identificacion, estado], function(err, resultados){      
        res.render('carrito', { title: 'MI CARRITO:' + ' ' + resultados[0].identificacion, producto: resultados });
      });
    }else{
      console.log("no hay datos");
      res.render('buscar', { title: 'No se encontraron datos.. Intente con otra Identificación.' });
    }
    
  });
});


//Metodo GET para la ruta carrito
//este metodo es el que se encarga de la eliminacion de un producto cuando lo quitamos del carrito
router.get('/carrito/:id/:identificacion', function(req, res, next) {
  //obtenemos el ide del producto y la identificacion del cliente asociado a este como parametros
  const { id, identificacion } = req.params;
  const estado = 'activo';

  //conectamos a la base de datos y eliminamos el producto seleccionado
  db.query("delete from carrito where id_producto = ? and identificacion = ? limit 1",[id, identificacion], function(err, resultados){
    //realizamos una nueva consulta de los productos asociados al cliente y los renderizamos nuevamente 
    db.query("SELECT COUNT(*) FROM carrito INNER JOIN producto on carrito.id_producto = producto.id and carrito.identificacion = ? and carrito.estado = ?",[identificacion, estado], function(err, cantidad){ 
      if(Object.values(cantidad[0]) > 0) {
        db.query("SELECT * FROM carrito INNER JOIN producto on carrito.id_producto = producto.id and carrito.identificacion = ? and carrito.estado = ?", [identificacion, estado], function(err, resultados){      
          res.render('carrito', { title: 'MI CARRITO:' + ' ' + resultados[0].identificacion, producto: resultados });
        });
      }else{
        res.render('buscar', { title: 'No se encontraron datos.. Intente con otra Identificación.' });
      }    
    });
  });

});









//Metodo GET para la ruta facturacion
router.get('/facturacion/:identificacion', function(req, res, next) {
  const {identificacion} = req.params;
  const estado = 'activo';

  db.query("SELECT * FROM carrito INNER JOIN producto on carrito.id_producto = producto.id and carrito.identificacion = ? and carrito.estado = ?", [identificacion, estado], function(err, resultados){
    res.render('facturacion', { title: 'MI FACTURA.', producto: resultados });
  });
});



//Metodo POST para el metodo de gregar productos al carrito 
router.post('/agregar-factura', (req, res) => {
  //obtenemos identificacion y id_producto como constantes
  const {
    nombre,
    apellidos,
    empresa,
    direccion,
    direccion2,
    celular,
    telefono,
    correo,
    identificacion
  } = req.body;
  const estado = 'inactivo';

  console.log( nombre + " --- " + apellidos + " --- " + empresa + " --- " + direccion + " --- " + direccion2 + " --- " + celular + " --- " + telefono + " --- " + correo + " --- " + identificacion )
  
  db.query("UPDATE carrito SET estado = ? where identificacion = ?",[estado, identificacion], function(err, resultados){
  });

  //conexion y consulta a base de datos
  db.query(' INSERT INTO factura SET ?',{
      nombre,
      apellidos,
      empresa,
      direccion,
      direccion2,
      celular,
      telefono,
      correo,
      identificacion
    },(err, result) => {
      //redirigimos a una ventana anterior
      res.redirect('/');
    }
  );
});



module.exports = router;
