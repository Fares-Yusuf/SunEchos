// swiper js (testimonial section)
const swiper = new Swiper(".swiper", {
    scrollbar: {
        el: ".swiper-scrollbar",
        draggable: true,
    },
});

const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");
const menu = document.querySelector("nav .container ul");

// show menu
menuBtn.addEventListener("click", () => {
    menu.style.display = "block";
    menuBtn.style.display = "none";
    closeBtn.style.display = "inline-block";
});

// hide menu
closeBtn.addEventListener("click", () => {
    menu.style.display = "none";
    menuBtn.style.display = "inline-block";
    closeBtn.style.display = "none";
});

const navItems = menu.querySelectorAll("li");

// remove active class from nav items
const changeActiveItem = () => {
    navItems.forEach((item) => {
        const link = item.querySelector("a");
        link.classList.remove("active");
    });
};

// add active class to clicked nav item
navItems.forEach((item) => {
    const link = item.querySelector("a");
    link.addEventListener("click", () => {
        changeActiveItem();
        link.classList.add("active");
    });
});

// // read more about
// const readMoreBtn = document.querySelector(".read-more");
// const readMoreContent = document.querySelector(".read-more-content");

// readMoreBtn.addEventListener("click", () => {
//     readMoreContent.classList.toggle("show-content");
//     if (readMoreContent.classList.contains("show-content")) {
//         readMoreBtn.textContent = "Show less";
//     } else {
//         readMoreBtn.textContent = "Show more";
//     }
// });

// show/hide skills items
const skillItems = document.querySelectorAll("section.skills .skill");

skillItems.forEach((skill) => {
    skill.querySelector(".head").addEventListener("click", () => {
        skill.querySelector(".items").classList.toggle("show-items");
    });
});

// add box shadow on scroll
window.addEventListener("scroll", () => {
    document
        .querySelector("nav")
        .classList.toggle("show-box-shadow", window.scrollY > 0);
});

// =================== New Butterfly Effect Feature ====================

// Select slider and display elements
const slider = document.getElementById("temperature-slider");
const temperatureValue = document.getElementById("temperature-value");
const effectResults = document.getElementById("effect-results");

// Listen for slider changes and fetch data from the API
slider.addEventListener("input", async function () {
    const tempChange = slider.value;
    temperatureValue.textContent = `${tempChange}°C`;
    if (tempChange === "0") {
        effectResults.innerHTML = "";
        return;
    }
    // Fetch ripple effect data from the API
    try {
        const response = await fetch(`/api/solar-effect?temp=${tempChange}`);
        const data = await response.json();

        // Update the effect results with the API response
        effectResults.innerHTML = `
      <h3>Ripple Effects:</h3>
      <ul>
        <li><strong>Temperature Change:</strong> ${data.temperatureChange}</li>
        <li><strong>Wildfire Risk:</strong> ${data.wildfireRisk}</li>
        <li><strong>Air Quality:</strong> ${data.airQuality}</li>
        <li><strong>Health Impact:</strong> ${data.healthImpact}</li>
      </ul>
    `;
    } catch (error) {
        console.error("Error fetching data:", error);
        effectResults.innerHTML = "<p>Failed to load ripple effects.</p>";
    }
});
// Initialize the map
const map = L.map("map").setView([26.2235, 50.5876], 10); // Default to Manama, Bahrain

// Add tile layer to the map (OpenStreetMap)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
}).addTo(map);

let marker; // To store the clicked location marker

// Listen for map clicks
map.on("click", function (e) {
    const lat = e.latlng.lat;
    const lon = e.latlng.lng;

    // Update the hidden form fields
    document.getElementById("latitude").value = lat;
    document.getElementById("longitude").value = lon;

    // Add or move marker to the clicked location
    if (marker) {
        marker.setLatLng(e.latlng);
    } else {
        marker = L.marker(e.latlng).addTo(map);
    }
});
// Update the displayed value when the slider changes
const wildfireSlider = document.getElementById("wildfire-percentage");
const wildfireValue = document.getElementById("wildfire-value");

wildfireSlider.addEventListener("input", function () {
    wildfireValue.textContent = `${wildfireSlider.value}%`;
});
let currentAirQuality = null; // To store the current air quality (before change)
let simulatedAirQuality = null; // To store the simulated air quality (after change)

// Handle form submission
document
    .getElementById("locationForm")
    .addEventListener("submit", async function (e) {
        e.preventDefault();

        const lat = document.getElementById("latitude").value;
        const lon = document.getElementById("longitude").value;
        const wildfireRiskPercentage = document.getElementById(
            "wildfire-percentage"
        ).value; // Get the wildfire percentage

        // Fetch air quality data from the backend
        try {
            const response = await fetch("/api/air-quality", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    lat: lat,
                    lon: lon,
                    wildfireRiskPercentage: wildfireRiskPercentage, // Send the entered wildfire risk percentage
                }),
            });

            const data = await response.json();

            // Extract the current and simulated air quality values
            const currentAirQuality = data.currentAirQuality;
            const simulatedAirQuality = data.simulatedAirQuality;

            // Step 3: Display both before and after values
            document.getElementById("locationResult").innerHTML = `
            <h3>Air Quality Data:</h3>
            <ul>
                <li><strong>Latitude:</strong> ${lat}</li>
                <li><strong>Longitude:</strong> ${lon}</li>
                <li><strong>Current Air Quality (Before):</strong> ${currentAirQuality}</li>
                <li><strong>Simulated Air Quality (After):</strong> ${simulatedAirQuality}</li>
            </ul>
        `;
        } catch (error) {
            console.error("Error fetching data:", error);
            document.getElementById("locationResult").innerHTML =
                "<p>Failed to fetch air quality data.</p>";
        }
    });
