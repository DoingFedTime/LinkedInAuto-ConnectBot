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
