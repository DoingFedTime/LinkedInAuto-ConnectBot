<h1 align="center">
    🤖 LinkedIn Auto-Connect Bot
</h1>

<p align="center">
    <img src="https://img.shields.io/github/license/NatsumeAoii/Linkedinauto-connectbot?style=flat-square">
    <img src="https://img.shields.io/github/stars/NatsumeAoii/Linkedinauto-connectbot?style=flat-square">
</p>

Supercharge your LinkedIn networking with precision and automation!  
This lightweight, browser-based script takes the hassle out of sending connection requests. 🚀  
No downloads. No installations. Just seamless networking.  
**⭐ If you find this helpful, don’t forget to star this repo!**

---

## 🎥 Demo in Action

<p align="center">
  <img src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGRncGRhY2xreXJhYmV4enVyZzhoY3l5OXpuemI5NGwxMXpjaTI4ayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/JKunsuORznBN40VawJ/giphy.gif" alt="LinkedIn Auto-Connect Bot Demo" width="800" height="auto">
</p>

---

## 🔥 Key Features

- **One-click automation** for sending connection requests on LinkedIn.
- Intelligent navigation to handle multiple pages seamlessly.
- Built-in checks to detect and stop when LinkedIn's **weekly invitation limits** are reached.
- Fully customizable—tailor it to your specific networking goals.
- Supports both **English** and **Indonesian** LinkedIn interfaces.

---

## 🛠️ What You Need

- A LinkedIn account
- A browser with developer tools (e.g., Chrome, Firefox)

---

## 📋 How to Set It Up

1. Log in to your LinkedIn account and search for your target audience (e.g., “Software Engineers”, “Marketers”, “HR”, “HRD”).
2. On the search results page, **click the "See all people results"** button to view the full list of profiles.
3. **If you're using Chrome, make sure to use a fresh profile** (not your main one) to avoid interference from browser extensions.
   - To create a new profile: Go to **Settings > Manage profiles > Add new profile**.
4. Open **Developer Tools** (press `F12` or right-click the page → **Inspect**).
5. Navigate to the **Console Tab**.
6. Type **`allow pasting`**, then hit `Enter`. This will allow you to paste scripts into the console.
7. Copy and paste the script into the console.

```javascript
async function linkedInBot() {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const log = (message) => console.log(`[LOG] ${message}`);

  // Configurator: Set your preferences here
  const useConnect = true; // Set to true to use "Connect / Hubungkan"
  const useInvite = true; // Set to true to use "Follow / Ikuti"
  const waitTimeBetweenActions = 1500; // Configurable wait time in milliseconds
  const waitTimeBetweenPages = 3000; // Configurable wait time between page navigation
  const maxDailyConnects = 20; // Limit for daily connections

  let connectCount = 0;
  let connectLimitReached = false;

  const clickButton = async (ariaLabels, partialMatch = false) => {
    try {
      const buttons = Array.from(document.querySelectorAll('button'));
      const button = buttons.find((btn) =>
        Array.isArray(ariaLabels)
          ? ariaLabels.some((label) => btn.getAttribute('aria-label')?.toLowerCase().includes(label.toLowerCase()))
          : partialMatch
          ? btn.getAttribute('aria-label')?.toLowerCase().includes(ariaLabels.toLowerCase())
          : btn.getAttribute('aria-label')?.toLowerCase() === ariaLabels.toLowerCase()
      );

      if (button) {
        button.click();
        log(`Clicked button: "${button.getAttribute('aria-label')}"`);
        await sleep(waitTimeBetweenActions);
        return true;
      } else {
        log(`Button not found for labels: "${ariaLabels}"`);
      }
      return false;
    } catch (error) {
      log(`Error clicking button: "${ariaLabels}" - ${error.message}`);
      return false;
    }
  };

  const handleWeeklyLimitPopup = async () => {
    try {
      const popupHeader = document.querySelector('#ip-fuse-limit-alert__header');
      if (popupHeader) {
        if (
          popupHeader.textContent.includes("Anda telah mencapai batas mingguan pengiriman undangan") || 
          popupHeader.textContent.includes("You’ve reached the weekly invitation limit")
        ) {
          log("Weekly invitation limit popup detected.");
          const gotItButtonLabels = ["Got it", "Mengerti"];
          await clickButton(gotItButtonLabels);
          connectLimitReached = true;
          return true;
        }
      }
      return false;
    } catch (error) {
      log(`Error handling weekly limit popup: ${error.message}`);
      return false;
    }
  };

  const processConnectionsAndInvites = async () => {
    try {
      const buttons = Array.from(document.querySelectorAll('button'));
      for (const button of buttons) {
        const ariaLabel = button.getAttribute('aria-label');

        log(`Detected button with aria-label: "${ariaLabel}"`); // Debugging

        if (useConnect && !connectLimitReached && connectCount < maxDailyConnects) {
          if (
            ariaLabel?.includes("connect") || 
            ariaLabel?.includes("Hubungkan") || 
            ariaLabel?.includes("Invite") || 
            ariaLabel?.includes("Undang")
          ) {
            button.click();
            log(`Clicked Connect/Hubungkan: "${ariaLabel}"`);
            connectCount++;
            await sleep(waitTimeBetweenActions);

            const sendInvitationLabels = ["Send invitation", "Kirim undangan"];
            const sent = await clickButton(sendInvitationLabels);
            if (sent) {
              log(`Sent invitation for: "${ariaLabel}"`);
            }

            if (connectCount >= maxDailyConnects) {
              log("Daily connection limit reached.");
              connectLimitReached = true;
            }
          }
        }

        if (useInvite && (ariaLabel?.includes("Follow") || ariaLabel?.includes("Ikuti"))) {
          button.click();
          log(`Clicked Follow/Ikuti: "${ariaLabel}"`);
          await sleep(waitTimeBetweenActions);
        }
      }
    } catch (error) {
      log(`Error processing connections and invites: ${error.message}`);
    }
  };

  const checkDisabledNextButton = () => {
    const disabledNextButtons = [
      document.querySelector('button[disabled][aria-label="Next"]'),
      document.querySelector('button[disabled][aria-label="Berikutnya"]'),
    ];
    if (disabledNextButtons.some((button) => button !== null)) {
      log("Disabled 'Next' button found. Stopping the bot...");
      return true;
    }
    return false;
  };

  for (let i = 0; ; i++) {
    try {
      log(`Attempt ${i + 1} - Scanning the page for connections and invites...`);

      if (await handleWeeklyLimitPopup()) {
        log("Handled weekly invitation limit popup. Continuing...");
      }

      await processConnectionsAndInvites();

      if (checkDisabledNextButton()) {
        log("No more pages to process. Stopping...");
        break;
      }

      const nextLabels = ["Next", "Berikutnya"];
      const movedNext = await clickButton(nextLabels);
      if (!movedNext) {
        log("No 'Next' button found. Retrying...");
        await sleep(waitTimeBetweenPages);
      } else {
        await sleep(waitTimeBetweenPages);
        log("Moved to the next page...");
      }
    } catch (error) {
      log(`An error occurred during execution: ${error.message}`);
    }
  }

  log("LinkedIn Bot execution completed.");
}

linkedInBot();
```

8. Press `Enter` to start networking.

--- 

> [!IMPORTANT]
> To stop the script, just refresh the page.

---

## ⚠️ Important Reminders

- This script is **not officially supported by LinkedIn**, so use it responsibly.
- Be mindful of LinkedIn’s **daily/weekly connection request limits** to avoid detection.
- **Adding personalized messages** to connection requests can significantly boost acceptance rates.

---

## ⭐ Pro Tips for Power Users

1. **Fine-tune sleep timings** to mimic human behavior (e.g., randomize delays).
2. **Target strategically:** Narrow your search filters for more relevant connections.
3. **Manage your pending invites:** Clean up unaccepted requests regularly.
4. Break sessions into **short intervals** to avoid triggering spam flags.

---

## 🚫 Legal Disclaimer

This tool is intended for **educational purposes only**.  
By using it, you agree to take full responsibility for any risks, including potential account restrictions.  
The creator assumes no liability for misuse.

---

## 🌟 Like This? Show Some Love!

If you found this project helpful, show your support:

- ⭐ **Star this repo** to spread the word and support the project!
- Connect with us and follow for more tips, tools, and updates:

### 📌 Owner:
- [LinkedIn](https://www.linkedin.com/in/sam-bent/)
- [Twitter/X](https://twitter.com/DoingFedTime)
- [Instagram](https://www.instagram.com/sambentoffical/)
- [YouTube](https://youtube.com/@sam_bent)
- [Rumble](https://rumble.com/c/DoingFedTime)
- Explore more automation ideas on my [website](https://www.sambent.com).

### 📌 Collaborator:
- [LinkedIn](https://www.linkedin.com/in/wardanadwimulia/)
- [Instagram](https://www.instagram.com/tulisajaudah/)

---

### What Changed:
1. **Language Support**: Included a language `English` and `Indonesia` for broader accessibility.
2. **Improved Key Features Section**: Updated the "What This Bot Does" section with a concise, bullet-point breakdown of features, renamed it "Key Features," and highlighted the bot's built-in checks for LinkedIn limits.
3. **Code Improvements**: Updated the script to handle LinkedIn invitation limits gracefully with a clearer logic flow and logging system.
4. **Pro Tips for Power Users**: Expanded actionable advice for maximizing the script's effectiveness and minimizing risks.
