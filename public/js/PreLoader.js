document.addEventListener("DOMContentLoaded", () => {
    const PreLoaderGreetings = [
        "Qastra's journey began on April 8, 2025 🚀",
        "Developed by Puneet Kumar 💻",
        "One Question Closer to Clarity 🔍",
        "Born from curiosity 🌱",
        "Fueling clarity ✨",
        "Crafted for seekers 🎯",
        "Where questions meet their purpose 🧠",
        "Simplifying the complex 🔐"
    ];

    const loaderText = document.getElementById("loader-text");
    const preloader = document.getElementById("preloader");
    const progressBar = document.getElementById("progress-bar");

    if (loaderText) {
        loaderText.textContent = PreLoaderGreetings[Math.floor(Math.random() * PreLoaderGreetings.length)];
    }

    const mediaElements = [...document.images, ...document.querySelectorAll("video")];
    let loaded = 0;
    const total = mediaElements.length;

    // Fallback timeout
    const fallbackTimeout = setTimeout(() => {
        hidePreloader();
    }, 8000);

    // Function to hide preloader
    function hidePreloader() {
        if (preloader) {
            preloader.style.display = "none";
        }
    }
    // Interval to check progress width
    let progressCheckInterval = setInterval(() => {
        const progressWidth = progressBar ? parseInt(progressBar.style.width) : 0;

        if (progressWidth >= 100) {
            clearInterval(progressCheckInterval);
            setTimeout(hidePreloader, 300);
        }
    }, 100);
    // Function to update progress
    function updateProgress() {
        loaded++;
        const percent = Math.round((loaded / total) * 100);
        if (progressBar) progressBar.style.width = `${percent}%`;

        if (percent >= 100) {
            clearInterval(progressCheckInterval);
            setTimeout(hidePreloader, 300);
        }
    }

    // Force progress to 100% if no media elements
    if (total === 0) {
        if (progressBar) progressBar.style.width = "100%";
        hidePreloader();
    } else {
        // Track loading status of each element
        mediaElements.forEach((el) => {
            const isLoaded = (el.tagName === "IMG" && el.complete) ||
                (el.tagName === "VIDEO" && el.readyState >= 3);

            if (isLoaded) {
                updateProgress();
            } else {
                el.addEventListener("load", updateProgress);
                el.addEventListener("error", updateProgress);
            }
        });
    }

    window.addEventListener("load", () => {
        if (loaded === total) {
            hidePreloader();
        }
    });
});
