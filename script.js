
function openApp(app) {
    const windowBox = document.getElementById("app-window");
    const title = document.getElementById("app-title");
    const content = document.getElementById("app-content");

    windowBox.style.display = "block";

    if (app === "files") {
        title.textContent = "NEXUS File Explorer";

        content.innerHTML = `
            <p>DIRECTORY: /incident/</p>
            <hr>
            <button onclick="openEvidence('incident.log')">
                📄 incident.log
            </button>
            <button onclick="openEvidence('mara_email.txt')">
                📄 mara_email.txt
            </button>
            <button onclick="openEvidence('recovery_report.txt')">
                📄 recovery_report.txt
            </button>
        `;
    } else if (app === "terminal") {
        title.textContent = "NEXUS Terminal";
        content.textContent = "System awaiting command...";
    } else if (app === "browser") {
        title.textContent = "NEXUS Browser";
        content.textContent = "Unable to connect to the internet.";
    }
}

function closeApp() {
    document.getElementById("app-window").style.display = "none";
}

function updateClock() {
    const now = new Date();
    const clock = document.getElementById("clock");

    if (clock) {
        clock.textContent = now.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        });
    }
}

updateClock();
setInterval(updateClock, 1000);

function openEvidence(filename) {
    const content = document.getElementById("app-content");

    if (filename === "incident.log") {
        content.textContent =
            "03:16:58 - Maintenance procedure initiated.\n" +
            "03:17:00 - Regional network connection lost.\n" +
            "03:17:04 - Automated safety isolation confirmed.";

    } else if (filename === "mara_email.txt") {
        content.textContent =
            "FROM: Mara Chen\n" +
            "SUBJECT: Do not trust the recovery report\n\n" +
            "The system says the network is healthy, " +
            "but regional nodes disagree.\n\n" +
            "Check the maintenance logs before restoring anything.";

    } else if (filename === "recovery_report.txt") {
        content.textContent =
            "NEXUS RECOVERY REPORT\n\n" +
            "All systems operational.\n" +
            "No configuration errors detected.\n\n" +
            "WARNING: Report verification incomplete.";
    }

    content.style.whiteSpace = "pre-line";
}

// Window dragging
const appWindow = document.getElementById("app-window");
const titleBar = document.querySelector(".window-titlebar");

let isDragging = false;
let offsetX = 0;
let offsetY = 0;

if (appWindow && titleBar) {
    titleBar.addEventListener("mousedown", function (event) {
        // Don't drag when clicking the close button.
        if (event.target.closest(".close-button")) {
            return;
        }

        isDragging = true;

        const rect = appWindow.getBoundingClientRect();

        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;

        // Remove centering so mouse movement works correctly.
        appWindow.style.transform = "none";
        appWindow.style.left = rect.left + "px";
        appWindow.style.top = rect.top + "px";
    });

    document.addEventListener("mousemove", function (event) {
        if (!isDragging) {
            return;
        }

        appWindow.style.left =
            (event.clientX - offsetX) + "px";

        appWindow.style.top =
            (event.clientY - offsetY) + "px";
    });

    document.addEventListener("mouseup", function () {
        isDragging = false;
    });

    // Also stop dragging if the mouse leaves the browser window.
    document.addEventListener("mouseleave", function () {
        isDragging = false;
    });
}
