#!/usr/bin/env node

const config = require("./config.js");
const express=require('express');
const app=express();
const dateFormat = require('dateformat');
const morgan = require('morgan');
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(config.Ttoken, {polling: true});

bot.on('message', (msg) => {	// For testing the bot, and obtaining those chatIds, topic-ids and so on
        console.log("MSG:")
	console.log(msg);
	/*
	let form={};
	if (msg.reply_to_message) {
		form.reply_msg_id=msg.reply_to_message.message_thread_id;
		form.top_msg_id=msg.reply_to_message.message_thread_id;
		form.message_thread_id=msg.reply_to_message.message_thread_id;
        	bot.sendMessage(msg.chat.id, "Hallo "+msg.from.first_name+", i am alive",form);
	} else {
        	bot.sendMessage(msg.chat.id, "Hallo "+msg.from.first_name+", i am alive");
	}
	*/
});

morgan.token('remote-addr', function (req, res) {		// In case this thing works behind a reverse proxy
	var ffHeaderValue = req.headers['x-forwarded-for'];
	return ffHeaderValue || req.connection.remoteAddress;
});

app.disable('x-powered-by');
if (config.logging) {
	app.use(express.json());
	app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms'));
}

app.post('*', function(req, res){	// Fallback Route for all POSTs
	res.status(200).send("");
	console.log(req);
	check_action(req)
});

app.get('*', function(req, res){	// Fallback Route for all GETs
	res.status(200).send("");
	console.log(req.body);
});

app.listen(config.webport, () => {
	console.log('listener started on Port '+config.webport);
});

function inform_all(msg) {
	config.informChats.forEach(function(number) {
		if (number.mti) {				// Post to Subchannel (Telegram-Speak: "topic")?
			let form={};
			form.reply_msg_id=number.mti;
			form.top_msg_id=number.mti;
			form.message_thread_id=number.mti;
			bot.sendMessage(number.chatId,msg, form);
		} else {
			bot.sendMessage(number.chatId,msg);
		}
	});
}

function check_action(req) {
	if (req.body.pull_request) {
		let pr={};
		if (req.body.repository.full_name == config.reponame) {
			pr.action=req.body.action;
			pr.url=req.body.pull_request.html_url;
			pr.title=req.body.pull_request.title;
			pr.state=req.body.pull_request.state;
			pr.sender=req.body.sender.login;
			if ((pr.action == 'close') && (req.body.closed_at) && (req.body.merged_at) ){
				if (req.body.closed_at == req.body.merged_at) {
					pr.action = 'Merge completed ✅';
				}
			}
			msg=pr.action + " by "+pr.sender+" on \""+pr.title+"\": State: "+pr.state+". Details at "+pr.url;
			inform_all(msg);
		}
	};
}
