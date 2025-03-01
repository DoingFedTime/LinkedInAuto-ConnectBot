async function linkedInConnectBot() {
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const randomDelay = () => Math.floor(Math.random() * 2000) + 1000;
    const processedProfiles = new Set();
    
    // Get a unique identifier for a profile
    const getProfileId = (element) => {
        try {
            const profileContainer = element.closest('li') || element.closest('.entity-result');
            if (profileContainer) {
                const nameElement = profileContainer.querySelector('span[aria-hidden="true"], a[href*="/in/"]');
                if (nameElement) return nameElement.textContent.trim();
            }
            return Math.random().toString();
        } catch (e) {
            return Math.random().toString();
        }
    };
    
    for (let i = 0; i < 1000; i++) {
        try {
            // Clear any open modals first
            const anyModalCloseButton = document.querySelector('button[data-test-modal-close-btn], button[aria-label="Dismiss"]');
            if (anyModalCloseButton) {
                console.log("Found open modal, closing it first...");
                anyModalCloseButton.click();
                await sleep(randomDelay());
            }
            
            // Find profile links that we haven't processed yet
            const profileLinks = Array.from(document.querySelectorAll('a[href*="/in/"]')).filter(link => {
                const container = link.closest('li') || link.closest('.entity-result');
                if (!container) return false;
                
                const profileId = getProfileId(link);
                return profileId && !processedProfiles.has(profileId);
            });
            
            if (profileLinks.length === 0) {
                console.log("No more unprocessed profiles found. Scrolling down...");
                window.scrollTo(0, document.body.scrollHeight);
                await sleep(3000);
                
                // Check if we need to go to the next page
                const nextButton = document.querySelector('button[aria-label="Next"]');
                if (nextButton) {
                    nextButton.click();
                    console.log("Moving to next page...");
                    await sleep(5000);
                    continue;
                } else {
                    console.log("Script completed - no more profiles to process.");
                    break;
                }
            }
            
            // Get the first unprocessed profile link
            const profileLink = profileLinks[0];
            const profileId = getProfileId(profileLink);
            processedProfiles.add(profileId);
            
            console.log(`Visiting profile: ${profileId}`);
            
            // Store current URL to go back later
            const currentUrl = window.location.href;
            
            // Click on the profile
            profileLink.click();
            await sleep(5000); // Wait for profile page to load
            
            // Find and click the More button on the profile page
            const moreButton = document.querySelector('button[aria-label="More actions"]');
            if (moreButton) {
                console.log("Clicking More button on profile page...");
                moreButton.click();
                await sleep(randomDelay());
                
                // Find and click Connect in dropdown
                const connectOptions = document.querySelectorAll('div[aria-label*="Invite"][aria-label*="connect"]');
                if (connectOptions.length > 0) {
                    console.log("Clicking Connect option in dropdown...");
                    connectOptions[0].click();
                    await sleep(randomDelay());
                    
                    // Handle any "Add a note" modal
                    const addNoteModal = document.querySelector('div[data-test-modal][role="dialog"].send-invite');
                    if (addNoteModal) {
                        const sendButton = addNoteModal.querySelector('button[aria-label="Send without a note"]');
                        if (sendButton && !sendButton.disabled) {
                            console.log("Clicking 'Send without a note'...");
                            sendButton.click();
                            await sleep(randomDelay());
                            console.log("Connection request sent!");
                        } else {
                            // If we can't send without a note, close the modal
                            const closeButton = addNoteModal.querySelector('button[aria-label="Dismiss"]');
                            if (closeButton) {
                                console.log("Can't send without a note, closing modal...");
                                closeButton.click();
                                await sleep(randomDelay());
                            }
                        }
                    } else {
                        // Look for direct Send button
                        const sendButton = document.querySelector('button[aria-label="Send now"]') || 
                                         document.querySelector('button[aria-label="Send"]') || 
                                         document.querySelector('button[aria-label="Done"]') ||
                                         document.querySelector('button[aria-label="Send without a note"]');
                        
                        if (sendButton) {
                            console.log("Clicking Send button...");
                            sendButton.click();
                            await sleep(randomDelay());
                            console.log("Connection request sent!");
                        }
                    }
                } else {
                    console.log("Connect option not found in dropdown");
                }
            } else {
                console.log("More button not found on profile page");
            }
            
            // Go back to search results
            console.log("Going back to search results...");
            window.history.back();
            await sleep(3000);
            
            // If URL didn't change properly, navigate directly
            if (window.location.href !== currentUrl) {
                window.location.href = currentUrl;
                await sleep(5000);
            }
            
        } catch (error) {
            console.error("Error:", error);
            await sleep(3000);
            
            // Try to go back to search results if there was an error
            try {
                window.history.back();
                await sleep(3000);
            } catch (e) {
                console.error("Error going back:", e);
            }
        }
    }
}

console.log("Starting LinkedIn profile-based connection bot...");
linkedInConnectBot();
