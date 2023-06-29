const express = require('express')
const bcrypt = require('bcrypt')
const tokenVerify = require('../middlewares/tokenVerify')
const connection = require('../../database/database')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const app = express()

const key = process.env.SECRET_KEY

//traer usuarios
app.get('/user/', tokenVerify, async (req, res) => {
    try {  
        const query = await connection.query(`SELECT * FROM user`)
        if(query){
            res.status(200).json({
                ok: true,
                message: query[0]
            })
        }
    } catch (error) {
        console.error(error)
    }
});

//traer info de usuario
app.get('/userInfo/', tokenVerify, async (req, res) => {
    try {  
        let {id} = req.user
        const query = await connection.query(`SELECT * FROM user WHERE id=${id}`)
        if(query[0].length === 0){
            res.status(400).json({
                ok: false,
                message: 'Not Found'
            })
        }
        else {
            res.status(200).json({
                ok: true,
                data: query[0]
            })
        }

    } catch (error) {
        console.error(error)
    }

});

//crear usuarios
app.post('/user', async (req, res) => {
    let {name, lastname, email, password, age, job} = req.body;
    let hash = await bcrypt.hash(password, 11)
    await connection.query(`INSERT INTO user (name, lastname, age, job, email, password) VALUES (?, ?, ?, ?, ?, ?)`,[name, lastname, age, job, email, hash])
    res.status(200).json({
        ok: true,
        data: {
            name,
            lastname,
            email,
            password: hash,
            age,
            job
        }
    })
    
});

// login usuario
app.post('/user/login', async (req, res) => {
    let {email, password} = req.body

    const query = await connection.query(`SELECT * FROM user WHERE email= ?`, [email])

    const hash = query[0][0].password

    bcrypt.compare(password, hash, (err, result) => {
        if(result) {
            const {id, name, lastname, email} = query[0][0]
            const payload = {
                id,
                name,
                lastname,
                email
            }
            const token = jwt.sign(payload, key)

            res.status(200).json({
                token
            })
        } else {
            res.status(401).json({
                message: 'contraseña incorrecta'
            })
        }
    })
})

// actualizar usuarios
app.put('/user/:id', async (req, res) => {
    let id = req.params.id;
    let {name, lastname} = req.body;
    await connection.query(`UPDATE user SET name = ?, lastname = ? WHERE id = ?`, [name, lastname, id])
    res.status.apply(200).json({
        ok: true,
        message: `User with id: ${id} updated`
    })
});

//borrar usuarios
app.delete('/user/:id', async (req, res) => {
    let id = req.params.id;
    await connection.query(`DELETE FROM user WHERE id = ${id}`)
    res.status(200).json({
        ok: true,
        message: `User with id: ${id}, deleted`
    })

})

module.exports = app