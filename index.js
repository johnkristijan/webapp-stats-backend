import sqlQuery from './sql.js'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { v4 } from 'uuid'

const app = express()
app.use(
    cors({
        origin: '*',
    })
)
app.use(express.json())
const port = process.env.PORT || 80
dotenv.config()
app.get('/', (req, res) => {
    res.send('Server is running - version ' + process.env.npm_package_version)
})

app.post('/webapp-stats', async (req, res) => {
    try {
        const statList = req.body // <<< list of entries

        let SQL_VALUES = []
        for (const x of statList) {
            SQL_VALUES.push(
                `('${x.app_id}', '${x.from_path}', '${x.to_path}', '${x.screen_height}', '${x.screen_width}', '${x.user}', '${x.timestamp}')`
            )
        }
        const VALUES = SQL_VALUES.join(',')
        const SQL_QUERY = {
            query: `INSERT INTO stats (app_id, from_path, to_path, screen_height, screen_width, username, timestamp) VALUES ($1, $2, $3, $4, $5, $6, $7);`,
            values: VALUES,
        }

        const raw = await sqlQuery(SQL_QUERY)
        if (raw && raw.rowCount && raw.rowCount > 0) {
            res.status(200).send('OK')
        } else {
            res.status(400).send('[Error 003] Could not register stats.')
        }
    } catch (e) {
        console.warn(e.message)
        res.status(400).send('[Error 004] Could not register stats.')
    }
})

app.get('/get-stats', async (req, res) => {
    try {
        const appId = req.query.app_id
        if (!appId) {
            res.status(400).send('[Error 005] Could not get stats.')
        }
        const SQL_QUERY = {
            query: `SELECT * FROM stats WHERE app_id = $1;`,
            values: [appId],
        }
        const raw = await sqlQuery(SQL_QUERY)
        res.status(200).send(raw.rows)
    } catch (e) {
        console.warn(e.message)
        res.status(400).send('[Error 006] Could not get stats.')
    }
})

app.post('/register', async (req, res) => {
    const appId = v4()
    const appName = req.query.app_name
    const appContact = req.query.app_contact
    const SQL_QUERY = {
        query: `INSERT INTO apps (app_id, app_name, app_contact) VALUES ($1, $2, $3);`,
        values: [appId, appName, appContact],
    }
    const raw = await sqlQuery(SQL_QUERY)
    try {
        const rowCount = raw.rowCount
        if (rowCount === 1) {
            res.status(201).send(appId)
        } else {
            res.status(400).send('[Error 001] Could not register app.')
        }
    } catch (e) {
        console.warn(e.message)
        res.status(400).send('[Error 002] Could not register app.')
    }
})

app.listen(port, () => {
    console.log(` >>> webapp-stats-backend running on port ${port}`)
})
