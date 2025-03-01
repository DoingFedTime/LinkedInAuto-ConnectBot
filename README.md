# 🤖 LinkedIn Auto-Connect Bot

Automate your LinkedIn networking like a pro! This lightweight script helps you send connection requests on autopilot—all within your browser. 🚀
NO DOWNLOAD NEEDED!
⭐ if this helped.

## LinkedIn Auto-Connect Bot Changelog

## Version 1.0.0 (2025-03-01)

### Added
- Initial bot implementation with basic "Connect" button clicking
- Support for multiple connection flows:
  - Direct "Connect" button flow
  - "Message → More → Connect" flow
  - "Profile visit → More → Connect" flow
- Smart profile tracking to prevent processing the same profile multiple times
- Automatic handling of premium popups and modals
- Navigation between search result pages
- Error recovery mechanisms with automatic return to search results
- Random timing delays to appear more human-like
- Comprehensive logging of actions for easier debugging
- Handling for "Add a note" modals with automatic dismissal

### Technical Improvements
- Robust element selection using aria-labels and content targeting
- Profile identification across different LinkedIn UI layouts
- Smart scrolling to load more results before pagination
- Browser history management for reliable navigation
- Graceful error handling with multiple fallback mechanisms

---

## 🎥 Demo

![🤖 LinkedIn Auto-Connect Bot](https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGRncGRhY2xreXJhYmV4enVyZzhoY3l5OXpuemI5NGwxMXpjaTI4ayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/JKunsuORznBN40VawJ/giphy.gif)



## 🔥 What This Bot Does

This script eliminates repetitive manual tasks by:
- **Automatically clicking "Connect"** on target profiles.
- **Sending requests without notes** for speed and simplicity.
- **Navigating to the next page** when the current one is complete.
- Repeating the process until stopped or when no more connections are available.

---

## 🛠️ Prerequisites

- A LinkedIn account
- A browser
- IQ north of 60
---

## 📋 How to Use

1. **Go to LinkedIn** and search for your desired audience (e.g., “Data Scientists,” “Product Managers”).
2. **Open Chrome Developer Tools**:
   - Press `F12` or right-click the page and select **Inspect**.
3. Navigate to the **Console Tab**.
4. **Copy and paste the following script** into the console:

```javascript
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
```
To stop it refresh the page (hit F5). 

## ⚠️ Important Notes

- Use responsibly and follow LinkedIn's **Terms of Service**.
- Be aware of LinkedIn's **daily connection request limits**—don’t overuse the tool.
- Adding **personalized notes** to connection requests can improve acceptance rates.
- This tool is provided for **educational purposes only**.

---

## ⭐ Pro Tips for Success

- **Refine your search results** to target specific, relevant connections.
- Take **breaks** between automation sessions to reduce the risk of detection.
- Regularly **review and manage your pending requests** to avoid exceeding limits.
- Adjust the `sleep` timings in the script for a more natural, human-like behavior.

---

## 🚫 Disclaimer

This tool is designed for **educational purposes only**.  
By using this script, you accept full responsibility for any risks, including account restrictions.  
The creator is not liable for any consequences resulting from misuse of this tool.

---

## 🌟 Found this Useful?

Give this repo a [⭐](https://github.com/DoingFedTime/LinkedInAuto-ConnectBot/stargazers) to show your support!

Follow me on [LinkedIn](https://www.linkedin.com/in/sam-bent/), [Twitter/X](https://twitter.com/DoingFedTime), [Instagram](https://www.instagram.com/sambentoffical/), [YouTube](https://youtube.com/@sam_bent), and [Rumble](https://rumble.com/c/DoingFedTime) for more tips and tricks on automation and productivity. Visit my [website](https://www.sambent.com) for additional resources.

Happy networking! 🎯
