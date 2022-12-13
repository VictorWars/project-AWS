require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const router = express.Router();
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const dbconnection = require('../components/connection');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN
    },
    region: process.env.AWS_REGION,
});


module.exports = function () {
    //Creo variable de la instancia de la base de datos
    const connection = dbconnection();
    //ruta para home
    let alumnos = [];
    let profesores = [];

    router.use(express.json());

    router.use(fileUpload({
        limits: { fileSize: 50 * 1024 * 1024 }
    }));

    router.get('/', (req, res) => {
        connection.query('SELECT * from alumnos', function (error, results, fields) {
            if (error) {
                throw error;
            } else if (results) {
                alumnos = results;

                res.status(200).send(alumnos);
            }
        });
    });

    router.get('/alumnos', (req, res) => {
        connection.query('SELECT * from alumnos', function (error, results, fields) {
            if (error) {
                throw error;
            } else if (results) {
                alumnos = results;

                res.status(200).send(alumnos);
            }
        });
    });

    router.get('/alumnos/:id', (req, res) => {
        connection.query("SELECT * from alumnos WHERE id = " + [parseInt(req.params.id)] + ";", function (error, results, fields) {
            if (error) {
                throw res.status(404).send('Alumno no encontrado' + error);
            } else if (results) {
                if (!results[0]) return res.status(404).send('Alumno no encontrado');
                //console.log(results);
                /*let alumno = {
                    id: parseInt(results.RowDataPacket.id),
                    nombres: results.RowDataPacket.nombres,
                    apellidos: results.RowDataPacket.apellidos,
                    matricula: results.RowDataPacket.matricula,
                    promedio: parseFloat(results.RowDataPacket.promedio)
                };*/
                res.status(200).send(results[0]);
            }
        });
        /*const alumno = alumnos.find(c => c.id === parseInt(req.params.id));
        if (!alumno) return res.status(404).send('Alumno no encontrado');
        else res.status(200).send(alumno);*/
    });

    router.post('/alumnos', (req, res) => {
        if (req.body.nombres === null || req.body.nombres < 0) {
            return res.status(400).send(req.body);
        } else {
            if (req.body.apellidos === null || req.body.apellidos < 0) {
                return res.status(400).send(req.body);
            } else {
                if (req.body.matricula === null || req.body.matricula < 0) {
                    return res.status(400).send(req.body);
                } else {
                    if (req.body.promedio === null || parseFloat(req.body.promedio) < 0) {
                        return res.status(400).send(req.body);
                    } else {
                        connection.query("INSERT INTO alumnos (nombres, apellidos, matricula, promedio) VALUES ('" + [req.body.nombres] + "', '" + [req.body.apellidos] + "', '" + [req.body.matricula] + "', " + [parseFloat(req.body.promedio)] + ");", function (error, results, fields) {
                            if (error) {
                                throw error;
                            } else if (results) {
                                let alumno = {
                                    id: parseInt(results.insertId),
                                    nombres: req.body.nombres,
                                    apellidos: req.body.apellidos,
                                    matricula: req.body.matricula,
                                    promedio: parseFloat(req.body.promedio)
                                };
                                //res.status(201).send(alumno);
                                res.status(201).send(alumno);
                            }
                        });
                    }
                }
            }
        }
    });

    router.post('/alumnos/:id/fotoPerfil', async (req, res) => {
        console.log(process.env.AWS_ACCESS_KEY);
        console.log(req.files.foto.name);
        const uploadParams = {
            Bucket: 's3bucketproyectaws/fotos',
            Key: req.files.foto.name,
            Body: Buffer.from(req.files.foto.data),
            ContentType: req.files.foto.mimeType,
            ACL: 'public-read'
        };
        let locationImage;
        s3.upload(uploadParams, function (err, data) {
            err && console.log("Error", err)
            data && console.log("Carga exitosa...", data.Location)
            //console.log(data.Location);
            connection.query("UPDATE alumnos SET fotoPerfilUrl = '" + [data.Location] + "' WHERE id = " + [parseInt(req.params.id)] + ";", function (error, results, fields) {
                if (error) {
                    throw res.status(404).send('Alumno no encontrado' + error);
                } else if (results) {
                    connection.query("SELECT * from alumnos WHERE id = " + [parseInt(req.params.id)] + ";", function (error, results, fields) {
                        if (error) {
                            throw res.status(404).send('Alumno no encontrado' + error);
                        } else if (results) {
                            if (!results[0]) return res.status(404).send('Alumno no encontrado');
                            //console.log(results);
                            /*let alumno = {
                                id: parseInt(results.RowDataPacket.id),
                                nombres: results.RowDataPacket.nombres,
                                apellidos: results.RowDataPacket.apellidos,
                                matricula: results.RowDataPacket.matricula,
                                promedio: parseFloat(results.RowDataPacket.promedio)
                            };*/
                            res.status(200).send(results[0]);
                        }
                    });
                }
            });
        });
    });

    router.put('/alumnos/:id', (req, res) => {
        /*connection.query('SELECT * from alumnos', function (error, results, fields) {
            if (error) {
                throw error;
            } else if (results) {
                alumnos = results;
            }
        });
        const alumnoId = alumnos.findIndex(c => c.id === parseInt(req.params.id));
        //const id = parseInt(req.params.id) - 1;
        if (alumnoId === -1) return res.status(404).send('Alumno no encontrado');*/

        if (req.body.nombres === null || req.body.nombres < 0) {
            return res.status(400).send(req.body);
        } else {
            if (req.body.apellidos === null || req.body.apellidos < 0) {
                return res.status(400).send(req.body);
            } else {
                if (req.body.matricula === null || req.body.matricula < 0) {
                    return res.status(400).send(req.body);
                } else {
                    if (req.body.promedio === null || parseFloat(req.body.promedio) < 0) {
                        return res.status(400).send(req.body);
                    } else {
                        connection.query("UPDATE alumnos SET nombres = '" + [req.body.nombres] + "', apellidos = '" + [req.body.apellidos] + "', matricula = '" + [req.body.matricula] + "', promedio = " + [parseFloat(req.body.promedio)] + " WHERE id = " + [parseInt(req.params.id)] + ";", function (error, results, fields) {
                            if (error) {
                                throw res.status(404).send('Alumno no encontrado' + error);
                            } else if (results) {

                                //res.status(200).send(alumnos);
                                res.status(200).send(results);
                            }
                        });
                    }
                }
            }
        }
        //alumnos = {...alumnos, ...alumno};
    });

    router.delete('/alumnos/:id', (req, res) => {
        /*const alumno = alumnos.find(c => c.id === parseInt(req.params.id));
        if (!alumno) return res.status(404).send('Alumno no encontrado');

        const index = alumnos.indexOf(alumno);
        alumnos.splice(index, 1);
        res.send(alumno);*/
        connection.query("DELETE FROM alumnos WHERE id = " + [parseInt(req.params.id)] + ";", function (error, results, fields) {
            if (error) {
                throw error;
            } else if (results) {
                if (parseInt(results.affectedRows) < 1) return res.status(404).send('Alumno no encontrado');
                //res.status(200).send(alumnos);
                res.status(200).send(results);
            }
        });
    });

    router.get('/profesores', (req, res) => {
        connection.query('SELECT * from profesores', function (error, results, fields) {
            if (error) {
                throw error;
            } else if (results) {
                profesores = results;

                res.status(200).send(profesores);
            }
        });
    });

    router.get('/profesores/:id', (req, res) => {
        connection.query("SELECT * from profesores WHERE id = " + [parseInt(req.params.id)] + ";", function (error, results, fields) {
            if (error) {
                throw res.status(404).send('Profesor no encontrado' + error);
            } else if (results) {
                if (!results[0]) return res.status(404).send('Profesor no encontrado');
                res.status(200).send(results[0]);
            }
        });
        /*const profesor = profesores.find(c => c.id === parseInt(req.params.id));
        if (!profesor) return res.status(404).send('Profesor no encontrado');
        else res.status(200).send(profesor);*/
    });

    router.post('/profesores', (req, res) => {
        if (parseInt(req.body.numeroEmpleado) === null || parseInt(req.body.numeroEmpleado) < 0) {
            return res.status(400).send(req.body);
        } else {
            if (req.body.nombres === null || req.body.nombres < 0) {
                return res.status(400).send(req.body);
            } else {
                if (req.body.apellidos === null || req.body.apellidos < 0) {
                    return res.status(400).send(req.body);
                } else {
                    if (parseInt(req.body.horasClase) === null || parseInt(req.body.horasClase) < 0) {
                        return res.status(400).send(req.body);
                    } else {
                        connection.query("INSERT INTO profesores (numeroEmpleado, nombres, apellidos, horasClase) VALUES ('" + [req.body.numeroEmpleado] + "', '" + [req.body.nombres] + "', '" + [req.body.apellidos] + "', " + [parseInt(req.body.horasClase)] + ");", function (error, results, fields) {
                            if (error) {
                                throw error;
                            } else if (results) {
                                let profesor = {
                                    id: parseInt(results.insertId),
                                    numeroEmpleado: parseInt(results.numeroEmpleado),
                                    nombres: req.body.nombres,
                                    apellidos: req.body.apellidos,
                                    horasClase: parseInt(results.horasClase)
                                };

                                res.status(201).send(profesor);
                            }
                        });
                    }
                }
            }
        }
    });

    router.put('/profesores/:id', (req, res) => {
        /*const profesorId = profesores.findIndex(c => c.id === parseInt(req.params.id));
        if (profesorId === -1) return res.status(404).send('Profesor no encontrado');*/

        if (parseInt(req.body.numeroEmpleado) === null || parseInt(req.body.numeroEmpleado) < 0) {
            return res.status(400).send(req.body);
        } else {
            if (req.body.nombres === null || req.body.nombres < 0) {
                return res.status(400).send(req.body);
            } else {
                if (req.body.apellidos === null || req.body.apellidos < 0) {
                    return res.status(400).send(req.body);
                } else {
                    if (parseInt(req.body.horasClase) === null || parseInt(req.body.horasClase) < 0) {
                        return res.status(400).send(req.body);
                    } else {
                        connection.query("UPDATE profesores SET numeroEmpleado = '" + [req.body.numeroEmpleado] + "', nombres = '" + [req.body.nombres] + "', apellidos = '" + [req.body.apellidos] + "', horasClase = " + [parseInt(req.body.horasClase)] + " WHERE id = " + [parseInt(req.params.id)] + ";", function (error, results, fields) {
                            if (error) {
                                throw res.status(404).send('Profesor no encontrado' + error);
                            } else if (results) {

                                //res.status(200).send(alumnos);
                                res.status(200).send(results);
                            }
                        });
                        /*profesores[profesorId].numeroEmpleado = parseInt(req.body.numeroEmpleado);
                        profesores[profesorId].nombres = req.body.nombres;
                        profesores[profesorId].apellidos = req.body.apellidos;
                        profesores[profesorId].horasClase = parseInt(req.body.horasClase);

                        res.status(200).send(profesores);*/
                    }
                }
            }
        }
    });

    router.delete('/profesores/:id', (req, res) => {
        connection.query("DELETE FROM profesores WHERE id = " + [parseInt(req.params.id)] + ";", function (error, results, fields) {
            if (error) {
                throw error;
            } else if (results) {
                if (parseInt(results.affectedRows) < 1) return res.status(404).send('Profesor no encontrado');

                res.status(200).send(results);
            }
        });
    });

    router.get('*', (req, res) => {
        res.status(404).send('Ruta erronea...');
    });

    router.delete('*', (req, res) => {
        return res.status(405).send('Método no aprobado...');
    });

    return router;
}