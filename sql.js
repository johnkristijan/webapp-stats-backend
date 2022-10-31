// postgresql
import postgresql from 'pg'

const pool = new postgresql.Pool({
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
})

const sqlQuery = async (SQL_QUERY) => {
    try {
        const res = await pool.query(SQL_QUERY)
        return res
    } catch (error) {
        console.error(error)
        return null
    }
}

export default sqlQuery
