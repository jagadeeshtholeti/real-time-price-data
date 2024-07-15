## Real-Time Price Tracker
--------------------------
This project is a mini-website designed to collect and display real-time price data for stocks or cryptocurrencies. It consists of a backend built with Express, TypeScript, and MongoDB for data storage, and a frontend developed using React, and Redux for state management.

## Features
-------------

- Polls real-time data from selected stocks or cryptocurrencies using a free API (e.g.,twelvedata , CoinGecko).
- Stores data in MongoDB for persistent storage.
- Displays the most recent 20 real-time data entries in a dynamic table on the frontend.
- Updates table values in real-time as new data arrives.
- Allows users to change the selected stock or cryptocurrency via a modal/popup.

## Technologies Used
----------------------

 - Backend:
      - Express.js: Web framework for Node.js
      - TypeScript: Strict syntactical superset of JavaScript
      - MongoDB: NoSQL database for data storage
      - Node.js: JavaScript runtime environment

- Frontend:
    - React: JavaScript library for building user interfaces
    - Redux: State management library for managing application state

## Installation
-----------------

  # Prerequisites

  - Node.js (v14 or higher)
  - MongoDB (installed and running)

  # Clone the Repository

    git clone <repository-url>
    cd real-time-price-tracker

  # Install Dependencies
  
      npm install

## Set Up Environment Variables
-------------------------------

Create a `config.env` file in the root directory and add the following environment variables:

      NODE_ENV=development
      PORT=8080
      API_KEY=<your-api-key>
      MONGODB_URI=<your-mongoDB-connectionString>

  Replace `<your-api-key>` with your API key for the selected API service.
  Replace '<your-mongoDB-connectionString>' with you mongoDB connection string for mongo db server connection

## Run the Application
-----------------------

  # Backend (Express) :

        npm run build
        npm run server

  # Frontend (React) :

        npm run client

        Open [http://localhost:3000](http://localhost:3000) to view the frontend in the browser.

## Folder Structure
---------------------

    real-time-price-tracker/
    ├── client/              # Frontend React application
    │   ├── public/
    │   └── src/
    └── server/              # Backend Express application
        ├── dist/            # Compiled TypeScript files
        └── src/             # Source TypeScript files


## Testing
--------------
  To test the application locally, ensure that both the backend and frontend servers are running simultaneously. Make sure MongoDB is running and accessible.

## License
-----------
  This project is licensed under the ISC License. See the LICENSE file for more details.


### Notes:
---------
  - Make sure to replace `<repository-url>` in the clone command with the actual URL of your GitHub repository.
  - Adjust the port numbers and API endpoints according to your configuration.
  - Include any additional setup or configuration instructions specific to your chosen API service.
