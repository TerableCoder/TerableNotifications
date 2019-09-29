module.exports = function TerableNotifications(mod) {
	const notifier = mod.require.notifier;
	const command = mod.command || mod.require.command;
	
	if(mod.proxyAuthor !== 'caali'){
		const options = require('./module').options
		if(options){
			const settingsVersion = options.settingsVersion
			if(settingsVersion){
				mod.settings = require('./' + (options.settingsMigrator || 'module_settings_migrator.js'))(mod.settings._version, settingsVersion, mod.settings)
				mod.settings._version = settingsVersion
			}
		}
	}
	
	mod.hook('S_WHISPER', 3, (event) => { 
		if(mod.game.me.is(event.player)) return;
		if(mod.settings.whisper && mod.settings.whisperafk){
			notifier.messageafk(`[${event.name}] ${event.message}`);
		} else if(mod.settings.whisper && !mod.settings.whisperafk){
			notifier.message(`[${event.name}] ${event.message}`);
		} else checkAtAt(event.message, event.name);
	});
	mod.hook('S_CHAT', 3, (event) => {
		if(mod.game.me.is(event.authorID)) return;
		if(mod.settings.blockedChannels.includes(event.channel)) return;
		checkAtAt(event.message, event.name);
	});
	
	function checkAtAt(msg, author){
		if(mod.settings.atat && (msg.includes(`@@`) || (mod.game.me.name != null &&  msg.includes(`@${mod.game.me.name}`)))){
			if(mod.settings.atatafk) notifier.messageafk(`[${author}] @@`);
			else notifier.message(`[${author}] @@`);
		}
	}
	
	command.add(['teran', 'tnotify', 'terablenotifications'], (p1, channel, aOrR) => {
		if(p1){
			p1 = p1.toLowerCase();
			if(p1 == "wafk" || "whisperafk") mod.settings.whisperafk = !mod.settings.whisperafk;
			else if(p1 == "w" || "whisper") mod.settings.whisper = !mod.settings.whisper;
			else if(p1 == "atafk" || "atatafk") mod.settings.atatafk = !mod.settings.atatafk;
			else if(p1 == "at" || "atat") mod.settings.atat = !mod.settings.atat;
			else if(p1 == "ch" || "channel"){
				if(channel){
				if(channel == "help" || "info"){
					command.message(`[Say-0] [Party-1] [Guild-2] [Area-3] [Trade-4] [Global-27]`);
					command.message(`[Party Notice-21] [Raid Notice-25] [Command?-22] [Whisper-7]`);
					command.message(`[Private Channel-11~18] [Bargain-19] [Announcement?-24]`);
					command.message(`[Megaphone-213] [Guild Advt-214] [Emote-26] [Greet-9] [Fishing Greet-10]`);
				} else if(!isNaN(channel) && aOrR){
					if(aOrR == "a" || aOrR == "add"){
						if (!mod.settings.blockedChannels.includes(channel)) { 
							mod.settings.blockedChannels.push(channel);
							message = `<font color="#56B4E9">Channel [${channel}] now muted</font>`;
						} else {
							message = `<font color="#56B4E9">Channel [${channel}] already muted</font>`;
						}
					} else if(aOrR == "r" || aOrR == "remove"){
						channel = Number(channel);
						if(mod.settings.blockedChannels.includes(channel)) {
							mod.settings.blockedChannels.splice(mod.settings.blockedChannels.indexOf(channel), 1);
							command.message(`<font color="#E69F00">Channel [${channel}] no longer muted</font>`);
						}
					} else{
						command.message(`Argument 3 incorrect. Correct format is teran ch 0 a`);
					}
				} else{
					command.message(`Argument 2 incorrect. Correct format is teran ch 0 a`);
				}
				} else{
					command.message(`Argument 2 incorrect. Correct format is teran ch 0 a`);
				}
			}
			else command.message("Invalid argument. Type 'teran w', 'teran wafk', 'teran at', 'teran atafk', or 'teran ch 0 a'");
			mod.saveSettings();
		} else command.message("Invalid argument. Type 'teran w', 'teran wafk', 'teran at', 'teran atafk', or 'teran ch 0 a");
		command.message(`Whisper notify is ${mod.settings.whisper ? "enabled" : "disabled"} & Whisper only while AFK is ${mod.settings.whisperafk ? "enabled" : "disabled"}.`);
		command.message(`@@ notify is ${mod.settings.atat ? "enabled" : "disabled"} & @@ only while AFK is ${mod.settings.atatafk ? "enabled" : "disabled"}.`);
		command.message(`[ ${mod.settings.blockedChannels} ]`);
	});
}