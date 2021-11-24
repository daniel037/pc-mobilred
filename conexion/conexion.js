var mysql = require('mysql');
var connection = mysql.createConnection({
    host : 'localhost',
    user: 'root',
    password: '',
    database: 'ventas',
});

connection.connect( 
    (err)=>{
        if(!err){console.log('conexion establecida');}
        else{console.log('conexion fallida');}
    }
 );


module.exports=connection;

 /*
 connection.query("select * from tblproductos", function(err, resultados){
    console.log(resultados)
 });
*/

//connection.end();