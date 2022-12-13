const express = require('express');
const routes = require('./routes');
const app = express();

/*let alumnos = [
    {id: 1, nombres: 'Juan Carlos', apellidos: 'Can Tun', matricula: 'A2877182', promedio: 76},
    {id: 2, nombres: 'Victors', apellidos: 'Pacheco', matricula: 'A45664565', promedio: 67},
    {id: 3, nombres: 'Rafael', apellidos: 'Vergara', matricula: 'A2443343', promedio: 12},
    {id: 4, nombres: 'Eusebio', apellidos: 'Ajas', matricula: 'A344656556', promedio: 89}
];*/

/*let profesores = [
    {id: 1, numeroEmpleado: 1111111, nombres: 'Pedrito', apellidos: 'Salazar', horasClase: 58},
    {id: 2, numeroEmpleado: 2222222, nombres: 'Peña', apellidos: 'Nieto', horasClase: 0},
    {id: 3, numeroEmpleado: 3333333, nombres: 'Amlo', apellidos: 'Ruco', horasClase: 13},
    {id: 4, numeroEmpleado: 4444444, nombres: 'Obama', apellidos: 'Shido', horasClase: 400}
];*/

app.use('/', routes());

const port = process.env.port || 3000;
app.listen(port, () => console.log('Escuchado el puerto ' + port));