## Simple notifier for PRs on github-repos to Telegram

### Installation
* git clone https://github.com/int2001/gh_bot.git
* npm install
* Rename and edit config.js.sample (see below)
* start the daemon by calling it `node ./hg_handler` or putting it into your favorite manager (like pm2)

### Getting started
#### Get Telegram-Key
* chat to "@botfather" at Telegram and follow his instructions
* get the Key and put it into config.js (TToken)
* start the script
* search at Telegram for your Bot, and start a conversation with it.
* look at console for "msg.chat.id" and put that id into the informChats-Array at config.js. Do the same for groups (after inviting the bot...) 

#### Setting Up github to notify the bot:
* go to "Settings"/"Webhooks" and add the URL, where this daemon is listening to (Adjust port and base_url at config.js to your needs)
* change the "reponame" at config.js to OWNER AND REPO-Name

This code is free and without warranty. Use at it is.
