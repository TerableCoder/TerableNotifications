module.exports = function TerableNotifications(mod) {
	const notifier = mod.require.notifier;
	const command = mod.command || mod.require.command;
	let myName = null;
	
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
	mod.hook('S_LOGIN', 12, (event) => {
		myName = event.name;
    });
	mod.game.on('leave_game', () => {
        myName = null;
    });
	
	mod.hook('S_WHISPER', 2, (event) => { 
		if(mod.game.me.is(event.player)) return;
		if(mod.settings.whisper){
			if(mod.settings.whisperafk) notifier.messageafk(`[${event.authorName}] ${event.message}`);
			else notifier.message(`[${event.authorName}] ${event.message}`);
		}
		if(mod.settings.atat && (event.message.includes(`@@`) || (myName != null &&  event.message.includes(`@${myName}`)))){
			if(mod.settings.atatafk) notifier.message(`[${event.authorName}] @@`);
			else notifier.message(`[${event.authorName}] @@`);
		}
	});
	mod.hook('S_CHAT', 2, (event) => {
		if(mod.game.me.is(event.player)) return;
		if(mod.settings.atat && (event.message.includes(`@@`) || (myName != null &&  event.message.includes(`@${myName}`)))){
			if(mod.settings.atatafk) notifier.message(`[${event.authorName}] @@`);
			else notifier.message(`[${event.authorName}] @@`);
		}
	});
	mod.hook('S_PRIVATE_CHAT', 1, (event) => {
		if(mod.game.me.is(event.player)) return;
		if(mod.settings.atat && (event.message.includes(`@@`) || (myName != null &&  event.message.includes(`@${myName}`)))){
			if(mod.settings.atatafk) notifier.message(`[${event.authorName}] @@`);
			else notifier.message(`[${event.authorName}] @@`);
		}
	});
	
	command.add(['teran', 'tnotify', 'terablenotifications'], (p1) => {
		if(p1){
			p1 = p1.toLowerCase();
			if(p1 == "w" || "whisper") mod.settings.whisper = !mod.settings.whisper;
			if(p1 == "wafk" || "whisperafk") mod.settings.whisperafk = !mod.settings.whisperafk;
			else if(p1 == "at" || "atat") mod.settings.atat = !mod.settings.atat;
			else if(p1 == "atafk" || "atatafk") mod.settings.atatafk = !mod.settings.atatafk;
			else command.message("Invalid argument. Type 'teran w', 'teran wafk', 'teran at', or 'teran atafk'");
			mod.saveSettings();
		} else command.message("Invalid argument. Type 'teran w', 'teran wafk', 'teran at', or 'teran atafk'");
		command.message(`Whisper notify is ${mod.settings.whisper ? "enabled" : "disabled"} & Whisper only while AFK is ${mod.settings.whisperafk ? "enabled" : "disabled"}.`);
		command.message(`@@ notify is ${mod.settings.atat ? "enabled" : "disabled"} & @@ only while AFK is ${mod.settings.atatafk ? "enabled" : "disabled"}.`);
	});
}