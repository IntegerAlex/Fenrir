import database from './main';

export async function createDatabase() {
  const dbName = process.env.PG_DATABASE;
  const query = `CREATE DATABASE ${dbName};`;

  try {
    await database.dbQuery(query);
    console.log(`Database '${dbName}' created successfully.`);
  } catch (error) {
    console.error('Error creating database:', error);
  }
}

export async function createTableDeployments() {
  try {
    await database.dbQuery(`
            CREATE TABLE IF NOT EXISTS deployments (
		    project_name VARCHAR(255) NOT NULL,
                id SERIAL PRIMARY KEY,
                container_id VARCHAR(255) NOT NULL,
                user_name VARCHAR(255) NOT NULL,
                time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status VARCHAR(255) NOT NULL
            );
        `);
    console.log("Table 'deployments' created or already exists.");
  } catch (error) {
    console.error('Error creating table:', error);
  }
}
