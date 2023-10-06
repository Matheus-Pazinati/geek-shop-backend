import postgres from 'postgres'
import 'dotenv/config'

const { DATABASE_URL, TEST_DATABASE_URL } = process.env

const sql = process.env.NODE_ENV == "test" ? postgres(TEST_DATABASE_URL!) : postgres(DATABASE_URL!)

export default sql