"use strict";

/**
 * 1. The "Brain" - Decides if input is a link or a search query
 * @param {string} input
 * @param {string} template Template for a search query.
 * @returns {string} Fully qualified URL
 */
function search(input, template) {
    try {
        // input is a valid URL:
        return new URL(input).toString();
    } catch (err) {
        // input was not a valid URL
    }

    try {
        // input is a valid URL when http:// is added to the start:
        const url = new URL(`http://${input}`);
        // only if the hostname has a TLD/subdomain
        if (url.hostname.includes(".")) return url.toString();
    } catch (err) {
        // input was not valid URL
    }

    // Treat the input as a search query
    return template.replace("%s", encodeURIComponent(input));
}


/**
 * 2. The Cloaker - Takes the formatted URL and opens it secretly
 * Call this function when the user presses Enter or clicks Search!
 */
function openCloakedProxy(inputValue) {
    // Step 1: Run the input through the brain. 
    // If it's plain text, we tell it to use Google Search as the template.
    let formattedUrl = search(inputValue, "https://www.google.com/search?q=%s");

    // Step 2: Encode the final URL so Scramjet's router doesn't crash on slashes
    let encodedUrl = encodeURIComponent(formattedUrl); 
    let finalProxyUrl = window.location.origin + '/service/' + encodedUrl;

    // Step 3: Open the Cloaked Tab (about:blank)
    let cloakedWindow = window.open('about:blank', '_blank');
    
    if (cloakedWindow) {
        // Build the iframe inside the blank tab
        let doc = cloakedWindow.document;
        let iframe = doc.createElement('iframe');
        
        // Make the iframe take up the entire screen
        iframe.style.width = '100vw';
        iframe.style.height = '100vh';
        iframe.style.border = 'none';
        iframe.style.margin = '0';
        iframe.style.padding = '0';
        
        // Remove margins from the blank page's body
        doc.body.style.margin = '0';
        doc.body.style.overflow = 'hidden'; 
        
        // Set the source to our proxy URL
        iframe.src = finalProxyUrl;
        
        // Inject the iframe into the cloaked tab
        doc.body.appendChild(iframe);
        
        // Set a fake title and icon for the cloaked tab
        doc.title = "Google Drive"; 
        let link = doc.createElement('link');
        link.rel = 'icon';
        link.href = 'https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png';
        doc.head.appendChild(link);
    } else {
        alert("Pop-up blocker prevented the cloaked tab from opening. Please allow pop-ups for this site.");
    }
}
