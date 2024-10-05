const express = require("express");
const router = express.Router();

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

module.exports = router;
