/*
Code for tours.js
Coding done by Shadowfist
*/
tourschan = sys.channelId("Main")

if (typeof tours !== "object") {
	sys.sendAll("Creating new tournament object", tourschan)
	tours = {"queue": [], "globaltime": 0, "key": 0, "keys": [], "tour": {}, "history": [], "touradmins": [], "subscriptions": {}, "activetas": [], "activehistory": [], "tourmutes": {}}
}

var border = "»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»:";
var htmlborder = "<font color=#3DAA68><b>"+border+"</b></font>"
var tourcommands = ["/join: iscriviti al torneo",
					"/unjoin: annulla la tua iscrizione al torneo",
					"/queue: mostra la lista dei tornei programmati",
					"/viewround: mostra il tabellone aggiornato",
					"/history: mostra le tiers degli ultimi tornei",
					"/touradmins: elenca chi può far iniziare tornei",
					"/leaderboard [tier]: mostra la leaderbord, eventualmente specifica la tier",
					"/monthlyleaderboard [mese] [anno]: mostra la leaderbord, eventualmente specifica mese e anno (in inglese)",
					"/tourinfo [nick]: dà informazioni sui risultati di un giocatore",
					"/activeta: elenca i tour admin",
					"/rules: elenca le regole dei tornei",
					"/touralerts [on/off]: attiva o disattiva le notifiche per i tornei",
					"/addtouralert [tier] : aggiunge la notifica per la tier specificata",
					"/removetouralert [tier] : rimuove la notifica per la tier specificata"]
var touradmincommands = ["*** Parametri usabili ***",
					"Parametri usabili: 'gen=x'; 'mode=singles/doubles/triples'; 'type=single/double'.",
					"Esempio: '/tour CC 1v1:gen=3 mode=doubles type=double' fa partire un torneo RSE 1vs1 a doppia eliminazione.",
					"/tour [tier]:[parametri]: fa partire il torneo specificato.",
					"/tourmute [nick]:[motivo]:[minuti]: muta un cretino.",
					"/tourunmute [nick]: smuta un ex-cretino.",
					"/tourmutes: elenca i cretini che sono mutati.",
					"/endtour [tour]: interrompe il torneo in quella tier.",
					"/sub [nick in]:[nick out]: sostituisce in con out.",
					"/dq [nick]: squalifica un giocatore.",
					"/remove [tour/numero]: rimuove un torneo dalla coda. Se viene specificato un numero, rimuoverà il torneo a quel numero. Se viene specificata una tier, toglierà il torneo in quella tier, partendo dall'ultimo.",
					"/cancelbattle [nick]: permette il rematch tra due giocatori (basta usarlo su uno dei due; poi quel giocatore forfeitta e non viene calcolato).",
					"/config: Config Settings",
					"/configset [var]:[value]: changes config settings",
					"/passta [nick]: passa l'amministrazione del torneo ad un altro utente.",
					"*** COMANDI ADMIN+ ***",
					"/touradmin [nick]: rende qualcuno un tour admin.",
					"/tourdeadmin [nick]: toglie un tour admin e lo rende utente.",
					// "/forcestart: chiude le iscrizioni e fa partire il primo round.",
					"/start: fa iniziare il torneo successivo in coda.",
					"/push [nick]: inserisce manualmente un giocatore nel torneo.",
					"/tahistory [giorni]: mostra l'attività dei tour admins.",
					"/updatewinmessages: aggiorna i messaggi di vittoria dal web",
					"/stopautostart: se non ci sono tornei in corso, evita che ne vengano creati altri automatici fino al successivo torneo avviato manualmente.",
					"*** COMANDI OWNER+ ***",
					"/clearrankings: cancella la ladder dei tornei",
					"/evalvars: checks the current variable list for tours",
					"/fullmonthlyleaderboard [mese] [anno]: mostra la leaderbord, eventualmente specifica mese e anno (in inglese)",
					"/fullleaderboard [tier]: mostra la leaderboard"]
var tourrules = ["*** TOURNAMENT GUIDELINES ***",
				"Se non vuoi essere mutato/a, non contravvenire a queste semplici regole:",
				"#1: Spoilerare il team dell'avversario in un match non Challenge Cup comporta la squalifica.",
				"- Spoilerare significa rivelare ad altri qualcosa che dovrebbe essere tenuta segreta, come per esempio il team che sta usando.",
				"- Si può sempre assistere alle finali dei tornei.",
				"#2: Se ti iscrivi al torneo, fai in modo di avere almeno un team pronto da usare, altrimenti ti squalifichiamo.",
				"#3: Evita di chiedere continuamente in chat o in PM di creare un torneo; ogni 15 minuti il Server ne indice uno.",
				"#4: Non abusare dei comandi.",
				"#5: Non abbandonare un torneo per iscriverti ad un altro.",
				"#6: Non aspettare il timeout; se stai perdendo e non puoi fare niente, usa il tasto Forfeit.",
				"#7: Se ti serve aiuto chiedi ad uno dei tour admin attivi (/activeta per sapere chi sono)",
				"#8: Le versioni di PO precedenti alla 1.0.60 hanno un bug che fa crashare il programma.",
				"- Assicurati di aver aggiornato PO alla versione 1.0.60 o successiva."]
// Debug Messages
function sendDebugMessage(message, chan) {
	if (chan === tourschan && Config.Tours.debug && sys.existChannel(sys.channel(tourserrchan))) {
		sys.sendAll(Config.Tours.tourbot+message,tourserrchan)
	}
}

// Tour Admin Activity
function addTourActivity(src) {
	if (tours.activetas.indexOf(sys.name(src).toLowerCase()) == -1) {
		tours.activetas.push(sys.name(src).toLowerCase());
	}
}

// Will escape "&", ">", and "<" symbols for HTML output.
function html_escape(text)
{
    var m = text.toString();
    if (m.length > 0) {
        return m.replace(/\&/g, "&amp;").replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
    }else{
        return "";
    }
}

function cmp(x1, x2) {
    //sys.sendAll("Comparing " + JSON.stringify(x1) + " --- " + JSON.stringify(x2), staffchannel);
	if (x1 === undefined || x2 === undefined) {
		return false;
	}
    else if ((x1+'').toLowerCase() === (x2+'').toLowerCase()) {
		return true;
	}
	else return false;
}

function getFullTourName(key) {
	if (tours.tour[key].parameters.gen != "default") {
		return getSubgen(tours.tour[key].parameters.gen,true) + " " + tours.tour[key].tourtype
	}
	else return tours.tour[key].tourtype;
}

function modeOfTier(tier) {
	if (tier.indexOf("Doubles") != -1 || ["JAA", "VGC 2009", "VGC 2010", "VGC 2011", "VGC 2012"].indexOf(tier) != -1) {
		return "Doubles";
	}
	else if (tier.indexOf("Triples") != -1) {
		return "Triples";
	}
	return "Singles";
}

/* Gets subgen. Name is data being converted, getLongName is a boolean value.
If getLongName is true it will convert to the readable format, otherwise it will return the short format
Returns false if not found */
function getSubgen(name, getLongName) {
	var subgens = {
		"Red/Blue": "1-0",
		"RB": "1-0",
		"Yellow": "1-1",
		"RBY": "1-1",
		"RBY Stadium": "1-2",
		"Stadium": "1-2",
		"RBY Tradebacks": "1-3",
		"Gold/Silver": "2-0",
		"GS": "2-0",
		"Crystal": "2-1",
		"GSC": "2-1",
		"GSC Stadium": "2-2",
		"Stadium 2": "2-2",
		"Stadium2": "2-2",
		"Ruby/Sapphire": "3-0",
		"RS": "3-0",
		"Colosseum": "3-1",
		"FireRed/LeafGreen": "3-2",
		"FRLG": "3-2",
		"RSE": "3-3",
		"Emerald": "3-3",
		"XD": "3-4",
		"Diamond/Pearl": "4-0",
		"DP": "4-0",
		"Platinum": "4-1",
		"DPPt": "4-1",
		"HeartGold/SoulSilver": "4-2",
		"HGSS": "4-2",
		"Black/White": "5-0",
		"BW": "5-0",
		"Black/White 2": "5-1",
		"BW2": "5-1",
		"1": "1-3",
		"2": "2-2",
		"3": "3-4",
		"4": "4-2",
		"5": "5-1"
	}
	if (getLongName) {
		for (var x in subgens) {
			if (cmp(name,subgens[x])) {
				return x;
			}
		}
	}
	else {
		for (var y in subgens) {
			if (cmp(name,y)) {
				return subgens[y];
			}
		}
	}
	return false;
}

// handles time and outputs in d/h/m/s format
// eg 3d 5h 16m 22s
function converttoseconds(string) {
	var tmp = string.split(" ")
	var totaltime = 0
	try {
		for (var n in tmp) {
			var thestring = tmp[n]
			var lastchar = thestring.charAt(thestring.length - 1).toLowerCase()
			var timestring = parseInt(thestring.substr(0, thestring.length - 1))
			if (isNaN(timestring)) {
				continue;
			}
			else if (lastchar == "y") {
				totaltime += 365*24*60*60*timestring;
			}
			else if (lastchar == "w") {
				totaltime += 7*24*60*60*timestring;
			}
			else if (lastchar == "d") {
				totaltime += 24*60*60*timestring;
			}
			else if (lastchar == "h") {
				totaltime += 60*60*timestring;
			}
			else if (lastchar == "m") {
				totaltime += 60*timestring;
			}
			else if (lastchar == "s") {
				totaltime += timestring;
			}
			else {
				continue;
			}
		}
	}
	catch (err) {
		return "Non è un numero";
	}
	return totaltime;
}

// handles time and outputs in d/h/m/s format
function time_handle(time) { //time in seconds
	var day = 60*60*24;
	var hour = 60*60;
	var minute = 60;
	if (time <= 0) {
		return "FINE DEL TEMPO"
	}
	var timedays = parseInt(time/day);
	var timehours = (parseInt(time/hour))%24;
	var timemins = (parseInt(time/minute))%60
	var timesecs = (parseInt(time))%60
	var output = "";
	if (timedays >= 1) {
		if (timedays == 1) {
			output = timedays + " giorno";
		}
		else {
			output = timedays + " giorni";
		}
		if (timehours >=1 || timemins >=1 || timesecs >=1) {
			output = output + ", ";
		}
	}
	if (timehours >= 1) {
		if (timehours == 1) {
			output = output + timehours +  " ora";
		}
		else {
			output = output + timehours +  " ore";
		}
		if (timemins >=1 || timesecs >=1) {
			output = output + ", ";
		}
	}
	if (timemins >= 1) {
		if (timemins == 1) {
			output = output + timemins +  " minuto";
		}
		else {
			output = output + timemins +  " minuti";
		}
		if (timesecs >=1) {
			output = output + ", ";
		}
	}
	if (timesecs >= 1) {
		if (timesecs == 1) {
			output = output + timesecs +  " secondo";
		}
		else {
			output = output + timesecs +  " secondi";
		}
	}
	return output;
}

// Tournaments

// This function will get a user's current tournament points overall

function getTourWinMessages() {
	var content = sys.getFileContent("tourwinverbs.txt");
	tourwinmessages = content.split("\n");
}

function getExtraPoints(player) {
	try {
		var data = sys.getFileContent("tourscores.txt");
		var array = data.split("\n");
		var score = 0;
		for (var n in array) {
			var scores = array[n].split(":::",2);
			if (player.toLowerCase() === scores[0].toLowerCase()) {
				score = parseInt(scores[1]);
				break;
			}
		}
		return score;
	}
	catch (e) {
		return 0;
	}
}

// This function will get a user's current tournament points in a tier
function getExtraTierPoints(player, tier) {
	try {
		var data = sys.getFileContent("tourscores_"+tier.replace(/ /g,"_")+".txt");
		var array = data.split("\n");
		var score = 0;
		for (var n in array) {
			var scores = array[n].split(":::",2);
			if (player.toLowerCase() === scores[0].toLowerCase()) {
				score = parseInt(scores[1]);
				break;
			}
		}
		return score;
	}
	catch (e) {
		return 0;
	}
}

// saving tour admins list
function saveTourKeys() {
	sys.writeToFile("touradmins.txt", "");
	var tal = tours.touradmins;
	for (var n=0;n<tal.length;n++) {
		sys.appendToFile("touradmins.txt", tal[n]);
		if (n != tal.length-1) {
			sys.appendToFile("touradmins.txt", ":::");
		}
	}
	return;
}

// This function will get a tier's clauses in readable format
function getTourClauses(tier) {
	// force Self-KO clause
	var tierclauses = sys.getClauses(tier) > 255 ? sys.getClauses(tier) : sys.getClauses(tier)+256;
	var clauselist = ["Sleep Clause", "Freeze Clause", "Disallow Spects", "Item Clause", "Challenge Cup", "No Timeout", "Species Clause", "Wifi Battle", "Self-KO Clause"];
	var neededclauses = [];
	for (var c=0;c<9;c++) {
		var denom = Math.pow(2,c+1)
		var num = Math.pow(2,c)
		if (tierclauses%denom >= num) {
			neededclauses.push(clauselist[c]);
		}
	}
	return neededclauses.join(", ");
}

function clauseCheck(tier, issuedClauses) {
	// force Self-KO clause every time
	var requiredClauses = sys.getClauses(tier) > 255 ? sys.getClauses(tier) : sys.getClauses(tier)+256;
	var clauselist = ["Sleep Clause", "Freeze Clause", "Disallow Spects", "Item Clause", "Challenge Cup", "No Timeout", "Species Clause", "Wifi Battle", "Self-KO Clause"];
	var clause1 = false;
	var clause2 = false;
	var missing = [];
	var extra = [];
	for (var c=0;c<9;c++) {
		var denom = Math.pow(2,c+1);
		var num = Math.pow(2,c);
		// don't check for disallow spects in non CC tiers , it's checked manually
		if (c == 2 && ["Challenge Cup", "CC 1v1", "Wifi CC 1v1"].indexOf(tier) == -1) {
			continue;
		}
		if (requiredClauses%denom >= num) {
			clause1 = true;
		}
		else {
			clause1 = false;
		}
		if (issuedClauses%denom >= num) {
			clause2 = true;
		}
		else {
			clause2 = false;
		}
		if ((clause1 && clause2) || (!clause1 && !clause2)) {
			continue;
		}
		else if (clause1 && !clause2) {
			missing.push(clauselist[c]);
			continue;
		}
		else if (!clause1 && clause2) {
			extra.push(clauselist[c]);
			continue;
		}
		else {
			sys.sendAll(Config.Tours.tourbot+"Controllo clauses fallito...", tourserrchan)
			break;
		}
	}
	return {"missing": missing, "extra": extra}
}

// Is name x a sub?
function isSub(name) {
	try {
		if (name === null) {
			return false;
		}
		else if (name.indexOf("~Sub") === 0) {
			return true;
		}
		else return false;
	}
	catch (err) {
		sys.sendAll("Errore nel determinare se "+name+" è un sostituto, "+err, tourserrchan);
		return false;
	}
}

// Sends a message to all tour auth and players in the current tour
function sendAuthPlayers(message,key) {
	for (var x in sys.playersOfChannel(tourschan)) {
		var arr = sys.playersOfChannel(tourschan);
		if (isTourAdmin(arr[x]) || tours.tour[key].players.indexOf(sys.name(arr[x]).toLowerCase()) != -1) {
			sys.sendMessage(arr[x], message, tourschan);
		}
	}
}

// Sends a html  message to all tour auth and players in the current tour
function sendHtmlAuthPlayers(message,key) {
	var arr = sys.playersOfChannel(tourschan);
	for (var x in arr) {
		if (isTourAdmin(arr[x]) || tours.tour[key].players.indexOf(sys.name(arr[x]).toLowerCase()) != -1) {
			// send highlighted name in bracket
			var htmlname = html_escape(sys.name(arr[x]));
			var regex1 = "<td align='right'>"+htmlname+"</td>";
			var newregex1 = "<td align='right'><font style='BACKGROUND-COLOR: #FFAAFF'>"+htmlname+"</font><ping/></td>";
			var regex2 = "<td>"+htmlname+"</td>";
			var newregex2 = "<td><font style='BACKGROUND-COLOR: #FFAAFF'>"+htmlname+"</font><ping/></td>";
			var newmessage = message.replace(regex1,newregex1).replace(regex2,newregex2);
			sys.sendHtmlMessage(arr[x], newmessage, tourschan);
		}
	}
}

// Send a flashing bracket
function sendFlashingBracket(message,key) {
	var arr = sys.playersOfChannel(tourschan);
	for (var x in arr) {
		var newmessage = message;
		if (tours.tour[key].players.indexOf(sys.name(arr[x]).toLowerCase()) != -1) {
			// send highlighted name in bracket
			var htmlname = html_escape(sys.name(arr[x]));
			var regex1 = "<td align='right'>"+htmlname+"</td>";
			var newregex1 = "<td align='right'><font style='BACKGROUND-COLOR: #FFAAFF'>"+htmlname+"</font><ping/></td>";
			var regex2 = "<td>"+htmlname+"</td>";
			var newregex2 = "<td><font style='BACKGROUND-COLOR: #FFAAFF'>"+htmlname+"</font><ping/></td>";
			newmessage = message.replace(regex1,newregex1).replace(regex2,newregex2);
		}
		sys.sendHtmlMessage(arr[x], newmessage, tourschan);
	}
}

// Sends a message to all tour auth
function sendAllTourAuth(message) {
	for (var x in sys.playersOfChannel(tourschan)) {
		var arr = sys.playersOfChannel(tourschan);
		if (isTourAdmin(arr[x])) {
			sys.sendMessage(arr[x], message, tourschan);
		}
	}
}

/* Get a config value 
Returns default if value doesn't exist*/
function getConfigValue(file, key) {
	try {
		var defaultvars = {
			maxqueue: 4,
			maxarray: 1023,
			maxrunning: 3,
			toursignup: 100,
			tourdq: 180,
			subtime: 90,
			touractivity: 100,
			breaktime: 900,
			absbreaktime: 600,
			remindertime: 30,
			channel: "Main",
			errchannel: "Developer's Den",
			tourbotcolour: "#3DAA68",
			minpercent: 5,
			version: "1.321b",
			debug: false,
			points: true
		}
		var configkeys = sys.getValKeys(file);
		if (configkeys.indexOf(key) == -1) {
			sys.sendAll("No tour config data detected for '"+key+"', getting default value", tourschan)
			return defaultvars[key];
		}
		else {
			return sys.getVal(file, key);
		}
	}
	catch (err) {
		sys.sendAll("Error in getting config value '"+key+"': "+err, tourserrchan)
		return null;
	}
}

function initTours() {
	// config object
	Config.Tours = {
		maxqueue: parseInt(getConfigValue("tourconfig.txt", "maxqueue")),
		maxarray: 1023,
		maxrunning: parseInt(getConfigValue("tourconfig.txt", "maxrunning")),
		toursignup: parseInt(getConfigValue("tourconfig.txt", "toursignup")),
		tourdq: parseInt(getConfigValue("tourconfig.txt", "tourdq")),
		subtime: parseInt(getConfigValue("tourconfig.txt", "subtime")),
		activity: parseInt(getConfigValue("tourconfig.txt", "touractivity")),
		tourbreak: parseInt(getConfigValue("tourconfig.txt", "breaktime")),
		abstourbreak: parseInt(getConfigValue("tourconfig.txt", "absbreaktime")),
		reminder: parseInt(getConfigValue("tourconfig.txt", "remindertime")),
		channel: "Main",
		errchannel: "Developer's Den",
		tourbotcolour: "#3DAA68",
		minpercent: parseInt(getConfigValue("tourconfig.txt", "minpercent")),
		version: "1.321b",
		debug: false,
		points: true
	}
	if (Config.Tours.tourbot === undefined) {
	    // CHANGE
		// nome di default del tourbot
		Config.Tours.tourbot = "\u00B1tourbot: ";
	}
	tourschan = sys.channelId("Main");
	tourserrchan = sys.channelId("Indigo Plateau");
	if (sys.existChannel(Config.Tours.channel)) {
		tourschan = sys.channelId(Config.Tours.channel)
	}
	if (sys.existChannel(Config.Tours.errchannel)) {
		tourserrchan = sys.channelId(Config.Tours.errchannel)
	}
	if (typeof tours != "object") {
		sys.sendAll("Creating new tournament object", tourschan)
		tours = {"queue": [], "globaltime": 0, "key": 0, "keys": [], "tour": {}, "history": [], "touradmins": [], "subscriptions": {}, "activetas": [], "activehistory": [], "tourmutes": {}}
	}
	else {
		if (!tours.hasOwnProperty('queue')) tours.queue = [];
		if (!tours.hasOwnProperty('globaltime')) tours.globaltime = 0;
		if (!tours.hasOwnProperty('key')) tours.key = [];
		if (!tours.hasOwnProperty('keys')) tours.keys = [];
		if (!tours.hasOwnProperty('tour')) tours.tour = {};
		if (!tours.hasOwnProperty('history')) tours.history = [];
		if (!tours.hasOwnProperty('touradmins')) tours.touradmins = [];
		if (!tours.hasOwnProperty('subscriptions')) tours.subscriptions = {};
		if (!tours.hasOwnProperty('activetas')) tours.activetas = [];
		if (!tours.hasOwnProperty('activehistory')) tours.activehistory = [];
		if (!tours.hasOwnProperty('tourmutes')) tours.tourmutes = {};
	}
	try {
		getTourWinMessages()
		//sys.sendAll("Win messages added", tourschan)
	}
	catch (e) {
		// use a sample set of win messages
		tourwinmessages = ["ha battuto", "ha sconfitto", "ha ownato", "ha haxato", "ha sculato", "ha predictato ogni mossa e ha vinto contro", "ha piallato", "ha arato", "ha distrutto"];
		sys.sendAll("Uso i messaggi di default, non ne ho trovati altri.", tourschan);
	}
	try {
		var data = (sys.getFileContent("touradmins.txt")).split(":::");
		for (var d=0;d<data.length;d++) {
			var info = data[d]
			if (info === undefined || info == "") {
				data.splice(d,1)
			}
		}
		tours.touradmins = data
	}
	catch (e) {
		sys.sendAll("No tour admin data detected, leaving blank", tourschan);
	}
	try {
		loadTourMutes()
	}
	catch (e) {
		sys.sendAll("No tourmute data detected, leaving blank", tourschan);
	}
	sys.sendMessage(src, "±tourbot: La versione "+Config.Tours.version+" degli script da torneo è stata caricata con successo!", tourschan);
}

/* Tournament Step Event
Used for things such as
- sending reminders
- starting new tours automatically
- disqualifying/reminding inactive players
- removing subs */
function tourStep() {
	var canautostart = true;
	if (parseInt(sys.time())%3600 === 0) {
		var now = new Date()
		var comment = now + " ~ " + tours.activetas.join(", ")
		tours.activehistory.unshift(comment)
		if (tours.activehistory.length > 168) {
			tours.activehistory.pop()
		}
		tours.activetas = [];
		// clear out tourmutes list
		for (var m in tours.tourmutes) {
			if (tours.tourmutes[m].expiry <= parseInt(sys.time())) {
				delete tours.tourmutes[m];
				saveTourMutes();
			}
		}
	}
	for (var x in tours.tour) {
		if (tours.tour[x].time-parseInt(sys.time()) <= 10) {
			sendDebugMessage("Il tempo rimasto nel torneo "+getFullTourName(x)+" è: "+time_handle(tours.tour[x].time-parseInt(sys.time()))+"; State: "+tours.tour[x].state,tourschan);
		}
		if (tours.tour[x].state == "signups") {
			if (tours.tour[x].time <= parseInt(sys.time())) {
				tourinitiate(x)
				continue;
			}
			var variance = calcVariance()
			tours.globaltime = parseInt(sys.time()) + parseInt(Config.Tours.abstourbreak/variance) // default 10 mins b/w signups, + 5 secs per user in chan
			continue;
		}
		if (tours.tour[x].state == "subround" && tours.tour[x].time <= parseInt(sys.time())) {
			tours.tour[x].time = parseInt(sys.time())+Config.Tours.tourdq-Config.Tours.subtime;
			removesubs(x);
			continue;
		}
		if (tours.tour[x].state == "subround" || tours.tour[x].state == "round" || tours.tour[x].state == "final") {
			if (tours.tour[x].time <= parseInt(sys.time()) && (parseInt(sys.time())-tours.tour[x].time)%60 === 0 && tours.tour[x].state != "subround") {
				removeinactive(x);
				continue;
			}
			if ((tours.tour[x].time-(tours.tour[x].state == "subround" ? Config.Tours.subtime : Config.Tours.tourdq)+Config.Tours.reminder) == parseInt(sys.time())) {
				sendReminder(x);
				continue;
			}
		}
		if (tours.tour[x].state == "signups" || tours.tour[x].state == "subround") {
			canautostart = false;
		}
	}
	if (calcPercentage() >= Config.Tours.minpercent) {
		canautostart = false;
	}
	if (tours.globaltime !== 0 && tours.globaltime <= parseInt(sys.time()) && (Config.Tours.maxrunning > tours.keys.length || canautostart)) {
		if (tours.queue.length > 0) {
			var data = tours.queue[0].split(":::",5);
			var tourtostart = data[0];
			var starter = data[1];
			var parameters = {"mode": data[2], "gen": data[3], "type": data[4]}
			tours.queue.splice(0,1);
			tourstart(tourtostart,starter,tours.key,parameters);
			tours.globaltime = parseInt(sys.time()) + 1200;
		}
		else if (tours.keys.length === 0) {
			// start a cycle from tourarray
			var tourarray = ["BW2 OU"];
			var doubleelimtiers = ["1v1 Gen5"];
			var allgentiers = ["Challenge Cup", "1v1 Challenge Cup", "Metronome"];
			var tourtostart = tourarray[tours.key%tourarray.length];
			var tourtype = doubleelimtiers.indexOf(tourtostart) != -1 ? "double" : "single";
			tourstart(tourtostart,"~~Server~~",tours.key,{"mode": modeOfTier(tourtostart), "gen": (allgentiers.indexOf(tourtostart) != -1 ? "5-1" : "default"), "type": tourtype});
			tours.globaltime = parseInt(sys.time()) + 1200;
		}
	}
}

// Battle Start
function tourBattleStart(src, dest, clauses, rated, mode, bid) {
	var name1 = sys.name(src).toLowerCase();
	var name2 = sys.name(dest).toLowerCase();
	var key = null;
	for (var x in tours.tour) {
		if (tours.tour[x].players.indexOf(sys.name(src).toLowerCase()) != -1) {
			var srcisintour = false;
			if (tours.tour[x].losers.indexOf(sys.name(src).toLowerCase()) == -1) {
				srcisintour = true;
			}
			if (tours.tour[x].parameters.type == "double") {
				if (tours.tour[x].winbracket.indexOf(sys.name(src).toLowerCase()) != -1 || tours.tour[x].round == 1) {
					srcisintour = true;
				}
			}
			if (srcisintour) {
				key = x;
				break;
			}
		}
		if (tours.tour[x].players.indexOf(sys.name(dest).toLowerCase()) != -1) {
			var destisintour = false;
			if (tours.tour[x].losers.indexOf(sys.name(dest).toLowerCase()) == -1) {
				destisintour = true;
			}
			if (tours.tour[x].parameters.type == "double") {
				if (tours.tour[x].winbracket.indexOf(sys.name(dest).toLowerCase()) != -1 || tours.tour[x].round == 1) {
					destisintour = true;
				}
			}
			if (destisintour) {
				key = x;
				break;
			}
		}
	}
	if (key === null) return false;
	if (rated) return false;
	// only recognise a battle from round 1 onwards
	if (tours.tour[key].players.indexOf(name1) > -1 && tours.tour[key].players.indexOf(name2) > -1 && tours.tour[key].round >= 1) {
		tours.tour[key].battlers.push(name1, name2);
		tours.tour[key].active[name1] = "Battle";
		tours.tour[key].active[name2] = "Battle"; // this avoids dq later since they made an attempt to start
		if (tours.tour[key].state == "final") {
			// CHANGE
			//sys.sendHtmlAll("<font color='"+Config.Tours.tourbotcolour+"'><timestamp/> <b>"+html_escape(Config.Tours.tourbot)+"</b></font> <a href='po:watch/"+bid+"'>LA FINALE DEL TORNEO "+getFullTourName(key)+" TRA <b>"+html_escape(sys.name(src))+"</b> E <b>"+html_escape(sys.name(dest))+"</b> HA INIZIO!</a>",tourschan);
			sys.sendHtmlAll("<font color='"+Config.Tours.tourbotcolour+"'><timestamp/> <b>"+html_escape(Config.Tours.tourbot)+"</b></font> <a href='po:watch/"+bid+"'>LA FINALE DEL TORNEO "+getFullTourName(key)+" TRA <b>"+html_escape(sys.name(src))+"</b> E <b>"+html_escape(sys.name(dest))+"</b> HA INIZIO!</a>",0);
		}
		return true;
	}
	return false;
}

// battle ending functions; called from afterBattleEnd
function tourBattleEnd(winner, loser, result) {
	var winname = sys.name(winner).toLowerCase();
	var losename = sys.name(loser).toLowerCase();
	var key = null;
	for (var x in tours.tour) {
		if (isInSpecificTour(winname, x)) {
			key = x;
			break;
		}
		if (isInSpecificTour(losename, x)) {
			key = x;
			break;
		}
	}
	if (key === null) return;
	/* For tournament matches */
	if (tours.tour[key].players.indexOf(winname) > -1 && tours.tour[key].players.indexOf(losename) > -1) {
		var winindex = tours.tour[key].battlers.indexOf(winname);
		if (winindex != -1) tours.tour[key].battlers.splice(winindex,1);
		var loseindex = tours.tour[key].battlers.indexOf(losename);
		if (loseindex != -1) tours.tour[key].battlers.splice(loseindex,1);
		if (winindex == -1 || loseindex == -1) {
			return;
		}
		if (result == "tie") {
			sys.sendAll(Config.Tours.tourbot+"La partita tra "+winname+" e "+losename+" è finita con un pareggio; che i due giocatori ripetano la partita!", tourschan)
			return;
		}
		battleend(winner, loser, key);
	}
}

// Challenge Issuing Functions
function tourChallengeIssued(src, dest, clauses, rated, mode, team, destTier) {
	var key = null;
	var srcindex = null;
	var destindex = null;
	for (var x in tours.tour) {
		if (tours.tour[x].players.indexOf(sys.name(src).toLowerCase()) != -1) {
			var srcisintour = false;
			if (tours.tour[x].losers.indexOf(sys.name(src).toLowerCase()) == -1) {
				srcisintour = true;
			}
			if (tours.tour[x].parameters.type == "double") {
				if (tours.tour[x].winbracket.indexOf(sys.name(src).toLowerCase()) != -1 || tours.tour[x].round == 1) {
					srcisintour = true;
				}
			}
			if (srcisintour) {
				key = x;
				break;
			}
		}
		if (tours.tour[x].players.indexOf(sys.name(dest).toLowerCase()) != -1) {
			var destisintour = false;
			if (tours.tour[x].losers.indexOf(sys.name(dest).toLowerCase()) == -1) {
				destisintour = true;
			}
			if (tours.tour[x].parameters.type == "double") {
				if (tours.tour[x].winbracket.indexOf(sys.name(dest).toLowerCase()) != -1 || tours.tour[x].round == 1) {
					destisintour = true;
				}
			}
			if (destisintour) {
				key = x;
				break;
			}
		}
	}
	if (key !== null) {
		srcindex = tours.tour[key].players.indexOf(sys.name(src).toLowerCase());
		destindex = tours.tour[key].players.indexOf(sys.name(dest).toLowerCase());
	}
	if ((srcindex != -1 || destindex != -1) && srcindex != null && destindex != null) {
		var tcomment = isValidTourBattle(src,dest,clauses,mode,team,destTier,key,true);
		if (tcomment != "Valid") {
			sys.sendMessage(src, Config.Tours.tourbot + tcomment);
			return true;
		}
		markActive(src);
		return false;
	}
	else return false;
}

// Tournament Command Handler
function tourCommand(src, command, commandData) {
	try {
		if (isTourOwner(src)) {
			if (command == "clearrankings") {
				sys.writeToFile("tourscores.txt", "");
				sys.writeToFile("tourdetails.txt", "");
				var tiers = sys.getTierList();
				for (var x in tiers) {
					sys.writeToFile("tourscores_"+tiers[x].replace(/ /g,"_")+".txt","");
				}
				sys.sendAll(Config.Tours.tourbot+sys.name(src)+" ha cancellato il ranking dei tornei!",tourschan);
				return true;
			}
			if (command == "resettours") {
				tours = {"queue": [], "globaltime": 0, "key": 0, "keys": [], "tour": {}, "history": [], "touradmins": [], "subscriptions": {}, "activetas": [], "activehistory": [], "tourmutes": {}};
				sys.sendAll(Config.Tours.tourbot+sys.name(src)+" ha resettato il sistema dei tornei!",tourschan);
				return true;
			}
			/*if (command == "clearmonthrankings") { // not needed
				var now = new Date()
				var themonths = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "decemeber"]
				var monthlyfile = "tourmonthscore_"+themonths[now.getUTCMonth()]+"_"+now.getUTCFullYear()+".txt"
				sys.writeToFile(monthlyfile, "")
				sys.sendAll(Config.Tours.tourbot+sys.name(src)+" ha cancellato il ranking di questo mese!",tourschan)
				return true;
			}*/
			if (command == "evalvars") {
				dumpVars(src);
				return true;
			}
			/*if (command == "sendall") { // unnecessary
				sys.sendAll(sys.name(src) + ": " + commandData, tourschan);
				return true;
			}*/
			if (command == "fullleaderboard") {
				try {
					if (commandData == "") {
						var rankings = sys.getFileContent("tourscores.txt").split("\n");
					}
					else {
						var tiers = sys.getTierList();
						var found = false;
						for (var x in tiers) {
							if (tiers[x].toLowerCase() == commandData.toLowerCase()) {
								var tourtier = tiers[x];
								found = true;
								break;
							}
						}
						if (!found) {
							throw ("Tier non valida");
						}
						var rankings = sys.getFileContent("tourscores_"+tourtier.replace(/ /g,"_")+".txt").split("\n")
					}
					var list = [];
					for (var p in rankings) {
						if (rankings[p] == "") continue;
						var rankingdata = rankings[p].split(":::",2);
						if (rankingdata[1] < 1) continue;
						list.push([rankingdata[1], rankingdata[0]]);
					}
					list.sort(function(a,b) { return b[0] - a[0] ; });
					sys.sendMessage(src, "*** RANKING DEI TORNEI "+(commandData != "" ? "("+commandData+") " : "")+"***",tourschan);
					for (var x=0; x<65536; x++) {
						if (x >= list.length) break;
						sys.sendMessage(src, "#"+(x+1)+": "+(list[x])[1]+" ~ "+(list[x])[0]+" point"+((list[x])[0] != 1 ? "s" : ""),tourschan);
					}
				}
				catch (err) {
					if (err == "Tier non valida") {
						sys.sendMessage(src, Config.Tours.tourbot+commandData+" non è una tier o è scritta male!",tourschan);
					}
					else {
						sys.sendMessage(src, Config.Tours.tourbot+"N/D!",tourschan);
					}
				}
				return true;
			}
			if (command == "fullmonthlyleaderboard") {
				try {
					var now = new Date()
					var themonths = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "decemeber"];
					if (commandData == "") {
						var monthlyfile = "tourmonthscore_"+themonths[now.getUTCMonth()]+"_"+now.getUTCFullYear()+".txt";
					}
					else {
						var monthdata = commandData.toLowerCase().split(" ",2);
						if (monthdata.length == 1) {
							monthdata.push(now.getUTCFullYear());
						}
						var monthlyfile = "tourmonthscore_"+monthdata[0]+"_"+monthdata[1]+".txt";
					}
					var rankings = sys.getFileContent(monthlyfile).split("\n")
					var list = [];
					for (var p in rankings) {
						if (rankings[p] == "") continue;
						var rankingdata = rankings[p].split(":::",2);
						if (rankingdata[1] < 1) continue;
						list.push([rankingdata[1], rankingdata[0]]);
					}
					list.sort(function(a,b) { return b[0] - a[0] ; });
					sys.sendMessage(src, "*** RANKING MENSILE COMPLETO (TORNEI) "+(commandData != "" ? "("+commandData+") " : "")+"***",tourschan);
					for (var x=0; x<65536; x++) {
						if (x >= list.length) break;
						sys.sendMessage(src, "#"+(x+1)+": "+(list[x])[1]+" ~ "+(list[x])[0]+" point"+((list[x])[0] != 1 ? "s" : ""),tourschan);
					}
				}
				catch (err) {
					sys.sendMessage(src, Config.Tours.tourbot+"Non esistono dati per il mese di "+commandData+"!",tourschan);
				}
				return true;
			}
		}
		if (isTourSuperAdmin(src)) {
			/* Tournament Admins etc. */
			if (command == "touradmin") {
				var tadmins = tours.touradmins
				if (sys.dbIp(commandData) === undefined) {
					sys.sendMessage(src,Config.Tours.tourbot+"Nick sconosciuto o scritto male!",tourschan);
					return true;
				}
				if (!sys.dbRegistered(commandData)) {
					sys.sendMessage(src,Config.Tours.tourbot+"Non puoi dare auth ad un utente non registrato!",tourschan);
					if (sys.id(commandData) !== undefined) {
						sys.sendMessage(sys.id(commandData), Config.Tours.tourbot+"Registrati per poter diventare auth.");
					}
					return true;
				}
				if (sys.dbAuth(commandData) >= 1) {
					sys.sendMessage(src,Config.Tours.tourbot+"Può già avviare tornei!",tourschan);
					return true;
				}
				if (tadmins !== undefined) {
					for (var t in tadmins) {
						if (tadmins[t].toLowerCase() == commandData.toLowerCase()) {
							sys.sendMessage(src,Config.Tours.tourbot+"E' già tour admin!",tourschan);
							return true;
						}
					}
				}
				tadmins.push(commandData) 
				tours.touradmins = tadmins;
				saveTourKeys();
				sys.sendAll(Config.Tours.tourbot+sys.name(src)+" ha promosso "+commandData.toLowerCase()+" a tour admin!",tourschan);
				return true;
			}
			if (command == "tourdeadmin") {
				var tadmins = tours.touradmins
				if (sys.dbIp(commandData) === undefined) {
					sys.sendMessage(src,Config.Tours.tourbot+"Nick sconosciuto o scritto male!",tourschan);
					return true;
				}
				var index = -1
				if (tadmins !== undefined) {
					for (var t=0;t<tadmins.length;t++) {
						if (cmp(tadmins[t],commandData.toLowerCase())) {
							index = t;
							break;
						}
					}
				}
				if (index == -1) {
					sys.sendMessage(src,Config.Tours.tourbot+"Non è un tour admin!",tourschan);
					return true;
				}
				tadmins.splice(index,1) 
				tours.touradmins = tadmins;
				saveTourKeys();
				sys.sendAll(Config.Tours.tourbot+sys.name(src)+" ha vietato a "+commandData.toLowerCase()+" di far partire tornei!",tourschan);
				return true;
			}
			// active history command
			if (command == "tahistory") {
				sys.sendMessage(src, "*** CRONOLOGIA DEI TOUR ADMIN ***",tourschan);
				var length = 168;
				if (commandData == "") {
					length = tours.activehistory.length
				}
				else if (parseInt(commandData)*24 < tours.activehistory.length) {
					length = parseInt(commandData)*24
				}
				else {
					length = tours.activehistory.length;
				}
				for (var x=0;x<length;x++) {
					sys.sendMessage(src, tours.activehistory[x],tourschan);
				}
				return true;
			}
			if (command == "stopautostart") {
				tours.globaltime = 0
				sys.sendAll(Config.Tours.tourbot+sys.name(src)+" ha bloccato i tornei automatici, che riprenderanno quando verrà fatto iniziare un altro torneo.",tourschan);
				return true;
			}
			/*if (command == "forcestart") {
				var key = null;
				for (var x in tours.tour) {
					if (tours.tour[x].state == "signups") {
						key = x;
					}
				}
				if (key === null) {
					sys.sendMessage(src, Config.Tours.tourbot+"There are no tournaments currently in signups to force start! Use /tour [tier] instead, or /start to start the next tournament in the queue!", tourschan)
					return true;
				}
				if (tours.tour[x].players.length < 3) {
					sys.sendMessage(src, Config.Tours.tourbot+"There are not enough players to start!", tourschan)
					return true;
				}
				tourinitiate(key);
				sys.sendAll(Config.Tours.tourbot+"The "+tours.tour[x].tourtype+" tour was force started by "+sys.name(src)+".", tourschan)
				return true;
			}*/
			if (command == "push") {
				var key = null;
				var target = commandData.toLowerCase();
				for (var x in tours.tour) {
					if (tours.tour[x].state == "signups") {
						key = x;
						break;
					}
				}
				if (key === null) {
					sys.sendMessage(src,Config.Tours.tourbot+"Non puoi inserire nessuno ora!",tourschan);
					return true;
				}
				/* Is already in another tour */
				for (var x in tours.tour) {
					if (tours.tour[x].players.indexOf(target) != -1) {
						sys.sendMessage(src,Config.Tours.tourbot+"Non puoi inserirlo in un altro torneo!",tourschan);
						return true;
					}
				}
				tours.tour[key].players.push(target)
				tours.tour[key].cpt += 1
				if (tours.tour[key].maxcpt !== undefined) {
					if (tours.tour[key].cpt > tours.tour[key].maxcpt) {
						tours.tour[key].maxcpt = tours.tour[key].cpt
						if (tours.tour[key].maxcpt == 5) {
							tours.tour[key].time += Math.floor(Config.Tours.toursignup/6);
						}
						else if (tours.tour[key].maxcpt == 9) {
							tours.tour[key].time += Math.floor(Config.Tours.toursignup/4);
						}
						else if (tours.tour[key].maxcpt == 17) {
							tours.tour[key].time += Math.floor(Config.Tours.toursignup/3);
						}
						else if (tours.tour[key].maxcpt == 33) {
							tours.tour[key].time += Math.floor(Config.Tours.toursignup/2);
						}
						else if (tours.tour[key].maxcpt == 65) {
							tours.tour[key].time += Math.floor(Config.Tours.toursignup/1.5);
						}
						else if (tours.tour[key].maxcpt == 129) {
							tours.tour[key].time += Math.floor(Config.Tours.toursignup);
						}
					}
				}
				// 256 players for technical reasons
				if (tours.tour[key].players.length >= 256) {
					tours.tour[key].time = parseInt(sys.time());
				}
				sys.sendAll(Config.Tours.tourbot+toCorrectCase(target)+" è stato/a aggiunto/a al torneo "+getFullTourName(key)+" da "+sys.name(src)+" (player #"+tours.tour[key].players.length+"), "+(tours.tour[key].time - parseInt(sys.time()))+" second"+(tours.tour[key].time - parseInt(sys.time()) == 1 ? "o" : "i")+" rimanenti!", tourschan);
				return true;
			}
			// enabled for now!
			if (command == "updatewinmessages") {
				var url = "http://www.pokemonbattle.it/battlingarena/winmessages.php"
				if (commandData.indexOf("http://") === 0 || commandData.indexOf("https://") === 0) {
					url = commandData;
				}
				sys.sendMessage(src, Config.Tours.tourbot+"Aggiornamento dei messaggi di vittoria da "+url, tourschan);
				sys.webCall(url, function(resp) {
					if (resp !== "") {
						sys.writeToFile('tourwinverbs.txt', resp);
						getTourWinMessages()
						sys.sendAll(Config.Tours.tourbot + 'Messaggi di vittoria aggiornati!', tourschan);
					} else {
						sys.sendMessage(src, Config.Tours.tourbot + "Aggiornamento fallito!", tourschan);
					}
				});
				return true;
			}
			if (command == "start") {
				for (var x in tours.tour) {
					if (tours.tour[x].state == "signups") {
						sys.sendMessage(src, Config.Tours.tourbot+"Sono già aperte le iscrizioni!");
						return true;
					}
				}
				if (tours.queue.length != 0) {
					var data = tours.queue[0].split(":::",5)
					var tourtostart = data[0]
					var parameters = {"mode": data[2], "gen": data[3], "type": data[4]}
					tours.queue.splice(0,1)
					tourstart(tourtostart, sys.name(src), tours.key, parameters)
					sys.sendAll(Config.Tours.tourbot+sys.name(src)+" ha forzato l'inizio del torneo "+tourtostart+"!",tourschan);
					return true;
				}
				else {
					sys.sendMessage(src, Config.Tours.tourbot+"Non ci sono tornei da far iniziare! Usa /tour [tier]!", tourschan);
					return true;
				}
			}
		}
		if (isTourAdmin(src)) {
			if (command == "tour") {
				var data = commandData.split(":",2)
				var thetier = data[0].toLowerCase()
				var tiers = sys.getTierList()
				var found = false;
				for (var x in tiers) {
					if (tiers[x].toLowerCase() == thetier) {
						var tourtier = tiers[x];
						found = true;
						break;
					}
				}
				if (!found) {
					sys.sendMessage(src, Config.Tours.tourbot+"La tier '"+commandData+"' non esiste o è scritta male.", tourschan);
					return true;
				}
				if (tourtier.indexOf("Smogon") != -1 && !isTourSuperAdmin(src)) {
					sys.sendMessage(src, Config.Tours.tourbot+"Non sei abilitato a far iniziare tornei Smogonari!", tourschan);
					return true;
				}
				var lasttours = getListOfTours(7);
				var lastindex = lasttours.indexOf(tourtier);
				if (lastindex != -1 && !isTourSuperAdmin(src)) {
					sys.sendMessage(src, Config.Tours.tourbot+"Un torneo "+tourtier+" è in coda, è in corso o è stato appena fatto; cambiamo un po'!", tourschan);
					return true;
				}
				var isSignups = false;
				for (var x in tours.tour) {
					if (tours.tour[x].state == "signups") {
						isSignups = true;
					}
				}
				var detiers = ["CC 1v1", "Wifi CC 1v1", "Gen 5 1v1", "Gen 5 1v1 Ubers"];
				var allgentiers = ["Challenge Cup", "Metronome", "CC 1v1", "Wifi CC 1v1"];
				var parameters = {"gen": "default", "mode": modeOfTier(tourtier), "type": detiers.indexOf(tourtier) == -1 ? "single" : "double"};
				if (data.length > 1) {
					var parameterdata = data[1].split(" ");
					for (var p in parameterdata) {
						var parameterinfo = parameterdata[p].split("=",2);
						var parameterset = parameterinfo[0]
						var parametervalue = parameterinfo[1]
						if (cmp(parameterset, "mode")) {
							var singlesonlytiers = ["CC 1v1", "CC 1v1 Ubers", "BW2 OU", "PB BW2 OU", "BW2 UU", "RSE Ubers", "RSE OU", "DPP Ubers", "DPP OU", "RBY OU", "GSC OU", "DPP Ubers", "BW2 Ubers"];
							if ((modeOfTier(tourtier) == "Doubles" || modeOfTier(tourtier) == "Triples" || singlesonlytiers.indexOf(tourtier) != -1) && !cmp(parametervalue, modeOfTier(tourtier))) {
								sys.sendMessage(src, Config.Tours.tourbot+"La tier "+tourtier+" può essere giocata solo in modalità " + modeOfTier(tourtier) + "!", tourschan);
								return true;
							}
							if (cmp(parametervalue, "singles")) {
								parameters.mode = "Singles";
							}
							else if (cmp(parametervalue, "doubles")) {
								parameters.mode = "Doubles";
							}
							else if (cmp(parametervalue, "triples")) {
								parameters.mode = "Triples";
							}
						}
						else if (cmp(parameterset, "gen") && allgentiers.indexOf(tourtier) != -1) { // only allgentours can change gen
							var newgen = getSubgen(parametervalue, false)
							if (newgen !== false) {
								parameters.gen = newgen
							}
							else {
								parameters.gen = "5-1" // BW2
								sys.sendMessage(src, Config.Tours.tourbot+"ATTENZIONE! "+parametervalue+" non esiste! Usa BW2!", tourschan);
							}
						}
						else if (cmp(parameterset, "type")) {
							if (cmp(parametervalue, "double")) {
								parameters.type = "double";
							}
							else if (cmp(parametervalue, "single")) {
								parameters.type = "single";
							}
						}
						else {
							sys.sendMessage(src, Config.Tours.tourbot+"ATTENZIONE! Il parametro '"+parameterset+"' non esiste!", tourschan);
						}
					}
				}
				if (allgentiers.indexOf(tourtier) != -1 && parameters.gen === "default") {
					parameters.gen = "5-1";
				}
				if (tours.queue.length >= Config.Tours.maxqueue && !isTourSuperAdmin(src)) {
					sys.sendMessage(src, Config.Tours.tourbot+"Ci sono già "+Config.Tours.maxqueue+" o più tornei in coda, non puoi aggiungerne un altro!", tourschan);
					return true;
				}
				else if (tours.keys.length > 0 || tours.queue.length > 0 || isSignups) {
					tours.queue.push(tourtier+":::"+sys.name(src)+":::"+parameters.mode+":::"+parameters.gen+":::"+parameters.type)
					sys.sendAll(Config.Tours.tourbot+sys.name(src)+" ha aggiunto un torneo "+tourtier+" in coda! Usa /queue per vedere quale sarà il prossimo...",tourschan);
				}
				else {
					tourstart(tourtier, sys.name(src), tours.key, parameters);
				}
				addTourActivity(src);
				return true;
			}
			if (command == "remove") {
				var index = -1
				if (parseInt(commandData) !== "") {
					index = parseInt(commandData)-1
				}
				for (var a = tours.queue.length-1; a>=0; a -= 1) {
					var tourtoremove = (tours.queue[a].split(":::",1))[0].toLowerCase();
					if (commandData.toLowerCase() == tourtoremove) {
						index = a;
						break;
					}
				}
				if (index < 0 || index >= tours.queue.length) {
					sys.sendMessage(src, Config.Tours.tourbot+"La tier '"+commandData+"' non esiste nella coda (o è scritta male), può essere rimossa!", tourschan);
					return true;
				}
				else {
					var removedtour = (tours.queue[index].split(":::",1))[0]
					tours.queue.splice(index, 1)
					sys.sendAll(Config.Tours.tourbot+"Il torneo "+removedtour+" numero (position "+(index+1)+") è stato rimosso dalla coda da "+sys.name(src)+".", tourschan);
					return true;
				}
			}
			if (command == "endtour") {
				var tier = commandData
				var key = null
				for (var x in tours.tour) {
					if (tours.tour[x].tourtype.toLowerCase() == commandData.toLowerCase()) {
						key = x;
						break;
					}
				}
				if (key === null) {
					sys.sendMessage(src,Config.Tours.tourbot+"Il torneo "+commandData+" non è in corso!",tourschan);
					return true;
				}
				sys.sendAll(Config.Tours.tourbot+"Il torneo "+getFullTourName(key)+" è stato annullato da "+sys.name(src)+", ci spiace!", tourschan);
				delete tours.tour[key];
				tours.keys.splice(tours.keys.indexOf(key), 1);
				return true;
			}
			if (command == "passta") {
				var newname = commandData;
				var tadmins = tours.touradmins;
				if (sys.dbIp(newname) === undefined) {
					sys.sendMessage(src,Config.Tours.tourbot+"Nick sconosciuto o scritto male!!",tourschan);
					return true;
				}
				if (!sys.dbRegistered(newname)) {
					sys.sendMessage(src,Config.Tours.tourbot+"Non puoi dare auth ad un nick non registrato!",tourschan);
					return true;
				}
				if (sys.dbAuth(newname) >= 1) {
					sys.sendMessage(src,Config.Tours.tourbot+"Questo account può già iniziare tornei!",tourschan);
					return true;
				}
				if (tadmins !== undefined) {
					for (var t in tadmins) {
						if (cmp(tadmins[t].toLowerCase(), newname)) {
							sys.sendMessage(src,Config.Tours.tourbot+"L'account è già un tour admin!",tourschan);
							return true;
						}
					}
				}
				if (sys.id(newname) === undefined) {
					sys.sendMessage(src,Config.Tours.tourbot+"Il destinatario è offline!",tourschan);
					return true;
				}
				if (sys.ip(sys.id(newname)) !== sys.ip(src)) {
					sys.sendMessage(src,Config.Tours.tourbot+"Per potersi scambiare, i due accounts devono avere lo stesso IP!",tourschan);
					return true;
				}
				var index = -1;
				for (var t=0;t<tadmins.length;t++) {
					if (cmp(tadmins[t],sys.name(src))) {
						index = t;
						break;
					}
				}
				if (index == -1) {
					sys.sendMessage(src,Config.Tours.tourbot+"FAIL! Posta nel Forum di Supporto se non capisci il motivo...",tourschan);
					return true;
				}
				tadmins.splice(t, 1, toCorrectCase(newname))
				tours.touradmins = tadmins;
				saveTourKeys();
				sys.sendAll(Config.Tours.tourbot+sys.name(src)+" ha passato la sua auth a "+toCorrectCase(newname)+"!",tourschan);
				sys.sendAll(Config.Tours.tourbot+sys.name(src)+" ha passato la sua auth a "+toCorrectCase(newname)+"!",sys.channelId("Victory Road"));
				sys.sendAll(Config.Tours.tourbot+sys.name(src)+" ha passato la sua auth a "+toCorrectCase(newname)+"!",sys.channelId("Indigo Plateau"));
				return true;
			}
			if (command == "dq") {
				var key = null
				for (var x in tours.tour) {
					if (tours.tour[x].players.indexOf(commandData.toLowerCase()) != -1) {
						if (tours.tour[x].losers.indexOf(commandData.toLowerCase()) == -1) {
							key = x;
							break;
						}
						if (tours.tour[x].parameters.type == "double") {
							if (tours.tour[x].winbracket.indexOf(commandData.toLowerCase()) != -1 || tours.tour[x].round == 1) {
								key = x;
								break;
							}
						}
					}
				}
				if (key === null) {
					sys.sendMessage(src,Config.Tours.tourbot+"Questo giocatore non è iscritto al torneo!",tourschan);
					return true;
				}
				if (tours.tour[key].state == "signups") {
					var index = tours.tour[key].players.indexOf(commandData.toLowerCase());
					tours.tour[key].players.splice(index, 1);
					tours.tour[key].cpt -= 1;
					sys.sendAll(Config.Tours.tourbot+toCorrectCase(commandData)+" è stato rimosso dagli iscritti da "+sys.name(src)+" dal torneo "+getFullTourName(key)+"!", tourschan);
				}
				else {
					sys.sendAll(Config.Tours.tourbot+sys.name(src)+" ha squalificato "+toCorrectCase(commandData)+" dal torneo "+getFullTourName(key)+"!", tourschan);
					disqualify(commandData.toLowerCase(), key, false);
				}
				addTourActivity(src)
				return true;
			}
			if (command == "cancelbattle") {
				var key = null;
				for (var x in tours.tour) {
					if (tours.tour[x].players.indexOf(commandData.toLowerCase()) != -1) {
						key = x;
						break;
					}
				}
				if (key === null) {
					sys.sendMessage(src,Config.Tours.tourbot+"Questo giocatore non è iscritto al torneo!",tourschan);
					return true;
				}
				var index = tours.tour[key].battlers.indexOf(commandData.toLowerCase())
				if (index == -1) {
					sys.sendMessage(src,Config.Tours.tourbot+"Questo giocatore non sta giocando per il torneo!",tourschan);
					return true;
				}
				else {
					var opponent = index%2 === 0 ? tours.tour[key].battlers[index+1] : tours.tour[key].battlers[index-1]
					sys.sendAll(Config.Tours.tourbot+sys.name(src)+" annullerà il risultato del match tra "+toCorrectCase(commandData)+" e "+toCorrectCase(tours.tour[key].battlers[oppindex])+" nel torneo "+getFullTourName(key)+" così i due possono rigiocare.", tourschan);
					tours.tour[key].battlers.splice(index,1);
					tours.tour[key].battlers.splice(tours.tour[key].battlers.indexOf(opponent),1);
				}
				addTourActivity(src)
				return true;
			}
			if (command == "sub") {
				var data = commandData.split(":",2);
				var newname = data[0].toLowerCase();
				var oldname = data[1].toLowerCase();
				var key = null;
				for (var x in tours.tour) {
					if (tours.tour[x].players.indexOf(oldname) != -1 && tours.tour[x].state != "signups") {
						key = x;
						break;
					}
				}
				if (sys.id(newname) === undefined) {
					sys.sendMessage(src,Config.Tours.tourbot+"Non è una buona idea inserire un sostituto che non è presente nel Server...",tourschan);
					return true;
				}
				if (key === null) {
					sys.sendMessage(src,Config.Tours.tourbot+"Non possono essere inseriti sostituti!",tourschan);
					return true;
				}
				if (tours.tour[key].players.indexOf(oldname) == -1) {
					sys.sendMessage(src,Config.Tours.tourbot+"Nick sconosciuto o scritto male!",tourschan);
					return true;
				}
				tours.tour[key].players.splice(tours.tour[key].players.indexOf(oldname),1,newname)
				sys.sendAll(Config.Tours.tourbot+sys.name(src)+" ha inserito "+toCorrectCase(newname)+" al posto di "+toCorrectCase(oldname)+" nel torneo "+getFullTourName(key)+".",tourschan);
				addTourActivity(src);
				return true;
			}
			if (command == "tourmute") {
				var data = commandData.split(":", 3);
				var tar = data[0];
				var reason = data[1];
				var time = 900;
				if (data.length > 2) {
					var time = converttoseconds(data[2]);
				}
				var ip = sys.dbIp(tar)
				if (sys.id(tar) !== undefined) {
					if (isTourAdmin(sys.id(tar)) && sys.maxAuth(ip) >= sys.auth(src)) {
						sys.sendMessage(src,Config.Tours.tourbot+"Non puoi mutarlo/a!",tourschan);
						return true;
					}
				}
				else {
					if ((tours.touradmins.indexOf(tar.toLowerCase()) > -1 || sys.maxAuth(ip) >= 1) && sys.maxAuth(ip) >= sys.auth(src)) {
						sys.sendMessage(src,Config.Tours.tourbot+"Non puoi mutarlo/a!",tourschan);
						return true;
					}
				}
				if (ip === undefined) {
					sys.sendMessage(src,Config.Tours.tourbot+"Nick sconosciuto o scritto male!",tourschan);
					return true;
				}
				if (tours.tourmutes.hasOwnProperty(ip)) {
					sys.sendMessage(src,Config.Tours.tourbot+"Sei old! Già mutato/a!",tourschan);
					return true;
				}
				if (reason === undefined) {
					reason = "";
				}
				if (reason === "" && !isTourOwner(src)) {
					sys.sendMessage(src,Config.Tours.tourbot+"Spiega il motivo!",tourschan);
					return true;
				}
				if (time <= 0) {
					sys.sendMessage(src,Config.Tours.tourbot+"Non puoi mutare per meno di 1 secondo!",tourschan);
					return true;
				}
				if (usingBadWords(reason)) {
					sys.sendMessage(src,Config.Tours.tourbot+"'"+reason+"' non è una ragione valida!",tourschan);
					return true;
				}
				var maxtime = 0;
				if (isTourOwner(src)) {
					maxtime = Number.POSITIVE_INFINITY;
				}
				else if (isTourSuperAdmin(src)) {
					maxtime = 2592000;
				}
				else if (sys.auth(src) >= 1) {
					maxtime = 86400;
				}
				else {
					maxtime = 3600;
				}
				if (isNaN(time)) {
					time = 900;
				}
				if (time > maxtime) {
					time = maxtime;
				}
				var channels = [sys.channelId("Indigo Plateau"), sys.channelId("Victory Road"), tourschan];
				tours.tourmutes[ip] = {'expiry': parseInt(sys.time()) + time, 'reason': reason, 'auth': sys.name(src), 'name': tar.toLowerCase()}
				for (var x in channels) {
					if (sys.existChannel(sys.channel(channels[x]))) {
						sys.sendAll(Config.Tours.tourbot+tar+" è stato/a mutato/a da "+sys.name(src)+" per "+time_handle(time)+"! "+(reason !== "" ? "[Motivo: "+reason+"]" : ""), channels[x]);
					}
				}
				saveTourMutes();
				return true;
			}
			if (command == "tourunmute") {
				var ip = sys.dbIp(commandData) ;
				if (ip === undefined) {
					sys.sendMessage(src,Config.Tours.tourbot+"Nick sconosciuto o scritto male!",tourschan);
					return true;
				}
				if (!tours.tourmutes.hasOwnProperty(ip)) {
					sys.sendMessage(src,Config.Tours.tourbot+"Non è mutato!",tourschan);
					return true;
				}
				if (ip === sys.ip(src) && !isTourOwner(src)) {
					sys.sendMessage(src,Config.Tours.tourbot+"Non puoi mutarti da solo!",tourschan);
					return true;
				}
				delete tours.tourmutes[ip];
				sys.sendAll(Config.Tours.tourbot+commandData+" è stato/a smutato/a da "+sys.name(src)+"!", tourschan);
				saveTourMutes()
				return true;
			}
			if (command == "tourmutes") {
				sys.sendMessage(src,"*** TOURS MUTELIST ***",tourschan);
				for (var t in tours.tourmutes) {
					if (tours.tourmutes[t].expiry > parseInt(sys.time())) {
						sys.sendMessage(src, tours.tourmutes[t].name + ": Set by "+tours.tourmutes[t].auth+"; expires in "+time_handle(tours.tourmutes[t].expiry-parseInt(sys.time()))+"; reason: "+tours.tourmutes[t].reason, tourschan);
					}
				}
				return true;
			}
			if (command == "config") {
				sys.sendMessage(src,"*** CURRENT CONFIGURATION ***",tourschan);
				sys.sendMessage(src,"Maximum Queue Length: "+Config.Tours.maxqueue,tourschan);
				sys.sendMessage(src,"Maximum Number of Simultaneous Tours: "+Config.Tours.maxrunning,tourschan);
				sys.sendMessage(src,"Tour Sign Ups Length: "+time_handle(Config.Tours.toursignup),tourschan);
				sys.sendMessage(src,"Tour Auto DQ length: "+time_handle(Config.Tours.tourdq),tourschan);
				sys.sendMessage(src,"Tour Activity Check: "+time_handle(Config.Tours.activity),tourschan);
				sys.sendMessage(src,"Substitute Time: "+time_handle(Config.Tours.subtime),tourschan);
				sys.sendMessage(src,"Tour Break Time: "+time_handle(Config.Tours.tourbreak),tourschan);
				sys.sendMessage(src,"Absolute Tour Break Time: "+time_handle(Config.Tours.abstourbreak),tourschan);
				sys.sendMessage(src,"Tour Reminder Time: "+time_handle(Config.Tours.reminder),tourschan);
				sys.sendMessage(src,"Auto start when percentage of players is less than: "+Config.Tours.minpercent+"%",tourschan);
				sys.sendMessage(src,"Bot Name: "+Config.Tours.tourbot,tourschan);
				sys.sendMessage(src,"Channel: "+Config.Tours.channel,tourschan);
				sys.sendMessage(src,"Error Channel: "+Config.Tours.errchannel,tourschan);
				sys.sendMessage(src,"Scoring system activated: "+Config.Tours.points,tourschan);
				sys.sendMessage(src,"Debug: "+Config.Tours.debug,tourschan);
				return true;
			}
			if (command == "configset") {
				var data = commandData.split(':',2)
				if (commandData.length < 2) {
					sys.sendMessage(src,"*** CONFIG SETTINGS ***",tourschan);
					sys.sendMessage(src,"Usage: /configset [var]:[value]. Variable list and current values are below:",tourschan);
					sys.sendMessage(src,"Example: '/configset maxqueue:3' will set the maximum queue length to 3:",tourschan);
					sys.sendMessage(src,"maxqueue: "+Config.Tours.maxqueue,tourschan);
					sys.sendMessage(src,"maxrunning: "+Config.Tours.maxrunning,tourschan);
					sys.sendMessage(src,"toursignup: "+time_handle(Config.Tours.toursignup),tourschan);
					sys.sendMessage(src,"tourdq: "+time_handle(Config.Tours.tourdq),tourschan);
					sys.sendMessage(src,"touractivity: "+time_handle(Config.Tours.activity),tourschan);
					sys.sendMessage(src,"subtime: "+time_handle(Config.Tours.subtime),tourschan);
					sys.sendMessage(src,"breaktime: "+time_handle(Config.Tours.tourbreak),tourschan);
					sys.sendMessage(src,"absbreaktime: "+time_handle(Config.Tours.abstourbreak),tourschan);
					sys.sendMessage(src,"remindertime: "+time_handle(Config.Tours.reminder),tourschan);
					sys.sendMessage(src,"minpercent: "+Config.Tours.minpercent,tourschan);
					sys.sendMessage(src,"botname: "+Config.Tours.tourbot,tourschan);
					sys.sendMessage(src,"channel: "+Config.Tours.channel,tourschan);
					sys.sendMessage(src,"scoring: "+Config.Tours.points,tourschan);
					sys.sendMessage(src,"debug: "+Config.Tours.debug+" (to change this, type /configset debug [0/1] ~ true = 1; false = 0)",tourschan);
					return true;
				}
				var option = data[0].toLowerCase()
				if (["botname", "bot name", "channel", "errchannel"].indexOf(option) == -1) {
					var value = parseInt(data[1]);
				}
				else {
					var value = data[1];
				}
				if (option == 'maxqueue' || option == "maximum queue length") {
					if (isNaN(value)) {
						sys.sendMessage(src,Config.Tours.tourbot+"Un valore tra 1 e 255 che determina la lunghezza della coda. Admin e Owner non sono affetti da questa restrizione.",tourschan);
						sys.sendMessage(src,Config.Tours.tourbot+"Current Value: "+Config.Tours.maxqueue,tourschan);
						return true;
					}
					else if (value < 1 || value > 255) {
						sys.sendMessage(src,Config.Tours.tourbot+"Value must be between 1 and 255.",tourschan);
						return true;
					}
					Config.Tours.maxqueue = value;
					sys.saveVal("tourconfig.txt", "maxqueue", value);
					sendAllTourAuth(Config.Tours.tourbot+sys.name(src)+" set the maximum queue length to "+Config.Tours.maxqueue);
					return true;
				}
				else if (option == 'maxrunning' || option == 'maximum number of simultaneous tours') {
					if (isNaN(value)) {
						sys.sendMessage(src,Config.Tours.tourbot+"A value between 1 and 255 that determines the maximum rumber of simultaneous tours.",tourschan);
						sys.sendMessage(src,Config.Tours.tourbot+"Current Value: "+Config.Tours.maxrunning,tourschan);
						return true;
					}
					else if (value < 1 || value > 255) {
						sys.sendMessage(src,Config.Tours.tourbot+"Value must be between 1 and 255.",tourschan);
						return true;
					}
					Config.Tours.maxrunning = value;
					sys.saveVal("tourconfig.txt", "maxrunning", value);
					sendAllTourAuth(Config.Tours.tourbot+sys.name(src)+" set the maximum number of simultaneous tours to "+Config.Tours.maxrunning);
					return true;
				}
				else if (option == 'toursignup' || option == 'tour sign ups length') {
					if (isNaN(value)) {
						sys.sendMessage(src,Config.Tours.tourbot+"A value (in seconds) between 10 and 600 that determines the intial signup length.",tourschan);
						sys.sendMessage(src,Config.Tours.tourbot+"Current Value: "+Config.Tours.toursignup,tourschan);
						return true;
					}
					else if (value < 10 || value > 600) {
						sys.sendMessage(src,Config.Tours.tourbot+"Value must be between 10 and 600.",tourschan);
						return true;
					}
					Config.Tours.toursignup = value;
					sys.saveVal("tourconfig.txt", "toursignup", value);
					sendAllTourAuth(Config.Tours.tourbot+sys.name(src)+" set the sign up time to "+time_handle(Config.Tours.toursignup));
					return true;
				}
				else if (option == 'tourdq' || option == 'tour auto dq length') {
					if (isNaN(value)) {
						sys.sendMessage(src,Config.Tours.tourbot+"A value (in seconds) between 30 and 300 that determines how long it is before inactive users are disqualified.",tourschan);
						sys.sendMessage(src,Config.Tours.tourbot+"Current Value: "+Config.Tours.tourdq,tourschan);
						return true;
					}
					else if (value < 30 || value > 300) {
						sys.sendMessage(src,Config.Tours.tourbot+"Value must be between 30 and 300.",tourschan);
						return true;
					}
					Config.Tours.tourdq = value
					sys.saveVal("tourconfig.txt", "tourdq", value)
					sendAllTourAuth(Config.Tours.tourbot+sys.name(src)+" set the disqualification time to "+time_handle(Config.Tours.tourdq));
					return true;
				}
				else if (option == 'touractivity' || option == 'tour activity check') {
					if (isNaN(value)) {
						sys.sendMessage(src,Config.Tours.tourbot+"A value (in seconds) between 60 and 300 that determines how long it is from a user's last message before a user is considered inactive.",tourschan);
						sys.sendMessage(src,Config.Tours.tourbot+"Current Value: "+Config.Tours.activity,tourschan);
						return true;
					}
					else if (value < 60 || value > 300) {
						sys.sendMessage(src,Config.Tours.tourbot+"Value must be between 60 and 300.",tourschan);
						return true;
					}
					Config.Tours.activity = value
					sys.saveVal("tourconfig.txt", "touractivity", value)
					sendAllTourAuth(Config.Tours.tourbot+sys.name(src)+" set the activity time to "+time_handle(Config.Tours.activity));
					return true;
				}
				else if (option == 'subtime' || option == 'substitute time') {
					if (isNaN(value)) {
						sys.sendMessage(src,Config.Tours.tourbot+"A value (in seconds) between 30 and 300 that determines how long it is before subs are disqualified.",tourschan);
						sys.sendMessage(src,Config.Tours.tourbot+"Current Value: "+Config.Tours.subtime,tourschan);
						return true;
					}
					else if (value < 30 || value > 300) {
						sys.sendMessage(src,Config.Tours.tourbot+"Value must be between 30 and 300.",tourschan);
						return true;
					}
					Config.Tours.subtime = value
					sys.saveVal("tourconfig.txt", "subtime", value)
					sendAllTourAuth(Config.Tours.tourbot+sys.name(src)+" set the sub time to "+time_handle(Config.Tours.subtime));
					return true;
				}
				else if (option == 'breaktime' || option == 'tour break time') {
					if (isNaN(value)) {
						sys.sendMessage(src,Config.Tours.tourbot+"A value (in seconds) between 30 and 300 that determines how long it is before another tournament is started if one gets cancelled.",tourschan);
						sys.sendMessage(src,Config.Tours.tourbot+"Current Value: "+Config.Tours.breaktime,tourschan);
						return true;
					}
					else if (value < 30 || value > 300) {
						sys.sendMessage(src,Config.Tours.tourbot+"Value must be between 30 and 300.",tourschan);
						return true;
					}
					Config.Tours.tourbreak = value
					sys.saveVal("tourconfig.txt", "breaktime", value)
					sendAllTourAuth(Config.Tours.tourbot+sys.name(src)+" set the break time (betweeen cancelled tournaments) to "+time_handle(Config.Tours.tourbreak));
					return true;
				}
				else if (option == 'absbreaktime' || option == 'absolute tour break time') {
					if (isNaN(value)) {
						sys.sendMessage(src,Config.Tours.tourbot+"A value (in seconds) between 300 and 1800 that influences how long it is between tournaments starting. The actual time will depend on other factors.",tourschan);
						sys.sendMessage(src,Config.Tours.tourbot+"Current Value: "+Config.Tours.absbreaktime,tourschan);
						return true;
					}
					else if (value < 300 || value > 1800) {
						sys.sendMessage(src,Config.Tours.tourbot+"Value must be between 300 and 1800.",tourschan);
						return true;
					}
					Config.Tours.abstourbreak = value
					sys.saveVal("tourconfig.txt", "absbreaktime", value);
					sendAllTourAuth(Config.Tours.tourbot+sys.name(src)+" set the absolute break time (base time between starting tours) to "+time_handle(Config.Tours.abstourbreak));
					return true;
				}
				else if (option == 'remindertime' || option == 'tour reminder time') {
					if (isNaN(value)) {
						sys.sendMessage(src,Config.Tours.tourbot+"A value (in seconds) that determines how long it is before a battle reminder is sent to players from the start of the round",tourschan);
						sys.sendMessage(src,Config.Tours.tourbot+"Current Value: "+Config.Tours.reminder,tourschan);
						return true;
					}
					else if (value < 15 || value > (Config.Tours.tourdq-30)) {
						sys.sendMessage(src,Config.Tours.tourbot+"Value must be between 15 and "+(Config.Tours.tourdq-30)+".",tourschan);
						return true;
					}
					Config.Tours.reminder = value
					sys.saveVal("tourconfig.txt", "remindertime", value)
					sendAllTourAuth(Config.Tours.tourbot+sys.name(src)+" set the reminder time to "+time_handle(Config.Tours.reminder));
					return true;
				}
				else if (option == 'minpercent') {
					if (!isTourSuperAdmin(src)) {
						sys.sendMessage(src,Config.Tours.tourbot+"Can't change this config setting, ask an admin for this.",tourschan);
						return true;
					}
					if (isNaN(value)) {
						sys.sendMessage(src,Config.Tours.tourbot+"When the percentage of players drops below this value, a new tournament will start if possible. Overides maximum number of simultaneous tours.",tourschan);
						sys.sendMessage(src,Config.Tours.tourbot+"Current Value: "+Config.Tours.minpercent+"%",tourschan);
						return true;
					}
					else if (value < 1 || value > 30) {
						sys.sendMessage(src,Config.Tours.tourbot+"Value must be between 1 and 30.",tourschan);
						return true;
					}
					Config.Tours.minpercent = value;
					sys.saveVal("tourconfig.txt", "minpercent", value);
					sendAllTourAuth(Config.Tours.tourbot+sys.name(src)+" set the auto start percentage to "+Config.Tours.minpercent+"%");
					return true;
				}
				else if (option == 'botname' || option == 'bot name') {
					if (!isTourOwner(src)) {
						sys.sendMessage(src,Config.Tours.tourbot+"Can't change the botname, ask an owner for this.",tourschan);
						return true;
					}
					else if (value.length === 0) {
						sys.sendMessage(src,Config.Tours.tourbot+"Botname can't be empty!",tourschan);
						return true;
					}
					Config.Tours.tourbot = value+": "
					sendAllTourAuth(Config.Tours.tourbot+sys.name(src)+" set the tourbot name to "+Config.Tours.tourbot,tourschan);
					return true;
				}
				else if (option == 'channel') {
					if (!isTourOwner(src)) {
						sys.sendMessage(src,Config.Tours.tourbot+"Can't change the channel, ask an owner for this.",tourschan);
						return true;
					}
					else if (!sys.existChannel(value)) {
						sys.sendMessage(src,Config.Tours.tourbot+"The channel needs to exist!",tourschan);
						return true;
					}
					Config.Tours.channel = value
					sendAllTourAuth(Config.Tours.tourbot+sys.name(src)+" set the tournament channel to "+Config.Tours.channel,tourschan);
					tourschan = sys.channelId(Config.Tours.channel);
					sys.sendAll("Version "+Config.Tours.version+" of tournaments has been loaded successfully in this channel!", tourschan);
					return true;
				}
				else if (option == 'scoring') {
					if (!isTourOwner(src)) {
						sys.sendMessage(src,Config.Tours.tourbot+"Can't turn scoring on/off, ask an owner for this.",tourschan);
						return true;
					}
					if (value !== 0 && value != 1) {
						sys.sendMessage(src,Config.Tours.tourbot+"Value must be 0 (turns debug off) or 1 (turns it on).",tourschan);
						return true;
					}
					Config.Tours.points = (value == 1 ? true : false)
					sendAllTourAuth(Config.Tours.tourbot+sys.name(src)+" set the scoring mode to "+Config.Tours.points,tourschan);
					return true;
				}
				else if (option == 'debug') {
					if (!isTourOwner(src)) {
						sys.sendMessage(src,Config.Tours.tourbot+"Can't turn debug on/off, ask an owner for this.",tourschan);
						return true;
					}
					if (value !== 0 && value != 1) {
						sys.sendMessage(src,Config.Tours.tourbot+"Value must be 0 (turns debug off) or 1 (turns it on).",tourschan);
						return true;
					}
					Config.Tours.debug = (value == 1 ? true : false)
					sendAllTourAuth(Config.Tours.tourbot+sys.name(src)+" set the debug mode to "+Config.Tours.debug,tourschan);
					return true;
				}
				else {
					sys.sendMessage(src,Config.Tours.tourbot+"The configuration option '"+option+"' does not exist.",tourschan);
					return true;
				}
			}
		}
		// Normal User Commands
		if (command == "join") {
			if (!sys.dbRegistered(sys.name(src))) {
				sys.sendMessage(src, Config.Tours.tourbot+"Devi registrare il tuo nick per partecipare ai tornei! Clicca sul bottone Register sotto la chat!", tourschan);
				return true;
			}
			if (isTourMuted(src)) {
				sys.sendMessage(src, Config.Tours.tourbot+"Ti sei comportato male quindi non puoi giocare!", tourschan);
				return true;
			}
			var key = null
			for (var x in tours.tour) {
				if (tours.tour[x].state == "subround" || tours.tour[x].state == "signups") {
					key = x;
					break;
				}
			}
			if (key === null) {
				sys.sendMessage(src,Config.Tours.tourbot+"Non ci sono tornei con iscrizione aperte al momento!",tourschan);
				return true;
			}
			if (!sys.hasTier(src, tours.tour[key].tourtype)) {
				sys.sendMessage(src,Config.Tours.tourbot+"Ti serve un team "+tours.tour[key].tourtype+" per partecipare al torneo; caricalo dal Team Builder!",tourschan);
				return true;
			}
			var isInCorrectGen = false;
			for (var x=0; x<sys.teamCount(src); x++) {
				if (sys.tier(src, x) === tours.tour[key].tourtype) {
					if (tours.tour[key].parameters.gen != "default") {
						var getGenParts = tours.tour[key].parameters.gen.split("-",2);
						if (parseInt(sys.gen(src,x)) === parseInt(getGenParts[0]) && parseInt(sys.subgen(src,x)) === parseInt(getGenParts[1])) {
							isInCorrectGen = true;
							break;
						}
					}
					else {
						isInCorrectGen = true;
						break;
					}
				}
			}
			if (!isInCorrectGen) {
				sys.sendMessage(src,Config.Tours.tourbot+"Devi impostare la generazione su "+getSubgen(tours.tour[key].parameters.gen, true)+". Cambiala dal Team Builder.",tourschan);
				return true;
			}
			/* Is already in another tour */
			var isStillInTour = false;
			for (var x in tours.tour) {
				isStillInTour = false;
				if (tours.tour[x].players.indexOf(sys.name(src).toLowerCase()) != -1) {
					if (tours.tour[x].losers.indexOf(sys.name(src).toLowerCase()) == -1) {
						isStillInTour = true;
					}
					if (tours.tour[x].parameters.type == "double") {
						if (tours.tour[x].winbracket.indexOf(sys.name(src).toLowerCase()) != -1 || tours.tour[x].round == 1) {
							isStillInTour = true;
						}
					}
				}
				if (isStillInTour) {
					if (tours.tour[x].state == "subround" || tours.tour[x].state == "signups") {
						sys.sendMessage(src,Config.Tours.tourbot+"Non puoi iscriverti due volte!",tourschan);
					}
					else {
						sys.sendMessage(src,Config.Tours.tourbot+"Non puoi iscriverti a più tornei con lo stesso nickname!",tourschan);
					}
					return true;
				}
			}
			/* Multiple account check */
			for (var a=0; a<tours.tour[key].players.length; a++) {
				var joinedip = sys.dbIp(tours.tour[key].players[a]);
				if (sys.ip(src) == joinedip && ((sys.maxAuth(sys.ip(src)) < 2 && Config.Tours.debug === true) || (sys.auth(src) < 3 && Config.Tours.debug === false))) {
					sys.sendMessage(src,Config.Tours.tourbot+"Stai già partecipando con il nickname '"+tours.tour[key].players[a]+"'!",tourschan);
					return true;
				}
			}
			if (tours.tour[key].state == "signups") {
				tours.tour[key].players.push(sys.name(src).toLowerCase());
				tours.tour[key].cpt += 1;
				if (tours.tour[key].maxcpt !== undefined) {
					if (tours.tour[key].cpt > tours.tour[key].maxcpt) {
						tours.tour[key].maxcpt = tours.tour[key].cpt;
						if (tours.tour[key].maxcpt == 5) {
							tours.tour[key].time += Math.floor(Config.Tours.toursignup/6);
						}
						else if (tours.tour[key].maxcpt == 9) {
							tours.tour[key].time += Math.floor(Config.Tours.toursignup/4);
						}
						else if (tours.tour[key].maxcpt == 17) {
							tours.tour[key].time += Math.floor(Config.Tours.toursignup/3);
							sys.sendAll(Config.Tours.tourbot+"Più di 16 partecipano al torneo "+getFullTourName(key)+" nel canale #"+sys.channel(tourschan)+"! Hai ancora "+time_handle(tours.tour[key].time - parseInt(sys.time()))+" per iscriverti!",0);
						}
						else if (tours.tour[key].maxcpt == 33) {
							tours.tour[key].time += Math.floor(Config.Tours.toursignup/2);
							sys.sendAll(Config.Tours.tourbot+"Più di 32 partecipano al torneo "+getFullTourName(key)+" tournament in #"+sys.channel(tourschan)+"! Hai ancora "+time_handle(tours.tour[key].time - parseInt(sys.time()))+" per iscriverti!",0);
						}
						else if (tours.tour[key].maxcpt == 65) {
							tours.tour[key].time += Math.floor(Config.Tours.toursignup/1.5);
							sys.sendAll(Config.Tours.tourbot+"Più di 64 partecipano al torneo "+getFullTourName(key)+" tournament in #"+sys.channel(tourschan)+"! Hai ancora "+time_handle(tours.tour[key].time - parseInt(sys.time()))+" per iscriverti!",0);
						}
						else if (tours.tour[key].maxcpt == 129) {
							tours.tour[key].time += Math.floor(Config.Tours.toursignup);
							sys.sendAll(Config.Tours.tourbot+"Più di 128 partecipano al torneo "+getFullTourName(key)+" tournament in #"+sys.channel(tourschan)+"! Hai ancora "+time_handle(tours.tour[key].time - parseInt(sys.time()))+" per iscriverti!",0);
						}
					}
				}
				// 256 players for technical reasons
				if (tours.tour[key].players.length >= 256) {
					tours.tour[key].time = parseInt(sys.time());
				}
                sys.sendHtmlAll("<font color='"+Config.Tours.tourbotcolour+"'><timestamp/> <b>"+html_escape(Config.Tours.tourbot)+"</b></font><b>"+html_escape(sys.name(src))+"</b> E' il giocatore #"+tours.tour[key].players.length+" ad essere iscritto al torneo "+html_escape(getFullTourName(key))+"! "+(tours.tour[key].time - parseInt(sys.time()))+" second"+(tours.tour[key].time - parseInt(sys.time()) == 1 ? "o rimanente" : "i rimanenti")+"!", tourschan);
				return true;
			}
			/* subbing */
			var oldname = null
			for (var n=1;n<=tours.tour[key].players.length;n++) {
				for (var k=0;k<tours.tour[key].players.length;k++) {
					if (tours.tour[key].players[k] == "~Sub "+n+"~") {
						oldname = "~Sub "+n+"~";
						sendDebugMessage("Located Sub! Name: "+oldname, tourschan);
						break;
					}
				}
				if (oldname !== null) break;
			}
			
			for (var s=0;s<tours.tour[key].seeds.length;s++) {
				if (tours.tour[key].seeds[s] == sys.name(src).toLowerCase()) {
					sys.sendMessage(src,Config.Tours.tourbot+"Non puoi fare sostituzioni nel torneo "+getFullTourName(key)+"!",tourschan);
					return true;
				}
			}
			
			if (oldname === null) {
				sys.sendMessage(src,Config.Tours.tourbot+"Non ci sono più posti da sostituire nel torneo "+getFullTourName(key)+"!",tourschan);
				return true;
			}
			var index = tours.tour[key].players.indexOf(oldname);
			var newname = sys.name(src).toLowerCase();
			tours.tour[key].players.splice(index,1,newname);
			tours.tour[key].cpt += 1;
			sys.sendAll(Config.Tours.tourbot+"IL NUOVO PARTECIPANTE "+sys.name(src)+" giocherà contro "+(index%2 == 0 ? toCorrectCase(tours.tour[key].players[index+1]) : toCorrectCase(tours.tour[key].players[index-1]))+" nel torneo "+getFullTourName(key)+". "+(tours.tour[key].players.length - tours.tour[key].cpt)+" post"+(tours.tour[key].players.length - tours.tour[key].cpt == 1 ? "o rimanente" : "i rimanenti") + ".", tourschan);
			return true;
		}
		if (command == "unjoin") {
			var key = null;
			for (var x in tours.tour) {
				if (tours.tour[x].state == "signups") {
					key = x;
					break;
				}
			}
			if (key === null) {
				sys.sendMessage(src,Config.Tours.tourbot+"Non puoi abbandonare ora!",tourschan);
				return true;
			}
			var index = tours.tour[key].players.indexOf(sys.name(src).toLowerCase());
			if (index == -1) {
				sys.sendMessage(src,Config.Tours.tourbot+"Non sei nel torneo "+getFullTourName(key)+"!",tourschan);
				return true;
			}
			tours.tour[key].players.splice(index, 1);
			tours.tour[key].cpt -= 1;
			sys.sendAll(Config.Tours.tourbot+sys.name(src)+" ha abbandonato il torneo "+getFullTourName(key)+"!", tourschan);
			return true;
		}
		if (command == "queue" || command == "viewqueue") {
			var queue = tours.queue;
			sys.sendMessage(src, "*** TORNEI IN CODA ***", tourschan);
			var nextstart = time_handle(tours.globaltime - parseInt(sys.time()));
			for (var x in tours.tour) {
				if (tours.tour[x].state == "signups") {
					nextstart = "Pending";
					break;
				}
			}
			if (Config.Tours.maxrunning <= tours.keys.length && calcPercentage() >= Config.Tours.minpercent) {
				nextstart = "Pending";
			}
			var firsttour = true;
			for (var e in queue) {
				var queuedata = queue[e].split(":::",5);
				if (firsttour && nextstart != "Pending") {
					sys.sendMessage(src,"1) "+queuedata[0]+": Set by "+queuedata[1]+"; Parameters: "+queuedata[2]+" Mode"+(queuedata[3] != "default" ? "; Gen: "+getSubgen(queuedata[3],true) : "")+(queuedata[4] == "double" ? "; Double Elimination" : "")+"; Starts in "+time_handle(tours.globaltime-parseInt(sys.time())),tourschan);
					firsttour = false;
				}
				else {
					sys.sendMessage(src,(parseInt(e)+1)+") "+queuedata[0]+": Set by "+queuedata[1]+"; Parameters: "+queuedata[2]+" Mode"+(queuedata[3] != "default" ? "; Gen: "+getSubgen(queuedata[3],true) : "")+(queuedata[4] == "double" ? "; Double Elimination" : ""), tourschan);
				}
			}
			return true;
		}
		if (command == "viewround") {
			if (tours.keys.length === 0) {
				sys.sendMessage(src,Config.Tours.tourbot+"No tournament is running at the moment!",tourschan);
				return true;
			}
			var postedrounds = false;
			var rounddata = [];
			for (var y in tours.tour) {
				var battlers = tours.tour[y].battlers;
				var winners = tours.tour[y].winners;
				if (tours.tour[y].round === 0) continue;
				postedrounds = true;
				var roundtable = "<div style='margin-left: 50px'><b>Il Round "+tours.tour[y].round+" del Torneo "+tours.tour[y].tourtype+"</b><table><br/>";
				for (var x=0; x<tours.tour[y].players.length; x+=2) {
					if (winners.indexOf(tours.tour[y].players[x]) != -1 && tours.tour[y].players[x] != "~Bye~") {
						roundtable = roundtable + "<tr><td align='right'><font color=green><b>"+html_escape(toCorrectCase(tours.tour[y].players[x])) +"</b></font></td><td align='center'> ha vinto contro </td><td>"+ html_escape(toCorrectCase(tours.tour[y].players[x+1]))+"</td>";
					}
					else if (winners.indexOf(tours.tour[y].players[x+1]) != -1 && tours.tour[y].players[x+1] != "~Bye~") {
						roundtable = roundtable + "<tr><td align='right'><font color=green><b>"+html_escape(toCorrectCase(tours.tour[y].players[x+1])) +"</b></font></td><td align='center'> ha vinto contro </td><td>"+ html_escape(toCorrectCase(tours.tour[y].players[x]))+"</td>";
					}
					else if (battlers.indexOf(tours.tour[y].players[x]) != -1) {
						roundtable = roundtable + "<tr><td align='right'>"+html_escape(toCorrectCase(tours.tour[y].players[x])) +"</td><td align='center'> sta <a href='po:watchPlayer/"+sys.id(tours.tour[y].players[x])+"'>giocando</a> contro </td><td>"+ html_escape(toCorrectCase(tours.tour[y].players[x+1]))+"</td>";
					}
					else {
						roundtable = roundtable + "<tr><td align='right'>"+html_escape(toCorrectCase(tours.tour[y].players[x])) +"</td><td align='center'> VS </td><td>"+ html_escape(toCorrectCase(tours.tour[y].players[x+1]))+"</td>";
					}
				}
				rounddata.push(roundtable+"</table></div>");
			}
			if (!postedrounds) {
				sys.sendMessage(src,Config.Tours.tourbot+"Nessun torneo in corso al momento!",tourschan);
				return true;
			}
			else {
				var roundstosend = htmlborder+rounddata.join(htmlborder)+htmlborder;
				sys.sendHtmlMessage(src, roundstosend, tourschan);
			}
			return true;
		}
		if (command == "touradmins") {
			sys.sendMessage(src, "",tourschan);
			sys.sendMessage(src, "*** TOUR ADMINS ***",tourschan);
			var tal = tours.touradmins;
			var authlist = sys.dbAuths();
			for (var l in tal) {
				if (sys.id(tal[l]) !== undefined) {
					sys.sendMessage(src, toCorrectCase(tal[l]) + " (Online):",tourschan);
				}
				else {
					sys.sendMessage(src, tal[l],tourschan);
				}
			}
			// displays online auth in "Tours" channel as well
			for (var m in authlist) {
				if (sys.id(authlist[m]) !== undefined && tal.indexOf(authlist[m]) == -1 && sys.isInChannel(sys.id(authlist[m]), tourschan)) {
					sys.sendMessage(src, toCorrectCase(authlist[m]) + " (Online):",tourschan);
				}
			}
			sys.sendMessage(src, "",tourschan);
			return true;
		}
		if (command == "tourinfo") {
			try {
				if (commandData == "") {
					sys.sendMessage(src,Config.Tours.tourbot+"Nick sconosciuto o scritto male!",tourschan);
					return true;
				}
				else {
					var score = 0;
					var rankings = sys.getFileContent("tourscores.txt").split("\n");
					for (var p in rankings) {
						if (rankings[p] == "") continue;
						var rankingdata = rankings[p].split(":::",2);
						if (cmp(rankingdata[0],commandData)) {
							score = rankingdata[1];
							break;
						}
					}
					var tourdata = sys.getFileContent("tourdetails.txt");
					sys.sendMessage(src, "*** DETTAGLI PER "+commandData+" (Punti: "+score+")***",tourschan);
					var tourinfopieces = tourdata.split("\n");
					for (var x in tourinfopieces) {
						var datatoread = tourinfopieces[x].split(":::",4);
						if (cmp(datatoread[0],commandData)) {
							sys.sendMessage(src, datatoread[2]+": Ha vinto "+datatoread[1]+" subentrato a "+datatoread[3],tourschan);
						}
					}
				}
				sys.sendMessage(src, "",tourschan);
			}
			catch (err) {
				sys.sendMessage(src, Config.Tours.tourbot+"No data exists yet!",tourschan);
			}
			return true;
		}
		if (command == "activeta") {
			sys.sendMessage(src, "",tourschan);
			sys.sendMessage(src, "*** TOUR ADMINS ***",tourschan);
			var tal = tours.touradmins;
			var authlist = sys.dbAuths();
			for (var l in tal) {
				if (sys.id(tal[l]) !== undefined && SESSION.users(sys.id(tal[l])).lastline.time + Config.Tours.activity > parseInt(sys.time())) {
					sys.sendMessage(src, toCorrectCase(tal[l]), tourschan);
				}
			}
			// displays online active auth in "Tours" channel as well
			for (var m in authlist) {
				if (sys.id(authlist[m]) !== undefined && tal.indexOf(authlist[m]) == -1 && sys.isInChannel(sys.id(authlist[m]), tourschan)  && SESSION.users(sys.id(authlist[m])).lastline.time + Config.Tours.activity > parseInt(sys.time())) {
					sys.sendMessage(src, toCorrectCase(authlist[m]), tourschan);
				}
			}
			sys.sendMessage(src, "",tourschan);
			return true;
		}
		if (command == "history") {
			sys.sendMessage(src, "*** TIERS GIOCATE RECENTEMENTE ***",tourschan);
			for (var x in tours.history) {
				sys.sendMessage(src, tours.history[x],tourschan);
			}
			return true;
		}
		if (command == "tourhelp" || command == "tourcommands") {
			sys.sendMessage(src, border,tourschan);
			sys.sendMessage(src, "*** Tournament Commands ***",tourschan);
			for (var t in tourcommands) {
				sys.sendMessage(src, tourcommands[t],tourschan);
			}
			if (isTourAdmin(src)) {
				sys.sendMessage(src, border,tourschan);
				for (var u in touradmincommands) {
					if (touradmincommands[u] == "*** COMANDI ADMIN+ ***" && !isTourSuperAdmin(src)) break;
					if (touradmincommands[u] == "*** COMANDI OWNER+ ***" && !isTourOwner(src)) break;
					sys.sendMessage(src, touradmincommands[u],tourschan);
				}
			}
			sys.sendMessage(src, border,tourschan);
			return true;
		}
		if (command == "rules" || command == "tourrules") {
			sys.sendMessage(src, border,tourschan);
			for (var t in tourrules) {
				sys.sendMessage(src, tourrules[t],tourschan);
			}
			sys.sendMessage(src, border,tourschan);
			return true;
		}
		if (command == "leaderboard") {
			try {
				if (commandData == "") {
					var rankings = sys.getFileContent("tourscores.txt").split("\n");
				}
				else {
					var tiers = sys.getTierList()
					var found = false;
					for (var x in tiers) {
						if (tiers[x].toLowerCase() == commandData.toLowerCase()) {
							var tourtier = tiers[x];
							found = true;
							break;
						}
					}
					if (!found) {
						throw ("Tier non valida")
					}
					var rankings = sys.getFileContent("tourscores_"+tourtier.replace(/ /g,"_")+".txt").split("\n");
				}
				var list = [];
				for (var p in rankings) {
					if (rankings[p] == "") continue;
					var rankingdata = rankings[p].split(":::",2);
					if (rankingdata[1] < 1) continue;
					list.push([rankingdata[1], rankingdata[0]]);
				}
				list.sort(function(a,b) { return b[0] - a[0] ; });
				sys.sendMessage(src, "*** TOUR RANKING "+(commandData != "" ? "("+commandData+") " : "")+"***",tourschan);
				for (var x=0; x<20; x++) {
					if (x >= list.length) break;
					sys.sendMessage(src, "#"+(x+1)+": "+(list[x])[1]+" ~ "+(list[x])[0]+" point"+((list[x])[0] != 1 ? "s" : ""),tourschan);
				}
			}
			catch (err) {
				if (err == "Tier non valida") {
					sys.sendMessage(src, Config.Tours.tourbot+commandData+" è una tier non valida!",tourschan);
				}
				else {
					sys.sendMessage(src, Config.Tours.tourbot+"Dati non disponibili!",tourschan);
				}
			}
			return true;
		}
		if (command == "monthlyleaderboard") {
			try {
				var now = new Date()
				var themonths = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "decemeber"];
				if (commandData == "") {
					var monthlyfile = "tourmonthscore_"+themonths[now.getUTCMonth()]+"_"+now.getUTCFullYear()+".txt";
				}
				else {
					var monthdata = commandData.toLowerCase().split(" ",2);
					if (monthdata.length == 1) {
						monthdata.push(now.getUTCFullYear());
					}
					var monthlyfile = "tourmonthscore_"+monthdata[0]+"_"+monthdata[1]+".txt";
				}
				var rankings = sys.getFileContent(monthlyfile).split("\n");
				var list = [];
				for (var p in rankings) {
					if (rankings[p] == "") continue;
					var rankingdata = rankings[p].split(":::",2);
					if (rankingdata[1] < 1) continue;
					list.push([rankingdata[1], rankingdata[0]]);
				}
				list.sort(function(a,b) { return b[0] - a[0] ; });
				sys.sendMessage(src, "*** TOUR RANKING MENSILE "+(commandData != "" ? "("+commandData+") " : "")+"***",tourschan);
				for (var x=0; x<20; x++) {
					if (x >= list.length) break;
					sys.sendMessage(src, "#"+(x+1)+": "+(list[x])[1]+" ~ "+(list[x])[0]+" point"+((list[x])[0] != 1 ? "s" : ""),tourschan);
				}
			}
			catch (err) {
				sys.sendMessage(src, Config.Tours.tourbot+"Non ci sono ancora dati per il mese di "+commandData+"!",tourschan);
			}
			return true;
		}
	}
	catch (err) {
		sys.sendAll("Errore nel comando '"+command+"': "+err, tourserrchan);
	}
	return false;
}

// Auto DQs inactive players
function removeinactive(key) {
	try {
		sendDebugMessage("Rimozione giocatori inattivi", tourschan);
		var activelist = tours.tour[key].active;
		var playercycle = tours.tour[key].players.length;
		var currentround = tours.tour[key].round;
		for (var z=0;z<playercycle;z+=2) {
			var player1 = tours.tour[key].players[z];
			var player2 = tours.tour[key].players[z+1];
			var dq1 = true;
			var dq2 = true;
			if (tours.tour[key].winners.indexOf(player1) != -1) {
				sendDebugMessage(player1+" ha battuto "+player2+"; il torneo continua!", tourschan);
				continue;
			}
			if (tours.tour[key].winners.indexOf(player2) != -1) {
				sendDebugMessage(player2+" ha battuto "+player1+"; il torneo continua!", tourschan);
				continue;
			}
			if (tours.tour[key].battlers.indexOf(player1) != -1 || tours.tour[key].battlers.indexOf(player2) != -1) {
				sendDebugMessage(player1+" sta giocando con "+player2+"; il torneo continua!", tourschan);
				continue;
			}
			if (player1 == "~DQ~" || player2 == "~DQ~" || player1 == "~Bye~" || player2 == "~Bye~") {
				sendDebugMessage("Controllo superfluo...", tourschan);
				continue;
			}
			if (activelist.hasOwnProperty(player1)) {
				if (activelist[player1] == "Battle" || (typeof activelist[player1] == "number" && activelist[player1]+Config.Tours.activity >= parseInt(sys.time()))) {
					sendDebugMessage(player1+" è attivo; il torneo continua!", tourschan);
					dq1 = false
				}
			}
			else {
				sendDebugMessage(player1+" non è attivo e viene squalificato.", tourschan);
			}
			if (activelist.hasOwnProperty(player2)) {
				if (activelist[player2] == "Battle" || (typeof activelist[player2] == "number" && activelist[player2]+Config.Tours.activity >= parseInt(sys.time()))) {
					sendDebugMessage(player2+" è attivo; il torneo continua!", tourschan);
					dq2 = false
				}
			}
			else {
				sendDebugMessage(player2+" is not active; disqualifying", tourschan);
			}
			if (dq1 && dq2) {
				sys.sendAll(Config.Tours.tourbot+toCorrectCase(player1)+" e "+toCorrectCase(player2)+" vengono squalificati per inattività al torneo "+getFullTourName(key)+"!", tourschan);
				dqboth(player1, player2, key);
			}
			else if (dq2) {
				sys.sendAll(Config.Tours.tourbot+toCorrectCase(player2)+" è stato/a squalificato/a per inattività dal torneo "+getFullTourName(key)+"!", tourschan);
				disqualify(player2,key,false);
			}
			else if (dq1) {
				sys.sendAll(Config.Tours.tourbot+toCorrectCase(player1)+" è stato/a squalificato/a per inattività dal torneo "+getFullTourName(key)+"!", tourschan);
				disqualify(player1,key,false);
			}
			else if ((tours.tour[key].time-parseInt(sys.time()))%60 === 0){
				sys.sendAll(Config.Tours.tourbot+toCorrectCase(player1)+" e "+toCorrectCase(player2)+" siete entrambi attivi; siete pregati di giocare per il torneo "+getFullTourName(key)+"!", tourschan);
			}
			// if the round advances due to DQ, don't keep checking :x
			if (tours.tour[key].round !== currentround) {
				break;
			}
		}
	}
	catch (err) {
		sys.sendAll("Errore nel processo 'removeinactive': "+err, tourserrchan);
	}
}

// Sends battle reminders
function sendReminder(key) {
	try {
		for (var z=0;z<tours.tour[key].players.length;z++) {
			var player = tours.tour[key].players[z];
			var opponent = z%2 == 0 ? tours.tour[key].players[z+1] : tours.tour[key].players[z-1];
			if (tours.tour[key].winners.indexOf(player) != -1) {
				continue;
			}
			if (tours.tour[key].winners.indexOf(opponent) != -1) {
				continue;
			}
			if (tours.tour[key].battlers.indexOf(player) != -1) {
				continue;
			}
			if ((isSub(player) || isSub(opponent)) && sys.id(player) !== undefined) {
				sys.sendMessage(sys.id(player), Config.Tours.tourbot+"Il tuo sostituto sarà squalificato tra "+time_handle(tours.tour[key].time-parseInt(sys.time())), tourschan);
			}
			else if (sys.id(player) !== undefined) {
				if (sys.isInChannel(sys.id(player), tourschan)) {
					sys.sendHtmlMessage(sys.id(player), "<ping/><font color=red><timestamp/> "+html_escape(toCorrectCase(player))+", devi giocare con <b>"+(z%2 === 0 ? html_escape(toCorrectCase(tours.tour[key].players[z+1])) : html_escape(toCorrectCase(tours.tour[key].players[z-1])))+"</b> nel torneo <b>"+html_escape(getFullTourName(key))+"</b>, rischi la squalifica per inattività! Contatta l'avversario nel canale #"+sys.channel(tourschan)+" per evitarla.</font>", tourschan);
				}
				else {
					sys.sendHtmlMessage(sys.id(player), "<ping/><font color=red><timestamp/> "+html_escape(toCorrectCase(player))+", devi giocare con <b>"+(z%2 === 0 ? html_escape(toCorrectCase(tours.tour[key].players[z+1])) : html_escape(toCorrectCase(tours.tour[key].players[z-1])))+"</b> nel torneo <b>"+html_escape(getFullTourName(key))+"</b> rischi la squalifica per inattività! Contatta l'avversario nel canale #"+sys.channel(tourschan)+" per evitarla.</font>");
					sys.sendMessage(sys.id(player), Config.Tours.tourbot+"Rientra nel canale #"+Config.Tours.channel+" per avere tutte le informazioni che servono!", tourschan)
				}
			}
		}
	}
	catch (err) {
		sys.sendAll("Errore nel processo 'sendReminder': "+err, tourserrchan);
	}
}

// Disqualifies a single player
function disqualify(player, key, silent) {
	try {
		if (tours.tour[key].players.indexOf(player) == -1) {
			return;
		}
		var index = tours.tour[key].players.indexOf(player);
		var winnerindex = tours.tour[key].winners.indexOf(player);
		if (index%2 == 1) {
			var opponent = tours.tour[key].players[index-1];
		}
		else {
			var opponent = tours.tour[key].players[index+1];
		}
		/* If the opponent is disqualified/is a sub we want to replace with ~Bye~ instead of ~DQ~ so brackets don't stuff up */
		if (opponent == "~DQ~") {
			tours.tour[key].players.splice(index,1,"~Bye~");
		}
		else {
			tours.tour[key].players.splice(index,1,"~DQ~");
		}
		/* We then check if opponent hasn't advanced, and advance them if they're not disqualified. We also remove player from winners if DQ'ed */
		if (opponent != "~DQ~" && winnerindex == -1 && tours.tour[key].winners.indexOf(opponent) == -1) {
			if (!isSub(opponent) && opponent != "~Bye~") {
				tours.tour[key].winners.push(opponent);
				tours.tour[key].losers.push(player);
				if (!silent) {
					sys.sendAll(Config.Tours.tourbot+toCorrectCase(opponent)+" avanza al turno successivo del torneo "+getFullTourName(key)+" a tavolino, che fortuna!", tourschan);
				}
			}
			else {
				tours.tour[key].winners.push("~Bye~");
				tours.tour[key].losers.push(player);
			}
		}
		else if (winnerindex != -1 && opponent != "~Bye~" && opponent != "~DQ~") { /* This is just so the winners list stays the same length */
			tours.tour[key].winners.splice(winnerindex,1,opponent);
			tours.tour[key].losers.splice(tours.tour[key].losers.indexOf(opponent),1,player);
			if (!silent) {
				sys.sendAll(Config.Tours.tourbot+toCorrectCase(opponent)+" avanza al turno successivo del torneo "+getFullTourName(key)+" a causa della squalifica di "+toCorrectCase(player)+", che fortuna!", tourschan);
			}
		}
		var battlesleft = parseInt(tours.tour[key].players.length/2)-tours.tour[key].winners.length;
		if (battlesleft <= 0) {
			if (tours.tour[key].state == "subround") removesubs(key);
			advanceround(key);
		}
	}
	catch (err) {
		sys.sendAll("Errore nel processo 'disqualify': "+err, tourserrchan);
	}
}

// for when both players are inactive
function dqboth(player1, player2, key) {
	try {
		var index1 = tours.tour[key].players.indexOf(player1);
		tours.tour[key].players.splice(index1,1,"~DQ~");
		var index2 = tours.tour[key].players.indexOf(player2);
		tours.tour[key].players.splice(index2,1,"~DQ~");
		tours.tour[key].losers.push(player1, player2);
		tours.tour[key].winners.push("~DQ~");
		var battlesleft = parseInt(tours.tour[key].players.length/2)-tours.tour[key].winners.length;
		if (battlesleft <= 0) {
			if (tours.tour[key].state == "subround") removesubs(key);
			advanceround(key)
		}
	}
	catch (err) {
		sys.sendAll("Error in process 'dqboth': "+err, tourserrchan);
	}
}

// removes subs
function removesubs(key) {
	try {
		var advanced = [];
		var opponent = null;
		for (var x in tours.tour[key].players) {
			if (isSub(tours.tour[key].players[x])) {
				opponent = null;
				disqualify(tours.tour[key].players[x],key,true);
				if (x%2 === 0) {
					opponent = tours.tour[key].players[x+1];
				}
				else {
					opponent = tours.tour[key].players[x-1];
				}
				if (!isSub(opponent) && opponent != "~DQ~" && opponent != "~Bye~" && opponent !== null) {
					advanced.push(opponent);
				}
				if (tours.tour[key].round !== 1) {
					break;
				}
			}
		}
		tours.tour[key].state = "round"
		if (advanced.length > 0) {
			sys.sendAll(Config.Tours.tourbot+advanced.join(", ")+(advanced.length == 1 ? " avanza" : " avanzano")+" al prossimo turno!", tourschan);
		}
	}
	catch (err) {
		sys.sendAll("Errore nel processo 'removesubs' per il giocatore "+tours.tour[key].players[x]+": "+err, tourserrchan);
	}
}

// removes byes
function removebyes(key) {
	try {
		var advanced = [];
		var playercycle = tours.tour[key].players.length;
		var currentround = tours.tour[key].round;
		var opponent = null;
		for (var z=0;z<playercycle;z+=2) {
			opponent = null;
			if (tours.tour[key].players[z] == "~Bye~" && tours.tour[key].players[z+1] == "~Bye~") {
				dqboth("~Bye~","~Bye~",key);
			}
			else if (tours.tour[key].players[z] == "~Bye~") {
				opponent = tours.tour[key].players[z+1];
				disqualify("~Bye~",key,true);
			}
			else if (tours.tour[key].players[z+1] == "~Bye~") {
				opponent = tours.tour[key].players[z];
				disqualify("~Bye~",key,true);
			}
			if (!isSub(opponent) && opponent != "~DQ~" && opponent != "~Bye~" && opponent !== null) {
				advanced.push(opponent);
			}
			// if the round advances due to DQ, don't keep checking :x
			if (tours.tour[key].round !== currentround) {
				break;
			}
		}
		if (advanced.length > 0) {
			sys.sendAll(Config.Tours.tourbot+advanced.join(", ")+(advanced.length == 1 ? " avanza" : " avanzano")+" al prossimo turno grazie al ~Bye~!", tourschan);
		}
	}
	catch (err) {
		sys.sendAll("Errore nel processo 'removebyes': "+err, tourserrchan);
	}
}
	
function battleend(winner, loser, key) {
	try {
		var winname = sys.name(winner).toLowerCase()
		var losename = sys.name(loser).toLowerCase()
		/* We need to check if winner/loser is in the Winners List */
		if (tours.tour[key].winners.indexOf(winname) != -1 || tours.tour[key].winners.indexOf(losename) != -1) {
			return;
		}
		tours.tour[key].winners.push(winname);
		tours.tour[key].losers.push(losename);
		var battlesleft = parseInt(tours.tour[key].players.length/2)-tours.tour[key].winners.length;
		if (tours.tour[key].parameters.type == "double") {
			if (tourwinmessages === undefined || tourwinmessages.length == 0) {
				sendHtmlAuthPlayers("<font color='"+Config.Tours.tourbotcolour+"'><timestamp/> <b>"+html_escape(Config.Tours.tourbot)+"</b></font><font color=blue>"+html_escape(sys.name(winner))+"</font> ha vinto contro <font color=red>"+html_escape(sys.name(loser))+ "</font> nel torneo "+getFullTourName(key)+"! "+battlesleft+" lott"+(battlesleft == 1 ? "a rimanente" : "e rimanenti")+ ".", key);
			}
			else {
				sendHtmlAuthPlayers("<font color='"+Config.Tours.tourbotcolour+"'><timestamp/> <b>"+html_escape(Config.Tours.tourbot)+"</b></font><font color=blue>"+html_escape(sys.name(winner))+"</font> "+html_escape(tourwinmessages[sys.rand(0, tourwinmessages.length)])+" <font color=red>"+html_escape(sys.name(loser))+ "</font> nel torneo "+getFullTourName(key)+"! "+battlesleft+" lott"+(battlesleft == 1 ? "a rimanente" : "e rimanenti") + ".", key);
			}
			if (tours.tour[key].losebracket.indexOf(losename) != -1) {
				sendHtmlAuthPlayers("<font color='"+Config.Tours.tourbotcolour+"'><timestamp/> <b>"+html_escape(Config.Tours.tourbot)+"</b></font> <b>"+html_escape(sys.name(loser))+"</b> ha perso due volte ed è quindi fuori dal torneo "+getFullTourName(key)+"!", key);
			}
		}
		else {
			if (tourwinmessages === undefined || tourwinmessages.length == 0) {
				sendHtmlAuthPlayers("<font color='"+Config.Tours.tourbotcolour+"'><timestamp/> <b>"+html_escape(Config.Tours.tourbot)+"</b></font><font color=blue>"+html_escape(sys.name(winner))+"</font> ha vinto contro <font color=red>"+html_escape(sys.name(loser))+ "</font> nel torneo "+getFullTourName(key)+" e avanza quindi al prossimo turno! "+battlesleft+" lott"+(battlesleft == 1 ? "a rimanente" : "e rimanenti") + ".", key);
			}
			else {
				sendHtmlAuthPlayers("<font color='"+Config.Tours.tourbotcolour+"'><timestamp/> <b>"+html_escape(Config.Tours.tourbot)+"</b></font><font color=blue>"+html_escape(sys.name(winner))+"</font> "+html_escape(tourwinmessages[sys.rand(0, tourwinmessages.length)])+" <font color=red>"+html_escape(sys.name(loser))+ "</font> nel torneo "+getFullTourName(key)+" e avanza al prossimo turno! "+battlesleft+" lott"+(battlesleft == 1 ? "a rimanente" : "e rimanenti") + ".", key);
			}
		}
		if (battlesleft <= 0) {
			advanceround(key);
		}
	}
	catch (err) {
		sys.sendAll("Error nel valutare i risultati degli incontri: "+err, tourserrchan);
	}
}

// advances the round
function advanceround(key) {
	try {
		var newlist = [];
		var winners = tours.tour[key].winners;
		var bannednames = ["~Bye~", "~DQ~"];
		var doubleelim = tours.tour[key].parameters.type == "double" ? true : false;
		if (doubleelim) {
			var newwinbracket = [];
			var newlosebracket = [];
			if (tours.tour[key].round == 1) {
				for (var y in tours.tour[key].players) {
					if (isSub(tours.tour[key].players[y]) || tours.tour[key].players[y] == "~DQ~") {
						tours.tour[key].players.splice(y,1,"~Bye~");
					}
				}
				for (var x=0;x<tours.tour[key].players.length;x+=2) {
					if (winners.indexOf(tours.tour[key].players[x]) > -1 && bannednames.indexOf(tours.tour[key].players[x]) == -1) {
						newwinbracket.push(tours.tour[key].players[x]);
						newlosebracket.push(tours.tour[key].players[x+1]);
					}
					else if (winners.indexOf(tours.tour[key].players[x+1]) > -1 && bannednames.indexOf(tours.tour[key].players[x+1]) == -1) {
						newwinbracket.push(tours.tour[key].players[x+1]);
						newlosebracket.push(tours.tour[key].players[x]);
					}
					else {
						newwinbracket.push("~Bye~");
						newlosebracket.push("~Bye~");
					}
				}
				newlosebracket.reverse();
				newlist = newwinbracket.concat(newlosebracket);
			}
			else if (tours.tour[key].players.length == 2 && tours.tour[key].round%2 === 0) { // special case for 2 or less players, first battle
				if (winners.indexOf(tours.tour[key].players[0]) > -1 && bannednames.indexOf(tours.tour[key].players[0]) == -1) {
					newlist.push(tours.tour[key].players[0]);
				}
				else if (winners.indexOf(tours.tour[key].players[1]) > -1 && bannednames.indexOf(tours.tour[key].players[1]) == -1) {
					newlist.push(tours.tour[key].players[0], tours.tour[key].players[1]);
				}
				else {
					newlist.push("~Bye~");
				}
			}
			else if (tours.tour[key].players.length == 2 && tours.tour[key].round%2 === 1) { // special case for 2 or less players, second battle
				if (winners.indexOf(tours.tour[key].players[0]) > -1 && bannednames.indexOf(tours.tour[key].players[0]) == -1) {
					newlist.push(tours.tour[key].players[0]);
				}
				else if (winners.indexOf(tours.tour[key].players[1]) > -1 && bannednames.indexOf(tours.tour[key].players[1]) == -1) {
					newlist.push(tours.tour[key].players[1]);
				}
				else {
					newlist.push("~Bye~");
				}
			}
			else if (tours.tour[key].round%2 === 0) {
				var losingwinners = []; // winner's bracket losers
				var winninglosers = []; // loser's bracket winners
				var winningwinners = []; // winners bracket winners
				for (var x=0;x<tours.tour[key].winbracket.length;x+=2) {
					if (winners.indexOf(tours.tour[key].winbracket[x]) > -1 && bannednames.indexOf(tours.tour[key].winbracket[x]) == -1) {
						winningwinners.push(tours.tour[key].winbracket[x]);
						losingwinners.push(tours.tour[key].winbracket[x+1]);
					}
					else if (winners.indexOf(tours.tour[key].winbracket[x+1]) > -1 && bannednames.indexOf(tours.tour[key].winbracket[x+1]) == -1) {
						winningwinners.push(tours.tour[key].winbracket[x+1]);
						losingwinners.push(tours.tour[key].winbracket[x]);
					}
					else {
						winningwinners.push("~Bye~");
						losingwinners.push("~Bye~");
					}
				}
				for (var l=0;l<tours.tour[key].losebracket.length;l+=2) {
					if (winners.indexOf(tours.tour[key].losebracket[l]) > -1 && bannednames.indexOf(tours.tour[key].losebracket[l]) == -1) {
						winninglosers.push(tours.tour[key].losebracket[l]);
					}
					else if (winners.indexOf(tours.tour[key].losebracket[l+1]) > -1 && bannednames.indexOf(tours.tour[key].losebracket[l+1]) == -1) {
						winninglosers.push(tours.tour[key].losebracket[l+1]);
					}
					else {
						winninglosers.push("~Bye~");
					}
				}
				for (var t=0; t<winningwinners.length; t++) {
					newwinbracket.push(winningwinners[t]);
					newwinbracket.push("~Bye~");
				}
				for (var s=0; s<losingwinners.length; s++) {
					newlosebracket.push(losingwinners[s]);
					newlosebracket.push(winninglosers[s]);
				}
				newlist = newwinbracket.concat(newlosebracket)
			}
			else if (tours.tour[key].round%2 === 1) {
				var winninglosers = []; // loser's bracket winners
				var winningwinners = []; // winners bracket winners
				for (var x=0;x<tours.tour[key].winbracket.length;x+=2) {
					if (winners.indexOf(tours.tour[key].winbracket[x]) > -1 && bannednames.indexOf(tours.tour[key].winbracket[x]) == -1) {
						winningwinners.push(tours.tour[key].winbracket[x]);
					}
					else if (winners.indexOf(tours.tour[key].winbracket[x+1]) > -1 && bannednames.indexOf(tours.tour[key].winbracket[x+1]) == -1) {
						winningwinners.push(tours.tour[key].winbracket[x+1]);
					}
					else {
						winningwinners.push("~Bye~");
					}
				}
				for (var l=0;l<tours.tour[key].losebracket.length;l+=2) {
					if (winners.indexOf(tours.tour[key].losebracket[l]) > -1 && bannednames.indexOf(tours.tour[key].losebracket[l]) == -1) {
						winninglosers.push(tours.tour[key].losebracket[l]);
					}
					else if (winners.indexOf(tours.tour[key].losebracket[l+1]) > -1 && bannednames.indexOf(tours.tour[key].losebracket[l+1]) == -1) {
						winninglosers.push(tours.tour[key].losebracket[l+1]);
					}
					else {
						winninglosers.push("~Bye~");
					}
				}
				newwinbracket = winningwinners;
				newlosebracket= winninglosers.reverse();
				newlist = newwinbracket.concat(newlosebracket);
			}
			else {
				sys.sendAll("Errore nei rounds del torneo '"+getFullTourName(key)+"' id "+key+": Broken roundcheck in double elim...", tourserrchan);
			}
		}
		else {
			for (var x=0;x<tours.tour[key].players.length;x+=2) {
				if (winners.indexOf(tours.tour[key].players[x]) > -1 && bannednames.indexOf(tours.tour[key].players[x]) == -1) {
					newlist.push(tours.tour[key].players[x]);
				}
				else if (winners.indexOf(tours.tour[key].players[x+1]) > -1 && bannednames.indexOf(tours.tour[key].players[x+1]) == -1) {
					newlist.push(tours.tour[key].players[x+1]);
				}
				else {
					newlist.push("~Bye~");
				}
			}
			for (var y in newlist) {
				if (isSub(newlist[y])) {
					newlist.splice(y,1,"~Bye~");
				}
			}
		}
		tours.tour[key].winners = [];
		tours.tour[key].losers = [];
		tours.tour[key].battlers = [];
		tours.tour[key].active = {};
		tours.tour[key].players = newlist;
		if (doubleelim) {
			tours.tour[key].winbracket = newwinbracket;
			tours.tour[key].losebracket = newlosebracket;
		}
		tourprintbracket(key);
	}
	catch (err) {
		sys.sendAll("Errore nei rounds del torneo '"+getFullTourName(key)+"' id "+key+": "+err, tourserrchan);
	}
}

// starts a tournament
function tourstart(tier, starter, key, parameters) {
	try {
		var channels = tourschan === 0 ? [0] : [0, tourschan];
		tours.tour[key] = {};
		tours.tour[key].state = "signups";
		tours.tour[key].time = parseInt(sys.time())+Config.Tours.toursignup
		tours.tour[key].tourtype = tier;
		tours.tour[key].players = []; // list for the actual tour data
		tours.tour[key].battlers = [];
		tours.tour[key].winners = [];
		tours.tour[key].losers = []; // this will make de mode easier
		tours.tour[key].round = 0;
		tours.tour[key].cpt = 0;
		tours.tour[key].seeds = [];
		tours.tour[key].maxcpt = 0;
		tours.tour[key].active = {};
		tours.tour[key].parameters = parameters
		if (tours.tour[key].parameters.type == "double") {
			tours.tour[key].winbracket = [];
			tours.tour[key].losebracket = [];
		}
		for (var x in channels) {
			sys.sendAll("", channels[x]);
			sys.sendAll(border, channels[x]);
			sys.sendHtmlAll("<timestamp/> Un torneo <b><a href='http://wiki.pokemon-online.eu/view/"+tier.replace(/ /g,"_")+"'>"+tier+"</a></b> è stato avviato da <b>"+html_escape(starter)+"</b>", channels[x]);
			sys.sendAll("CLAUSES: "+getTourClauses(tier),channels[x]);
			sys.sendAll("PARAMETERS: "+parameters.mode+" Mode"+(parameters.gen != "default" ? "; Gen: "+getSubgen(parameters.gen,true) : "")+(parameters.type == "double" ? "; Double Elimination" : ""), channels[x]);
			if (channels[x] == tourschan) {
				sys.sendHtmlAll("<timestamp/> Scrivi <b>/join</b> o clicca <a href='po:join/join'>QUI</a> per partecipare al torneo, hai "+time_handle(Config.Tours.toursignup)+" per iscriverti!", channels[x]);
			}
			else {
				sys.sendAll(Config.Tours.tourbot+"Vai nel canale #"+sys.channel(tourschan)+" e digita /join per partecipare al torneo, hai "+time_handle(Config.Tours.toursignup)+" per iscriverti!", channels[x]);
			}
			sys.sendAll(border, channels[x]);
			sys.sendAll("", channels[x]);
		}
		tours.keys.push(key)
		if (tours.key >= Config.Tours.maxarray) {
			tours.key = 0;
		}
		else {
			tours.key += 1;
		}
		var playerson = sys.playerIds();
		for (var x=0; x < playerson.length; ++x) {
			var id = playerson[x];
			var poUser = SESSION.users(id);
			if (sys.loggedIn(id) && poUser && poUser.tiers && poUser.tiers.indexOf(tier) != -1 && isInTour(sys.name(id)) === false) {
				if (sys.isInChannel(id, tourschan)) {
					sys.sendHtmlMessage(playerson[x], "<font color=red>Un torneo "+tier+" è iniziato! </font><ping/>",tourschan);
					continue;
				}
			}
		}
	}
	catch (err) {
		sys.sendAll("Error in stating a tournament: "+err, tourserrchan);
	}
}

/* Starts the first round */
function tourinitiate(key) {
	try {
		var size = tourmakebracket(key);
		if (size < 3) {
			sys.sendAll(Config.Tours.tourbot+"Il torneo "+getFullTourName(key)+" è stato annullato per mancanza di partecipanti; invita qualcun altro a giocare, il prossimo torneo inizia tra "+time_handle(Config.Tours.tourbreak)+".", tourschan)
			delete tours.tour[key];
			tours.keys.splice(tours.keys.indexOf(key), 1);
			tours.globaltime = parseInt(sys.time())+Config.Tours.tourbreak; // for next tournament
			return;
		}
		toursortbracket(size, key);
		tourprintbracket(key);
	}
	catch (err) {
		sys.sendAll("Errore nell'inizializzare il torneo, id "+key+": "+err, tourserrchan);
	}
}

// constructs the bracket
function tourmakebracket(key) {
	try {
		var bracketsize = 1
		if (tours.tour[key].players.length <= 2) {
			bracketsize = 2
		}
		else if (tours.tour[key].players.length <= 4) {
			bracketsize = 4
		}
		else if (tours.tour[key].players.length <= 8) {
			bracketsize = 8
		}
		else if (tours.tour[key].players.length <= 16) {
			bracketsize = 16
		}
		else if (tours.tour[key].players.length <= 32) {
			bracketsize = 32
		}
		else if (tours.tour[key].players.length <= 64) {
			bracketsize = 64
		}
		else if (tours.tour[key].players.length <= 128) {
			bracketsize = 128
		}
		else {
			bracketsize = 256
		}
		var subnumber = 1
		for (var p = tours.tour[key].players.length; p<bracketsize; p++) {
			tours.tour[key].players.push("~Sub "+subnumber+"~")
			subnumber += 1
		}
		return bracketsize;
	}
	catch (err) {
		sys.sendAll("Errore nella creazione della bracket, id "+key+": "+err, tourserrchan);
	}
}

// tour pushing functions used for constructing the bracket
function push2(x, size) {
	playerlist.push(ladderlist[x]);
	playerlist.push(ladderlist[size-x-1]);
}

function push4(x, size) {
	push2(x, size);
	push2(size/2-x-1, size);
}

function push8(x, size) {
	push4(x, size);
	push4(size/4-x-1, size);
}

function push16(x, size) {
	push8(x, size);
	push8(size/8-x-1, size);
}

function push32(x, size) {
	push16(x, size);
	push16(size/16-x-1, size);
}

function push64(x, size) {
	push32(x, size);
	push32(size/32-x-1, size);
}

function push128(x, size) {
	push64(x, size);
	push64(size/64-x-1, size);
}

function push256(x, size) {
	push256(x, size);
	push256(size/128-x-1, size);
}

// Sorting the tour bracket
function toursortbracket(size, key) {
	try {
		ladderlist = [];
		// This algorithm will sort players by ranking. 1st is tier points, 2nd is overall tour points, 3rd is ladder rankings.
		ladderlist.push(tours.tour[key].players[0]) ;
		for (var t=1; t<size; t++) {
			var added = false;
			var ishigher = false;
			var playerranking1 = getExtraTierPoints(tours.tour[key].players[t], tours.tour[key].tourtype);
			var playerranking2 = getExtraPoints(tours.tour[key].players[t]);
			var playerranking3 = sys.ranking(tours.tour[key].players[t], tours.tour[key].tourtype) !== undefined ? sys.ranking(tours.tour[key].players[t], tours.tour[key].tourtype) : sys.totalPlayersByTier(tours.tour[key].tourtype)+1;
			if (isSub(tours.tour[key].players[t])) {
				ladderlist.push(tours.tour[key].players[t]);
				continue;
			}
			for (var n=0; n<ladderlist.length;n++) {
				var otherranking1 = getExtraTierPoints(ladderlist[n], tours.tour[key].tourtype);
				var otherranking2 = getExtraPoints(ladderlist[n]);
				var otherranking3 = sys.totalPlayersByTier(tours.tour[key].tourtype)+2;
				if (isSub(ladderlist[n])) {
					otherranking1 = -1
				}
				else if (sys.ranking(ladderlist[n], tours.tour[key].tourtype) === undefined) {
					otherranking3 = sys.totalPlayersByTier(tours.tour[key].tourtype) + 1;
				}
				else {
					otherranking3 = sys.ranking(ladderlist[n], tours.tour[key].tourtype);
				}
				if (playerranking1 > otherranking1) {
					ishigher = true;
				}
				else if (playerranking1 === otherranking1 && playerranking2 > otherranking2) {
					ishigher = true;
				}
				else if (playerranking1 === otherranking1 && playerranking2 === otherranking2 && ((playerranking3 < otherranking3) || (playerranking3 === otherranking3 && sys.rand(0,2) == 1))) {
					ishigher = true;
				}
				if (ishigher) {
					ladderlist.splice(n,0,tours.tour[key].players[t]);
					added = true;
					break;
				}
			}
			if (!added) {
				ladderlist.push(tours.tour[key].players[t]);
			}
		}
		playerlist = []
		/* Seed Storage */
		tours.tour[key].seeds = ladderlist;
		if (size == 4) {
			push4(0, size);
		}
		else if (size == 8) {
			push8(0, size);
		}
		else if (size == 16) {
			push16(0, size);
		}
		else if (size == 32) {
			push32(0, size);
		}
		else if (size == 64) {
			push64(0, size);
		}
		else if (size == 128) {
			push128(0, size);
		}
		else if (size == 256) {
			push256(0, size);
		}
		tours.tour[key].players = playerlist;
		delete ladderlist;
		delete playerlist;
	}
	catch (err) {
		sys.sendAll("Error in sorting the bracket, id "+key+": "+err, tourserrchan);
	}
}

// this actually prints the bracket
function tourprintbracket(key) {
	try {
		tours.tour[key].round += 1;
		if (tours.tour[key].players.length == 1) { // winner
			// CHANGE 1 > 0
			var channels = [1, tourschan];
			var winner = toCorrectCase(tours.tour[key].players[0]);
			if (winner !== "~Bye~") {
				for (var x in channels) {
					sys.sendAll("", channels[x]);
					sys.sendAll(border, channels[x]);
					sys.sendHtmlAll("<timestamp/> Il torneo "+getFullTourName(key)+" è stato vinto da <b>"+html_escape(winner)+"</b>!", channels[x]);
					sys.sendAll("", channels[x]);
					sys.sendAll(Config.Tours.tourbot+"Congratulazioni a "+winner+" per il successo!", channels[x]);
					sys.sendAll(border, channels[x]);
					sys.sendAll("", channels[x]);
				}
				awardTourPoints(winner.toLowerCase(), tours.tour[key].cpt, tours.tour[key].tourtype, tours.tour[key].parameters.type == "double" ? true : false);
			}
			else sys.sendAll(Config.Tours.tourbot+"Il "+getFullTourName(key)+" è finito!", tourschan);
			tours.history.unshift(getFullTourName(key)+": Vinto da "+winner+", con "+tours.tour[key].cpt+" partecipanti.");
			if (tours.history.length > 25) {
				tours.history.pop();
			}
			delete tours.tour[key];
			tours.keys.splice(tours.keys.indexOf(key), 1);
			if (tours.keys.length === 0) {
				tours.globaltime = parseInt(sys.time())+Config.Tours.tourbreak; // for next tournament
			}
			return;
		}
		else if (tours.tour[key].players.length == 2) { // finals
			/* Here in case it's ~Bye~ vs ~Bye~ */
			if (tours.tour[key].players[0] == "~Bye~" && tours.tour[key].players[1] == "~Bye~") {
				sys.sendAll(Config.Tours.tourbot+"Il "+getFullTourName(key)+" è stato interrotto!", tourschan);
				delete tours.tour[key];
				tours.keys.splice(tours.keys.indexOf(key), 1);
				if (tours.keys.length === 0) {
					tours.globaltime = parseInt(sys.time())+Config.Tours.tourbreak; // for next tournament
				}
				return;
			}
			tours.tour[key].state = "final";
			var channels = [tourschan];
			var player1data = "<td>("+(tours.tour[key].seeds.indexOf(tours.tour[key].players[0])+1)+")</td><td align='right'>"+html_escape(toCorrectCase(tours.tour[key].players[0]))+"</td>";
			var player2data = "<td>"+html_escape(toCorrectCase(tours.tour[key].players[1]))+"</td><td>("+(tours.tour[key].seeds.indexOf(tours.tour[key].players[1])+1)+")</td>";
			var roundinfo = "<b>"+(tours.tour[key].parameters.type == "double" && tours.tour[key].round%2 == 1 ? "Spareggio" : "Finale")+" del torneo "+getFullTourName(key)+" nel canale <a href='po:join/"+html_escape(sys.channel(tourschan))+"'>#"+html_escape(sys.channel(tourschan))+"</a></th></tr></b><br/>";
			var roundposting = "<div style='margin-left: 50px'>"+roundinfo+"<table><tr>"+player1data+"<td align='center'> VS </td>"+player2data+"</tr>";
			for (var c in channels) {
				if (channels[c] === tourschan) {
					sendFlashingBracket("<br/>"+htmlborder+roundposting+"</table></div>"+htmlborder+"<br/>", key);
				}
				else {
					sys.sendHtmlAll("<br/>"+htmlborder+roundposting+"</table></div>"+htmlborder+"<br/>", channels[c]);
				}
			}
			/* Here in case of the hilarious ~Bye~ vs ~Bye~ siutation */
			tours.tour[key].time = parseInt(sys.time())+Config.Tours.tourdq;
			removebyes(key);
			return;
		}
		else {
			var subsExist = false
			for (var x in tours.tour[key].players) {
				if (isSub(tours.tour[key].players[x])) {
					subsExist = true;
					break;
				}
			}
			if (tours.tour[key].round == 1 && subsExist) {
				tours.tour[key].state = "subround";
				tours.tour[key].time = parseInt(sys.time())+Config.Tours.subtime;
			}
			else {
				tours.tour[key].state = "round";
				tours.tour[key].time = parseInt(sys.time())+Config.Tours.tourdq;
			}
			if (tours.tour[key].round == 1) {
				var submessage = "<div style='margin-left: 50px'><br/>Scrivi <b>/join</b> o clicca <a href='po:join/join'>QUI</a> per iscriverti dopo le iscrizioni!</div>";
				var roundposting = "<div style='margin-left: 50px'><b>Round "+tours.tour[key].round+" del torneo "+getFullTourName(key)+"</b><br/><table>";
				for (var x=0; x<tours.tour[key].players.length; x+=2) {
					var player1data = "<td>("+(tours.tour[key].seeds.indexOf(tours.tour[key].players[x])+1)+")</td><td align='right'>"+html_escape(toCorrectCase(tours.tour[key].players[x]))+"</td>";
					var player2data = "<td>"+html_escape(toCorrectCase(tours.tour[key].players[x+1]))+"</td><td>("+(tours.tour[key].seeds.indexOf(tours.tour[key].players[x+1])+1)+")</td>";
					roundposting = roundposting+"<tr>"+player1data+"<td align='center'> VS </td>"+player2data+"</tr>";
				}
				sendFlashingBracket("<br/>"+htmlborder+roundposting+"</table></div>"+(subsExist ? submessage : "")+htmlborder+"<br/>",key);
			}
			else if (tours.tour[key].parameters.type == "double") {
				var roundposting = "<div style='margin-left: 50px'><b>Round "+tours.tour[key].round+" del torneo "+getFullTourName(key)+"</b><br/><table><tr><th colspan=5><font color=blue>Winners' Bracket</font></th></tr>";
				for (var x=0; x<tours.tour[key].players.length; x+=2) {
					if (tours.tour[key].parameters.type == "double" && x == tours.tour[key].players.length/2) {
						roundposting = roundposting + "<tr><td></td></tr><tr><th colspan=5><font color=red>Losers' Bracket</font></th></tr>";
					}
					var player1data = "<td>("+(tours.tour[key].seeds.indexOf(tours.tour[key].players[x])+1)+")</td><td align='right'>"+html_escape(toCorrectCase(tours.tour[key].players[x]))+"</td>";
					var player2data = 

"<td>"+html_escape(toCorrectCase(tours.tour[key].players[x+1]))+"</td><td>("+(tours.tour[key].seeds.indexOf(tours.tour[key].players[x+1])+1)+")</td>";
					roundposting = roundposting+"<tr>"+player1data+"<td align='center'> VS </td>"+player2data+"</tr>";
				}
				sendHtmlAuthPlayers("<br/>"+htmlborder+roundposting+"</table></div>"+htmlborder+"<br/>", key);
			}
			else {
				var roundposting = "<div style='margin-left: 50px'><b>Round "+tours.tour[key].round+" del torneo "+getFullTourName(key)+"</b><br/><table>";
				for (var x=0; x<tours.tour[key].players.length; x+=2) {
					var player1data = "<td>("+(tours.tour[key].seeds.indexOf(tours.tour[key].players[x])+1)+")</td><td align='right'>"+html_escape(toCorrectCase(tours.tour[key].players[x]))+"</td>";
					var player2data = "<td>"+html_escape(toCorrectCase(tours.tour[key].players[x+1]))+"</td><td>("+(tours.tour[key].seeds.indexOf(tours.tour[key].players[x+1])+1)+")</td>";
					roundposting = roundposting+"<tr>"+player1data+"<td align='center'> VS </td>"+player2data+"</tr>";
				}
				sendHtmlAuthPlayers("<br/>"+htmlborder+roundposting+"</table></div>"+htmlborder+"<br/>", key);
			}
			removebyes(key);
		}
	}
	catch (err) {
		sys.sendAll("Error in printing the bracket, id "+key+": "+err, tourserrchan);
	}
}

// is the tournament battle valid?
function isValidTourBattle(src,dest,clauses,mode,team,destTier,key,challenge) { // challenge is whether it was issued by challenge
	try {
		var srcindex = tours.tour[key].players.indexOf(sys.name(src).toLowerCase());
		var destindex = tours.tour[key].players.indexOf(sys.name(dest).toLowerCase());
		var srcisintour = false;
		var destisintour = false;
		if (srcindex != -1) {
			if (tours.tour[key].losers.indexOf(sys.name(src).toLowerCase()) == -1) {
				srcisintour = true;
			}
			if (tours.tour[key].parameters.type == "double") {
				if (tours.tour[key].winbracket.indexOf(sys.name(src).toLowerCase()) != -1 || tours.tour[key].round == 1) {
					srcisintour = true;
				}
			}
		}
		if (destindex != -1) {
			if (tours.tour[key].losers.indexOf(sys.name(dest).toLowerCase()) == -1) {
				destisintour = true;
			}
			if (tours.tour[key].parameters.type == "double") {
				if (tours.tour[key].winbracket.indexOf(sys.name(dest).toLowerCase()) != -1 || tours.tour[key].round == 1) {
					destisintour = true;
				}
			}
		}
		var srcbtt = tours.tour[key].battlers.indexOf(sys.name(src).toLowerCase());
		var destbtt= tours.tour[key].battlers.indexOf(sys.name(dest).toLowerCase());
		var srcwin = tours.tour[key].winners.indexOf(sys.name(src).toLowerCase());
		var destwin = tours.tour[key].winners.indexOf(sys.name(dest).toLowerCase());
		var checklist = clauseCheck(tours.tour[key].tourtype, clauses);
		var invalidmsg = "";
		var isInCorrectGen = true;
		if (tours.tour[key].parameters.gen != "default") {
			var getGenParts = tours.tour[key].parameters.gen.split("-",2)
			if (parseInt(sys.gen(src,team)) !== parseInt(getGenParts[0]) || parseInt(sys.subgen(src,team)) !== parseInt(getGenParts[1])) {
				isInCorrectGen = false;
			}
		}
		if (!srcisintour) {
			return "Non sei nel torneo.";
		}
		else if (!destisintour) {
			return "Questo giocatore non sta partecipando.";
		}
		else if (tours.tour[key].round < 1) {
			return "Il torneo non è ancora iniziato.";
		}
		else if (srcbtt != -1 && challenge) {
			return "Hai già iniziato a lottare!";
		}
		else if (destbtt != -1 && challenge) {
			return "Questo giocatore ha già iniziato a lottare!";
		}
		else if (srcwin != -1) {
			return "Hai già giocato e vinto.";
		}
		else if (destwin != -1) {
			return "Questo giocatore ha già giocato e vinto.";
		}
		else if ((srcindex%2 === 1 && srcindex-destindex != 1) || (srcindex%2 === 0 && destindex-srcindex != 1)) {
			return "Non è il tuo avversario! Cerca il tuo avversario con il comando /viewround";
		}
		else if (mode != 1 && tours.tour[key].parameters.mode == "Doubles") {
			return "Devi giocare in modalità Doubles.";
		}
		else if (mode != 2 && tours.tour[key].parameters.mode == "Triples") {
			return "Devi giocare in modalità Triples.";
		}
		else if (mode !== 0 && tours.tour[key].parameters.mode == "Singles") {
			return "Devi giocare in modalità Singles.";
		}
		else if (!isInCorrectGen && tours.tour[key].parameters.gen != "default") {
			return "Questo match va giocato in "+getSubgen(tours.tour[key].parameters.gen, true)+". Change it in the teambuilder.";
		}
		else if (checklist.missing.length > 0 && checklist.extra.length > 0) {
			invalidmsg = "Devi attivare le seguenti Clauses: "+checklist.missing.join(", ")+" e rimuovere queste: "+checklist.extra.join(", ");
			return invalidmsg;
		}
		else if (checklist.missing.length > 0) {
			invalidmsg = "Devi attivare le seguenti Clauses: "+checklist.missing.join(", ");
			return invalidmsg;
		}
		else if (checklist.extra.length > 0) {
			invalidmsg = "Devi disattivare le seguenti Clauses: "+checklist.extra.join(", ");
			return invalidmsg;
		}
		else if (tours.tour[key].state == "final" && clauses%8 >= 4) {
			/* We allow Disallow Spects to be used for all rounds except finals */
			return "Disallow Spects è proibita nei match finali.";
		}
		else if (sys.tier(src, team) != tours.tour[key].tourtype) {
			return "Devi sfidare il tuo avversario con un team "+tours.tour[key].tourtype+"!";
		}
		else if (sys.tier(src, team) != destTier) {
			return "Devi sfidare il tuo avversario nella tier "+tours.tour[key].tourtype+" con un team valido.";
		}
		else return "Valid";
	}
	catch (err) {
		sys.sendAll("Error in battle check, id "+key+": "+err, tourserrchan);
		return "Errore nel controllo Clauses.";
	}
}

// awards tournament points
function awardTourPoints(player, size, tier, delim) {
    // each tournament has a 'tier'
    // points for 4-7,8-15,16-31,32-63,64-127,128-255,256 players respectively. Tours with 3 players or less don't score. Double tours score in the higher up bracket
    var tierscore = {
        'a': [1,2,4,8,16,32,64], // for individual tiers scroes or high scoring tiers
        'b': [1,2,3,5,8,12,18], // default
        'c': [0,1,2,3,5,8,12],
        'd': [0,0,1,2,3,5,8],
        'e': [0,0,0,1,2,3,5],
        'f': [0,0,0,0,1,2,3],
        'z': [0,0,0,0,0,0,0]
    }
	var now = new Date()
	sys.appendToFile("tourdetails.txt", player+":::"+size+":::"+tier+":::"+now+"\n");
	if (size < 4 || !Config.Tours.points) return;
	var scale = 0;
	var points = 0
	for (var x=3;x<10;x++) {
		if (size < Math.pow(2,x)) {
			scale = x-3;
			break;
		}
	}
	if (delim && scale != 6) {
		scale += 1
	}
    var tiers_a = [];
    var tiers_b = []; // default
    var tiers_c = ["Monotype"];
    var tiers_d = ["Challenge Cup"];
    var tiers_e = ["Wifi CC 1v1", "Gen 5 1v1", "Gen 5 1v1 Ubers"];
    var tiers_f = ["CC 1v1"];
    var tiers_z = ["Metronome"];
	if (tiers_a.indexOf(tier) != -1) {
		points = tierscore.a[scale];
	}
	else if (tiers_b.indexOf(tier) != -1) {
		points = tierscore.b[scale];
	}
	else if (tiers_c.indexOf(tier) != -1) {
		points = tierscore.c[scale];
	}
	else if (tiers_d.indexOf(tier) != -1) {
		points = tierscore.d[scale];
	}
	else if (tiers_e.indexOf(tier) != -1) {
		points = tierscore.e[scale];
	}
	else if (tiers_f.indexOf(tier) != -1) {
		points = tierscore.f[scale];
	}
	else if (tiers_z.indexOf(tier) != -1) {
		points = tierscore.z[scale];
	}
	else {
		points = tierscore.b[scale];
	}
	// writing global scores
	sys.appendToFile("tourscores.txt", "");
	try {
		var data = sys.getFileContent("tourscores.txt");
	}
	catch (e) {
		var data = "";
	}
	var array = data.split("\n");
	var newarray = [];
	var onscoreboard = false;
	for (var n in array) {
		if (array[n] === "") continue;
		var scores = array[n].split(":::", 2)
		if (player === scores[0]) {
			var newscore = parseInt(scores[1]) + points;
			newarray.push(scores[0]+":::"+newscore);
			onscoreboard = true;
		}
		else {
			newarray.push(array[n]);
		}
	}
	if (!onscoreboard) {
		newarray.push(player+":::"+points);
	}
	sys.writeToFile("tourscores.txt", newarray.join("\n"));
	// writing global monthly scores
	var themonths = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "decemeber"];
	var monthlyfile = "tourmonthscore_"+themonths[now.getUTCMonth()]+"_"+now.getUTCFullYear()+".txt";
	sys.appendToFile(monthlyfile, "");
	try {
		var data3 = sys.getFileContent(monthlyfile);
	}
	catch (e) {
		var data3 = "";
	}
	var array3 = data3.split("\n");
	var newarray3 = [];
	var onscoreboard3 = false;
	for (var j in array3) {
		if (array3[j] === "") continue;
		var scores3 = array3[j].split(":::", 2)
		if (player === scores3[0]) {
			var newscore3 = parseInt(scores3[1]) + points;
			newarray3.push(scores3[0]+":::"+newscore3);
			onscoreboard3 = true;
		}
		else {
			newarray3.push(array3[j]);
		}
	}
	if (!onscoreboard3) {
		newarray3.push(player+":::"+points);
	}
	sys.writeToFile(monthlyfile, newarray3.join("\n"));
	// writing tier scores
	sys.appendToFile("tourscores_"+tier.replace(/ /g,"_")+".txt", "");
	try {
		var data2 = sys.getFileContent("tourscores_"+tier.replace(/ /g,"_")+".txt");
	}
	catch (e) {
		var data2 = "";
	}
	var array2 = data2.split("\n");
	var newarray2 = [];
	var onscoreboard2 = false;
	for (var k in array2) {
		if (array2[k] === "") continue;
		var scores2 = array2[k].split(":::", 2);
		if (player === scores2[0]) {
			var newscore2 = parseInt(scores2[1]) + tierscore.a[scale];
			newarray2.push(scores2[0]+":::"+newscore2);
			onscoreboard2 = true;
		}
		else {
			newarray2.push(array2[k]);
		}
	}
	if (!onscoreboard2) {
		newarray2.push(player+":::"+tierscore.a[scale]);
	}
	sys.writeToFile("tourscores_"+tier.replace(/ /g,"_")+".txt", newarray2.join("\n"));
	return;
}

// Displays name in correct case

function toCorrectCase(name) {
	if (isNaN(name) && sys.id(name) !== undefined) {
		return sys.name(sys.id(name));
	}
	else {
		return name;
	}
}

// Tour Auth Functions

function isTourAdmin(src) {
	if (sys.auth(src) >= 1 || isTourSuperAdmin(src)) {
		return true;
	}
	if (sys.auth(src) < 0 || !sys.dbRegistered(sys.name(src))) {
		return false;
	}
	var tadmins = tours.touradmins
	if (tadmins !== undefined && tadmins.length >= 1) {
		for (var t in tadmins) {
			if (tadmins[t].toLowerCase() == sys.name(src).toLowerCase()) {
				return true;
			}
		}
	}
	return false;
}

function isTourSuperAdmin(src) {
	if (sys.auth(src) >= 2 || isTourOwner(src)) {
		return true;
	}
	if (sys.auth(src) < 1 || !sys.dbRegistered(sys.name(src))) {
		return false;
	}
	var tsadmins = [];
	if (tsadmins !== undefined && tsadmins.length >= 1) {
		for (var t in tsadmins) {
			if (tsadmins[t].toLowerCase() == sys.name(src).toLowerCase()) {
				return true;
			}
		}
	}
	return false;
}

function isTourOwner(src) {
	if (sys.auth(src) >= 3) {
		return true;
	}
	if (sys.auth(src) < 1 || !sys.dbRegistered(sys.name(src))) {
		return false;
	}
	var towners = ["lamperi", "aerith", "zeroality"];
	if (towners !== undefined && towners.length >= 1) {
		for (var t in towners) {
			if (towners[t].toLowerCase() == sys.name(src).toLowerCase()) {
				return true;
			}
		}
	}
	return false;
}

function isInSpecificTour(name, key) {
	var srcisintour = false;
	if (tours.tour[key].players.indexOf(name.toLowerCase()) != -1) {
		if (tours.tour[key].losers.indexOf(name.toLowerCase()) == -1) {
			srcisintour = true;
		}
		if (tours.tour[key].parameters.type == "double") {
			if (tours.tour[key].winbracket.indexOf(name.toLowerCase()) != -1 || tours.tour[key].round == 1) {
				srcisintour = true;
			}
		}
	}
	return srcisintour;
}

function isInTour(name) {
	var key = false;
	for (var x in tours.tour) {
		if (tours.tour[x].players.indexOf(name.toLowerCase()) != -1) {
			var srcisintour = false;
			if (tours.tour[x].losers.indexOf(name.toLowerCase()) == -1) {
				srcisintour = true;
			}
			if (tours.tour[x].parameters.type == "double") {
				if (tours.tour[x].winbracket.indexOf(name.toLowerCase()) != -1 || tours.tour[x].round == 1) {
					srcisintour = true;
				}
			}
			if (srcisintour) {
				key = x;
				break;
			}
		}
	}
	return key;
}

function isTourMuted(src) {
	var ip = sys.ip(src);
	if (tours.tourmutes.hasOwnProperty(ip)) {
		if (tours.tourmutes[ip].expiry <= parseInt(sys.time())) {
			delete tours.tourmutes[ip];
			saveTourMutes();
			return false;
		}
		return true;
	}
	else {
		return false;
	}
}

// writes tourmutes to tourmutes.txt
function saveTourMutes() {
	sys.writeToFile("tourmutes.txt", "");
	for (var x in tours.tourmutes) {
		if (tours.tourmutes[x].expiry <= parseInt(sys.time())) {
			delete tours.tourmutes[x];
			continue;
		}
		sys.appendToFile("tourmutes.txt", x+":::"+tours.tourmutes[x].expiry+":::"+tours.tourmutes[x].reason+":::"+tours.tourmutes[x].auth+":::"+tours.tourmutes[x].name+"\n");
	}
}

function loadTourMutes() {
	var mutefile = sys.getFileContent("tourmutes.txt");
	var mutedata = mutefile.split("\n");
	for (var x in mutedata) {
		var data = mutedata[x].split(":::", 5);
		if (data.length < 5) {
			continue;
		}
		var expiry = parseInt(data[1]);
		if (expiry <= parseInt(sys.time())) {
			continue;
		}
		var ip = data[0];
		var reason = data[2];
		var auth = data[3];
		var player = data[4];
		tours.tourmutes[ip] = {'expiry': expiry, 'reason': reason, 'auth': auth, 'name': player}
	}
}

// to prevent silly mute reasons
function usingBadWords(message) {
	if (/f[uo]ck|\bass\b|assh[o0]le|\barse|\bcum\b|\bdick|\bsex\b|pussy|bitch|porn|\bfck|nigga|\bcock\b|\bgay|\bhoe\b|slut|whore|cunt|clit|pen[i1]s|vag|nigger|negro|negri|taon/i.test(message)) {
		return true;
	}
	else return false;
}

function markActive(src) {
	var name = sys.name(src).toLowerCase()
	var key = isInTour(name)
	if (key !== false) {
		if (tours.tour[key].active.hasOwnProperty(name)) {
			if (tours.tour[key].active[name] === "Battle") {
				return;
			}
		}
		tours.tour[key].active[name] = parseInt(sys.time());
	}
}

function getListOfTours(num) {
	var list = [];
	for (var x=tours.queue.length-1;x>=0;x--) {
		var tourdata = tours.queue[x].split(":::",5);
		list.push(tourdata[0]);
		if (list.length >= num) {
			return list;
		}
	}
	for (var t in tours.tour) {
		var tier = tours.tour[t].tourtype;
		list.push(tier);
		if (list.length >= num) {
			return list;
		}
	}
	for (var h=0;h<tours.history.length;h++) {
		var historydata = tours.history[h];
		var pos = historydata.indexOf(":");
		var thetour = historydata.substr(0,pos);
		list.push(thetour);
		if (list.length >= num) {
			return list;
		}
	}
	return list;
}

// variance function that influences time between tournaments. The higher this is, the faster tours will start.
function calcVariance() {
	var playersInChan = parseInt((sys.playersOfChannel(tourschan)).length);
	var playersInTours = 0;
	for (var x in tours.tour) {
		if (tours.tour[x].players !== undefined) {
			playersInTours += parseInt(tours.tour[x].players.length);
		}
	}
	// stupid div/0 error :<
	if (playersInChan === 0) {
		return 0.5;
	}
	if (playersInTours === 0) { // use ln(#players)
		return Math.log(playersInChan);
	}
	var variance = Math.log(playersInChan/playersInTours);
	if (variance <= 0.5 || isNaN(variance)) {
		return 0.5;
	}
	else return variance;
}

function calcPercentage() { // calc percentage of players in tournaments playing
	var playersInChan = parseInt((sys.playersOfChannel(tourschan)).length)
	var playersInTours = 0;
	var playerList = sys.playersOfChannel(tourschan);
	for (var x in playerList) {
		var playerName = sys.name(playerList[x]);
		if (isInTour(playerName)) {
			playersInTours += 1;
		}
	}
	if (playersInChan === 0) {
		return 100;
	}
	var variance = playersInTours/playersInChan*100;
	if (isNaN(variance)) {
		return 100;
	}
	return variance;
}

function sendWelcomeMessage(src, chan) {
	sys.sendMessage(src,border,chan);
	sys.sendMessage(src,"*** Benvenuto/a nel canale #"+Config.Tours.channel+" - Tornei versione "+Config.Tours.version+"! ***",chan);
	
	// CHANGE
	
	for (var x in tours.tour) {
	    // CHANGE
		if (x==0) { sys.sendMessage(src,"",chan); sys.sendMessage(src,"*** TORNEI ***",chan); }
		//
		if (tours.tour[x].state == "signups") {
			sys.sendMessage(src, getFullTourName(x)+": Iscrizioni aperte, "+time_handle(tours.tour[x].time-parseInt(sys.time()))+" rimanenti. Scrivi /join per iscriverti.", chan);
		}
		else if (tours.tour[x].state == "subround" && tours.tour[x].players.length - tours.tour[x].cpt !== 0) {
			sys.sendMessage(src, getFullTourName(x)+": Puoi iscriverti come sostituto, usa /join.", chan);
		}
		else if (tours.tour[x].state == "final") {
			sys.sendMessage(src, getFullTourName(x)+": FINALE", chan);
		}
		else {
			sys.sendMessage(src, getFullTourName(x)+": Round "+tours.tour[x].round, chan);
		}
	}
	if (!sys.dbRegistered(sys.name(src))) {
		sys.sendMessage(src, Config.Tours.tourbot+"Devi registrare il tuo nickname per partecipare ai tornei! Clicca su Registrati sotto la chat!", chan);
	}
	sys.sendMessage(src,"*** Usa /help per i comandi e /rules per le regole! ***",chan);
	sys.sendMessage(src,border,chan);
}

function dumpVars(src) {
	var activelist = [];
	sys.sendMessage(src, border, tourschan);
	sys.sendMessage(src, "*** Variable Dump ***", tourschan);
	sys.sendMessage(src, "*** Main ***", tourschan);
	sys.sendMessage(src, "GlobalTime: "+tours.globaltime, tourschan);
	sys.sendMessage(src, "CurrentTime: "+sys.time(), tourschan);
	sys.sendMessage(src, "% players in Tours: "+Math.floor(calcPercentage())+"%", tourschan);
	for (var x in tours.tour) {
		activelist = [];
		sys.sendMessage(src, "*** Round "+tours.tour[x].round+"; "+getFullTourName(x)+" Tour (key "+x+")***", tourschan);
		sys.sendMessage(src, "Time: "+tours.tour[x].time, tourschan);
		sys.sendMessage(src, "Players: "+tours.tour[x].players, tourschan);
		sys.sendMessage(src, "Battlers: "+tours.tour[x].battlers, tourschan);
		sys.sendMessage(src, "Winners: "+tours.tour[x].winners, tourschan);
		sys.sendMessage(src, "Losers: "+tours.tour[x].losers, tourschan);
		sys.sendMessage(src, "Total Players: "+tours.tour[x].cpt, tourschan);
		for (var y in tours.tour[x].active) {
			if (tours.tour[x].active[y] === "Battle") {
				activelist.push(y + "(Battle)")
			}
			else if (typeof tours.tour[x].active[y] == "number") {
				if (tours.tour[x].active[y]+Config.Tours.activity >= parseInt(sys.time())) {
					activelist.push(y + "(Post)");
				}
			}
		}
		sys.sendMessage(src, "Active: "+activelist.join("; "), tourschan);
		sys.sendMessage(src, "Seeds: "+tours.tour[x].seeds, tourschan);
	}
	sys.sendMessage(src, border, tourschan);
}

// end tournament functions
// module functions

module.exports = {
	handleCommand: function(source, message, channel) {
		var command;
		var commandData = "";
		var pos = message.indexOf(' ');
		if (pos != -1) {
			command = message.substring(0, pos).toLowerCase();
			commandData = message.substr(pos+1);
		} 
		else {
			command = message.substr(0).toLowerCase();
		}
		if (channel === tourschan) {
			return tourCommand(source, command, commandData);
		}
		return false;
	},
	init: function() {
		initTours();
	},
	afterChannelJoin : function(player, chan) {
		if (chan === tourschan) {
			sendWelcomeMessage(player, chan);
		}
		// Script hack to reload into correct channel
		if (tourschan === undefined && sys.existChannel(Config.Tours.channel)) {
			tourschan = sys.channelId(Config.Tours.channel);
		}
		if (tourschan === 0 && sys.existChannel(Config.Tours.channel)) {
			tourschan = sys.channelId(Config.Tours.channel);
		}
		if (tourserrchan === 0 && sys.existChannel(Config.Tours.errchannel)) {
			tourserrchan = sys.channelId(Config.Tours.errchannel);
		}
		if (tourserrchan === undefined && sys.existChannel(Config.Tours.errchannel)) {
			tourserrchan = sys.channelId(Config.Tours.errchannel);
		}
	},
	afterBattleEnded : function(source, dest, desc) {
		try {
			tourBattleEnd(source, dest, desc);
		}
		catch (err) {
			sys.sendAll("Error in event 'tourBattleEnd': "+err, tourserrchan);
		}
	},
	stepEvent : function() {
		tourStep();
	},
	beforeChallengeIssued : function(source, dest, clauses, rated, mode, team, destTier) {
		var ret = false;
		ret |= tourChallengeIssued(source, dest, clauses, rated, mode, team, destTier);
		return ret;
	},
	afterBattleStarted : function(source, dest, clauses, rated, mode, bid) {
		return tourBattleStart(source, dest, clauses, rated, mode, bid);
	},
	beforeBattleMatchup : function(source, dest, clauses, rated) {
		var ret = false;
		ret |= (isInTour(sys.name(source)) || isInTour(sys.name(dest)));
		return ret;
	},
	beforeChannelJoin : function(src, channel) {
	},
	beforeChatMessage : function(src, message, channel) {
		if (isTourMuted(src) && !isTourAdmin(src) && channel === tourschan) {
			sys.sendMessage(src,Config.Tours.tourbot+"Sei stato mutato da "+tours.tourmutes[sys.ip(src)].auth+". Scade tra "+time_handle(tours.tourmutes[sys.ip(src)].expiry-parseInt(sys.time()))+". [Motivo: "+tours.tourmutes[sys.ip(src)].reason+"]",tourschan);
			return true;
		}
		else return false;
    },
	afterChatMessage : function(src, message, channel) {
		if (channel === tourschan && !usingBadWords(message)) {
			markActive(src);
		}
    },
	allowToSpectate : function(src, p1, p2) {
		if (isTourAdmin(src)) {
			var srctour = isInTour(sys.name(src));
			var p1tour = isInTour(sys.name(p1));
			var p2tour = isInTour(sys.name(p2));
			if (p1tour === false || p2tour === false) {
				return false;
			}
			if (p1tour !== p2tour) {
				return false;
			}
			if (srctour === p1tour) {
				return false;
			}
			return true;
		}
		return false;
	}
}
