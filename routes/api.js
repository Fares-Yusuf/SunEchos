const express = require("express");
const router = express.Router();
const axios = require("axios");

// Example endpoint to simulate solar energy fluctuation
router.get("/solar-effect", (req, res) => {
    const temperatureChange = req.query.temp || 1; // Default to 1°C change
    const wildfireRisk = calculateWildfireRisk(temperatureChange);
    const airQuality = calculateAirQuality(wildfireRisk);
    const healthImpact = calculateHealthImpact(airQuality);

    res.json({
        temperatureChange: `${temperatureChange}°C`,
        wildfireRisk,
        airQuality,
        healthImpact,
    });
});

// Simulate wildfire risk calculation based on temperature increase
function calculateWildfireRisk(tempChange) {
    if (tempChange >= 4) return "High";
    if (tempChange >= 2) return "Medium";
    return "Low";
}

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

// Air Quality Degradation Route
router.post("/air-quality", async (req, res) => {
    try {
        const { wildfireRiskPercentage, lat, lon } = req.body;

        // Fetch air quality data (current state)
        const airQualityResponse = await axios.get(
            `https://api.meteomatics.com/2024-10-05T00:00:00Z/air_quality_pm2p5:idx/${lat},${lon}/json`,
            {
                auth: {
                    username: process.env.METEOMATICS_USERNAME,
                    password: process.env.METEOMATICS_PASSWORD,
                },
            }
        );

        let airQuality = airQualityResponse.data;

        // Simulate the effect of wildfire risk on air quality (if percentage > 0)
        if (wildfireRiskPercentage > 0) {
            const riskFactor = wildfireRiskPercentage / 100; // Calculate a factor based on wildfire risk percentage
            airQuality = airQuality * (1 + riskFactor); // Worsen air quality by risk factor
        }

        res.json({
            success: true,
            airQuality: airQuality,
            wildfireRiskPercentage: wildfireRiskPercentage,
        });
    } catch (error) {
        console.error("Error fetching air quality data:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve air quality data",
        });
    }
});

module.exports = router;
