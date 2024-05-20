## Installation 
This project uses concurrently to run both backend and frontend servers simultaneously. 

- Run `npm install` in the root directory to install the root dependencies.

- Navigate to the `frontend` directory and install the dependencies by running these commands from the root directory:
    ```bash
    cd frontend
    npm install
    ```
- Navigate to the `backend` directory and install the dependencies by running these commands from the root directory:
    ```bash
    cd backend
    npm install
    ```

## Set up the environment variables
- Create a `.env` file in the root directory of the project.
- Add your Fingerprint Pro API key and PostgreSQL connection details to the `.env` file:
    ```txt
        SECRET_API_KEY=your-fingerprint-pro-api-key
        DATABASE_URL=postgresql://username:password@localhost:5432/your-database-name
    ```

## Set up the PostgreSQL database
- Create a new PostgreSQL database.
- Create the `users` table with the following SQL command:
    ```sql
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        username VARCHAR(255) NOT NULL,
        fingerprint VARCHAR(255)
    );
    ```

## Run the development server
- To start the project dev server, run this command:
    ```bash
    npm run start
    ```
- To start only the frontend dev server, run this command:
    ```bash
    npm run frontend
    ```
- To start only the backend server, run this command:
    ```bash
    npm run backend
    ```

## Access the application
- Open your browser and navigate to `http://localhost:8080/register` to register a new user.
- Navigate to `http://localhost:8080/login` to log in with the registered user.

