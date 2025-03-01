async function linkedInBot() {
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    for (let i = 0; i < 1000; i++) {
        try {
            const connectButton = document.querySelector('button[aria-label*="Invite"][aria-label*="connect"]');
            if (connectButton) {
                connectButton.click();
                await sleep(1500);
                const sendButton = document.querySelector('button[aria-label="Send without a note"]');
                if (sendButton) {
                    sendButton.click();
                    await sleep(1500);
                }
            } else {
                const nextButton = document.querySelector('button[aria-label="Next"]');
                if (nextButton) {
                    nextButton.click();
                    await sleep(3000);
                    console.log("Moving to the next page...");
                } else {
                    console.log("No more connections available.");
                    break;
                }
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }
}

linkedInBot();
