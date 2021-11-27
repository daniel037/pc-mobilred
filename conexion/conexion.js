var mysql = require('mysql');

//datos para realizar conexion
var connection = mysql.createConnection({
    host : 'localhost',
    user: 'root',
    password: '',
    database: 'ventas',
});

//se realiza conexion y se verifica si esta fue exitosa o no
connection.connect( 
    (err)=>{
        if(!err){console.log('conexion establecida');}
        else{console.log('conexion fallida');}
    }
 );
 
module.exports=connection;
