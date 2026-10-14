
const evidenceFiles = {
    "incident.log": {
        read: false,
        collected: false
    },
    "mara_email.txt": {
        read: false,
        collected: false
    },
    "recovery_report.txt": {
        read: false,
        collected: false
    },
    "network_trace.txt": {
        read: false,
        collected: false,
        unlocked: false
    }
};


// ACTIVE DOCK TRACKER
function updateActiveDock(activeApp) {
    const dockButtons = document.querySelectorAll(".dock-app");
    dockButtons.forEach(btn => btn.classList.remove("active"));
    if (activeApp) {
        const activeBtn = document.getElementById("dock-btn-" + activeApp);
        if (activeBtn) activeBtn.classList.add("active");
    }
}


// OPEN APPLICATIONS
function openApp(app) {
    const windowBox = document.getElementById("app-window");
    const title = document.getElementById("app-title");
    const content = document.getElementById("app-content");
    const winIcon = document.getElementById("window-icon");

    windowBox.style.display = "block";
    updateActiveDock(app);

    if (app === "files") {
        if (winIcon) winIcon.textContent = "▤";
        title.textContent = "NEXUS File Explorer";
        showFileList();

    } else if (app === "terminal") {
        if (winIcon) winIcon.textContent = ">_";
        title.textContent = "NEXUS Terminal";

        content.innerHTML = `
            <div class="terminal-container">
                <div id="terminal-output" class="terminal-output-area">
                    <span class="term-banner">NEXUS TERMINAL OS v0.2.47 [KDE-BASH // tty1]</span>
                    <span class="term-dim">Type 'help' to display available incident diagnostics.</span>
                </div>

                <form id="terminal-form" class="terminal-input-bar">
                    <span class="terminal-prompt">nexus@ws-01:~$</span>
                    <input id="terminal-input" type="text"
                        autocomplete="off" autofocus spellcheck="false">
                </form>
            </div>
        `;

        const terminalForm =
            document.getElementById("terminal-form");
        const terminalInput =
            document.getElementById("terminal-input");

        terminalForm.addEventListener("submit", function(event) {
            event.preventDefault();

            const command =
                terminalInput.value.trim().toLowerCase();

            runTerminalCommand(command);

            terminalInput.value = "";
            terminalInput.focus();
        });

        terminalInput.focus();

    } else if (app === "browser") {
        if (winIcon) winIcon.textContent = "◎";
        title.textContent = "NEXUS Network Monitor";

        content.innerHTML = `
            <div class="network-dashboard">
                <h3>REGIONAL NETWORK STATUS</h3>
                <p>INCIDENT TIME: 03:17:00</p>
                <p>ACTIVE CONNECTIONS: 1 / 4</p>
                <hr>

                <div class="network-node">
                    <span>● NEXUS-CORE</span>
                    <span class="node-online">ONLINE</span>
                </div>

                <div class="network-node">
                    <span>● REGION-01</span>
                    <span class="node-offline">OFFLINE</span>
                </div>

                <div class="network-node">
                    <span>● REGION-02</span>
                    <span class="node-offline">OFFLINE</span>
                </div>

                <div class="network-node">
                    <span>● REGION-03</span>
                    <span class="node-offline">OFFLINE</span>
                </div>

                <hr>
                <p class="network-warning">
                    WARNING: Unverified maintenance activity detected.
                </p>

                <button onclick="investigateNetwork()">
                    INVESTIGATE ANOMALY
                </button>

                <div id="network-investigation"></div>
            </div>
        `;
    }
}


// CLOSE APPLICATION
function closeApp() {
    const windowBox = document.getElementById("app-window");
    if (windowBox) windowBox.style.display = "none";
    updateActiveDock(null);
}

// MINIMIZE APPLICATION
function minimizeApp() {
    closeApp();
}

// TOGGLE MAXIMIZE APPLICATION
function toggleMaximizeApp() {
    const windowBox = document.getElementById("app-window");
    const maxBtn = document.querySelector(".win-maximize");
    if (!windowBox) return;

    const isMax = windowBox.classList.toggle("maximized");
    if (maxBtn) {
        maxBtn.textContent = isMax ? "❐" : "□";
        maxBtn.title = isMax ? "Restore" : "Maximize";
    }
}


// CLOCK
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


// OPEN EVIDENCE FILES
function openEvidence(filename) {
    const content = document.getElementById("app-content");
    const file = evidenceFiles[filename];

    if (!file) return;

    // Do not allow locked evidence to be opened.
    if (file.unlocked === false) {
        return;
    }

    file.read = true;

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

    } else if (filename === "network_trace.txt") {
        content.textContent =
            "NEXUS NETWORK TRACE\n\n" +
            "03:16:58 - Maintenance command accepted.\n" +
            "03:16:59 - Unknown process requested isolation.\n" +
            "03:17:00 - Three regional nodes disconnected.\n\n" +
            "NOTICE: Process identity unavailable.";
    }

    content.style.whiteSpace = "pre-line";

    content.innerHTML += `
        <hr>
        <button onclick="collectEvidence('${filename}')">
            ${file.collected
                ? "✓ Evidence collected"
                : "Collect as evidence"}
        </button>

        <button onclick="showFileList()">
            ← Back to files
        </button>
    `;
}


// SHOW FILE LIST
function showFileList() {
    const content = document.getElementById("app-content");

    content.style.whiteSpace = "normal";

    content.innerHTML = `
        <p>DIRECTORY: /incident/</p>
        <hr>

        <button onclick="openEvidence('incident.log')">
            📄 incident.log
            ${evidenceFiles["incident.log"].read ? "[READ]" : "[UNREAD]"}
            ${evidenceFiles["incident.log"].collected ? "✓ COLLECTED" : ""}
        </button>

        <button onclick="openEvidence('mara_email.txt')">
            📄 mara_email.txt
            ${evidenceFiles["mara_email.txt"].read ? "[READ]" : "[UNREAD]"}
            ${evidenceFiles["mara_email.txt"].collected ? "✓ COLLECTED" : ""}
        </button>

        <button onclick="openEvidence('recovery_report.txt')">
            📄 recovery_report.txt
            ${evidenceFiles["recovery_report.txt"].read ? "[READ]" : "[UNREAD]"}
            ${evidenceFiles["recovery_report.txt"].collected ? "✓ COLLECTED" : ""}
        </button>
    `;

    // Only show the network trace after investigation unlocks it.
    if (evidenceFiles["network_trace.txt"].unlocked) {
        content.innerHTML += `
            <button onclick="openEvidence('network_trace.txt')">
                📄 network_trace.txt
                ${evidenceFiles["network_trace.txt"].read ? "[READ]" : "[UNREAD]"}
                ${evidenceFiles["network_trace.txt"].collected ? "✓ COLLECTED" : ""}
            </button>
        `;
    }
}


// COLLECT EVIDENCE
function collectEvidence(filename) {
    const file = evidenceFiles[filename];

    if (!file) return;
    if (file.unlocked === false) return;

    file.collected = true;

    updateEvidenceCounter();
    openEvidence(filename);
}


// UPDATE EVIDENCE COUNTER
function updateEvidenceCounter() {
    const countText = document.getElementById("evidence-count-text");
    const resolveBtn = document.getElementById("resolve-button");
    const progressFill = document.getElementById("evidence-progress-fill");

    const collectedCount = Object.values(evidenceFiles)
        .filter(file => file.collected)
        .length;

    const totalFiles = Object.keys(evidenceFiles).length;

    if (countText) {
        countText.textContent = `EVIDENCE: ${collectedCount}/${totalFiles}`;
    } else {
        const counter = document.getElementById("evidence-counter");
        if (counter) {
            counter.textContent = `EVIDENCE: ${collectedCount}/${totalFiles}`;
        }
    }

    if (progressFill) {
        const percent = Math.round((collectedCount / totalFiles) * 100);
        progressFill.style.width = percent + "%";
    }

    if (resolveBtn) {
        if (collectedCount === totalFiles) {
            resolveBtn.classList.add("ready");
        } else {
            resolveBtn.classList.remove("ready");
        }
    }
}


// FINAL DECISION SCREEN
function openDecisionScreen() {
    const windowBox = document.getElementById("app-window");
    const title = document.getElementById("app-title");
    const content = document.getElementById("app-content");
    const winIcon = document.getElementById("window-icon");

    windowBox.style.display = "block";
    if (winIcon) winIcon.textContent = "◈";
    updateActiveDock(null);
    title.textContent = "NEXUS Incident Resolution";

    const collectedCount = Object.values(evidenceFiles)
        .filter(file => file.collected)
        .length;
    const totalFiles = Object.keys(evidenceFiles).length;

    content.style.whiteSpace = "normal";
    content.innerHTML = `
        <div class="decision-screen">
            <h3 class="decision-heading">FINAL TRANSMISSION PROTOCOL</h3>
            <p class="decision-subtext">
                All regional links remain unresponsive after the 03:17:00 blackout. As the active duty technician, you must log the terminal decision for the NEXUS network.
            </p>
            <div class="decision-evidence-summary">
                EVIDENCE ARCHIVED: <strong>${collectedCount}/${totalFiles}</strong>
                ${collectedCount === 0 ? " — (WARNING: Zero evidence logged. Any action taken now is completely unverified.)" : ""}
            </div>

            <div class="decision-options">
                <div class="decision-card">
                    <h4>[ OPTION 01: RESTORE ]</h4>
                    <p>Force emergency reboot and re-synchronize all regional nodes using standard recovery parameters.</p>
                    <button class="decision-btn" onclick="makeDecision('RESTORE')">TRANSMIT RESTORE ORDER</button>
                </div>

                <div class="decision-card">
                    <h4>[ OPTION 02: CONTAIN ]</h4>
                    <p>Permanently sever all regional communication trunks and seal NEXUS-CORE behind blast isolation.</p>
                    <button class="decision-btn" onclick="makeDecision('CONTAIN')">ENACT EMERGENCY CONTAINMENT</button>
                </div>

                <div class="decision-card">
                    <h4>[ OPTION 03: EXPOSE ]</h4>
                    <p>Broadcast unredacted internal telemetry, incident logs, and evidence to public frequencies.</p>
                    <button class="decision-btn" onclick="makeDecision('EXPOSE')">LEAK INCIDENT TELEMETRY</button>
                </div>
            </div>
        </div>
    `;
}


// MAKE DECISION & EVALUATE ENDING
function makeDecision(choice) {
    const title = document.getElementById("app-title");
    const content = document.getElementById("app-content");

    title.textContent = "Incident Report: Final Transmission";

    const hasLog = evidenceFiles["incident.log"].collected;
    const hasEmail = evidenceFiles["mara_email.txt"].collected;
    const hasReport = evidenceFiles["recovery_report.txt"].collected;
    const hasTrace = evidenceFiles["network_trace.txt"].collected;

    const collectedFiles = Object.keys(evidenceFiles).filter(f => evidenceFiles[f].collected);
    const collectedCount = collectedFiles.length;
    const totalFiles = Object.keys(evidenceFiles).length;

    let endingTitle = "";
    let narrative = "";
    let outcomeBadge = "";
    let isSuccess = false;

    if (choice === "RESTORE") {
        if (hasTrace && (hasEmail || hasLog)) {
            isSuccess = true;
            outcomeBadge = "OUTCOME: GRID STABILIZED // OPERATIONAL SUCCESS";
            endingTitle = "RESTORE — CALCULATED PURGE & RECOVERY";
            narrative = "Guided by the network trace and Mara's warnings, you identify the rogue maintenance procedure before it re-executes.\n\nYou manually isolate the unauthorized routine in memory and transmit clean calibration packets across the regional trunks. One by one, REGION-01, REGION-02, and REGION-03 confirm handshake signals.\n\nPower and communication grids flicker back to life across the territory. The blackout is broken, and forensic logs of the intrusion are safely preserved.";
        } else {
            isSuccess = false;
            outcomeBadge = "OUTCOME: CASCADE BLACKOUT // CRITICAL FAILURE";
            endingTitle = "RESTORE — CATASTROPHIC RESTORATION";
            narrative = "Trusting the official recovery report without having the forensic trace or Mara's warning, you force an immediate system-wide restoration.\n\nWithout an isolated purge, the unrecognized process embedded in the maintenance procedure triggers simultaneously across all regional hubs. High-voltage breakers trip in rapid succession, frying secondary relay switches.\n\nThe regional grid collapses into total darkness. NEXUS-CORE drops offline, and workstation logs record your credentials as the initiator of the irreversible failure.";
        }
    } else if (choice === "CONTAIN") {
        if (hasTrace && hasEmail) {
            isSuccess = true;
            outcomeBadge = "OUTCOME: THREAT CONFINED // CONTROLLED ISOLATION";
            endingTitle = "CONTAIN — SURGICAL QUARANTINE";
            narrative = "Using the timing coordinates from the network trace and Mara's advisories, you refrain from a blind shutdown.\n\nInstead of collapsing all civil infrastructure, you sever only the specific subnets targeted by the unknown process, redirecting essential emergency channels to auxiliary backups. The anomalous process is trapped in a sandbox memory loop.\n\nMara Chen verifies your telemetry from her remote terminal. While regional service is degraded, millions of citizens remain connected, and the core systems remain uncompromised.";
        } else {
            isSuccess = false;
            outcomeBadge = "OUTCOME: CIVIL DISASTER // BLIND SHUTDOWN";
            endingTitle = "CONTAIN — TOTAL ISOLATION PANIC";
            narrative = "Acting out of caution without the specific trace telemetry, you panic and initiate a scorched-earth isolation sequence.\n\nYou fire the core explosive breakers, severing all regional fiber lines. The unknown process is stopped, but hospitals, transit systems, and millions of regional citizens are plunged into an abrupt communication dark age.\n\nWith no logged network trace to justify the extreme protocol, Internal Oversight suspends your terminal access and opens a formal investigation.";
        }
    } else if (choice === "EXPOSE") {
        if (hasTrace && hasEmail && hasReport) {
            isSuccess = true;
            outcomeBadge = "OUTCOME: CONSPIRACY UNMASKED // PUBLIC VINDICATION";
            endingTitle = "EXPOSE — THE TRUTH BROADCAST";
            narrative = "You assemble a comprehensive cryptographic archive: the false recovery report, Mara Chen's suppressed warning, and the conclusive network trace proving an unauthorized process orchestrated the regional blackout.\n\nYou bypass NEXUS filters and broadcast the packet across independent news relays and civic radio channels. Within minutes, the data is verified and mirrored globally.\n\nNEXUS corporate high command cannot bury the proof. Mara Chen is protected by public scrutiny, an independent federal inquiry is launched, and your leak prevents a manufactured crisis.";
        } else {
            isSuccess = false;
            outcomeBadge = "OUTCOME: SILENCED // DISCREDITED & TERMINATED";
            endingTitle = "EXPOSE — DISMISSED AS RUMOR";
            narrative = "Attempting to blow the whistle without Mara Chen's corroborating testimony or the crucial network trace, you transmit incomplete fragments to public boards.\n\nNEXUS Public Relations immediately issues a press release branding the leak as unverified maintenance telemetry misinterpreted by an inexperienced junior technician. The public dismisses the story.\n\nWithin twenty minutes, security personnel arrive at your workstation. Your access credentials are permanently revoked, and the truth remains buried.";
        }
    }

    const evidenceListItems = collectedFiles.length > 0
        ? collectedFiles.map(f => `<li>✓ ${f}</li>`).join("")
        : "<li>(None collected — decision made blind)</li>";

    content.style.whiteSpace = "normal";
    content.innerHTML = `
        <div class="ending-screen">
            <div class="ending-badge ${isSuccess ? 'badge-success' : 'badge-failure'}">
                ${outcomeBadge}
            </div>
            <h3 class="ending-title">${endingTitle}</h3>
            <div class="ending-narrative">${narrative}</div>
            <div class="ending-evidence-summary">
                <strong>EVIDENCE LOGGED:</strong> ${collectedCount} / ${totalFiles}
                <ul class="ending-evidence-list">
                    ${evidenceListItems}
                </ul>
            </div>
            <button class="restart-button" onclick="restartMission()">◈ RESTART MISSION</button>
        </div>
    `;
}


// RESTART MISSION
function restartMission() {
    for (const filename in evidenceFiles) {
        evidenceFiles[filename].read = false;
        evidenceFiles[filename].collected = false;
        if (filename === "network_trace.txt") {
            evidenceFiles[filename].unlocked = false;
        }
    }

    updateEvidenceCounter();

    const investigation = document.getElementById("network-investigation");
    if (investigation) {
        investigation.innerHTML = "";
    }

    const windowBox = document.getElementById("app-window");
    const title = document.getElementById("app-title");
    const content = document.getElementById("app-content");
    const winIcon = document.getElementById("window-icon");
    const maxBtn = document.querySelector(".win-maximize");

    if (windowBox) {
        windowBox.classList.remove("maximized");
        windowBox.style.display = "none";
        windowBox.style.left = "";
        windowBox.style.top = "";
        windowBox.style.transform = "";
    }

    if (maxBtn) {
        maxBtn.textContent = "□";
        maxBtn.title = "Maximize";
    }

    if (winIcon) {
        winIcon.textContent = "◈";
    }

    if (title) {
        title.textContent = "Application";
    }

    if (content) {
        content.style.whiteSpace = "normal";
        content.innerHTML = "Welcome.";
    }

    updateActiveDock(null);
    closeLauncher();
}


// SIMULATED TERMINAL COMMANDS
function runTerminalCommand(command) {
    const output = document.getElementById("terminal-output");

    if (!output) return;
    if (command === "") return;

    const result = document.createElement("div");
    result.className = "terminal-entry";
    result.style.whiteSpace = "pre-wrap";
    result.textContent = "nexus@ws-01:~$ " + command;

    const parts = command.trim().split(/\s+/);
    const action = parts[0];
    const filename = parts[1];

    if (action === "help") {
        result.textContent +=
            "\nCommands: help, ls, cat, whoami, status, crt, resolve, restart, clear";

    } else if (action === "ls") {
        let fileList =
            "incident.log\nmara_email.txt\nrecovery_report.txt";

        if (evidenceFiles["network_trace.txt"].unlocked) {
            fileList += "\nnetwork_trace.txt";
        }

        result.textContent += "\n" + fileList;

    } else if (action === "cat") {
        const files = {
            "incident.log":
                "03:16:58 - Maintenance procedure initiated.\n" +
                "03:17:00 - Regional network connection lost.\n" +
                "03:17:04 - Automated safety isolation confirmed.",

            "mara_email.txt":
                "FROM: Mara Chen\n" +
                "SUBJECT: Do not trust the recovery report\n\n" +
                "Regional nodes disagree with the official status.\n" +
                "Check maintenance logs before restoring anything.",

            "recovery_report.txt":
                "NEXUS RECOVERY REPORT\n\n" +
                "All systems operational.\n" +
                "No configuration errors detected.\n" +
                "WARNING: Report verification incomplete."
        };

        if (evidenceFiles[filename] &&
            evidenceFiles[filename].unlocked === false) {
            result.textContent += "\nFile not found.";
        } else if (
            filename === "network_trace.txt" &&
            !evidenceFiles[filename].unlocked
        ) {
            result.textContent += "\nFile not found.";
        } else if (files[filename]) {
            if (evidenceFiles[filename]) {
                evidenceFiles[filename].read = true;
            }
            result.textContent += "\n" + files[filename];
        } else if (
            filename === "network_trace.txt" &&
            evidenceFiles[filename].unlocked
        ) {
            evidenceFiles["network_trace.txt"].read = true;
            result.textContent +=
                "\nNEXUS NETWORK TRACE\n\n" +
                "03:16:58 - Maintenance command accepted.\n" +
                "03:16:59 - Unknown process requested isolation.\n" +
                "03:17:00 - Three regional nodes disconnected.\n\n" +
                "NOTICE: Process identity unavailable.";
        } else {
            result.textContent +=
                "\nFile not found. Try: cat incident.log";
        }

    } else if (action === "whoami") {
        result.textContent +=
            "\nJunior Technician - NEXUS Regional Operations";

    } else if (action === "status") {
        result.textContent +=
            "\nSYSTEM: NEXUS\nNETWORK: OFFLINE\n" +
            "INCIDENT: REGIONAL CONNECTION LOST\n" +
            "LAST FAILURE: 03:17:00";

    } else if (action === "crt") {
        toggleCRT();
        const isOff = document.body.classList.contains("crt-off");
        result.textContent +=
            "\nCRT monitor simulation: " + (isOff ? "DISABLED [OFF]" : "ACTIVE [ON]");

    } else if (action === "resolve" || action === "decide") {
        result.textContent +=
            "\nOpening incident resolution protocol in application window...";
        openDecisionScreen();

    } else if (action === "restart" || action === "reset") {
        result.textContent +=
            "\nResetting workstation environment...";
        restartMission();

    } else if (action === "clear") {
        output.textContent = "";
        return;

    } else {
        result.textContent += "\nCommand not found: " + action;
    }

    output.appendChild(result);
    output.scrollTop = output.scrollHeight;
}


// WINDOW DRAGGING
const appWindow = document.getElementById("app-window");
const titleBar = document.querySelector(".window-titlebar");

let isDragging = false;
let offsetX = 0;
let offsetY = 0;

if (appWindow && titleBar) {
    titleBar.addEventListener("mousedown", function(event) {
        if (event.target.closest(".window-controls") || event.target.closest(".close-button")) {
            return;
        }

        if (appWindow.classList.contains("maximized")) {
            return;
        }

        isDragging = true;

        const rect = appWindow.getBoundingClientRect();

        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;

        appWindow.style.transform = "none";
        appWindow.style.left = rect.left + "px";
        appWindow.style.top = rect.top + "px";
    });

    document.addEventListener("mousemove", function(event) {
        if (!isDragging) return;

        appWindow.style.left =
            (event.clientX - offsetX) + "px";

        appWindow.style.top =
            (event.clientY - offsetY) + "px";
    });

    document.addEventListener("mouseup", function() {
        isDragging = false;
    });

    document.addEventListener("mouseleave", function() {
        isDragging = false;
    });
}


// LAUNCHER
function toggleLauncher() {
    const menu = document.getElementById("launcher-menu");

    if (menu.style.display === "block") {
        menu.style.display = "none";
    } else {
        menu.style.display = "block";
    }
}

function closeLauncher() {
    document.getElementById("launcher-menu").style.display = "none";
}


// INVESTIGATE NETWORK ANOMALY
function investigateNetwork() {
    const investigation =
        document.getElementById("network-investigation");

    if (!investigation) return;

    evidenceFiles["network_trace.txt"].unlocked = true;

    investigation.innerHTML = `
        <hr>
        <h3>ANOMALY REPORT</h3>
        <p>03:16:58 — Maintenance procedure initiated.</p>
        <p>03:17:00 — Three regional nodes disconnected.</p>
        <p>03:17:04 — Safety isolation confirmed.</p>
        <p class="network-warning">
            The outage began immediately after maintenance started.
        </p>
        <p>New lead: inspect incident.log for more information.</p>
        <p>New file unlocked: network_trace.txt</p>
    `;
}


// INITIAL EVIDENCE COUNTER
updateEvidenceCounter();


// CRT ATMOSPHERE TOGGLE
function toggleCRT() {
    const isOff = document.body.classList.toggle("crt-off");
    const toggleBtn = document.getElementById("crt-toggle");
    if (toggleBtn) {
        toggleBtn.textContent = isOff ? "CRT [OFF]" : "CRT [ON]";
    }
    try {
        if (typeof localStorage !== "undefined") {
            localStorage.setItem("dead_signal_crt", isOff ? "off" : "on");
        }
    } catch (e) {}
}

// Initialize saved CRT preference
(function initCRTPreference() {
    try {
        if (typeof localStorage !== "undefined" && localStorage.getItem("dead_signal_crt") === "off") {
            document.body.classList.add("crt-off");
            const toggleBtn = document.getElementById("crt-toggle");
            if (toggleBtn) {
                toggleBtn.textContent = "CRT [OFF]";
            }
        }
    } catch (e) {}
})();

