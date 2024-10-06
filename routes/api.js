const express = require("express");
const router = express.Router();
const axios = require("axios");

// Example endpoint to simulate solar energy fluctuation
router.get("/solar-effect", (req, res) => {
    const temperatureChange = req.query.temp || 1; // Default to 1°C change
    const wildfireRisk = calculateWildfireRisk(temperatureChange);
    const airQuality = calculateAirQuality(wildfireRisk);
    const healthImpact = calculateHealthImpact(airQuality);
    let img = "";
    console.log(img);
    if (temperatureChange > "0") {
        if (temperatureChange >= 1 && temperatureChange < 2) {
            img =
                "https://images.theconversation.com/files/603133/original/file-20240626-19-edcvz.jpg?ixlib=rb-4.1.0&q=20&auto=format&w=320&fit=clip&dpr=2&usm=12&cs=strip";
        }
        if (temperatureChange >= 2 && temperatureChange <= 4) {
            img =
                "https://insideclimatenews.org/wp-content/uploads/2023/03/wildfire_thibaud-mortiz-afp-getty-scaled.jpg";
        }
        if (temperatureChange == 5) {
            img =
                "https://static01.nyt.com/images/2021/07/15/climate/00CLI-WILDFIRES-explainer1/merlin_190627818_41f0a3e1-8f27-41b2-a040-26d54c996e9b-superJumbo.jpg";
        }
    }
    res.json({
        temperatureChange: `${temperatureChange}°C`,
        wildfireRisk,
        airQuality,
        healthImpact,
        img,
    });
});
// Simulate air quality deterioration based on wildfire risk
function calculateAirQuality(wildfireRisk) {
    if (wildfireRisk === "High") return "Poor";
    if (wildfireRisk === "Medium") return "Moderate";
    return "Good";
}

// Simulate health impact based on air quality
function calculateHealthImpact(airQuality) {
    if (airQuality === "Poor") return "Respiratory issues likely";
    if (airQuality === "Moderate") return "Some discomfort";
    return "Minimal impact";
}
// Simulate wildfire risk calculation based on temperature increase
function calculateWildfireRisk(tempChange) {
    if (tempChange >= 4) return "High";
    if (tempChange >= 2) return "Medium";
    return "Low";
}

// Air Quality Degradation Route
router.post("/air-quality", async (req, res) => {
    try {
        // Extract wildfire risk percentage, latitude, and longitude from the request body
        const { wildfireRiskPercentage, lat, lon } = req.body;
        console.log("Wildfire Risk Percentage:", wildfireRiskPercentage);
        console.log("Latitude:", lat);
        console.log("Longitude:", lon);

        // Get the current system time in ISO 8601 format to use in the API request
        const currentDateTime = new Date().toISOString();

        // Fetch the current air quality data from the Meteomatics API using the current date and time
        // This helps us get the most recent PM2.5 levels for the specified location
        const airQualityResponse = await axios.get(
            `https://api.meteomatics.com/${currentDateTime}/air_quality_pm2p5:idx/${lat},${lon}/json`,
            {
                auth: {
                    username: process.env.METEOMATICS_USERNAME,
                    password: process.env.METEOMATICS_PASSWORD,
                },
            }
        );

        // Log the entire air quality response for debugging and clarity
        let airQuality = airQualityResponse.data;
        console.log(
            "The air Quality Full Response:",
            JSON.stringify(airQuality, null, 2)
        );

        // Extract the first air quality value from the response
        // This value represents the current PM2.5 level before applying any wildfire risk adjustments
        let currentAirQualityValue =
            airQuality.data[0].coordinates[0].dates[0].value;
        console.log(
            "Current Air Quality Value (Before):",
            currentAirQualityValue
        );

        // Initialize the simulated air quality value with the current air quality value
        let simulatedAirQualityValue = currentAirQualityValue;

        // If there is a wildfire risk percentage provided, calculate the impact on PM2.5 levels
        if (wildfireRiskPercentage > 0) {
            // Calculate the increase in PM2.5 using the square of the wildfire risk percentage
            // This assumes a quadratic relationship between wildfire risk and PM2.5 increase
            let deltaPM25 = Math.pow(wildfireRiskPercentage, 2);

            // Calculate the new PM2.5 level by applying the calculated increase to the current value
            // The formula used is: new PM2.5 = current PM2.5 * (1 + deltaPM25 / 100)
            simulatedAirQualityValue =
                currentAirQualityValue * (1 + deltaPM25 / 100);
        }

        // Send both the current air quality value (before simulation) and the simulated air quality value (after applying wildfire risk) back to the client
        res.json({
            currentAirQuality: currentAirQualityValue, // The current PM2.5 level before any adjustments
            simulatedAirQuality: simulatedAirQualityValue, // The PM2.5 level after considering the wildfire risk
        });
    } catch (error) {
        // Log any errors that occur during the process and send a failure response to the client
        console.error("Error fetching air quality data:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve air quality data",
        });
    }
});

module.exports = router;
