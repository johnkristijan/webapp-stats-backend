import functions from '@google-cloud/functions-framework';
import sqlQuery from './sql.js'
import { v4 } from 'uuid'

functions.http('endpoint', async (req, res) => {

    res.set('Access-Control-Allow-Origin', '*');

    // app.set('trust proxy', 'loopback, linklocal, uniquelocal')

    if (req.method === 'OPTIONS') {
        // Send response to OPTIONS requests
        res.set('Access-Control-Allow-Methods', 'GET, POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('');
    } else {

        // check if type is provided
        if (!req.query.type) {
            res.status(400).send('[Error 000] Bad request.')
        }

        if (req.query.type === 'get-stats') {
            // get-stats
            getStats(req, res);

        } else if (req.query.type === 'webapp-stats') {
            // webapp stats
            webappStats(req, res);

        } else if (req.query.type === 'app-list') {
            // app-list
            appList(req, res);

        } else if (req.query.type === 'register') {
            // register new app
            register(req, res);

        } else {
            // if no supported type is provided
            res.status(400).send('[Error 999] Bad request.')
        }
    }
});

// get stats query
const getStats = async (req, res) => {
    console.info('>>> getStats api triggered <<<')
    const appId = req.query.app_id
    if (!appId) {
        res.status(400).send('[Error 001] Could not get stats.')
    }

    try {
        const QUERY = `SELECT * FROM stats WHERE app_id='${appId}';`
        const raw = await sqlQuery(QUERY)
        res.status(200).send(raw.rows)
    } catch (e) {
        console.warn(e.message)
        res.status(400).send('[Error 002] Could not get stats.')
    }
}

// webapp stats query
const webappStats = async (req, res) => {
    console.info('>>> webappStats api triggered <<<')

    try {

        let ipAddress = 'unknown'

        const forwardedHeader = req.headers.forwarded
        if (forwardedHeader) {
            // forwardedHeader example => for="109.108.216.147";proto=https
            const splitHeader = forwardedHeader.split('"')
            if (splitHeader && splitHeader.length > 1) {
                ipAddress = splitHeader[1]
            } else {
                ipAddress = forwardedHeader
            }
        }

        const statList = req.body // <<< list of entries
        let SQL_VALUES = []
        for (const x of statList) {
            SQL_VALUES.push(`('${x.app_id}', '${x.from_path}', '${x.to_path}', '${x.screen_height}', '${x.screen_width}', '${x.user}', '${x.timestamp}', '${ipAddress}')`)
        }

        const VALUES = SQL_VALUES.join(',')

        const FIELDS = 'app_id, from_path, to_path, screen_height, screen_width, username, timestamp, ip_address'

        const SQL_QUERY = `INSERT INTO stats (${FIELDS}) VALUES ${VALUES};`
        console.log(SQL_QUERY)
        const raw = await sqlQuery(SQL_QUERY)
        if (raw.rowCount > 0) {
            res.status(200).send('OK')
        } else {
            res.status(400).send('[Error 403] Could not register stats.')
        }
    } catch (e) {
        console.warn(e.message)
        res.status(400).send('[Error 404] Could not register stats.')
    }
}

// app list query
const appList = async (req, res) => {
    console.info('>>> appList api triggered <<<')

    const secret = req.body.secret
    if (!secret) {
        res.status(400).send('[Error 101] Could not list apps.')
    }

    if (secret !== 'baiu9inhkljsdyguasbd7172kasdgas7gdkasd72kj!') {
        res.status(400).send('[Error 102] Could not list apps.')
    }

    try {
        const QUERY = `SELECT * FROM apps;`
        const raw = await sqlQuery(QUERY)
        res.status(200).send(raw.rows)
    } catch (e) {
        console.warn(e.message)
        res.status(400).send('[Error 102] Could not get stats.')
    }
}

// register query
const register = async (req, res) => {
    console.info('>>> register api triggered <<<')

    const appId = v4()
    const appName = req.query.app_name
    const appContact = req.query.app_contact
    const FIELDS = 'app_id, app_name, app_contact'
    const VALUES = `('${appId}', '${appName}', '${appContact}')`
    const QUERY = `INSERT INTO apps (${FIELDS}) VALUES ${VALUES};`
    const raw = await sqlQuery(QUERY)
    try {
        const rowCount = raw.rowCount
        if (rowCount === 1) {
            res.status(201).send(appId)
        } else {
            res.status(400).send('[Error 201] Could not register app.')
        }
    } catch (e) {
        console.warn(e.message)
        res.status(400).send('[Error 202] Could not register app.')
    }
}