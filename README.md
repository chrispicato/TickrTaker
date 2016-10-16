# TickrTaker
Tickr: time-sensitive auctions

## Team

  - __Development Team Members__: Alexander, Cihan, Kunal, Leonard, Akai, Chris, Danny, Wendy

## Table of Contents

- [Usage](#Usage)
- [Development](#Development)
- [Deployment](#Deployment)


## Usage 

Go to [Facebook's developer page](https://developers.facebook.com)

Create an app that enables 'Facebook Login'

Allow the following OAuth redirect URIS: 
  -<http://localhost:3000>, <http://localhost:3000/signin-facebook>, <http://localhost:3000/auth/facebook/callback>, <http://localhost:3000/auth/facebook>
  
  -You will need to allow redirects to the URIS in production for deployment as well.

Clone the repo to your local machine.

Use a current version of node (v6.5.0).

Run `npm install` in the `/app` folder.
Run `npm install` in the `/server` folder.

- Install Postgres on your computer. 
  - Enter Postgres terminal and run the following commands:
    - `CREATE USER ubuntu WTIH PASSWORD 'password';`
    - `ALTER USER ubuntu WITH SUPERUSER;`
    - `CREATE DATABASE tickr;`

Install Grunt CLI globally using: `npm install -g grunt-cli`.

- Development: 
  - In the /server folder:
    - Run `grunt dev`
  - In the /app folder:
    - Run `grunt start`
  - Browser should automatically navigate to `http://localhost:3000`

- Production:
  - In the `/server` folder:
    - Run `grunt prod`
  - In the `/app` folder:
    - Run `grunt build`
      - This compiles the necessary files into the /compiled folder
  - Open a new browser window and navigate to `http://localhost:3000`

The development setup should be used on your local machine.

The production setup should be used on your deployed server.

## Development

Dependencies:
Node (and package.json node modules)
Grunt-CLI
React
Webpack
Postgresql
Cloudinary
Nodemailer
Facebook Auth

Getting Started: 

- App
  - Start the development server and familiarize yourself with the flow of data throughout the app using React Devtools to view the state of each component.
- Server
  - Key routes are stored in `/server/app.js` and `/server/routes.js`

## Deployment

Clone your deployed folder onto the server, and run the production setup to be served on the port of your choice.

## Roadmap

- Modularized tests
- Use join tables for database tables
- Query optimization
- Search filtering
- Product categories
- Integrated payment system
