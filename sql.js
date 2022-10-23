// postgresql
import postgresql from 'pg'

const sqlQuery = async (SQL_QUERY) => {

    const connection = new postgresql.Pool({
        "host": process.env.PGHOST,
        "database": process.env.PGDATABASE,
        "port": process.env.PGPORT,
        "user": process.env.PGUSER,
        "password": process.env.PGPASSWORD
    })

    const response = connection.query(SQL_QUERY)
    connection.end()
    return response
}

export default sqlQuery
