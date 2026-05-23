"use strict";
/**
 * @type {HTMLFormElement}
 */
const form = document.getElementById("sj-form");
/**
 * @type {HTMLInputElement}
 */
const address = document.getElementById("sj-address");
/**
 * @type {HTMLInputElement}
 */
const searchEngine = document.getElementById("sj-search-engine");
/**
 * @type {HTMLParagraphElement}
 */
const error = document.getElementById("sj-error");
/**
 * @type {HTMLPreElement}
 */
const errorCode = document.getElementById("sj-error-code");

const { ScramjetController } = $scramjetLoadController();

const scramjet = new ScramjetController({
	files: {
		wasm: "/scram/scramjet.wasm.wasm",
		all: "/scram/scramjet.all.js",
		sync: "/scram/scramjet.sync.js",
	},
});

scramjet.init();

const connection = new BareMux.BareMuxConnection("/baremux/worker.js");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
        await registerSW();
    } catch (err) {
        error.textContent = "Failed to register service worker.";
        errorCode.textContent = err.toString();
        throw err;
    }

    const url = search(address.value, searchEngine.value);

    // Setup the Wisp connection for proxy traffic
    let wispUrl =
        (location.protocol === "https:" ? "wss" : "ws") +
        "://" +
        location.host +
        "/wisp/";
    if ((await connection.getTransport()) !== "/libcurl/index.mjs") {
        await connection.setTransport("/libcurl/index.mjs", [
            { websocket: wispUrl },
        ]);
    }

    // Generate the Scramjet iframe
    const frame = scramjet.createFrame();
    frame.frame.id = "sj-frame";

    // --- NEW CLOAKING LOGIC ---
    // Open the about:blank tab
    let cloakedWindow = window.open('about:blank', '_blank');
    
    if (cloakedWindow) {
        let doc = cloakedWindow.document;
        
        // Make the Scramjet iframe fullscreen
        frame.frame.style.width = '100vw';
        frame.frame.style.height = '100vh';
        frame.frame.style.border = 'none';
        frame.frame.style.margin = '0';
        frame.frame.style.padding = '0';
        
        // Remove margins from the blank page's body
        doc.body.style.margin = '0';
        doc.body.style.overflow = 'hidden'; 
        
        // Set a fake title and icon (Google Drive)
        doc.title = "Google Drive"; 
        let link = doc.createElement('link');
        link.rel = 'icon';
        link.href = 'https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png';
        doc.head.appendChild(link);

        // Inject Scramjet's iframe into the new cloaked tab!
        doc.body.appendChild(frame.frame);
        
        // Tell Scramjet to load the target URL inside the cloaked frame
        frame.go(url);
    } else {
        alert("Pop-up blocker prevented the cloaked tab from opening. Please allow pop-ups for this site.");
    }
});
