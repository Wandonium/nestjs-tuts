# NestJS Authentication with Drizzle ORM

This is a NestJS project that implements a complete authentication system using Drizzle ORM and PostgreSQL. It includes password-based authentication, social logins (Google and Facebook), and JWT-based token generation.

## Features

-   **Password-based Authentication:** Register and log in with email and password.
-   **Social Logins:** Authenticate with Google and Facebook.
-   **JWT Authentication:** Secure your endpoints with JSON Web Tokens.
-   **Drizzle ORM:** A modern TypeScript ORM for PostgreSQL.
-   **Role-based Access Control (RBAC):** A simple role system with `USER` and `ADMIN` roles.
-   **Configuration Management:** Manage your environment variables with `@nestjs/config`.
-   **Database Migrations:** Use Drizzle Kit to manage your database schema.

## Prerequisites

-   [Node.js](https://nodejs.org/en/) (v16 or later)
-   [npm](https://www.npmjs.com/)
-   [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)

## Installation

1.  **Clone the repository (or download the files):**
    ```bash
    # This project was created manually. If you have the files, you can skip this step.
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Database Setup

1.  **Start the PostgreSQL database:**
    ```bash
    docker-compose up -d
    ```

2.  **Create and configure the `.env` file:**
    There is an `.env.example` file in the root of the project. Copy it to `.env` and fill in the required values.
    ```bash
    cp .env.example .env
    ```
    You will need to provide your own credentials for Google and Facebook OAuth.

3.  **Run database migrations:**
    This will create the `users` table in your database.
    ```bash
    npm run db:generate
    npm run db:migrate
    ```

## Running the App

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

The application will be running on `http://localhost:3000`.

## API Endpoints

-   `POST /auth/register`: Register a new user with email and password.
-   `POST /auth/login`: Log in with email and password to get a JWT.
-   `GET /auth/profile`: A protected route to get the user's profile. Requires a valid JWT.
-   `GET /auth/google`: Initiates the Google OAuth2 login flow.
-   `GET /auth/google/callback`: The callback URL for Google OAuth2.
-   `GET /auth/facebook`: Initiates the Facebook login flow.
-   `GET /auth/facebook/callback`: The callback URL for Facebook.

## Environment Variables

The following environment variables are required. You can find them in the `.env` file.

-   `DATABASE_URL`: The connection string for your PostgreSQL database.
-   `JWT_SECRET`: A secret key for signing JWTs.
-   `JWT_REFRESH_SECRET`: A secret key for signing refresh tokens.
-   `GOOGLE_CLIENT_ID`: Your Google OAuth2 client ID.
-   `GOOGLE_CLIENT_SECRET`: Your Google OAuth2 client secret.
-   `GOOGLE_CALLBACK_URL`: The callback URL for Google OAuth2.
-   `FACEBOOK_APP_ID`: Your Facebook app ID.
-   `FACEBOOK_APP_SECRET`: Your Facebook app secret.
-   `FACEBOOK_CALLBACK_URL`: The callback URL for Facebook.
