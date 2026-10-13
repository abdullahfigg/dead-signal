function openApp(app){
    const windowBox = document.getElementById("app-window");
    const title = document.getElementById("app-title");
    const content = document.getElementById("app-content");
    
    windowBox.style.display="block";

    if (app === "files") {
        title.textContent = "NEXUS File Explorer";
        content.innerHTML = `
        <p>DIRECTORY: /incident/</p>
        <hr>
        <button onclick="openEvidence('incident.log')">📄 incident.log</button>
        <button onclick="openEvidence('mara_email.txt')">📄 mara_email.txt</button>
        <button onclick="openEvidence('recovery_report.txt')">📄 recovery_report.txt</button>
        `;
    } else if (app === "terminal") {
        title.textContent = "NEXUS Terminal";
        content.textContent = "System awaiting command...";

    } else if (app === "browser") {
        title.textContent = "Browser";
        content.textContent = "Unable to connect to the internet."
    }

}

function closeApp() {
    document.getElementById("app-window").style.display = "none";
}

function updateClock() {
    const now= new Date();

    document.getElementById("clock").textContent = now.toLocaleDateString("en-GB",{
        hour: "2-digit",
        minute:"2-digit",
        second:"2-digit",
        hour12: true

    }); 

}

updateClock();
setInterval(updateClock,1000);

function openEvidence(filename) {
    const content = document.getElementById("app-content");

    if (filename === "incident.log") {
        content.textContent = 
        "03:16:58 - Maintenance procedure initiated.\n" +
        "03:17:00 - Regional network connection lost. \n" +
        "03:17:04 - Automated safety isolation confirmed.";

    }

    else if (filename === "mara_email.txt") {
        content.textContent =
        "From Mara chen \n" +
        "SUBJECT: Do not trust the recovery report\n\n" +
        "The system says the network is healthy," +
        "but regional nodes disagree." +
        "check the maintenance logs before restoring anything.";

    }
    else if (filename === "recovery_report.txt") {
        content.textContent = 
        "NEXUS RECOVERY REPORT\n" +
        "All systems operational.\n" +
        "No configration errors detected.\n\n" +
        "WARNING: Report verification incomplete.";


    }

    content.style.whiteSpace = "pre-line";
    
}