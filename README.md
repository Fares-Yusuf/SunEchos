# Solar Effect and Air Quality API

This project simulates the impact of solar energy fluctuations on wildfire risks, air quality, and health. 
The application allows users to see how changes in temperature affect wildfire risks, air quality, and related health impacts. 
It also integrates with the Meteomatics API to fetch real-time air quality data and simulate its degradation due to wildfire risks.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 12 or higher)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/Fares-Yusuf/SunEchos.git
    ```

2. Install dependencies:

    ```bash
    npm install
    ```
    
3. Start the server:

    ```bash
    npm start
    ```

    The server will start on `http://localhost:3000`

## API Endpoints

### 1. Solar Effect Simulation

**GET** `/api/solar-effect`

Simulates the effect of temperature changes on wildfire risks, air quality, and health impacts.

- **Query Parameters**:
    - `temp` (optional): Temperature change in °C (default is 1°C).

- **Response**:

    ```json
    {
      "temperatureChange": "2°C",
      "wildfireRisk": "Medium",
      "airQuality": "Moderate",
      "healthImpact": "Some discomfort",
      "img": "URL_to_relevant_image"
    }
    ```

### 2. Air Quality Degradation Simulation

**POST** `/api/air-quality`

Fetches real-time PM2.5 air quality data and simulates its degradation based on wildfire risk.

- **Request Body**:
    - `wildfireRiskPercentage`: Wildfire risk percentage (e.g., 30).
    - `lat`: Latitude of the location.
    - `lon`: Longitude of the location.

- **Response**:

    ```json
    {
      "currentAirQuality": 15.2, // Current PM2.5 level before simulation
      "simulatedAirQuality": 21.3 // Simulated PM2.5 after wildfire risk
    }
    ```


## Dependencies

- [Express](https://expressjs.com/) - Web framework for Node.js
- [Axios](https://github.com/axios/axios) - Promise-based HTTP client for the browser and Node.js
- [dotenv](https://github.com/motdotla/dotenv) - Loads environment variables from a `.env` file
- [Cors](https://github.com/expressjs/cors) - CORS middleware for Express
