const express = require('express')
const tokenVerify = require('../middlewares/tokenVerify')
const connection = require('../../database/database')

const app = express()


//crear tarea
app.post('/task', tokenVerify, async (req, res) => {
    let {name, description, checked} = req.body;
    let {id} = req.user
    await connection.query(`INSERT INTO tasks (name, description, checked, user_id) VALUES (?, ?, ?, ?)`,[name, description, checked, id])
    res.status(200).json({
        ok: true,
        data: {
            name,
            description,
            checked,
            user_id: id
        }
    })
    
});

//ver tarea
app.get('/seeTask', async (req, res) => {
    try {  
        const query = await connection.query(`SELECT * FROM tasks`)
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

// actualizar tarea
app.put('/task/:id', tokenVerify, async (req, res) => {
    let id = req.params.id;
    let {name, description} = req.body;
    await connection.query(`UPDATE tasks SET name = ?, description = ? WHERE id = ?`, [name, description, id])
    res.status.apply(200).json({
        ok: true,
        message: `Task with id: ${id} updated`
    })
});

//borrar tarea
app.delete('/task/:id', tokenVerify, async (req, res) => {
    let id = req.params.id;
    await connection.query(`DELETE FROM tasks WHERE id = ${id}`)
    res.status(200).json({
        ok: true,
        message: `task with id: ${id}, deleted`
    })
})

module.exports = app