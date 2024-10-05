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

// read more about
const readMoreBtn = document.querySelector(".read-more");
const readMoreContent = document.querySelector(".read-more-content");

readMoreBtn.addEventListener("click", () => {
    readMoreContent.classList.toggle("show-content");
    if (readMoreContent.classList.contains("show-content")) {
        readMoreBtn.textContent = "Show less";
    } else {
        readMoreBtn.textContent = "Show more";
    }
});

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
