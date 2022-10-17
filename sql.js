// postgresql
import postgresql from 'pg'

const sqlQuery = async (SQL_QUERY) => {
    const connection = new postgresql.Pool({
        user: process.env.PGUSER,
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        password: process.env.PGPASSWORD,
        port: process.env.PGPORT,
    })

    const response = connection.query(SQL_QUERY)
    connection.end()
    return response
}

export default sqlQuery
