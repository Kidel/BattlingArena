// Don't touch anything here if you don't know what you do.
var noPlayer = '*';

var mafia = new function() {
    // Remember to update this if you are updating mafia
    // Otherwise mafia game won't get reloaded 
    this.version = "2011-05-12.1";

    var defaultTheme = {
      name: "default",
      sides: [
        { "side": "mafia", "translation": "Mafia"
        },
        { "side": "mafia1", "translation": "French Canadian Mafia"
        },
        { "side": "mafia2", "translation": "Italian Mafia"
        },
        { "side": "village", "translation": "Good people"
        },
        { "side": "werewolf", "translation": "WereWolf"
        },
        { "side": "godfather", "translation": "Godfather"
        }
      ],
      roles: [{
          "role": "villager",
          "translation": "Villager",
          "side": "village",
          "help": "You dont have any special commands during the night! Vote to remove people in the day!",
          "actions": {}
      }, {
          "role": "inspector",
          "translation": "Inspector",
          "side": "village",
          "help": "Type /Inspect [name] to find his/her identity!",
          "actions": { "night": {"inspect": {"target": "AnyButSelf", "common": "Self", "priority": 30} } }
      }, {
          "role": "bodyguard",
          "translation": "Bodyguard",
          "side": "village",
          "help": "Type /Protect [name] to protect someone!",
          "actions": { "night": {"protect": {"target": "AnyButSelf", "common": "Role", "priority": 5, "broadcast": "role"} },
                       "startup": "role-reveal"}
      }, {
          "role": "mafia",
          "translation": "Mafia",
          "side": "mafia",
          "help": "Type /Kill [name] to kill someone!",
          "actions": { "night": {"kill": {"target": "AnyButTeam", "common": "Team", "priority": 11, "broadcast": "team"} },
                       "startup": "team-reveal"}
      }, {
          "role": "werewolf",
          "translation": "WereWolf",
          "side": "werewolf",
          "help": "Type /Kill [name] to kill someone!",
          "actions": { "night": {"kill": {"target": "AnyButSelf", "common": "Self", "priority": 10} },
                       "distract": {"mode": "ChangeTarget", "hookermsg": "You tried to distract the Werewolf (what an idea, srsly), you were ravishly devoured, yum !", "msg": "The ~Distracter~ came to you last night! You devoured her instead !"},
                       "avoidHax": ["kill"] }
      }, {
          "role": "hooker",
          "translation": "Pretty Lady",
          "side": "village",
          "help": "Type /Distract [name] to distract someone! Vote to remove people in the day!",
          "actions": { "night": {"distract": {"target": "AnyButSelf", "common": "Self", "priority": 1} } }
      }, {
          "role": "mayor",
          "translation": "Mayor",
          "side": "village",
          "help": "You dont have any special commands during the night! Vote to remove people in the day! (your vote counts as 2)",
          "actions": { "vote": 2 }
      }, {
          "role": "spy",
          "translation": "Spy",
          "side": "village",
          "help": "You can find out who is going to get killed next!(no command for this ability) Vote to remove people in the day!",
          "actions": { "hax": {"kill": { "revealTeam": 0.33, "revealPlayer": 0.1} } }
      }, {
          "role": "godfather", 
          "translation": "Godfather",
          "side": "godfather",
          "help": "Type /Kill [name] to kill someone! You can kill 2 targets, Type /kill [name2] again to select your second target!",
          "actions": { "night": {"kill": {"target": "AnyButSelf", "common": "Self", "priority": 20, "limit": 2} }, 
                       "distract": {"mode": "ChangeTarget", "hookermsg": "You tried to seduce the Godfather, you just were killed!", "msg": "The ~Distracter~ came to you last night! You killed her instead!"},
                       "avoidHax": ["kill"] }
      }, {
          "role": "vigilante",
          "translation": "Vigilante",
          "side": "village",
          "help": "Type /Kill [name] to kill someone!(dont kill the good people!)",
          "actions": { "night": {"kill": {"target": "AnyButSelf", "common": "Self", "priority": 19} } }
      }, {
          "role": "mafia1",
          "translation": "French Canadian Mafia",
          "side": "mafia1",
          "help": "Type /Kill [name] to kill someone!",
          "actions": { "night": {"kill": {"target": "AnyButTeam", "common": "Team", "priority": 12, "broadcast": "team"} },
                       "startup": "team-reveal"}
      }, {
          "role": "mafia2",
          "translation": "Italian Mafia",
          "side": "mafia2",
          "help": "Type /Kill [name] to kill someone!",
          "actions": { "night": {"kill": {"target": "AnyButTeam", "common": "Team", "priority": 11, "broadcast": "team"} },
                       "startup": "team-reveal"}
      }, {
          "role": "conspirator1",
          "translation": "French Canadian Conspirator",
          "side": "mafia1",
          "help": "You dont have any special commands during the night! You are sided French Canadian Mafia. Vote to remove people in the day!",
          "actions": { "inspect": {"revealAs": "villager"}, 
                       "startup": "team-reveal"}
      }, {
          "role": "conspirator2",
          "translation": "Italian Conspirator",
          "side": "mafia2",
          "help": "You dont have any special commands during the night! You are sided Italian Mafia. Vote to remove people in the day!",
          "actions": { "inspect": {"revealAs": "villager"},
                       "startup": "team-reveal"}
      }, {
          "role": "mafiaboss1",
          "translation": "Don French Canadian Mafia",
          "side": "mafia1",
          "help": "Type /Kill [name] to kill someone! You can't be distracted!",
          "actions": { "night": {"kill": {"target": "AnyButTeam", "common": "Team", "priority": 12, "broadcast": "team"} },
                      "distract": {"mode": "ignore"},
                      "startup": "team-reveal"}
      }, {
          "role": "mafiaboss2",
          "translation": "Don Italian Mafia",
          "side": "mafia2",
          "help": "Type /Kill [name] to kill someone! You can't be distracted!",
          "actions": { "night": {"kill": {"target": "AnyButTeam", "common": "Team", "priority": 11, "broadcast": "team"} },
                      "distract": {"mode": "ignore"},
                      "startup": "team-reveal"}
      }, {
          "role": "samurai",
          "translation": "Samurai",
          "side": "village",
          "help": "Type /Kill [name] during the day phase to kill someone! You will be revealed when you kill, so make wise choices! You are allied with the Good people.",
          "actions": { "standby": {"kill": {"target": "AnyButSelf", "msg": "You can kill now using /kill [name] :",
                                   "killmsg": "~Self~ pulls out a sword and strikes it through ~Target~'s chest!"} } }
      }, {
          "role": "miller",
          "translation": "Miller",
          "side": "village",
          "help": "You dont have any special commands during the night! Vote to remove people in the day! Oh, and insp sees you as Mafia",
          "actions": { "inspect": {"revealAs": "mafia"} },
      }],

      roles1: ["bodyguard", "mafia", "inspector", "werewolf", "hooker", "villager", "mafia",
               "villager", "miller", "villager", "mayor"],
      roles2: ["bodyguard", "mafia1", "mafia1", "inspector", "hooker", "villager", "mafia2",
               "mafia2", "villager", "villager", "villager", "mayor", "villager", "spy", "villager",
               "villager", "villager", "mafiaboss1", "villager", "vigilante", "villager", "godfather",
               "mafiaboss2", "samurai", "villager", "villager", "werewolf", "mafia1",
               "mafia2", "bodyguard"],
      villageCantLoseRoles: ["mayor", "vigilante", "samurai"]
    };

    /* Theme is a small helper to organize themes
     * inside the mafia game */
    function Theme() {}
    Theme.prototype.toString = function() { return "[theme Theme]"; }

    Theme.prototype.addSide = function(obj) {
        this.sideTranslations[obj.side] = obj.translation;
    }
    Theme.prototype.addRole = function(obj) {
        this.roles[obj.role] = obj;

        if ("hax" in obj.actions) {
            for(var i in obj.actions.hax) {
                var action = i;
                if (!(action in this.haxRoles)) {
                    this.haxRoles[action] = [];
                }
                this.haxRoles[action].push(obj.role);
            }
        }
        if ("night" in obj.actions) {
            for (var i in obj.actions.night) {
                var priority = obj.actions.night[i].priority;
                var action = i;
                var role = obj.role;
                this.nightPriority.push({'priority': priority, 'action': action, 'role': role});
            }
            this.nightPriority.sort(function(a,b) { return a.priority - b.priority });
        }
        if ("standby" in obj.actions) {
            for (var i in obj.actions.standby) {
                this.standbyRoles.push(obj.role);
            }
        }
    }
    /* Theme Loading and Storing */
    Theme.prototype.side = function(side) {
        return this.sideTranslations[side];
    }
    Theme.prototype.getHaxRolesFor = function(command) {
        if (command in this.haxRoles) {
            return this.haxRoles[command];
        }
        return [];
    }
    this.loadTheme = function(plain_theme) {
        var theme = new Theme();
        theme.sideTranslations = {};
        theme.roles = {};
        theme.nightPriority = [];
        theme.standbyRoles = [];
        theme.haxRoles = {};
        
        // Init from the theme
        for (var i in plain_theme.sides) {
            theme.addSide(plain_theme.sides[i]);
        }
        for (var i in plain_theme.roles) {
            theme.addRole(plain_theme.roles[i]);
        }
        theme.roles1 = plain_theme.roles1;
        theme.roles2 = plain_theme.roles2;
        theme.villageCantLoseRoles = plain_theme.villageCantLoseRoles;
        theme.name = plain_theme.name;
        this.themes[theme.name.toLowerCase()] = theme;
    }

    this.loadWebTheme = function(url) {
        if (typeof sys != 'object') return;
        sys.webCall(url, 'SESSION.global().mafia.addWebTheme(resp)');
    }
    this.addWebTheme = function(resp) {
        try {
            plain_theme = JSON.parse(resp);
            mafia.loadTheme(plain_theme);
        } catch (err) {
            sys.sendAll("+MafiaBot: Couldn't download Internet theme.", mafiachan);
            return;
        }
    }

    this.themes = {};
    this.loadTheme(defaultTheme);

    this.isInGame = function(player) {
        if (mafia.state == "entry") {
            return this.signups.indexOf(player) != -1;
        }
        return player in this.players;
    };
    this.hasCommand = function(name, command, state) {
        var player = this.players[name];
        return (state in player.role.actions && command in player.role.actions[state]);
    };
    this.correctCase = function(string) {
        var lstring = string.toLowerCase();
        for (var x in this.players) {
            if (x.toLowerCase() == lstring)
                return this.players[x].name;
        }
        return noPlayer;
    };
    this.clearVariables = function() {
        /* hash : playername => playerstruct */
        this.players = {};
        this.signups = [];
        this.state = "blank";
        this.ticks = 0;
        this.votes = {};
        this.voteCount = 0;
        this.ips = [];
        this.resetTargets();
    };
    this.lastAdvertise = 0;
    this.resetTargets = function() {
        this.teamTargets = {};
        this.roleTargets = {};
        for (var p in this.players) {
            this.players[p].targets = {};
            this.players[p].dayKill = undefined;
            this.players[p].guarded = undefined;
        }
    };
    this.clearVariables();
    /* callback for /start */
    this.startGame = function(src, commandData) {
        if (mafia.state != "blank") {
            sys.sendMessage(src, "±Game: A game is going on. Wait until it's finished to start another one", mafiachan);
            sys.sendMessage(src, "±Game: You can join the game by typing /join !", mafiachan);
            return;
        }
        
        mafia.theme = mafia.themes["default"];
        if (commandData != noPlayer) {
            var themeName = commandData.toLowerCase();
            if (themeName in mafia.themes) {
                mafia.theme = mafia.themes[themeName];
            } else {
                sys.sendMessage(src, "±Game: No such theme!", mafiachan);
                return;
            }
        } 

        sys.sendAll("", mafiachan);
        sys.sendAll("*** ************************************************************************************", mafiachan);
        sys.sendAll("±Game: " + sys.name(src) + " started a game with theme "+mafia.theme.name+"!", mafiachan);
        sys.sendAll("±Game: Type /Join to enter the game!", mafiachan);
        sys.sendAll("*** ************************************************************************************", mafiachan);
        sys.sendAll("", mafiachan);

        if (sys.playersOfChannel(mafiachan).length < 20) {
            var time = parseInt(sys.time());
            if (false && time > mafia.lastAdvertise + 60*15) {
                mafia.lastAdvertise = time;
                sys.sendAll("", 0);
                sys.sendAll("*** ************************************************************************************", 0);
                sys.sendAll("±Game: " + sys.name(src) + " started a mafia game!", 0);
                sys.sendAll("±Game: Go in the #Mafia Channel and type /Join to enter the game!", 0);
                sys.sendAll("*** ************************************************************************************", 0);
                sys.sendAll("", 0);
            }
        }
        mafia.clearVariables();
        mafia.state = "entry";

        mafia.ticks = 60;
    };
    /* callback for /end */
    this.endGame = function(src) {
        if (mafia.state == "blank") {
            sys.sendMessage(src, "±Game: No game is going on.",mafiachan);
            return;
        }
        sys.sendAll("*** ************************************************************************************", mafiachan);
        sys.sendAll("±Game: " + sys.name(src) + " has stopped the game!", mafiachan);
        sys.sendAll("*** ************************************************************************************", mafiachan);
        sys.sendAll("", mafiachan);

        mafia.clearVariables();
    };
    /* called every second */
    this.tickDown = function() {
        if (this.ticks <= 0) {
            return;
        }
        this.ticks = this.ticks - 1;
        if (this.ticks == 0)
            this.callHandler(this.state);
        else {
            if (this.ticks == 30 && this.state == "entry") {
                sys.sendAll("", mafiachan);
                sys.sendAll("±Game: Hurry up, you only have "+this.ticks+" seconds more to join!", mafiachan);
                sys.sendAll("", mafiachan);
            }
        }
    };
    this.sendPlayer = function(player, message) {
        var id = sys.id(player);
        if (id == undefined)
            return;
        sys.sendMessage(id, message, mafiachan);
    };
    this.getPlayersForTeam = function(side) {
        var team = [];
        for (var p in this.players) {
            var player = this.players[p];
            if (player.role.side == side) {
                team.push(player.name);
            }
        }
        return team;
    };
    this.getPlayersForTeamS = function(side) {
        return mafia.getPlayersForTeam(side).join(", ");
    };
    this.getPlayersForRole = function(role) {
        var team = []
        for (var p in this.players) {
            var player = this.players[p];
            if (player.role.role == role) {
                team.push(player.name);
            }
        }
        return team;
    };
    this.getPlayersForRoleS = function(role) {
        return mafia.getPlayersForRole(role).join(", ");
    };
    this.getCurrentRoles = function() {
        var list = []
        for (var p in this.players) {
            list.push(this.players[p].role.translation);
        }
         /* Sorting to not give out the order of the roles per player */
        return list.sort().join(", ");
    };
    this.getCurrentPlayers = function() {
        var list = [];
        for (var p in this.players) {
            list.push(this.players[p].name);
        }
        return list.sort().join(", ");

    }
    this.player = function(role) {
        for (var p in this.players) {
            if (mafia.players[p].role.role == role) //Checks sequentially all roles to see if this is the good one
                return x;
        }
        return noPlayer;
    };
    this.removePlayer = function(player) {
        //sys.sendAll("removing player " + player.name, mafiachan); 
        for (var action in player.role.actions.night) {
            var targetMode = player.role.actions.night[action].target;
            var team = this.getPlayersForTeam(player.role.side);
            var role = this.getPlayersForRole(player.role.role);
            if ((targetMode == 'AnyButSelf' || targetMode == 'Any')
             || (targetMode == 'AnyButTeam' && team.length == 1)
             || (targetMode == 'AnyButRole' && role.length == 1)) {
                this.removeTarget(player, action);
            }
        }
        delete this.players[player.name];
    };
    this.kill = function(player) {
        sys.sendAll("±Kill: " + player.name + " (" + player.role.translation + ") died!", mafiachan);
        this.removePlayer(player);
    };
    this.removeTargets = function(player) {
        for (var action in player.role.actions.night) {
            this.removeTarget(player, action);
        }
    };
    this.removeTarget = function(player, action) {
        var targetMode = player.role.actions.night[action].common;
        if (targetMode == 'Self') {
            player.targets[action] = [];
        } else if (targetMode == 'Team') {
            if (!(player.role.side in this.teamTargets)) {
                this.teamTargets[player.role.side] = {};
            }
            this.teamTargets[player.role.side][action] = [];
        } else if (targetMode == 'Role') {
            if (!(player.role.role in this.roleTargets)) {
                this.roleTargets[player.role.role] = {};
            }
            this.roleTargets[player.role.role][action] = [];
        }
    };
    this.removeTarget2 = function(player, target) {
        // TODO: implement
    };
    this.getTargetsFor = function(player, action) {
        var commonTarget = player.role.actions.night[action].common;
        if (commonTarget == 'Self') {
            if (!(action in player.targets)) {
                player.targets[action] = [];
            }
            return player.targets[action];
        } else if (commonTarget == 'Team') {
            if (!(player.role.side in this.teamTargets)) {
                this.teamTargets[player.role.side] = {};
            }
            if (!(action in this.teamTargets[player.role.side])) {
                this.teamTargets[player.role.side][action]= [];
            }
            return this.teamTargets[player.role.side][action];
        } else if (commonTarget == 'Role') {
            if (!(player.role.role in this.roleTargets)) {
                this.roleTargets[player.role.role] = {};
            }
            if (!(action in this.roleTargets[player.role.role])) {
                this.roleTargets[player.role.role][action]= [];
            }
            return this.roleTargets[player.role.role][action];
        }
    };
    this.setTarget = function(player, target, action) {
        var commonTarget = player.role.actions.night[action].common;
        var limit = 1;
        if (player.role.actions.night[action].limit !== undefined) {
            limit = player.role.actions.night[action].limit;
        }
        var list;
        if (commonTarget == 'Self') {
            if (!(action in player.targets)) {
                player.targets[action] = [];
            }
            list = player.targets[action];
        } else if (commonTarget == 'Team') {
            if (!(player.role.side in this.teamTargets)) {
                this.teamTargets[player.role.side] = {};
            }
            if (!(action in this.teamTargets[player.role.side])) {
                this.teamTargets[player.role.side][action]= [];
            }
            list = this.teamTargets[player.role.side][action];
        } else if (commonTarget == 'Role') {
            if (!(player.role.role in this.roleTargets)) {
                this.roleTargets[player.role.role] = {};
            }
            if (!(action in this.roleTargets[player.role.role])) {
                this.roleTargets[player.role.role][action]= [];
            }
            list = this.roleTargets[player.role.role][action];
        }
        if (list.indexOf(target.name) == -1) {
            list.push(target.name);
            if (list.length > limit) {
                list.splice(0, 1);
            }
        }
        if (this.ticks > 0 && limit > 1)
            this.sendPlayer(player.name, "±Game: Your target(s) are " + list.join(', ') + "!");
    };
    this.testWin = function() {
        outer:
        for (var p in mafia.players) {
            var winSide = mafia.players[p].role.side;
            if (winSide != 'village') {
                for (var i in mafia.villageCantLoseRoles) {
                     if (mafia.player(mafia.villageCantLoseRoles[i]) != noPlayer)
                        // baddies shouldn't win if vigi, mayor or samurai is alive
                        continue outer;
                }
            }
            var players = [];
            var goodPeople = [];
            for (var x in mafia.players) {
                if (mafia.players[x].role.side == winSide) {
                    players.push(x);
                } else if (winSide == 'village') {
                    // if winSide = villy all people must be good people
                    continue outer;
                } else if (mafia.players[x].role.side == 'village') {
                    goodPeople.push(x); 
                } else {
                    // some other baddie team alive
                    return false;
                }
            }

            if (players.length >= goodPeople.length) {
                sys.sendAll("±Game: The " + mafia.theme.side(winSide) + " (" + players.join(', ') + ") wins!", mafiachan);
                if (goodPeople.length > 0) {
                    sys.sendAll("±Game: The " + mafia.theme.side('village') + " (" + goodPeople.join(', ') + ") lose!", mafiachan);
                }
                sys.sendAll("*** ************************************************************************************", mafiachan);
                mafia.clearVariables();
                return true;
            }
        }
        return false;
    };
    this.handlers = {
        entry: function () {
            sys.sendAll("*** ************************************************************************************", mafiachan);
            sys.sendAll("Times Up! :", mafiachan);

            if (mafia.signups.length < 5) {
                sys.sendAll("Well, Not Enough Players! :", mafiachan);
                sys.sendAll("You need at least 5 players to join (Current; " + mafia.signups.length + ").", mafiachan);
                sys.sendAll("*** ************************************************************************************", mafiachan);
                mafia.clearVariables();
                return;
            }

            /* Creating the roles list */
            if (mafia.signups.length <= mafia.theme.roles1.length) {
                var srcArray = mafia.theme.roles1.slice(0, mafia.signups.length);
            } else {
                var srcArray = mafia.theme.roles2.slice(0, mafia.signups.length);
            }

            srcArray = shuffle(srcArray);

            for (var i = 0; i < srcArray.length; ++i) {
                mafia.players[mafia.signups[i]] = {'name': mafia.signups[i], 'role': mafia.theme.roles[srcArray[i]], 'targets': {}};
            }

            sys.sendAll("The Roles have been Decided! :", mafiachan);
            for (var p in mafia.players) {
                var player = mafia.players[p];
                var role = player.role;

                mafia.sendPlayer(player.name, "±Game: You are a " + role.translation + "!");
                mafia.sendPlayer(player.name, "±Game: " + role.help);

                if (role.actions.startup == "team-reveal") {
                    mafia.sendPlayer(player.name, "±Game: Your team is " + mafia.getPlayersForTeamS(role.side) + ".");
                }
                if (role.actions.startup == "role-reveal") {
                    mafia.sendPlayer(player.name, "±Game: People with your role are " + mafia.getPlayersForRoleS(role.role) + ".");
                }
                if (typeof role.actions.startup == "object" && role.actions.startup.revealRole) {
                    mafia.sendPlayer(player.name, "±Game: The " + mafia.theme.roles[role.actions.startup.revealRole].translation + " is " + mafia.getPlayersForRoleS(player.role.actions.startup.revealRole) + "!");
                }
            }
            sys.sendAll("Current Roles: " + mafia.getCurrentRoles() + ".", mafiachan);
            sys.sendAll("Current Players: " + mafia.getCurrentPlayers() + ".", mafiachan);
            sys.sendAll("Time: Night", mafiachan);
            sys.sendAll("Make your moves, you only have 30 seconds! :", mafiachan);
            sys.sendAll("*** ************************************************************************************", mafiachan);

            mafia.ticks = 30;
            mafia.state = "night";
            mafia.resetTargets();
        }
    ,
        night : function() {
            sys.sendAll("*** ************************************************************************************", mafiachan);
            sys.sendAll("Times Up! :", mafiachan);

            var nightkill = false;
            var getTeam = function(role, commonTarget) {
                var team = [];
                if (commonTarget == 'Role') {
                    team = mafia.getPlayersForRole(role.role);
                } else if (commonTarget == 'Team') {
                    team = mafia.getPlayersForTeam(role.side);
                }
                return team;
            }

            for (var i in mafia.theme.nightPriority) {
                var o = mafia.theme.nightPriority[i];
                var names = mafia.getPlayersForRole(o.role);
                for (var j = 0; j < names.length; ++j) {
                    if (!mafia.isInGame(names[j])) continue;
                    var player = mafia.players[names[j]];
                    //sys.sendAll(player.name + " is " + o.role + ", action is " +o.action , mafiachan);
                    var targets = mafia.getTargetsFor(player, o.action);
                    //sys.sendAll("targets are " + targets, mafiachan);
                    if (o.action == "distract") {
                        if (targets.length == 0) continue;
                        var target = targets[0];
                        if (!mafia.isInGame(target)) continue;
                        target = mafia.players[target];
                        var distractMode = target.role.actions.distract;
                        if (distractMode === undefined) {

                            mafia.sendPlayer(target.name, "±Game: The " + player.role.translation +" came to you last night! You were too busy being distracted!");
                            mafia.removeTargets(target);
                            /* warn role / teammates */
                            if ("night" in target.role.actions) {
                                for (var action in target.role.actions.night) {
                                    var team = getTeam(target.role, target.role.actions.night[action].common);
                                    for (var x in team) {
                                        if (team[x] != target.name) {
                                            mafia.sendPlayer(team[x], "±Game: Your teammate was too busy with the " + player.role.translation + " during the night, you decided not to " + action + " anyone during the night!");
                                        }
                                    }
                                }
                            }
                        } else if (distractMode.mode == "ChangeTarget") {
                            mafia.sendPlayer(player.name, "±Game: " + distractMode.hookermsg);
                            mafia.sendPlayer(target.name, "±Game: " + distractMode.msg.replace("~Distracter~", player.role.translation));
                            mafia.kill(player);
                            nightkill = true;
                            mafia.removeTargets(target);
                        } else if (distractMode.mode == "ignore") {
                            mafia.sendPlayer(target.name, "±Game: " + distractMode.msg);
                        }
                    }
                    else if (o.action == "protect") {
                        if (targets.length == 0) continue;
                        var target = targets[0];
                        if (!mafia.isInGame(target)) continue;
                        target = mafia.players[target];
                        target.guarded = true;
                    }
                    else if (o.action == "inspect") {
                        if (targets.length == 0) continue;
                        var target = targets[0];
                        if (!mafia.isInGame(target)) continue;
                        target = mafia.players[target];
                        var inspectMode = target.role.actions.inspect;
                        if (inspectMode === undefined) {
                            mafia.sendPlayer(player.name, "±Info: " + target.name + " is the " + target.role.translation + "!!");
                        } else if (inspectMode.revealAs !== undefined) {
                            mafia.sendPlayer(player.name, "±Info: " + target.name + " is the " + mafia.theme.roles[inspectMode.revealAs].translation + "!!");
                        }
                    }
                    else if (o.action == "kill") {
                        for (var t in targets) {
                            var target = targets[t];
                            if (!mafia.isInGame(target)) continue;
                            target = mafia.players[target];
                            if (target.guarded) {
                                mafia.sendPlayer(player.name, "±Game: Your target (" + target.name + ") was protected!");
                            } else {
                                mafia.sendPlayer(target.name, "±Game: You were killed during the night!");
                                mafia.kill(target);
                                nightkill = true;
                            }
                        }
                    }
                }
            }

            if (!nightkill) {
                sys.sendAll("No one died! :", mafiachan);
            }

            if (mafia.testWin()) {
                return;
            }

            mafia.ticks = 30;
            if (mafia.players.length >= 15) {
                mafia.ticks = 40;
            } else if (mafia.players.length <= 4) {
                mafia.ticks = 15;
            }

            sys.sendAll("*** ************************************************************************************", mafiachan);

            sys.sendAll("Current Roles: " + mafia.getCurrentRoles() + ".", mafiachan);
            sys.sendAll("Current Players: " + mafia.getCurrentPlayers() + ".", mafiachan);
            sys.sendAll("Time: Day", mafiachan);
            sys.sendAll("You have " + mafia.ticks + " seconds to debate who are the bad guys! :", mafiachan);
            for (var role in mafia.theme.standbyRoles) {
                var names = mafia.getPlayersForRole(mafia.theme.standbyRoles[role]);
                for (var j = 0; j < names.length; ++j) {
                    for (var k in mafia.players[names[j]].role.actions.standby) {
                        mafia.sendPlayer(names[j], mafia.players[names[j]].role.actions.standby[k].msg);
                    }
                }
            }
            sys.sendAll("*** ************************************************************************************", mafiachan);

            mafia.state = "standby";
        }
    ,
        standby : function() {
            mafia.ticks = 30;

            sys.sendAll("*** ************************************************************************************", mafiachan);

            sys.sendAll("Current Roles: " + mafia.getCurrentRoles() + ".", mafiachan);
            sys.sendAll("Current Players: " + mafia.getCurrentPlayers() + ".", mafiachan);
            sys.sendAll("Time: Day", mafiachan);
            sys.sendAll("It's time to vote someone off, type /Vote [name],  you only have " + mafia.ticks + " seconds! :", mafiachan);
            sys.sendAll("*** ************************************************************************************", mafiachan);

            mafia.state = "day";
            mafia.votes = {};
            mafia.voteCount = 0;
        }
    ,
        day : function() {
            sys.sendAll("*** ************************************************************************************", mafiachan);
            sys.sendAll("Times Up! :", mafiachan);

            var voted = {};
            for (var pname in mafia.votes) {
                var player = mafia.players[pname];
                var target = mafia.votes[pname];
                if (!(target in voted)) {
                    voted[target] = 0;
                }
                if (player.role.actions.vote !== undefined) {
                    voted[target] += player.role.actions.vote;
                } else {
                    voted[target] += 1;
                }
            }
            var tie = true;
            var maxi = 0;
            var downed = noPlayer;
            for (var x in voted) {
                if (voted[x] == maxi) {
                    tie = true;
                } else if (voted[x] > maxi) {
                    tie = false;
                    maxi = voted[x];
                    downed = x;
                }
            }

            if (tie) {
                sys.sendAll("No one was voted off! :", mafiachan);
                sys.sendAll("*** ************************************************************************************", mafiachan);
            } else {
                sys.sendAll("±Game: " + downed + " (" + mafia.players[downed].role.translation + ") was removed from the game!", mafiachan);
                mafia.removePlayer(mafia.players[downed]);

                if (mafia.testWin())
                    return;
            }

            sys.sendAll("Current Roles: " + mafia.getCurrentRoles() + ".", mafiachan);
            sys.sendAll("Current Players: " + mafia.getCurrentPlayers() + ".", mafiachan);
            sys.sendAll("Time: Night", mafiachan);
            sys.sendAll("Make your moves, you only have 30 seconds! :", mafiachan);
            sys.sendAll("*** ************************************************************************************", mafiachan);

            mafia.ticks = 30;
            mafia.state = "night";
            mafia.resetTargets();
        }
    };
    this.callHandler = function(state) {
        if (state in this.handlers)
            this.handlers[state]();
    };
    this.showCommands = function(src) {
        sys.sendMessage(src, "", mafiachan);
        sys.sendMessage(src, "Server Commands:", mafiachan);
        for (x in mafia.commands["user"]) {
            sys.sendMessage(src, "/" + cap(x) + " - " + mafia.commands["user"][x][1], mafiachan);
        }
        if (sys.auth(src) > 0) {
            sys.sendMessage(src, "Authority Commands:", mafiachan);
            for (x in mafia.commands["auth"]) {
                sys.sendMessage(src, "/" + cap(x) + " - " + mafia.commands["auth"][x][1], mafiachan);
            }
        }
        sys.sendMessage(src, "", mafiachan);
    };
    this.showHelp = function(src) {
        var help = [
            "*** *********************************************************************** ***",
            "±Game: The objective in this game on how to win depends on the role you are given.",
            "*** *********************************************************************** ***",
            "±Role: Mafia",
            "±Win: Eliminate the WereWolf and the Good People!",
            "*** *********************************************************************** ***",
            "±Role: WereWolf",
            "±Win: Eliminate everyone else in the game!",
            "*** *********************************************************************** ***",
            "±Role: Good people (Inspector, Bodyguard, Pretty Lady, Villager, Mayor, Spy, Vigilante, Samurai)",
            "±Win: Eliminate the WereWolf, Mafia (French and Italian if exists) and the Godfather!",
            "*** *********************************************************************** ***",
            "±Role: French Canadian Mafia, Don French Canadian Mafia",
            "±Win: Eliminate the Italian Mafia, Godfather and the Good People!",
            "*** *********************************************************************** ***",
            "±Role: Italian Mafia, Don Italian Mafia",
            "±Win: Eliminate the French Canadian Mafia, Godfather and the Good People!",
            "*** *********************************************************************** ***",
            "±More: Type /roles for more info on the characters in the game!",
            "±More: Type /rules to see some rules you should follow during a game!",
            "*** *********************************************************************** ***",
            ""
        ];
        dump(src, help);
    };
    this.showRoles = function(src) {
        var roles = [
            "*** *********************************************************************** ***",
            "±Role: Villager",
            "±Ability: The Villager has no command during night time. They can only vote during the day!",
            "±Game: 6-30 Players",
            "*** *********************************************************************** ***",
            "±Role: Inspector",
            "±Ability: The Inspector can find out the identity of a player during the Night. ",
            "±Game: 5-30 Players",
            "*** *********************************************************************** ***",
            "±Role: Bodyguard",
            "±Ability: The Bodyguard can protect one person during the night from getting killed, but the bodyguard cant protect itself.",
            "±Game: 5-30 Players",
            "*** *********************************************************************** ***",
            "±Role: Pretty Lady",
            "±Ability: The Pretty Lady can distract people during the night thus cancelling their move, unless it's the WereWolf.",
            "±Game: 5-30 Players",
            "*** *********************************************************************** ***",
            "±Role: Samurai",
            "±Ability: The Samurai can kill people during the standby phase, but he will be revealed when doing so.",
            "±Game: 25-30 Players",
            "*** *********************************************************************** ***",
            "±Role: Mafia",
            "±Ability: The Mafia is a group of 2 people. They get one kill each night. They strike after the WereWolf.",
            "±Game: 5-12 Players",
            "*** *********************************************************************** ***",
            "±Role: WereWolf",
            "±Ability: The WereWolf is solo. To win it has to kill everyone else in the game. The Werewolf strikes first.",
            "±Game: 5-12 27-30 Players",
            "*** *********************************************************************** ***",
            "±Role: Italian Mafia",
            "±Ability: The Italian Mafia is a group of 2-3 people. They get one kill each night. They strike before the French Canadian Mafia.",
            "±Game: 12-30 Players",
            "*** *********************************************************************** ***",
            "±Role: Italian Conspirator",
            "±Ability: Italian Conspirator is sided with Italian Mafia, but doesn't have any special commands. Shows up as a Villager to inspector.",
            "±Game: -",
            "*** *********************************************************************** ***",
            "±Role: Don Italian Mafia",
            "±Ability: Don Italian Mafia is sided with Italian Mafia. He kills with Italian mafia each night. He can't be distracted.",
            "±Game: 24-30 Players",
            "*** *********************************************************************** ***",
            "±Role: French Canadian Mafia",
            "±Ability: The French Canadian Mafia is a group of 2-4 people. They get one kill each night. They strike after the Italian Mafia.",
            "±Game: 12-30 Players",
            "*** *********************************************************************** ***",
            "±Role: French Canadian Conspirator",
            "±Ability: French Canadian Conspirator is sided with French Canadian Mafia, but doesn't have any special commands. Shows up as a Villager to inspector.",
            "±Game: -",
            "*** *********************************************************************** ***",
            "±Role: Don French Canadian Mafia",
            "±Ability: Don French Canadian Mafia is sided with French Canadian Mafia. He kills with French Canadian mafia each night. He can't be distracted.",
            "±Game: 18-30 Players",
            "*** *********************************************************************** ***",
            "±Role: Mayor",
            "±Ability: The Mayor has no command during the night but his/her vote counts as 2.",
            "±Game: 10-30 Players",
            "*** *********************************************************************** ***",
            "±Role: Spy",
            "±Ability: The Spy has 33% chance of finding out who is going to get killed by The Italian or French Canadian Mafia during the night. And 10% chance to find out who is the killer!",
            "±Game: 13-30 Players",
            "*** *********************************************************************** ***",
            "±Role: Vigilante",
            "±Ability: The Vigilante can kill a person during the night! He/she strikes after The French Canadian and Italian Mafia.",
            "±Game: 20-30 Players",
            "*** *********************************************************************** ***",
            "±Role: Godfather",
            "±Ability: The Godfather can kill 2 people during the night! He/she strikes Last!",
            "±Game: 22-30 Players",
            "*** *********************************************************************** ***",
            ""
        ];
        dump(src, roles);
    };
    this.showRules = function(src) {
        var rules = [
            "",
            "     Server Rules: ",
            "±Rule: No Spamming / flooding ",
            "±Rule: No insulting- especially not auth. ",
            "±Rule: No asking for auth.",
            "±Rule: No trolling.",
            "",
            "     Game Rules: ",
            "±Rule: Do not quote any of the Bots.",
            "±Rule: Do not quit the game before you are dead.",
            "±Rule: Do not talk once your dead or voted off. ",
            "±Rule: Do not use a hard to type name.",
            "±Rule: Do not group together to ruin the game",
            "±Rule: DO NOT REVEAL YOUR PARTNER IF YOU ARE MAFIA",
            "",
            "±Game: Disobey them and you will be banned/muted/kicked according to the mod/admin's wish!",
            ""
        ];
        dump(src, rules);
    };
    this.showThemes = function(src) {
        var l = [];
        for (var t in mafia.themes) { 
            l.push(mafia.themes[t].name);
        }
        var text = ["+MafiaBot: Installed themes are: " + l.join(", ")];
        dump(src, text);
    };
    this.commands = {
        user: {
            commands : [this.showCommands, "To see the various commands."],
            start: [this.startGame, "Starts a Game of Mafia."],
            help: [this.showHelp, "For info on how to win in a game."],
            roles: [this.showRoles, "For info on all the Roles in the game."],
            rules: [this.showRules, "To see the Rules for the Game/Server."],
            themes: [this.showThemes, "To view installed themes."]
        },
        auth: {
            end: [this.endGame, "To cancel a Mafia game!"],
        }
    };
    this.handleCommand = function(src, message) {
        var command;
        var commandData = '*';
        var pos = message.indexOf(' ');

        if (pos != -1) {
            command = message.substring(0, pos).toLowerCase();
            commandData = message.substr(pos+1);
        } else {
            command = message.substr(0).toLowerCase();
        }
        if (command in this.commands["user"]) {
            this.commands["user"][command][0](src, commandData);
            return;
        }
        if (this.state == "entry") {
            if (command == "join") {
                if (this.isInGame(sys.name(src))) {
                    sys.sendMessage(src, "±Game: You already joined!", mafiachan);
                    return;
                }
                if (this.ips.indexOf(sys.ip(src))!=-1) {
                    sys.sendMessage(src, "±Game: This IP is already in list. You cannot register two times!", mafiachan);
                    return;
                }
                if (this.signups.length >= 30) {
                    sys.sendMessage(src, "±Game: There can't be more than 30 players!", mafiachan);
                    return;
                }
                var name = sys.name(src);
                for (x in name) {
                    var code = name.charCodeAt(x);
                    if (name[x] != ' ' && name[x] != '.' && (code < 'a'.charCodeAt(0) || code > 'z'.charCodeAt(0))
                        && (code < 'A'.charCodeAt(0) || code > 'Z'.charCodeAt(0)) && name[x] != '-' && name[x] != '_' && name[x] !='<' && name[x] != '>' && (code < '0'.charCodeAt(0) || code > '9'.charCodeAt(0)))
                    {
                        sys.sendMessage(src, "±Name: You're not allowed to have the following character in your name: " + name[x] + ".", mafiachan);
                        sys.sendMessage(src, "±Rule: You must change it if you want to join!", mafiachan);
                        return;
                    }
                }
                if (name.length > 12) {
                    sys.sendMessage(src, "±Name: You're not allowed to have more than 12 letters in your name!", mafiachan);
                    sys.sendMessage(src, "±Rule: You must change it if you want to join!", mafiachan);
                    return;
                }
                this.signups.push(name);
                this.ips.push(sys.ip(src));
                sys.sendAll("±Game: " + name + " joined the game!", mafiachan);

                if (this.signups.length == 30) {
                    this.ticks = 1;
                }
                return;
            }
            if (command == "unjoin") {
                if (this.isInGame(sys.name(src))) {
                    var name = sys.name(src);
                    delete this.ips[this.ips.indexOf(sys.ip(src))];
                    this.signups.splice(this.signups.indexOf(name), 1);
                    sys.sendAll("±Game: " + name + " unjoined the game!", mafiachan);
                    return;
                } else {
                    sys.sendMessage(src, "±Game: You haven't even joined!", mafiachan);
                    return;
                }
            }
        } else if (this.state == "night") {
            var name = sys.name(src);
            //sys.sendAll(name + " used /" + command + " on " + commandData, mafiachan);
            if (this.isInGame(name) && this.hasCommand(name, command, "night")) {
                commandData = this.correctCase(commandData);
                if (!this.isInGame(commandData)) {
                    sys.sendMessage(src, "±Hint: That person is not playing!", mafiachan);
                    return;
                }
                var player = mafia.players[name];
                var target = mafia.players[commandData];

                if (player.role.actions.night[command].target != "Self" && commandData == name) {
                    sys.sendMessage(src, "±Hint: Nope, this wont work... You can't target yourself!", mafiachan);
                    return;
                }
                else if (player.role.actions.night[command].target == 'AnyButTeam' && player.role.side == target.role.side
                 || player.role.actions.night[command].target == 'AnyButRole' && player.role.role == target.role.role) {
                    sys.sendMessage(src, "±Hint: Nope, this wont work... You can't target your partners!", mafiachan);
                    return;
                }

                sys.sendMessage(src, "±Game: You have chosen to " + command + " " + commandData + "!", mafiachan);
                this.setTarget(player, target, command);

                var broadcast = player.role.actions.night[command].broadcast;
                if (broadcast !== undefined) {
                    var team = [];
                    if (broadcast == "team") {
                        team = this.getPlayersForTeam(player.role.side);
                    } else if (broadcast == "role") {
                        team = this.getPlayersForRole(player.role.role);
                    }
                    for (x in team) {
                        if (team[x] != name) {
                            this.sendPlayer(team[x], "±Game: Your partner(s) have decided to " + command + " '" + commandData + "'!");
                        }
                    }
                }

                /* Hax-related to command */
                // some roles can get "hax" from other people using some commands...
                // however, roles can have avoidHax: ["kill", "distract"] in actions..
                if ("avoidHax" in player.role.actions && player.role.actions.avoidHax.indexOf(command) != -1) {
                    return
                }
                var haxRoles = mafia.theme.getHaxRolesFor(command);
                for (var i in haxRoles) {
                    var role = haxRoles[i];
                    var haxPlayers = this.getPlayersForRole(role);
                    for (j in haxPlayers) {
                        var haxPlayer = haxPlayers[j];
                        var r = Math.random();
                        var roleName = this.theme.side(player.role.side);
                        if (r < mafia.theme.roles[role].actions.hax[command].revealTeam) {
                            this.sendPlayer(haxPlayer, "±Game: The " + roleName + " are going to kill " + commandData + "!");
                        }
                        if (r < mafia.theme.roles[role].actions.hax[command].revealPlayer) {
                            this.sendPlayer(haxPlayer, "±Game: " + name + " is one of The " + roleName + "!");
                        }
                    }
                }

                return;
            }
        } else if (this.state == "day") {
            if (this.isInGame(sys.name(src)) && command == "vote") {
                commandData = this.correctCase(commandData);
                if (!this.isInGame(commandData)) {
                    sys.sendMessage(src, "±Game: That person is not playing!", mafiachan);
                    return;
                }
                if (sys.name(src) in this.votes) {
                    sys.sendMessage(src, "±Rule: You already voted!", mafiachan);
                    return;
                }
                sys.sendAll("±Game:" + sys.name(src) + " voted for " + commandData + "!", mafiachan);
                this.votes[sys.name(src)] = commandData;
                this.voteCount+=1;

                if (this.voteCount == mafia.players.length) {
                    mafia.ticks = 1; 
                } else if (mafia.ticks < 8) {
                    mafia.ticks = 8;
                }
                return;
            }
        } else if (mafia.state == "standby") {
            var name = sys.name(src);
            if (this.isInGame(name) && this.hasCommand(name, command, "standby")) {
                if (command == "kill") {
                    if (mafia.players[name].dayKill) {
                        sys.sendMessage(src, "±Game: You already killed!", mafiachan);
                        return;
                    }
                    commandData = this.correctCase(commandData);
                    if (!this.isInGame(commandData)) {
                        sys.sendMessage(src, "±Game: That person is not playing!", mafiachan);
                        return;
                    }
                    sys.sendAll("*** ************************************************************************************", mafiachan);
                    sys.sendAll("±Game: " + this.players[name].role.actions.standby[command].killmsg.replace("~Self~", name).replace("~Target~", commandData), mafiachan);
                    this.kill(mafia.players[commandData]);
                    this.players[name].dayKill = true;

                    if (this.testWin()) {
                        return;
                    }
                    sys.sendAll("*** ************************************************************************************", mafiachan);
                }
                return;
            }
        }
        if (command == "join") {
            sys.sendMessage(src, "±Game: You can't join now!", mafiachan);
            return;
        }

        if (sys.auth(src) == 0)
            throw ("no valid command");

        if (command in this.commands["auth"]) {
            this.commands["auth"][command][0](src);
            return;
        }

        throw ("no valid command");
    }
}();


/* stolen from here: http://snippets.dzone.com/posts/show/849 */
function shuffle(o) {
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

/* stolen from here: http://stackoverflow.com/questions/1026069/capitalize-first-letter-of-string-in-javascript */
function cap(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function dump(src, mess) {
    for (x in mess) {
        sys.sendMessage(src, mess[x], mafiachan);
    }
}

var suspectVoting = new function() {
    var canVote = function(src) {
        if (!sys.dbRegistered(sys.name(src))) {
            return false;
        }
        if (sys.ratedBattles(sys.name(src), poll.tier) < 30) {
            return false;
        }
        if (sys.ladderRating(src, poll.tier) <= 1000) {
            return false;
        }
        return true;
    }
    var getVote = function(src) {
         var name = sys.name(src).toLowerCase();
         for (var i in poll.voters) {
             if (name == poll.voters[i].name) {
                 return poll.voters[i];
             }
         }
    }
    poll = {
        'running': false,
        'subject': 'Chandelure',
        'answers': ['ban', 'no ban'],
        'tier': 'Dream World',
        'voters': [],
    };
    poll.canVote = canVote;
    poll.getVote = getVote;
    var savePoll = function() {
        delete poll.canVote;
        delete poll.getVote;
        var s = JSON.stringify(poll);
        sys.writeToFile('suspectvoting.json',s);
        poll.canVote = canVote;
        poll.getVote = getVote;
    }
    var loadPoll = function() {
        try {
            poll = JSON.parse(sys.getFileContent('suspectvoting.json'));
            poll.canVote = canVote;
            poll.getVote = getVote;
        } catch (err) {}
    }
    loadPoll();

    var userCommands = {
        'votinghelp': function(src, commandData) {
            sendChanMessage(src, "*** Suspect Voting commands ***");
            sendChanMessage(src, "/vote [subject] [answer]: to vote in a suspect voting");
            sendChanMessage(src, "/removeVote [subject]: to remove your vote in a suspect voting");
            if (sys.auth(src) < 3) return;
            sendChanMessage(src, "*** Owner commands ***");
            sendChanMessage(src, "/whiteList [person]: to approve one's vote in suspect voting");
            sendChanMessage(src, "/startVoting: to start a suspect voting");
            sendChanMessage(src, "/stopVoting: to stop running suspect voting");
            sendChanMessage(src, "/getResults [subject]: to get results of a suspect voting");
            sendChanMessage(src, "/newPoll [subject:tier:answer1:answer2:...]: to make a new voting");
        },
        'vote': function(src, commandData) {
             if (!poll.running) {
                 sendChanMessage(src, "+Bot: There's no poll running.");
                 return;
             }
             if (commandData.substr(0, poll.subject.length).toLowerCase() != poll.subject.toLowerCase()) {
                 sendChanMessage(src, "+Bot: The subject of this poll is: " + poll.subject + ". Please do /vote " + poll.subject + " [your answer]");
                 return;
             }
             var answer = commandData.substr(poll.subject.length+1);
             if (poll.canVote(src)) {
                 if (answer == '') {
                     var vote = poll.getVote(src);
                     if (vote !== undefined) {
                         var d = new Date();
                         d.setTime(vote.time*1000);
                         sendChanMessage(src, "+Bot: You have previously voted '" + vote.answer + "' from IP " + vote.ip + " with rating " + vote.rating + " on " + d.toUTCString());
                         return;
                     }
                     sendChanMessage(src, "+Bot: You haven't voted yet. Valid votes in this poll are: " + poll.answers.join(", "));
                     return;
                 }
                 if (poll.answers.indexOf(answer) == -1) {
                     sendChanMessage(src, "+Bot: Only valid votes in this poll are: " + poll.answers.join(", "));
                     return;
                 }
                 var ip = sys.ip(src);
                 var name = sys.name(src).toLowerCase();
                 for (var i in poll.voters) {
                     if (ip == poll.voters[i].ip) {
                         if (name != poll.voters[i].name) {
                             sendChanMessage(src, "+Bot: Sorry, your IP address has already voted as " + poll.voters[i].name+". The vote will not change.");
                             return;
                         }
                         poll.voters[i].rating = sys.ladderRating(src, poll.tier);
                         poll.voters[i].answer = answer;
                         poll.voters[i].time = parseInt(sys.time());
                         savePoll();
                         sendChanMessage(src, "+Bot: Your vote has been updated.");
                         return;
                     } else if (name == poll.voters[i].name) {
                         poll.voters[i].ip = sys.ip(src);
                         poll.voters[i].rating = sys.ladderRating(src, poll.tier);
                         poll.voters[i].answer = answer;
                         poll.voters[i].time = parseInt(sys.time());
                         savePoll();
                         sendChanMessage(src, "+Bot: Your vote has been updated.");
                         return;
                     }
                 }
                 var o = {
                     'ip': ip,
                     'name': name,
                     'rating': sys.ladderRating(src, poll.tier),
                     'answer': answer,
                     'time': parseInt(sys.time()),
                     'whitelisted': false
                 };
                 poll.voters.push(o);
                 savePoll();
                 sendChanMessage(src, "+Bot: Your vote has been registered. Don't forget to post on the associated topic on the forum saying you voted.");
                 return;
             } else {
                 sendChanMessage(src, "+Bot: Sorry, you can't take part in this poll. Your name needs to be registered, you must have over 1000 points and enough battles (you have " + sys.ratedBattles(sys.name(src), poll.tier) + "/30 battles.");
             } 
        } ,
        'removevote': function(src, commandData) {
            if (commandData.substr(0, poll.subject.length).toLowerCase() != poll.subject.toLowerCase()) {
                sendChanMessage(src, "+Bot: The subject of this poll is: " + poll.subject + ". Do /removeVote " + poll.subject + " to remove your vote.");
                return;
            }
            var name = sys.name(src).toLowerCase();
            for (var i in poll.voters) {
                    if (name == poll.voters[i].name) {
                        poll.voters.splice(i,1); 
                        savePoll();
                        sendChanMessage(src, "+Bot: Your vote has been removed.");
                        return;
                    } 
            }
            sendChanMessage(src, "+Bot: You haven't voted with that name.");
        }
    };

    var ownerCommands = {
        'whitelist': function(src, commandData) {
        var target = commandData.toLowerCase();
            for (var i = 0; i < poll.voters.length; ++i) {
                var voter = poll.voters[i];
                if (voter.name == target) {
                    voter.whitelisted = true;
                    sendChanMessage(src, '+Bot: ' + voter.name + "'s vote was approved.");
                    return;
                }
            }
            sendChanMessage(src, '+Bot: ' + voter.name + ' has not voted.');
            savePoll();
        },
        'startvoting': function(src, commandData) {
            sendChanMessage(src, '+Bot: The Poll is running again.');
            sys.sendAll('');
            sys.sendAll('+Bot: The Suspect Voting of ' + cap(poll.subject) +' is now running!');
            sys.sendAll('');
            poll.running = true;
            savePoll();
        },
        'stopvoting': function(src, commandData) {
            sendChanMessage(src, '+Bot: The Votes are frozen now.');
            sys.sendAll('');
            sys.sendAll('+Bot: The Suspect Voting of ' + cap(poll.subject) +' has ended!');
            sys.sendAll('');
            poll.running = false;
            savePoll();
        },
        'getresults': function(src, commandData) {
            var results = {};
            var unscaled = {};
            for (var i = 0; i < poll.answers.length; ++i) {
                results[poll.answers[i]] = 0;
                unscaled[poll.answers[i]] = 0;
            }
            var total_users = poll.voters.length;
            var vote_count = 0;
            var p = sys.totalPlayersByTier(poll.tier);
            var divider1 = Math.log(p/2);
            var divider2 = Math.exp(1/divider1);
            sendChanMessage(src, "+Bot: Following people voted:") 
            for (var i = 0; i < total_users; ++i) {
                var voter = poll.voters[i];
                sendChanMessage(src, "+Bot: " + voter.name+" voted for "+voter.answer+" with rating " + voter.rating + ". Approved: " + voter.whitelisted);
                if (voter.whitelisted === false) continue;
                var x = voter.rating;
//                if (x>1700) x = 1700;
                var votes = (Math.exp( Math.pow(x/1000,4) / divider1 ) / divider2 - 1) * 10;
                results[voter.answer] += votes;
                unscaled[voter.answer] += 1;
                ++vote_count;
            }
            var sum = 0;
            for (var i = 0; i < poll.answers.length; ++i) {
                sum += results[poll.answers[i]];
            }
            if (sum > 0) {
                sendChanMessage(src, '+Bot: The Results of Suspect Voting of ' + cap(poll.subject) + ' is:');
                for (var i = 0; i < poll.answers.length; ++i) {
                    var v = results[poll.answers[i]];
                    var u = unscaled[poll.answers[i]];
                    sendChanMessage(src, 'Option "' + poll.answers[i] + '" had ' + v + ' votes. (' + 100*v/sum + '%, '+u+' persons)');
                }
                sendChanMessage(src, 'Total of ' + total_users + ' took part and ' + vote_count + ' were approved. Total sum of the votes is ' + sum + '.');
            } else {
                if (total_users == 0) {
                    sendChanMessage(src, '+Bot: No one has voted yet.');
                } else {
                    sendChanMessage(src, '+Bot: No one has been approved. Use /whitelist [username] to approve votes.');
                }
            }
        },
        'clearpoll': function(src, commandData) {
            sendChanMessage(src, '+Bot: Sorry, not implemented! Just use /eval poll.voters=[]')
        },
        'newpoll': function(src, commandData) {
            var params = commandData.split(":");
            if (params.length < 4) {
                sendChanMessage(src, '+Bot: Usage: /newPoll subject:tier:answer1:answer2:...');
                return;
            }
            var s = JSON.stringify(poll);
            var fn = 'oldSuspectVoting'+sys.time()+'.json';
            sys.writeToFile(fn,s);
            sendChanMessage(src, '+Bot: Old poll saved to '+fn);

            var newSubject = params[0];
            var newTier = params[1];
            var newAnswers = params.splice(2);
            poll.subject = newSubject;
            poll.tier = newTier;
            poll.answers = newAnswers;
            poll.voters = [];
            poll.running = false;
            savePoll();
            sendChanMessage(src, '+Bot: The poll successfully updated!');
        }
    };

    this.afterLogIn = function(src) {
        if (poll.running) {
            if (poll.canVote(src) && poll.getVote(src) === undefined) {
                sendChanMessage(src, '+Bot: A Suspect Voting is going on! Use /vote ' + poll.subject + ' [answer] to vote!');
            }
        }
    }

    this.handleCommand = function(src, message) {
        var command;
        var commandData = '';
        var pos = message.indexOf(' ');

        if (pos != -1) {
            command = message.substring(0, pos).toLowerCase();
            commandData = message.substr(pos+1);
        } else {
            command = message.substr(0).toLowerCase();
        }
        if (command in userCommands) {
            userCommands[command](src, commandData);
            return;
        }
        if (command in ownerCommands && sys.auth(src) >= 3) {
            ownerCommands[command](src, commandData);
            return;
        }
        throw "no valid command";
    };

}();


/*
 * Prototype: MemoryHash
 * Functions:
 *  - add(key,value)
 *  - get(key)
 *  - remove(key)
 *  - removeIf(callBack)
 *  - clear()
 *  - save()
 *  - escapeValue(val)
 *
 *  All keys and values must be strings.
 */
function MemoryHash(filename)
{
    this.hash = {};
    this.fname = filename;

    var contents = sys.getFileContent(this.fname);
    if (contents !== undefined) {
        var lines = contents.split("\n");
        for(var i = 0; i < lines.length; ++i) {
            var line = lines[i];
            var key_value = line.split("*");
            var key = key_value[0];
            var value = key_value[1];
            if (key.length > 0) {
                if (value === undefined)
                    value = '';
                this.hash[key] = value;
            }
        }
    }
}

MemoryHash.prototype.add = function(key, value)
{
    this.hash[key] = value;
    // it doesn't matter if we add a duplicate, 
    // when we remove something eventually,
    // duplicates will be deleted
    sys.appendToFile(this.fname, key +'*' + value + '\n');
}

MemoryHash.prototype.get = function(key)
{
    return this.hash[key];
}

MemoryHash.prototype.remove = function(key)
{
    delete this.hash[key];
    this.save();
}

MemoryHash.prototype.removeIf = function(test)
{
    var i;
    var toDelete = []
    for (i in this.hash) {
        if (test(this, i)) {
            toDelete.push(i);
        }
    }
    for (i in toDelete) {
        delete this.hash[toDelete[i]];
    }
}

MemoryHash.prototype.clear = function()
{
    this.hash = {};
    this.save();
}

MemoryHash.prototype.save = function()
{
    var lines = [];
    for (var i in this.hash) {
        lines.push(i +'*' + this.hash[i] + '\n');
    }
    sys.writeToFile(this.fname, lines.join("")) 
}

MemoryHash.prototype.escapeValue = function(value)
{
    return value.replace(/\*\n/g,'');
}

/* End of prototype MemoryHash */

function POUser(id)
{
    /* user's id */
    this.id = id;
    /* whether user is muted or not */
    this.muted = false;
    /* whether user is megauser or not */
    this.megauser = false;
    /* whether user is mafiabanned or not */
    this.mban = false;
    /* whether user is secrectly muted */
    this.smuted = false;
    /* caps counter for user */
    this.caps = 0;
    /* whether user is impersonating someone */
    this.impersonation = undefined;
    /* last time user said something */
    this.timecount = parseInt(sys.time());
    /* counter on how many lines user has said recently */
    this.floodcount = 4;
    /* whether user has enabled battling only in same tier */
    this.sametier = undefined;

    /* check if user is banned or mafiabanned */
    if (mutes.get(sys.ip(id)))
        this.muted=true;
    if (mbans.get(sys.ip(id)))
        this.mban = true;
    if (smutes.get(sys.ip(id)))
        this.smuted = true;
    /* check if user is megauser */
    if (megausers.indexOf("*" + sys.name(id) + "*") != -1)
        this.megauser = true;

}

function POChannel(id)
{
    this.id = id;
    this.master = undefined;
    this.perm = false;
    this.inviteonly = 0;
    this.invitelist = [];
    this.topic = "";
    this.muteall = undefined;
    this.meoff = undefined;
}

function POGlobal(id)
{
    this.mafia = undefined;
}

SESSION.identifyScriptAs("PO Scripts v0.001");
SESSION.registerUserFactory(POUser);
SESSION.registerChannelFactory(POChannel);
SESSION.registerGlobalFactory(POGlobal);


if (SESSION.global() !== undefined) { /*
    // keep the state of mafia if it hasn't been updated
    if (SESSION.global().mafia === undefined || SESSION.global().mafia.version !== undefined && SESSION.global().mafia.version < mafia.version) {
        SESSION.global().mafia = mafia;
        if (mafiachan !== undefined) {
            sys.sendAll("+MafiaBot: Mafia game was updated!", mafiachan);
        }
    } else {
        mafia = SESSION.global().mafia;
    }*/
}
// load mafia web themes
mafia.loadWebTheme("http://lamperi.name/lamperitheme.json");
mafia.loadWebTheme("http://pastebin.com/raw.php?i=KK4H6n4Z");
mafia.loadWebTheme("http://pastebin.com/raw.php?i=QbB6bixh");
mafia.loadWebTheme("http://pastebin.com/raw.php?i=CCcnt5UA");

var commands = {
    user: 
    [
        "/rules: To see the rules",
        "/me [message]: to speak with *** before its name",
        "/players: to get the number of players online",
        "/ranking: to get your ranking in your tier",
        "/selfkick: to kick any ghosts left behind...",
        "/join: allows you to join a tournament.",
        "/auth [owners/admins/mods]: allows you to view the auth of that class, will show all auth if left blank",
        "/megausers: to see the list of people who have power over tournaments.",
        "/unjoin: allows you to leave a tournament.",
        "/viewround: allows you to view the pairings for the round.",
        "/viewtiers: shows the last tourneys, which can't be started yet",
        "/sameTier [on/off]: to force or not the same tier when people challenge you",
        "/tourrankings: view recent tourney winners",
        "/tourranking [tier]: view recent tourney winners of specific tier",
        "/tourdetails [user]: view tourney winning stats of specific user",
        "/lastwinners: view details about last tournaments",
        "/uptime: view server uptime"
    ],
    megauser:
    [
        "/tour tier:number: starts a tier tournament consisting of number of players.",
        "/endtour: ends the current tournament.",
        "/dq name: DQs someone in the tournament.",
        "/changecount [entrants]: Change the number of entrants during the signup phase.",
        "/push name: Adds someone in the tournament.",
        "/sub name1:name2: Replaces someone with someone else.",
        "/cancelBattle name1: Allows the user or his/her opponent to forfeit his/her current battle so he/she can battle again his/her opponent."
    ], 
    channel:
    [
        "/topic [topic]: to read or change the topic of a channel. Only works if you're the first to log on a channel.",
        "/ck [person]: to kick someone from your channel",
        "/inviteonly [on|off]: to change channel to inviteonly",
        "/invite [person]: to send a person an invite"
    ],
    mod:
    [
        "/k [person] : to kick someone",
        "/banlist [search term]: to search the banlist, shows full list if no search term is entered.",
        "/mutelist [search term]: to search the mutelist, shows full list if no search term is entered.",
        "/smutelist [search term]: to search the smutelist, shows full list if no search term is entered.",
        "/mafiabans [search term]: to search the mafiabanlist, shows full list if no search team is entered.",
        "/rangebans: list range bans",
        "/[mute/unmute] [person] : You know what i mean :p.",
        "/silence [x]: To call forth x minute of silence in the main chat (except for auth)",
        "/silenceoff: To undo that",
        "/mafiaban [person]: To ban a player from Mafia",
        "/mafiaunban [person]: To unban a player from Mafia",
        "/meon, /meoff: to deal with /me happy people",
        "/perm [on/off]: To make the current channel a permanent channel or not -- i.e. the channel wouldn't be destroyed on log off",
        "/userinfo [person]: to display various info about the person",
        "/tempban [user]:[minutes]: To temporary ban someone (0 < minute <= 60)",
        "/tempunban [user]: To unban temporary banned user (standard unban doens't work)",
    ],
    admin:
    [
        "/memorydump: To see the state of the memory.",
        "/megauser[off] xxx: Tourney powers.",
        "/aliases xxx: See the aliases of an IP.",
        "/ban [name]: To ban a user.",
        "/unban [name]: To unban a user.",
        "/destroychan [channel]: Will destroy a channel (Certain channels are immune obviously...)",
        "/smute xxx: To secretly mute a user. Can't smute auth.",
        "/sunmute xxx: To secretly unmute a user.",
        "/channelusers [channel]: to display people on a channel"
    ],
    owner:
    [
        "/changeRating [player] -- [tier] -- [rating]: to change the rating of a rating abuser",
        "/stopBattles: to stop all new battles. When you want to close the server, do that",
        "/imp [person] : to impersonate someone",
        "/impOff : to stop impersonating.",
        "/clearpass [name]: to clear a password",
        "/sendAll [message] : to send a message to everyone.",
        "/changeAuth [auth] [person]: to play the mega admin",
        "/showteam xxx: To help people who have problems with event moves or invalid teams.",
        "/rangeban [ip] [comment]: to make a range ban",
        "/rangeunban: [ip] to unban a range",
        "/purgemutes [time]: to purge old mutes. Time is given in seconds. Defaults is 4 weeks.",
        "/purgembans [time]: to purge old mafiabans. Time is given in seconds. Defaults is 1 week.",
        "/writetourstats: to force a writing of tour stats to tourstats.json",
        "/reloadtourstats : to force a reload of tour stats from tourstats.json",
        "/resettourstats: to reset tournament winners",
        "/writebattlestats : to force a writing of battle stats to battlestats.json",
        "/reloadbattlestats : to force a reload of battle stats from battlestats.json",
        "/updateScripts: updates scripts from the web"
    ]
};

({
/* Executed every second */
stepEvent: function() {
    mafia.tickDown();
}
,

repeatStepEvent: function(globalCounter) {
    if (stepCounter != globalCounter) {
        return;
    }

    stepCounter = stepCounter+1;
    sys.callLater("script.repeatStepEvent(" + stepCounter + ")", 1);

    /* Using script. instead of this. so as to stop it when this function is removed */
    script.stepEvent();
}

,
startStepEvent: function() {
    stepCounter = 0;

    this.repeatStepEvent(0);
}
,
serverStartUp : function() {
    startUpTime = parseInt(sys.time());
    scriptChecks = 0;
    this.init();
}
        
,
init : function() {
    lastMemUpdate = 0;
    this.startStepEvent();

    var dwlist = ["Rattata", "Raticate", "Nidoran-F", "Nidorina", "Nidoqueen", "Nidoran-M", "Nidorino", "Nidoking", "Oddish", "Gloom", "Vileplume", "Bellossom", "Bellsprout", "Weepinbell", "Victreebel", "Ponyta", "Rapidash", "Farfetch'd", "Doduo", "Dodrio", "Exeggcute", "Exeggutor", "Lickitung", "Lickilicky", "Tangela", "Tangrowth", "Kangaskhan", "Sentret", "Furret", "Cleffa", "Clefairy", "Clefable", "Igglybuff", "Jigglypuff", "Wigglytuff", "Mareep", "Flaaffy", "Ampharos", "Hoppip", "Skiploom", "Jumpluff", "Sunkern", "Sunflora", "Stantler", "Poochyena", "Mightyena", "Lotad", "Ludicolo", "Lombre", "Taillow", "Swellow", "Surskit", "Masquerain", "Bidoof", "Bibarel", "Shinx", "Luxio", "Luxray", "Psyduck", "Golduck", "Growlithe", "Arcanine", "Scyther", "Scizor", "Tauros", "Azurill", "Marill", "Azumarill", "Bonsly", "Sudowoodo", "Girafarig", "Miltank", "Zigzagoon", "Linoone", "Electrike", "Manectric", "Castform", "Pachirisu", "Zapdos", "Buneary", "Lopunny", "Glameow", "Purugly", "Natu", "Xatu", "Chandelure", "Skitty", "Delcatty", "Eevee", "Vaporeon", "Jolteon", "Flareon", "Espeon", "Umbreon", "Leafeon", "Glaceon", "Eevee", "Bulbasaur", "Charmander", "Squirtle", "Ivysaur", "Venusaur", "Charmeleon", "Charizard", "Wartortle", "Blastoise", "Croagunk", "Toxicroak", "Turtwig", "Grotle", "Torterra", "Chimchar", "Infernape", "Monferno", "Piplup", "Prinplup", "Empoleon", "Treecko", "Sceptile", "Grovyle", "Torchic", "Combusken", "Blaziken", "Mudkip", "Marshtomp", "Swampert", "Caterpie", "Metapod", "Butterfree", "Pidgey", "Pidgeotto", "Pidgeot", "Spearow", "Fearow", "Zubat", "Golbat", "Crobat", "Aerodactyl", "Hoothoot", "Noctowl", "Ledyba", "Ledian", "Yanma", "Yanmega", "Murkrow", "Honchkrow", "Delibird"];
    /* use hash for faster lookup */
    dwpokemons = {};
    for(var dwpok in dwlist) {
        dwpokemons[sys.pokeNum(dwlist[dwpok])] = true;
    }

    var lclist = ["Bulbasaur", "Charmander", "Squirtle", "Croagunk", "Turtwig", "Chimchar", "Piplup", "Treecko","Torchic","Mudkip"]
    lcpokemons = [];
    for(var dwpok in lclist) {
        lcpokemons.push(sys.pokeNum(lclist[dwpok]));
    }
    bannedGSC = [sys.moveNum("Perish Song"), sys.moveNum("Hypnosis"), sys.moveNum("Mean Look")];

    var inconsistentList = ["Remoraid", "Bidoof", "Snorunt", "Smeargle", "Bibarel", "Octillery", "Glalie"];
    inpokemons = [];
    for(var inpok in inconsistentList) {
        inpokemons.push(sys.pokeNum(inconsistentList[inpok]));
    }

    var breedingList = ["Bulbasaur", "Ivysaur", "Venusaur", "Charmander", "Charmeleon", "Charizard", "Squirtle", "Wartortle", "Blastoise", "Croagunk", "Toxicroak", "Turtwig", "Grotle", "Torterra", "Chimchar", "Monferno", "Infernape", "Piplup", "Prinplup", "Empoleon", "Treecko", "Grovyle", "Sceptile", "Mudkip", "Marshtomp", "Swampert", "Mamoswine", "Togekiss"];
    breedingpokemons = [];
    for(var inpok in breedingList) {
        breedingpokemons.push(sys.pokeNum(breedingList[inpok]));
    }

    /* restore mutes, smutes, mafiabans, rangebans, megausers */
    mutes = new MemoryHash("mutes.txt");
    mbans = new MemoryHash("mbans.txt");
    smutes = new MemoryHash("smutes.txt");
    rangebans = new MemoryHash("rangebans.txt");
	
	    rules = [ "",
    "*** Rules ***",
    "",
    "Rule #1 - Do Not Abuse CAPS:",
    "- The occasional word in CAPS is acceptable, however repeated use is not.",
    "Rule #2 - No Flooding the Chat:",
    "- Please do not post a large amount of short messages when you can easily post one or two long messages.",
    "Rule #3 - Do not Challenge Spam:",
    "- If a person refuses your challenge, this means they do not want to battle you. Find someone else to battle with.",
    "Rule #4 - Don't ask for battles in the main chat:",
    "- There is a 'Find Battle' tab that you can use to find a battle immediately. If after a while you cannot find a match, then you can ask for one in the chat.",
    "Rule #5 - No Trolling/Flaming/Insulting of Any kind:",
    "- Behaving stupidly and excessive vulgarity will not be tolerated, using words including 'fuck' is a bad starting point.",
    "Rule #6 - Be Respectable of Each Others Cultures:",
    "- Not everyone speaks the same language. This server is not an English-Only Server. Do not tell someone to only speak a certain language.",
    "Rule #7 - No Advertising:",
    "- There will be absolutely no advertising on the server.",
    "Rule #8 - No Obscene or Pornographic Content Allowed:",
    "- This includes links, texts, images, and any other kind of media. This will result in a instant ban.",
    "Rule #9 - Do not ask for Auth:",
    "- Authority is given upon merit. By asking you have pretty much eliminated your chances at becoming an Auth in the future.",
    "Rule #10 - Do not Insult Auth:",
    "- Insulting Auth will result in immediate punishment. "   ];

    if (typeof(tempBans) == 'undefined') {
        tempBans = {};
    }
    if (typeof(VarsCreated) != 'undefined')
        return;

    key = function(a,b) {
        return a + "*" + sys.name(b);
    }

    saveKey = function(thing, id, val) {
        sys.saveVal(key(thing,id), val);
    }

    getKey = function(thing, id) {
        return sys.getVal(key(thing,id));
    }

    cmp = function(a, b) {
        return a.toLowerCase() == b.toLowerCase();
    }

    battlesStopped = false;

    megausers = sys.getVal("megausers");

    muteall = false;

    maxPlayersOnline = 0;

    lineCount = 0;
    tourmode = 0;

    tourwinners = [];
    tourstats = {};
    tourrankingsbytier = {};
    try {
        var jsonObject = JSON.parse(sys.getFileContent('tourstats.json'));
        tourwinners = jsonObject.tourwinners;
        tourstats = jsonObject.tourstats;
        tourrankingsbytier = jsonObject.tourrankingsbytier;
    } catch (err) {
        print('Could not read tourstats, initing to null stats.');
        print('Error: ' + err);
    }

    border = "»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»:";

    // stats are going to hold an array of arrays {winnerRating, loserRating, tier}
    battlestats = {'stats': [], 'battles': {}, 'count': 0};
    try {
        battlestats.stats = JSON.parse(sys.getFileContent('battlestats.json'));
    } catch (err) {
        print('Could not read battlestats, initing to null stats.');
        print('Error: ' + err);
    }
    pokeNatures = [];

    var list = "Heatran-Eruption/Quiet=Suicune-ExtremeSpeed/Relaxed|Sheer Cold/Relaxed|Aqua Ring/Relaxed|Air Slash/Relaxed=Raikou-ExtremeSpeed/Rash|Weather Ball/Rash|Zap Cannon/Rash|Aura Sphere/Rash=Entei-ExtremeSpeed/Adamant|Flare Blitz/Adamant|Howl/Adamant|Crush Claw/Adamant";

    var sepPokes = list.split('=');
    for (var x in sepPokes) {
        sepMovesPoke = sepPokes[x].split('-');
        sepMoves = sepMovesPoke[1].split('|');

        var poke = sys.pokeNum(sepMovesPoke[0]);
        pokeNatures[poke] = [];

        for (var y = 0; y < sepMoves.length; ++y) {
            movenat = sepMoves[y].split('/');
            pokeNatures[poke][sys.moveNum(movenat[0])] = sys.natureNum(movenat[1]);
        }
    }

    /* Permanent channels */
    var channelDataFile = 'channels.json';
    try {
        channelData = JSON.parse(sys.getFileContent(channelDataFile));
    } catch (err) {
        print('Could not read channelData.');
        print('Error: ' + err);
        channelData = {};
    }
    /* global updater */
    updateChannelTopic = function(channelName, topic) {
        if (typeof(channelData) == "undefined") {
            channelData = {};
        }
        if (!(channelName in channelData)) {
            channelData[channelName] = {};
            channelData.perm = false;
        }
        channelData[channelName].topic = topic;
        sys.writeToFile(channelDataFile, JSON.stringify(channelData));
    }
    updateChannelPerm = function(channelName, perm) {
        if (!(channelName in channelData)) {
            channelData[channelName] = {};
            channelData[channelName].topic = '';
        }
        channelData[channelName].perm = perm;
        sys.writeToFile(channelDataFile, JSON.stringify(channelData));
    }

    var createPermChannel = function(name, defaultTopic) {
        var cid;
        if (sys.existChannel(name)) {
            cid = sys.channelId(name);
        } else {
            cid = sys.createChannel(name);
        }
        SESSION.channels(cid).topic = defaultTopic;
        SESSION.channels(cid).perm = true;
        if (name in channelData) {
            SESSION.channels(cid).topic = channelData[name].topic;
        }
        return cid;
    }

    // mafiachan = createPermChannel("Mafia Channel", "Use /help to get started!");

    staffchannel = createPermChannel("Indigo Plateau", "Welcome to the Staff Channel! Discuss of all what users shouldn't hear here! Or more serious stuff...");

    tourchannel = createPermChannel("Tournaments", 'Useful commands are "/join" (to join a tournament), "/unjoin" (to leave a tournament), "/viewround" (to view the status of matches) and "/megausers" (for a list of users who manage tournaments). Current tournaments: http://www.pokemonbattle.it/doku.php?id=tornei');

    // createPermChannel("League", "Challenge the PO League here! For more information, please visit this link: http://pokemon-online.eu/forums/forumdisplay.php?36-PO-League");

    trollchannel = createPermChannel("Mute City", 'This is a place to talk if you have been muted! Please behave, next stop will be bans.');
    /* restore topic for main */
    var mainName = sys.channel(0);
    if (mainName in channelData) {
        SESSION.channels(0).topic = channelData[mainName].topic;
    }

    /* global utility helpers */

    sendChanMessage = function(id, message) {
        sys.sendMessage(id, message, channel);
    }
    
    isChannelMaster = function(id) {
        return SESSION.channels(channel).master == sys.name(id).toLowerCase();
    }

    sendChanAll = function(message) {
        sys.sendAll(message, channel);
    }
    
    sendMainTour = function(message) {
        sys.sendAll(message, 0);
        sys.sendAll(message, tourchannel);
    }

    VarsCreated = true;
} /* end of init */

,

beforeChannelJoin : function(src, channel) {
    var index = SESSION.channels(channel).invitelist.indexOf(src);
    if (index != -1) {
        // allow to bypass all limits if invited
        SESSION.channels(channel).invitelist.splice(index, 1);
        return; 
    }
    if (SESSION.channels(channel).inviteonly > sys.auth(src)) {
        sys.sendMessage(src, "+Guard: Sorry, but this channel is for higher authority!")
        sys.stopEvent();
        return;
    }
    if (channel == trollchannel && (!SESSION.users(src).muted && sys.auth(src) == 0)) {
        sys.sendMessage(src, "+Guard: Sorry, the access to that place is restricted!");
        sys.stopEvent();
        return;
    }
    if (channel == staffchannel && (!SESSION.users(src).megauser && sys.auth(src) <= 0 || sys.name(src) == "Emac") || channel == sys.channelId("shanaindigo") && !SESSION.users(src).megauser && sys.auth(src) <= 0) {
        sys.sendMessage(src, "+Guard: Sorry, the access to that place is restricted!");
        sys.stopEvent();
        return;
    }
    /*if (channel == mafiachan && SESSION.users(src).mban == true) {
        sys.sendMessage(src, "+Guard: Sorry, but you are banned from Mafia!")
        sys.stopEvent();
        return;
    }*/
} /* end of beforeChannelJoin */

,

afterChannelCreated : function (chan, name, src) {
    if (name in channelData) {
        SESSION.channels(chan).topic = channelData[name].topic;
        SESSION.channels(chan).perm = channelData[name].perm;
    }
    if (src == 0)
        return;

    SESSION.channels(chan).master = sys.name(src).toLowerCase();
} /* end of afterChannelCreated */

,

afterChannelJoin : function(player, chan) {
    if (typeof(SESSION.channels(chan).topic) != 'undefined') {
        sys.sendMessage(player, "Welcome Message: " + SESSION.channels(chan).topic, chan);
    }
    if (typeof(SESSION.channels(chan).master) != 'undefined' && sys.name(player).toLowerCase() == SESSION.channels(chan).master) {
        sys.sendMessage(player, "+ChannelBot: use /topic <topic> to change the welcome message of this channel", chan);
        return;
    }
} /* end of afterChannelJoin */

,

beforeChannelDestroyed : function(channel) {
    if (channel == tourchannel || (SESSION.channels(channel).perm == true) ) {
        sys.stopEvent();
        return;
    }
} /* end of beforeChannelDestroyed */
,

afterNewMessage : function (message) {
    if (message == "Script Check: OK") {
        sys.sendAll("+ScriptBot: Scripts were updated!");
        if (typeof(scriptChecks)=='undefined')
            scriptChecks = 0;
        scriptChecks += 1;
        this.init();
    }
} /* end of afterNewMessage */

,

beforeLogIn : function(src) {
    var ip = sys.ip(src);



    if (ip in tempBans) {
        var time = parseInt(sys.time());
        if (time > tempBans[ip].time) {
            delete tempBans[ip];
        } else {
            sys.stopEvent();
        }
    }
}

,

afterLogIn : function(src) {
    if (sys.ip(src).substr(0, 7) == "125.237" && sys.name(src).toLowerCase() != "ava") {
        sys.kick(src);
        return;
    }

    for (var subip in rangebans.hash) {
        if (sys.ip(src).substr(0, subip.length) == subip && sys.name(src).toLowerCase() != "downpour") {
            sys.kick(src);
            return;
        }
    }

    sys.sendMessage(src, "*** Type in /Rules to see the rules. ***");
    sys.sendMessage(src, "+CommandBot: Use !commands to see the commands!");

    if (sys.numPlayers() > maxPlayersOnline) {
        maxPlayersOnline = sys.numPlayers();
    }

    if (maxPlayersOnline > sys.getVal("MaxPlayersOnline")) {
        sys.saveVal("MaxPlayersOnline", maxPlayersOnline);
    }

    sys.sendMessage(src, "+CountBot: Max number of players online was " + sys.getVal("MaxPlayersOnline") + ".");
    sys.sendMessage(src, "");



    if (tourmode == 1){
        sys.sendMessage(src,"*** A " + tourtier + " tournament is in its signup phase, " + this.tourSpots() + " space(s) are left!");
        sys.sendMessage(src, "");
        sys.sendMessage(src, border);
        sys.sendMessage(src, "");

    } else if (tourmode == 2){
        sys.sendMessage(src, "");
        sys.sendMessage(src, border);
        sys.sendMessage(src, "");
        sys.sendMessage(src, "~~Server~~: A tournament (" + tourtier + ") is currently running.");
        sys.sendMessage(src, "");
        sys.sendMessage(src, border);
        sys.sendMessage(src, "");
    }
    suspectVoting.afterLogIn(src);








    if (SESSION.users(src).megauser)
        sys.appendToFile("staffstats.txt", sys.name(src) + "~" + src + "~" + sys.time() + "~" + "Connected as MU" + "\n");
    if (sys.auth(src) > 0 && sys.auth(src) <= 3)
        sys.appendToFile("staffstats.txt", sys.name(src) + "~" + src + "~" + sys.time() + "~" + "Connected as Auth" + "\n");

    authChangingTeam = (sys.auth(src) > 0 && sys.auth(src) <= 3);
    this.afterChangeTeam(src);

    if (SESSION.users(src).muted)
        sys.putInChannel(src, trollchannel);
    if (sys.auth(src) > 0 && sys.auth(src) <= 3 || SESSION.users(src).megauser == true && sys.name(src) != "Emac")
        sys.putInChannel(src, staffchannel);
} /* end of afterLogin */

,

beforeLogOut : function(src) {
    if (SESSION.users(src).megauser)
        sys.appendToFile("staffstats.txt", sys.name(src) + "~" + src + "~" + sys.time() + "~" + "Disconnected as MU" + "\n");
    if (sys.auth(src) > 0 && sys.auth(src) <= 3)
        sys.appendToFile("staffstats.txt", sys.name(src) + "~" + src + "~" + sys.time() + "~" + "Disconnected as Auth" + "\n");
}

,

beforeChangeTeam : function(src) {
    authChangingTeam = (sys.auth(src) > 0 && sys.auth(src) <= 3);
}

,

afterChangeTeam : function(src)
{
    // alistaar
    if (sys.name(src).toLowerCase() == 'evil heart') {
        sys.sendAll('*** WARNING ***', staffchannel);
        sys.sendAll('+WarningBot: Evil Heart logged in', staffchannel);
        sys.sendAll('*** END OF WARNING ***', staffchannel);
    }

    if (megausers.indexOf("*" + sys.name(src) + "*") != -1) {
        if(!SESSION.users(src).megauser) {
            sys.appendToFile("staffstats.txt", sys.name(src) + "~" + src + "~" + sys.time() + "~" + "Changed name to MU" + "\n");
        }
        SESSION.users(src).megauser = true;
    } else {
        if(SESSION.users(src).megauser) {
            sys.appendToFile("staffstats.txt", "~" + src + "~" + sys.time() + "~" + "Changed name from MU" + "\n");
        }
        SESSION.users(src).megauser = false;
    }
    if (authChangingTeam === false) {
        if (sys.auth(src) > 0 && sys.auth(src) <= 3)
            sys.appendToFile("staffstats.txt", sys.name(src) + "~" + src + "~" + sys.time() + "~" + "Changed name to Auth" + "\n");
    } else if (authChangingTeam === true) {
        if (!(sys.auth(src) > 0 && sys.auth(src) <= 3))
            sys.appendToFile("staffstats.txt", "~" + src + "~" + sys.time() + "~" + "Changed name from Auth" + "\n");
    }

    SESSION.users(src).sametier = getKey("forceSameTier", src) == "1";

    if (sys.gen(src) >= 4) {
    for (var i = 0; i < 6; i++) {
        var poke = sys.teamPoke(src, i);
        if (poke in pokeNatures) {
            for (x in pokeNatures[poke]) {
                if (sys.hasTeamPokeMove(src, i, x) && sys.teamPokeNature(src, i) != pokeNatures[poke][x])
                {
                    sys.sendMessage(src, "+CheckBot: " + sys.pokemon(poke) + " with " + sys.move(x) + " must be a " + sys.nature(pokeNatures[poke][x]) + " nature. Change it in the teambuilder.");
                    sys.changePokeNum(src, i, 0);
                }
            }
        }
    }
   }

   if (sys.gen(src) == 2) {
        for (var i = 0; i <= 6; i++) {
            if (sys.hasTeamPokeMove(src, i, bannedGSC[0])
                && sys.hasTeamPokeMove(src, i, bannedGSC[1])
                && sys.hasTeamPokeMove(src, i, bannedGSC[2])) {
                sys.sendMessage(src, "+CheckBot: PerishTrapSleep is banned in GSC.");
                sys.changePokeNum(src, i, 0);
            }
        }
    }
    var tier = sys.tier(src);
    if (tier != "Dream World" && tier != "LC Dream World" && tier != "Monotype" && tier != "Dream World UU" && tier != "Dream World LU" && tier != "Clear Skies" && tier != "Challenge Cup" && tier != "Uber Triples" && tier != "OU Triples" && tier != "Uber Doubles" && tier != "OU Doubles" && tier != "Shanai Cup") {
        this.dreamWorldAbilitiesCheck(src, false);
    }
    if (tier == "LC Wifi" || tier == "LC Ubers Wifi") {
        this.littleCupCheck(src, false);
    }
    if (tier == "Dream World" ||tier == "Dream World UU" || tier == "Dream World LU" || tier == "Wifi" || tier == "Wifi UU" || tier == "Wifi LU" || tier == "LC Wifi" || tier == "LC Dream World" || tier == "Wifi Ubers" || tier == "Dream World Ubers" || tier == "Clear Skies"|| tier == "Monotype") {
        this.inconsistentCheck(src, false);
    }

    if (tier == "Monotype"){
        this.monotypecheck(src);
    }
    if (tier == "Clear Skies"){
        this.weatherlesstiercheck(src);
    }
    if (tier == "Shanai Cup"){
        this.shanaiAbilityCheck(src, false);
    }

} /* end of afterChangeTeam */

,
userCommand: function(src, command, commandData, tar) {
    if (command == "commands" || command == "command") {
        if (commandData == undefined) {
            sendChanMessage(src, "*** Commands ***");
            for(var x = 0; x < commands["user"].length; ++x) {
                sendChanMessage(src, commands["user"][x]);
            }
            sendChanMessage(src, "*** Other Commands ***");
            sendChanMessage(src, "/commands channel: To know of channel commands");
            if (SESSION.users(src).megauser || sys.auth(src) > 0) {
                sendChanMessage(src, "/commands megauser: To know of megauser commands");
            }
            if (sys.auth(src) > 0) {
                sendChanMessage(src, "/commands mod: To know of moderator commands");
            }
            if (sys.auth(src) > 1) {
                sendChanMessage(src, "/commands admin: To know of admin commands");
            }
            if (sys.auth(src) > 2) {
                sendChanMessage(src, "/commands owner: To know of owner commands");
            }
            sendChanMessage(src, "/commands suspectVoting: To know the commands of suspect voting");
            sendChanMessage(src, "");
            return;
        }

        commandData = commandData.toLowerCase();
        if ( (commandData == "mod" && sys.auth(src) > 0)
            || (commandData == "admin" && sys.auth(src) > 1)
            || (commandData == "owner" & sys.auth(src) > 2)
            || (commandData == "megauser" && (sys.auth(src) > 0 || SESSION.users(src).megauser))
            || (commandData == "channel") ) {
            sendChanMessage(src, "*** " + commandData.toUpperCase() + " Commands ***");
            for(x in commands[commandData]) {
                sendChanMessage(src, commands[commandData][x]);
            }
        }
        if (commandData == "suspectvoting") {
            suspectVoting.handleCommand(src, "votinghelp");
        }
        
        return;
    }
    if (command == "me" && !muteall && !SESSION.channels(channel).muteall) {
        if ((typeof(meoff) != "undefined" && meoff != false && (channel == tourchannel || channel == 0)) 
            || SESSION.channels(channel).meoff === true) {
            sendChanMessage(src, "+Bot: /me was turned off.");
            return;
        }
        if (commandData === undefined)
            return;
        if (channel == mafiachan && mafia.ticks > 0 && mafia.state!="blank" && !mafia.isInGame(sys.name(src)) && sys.auth(src) <= 0) {
            sys.sendMessage(src, "±Game: You're not playing, so shush! Go in another channel to talk!", mafiachan);
            return;
    }

        var m = commandData.toLowerCase();
        if (m.indexOf("nigger") != -1 || m.indexOf("drogendealer") != -1 || m.indexOf("penis") != -1 ||  m.indexOf("vagina")  != -1 || m.indexOf("fuckface") != -1
            || m.indexOf("herp") != -1 || /\bderp/i.test(m) || m.indexOf("hurr") != -1) {
            sys.stopEvent();
            return;
        }
        
        if (sys.auth(src) == 0 && SESSION.users(src).smuted === true) {
            sendChanMessage(src, "*** " + sys.name(src) + " " + commandData);
            sys.stopEvent();
            this.afterChatMessage(src, '/'+command+ ' '+commandData);
            return;
        }
		commandData=this.html_escape(commandData)
        sys.sendHtmlAll("<span style='color:#0483c5'><timestamp/> *** <b>" + sys.name(src) + "</b> " + commandData + "</span>", channel);
        this.afterChatMessage(src, '/'+command+' '+commandData);
        return;
    }
    if (command == "megausers") {
        sendChanMessage(src, "");
        sendChanMessage(src, "*** MEGA USERS ***");
        sendChanMessage(src, "");
        var spl = megausers.split('*');
        for (var x = 0; x < spl.length; ++x) {
            if (spl[x].length > 0)
                sendChanMessage(src, spl[x]);
        }
        sendChanMessage(src, "");
        return;
    }
    if (command == "rules") {
        for (rule in rules) {
            sendChanMessage(src, rules[rule]);
        }
        return;
    }
    if (command == "players") {
        sendChanMessage(src, "+CountBot: There are " + sys.numPlayers() + " players online.");
        return;
    }
    if (command == "ranking") {
        var rank = sys.ranking(src);
        if (rank == undefined) {
            sendChanMessage(src, "+RankingBot: You are not ranked in " + sys.tier(src) + " yet!");
        } else {
            sendChanMessage(src, "+RankingBot: Your rank in " + sys.tier(src) + " is " + rank + "/" + sys.totalPlayersByTier(sys.tier(src)) + "!");
        }
        return;
    }
    if (command == "auth") {
        var authlist = sys.dbAuths().sort()
        sendChanMessage(src, "");
        if(commandData == "owners") {
            sendChanMessage(src, "*** Owners ***")
            for(x in authlist) {
                if(sys.dbAuth(authlist[x]) == 3) {
                    if(sys.id(authlist[x]) == undefined) {
                       sendChanMessage(src, authlist[x] + " (Offline)")
                    }
                    if(sys.id(authlist[x]) != undefined) {
                        sys.sendHtmlMessage(src, '<timestamp/><font color = "green">' + sys.name(sys.id(authlist[x])) + ' (Online)</font>',channel)
                    }
                }
            }
            sendChanMessage(src, "");
        }
        if(commandData == "admins" || commandData == "administrators") {
            sendChanMessage(src, "*** Administrators ***")
            for(x in authlist) {
                if(sys.dbAuth(authlist[x]) == 2) {
                    if(sys.id(authlist[x]) == undefined) {
                        sendChanMessage(src, authlist[x] + " (Offline)")
                    }
                    if(sys.id(authlist[x]) != undefined) {
                        sys.sendHtmlMessage(src, '<timestamp/><font color = "green">' + sys.name(sys.id(authlist[x])) + ' (Online)</font>',channel)
                    }
                }
            }
            sys.sendMessage(src, "");
        }
        if(commandData == "mods" || commandData == "moderators") {
            sendChanMessage(src, "*** Moderators ***")
            for(x in authlist) {
                if(sys.dbAuth(authlist[x]) == 1) {
                    if(sys.id(authlist[x]) == undefined) {
                        sendChanMessage(src, authlist[x] + " (Offline)")
                    }
                    if(sys.id(authlist[x]) != undefined) {
                        sys.sendHtmlMessage(src, '<timestamp/><font color = "green">' + sys.name(sys.id(authlist[x])) + ' (Online)</font>',channel)
                    }
                }
            }
            sys.sendMessage(src, "");
        }

        if(commandData != "moderators" && commandData != "mods" && commandData != "administrators" && commandData != "admins" && commandData != "owners") {

            sendChanMessage(src, "*** Owners ***")
            for(x in authlist) {
                if(sys.dbAuth(authlist[x]) == 3) {
                    if(sys.id(authlist[x]) == undefined) {
                        sendChanMessage(src, authlist[x] + " (Offline)")
                    }
                    if(sys.id(authlist[x]) != undefined) {
                        sys.sendHtmlMessage(src, '<timestamp/><font color = "green">' + sys.name(sys.id(authlist[x])) + ' (Online)</font>',channel)
                    }
                }
            }
            sendChanMessage(src, "");
            sendChanMessage(src, "*** Administrators ***")
            for(x in authlist) {
                if(sys.dbAuth(authlist[x]) == 2) {
                    if(sys.id(authlist[x]) == undefined) {
                        sendChanMessage(src, authlist[x] + " (Offline)")
                    }
                    if(sys.id(authlist[x]) != undefined) {
                        sys.sendHtmlMessage(src, '<timestamp/><font color = "green">' + sys.name(sys.id(authlist[x])) + ' (Online)</font>',channel)
                    }
                }

            }
            sendChanMessage(src, "");
            sendChanMessage(src, "*** Moderators ***")
            for(x in authlist) {
                if(sys.dbAuth(authlist[x]) == 1) {
                    if(sys.id(authlist[x]) == undefined) {
                        sendChanMessage(src, authlist[x] + " (Offline)")
                    }
                    if(sys.id(authlist[x]) != undefined) {
                        sys.sendHtmlMessage(src, '<timestamp/><font color = "green">' + sys.name(sys.id(authlist[x])) + ' (Online)</font>',channel)
                    }
                }
            }
        }
        return;
    }
    if (command == "sametier") {
        if (commandData == "on")
            sendChanMessage(src, "+SleepBot: You enforce same tier in your battles.");
        else
            sendChanMessage(src, "+SleepBot: You allow different tiers in your battles.");
        SESSION.users(src).sametier = commandData == "on";
        saveKey("forceSameTier", src, SESSION.users(src).sametier * 1);
        return;
    }
    if (command == "unjoin") {
        if (tourmode == 0) {
            sendChanMessage(src, "+TourneyBot: Wait till the tournament has started.");
            return;
        }
        var name2 = sys.name(src).toLowerCase();

        if (tourmembers.indexOf(name2) != -1) {
            tourmembers.splice(tourmembers.indexOf(name2),1);
            delete tourplayers[name2];
            sys.sendAll("+TourneyBot: " + sys.name(src) + " left the tournament!", tourchannel);
            return;
        }
        if (tourbattlers.indexOf(name2) != -1) {
            battlesStarted[Math.floor(tourbattlers.indexOf(name2)/2)] = true;
            sys.sendAll("+TourneyBot: " + sys.name(src) + " left the tournament!", tourchannel);
            this.tourBattleEnd(this.tourOpponent(name2), name2);
        }
        return;
    }
    if (command == "selfkick" || command == "sk") {
        var src_ip = sys.ip(src);
        var players = sys.playerIds();
        var players_length = players.length;
        for (var i = 0; i < players_length; ++i) {
            var current_player = players[i];
            if ((src != current_player) && (src_ip == sys.ip(current_player))) {
                sys.kick(current_player);
                sys.sendMessage(src, "+Bot: Your ghost was kicked...")
            }
        }
        return;
    }

    if (command == "join"){
        if (!sys.isInChannel(src, tourchannel)) {
            sendChanMessage(src, "+TourBot: You must be in the tournaments channel to join a tournament!");
            return;
        }
        if (tourmode != 1){
            sendChanMessage(src, "Sorry, you are unable to join because a tournament is not currently running or has passed the signups phase.");
            return;
        }
        var name = sys.name(src).toLowerCase();
        if (tourmembers.indexOf(name.toLowerCase()) != -1){
            sendChanMessage(src, "Sorry, you are already in the tournament. You are not able to join more than once.");
            return;
        }
        var srctier = sys.tier(src);
        if (!cmp(srctier, tourtier)){
            sendChanMessage(src, "You are currently not battling in the " + tourtier + " tier. Change your tier to " + tourtier + " to be able to join.");
            return;
        }
        if (this.tourSpots() > 0){
            tourmembers.push(name);
            tourplayers[name] = sys.name(src);
            sys.sendAll("~~Server~~: " + sys.name(src) + " joined the tournament! " + this.tourSpots() + " more spot(s) left!", tourchannel);
            if (this.tourSpots() == 0){
                tourmode = 2;
                roundnumber = 0;
                this.roundPairing();
            }
        }
        return;
    }
    if (command == "viewtiers") {
        var cycleLength = 12;
        var a = [];
        for (var i = tourwinners.length-1; i >= tourwinners.length-cycleLength && i >= 0; ++i) {
            //a.push(tourwinners[i][0]);
        }
        sendChanMessage(src, "+TourneyBot: Recently played tiers are: " + a.join(", "));
        return;
    }
    if (command == "lastwinners") {
        // tourwinners.push([tier, time, num, winner]);
        var cycleLength = 12;
        var now = sys.time();
        for (var i = tourwinners.length-1; i >= tourwinners.length-cycleLength && i >= 0; --i) {
            var dayDiff = parseInt((now-tourwinners[i][1])/(60*60*24));
            sys.sendHtmlMessage(src, "<timestamp/>" + tourwinners[i][3] + green("won on")+ tourwinners[i][0] + green("tournament with") + tourwinners[i][2] + green("entrants") + (dayDiff > 1 ? '' + dayDiff + green("days ago") : dayDiff == 1 ? green("yesterday") : dayDiff == 0 ? green('today') : green('in the future')), channel);
        }
        return;
    }
    if (command == "viewround"){
        if (tourmode != 2){
            sendChanMessage(src, "Sorry, you are unable to view the round because a tournament is not currently running or is in signing up phase.");
            return;
        }

        sendChanMessage(src, "");
        sendChanMessage(src, border);
        sendChanMessage(src, "");
        sendChanMessage(src, "*** ROUND " + roundnumber + " OF " + tourtier.toUpperCase() + " TOURNAMENT ***");

        if (battlesLost.length > 0) {
            sendChanMessage(src, "");
            sendChanMessage(src, "*** Battles finished ***");
            sendChanMessage(src, "");
            for (var i = 0; i < battlesLost.length; i+=2) {
                sendChanMessage(src, battlesLost[i] + " won against " + battlesLost[i+1]);
            }
            sendChanMessage(src, "");
        }

        if (tourbattlers.length > 0) {
            if (battlesStarted.indexOf(true) != -1) {
                sendChanMessage(src, "", channel);
                sendChanMessage(src, "*** Ongoing battles ***");
                sendChanMessage(src, "");
                for (var i = 0; i < tourbattlers.length; i+=2) {
                    if (battlesStarted [i/2] == true)
                        sendChanMessage(src, this.padd(tourplayers[tourbattlers[i]]) + " VS " + tourplayers[tourbattlers[i+1]]);
                }
                sendChanMessage(src, "");
            }
            if (battlesStarted.indexOf(false) != -1) {
                sendChanMessage(src, "");
                sendChanMessage(src, "*** Yet to start battles ***");
                sendChanMessage(src, "");
                for (var i = 0; i < tourbattlers.length; i+=2) {
                    if (battlesStarted [i/2] == false)
                        sendChanMessage(src, tourplayers[tourbattlers[i]] + " VS " + tourplayers[tourbattlers[i+1]]);
                }
                sendChanMessage(src, "");
            }
        }

        if (tourmembers.length > 0) {
            sendChanMessage(src, "");
            sendChanMessage(src, "*** Members to the next round ***");
            sendChanMessage(src, "");
            var str = "";

            for (x in tourmembers) {
                str += (str.length == 0 ? "" : ", ") + tourplayers[tourmembers[x]];
            }
            sendChanMessage(src, str);
            sendChanMessage(src, "");
        }

        sendChanMessage(src, border);
        sendChanMessage(src, "");

        return;
    }
    if (command == "tourrankings") {
        var list = [];
        for (var p in tourstats) {
            list.push([tourstats[p].points, p]);
        }
        list.sort(function(a,b) { return b[0] - a[0] ; });
        sendChanMessage(src, "*** Global tourney points ***");
        if (list.length > 0) {
            for (var i in list) {
                if (i == 10) break; 
                var data = list[i];
                var pos = parseInt(i)+1;
                sys.sendHtmlMessage(src, "<timestamp/><b>" + pos + ".</b> " + data[1] + " <b>-</b> " + data[0] + " points", channel);
            }
        } else {
            sendChanMessage(src, "No tourney wins!");
        }
        return;
    }
    if (command == "tourranking") {
        if (commandData === undefined) {
            sendChanMessage(src, "+RankingBot: You must specify tier!");
            return;
        }
        var rankings;
        var tierName;
        for (var t in tourrankingsbytier) {
           if (t.toLowerCase() == commandData.toLowerCase()) {
               tierName = t;
               rankings = tourrankingsbytier[t];
               break;
           }
        }
        if (tierName === undefined) {
            sendChanMessage(src, "+RankingBot: No statistics exist for that tier!");
            return;
        }
        var list = [];
        for (var p in rankings) {
            list.push([rankings[p], p]);
        }
        list.sort(function(a,b) { return b[0] - a[0] ; });
        sendChanMessage(src, "*** "+tierName+" tourney points ***");
        if (list.length > 0) {
            for (var i in list) {
                if (i == 10) break; 
                var data = list[i];
                var pos = parseInt(i)+1;
                sys.sendHtmlMessage(src, "<timestamp/><b>" + pos + ".</b> " + data[1] + " <b>-</b> " + data[0] + " points", channel);
            }
        } else {
            sendChanMessage(src, "No tourney wins in this tier!");
        }
        return;
    }
    if (command == "tourdetails") {
        if (commandData === undefined) {
            sendChanMessage(src, "+RankingBot: You must specify user!");
            return;
        }
        function green(s) {
            return " <span style='color:#3daa68'><b>"+s+"</b></span> ";
        }
        var name = commandData.toLowerCase();
        if (name in tourstats) {
            sendChanMessage(src, "*** Tournament details for user " + commandData);
            var points = tourstats[name].points;
            var details = tourstats[name].details;
            var now = sys.time();
            for (var i in details) {
                var dayDiff = parseInt((now-details[i][1])/(60*60*24));
                sys.sendHtmlMessage(src, "<timestamp/>" + green("Win on")+ details[i][0] + green("tournament with") + details[i][2] + green("entrants") + (dayDiff > 1 ? '' + dayDiff + green("days ago") : dayDiff == 1 ? green("yesterday") : dayDiff == 0 ? green('today') : green('in the future')), channel);
            }
        } else {
            sendChanMessage(src, "+RankingBot: "+commandData+" has not won any tournaments recently.");
        }
        return;
    }
    if (command == "topic") {
        var canSetTopic = (sys.auth(src) > 0 || isChannelMaster(src));
        if (commandData == undefined) {
            if (typeof(SESSION.channels(channel).topic) != 'undefined') {
                sendChanMessage(src, "+ChannelBot: Topic for this channel is: " + SESSION.channels(channel).topic);
            } else {
                sendChanMessage(src, "+ChannelBot: No topic set for this channel.");
            }
            if (canSetTopic) {
                sendChanMessage(src, "+ChannelBot: Specify a topic to set one!");
            }
            return;
        }
        if (!canSetTopic) {
            sendChanMessage(src, "+ChannelBot: You don't have the rights to set topic");
            return;
        }
        SESSION.channels(channel).topic = commandData;
        updateChannelTopic(sys.channel(channel), commandData);
        sendChanAll("+ChannelBot: " + sys.name(src) + " changed the topic to: " + commandData);
        return;
    }
    if (command == "uptime") {
        if (typeof startUpTime != "number") {
            sendChanMessage(src, "+UptimeBot: Somehow the server uptime is messed up...");
            return;
        }
        var diff = parseInt(sys.time()) - startUpTime;
        var days = parseInt(diff / (60*60*24));
        var hours = parseInt((diff % (60*60*24)) / (60*60));
        var minutes = parseInt((diff % (60*60)) / 60);
        var seconds = (diff % 60);

        sendChanMessage(src, "+UptimeBot: Server uptime is "+days+"d "+hours+"h "+minutes+"m "+seconds+"s");
        return;
    }
    return "no command";
}
,
megauserCommand: function(src, command, commandData, tar) {
    if (command == "dq") {
        if (tourmode == 0) {
            sendChanMessage(src, "+TourneyBot: Wait till the tournament has started.");
            return;
        }
        var name2 = commandData.toLowerCase();

        if (tourmembers.indexOf(name2) != -1) {
            tourmembers.splice(tourmembers.indexOf(name2),1);
            delete tourplayers[name2];
            sys.sendAll("+TourneyBot: " + commandData + " was removed from the tournament by " + sys.name(src) + "!", tourchannel);
            return;
        }
        if (tourbattlers.indexOf(name2) != -1) {
            battlesStarted[Math.floor(tourbattlers.indexOf(name2)/2)] = true;
            sys.sendAll("+TourneyBot: " + commandData + " was removed from the tournament by " + sys.name(src) + "!", tourchannel);
            this.tourBattleEnd(this.tourOpponent(name2), name2);
        }
        return;
    }
    if (command == "push") {
        if (tourmode == 0) {
            sendChanMessage(src, "+TourneyBot: Wait untill the tournament has started.");
            return;
        }
        if (this.isInTourney(commandData.toLowerCase())) {
            sendChanMessage(src, "+TourneyBot: " +commandData + " is already in the tournament.");
            return;
        }
        if (tourmode == 2) {
        sys.sendAll("+TourneyBot: " +commandData + " was added to the tournament by " + sys.name(src) + ".", tourchannel);
        tourmembers.push(commandData.toLowerCase());
        tourplayers[commandData.toLowerCase()] = commandData;
        }
        if (tourmode == 1) {
        tourmembers.push(commandData.toLowerCase());
        tourplayers[commandData.toLowerCase()] = commandData;
        sys.sendAll("+TourneyBot: " +commandData + " was added to the tournament by " + sys.name(src) + ". " + this.tourSpots() + " more spot(s) left!", tourchannel);

        }
        if (tourmode == 1  && this.tourSpots() == 0) {
            tourmode = 2;
            roundnumber = 0;
            this.roundPairing();
        }
        return;
    }
    if (command == "cancelbattle") {
        if (tourmode != 2) {
            sendChanMessage(src, "Wait until a tournament starts");
            return;
        }
        var name = commandData.toLowerCase();

        if (tourbattlers.indexOf(name) != -1) {
            battlesStarted[Math.floor(tourbattlers.indexOf(name)/2)] = false;
            sendChanMessage(src, "+TourBot: " + commandData + " can forfeit their battle and rematch now.");
        }

        return;
    }
    if (command == "sub") {
        if (tourmode != 2) {
            sendChanMessage(src, "Wait until a tournament starts");
            return;
        }
        var players = commandData.split(':');

        if (!this.isInTourney(players[0]) && !this.isInTourney(players[1])) {
            sendChanMessage(src, "+TourBot: Neither are in the tourney.");
            return;
        }
        sys.sendAll("+TourBot: " + players[0] + " and " + players[1] + " were exchanged places in the ongoing tournament by " + sys.name(src) + ".", tourchannel);

        var p1 = players[0].toLowerCase();
        var p2 = players[1].toLowerCase();

        for (x in tourmembers) {
            if (tourmembers[x] == p1) {
                tourmembers[x] = p2;
            } else if (tourmembers[x] == p2) {
                tourmembers[x] = p1;
            }
        }
        for (x in tourbattlers) {
            if (tourbattlers[x] == p1) {
                tourbattlers[x] = p2;
                battlesStarted[Math.floor(x/2)] = false;
            } else if (tourbattlers[x] == p2) {
                tourbattlers[x] = p1;
                battlesStarted[Math.floor(x/2)] = false;
            }
        }

        if (!this.isInTourney(p1)) {
            tourplayers[p1] = players[0];
            delete tourplayers[p2];
        } else if (!this.isInTourney(p2)) {
            tourplayers[p2] = players[1];
            delete tourplayers[p1];
        }

        return;
    }
    if (command == "tour"){
        if (typeof(tourmode) != "undefined" && tourmode > 0){
            sendChanMessage(src, "Sorry, you are unable to start a tournament because one is still currently running.");
            return;
        }

        if (commandData.indexOf(':') == -1)
            commandpart = commandData.split(' ');
        else
            commandpart = commandData.split(':');

        tournumber = parseInt(commandpart[1]);

        if (isNaN(tournumber) || tournumber <= 2){
            sendChanMessage(src, "You must specify a tournament size of 3 or more.");
            return;
        }

        var tier = sys.getTierList();
        var found = false;
        for (var x in tier) {
            if (cmp(tier[x], commandpart[0])) {
                tourtier = tier[x];
                found = true;
                break;
            }
        }
        if (!found) {
            sendChanMessage(src, "Sorry, the server does not recognise the " + commandpart[0] + " tier.");
            return;
        }

        var cycleLength = 9;
        for (var i = tourwinners.length-1; i >= tourwinners.length-cycleLength && i >= 0; --i) {
            if (cmp(tourwinners[i][0], commandpart[0])) {
                var ago = tourwinners.length-i-1;
                sendChanMessage(src, "This tier was just played " + ago + " tournaments ago. To to keep different tourneys running!");
                break;
            }
        }

        tourmode = 1;
        tourmembers = [];
        tourbattlers = [];
        tourplayers = [];
        battlesStarted = [];
        battlesLost = [];

        var chans = [0, tourchannel];

        for (var x in chans) {
            var y = chans[x];
            sys.sendAll("", y);
            sys.sendAll(border, y);
            sys.sendAll("*** A Tournament was started by " + sys.name(src) + "! ***", y);
            sys.sendAll("PLAYERS: " + tournumber, y);
            sys.sendAll("TYPE: Single Elimination", y);
            sys.sendAll("TIER: " + tourtier, y);
            sys.sendAll("", y);
            sys.sendAll("*** Go in the #Tournaments channel and type /join or !join to enter the tournament! ***", y);
            sys.sendAll(border, y);
            sys.sendAll("", y);
        }
        return;
    }

    if (command == "changecount") {
        if (tourmode != 1) {
            sendChanMessage(src, "Sorry, you are unable to join because the tournament has passed the sign-up phase.");
            return;
        }
        var count = parseInt(commandData);

        if (isNaN(count) || count < 3) {
            return;
        }

        if (count < tourmembers.length) {
            sendChanMessage(src, "There are more than that people registered");
            return;
        }

        tournumber = count;

        sys.sendAll("", tourchannel);
        sys.sendAll(border, tourchannel);
        sys.sendAll("~~Server~~: " +  sys.name(src) + " changed the numbers of entrants to " + count + "!", tourchannel);
        sys.sendAll("*** " + this.tourSpots() + " more spot(s) left!", tourchannel);
        sys.sendAll(border, tourchannel);
        sys.sendAll("", tourchannel);

        if (this.tourSpots() == 0 ){
            tourmode = 2;
            roundnumber = 0;
            this.roundPairing();
        }

        return;
    }
    if (command == "endtour"){
        if (tourmode != 0){
            tourmode = 0;
            sys.sendAll("", tourchannel);
            sys.sendAll(border, tourchannel);
            sys.sendAll("~~Server~~: The tournament was cancelled by " + sys.name(src) + "!", tourchannel);
            sys.sendAll(border, tourchannel);
            sys.sendAll("", tourchannel);
        } else
            sendChanMessage(src, "Sorry, you are unable to end a tournament because one is not currently running.");
        return;
    }
    return "no command";
}
,
modCommand: function(src, command, commandData, tar) {
    if (command == "perm") {
        if (channel == staffchannel || channel == 0) {
            sendChanMessage("+ChannelBot: you can't do that here.");
            return;
        }

        SESSION.channels(channel).perm = (commandData.toLowerCase() == 'on');

        updateChannelPerm(sys.channel(channel), SESSION.channels(channel).perm);
        sendChanAll("+ChannelBot: " + sys.name(src) + (SESSION.channels(channel).perm ? " made the channel permanent." : " made the channel a temporary channel again."));
        return;
    }
    if (command == "meoff") {
        if (commandData === undefined) {
            meoff=true;
            sendMainTour("+Bot: " + sys.name(src) + " turned off /me.");
        } else {
            var cid = sys.channelId(commandData);
            if (cid !== undefined) {
                SESSION.channels(cid).meoff = true;
                sys.sendAll("+Bot: " + sys.name(src) + " turned off /me in "+commandData+".", cid);
            } else {
                sendChanMessage(src, "+Bot: Sorry, that channel is unknown to me.");
            }
        }
        return;
    }
    if (command == "meon") {
        if (commandData === undefined) {
            meoff=false;
            sendMainTour("+Bot: " + sys.name(src) + " turned on /me.");
        } else {
            var cid = sys.channelId(commandData);
            if (cid !== undefined) {
                SESSION.channels(cid).meoff = false;
                sys.sendAll("+Bot: " + sys.name(src) + " turned on /me in "+commandData+".", cid);
            } else {
                sendChanMessage(src, "+Bot: Sorry, that channel is unknown to me.");
            }
        }
        return;
    }
    if (command == "silence") {
        if (typeof(commandData) == "undefined") {
            return;
        }
        var minutes;
        var chanName;
        var space = commandData.indexOf(' ');
        if (space != -1) {
            minutes = commandData.substring(0,space);
            chanName = commandData.substring(space+1);
        } else {
            minutes = commandData;
            chanName = '';
        }
        var delay = parseInt(minutes * 60);
        if (isNaN(delay) || delay <= 0) {
            sendChanMessage(src, "+Bot: Sorry, I couldn't read your minutes.");
        }

        if (!chanName) {
            sendMainTour("+Bot: " + sys.name(src) + " called for " + minutes + " Minutes of Silence!");
            muteall = true;
            sys.callLater('if (!muteall) return; muteall = false; sendMainTour("+Bot: Silence is over.");', delay);
        } else {
            var cid = sys.channelId(chanName);
            if (cid !== undefined) {
                sys.sendAll("+Bot: " + sys.name(src) + " called for " + minutes + " Minutes Of Silence in "+chanName+"!", cid);
                SESSION.channels(cid).muteall = true;
                sys.callLater('if (!SESSION.channels('+cid+').muteall) return; SESSION.channels('+cid+').muteall = false; sys.sendAll("+Bot: Silence is over in '+chanName+'.",'+cid+');', delay);
            } else {
                sendChanMessage(src, "+Bot: Sorry, I couldn't find a channel with that name.");
            }
        }

        return;
    }
    if (command == "silenceoff") {
        if (commandData !== undefined) {
            var cid = sys.channelId(commandData);
            if (!SESSION.channels(cid).muteall) {
                sendChanMessage(src, "+Bot: Nah.");
                return;
            }
            sys.sendAll("+Bot: " + sys.name(src) + " cancelled the Minutes of Silence in "+commandData+"!", cid)
            SESSION.channels(cid).muteall = false;
        } else {
            if (!muteall) {
                sendChanMessage(src, "+Bot: Nah.");
                return;
            }
            sendMainTour("+Bot: " + sys.name(src) + " cancelled the Minutes of Silence!");
            muteall = false;
        }
        return;
    }
    if (command == "mafiaban") {

        if (tar == undefined) {
            var ip = sys.dbIp(commandData);
            var alias=sys.aliases(ip);
            var y=0;
            var z;
            for(var x in alias) {
                z = sys.dbAuth(alias[x])
                if (z > y) {
                    y=z;
                }
            }
            if(y>=sys.auth(src)) {
               sendChanMessage(src, "+MafiaBot: Can't do that to higher auth!");
               return;
            }
            if(sys.dbIp(commandData) != undefined) {
                ip = sys.dbIp(commandData)
                if (mbans.get(ip)) {
                    sendChanMessage(src, "+MafiaBot: He/she's already banned from Mafia.");
                    return;
                }
                sys.sendAll("+MafiaBot: " + commandData + " was banned from Mafia by " + sys.name(src) + "!");
                mbans.add(ip, sys.time());
                return;
            }

            sendChanMessage(src, "+MafiaBot: Couldn't find " + commandData);
            return;
        }

        if (SESSION.users(tar).mban) {
            sendChanMessage(src, "+MafiaBot: He/she's already banned from Mafia.");
            return;
        }
        if (sys.auth(tar) >= sys.auth(src)) {
            sendChanMessage(src, "+MafiaBot: You dont have sufficient auth to Mafia ban " + commandData + ".");
            return;
        }

        sys.sendAll("+MafiaBot: " + commandData + " was banned from Mafia by " + sys.name(src) + "!");
        SESSION.users(tar).mban = true;
        mbans.add(sys.ip(tar), sys.time());
        sys.kick(tar, mafiachan);
        commandData = mafia.correctCase(commandData)
        if (mafia.isInGame(commandData)) {
            mafia.removePlayer(commandData)
            mafia.testWin()
        }
        return;
    }
    if (command == "mafiaunban") {
        if (tar == undefined) {
            if(sys.dbIp(commandData) != undefined) {
                var ip = sys.dbIp(commandData)
                if (mbans.get(ip)) {
                    sys.sendAll("+MafiaBot: " + commandData + " was unbanned from Mafia by " + sys.name(src) + "!");
                    mbans.remove(ip);
                    return;
                }
                sendChanMessage(src, "+MafiaBot: He/she's not banned from Mafia.");
                return;
            }
            return;
        }
        if (!SESSION.users(tar).mban) {
            sendChanMessage(src, "+MafiaBot: He/she's not banned from Mafia.");
            return;
        }
        if(SESSION.users(src).mban && tar==src) {
           sendChanMessage(src, "+MafiaBot: You may not unban yourself from Mafia");
           return;
        }
        sys.sendAll("+MafiaBot: " + commandData + " was unbanned from Mafia by " + sys.name(src) + "!");
        SESSION.users(tar).mban = false;
        mbans.remove(sys.ip(tar));
        return;
    }

    if (command == "impoff") {
        delete SESSION.users(src).impersonation;
        sendChanMessage(src, "+Bot: Now you are yourself!");
        return;
    }
    if (command == "k") {
        if (tar == undefined) {
            return;
        }
        sys.sendAll("+Bot: " + commandData + " was mysteriously kicked by " + sys.name(src) + "!");
        sys.kick(tar);
        return;
    }

    if (command == "mute") {
        if (tar == undefined) {
            ip = sys.dbIp(commandData);
            var alias=sys.aliases(ip);
            var y=0;
            var z;
            for(var x in alias) {
                z = sys.dbAuth(alias[x])
                if (z > y) {
                    y=z
                }
            }
            if(y>=sys.auth(src)) {
               sendChanMessage(src, "+Bot: Can't do that to higher auth!");
               return;
            }
            if(sys.dbIp(commandData) != undefined) {
                ip = sys.dbIp(commandData)
                if (mutes.get(ip)) {
                    sendChanMessage(src, "+Bot: He/she's already muted.");
                    return;
                }
                sys.sendAll("+Bot: " + commandData + " was muted by " + sys.name(src) + "!");
                mutes.add(ip, sys.time());
                return;
            }

            sendChanMessage(src, "+Bot: Couldn't find " + commandData);
            return;
        }


        if (SESSION.users(sys.id(commandData)).muted==true) {
            sendChanMessage(src, "+Bot: He/she's already muted.");
            return;
        }
        if (sys.auth(tar) >= sys.auth(src)) {
            sendChanMessage(src, "+Bot: You dont have sufficient auth to mute " + commandData + ".");
            return;
        }
        sys.sendAll("+Bot: " + commandData + " was muted by " + sys.name(src) + "!");
        SESSION.users(sys.id(commandData)).muted=true;
        mutes.add(sys.ip(tar), sys.time());
        if (trollchannel !== undefined && sys.channel(trollchannel) !== undefined && !sys.isInChannel(tar, trollchannel) && sys.channelsOfPlayer(tar).length < 7) {
            sys.putInChannel(tar, trollchannel);
        }

        return;
    }
    if (command == "banlist") {
        list=sys.banList();
        list.sort();
        var nbr_banned=5;
        var table='';
        table+='<table border="1" cellpadding="5" cellspacing="0"><tr><td colspan='+nbr_banned+'><center><strong>Banned list</strong></center></td></tr><tr>';
        var j=0;
        for(var i=0;(i<list.length);i++){
            if(typeof(commandData) == 'undefined' || list[i].toLowerCase().indexOf(commandData.toLowerCase()) != -1){
                j++;
                table+='<td>'+list[i]+'</td>';
                if(j == nbr_banned &&  i+1 != list.length){
                    table+='</tr><tr>';
                    j=0
                }
            }
        }
        table+='</tr></table>';
        sys.sendHtmlMessage(src, table.replace('</tr><tr></tr></table>', '</tr></table>'),channel);
        return;

    }
    if (command == "mutelist" || command == "smutelist" || command == "mafiabans") {
        var mh;
        var name;
        if (command == "mutelist") {
            mh = mutes;
            name = "Muted list";
        } else if (command == "smutelist") {
            mh = smutes;
            name = "Secretly muted list";
        } else if (command == "mafiabans") {
            mh = mbans;
            name = "Mafiabans";
        }
        var table = '';
        var width=5;
        var tmp = [];
        table += '<table border="1" cellpadding="5" cellspacing="0"><tr><td colspan="'+width+'"><center><strong>'+name+'</strong></center></td></tr>';
        for (var ip in mh.hash) {
            if(typeof(commandData) == 'undefined' || 
                    commandData.toLowerCase() == ip.substr(0, commandData.length).toLowerCase()) {
                if (command == "smutelist") {
                    // add names to smutelist
                    var values = mh.hash[ip].split("*"); 
                    var name;
                    if (values.length == 2) {
                        name = values[0];
                    } else {
                        var aliases = sys.aliases(ip);
                        if (aliases[0] !== undefined) {
                            name = aliases[0];
                        } else {
                            name = "~Unknown~";
                        }
                    }
                    tmp.push(ip + " (" + name + ")");
                } else {
                    tmp.push(ip);
                }
            }
        }
        tmp.sort();
        var cut;
        while(tmp.length > 0) {
            cut = tmp.splice(0,width);
            while (cut.length < width) 
                cut.push("");
            table += '<tr><td>'+cut.join('</td><td>')+'</td></tr>';
        }
        table += '</table>'
        sys.sendHtmlMessage(src, table, channel);
        return;
    }
    if (command == "rangebans") {
        var table = '';
        table += '<table border="1" cellpadding="5" cellspacing="0"><tr><td colspan="2"><center><strong>Range banned</strong></center></td></tr><tr><th>IP subaddress</th><th>Comment on rangeban</th></tr>';
        for (var subip in rangebans.hash) {
            table += '<tr><td>'+subip+'</td><td>'+rangebans.get(subip)+'</td></tr>';
        }
        table += '</table>'
        sys.sendHtmlMessage(src, table, channel);
        return;
    }
    if (command == "unmute") {
        if (tar == undefined) {
            if(sys.dbIp(commandData) != undefined) {
                if (mutes.get(commandData)) {
                    sys.sendAll("+Bot: IP address " + commandData + " was unmuted by " + sys.name(src) + "!", staffchannel);
                    mutes.remove(commandData);
                    return;
                }
                var ip = sys.dbIp(commandData)
                if (mutes.get(ip)) {
                    sys.sendAll("+Bot: " + commandData + " was unmuted by " + sys.name(src) + "!");
                    mutes.remove(ip);
                    return;
                }
                sendChanMessage(src, "+Bot: He/she's not muted.");
                return;
            }
            return;
        }
        if (SESSION.users(sys.id(commandData)).muted==false) {
            sendChanMessage(src, "+Bot: He/she's not muted.");
            return;
        }
        sys.sendAll("+Bot: " + commandData + " was unmuted by " + sys.name(src) + "!");
        SESSION.users(sys.id(commandData)).muted=false;
        mutes.remove(sys.ip(tar));
        if (trollchannel !== undefined && sys.channel(trollchannel) !== undefined && sys.isInChannel(tar, trollchannel)) {
            sys.kick(tar, trollchannel);
            if (sys.isInChannel(tar, 0) != true) {
                    sys.putInChannel(tar, 0)
            }
        }

        return;
    }
    if (command == "userinfo") {
        if (commandData == undefined) {
            sendChanMessage(src, "+QueryBot: Please provide a username.");
            return;
        }
        var name = commandData;
        var bot = false;
        if (commandData[0] == "~") {
            name = commandData.substring(1);    
            tar = sys.id(name);
            bot = true;
        }
        var lastLogin = sys.dbLastOn(name);
        if (lastLogin === undefined) {
            sendChanMessage(src, "+QueryBot: No such user.");
            return;
        }

        var registered = sys.dbRegistered(name);
        var megauser = (megausers.toLowerCase().indexOf("*" + name.toLowerCase() + "*") != -1);
        var authLevel;
        var ip;
        var online;
        if (tar !== undefined) {
            name = sys.name(tar); // fixes case
            authLevel = sys.auth(tar);
            ip = sys.ip(tar);
            online = true;
        } else { 
            authLevel = sys.dbAuth(name);
            ip = sys.dbIp(name);
            online = false;
        }
        if (bot) {
            var userJson = {'type': 'UserInfo', 'username': name, 'auth': authLevel, 'megauser': megauser, 'ip': ip, 'online': online, 'registered': registered, 'lastlogin': lastLogin };
            sendChanMessage(src, JSON.stringify(userJson));
        } else {
            sendChanMessage(src, "+QueryBot: Username: " + name + " ~ auth: " + authLevel + " ~ megauser: " + megauser + " ~ ip: " + ip + 
                " ~ online: " + (online ? "yes" : "no") + " ~ registered: " + (registered ? "yes" : "no") + " ~ last login: " + lastLogin);
        }

        return;
    }
    if (command == "tempban") {
        var tmp = commandData.split(":");
        if (tmp.length != 2) {
            sendChanMessage(src, "+Bot: Usage /tempban name:minutes.");
            return;
        }
        tar = sys.id(tmp[0]);
        var minutes = parseInt(tmp[1]);
        if (tar === undefined) {
            sendChanMessage(src, "+Bot: Can only tempban online people.");
            return;
        }
        if (typeof minutes != "number" || isNaN(minutes) || minutes < 1 || minutes > 60) {
            sendChanMessage(src, "+Bot: Minutes must be in the interval [1,60].");
            return;
        }
        var ip = sys.ip(tar);
        if (sys.maxAuth(ip)>=sys.auth(src)) {
            sendChanMessage(src, "+Bot: Can't do that to higher auth!");
            return;
        }
        tempBans[ip] = {'auth': sys.name(src), 'time': parseInt(sys.time()) + 60*minutes};
        sys.sendAll("+Bot: " + sys.name(src) + " banned " + sys.name(tar) + " for " + minutes + " minutes!");
        sys.kick(tar);
        return;
    }
    if (command == "tempunban") {
        var ip = sys.dbIp(commandData);
        if (ip === undefined) {
            sendChanMessage(src, "+Bot: No such user!");
            return;
        }
        if (!(ip in tempBans)) {
            sendChanMessage(src, "+Bot: No such user tempbanned!");
            return;
        }
        var now = parseInt(sys.time());
        sys.sendAll("+Bot: " + commandData + " was released from his cell by " + sys.name(src) + " just " + ((tempBans[ip].time - now)/60) + " minutes beforehand!");
        delete tempBans[ip];
        return;
    }
    return "no command";
}
,
adminCommand: function(src, command, commandData, tar) {
    if (command == "memorydump") {
        sendChanMessage(src, sys.memoryDump());
        return;
    }
    if (command == "megauser") {
        if (tar != "undefined") {
            SESSION.users(tar).megauser = true;
            sys.sendAll("+Bot: " + sys.name(tar) + " was megausered.");
            megausers += "*" + sys.name(tar) + "*";
            sys.saveVal("megausers", megausers);
        }
        return;
    }
     if (command == "megauseroff") {
        if (tar != undefined) {
            SESSION.users(tar).megauser = false;
            sys.sendAll("+Bot: " + sys.name(tar) + " was removed megauser.");
            megausers = megausers.split("*" + sys.name(tar) + "*").join("");
            sys.saveVal("megausers", megausers);
        } else {
            sys.sendAll("+Bot: " + commandData + " was removed megauser.");
            megausers = megausers.split("*" + commandData + "*").join("");
            sys.saveVal("megausers", megausers);
        }
        return;
    }
    if (command == "destroychan") {
        var ch = commandData
        var chid = sys.channelId(ch)
        if(sys.existChannel(ch) != true) {
            sendChanMessage(src, "+Bot: No channel exists by this name!");
            return;
        }
        if (chid == 0 || chid == staffchannel ||  chid == tourchannel || (SESSION.channels(chid).perm == true) ) {
            sendChanMessage(src, "+Bot: This channel cannot be destroyed!");
            return;
        }
        var players = sys.playersOfChannel(chid)
        for(x in players) {
            sys.kick(players[x], chid)
            if (sys.isInChannel(players[x], 0) != true) {
                sys.putInChannel(players[x], 0)
            }
        }
        return;
    }
    if (command == "ban") {
        if(sys.dbIp(commandData) == undefined) {
            sendChanMessage(src, "+Bot: No player exists by this name!");
            return;
        }
        if (sys.maxAuth(sys.ip(tar))>=sys.auth(src)) {
           sendChanMessage(src, "+Bot: Can't do that to higher auth!");
           return;
        }

        var ip = sys.dbIp(commandData);
        var alias=sys.aliases(ip)
        var y=0;
        var z;
        for(var x in alias) {
            z = sys.dbAuth(alias[x])
            if (z > y) {
                y=z
            }
        }
        if(y>=sys.auth(src)) {
           sendChanMessage(src, "+Bot: Can't do that to higher auth!");
           return;
        }
        var banlist=sys.banList()
        for(a in banlist) {
            if(sys.dbIp(commandData) == sys.dbIp(banlist[a])) {
                sendChanMessage(src, "+Bot: He/she's already banned!");
                return;
            }
        }

        sys.sendHtmlAll('<b><font color=red>' + commandData + ' was banned by ' + sys.name(src) + '!</font></b>');
        if(tar != undefined) {
            sys.kick(tar)
        }
        sys.ban(commandData)
        sys.appendToFile('bans.txt', sys.name(src) + ' banned ' + commandData + "n")
        return;
    }
    if (command == "unban") {
        if(sys.dbIp(commandData) == undefined) {
            sendChanMessage(src, "+Bot: No player exists by this name!");
            return;
        }
        var banlist=sys.banList()
        for(a in banlist) {
            if(sys.dbIp(commandData) == sys.dbIp(banlist[a])) {
                sys.unban(commandData)
                sendChanMessage(src, "+Bot: You unbanned " + commandData + "!");
                sys.appendToFile('bans.txt', sys.name(src) + ' unbanned ' + commandData + "n")
                return;
            }
        }
        sendChanMessage(src, "+Bot: He/she's not banned!");
        return;
    }

    if (command == "aliases") {
        sendChanMessage(src, "+IpBot: The aliases for the IP " + commandData + " are: " + sys.aliases(commandData) + ".");
        return;
    }
    if (command == "smute") {
        if (tar == undefined) {
            ip = sys.dbIp(commandData);
            var alias=sys.aliases(ip);
            var y=0;
            var z;
            for(var x in alias) {
                z = sys.dbAuth(alias[x])
                if (z > y) {
                    y=z
                }
            }
            if(y>=sys.auth(src)) {
               sendChanMessage(src, "+Bot: Can't do that to higher auth!");
               return;
            }
            if(sys.dbIp(commandData) != undefined) {
                ip = sys.dbIp(commandData)
                if (smutes.get(ip)) {
                    sendChanMessage(src, "+Bot: He/she's already secretly muted.");
                    return;
                }
                sys.sendAll("+Bot: " + commandData + " was secrectly muted by " + sys.name(src) + "!", staffchannel);
                smutes.add(ip, commandData + "*" + sys.time());
                return;
            }

            sendChanMessage(src, "+Bot: Couldn't find " + commandData);
            return;
        }


        if (SESSION.users(sys.id(commandData)).smuted==true) {
            sendChanMessage(src, "+Bot: He/she's already secretly muted.");
            return;
        }
        if (sys.auth(tar) >= sys.auth(src)) {
            sendChanMessage(src, "+Bot: You dont have sufficient auth to smute " + commandData + ".");
            return;
        }
        sys.sendAll("+Bot: " + commandData + " was secretly muted by " + sys.name(src) + "!", staffchannel);
        SESSION.users(sys.id(commandData)).smuted=true;
        smutes.add(sys.ip(tar), commandData + "*" + sys.time());

        return;
    }
    if (command == "sunmute") {
        if (tar == undefined) {
            if(sys.dbIp(commandData) != undefined) {
                if (smutes.get(commandData)) {
                    sys.sendAll("+Bot: IP address " + commandData + " was secrectly unmuted by " + sys.name(src) + "!", staffchannel);
                    smutes.remove(commandData);
                    return;
                }
                var ip = sys.dbIp(commandData)
                if (smutes.get(ip)) {
                    sys.sendAll("+Bot: " + commandData + " was secrectly unmuted by " + sys.name(src) + "!", staffchannel);
                    smutes.remove(ip);
                    return;
                }
                sendChanMessage(src, "+Bot: He/she's not secretly muted.");
                return;
            }
            return;
        }
        if (SESSION.users(sys.id(commandData)).smuted==false) {
            sendChanMessage(src, "+Bot: He/she's not secretly muted.");
            return;
        }
        sys.sendAll("+Bot: " + commandData + " was secretly unmuted by " + sys.name(src) + "!", staffchannel);
        SESSION.users(sys.id(commandData)).smuted=false;
        smutes.remove(sys.ip(tar));

        return;
    }
    if (command == "channelusers") {
        if (commandData === undefined) {
            sendChanMessage(src, "+Bot: Please give me a channelname!");
            return;
        }
        var chanid;
        var bot;
        if (commandData[0] == "~") {
            chanid = sys.channelId(commandData.substring(1));
            bot = true;
        } else {
            chanid = sys.channelId(commandData);
            bot = false;
        }
        if (chanid === undefined) {
            sendChanMessage(src, "+ChannelBot: Such a channel doesn't exist!");
            return;
        }
        var chanName = sys.channel(chanid);
        var players = sys.playersOfChannel(chanid);
        var objectList = [];
        var names = [];
        for (var i = 0; i < players.length; ++i) {
            var name = sys.name(players[i]);
            if (bot)
                objectList.push({'id': players[i], 'name': name});
            else 
                names.push(name);
        }
        if (bot) {
            var channelData = {'type': 'ChannelUsers', 'channel-id': chanid, 'channel-name': chanName, 'players': objectList};
            sendChanMessage(src, JSON.stringify(channelData));
        } else {
            sendChanMessage(src, "+ChannelBot: Users of channel #" + chanName + " are: " + names.join(", "));
        }
        return;
    }
    if (cmp(sys.name(src),"Lamperi") && command == "updatetiers" || command == "updatescripts") {
       return this.ownerCommand(src, command, commandData, tar);
    }
    
    return "no command";
}
,
ownerCommand: function(src, command, commandData, tar) {
    if (command == "changerating") {
        var data =  commandData.split(' -- ');
        if (data.length != 3) {
            sendChanMessage(src, "+Bot: You need to give 3 parameters.");
            return;
        }
        var player = data[0];
        var tier = data[1];
        var rating = parseInt(data[2]);

        sys.changeRating(player, tier, rating);
        sendChanMessage(src, "+Bot: Rating of " + player + " in tier " + tier + " was changed to " + rating);
        return;
    }
    if (command == "showteam") {
        sendChanMessage(src, "");
        for (var i = 0; i < 6; i+=1) {sendChanMessage(src, sys.pokemon(sys.teamPoke(tar, i)) + " @ " + sys.item(sys.teamPokeItem(tar, i)));
        for (var j = 0; j < 4; j++) {sendChanMessage(src, '- ' + sys.move(sys.teamPokeMove(tar, i, j)));}}
        sendChanMessage(src, "");
        return;
    }
    if (command == "rangeban") {
        var subip;
        var comment;
        var space = commandData.indexOf(' ');
        if (space != -1) {
            subip = commandData.substring(0,space);
            comment = commandData.substring(space+1);
        } else {
            subip = commandData;
            comment = '';
        }
        /* check ip */
        var i = 0;
        var nums = 0;
        var dots = 0;
        var correct = true;
        while (i < subip.length) {
            var c = subip[i];
            if (c == '.' && nums > 0 && dots < 3) {
                nums = 0;
                ++dots;
                ++i;
            } else if (c == '.' && nums == 0) {
                correct = false;
                break;
            } else if (/^[0-9]$/.test(c) && nums < 3) {
                ++nums;
                ++i;
            } else {
                correct = false;
                break;
            }
        }
        if (!correct) {
            sendChanMessage(src, "+Bot: The IP address looks strange, you might want to correct it: " + subip);
            return;
        }

        /* add rangeban */
        rangebans.add(subip, rangebans.escapeValue(comment));
        sendChanMessage(src, "+Bot: Rangeban added successfully for IP subrange: " + subip);
        return;
    }
    if (command == "rangeunban") {
        var subip = commandData;
        if (rangebans.get(subip) !== undefined) {
            rangebans.remove(subip);
            sendChanMessage(src, "+Bot: Rangeban removed successfully for IP subrange: " + subip);
        } else {
            sendChanMessage(src, "+Bot: No such rangeban.");
        }
        return;
    }
    if (command == "purgemutes") {
        var time = parseInt(commandData);
        if (isNaN(time)) {
            time = 60*60*24*7*4;
        }
        var limit = sys.time() - time;
        var removed = [];
        mutes.removeIf(function(memoryhash, item) {
            if(memoryhash.get(item) < limit) {
                removed.push(item);
                return true;
            }
            return false;
        });
        if (removed.length > 0) {
            sendChanMessage(src, "+Bot: " + removed.length + " mutes purged successfully.");
        } else {
            sendChanMessage(src, "+Bot: No mutes were purged.");
        }
        return;
    }
    if (command == "purgembans") {
        var time = parseInt(commandData);
        if (isNaN(time)) {
            time = 60*60*24*7;
        }
        var limit = sys.time() - time;
        var removed = [];
        mbans.removeIf(function(memoryhash, item) {
            if(memoryhash.get(item) < limit) {
                removed.push(item);
                return true;
            }
            return false;
        });
        if (removed.length > 0) {
            sendChanMessage(src, "+Bot: " + removed.length + " mafiabans purged successfully.");
        } else {
            sendChanMessage(src, "+Bot: No mafiabans were purged.");
        }
        return;
    }
    if (command == "sendall") {
        sendChanAll(commandData);
        return;
    }
    if (command == "imp") {
        SESSION.users(src).impersonation = commandData;
        sendChanMessage(src, "+Bot: Now you are " + SESSION.users(src).impersonation + "!");
        return;
    }
    if (command == "changeauth") {
        var pos = commandData.indexOf(' ');
        if (pos == -1) {
            return;
        }
		
        var newauth = commandData.substring(0, pos);
        var tar = sys.id(commandData.substr(pos+1));
		if(newauth>0 && sys.dbRegistered(sys.name(tar))==false){
			sys.sendMessage(src, "+Bot: This person is not registered")
			sys.sendMessage(tar, "+Bot: Please register")
			return;
		}
        sys.changeAuth(tar, newauth);
        sys.sendAll("+Bot: " + sys.name(src) + " changed auth of " + sys.name(tar) + " to " + newauth);
        return;
    }
    if (command == "variablereset") {
        delete VarsCreated
        this.init()
        return;
    }
    if (command == "writebattlestats") {
        sys.writeToFile('battlestats.json', JSON.stringify(battlestats.stats));
        battlestats.count = 0;
        sendChanMessage(src, '+Bot: Stats were written to battlestats.json');
        return;
    }
    if (command == "reloadbattlestats") {
        var backup = battlestats;
        battlestats = {'stats': [], 'battles': {}, 'count': 0};
        try {
            battlestats.stats = JSON.parse(sys.getFileContent('battlestats.json'));
            sendChanMessage(src, '+Bot: Stats were reloaded from battlestats.json');
        } catch (err) {
            battlestats = backup;
            sendChanMessage(src, '+Bot: Stats couldn\'t be reloaded from attlestats.json');
            print('Could not reload battlestats, restoring old stats.');
            print('Error: ' + err);
        }
        return;
    }
    if (command == "writetourstats") {
        var jsonObject = {}; 
        jsonObject.tourwinners = tourwinners
        jsonObject.tourstats = tourstats
        jsonObject.tourrankingsbytier = tourrankingsbytier
        sys.writeToFile('tourstats.json', JSON.stringify(jsonObject));
        sendChanMessage(src, '+Bot: Tournament stats were saved!');
        return;
    }
    if (command == "reloadtourstats") {
        try {
            var jsonObject = JSON.parse(sys.getFileContent('tourstats.json'));
            tourwinners = jsonObject.tourwinners;
            tourstats = jsonObject.tourstats;
            tourrankingsbytier = jsonObject.tourrankingsbytier;
            sendChanMessage(src, '+Bot: Tournament stats were reloaded!');
        } catch (err) {
            sendChanMessage(src, '+Bot: Reloading tournament stats failed!');
            print('Could not read tourstats, initing to null stats.');
            print('Error: ' + err);
        }
        return;
    }
    if (command == "resettourstats") {
        tourwinners = [];
        tourstats = {};
        tourrankings = {};
        tourrankingsbytier = {};
        sys.sendAll('+Bot: Tournament winners were cleared!'); 
        return;
    }
    if (command == "eval" && (sys.ip(src) == sys.dbIp("coyotte508") || sys.name(src).toLowerCase() == "crystal moogle" || sys.name(src).toLowerCase() == "darkness" || sys.name(src).toLowerCase() == "lamperi")) {
        sys.eval(commandData);
        return;
    }
    if (command == "indigo") {
        if (commandData == "on") {
            if (sys.existChannel("Indigo Plateau")) {
                staffchannel = sys.channelId("Indigo Plateau");
            } else {
                staffchannel = sys.createChannel("Indigo Plateau");
            }
            SESSION.channels(staffchannel).topic = "Welcome to the Staff Channel! Discuss of all what users shouldn't hear here! Or more serious stuff...";
            SESSION.channels(staffchannel).perm = true;
            sys.sendMessage(src, "+Bot: Staff channel was remade!")
            return;
            }
        if (commandData == "off") {
            SESSION.channels(staffchannel).perm = false;
            players = sys.playersOfChannel(staffchannel)
            for(x in players) {
                sys.kick(players[x], staffchannel)
                if (sys.isInChannel(players[x], 0) != true) {
                    sys.putInChannel(players[x], 0)
                }
            }
            sys.sendMessage(src, "+Bot: Staff channel was destroyed!")
            return;
        }
    }
    if (command == "stopbattles") {
        battlesStopped = !battlesStopped;
        if (battlesStopped)  {
            sys.sendAll("");
            sys.sendAll("*** ********************************************************************** ***");
            sys.sendAll("+BattleBot: The battles are now stopped. The server will restart soon.");
            sys.sendAll("*** ********************************************************************** ***");
            sys.sendAll("");
        } else {
            sys.sendAll("+BattleBot: False alarm, battles may continue.");
        }
        return;
    }
    if (command == "clearpass") {
        var mod = sys.name(src);
        sys.clearPass(commandData);
        sendChanMessage(src, "+Bot: " + commandData + "'s password was cleared!");
        sys.sendMessage(tar, "+Bot: Your password was cleared by " + mod + "!");
        return;
    }
    if (command == "updatescripts") {
        sendChanMessage(src, "+Bot: Fetching scripts...");
        var updateURL = "http://www.pokemonbattle.it/scripts.js";
        if (commandData !== undefined && commandData.substring(0,7) == 'http://') {
            updateURL = commandData;
        }
        sendChanMessage(src, "+Bot: Fetching scripts from " + updateURL);
        sys.webCall(updateURL, "try { sys.changeScript(resp); sys.writeToFile('scripts.js', resp); } catch (err) { sys.sendAll('+Bot: reloading old scripts'); sys.changeScript(sys.getFileContent('scripts.js')); sys.sendAll('+Bot: Updating failed, loaded old scripts!'); }");
        return;
    }
    if (command == "updatetiers") {
        sendChanMessage(src, "+Bot: Fetching tiers...");
        var updateURL = "http://www.pokemonbattle.it/tiers.xml";
        if (commandData !== undefined && commandData.substring(0,7) == 'http://') {
            updateURL = commandData;
        }
        sendChanMessage(src, "+Bot: Fetching tiers from " + updateURL);
        sys.webCall(updateURL, "sys.writeToFile('tiers.xml', resp); sys.reloadTiers();");
        return;
    }
    return "no command";
}
,
channelCommand: function(src, command, commandData, tar) {
    if (command == "ck" || command == "channelkick") {
        if (tar == undefined) {
            sendChanMessage(src, "+Bot: Choose a valid target for your wrath!");
            return;
        }
        sendChanAll("+Bot: " + sys.name(src) + " kicked " + commandData + " from this channel.");
        sys.kick(tar, channel);
        return;
    }
    if (command == "inviteonly") {
        var level = sys.auth(src);
        if (commandData == "on") {
            SESSION.channels(channel).inviteonly = level;
            sendChanAll("+Bot: This channel was made inviteonly with auth level " + level + ".");
        } else if (commandData == "off") {
            SESSION.channels(channel).inviteonly = 0;
            sendChanAll("+Bot: This channel is not inviteonly anymore.");
        } else {
            if (SESSION.channels(channel).inviteonly) {
                sendChanMessage(src, "+Bot: This channel is inviteonly with auth level " + level + ".");
            } else {
                sendChanMessage(src, "+Bot: This channel is not inviteonly.");
            }
        }
        return;
    }
    if (command == "invite") {
        if (tar === undefined) {
            sendChanMessage(src, "+Bot: Choose a valid target for invite!");
            return;
        }
        if (sys.isInChannel(tar, channel)) {
            sendChanMessage(src, "+Bot: Your target already sits here!");
            return;
        }
        sys.sendMessage(tar, "+Bot: " + sys.name(src) + " would like you to join #" + sys.channel(channel) + "!"); 
        if (SESSION.channels(channel).inviteonly) {
            SESSION.channels(channel).invitelist.push(tar);
            if (SESSION.channels(channel).invitelist.length > 5) {
                SESSION.channels(channel).pop();
                sendChanMessage(src, "+Bot: Your target was invited, but the invitelist was truncated to 5 players.");
                return;
            }
        }
        sendChanMessage(src, "+Bot: Your target was invited.");
        return;
    }
    return "no command";
}
,
beforeChatMessage: function(src, message, chan) {
    channel = chan;
    if (message.length > 350 && sys.auth(src) < 2) {
        sys.stopEvent();
        return;
    }

    // can be removed later
    if (channel == 0 && sys.auth(src) == 0 && message.indexOf("http://www.naked-lindsey.com") > -1) {
        sys.sendAll('+NakedLindsey: ' + sys.name(src) + ' tried to post the link in Tohjo, kicked' ,staffchannel);
        sys.stopEvent();
        sendChanMessage(src, "+Bot: You are kicked for trying to post that link.");
        sys.kick(src);
        return;
    }

    // spamming bots, linking virus sites, also TOM JANE
    // using lazy points system for minimizing false positives
    if (sys.auth(src) == 0 && message.indexOf("http://") > -1) { 
        var points = 0;
        var name = sys.name(src).toLowerCase();
        points += sys.name(src) == sys.name(src).toUpperCase() ? 10 : 0;
        points += name.indexOf("bot") > -1 ? 1 : 0;
        points += name.indexOf("smogon") > -1 ? 1 : 0;
        points += name.indexOf("update") > -1 ? 1 : 0;
        points += message.indexOf("bit.ly") > -1 ? 1 : 0;
        points += message.indexOf("free") > -1 ? 1 : 0;
        points += message.indexOf("please") > -1 ? 1 : 0;
        if (points >= 3) {
            sys.sendAll('+Bot: Spammer: "' + sys.name(src) + '", ip:' + sys.ip(src) + ', message: "' + message + '". Banned.', staffchannel);
            sys.ban(sys.name(src))
            sys.kick(src);
            sys.stopEvent();
            return; 
        }
    }

    if (sys.auth(src) < 3 && SESSION.users(src).muted === true && message != "!join" && message != "/rules" && message != "/join" && message != "!rules" && channel != trollchannel) {
        sendChanMessage(src, "+Bot: You are muted");
        sys.stopEvent();
        return;
    }

    // text reversing symbols
    // \u0458 = "j"
    if (/[\u0458\u0489\u036F]/.test(message)) {
        sys.stopEvent();
        return;
    }

    if ((message[0] == '/' || message[0] == '!') && message.length > 1) {
        if (parseInt(sys.time()) - lastMemUpdate > 500) {
            sys.clearChat();
            lastMemUpdate = parseInt(sys.time());
        }

        sys.stopEvent();

        /*if (channel == mafiachan && !SESSION.users(src).muted) {
            try {
                mafia.handleCommand(src, message.substr(1));
                return;
            } catch (err) {
                if (err != "no valid command")
                    return;
            }
        }*/

        if (!SESSION.users(src).muted) {
            try {
               suspectVoting.handleCommand(src, message.substr(1));
               return;
            } catch (err) {
                if (err != "no valid command")
                    return;
            }
        }


        var command;
        var commandData = undefined;
        var pos = message.indexOf(' ');

        if (pos != -1) {
            command = message.substring(1, pos).toLowerCase();
            commandData = message.substr(pos+1);
        } else {
            command = message.substr(1).toLowerCase();
        }
        var tar = sys.id(commandData);

        if (this.userCommand(src, command, commandData, tar) != "no command") {
            return;
        }
        
        if (SESSION.users(src).megauser == true || sys.auth(src) > 0) {
            if (this.megauserCommand(src, command, commandData, tar) != "no command") {
                return;
            }
        }
        
        if (sys.auth(src) > 0) {
            if (this.modCommand(src, command, commandData, tar) != "no command") {
                return;
            }
        }
        
        if (sys.auth(src) > 1) {
            if (this.adminCommand(src, command, commandData, tar) != "no command") {
                return;
            }
        }
        
        if (sys.auth(src) > 2) {
            if (this.ownerCommand(src, command, commandData, tar) != "no command") {
                return;
            }
        }
        
        if (isChannelMaster(src)) {
            if (this.channelCommand(src, command, commandData, tar) != "no command") {
                return;
            }
        }

        sendChanMessage(src, "+CommandBot: The command " + command + " doesn't exist");
        return;
    } /* end of commands */

    /*if (channel == mafiachan && mafia.ticks > 0 && mafia.state!="blank" && !mafia.isInGame(sys.name(src)) && sys.auth(src) <= 0) {
        sys.stopEvent();
        sys.sendMessage(src, "±Game: You're not playing, so shush! Go in another channel to talk!", mafiachan);
        return;
    }*/
    if (typeof SESSION.users(src).impersonation != 'undefined') {
        sys.stopEvent();
        sendChanAll(SESSION.users(src).impersonation + ": " + message);
        return;
    }
    if (sys.auth(src) == 0 && ((muteall && channel != staffchannel && channel != mafiachan)
        || SESSION.channels(channel).muteall)) {
        sendChanMessage(src, "+Bot: Respect the minutes of silence!");
        sys.stopEvent();
        return;
    }
    var m = message.toLowerCase();

    if (m.indexOf("nimp.org") != -1 ||m.indexOf("drogendealer") != -1 ||m.indexOf('u0E49') != -1 ||m.indexOf("nigger") != -1 || m.indexOf('u202E') != -1 || m.indexOf("penis") != -1 ||  m.indexOf("vagina")  != -1 || m.indexOf("fuckface") != -1 || m == "hurr" || /\bdurr/i.test(m) || m.indexOf("hurrdurr") != -1 || m.indexOf("herp") != -1 || /\bderp/i.test(m)) {
        sys.sendMessage(src, sys.name(src)+": " + message, channel);
        sys.stopEvent();
        return;
    }
    if (sys.auth(src) == 0 && SESSION.users(src).smuted === true) {
        sendChanMessage(src, sys.name(src)+": "+message, true);
        sys.stopEvent();
        this.afterChatMessage(src, '/'+command+ ' '+commandData);
        return;
    }
} /* end of beforeChatMessage, also 1100+ lines ._. */

,

afterChatMessage : function(src, message, chan)
{
    channel = chan;
    lineCount+=1;

    if (this.isMCaps(message) && channel != staffchannel) {
        SESSION.users(src).caps += 3;
        if (SESSION.users(src).caps >= 9 && !SESSION.users(src).muted) {
            if (SESSION.users(src).smuted) {
                sys.sendMessage(src, "+MuteBot: " + sys.name(src) + " was muted for caps.");
                sys.sendAll("+MuteBot: " + sys.name(src) + " was muted for caps while smuted.", staffchannel);
            } else {
                sendChanAll("+MuteBot: " + sys.name(src) + " was muted for caps.");
            }
            SESSION.users(src).muted=true;
            if (trollchannel !== undefined && sys.channel(trollchannel) !== undefined && !sys.isInChannel(src, trollchannel) && sys.channelsOfPlayer(src).length < 7) {
                sys.putInChannel(src, trollchannel);
            }
            return;
        }
    } else if (SESSION.users(src).caps > 0) {
        SESSION.users(src).caps -= 1;
    }

    if (typeof(SESSION.users(src).timecount) == "undefined") {
        SESSION.users(src).timecount = parseInt(sys.time());
    }

    if (channel != staffchannel) {
        SESSION.users(src).floodcount += 1;
        var time = parseInt(sys.time());
        if (time > SESSION.users(src).timecount + 7) {
            var dec = Math.floor((time - SESSION.users(src).timecount)/7);
            SESSION.users(src).floodcount = SESSION.users(src).floodcount - dec;
            if (SESSION.users(src).floodcount <= 0) {
                SESSION.users(src).floodcount = 1;
            }
            SESSION.users(src).timecount += dec*7;
        }
        if (SESSION.users(src).floodcount > 7) {
            if (SESSION.users(src).smuted) {
                sys.sendMessage(src, "+KickBot: " + sys.name(src) + " was kicked for flood.");
                sys.sendAll("+KickBot: " + sys.name(src) + " was kicked for flood while smuted.", staffchannel);
            } 
            
            sys.kick(src);
            return;
        }
    }
} /* end of afterChatMessage */

,

/* Tournament script */
tourSpots : function() {
    return tournumber - tourmembers.length;
}
,

roundPairing : function() {
    roundnumber += 1;

    battlesStarted = [];
    tourbattlers = [];
    battlesLost = [];

    if (tourmembers.length == 1) {
        var chans = [0, tourchannel];

        for (x in chans) {
            var tchan = chans[x];
            sys.sendAll("", tchan);
            sys.sendAll(border, tchan);
            sys.sendAll("", tchan);
            sys.sendAll("THE WINNER OF THE " + tourtier.toUpperCase() + " TOURNAMENT IS : " + tourplayers[tourmembers[0]], tchan);
            sys.sendAll("", tchan);
            sys.sendAll("*** Congratulations, " + tourplayers[tourmembers[0]] + ", on your success! ***", tchan);
            sys.sendAll("", tchan);
            sys.sendAll(border, tchan);
            sys.sendAll("", tchan);
        }
        tourmode = 0;

        // tier, time, number of participants, winner
        var tier = tourtier;
        var time = sys.time();
        var winner = tourplayers[tourmembers[0]];
        var num = tournumber;
        this.updateTourStats(tier, time, winner, num);
        return;
    }

    var finals = tourmembers.length == 2;

    if (!finals) {
        sys.sendAll("*** Round " + roundnumber + " of " + tourtier + " tournament ***", tourchannel);
    }
    else {
        sys.sendAll("*** FINALS OF " + tourtier.toUpperCase() + " TOURNAMENT ***", tourchannel);
        sys.sendAll("*** FINALS OF " + tourtier.toUpperCase() + " TOURNAMENT ***", 0);
    }

    var i = 0;
    while (tourmembers.length >= 2) {
        i += 1;
        var x1 = sys.rand(0, tourmembers.length);
        tourbattlers.push(tourmembers[x1]);
        var name1 = tourplayers[tourmembers[x1]];
        tourmembers.splice(x1,1);


        x1 = sys.rand(0, tourmembers.length);
        tourbattlers.push(tourmembers[x1]);
        var name2 = tourplayers[tourmembers[x1]];
        tourmembers.splice(x1,1);

        battlesStarted.push(false);

        if (!finals)
            sys.sendAll (i + "." + this.padd(name1) + " VS " + name2, turchannel);
        else {
            sys.sendAll ("  " + this.padd(name1) + " VS " + name2, 0);
        }
    }

    if (tourmembers.length > 0) {
        sys.sendAll ("", tourchannel);
        sys.sendAll ("*** " + tourplayers[tourmembers[0]] + " is randomly selected to go to next round!", tourchannel);
    }


} /* end of roundPairing */

,

updateTourStats : function(tier, time, winner, num, purgeTime) {
    var numToPoints = function() {
        // First index: points for 1-7 players,
        // Second index: points for 8-15 players,
        // Third index: points for 16-31 players,
        // Fourth index: points for 32-63 players,
        // Fifth index: points for 64+ players
        var pointsDistributions = {
            "1v1 Challenge Cup": [0, 0, 0, 0, 1],
            "Challenge Cup": [0, 0, 0, 1, 2],
            "1v1 Gen 5": [0, 0, 0, 0, 1],
            "Metronome": [0, 0, 0, 0, 0],
            "Monotype": [0, 0, 1, 2, 3],
            "default": [0, 1, 2, 4, 6],
        }
        var d = pointsDistributions[tier in pointsDistributions ? tier : "default"];
        if (num < 8) return d[0];
        else if (8 <= num && num < 16) return d[1];
        else if (16 <= num && num < 32) return d[2];
        else if (32 <= num && num < 64) return d[3];
        else return d[4];
    };
    var isEmptyObject = function(o) {
        for (var k in o) {
            if (o.hasOwnProperty(k)) {
                return false;
            }
        }
        return true;
    };
    var points = numToPoints();
    if (purgeTime === undefined)
        purgeTime = 60*60*24*31; // 31 days
    time = parseInt(time); // in case time is date or string
    winner = winner.toLowerCase();
    tourwinners.push([tier, time, num, winner]);
    if (points > 0) {
        
        if (tourstats[winner] === undefined) {
            tourstats[winner] = {'points': 0, 'details': []};
        }
        tourstats[winner].points += points;
        tourstats[winner].details.push([tier, time, num]);
    
        if (tourrankingsbytier[tier] === undefined) {
            tourrankingsbytier[tier] = {};
        }
        if (tourrankingsbytier[tier][winner] === undefined) {
            tourrankingsbytier[tier][winner] = 0;
        }
        tourrankingsbytier[tier][winner] += points;

        var jsonObject = {}; 
        jsonObject.tourwinners = tourwinners
        jsonObject.tourstats = tourstats
        jsonObject.tourrankingsbytier = tourrankingsbytier
        sys.writeToFile('tourstats.json', JSON.stringify(jsonObject));
    }

    var player;
    while (tourwinners.length > 0 && (parseInt(tourwinners[0][1]) + purgeTime) < time) {
        tier = tourwinners[0][0];
        points = numToPoints(tourwinners[0][2]); 
        player = tourwinners[0][3];
        tourstats[player].points -= points;
        tourstats[player].details.pop();
        if (tourstats[player].points == 0) {
            delete tourstats[player];
        }
        tourrankingsbytier[tier][player] -= points;
        if (tourrankingsbytier[tier][player] == 0) {
            delete tourrankingsbytier[tier][player];
            if (isEmptyObject(tourrankingsbytier[tier])) {
                delete tourrankingsbytier[tier];
            }
        }
        tourwinners.pop();
    }
}

,

padd : function(name) {
    var ret = name;

    while (ret.length < 20) ret = ' ' + ret;

    return ret;
}
,

isInTourney : function (name) {
    var name2 = name.toLowerCase();
    return name2 in tourplayers;
}

,

tourOpponent : function (nam) {
    var name = nam.toLowerCase();

    var x = tourbattlers.indexOf(name);

    if (x != -1) {
        if (x % 2 == 0) {
            return tourbattlers[x+1];
        } else {
            return tourbattlers[x-1];
        }
    }

    return "";
}

,

areOpponentsForTourBattle : function(src, dest) {
    return this.isInTourney(sys.name(src)) && this.isInTourney(sys.name(dest)) && this.tourOpponent(sys.name(src)) == sys.name(dest).toLowerCase();
}
,

areOpponentsForTourBattle2 : function(src, dest) {
    return this.isInTourney(src) && this.isInTourney(dest) && this.tourOpponent(src) == dest.toLowerCase();
}
,

ongoingTourneyBattle : function (name) {
    return tourbattlers.indexOf(name.toLowerCase()) != -1 && battlesStarted[Math.floor(tourbattlers.indexOf(name.toLowerCase())/2)] == true;
}

,

afterBattleStarted: function(src, dest, clauses, rated, mode, bid) {
    if (tourmode == 2) {
        if (this.areOpponentsForTourBattle(src, dest)) {
            if (sys.tier(src) == sys.tier(dest) && cmp(sys.tier(src), tourtier))
                battlesStarted[Math.floor(tourbattlers.indexOf(sys.name(src).toLowerCase())/2)] = true;
        }
    }
    if (rated) {
        var tier = sys.tier(src);
        battlestats.battles[bid] = [src, sys.ladderRating(src, tier), dest, sys.ladderRating(dest, tier)];
    }
}

,

beforeBattleEnded : function(src, dest, desc, bid) {
    var battle = battlestats.battles[bid];
    if (battle !== undefined && desc != "tie") {
        if (src == battle[0]) {
            battlestats.stats.push([battle[1], battle[3], sys.tier(src), desc, parseInt(sys.time())]);
        } else {
            battlestats.stats.push([battle[3], battle[1], sys.tier(src), desc, parseInt(sys.time())]);
        }
        battlestats.count += 1;
        delete battlestats.battles[bid];
        if (battlestats.count % 500 == 0) {
            sys.writeToFile('battlestats.json', JSON.stringify(battlestats.stats));
        }
    }
}

,

afterBattleEnded : function(src, dest, desc) {
    if (tourmode != 2 ||desc == "tie")
        return;
    this.tourBattleEnd(sys.name(src), sys.name(dest));
}

,

tourBattleEnd : function(src, dest) {
    if (!this.areOpponentsForTourBattle2(src, dest) || !this.ongoingTourneyBattle(src))
        return;
    battlesLost.push(src);
    battlesLost.push(dest);

    var srcL = src.toLowerCase();
    var destL = dest.toLowerCase();

    battlesStarted.splice(Math.floor(tourbattlers.indexOf(srcL)/2), 1);
    tourbattlers.splice(tourbattlers.indexOf(srcL), 1);
    tourbattlers.splice(tourbattlers.indexOf(destL), 1);
    tourmembers.push(srcL);
    delete tourplayers[destL];

    if (tourbattlers.length != 0 || tourmembers.length > 1) {
        sys.sendAll("", tourchannel);
        sys.sendAll(border, tourchannel);
        sys.sendAll("~~Server~~: " + src + " advances to the next round.", tourchannel);
        sys.sendAll("~~Server~~: " + dest + " is out of the tournament.", tourchannel);
    }

    if (tourbattlers.length > 0) {
        sys.sendAll("*** " + tourbattlers.length/2 + " battle(s) remaining.", tourchannel);
        return;
    }

    this.roundPairing();
}

,

isLCaps: function(letter) {
    return letter >= 'A' && letter <= 'Z';
}

,

isMCaps : function(message) {
    var count = 0;

    var i = 0;
    while ( i < message.length ) {
        var c = message[i];

        if (this.isLCaps(c)) {
            count += 1;
            if (count == 5)
                return true;
        } else {
            count -= 2;
            if (count < 0)
                count = 0;
        }
        i += 1;
    }

    return false;
}

,
beforeChangeTier : function(src, oldtier, newtier) {
   if (newtier.toLowerCase() == "monotype"){
       this.monotypecheck(src);
   }
    if (newtier.toLowerCase() == "clear skies"){
       this.weatherlesstiercheck(src);
	   
   }
}
,
beforeChallengeIssued : function (src, dest, clauses, rated, mode) {
    if (battlesStopped) {
        sys.sendMessage(src, "+BattleBot: Battles are now stopped as the server will restart soon.");
        sys.stopEvent();
        return;
    }

    if (SESSION.users(dest).sametier == true && (sys.tier(dest) != sys.tier(src))) {
        sys.sendMessage(src, "+BattleBot: That guy only wants to fight his/her own tier.");
        sys.stopEvent();
        return;
    }

    if ((sys.tier(src) == "Challenge Cup" && sys.tier(dest) == "Challenge Cup" || sys.tier(src) == "1v1 Challenge Cup" && sys.tier(dest) == "1v1 Challenge Cup") && (clauses % 32 < 16)) {
        sys.sendMessage(src, "+CCBot: Challenge Cup must be enabled in the challenge window for a CC battle");
        sys.stopEvent();
        return;
    }

    if (tourmode == 2) {
        var name1 = sys.name(src);
        var name2 = sys.name(dest);

        if (this.isInTourney(name1)) {
            if (this.isInTourney(name2)) {
                if (this.tourOpponent(name1) != name2.toLowerCase()) {
                    sys.sendMessage(src, "+TourneyBot: This guy isn't your opponent in the tourney.");
                    sys.stopEvent();
                    return;
                }
            } else {
                sys.sendMessage(src, "+TourneyBot: This guy isn't your opponent in the tourney.");
                sys.stopEvent();
                return;
            }
            if (sys.tier(src) != sys.tier(dest) || !cmp(sys.tier(src),tourtier)) {
                sys.sendMessage(src, "+TourneyBot: You must be both in the tier " + tourtier+ " to battle in the tourney.");
                sys.stopEvent();
                return;
            }
            if (tourbattlers.length == 2 && clauses % 8 >= 4) {
                sys.sendMessage(src, "+TourneyBot: You must not use \"disallow specs\" in finals.");
                sys.stopEvent();
                return;
            }
        } else {
            if (this.isInTourney(name2)) {
                sys.sendMessage(src, "+TourneyBot: This guy is in the tournament and you are not, so you can't battle him/her.");
                sys.stopEvent();
                return;
            }
        }
    }
    if (sys.tier(src).indexOf("Doubles") != -1 && sys.tier(dest).indexOf("Doubles") != -1 && mode != 1) {
        sys.sendMessage(src, "+Bot: To fight in doubles, enable doubles in the challenge window!");
        sys.stopEvent();
        return;
    }

    if (sys.tier(src).indexOf("Triples") != -1 && sys.tier(dest).indexOf("Triples") != -1 && mode != 2) {
        sys.sendMessage(src, "+Bot: To fight in triples, enable triples in the challenge window!");
        sys.stopEvent();
        return;
    }

    this.eventMovesCheck(src);
    this.eventMovesCheck(dest);

    if (sys.tier(src) == sys.tier(dest)) {
        var tier = sys.tier(src);

        if (tier != "Dream World" && tier != "LC Dream World" && tier != "Monotype" && tier != "Dream World UU"  && tier != "Dream World LU" && tier != "Clear Skies" && tier != "Challenge Cup" && tier != "Uber Triples" && tier != "OU Triples" && tier != "Uber Doubles" && tier != "OU Doubles" && tier != "Shanai Cup") {
            this.dreamWorldAbilitiesCheck(src,true);
            this.dreamWorldAbilitiesCheck(dest,true);
        }
        if (tier == "Dream World" ||tier == "Dream World UU" || tier == "Dream World LU" || tier == "Wifi LU" || tier == "Wifi" || tier == "Wifi UU" || tier == "LC Wifi" || tier == "LC Dream World" || tier == "Wifi Ubers" || tier == "Dream World Ubers" || tier == "Clear Skies"|| tier == "Monotype") {
            this.inconsistentCheck(src, true);
            this.inconsistentCheck(dest, true);
        }
        if (tier == "LC Wifi" || tier == "LC Ubers Wifi") {
            this.littleCupCheck(src, true);
            this.littleCupCheck(dest, true);
        }
        if (tier == "Shanai Cup"){
            this.shanaiAbilityCheck(src, true)
            this.shanaiAbilityCheck(dest, true);
        }
    }
}

,

beforeBattleMatchup : function(src,dest,clauses,rated)
{
    if (battlesStopped) {
        sys.stopEvent();
        return;
    }

    if (tourmode == 2 && (this.isInTourney(sys.name(src)) || this.isInTourney(sys.name(dest)) )) {
        sys.stopEvent();
        return;
    }

    this.eventMovesCheck(src);
    this.eventMovesCheck(dest);

    if (sys.tier(src) == sys.tier(dest)) {
        var tier = sys.tier(src);

        if (tier != "Dream World" && tier != "Dream World Ubers" && tier != "LC Dream World" && tier != "Monotype" && tier != "Dream World UU" && tier != "Dream World LU" && tier != "Clear Skies" && tier != "Challenge Cup" && tier != "Uber Triples" && tier != "OU Triples" && tier != "Uber Doubles" && tier != "OU Doubles" && tier != "Shanai Cup") {
            this.dreamWorldAbilitiesCheck(src,true);
            this.dreamWorldAbilitiesCheck(dest,true);
        }
        if (tier == "Dream World" ||tier == "Dream World UU" ||tier == "Dream World LU" || tier == "Wifi" || tier == "Wifi UU" || tier == "Wifi LU" || tier == "LC Wifi" || tier == "LC Dream World" || tier == "Wifi Ubers" || tier == "Dream World Ubers" || tier == "Clear Skies" || tier == "Monotype") {
            this.inconsistentCheck(src, true);
            this.inconsistentCheck(dest, true);
        }
        if (tier == "LC Wifi" || tier == "LC Ubers Wifi") {
            this.littleCupCheck(src, true);
            this.littleCupCheck(dest, true);
        }
        if (tier == "Shanai Cup"){
            this.shanaiAbilityCheck(src, true)
            this.shanaiAbilityCheck(dest, true);
        }

    }

    // alistart
    if (sys.name(src) == 'Alistair overeeem' || sys.name(src) == 'Alistair overeem'
     || sys.name(dest) == 'Alistair overeeem' || sys.name(dest) == 'Alistair overeem') {
        if (rated) {
        sys.sendAll('*** WARNING ***', staffchannel);
        sys.sendAll('+WarningBot: Alistar overeem started a RATED match!', staffchannel);
        sys.sendAll('*** END OF WARNING ***', staffchannel);
        } else {
            sys.sendAll('+WarningBot: Alistar overeem started a random match!', staffchannel);
        }
    }
}
,

eventMovesCheck : function(src)
{
    for (var i = 0; i < 6; i++) {
        var poke = sys.teamPoke(src, i);
        if (poke in pokeNatures) {
            for (x in pokeNatures[poke]) {
                if (sys.hasTeamPokeMove(src, i, x) && sys.teamPokeNature(src, i) != pokeNatures[poke][x])
                {
                    sys.sendMessage(src, "+CheckBot: " + sys.pokemon(poke) + " with " + sys.move(x) + " must be a " + sys.nature(pokeNatures[poke][x]) + " nature. Change it in the teambuilder.");
                    sys.stopEvent();
                    sys.changePokeNum(src, i, 0);
                }

            }
        }
    }
}
,
littleCupCheck : function(src, se) {
 for (var i = 0; i < 6; i++) {
        var x = sys.teamPoke(src, i);
        if (x != 0 && sys.hasDreamWorldAbility(src, i) && lcpokemons.indexOf(x) != -1 ) {
            if (se) {
                    sys.sendMessage(src, "+CheckBot: " + sys.pokemon(x) + " is not allowed with a Dream World ability in this tier. Change it in the teambuilder.");
                    }

            if (sys.tier(src) == "LC Wifi" && sys.hasLegalTeamForTier(src, "LC Dream World") || sys.tier(src) == "LC Ubers Wifi" && sys.hasLegalTeamForTier(src, "Dream World")) {
                sys.changeTier(src, "LC Dream World");
            }else {
                if (se)
                    sys.changePokeNum(src, i, 0);

            }
            if (se)
                sys.stopEvent();
        }
    }
}
,
dreamWorldAbilitiesCheck : function(src, se) {
    if (sys.gen(src) < 5)
        return;
    for (var i = 0; i < 6; i++) {
        var x = sys.teamPoke(src, i);
        if (x != 0 && sys.hasDreamWorldAbility(src, i) && (!(x in dwpokemons) || (breedingpokemons.indexOf(x) != -1 && sys.compatibleAsDreamWorldEvent(src, i) != true))) {
            if (se) {
                if (!(x in dwpokemons))
                    sys.sendMessage(src, "+CheckBot: " + sys.pokemon(x) + " is not allowed with a Dream World ability in this tier. Change it in the teambuilder.");
                else
                    sys.sendMessage(src, "+CheckBot: " + sys.pokemon(x) + " has to be Male and have no egg moves with its Dream World ability in  " + sys.tier(src) + " tier. Change it in the teambuilder.");
            }
            if (sys.tier(src) == "Wifi" && sys.hasLegalTeamForTier(src, "Dream World")) {
                sys.changeTier(src, "Dream World");
            } else if (sys.tier(src) == "Wifi" && sys.hasLegalTeamForTier(src, "Dream World Ubers")) {
                sys.changeTier(src, "Dream World Ubers");
            } else if (sys.tier(src) == "Wifi Ubers") {
                sys.changeTier(src, "Dream World Ubers");
            }
            else if (sys.tier(src) == "1v1 Gen 5" && sys.hasLegalTeamForTier(src, "Dream World")) {
                sys.changeTier(src, "Dream World");
            }
            else if (sys.tier(src) == "1v1 Gen 5" && sys.hasLegalTeamForTier(src, "Dream World Ubers")) {
                sys.changeTier(src, "Dream World Ubers");
            }
            else if (sys.tier(src) == "Wifi UU" && sys.hasLegalTeamForTier(src, "Dream World UU")) {
                sys.changeTier(src, "Dream World UU");
            } else if (sys.tier(src) == "Wifi LU" && sys.hasLegalTeamForTier(src, "Dream World LU")) {
                sys.changeTier(src, "Dream World LU");
            }
            else if (sys.tier(src) == "LC Wifi" && sys.hasLegalTeamForTier(src, "LC Wifi") || sys.tier(src) == "LC Ubers Wifi" && sys.hasLegalTeamForTier(src, "LC Ubers Wifi")) {
                sys.changeTier(src, "LC Dream World");
            }else {
                if (se)
                    sys.changePokeNum(src, i, 0);

            }
            if (se)
                sys.stopEvent();
        }
    }
}
,

inconsistentCheck : function(src, se) {
    for (var i = 0; i < 6; i++) {
        var x = sys.teamPoke(src, i);

        if (x != 0 && inpokemons.indexOf(x) != -1 && sys.hasDreamWorldAbility(src, i)) {
            if (se)
            
                sys.changeTier(src, "Challenge Cup");
            if (se)
                sys.stopEvent();
        }
    }
}
,
weatherlesstiercheck : function(src) {
    for (var i = 0; i < 6; i++){
        ability = sys.ability(sys.teamPokeAbility(src, i))
        if(ability.toLowerCase() == "drizzle" || ability.toLowerCase() == "drought" || ability.toLowerCase() == "snow warning" || ability.toLowerCase() == "sand stream") {
            sys.sendMessage(src, "+Bot: Your team has a pokémon with the ability: " + ability + ", please remove before entering this tier.");
            if(sys.hasLegalTeamForTier(src, "Dream World")) {
                if(sys.hasLegalTeamForTier(src,"Wifi")) {
                    sys.changeTier(src, "Wifi");
                    sys.stopEvent()
                    return;
                }
                sys.changeTier(src, "Dream World");
                sys.stopEvent()
                return;
            }
            if(sys.hasLegalTeamForTier(src,"Wifi Ubers")) {
                sys.changeTier(src, "Wifi Ubers");
                sys.stopEvent()
                return;
            }
            sys.changeTier(src, "Dream World Ubers");
            sys.stopEvent()
            return;
        }
    }
} /* end of weatherlesstiercheck */
,


// Will escape "&", ">", and "<" symbols for HTML output.
html_escape : function(text)
{
    var m = text.toString();
    if (m.length > 0) {
        var amp = "&am" + "p;";
        var lt = "&l" + "t;";
        var gt = "&g" + "t;";
        return m.replace(/&/g, amp).replace(/\</g, lt).replace(/\>/g, gt);
    }else{
        return "";
    }
}
,
monotypecheck : function(src) {
    var TypeA = sys.pokeType1(sys.teamPoke(src, 0), 5);
    var TypeB = sys.pokeType2(sys.teamPoke(src, 0), 5);
    var k;
    var checkType;
    for (var i = 1; i < 6 ; i++) {
        var temptypeA = sys.pokeType1(sys.teamPoke(src, i), 5);
        var temptypeB = sys.pokeType2(sys.teamPoke(src, i), 5);
        if (sys.teamPoke(src, i) == 0){
            temptypeA = TypeA;
        }
        if(checkType != undefined) {
            k=3;
        }
        if(i==1){
            k=1;
        }
        if(TypeB !=0){
            if(temptypeA == TypeA && temptypeB == TypeB && k == 1 || temptypeA == TypeB && temptypeB == TypeA && k == 1){
                k=2;
            }
        }
        if (temptypeA == TypeA && k == 1 || temptypeB == TypeA && k == 1) {
            checkType=TypeA;
        }
        if (temptypeA == TypeB && k == 1 || temptypeB == TypeB && k == 1) {
            checkType=TypeB;
        }
        if(i>1 && k == 2) {
            k=1;
            if(temptypeA == TypeA && temptypeB == TypeB && k == 1 || temptypeA == TypeB && temptypeB == TypeA && k == 1){
                k=2;
            }
            if (temptypeA == TypeA && k == 1 || temptypeB == TypeA && k == 1) {
                checkType=TypeA;
            }
            if (temptypeA == TypeB && k == 1 || temptypeB == TypeB && k == 1) {
                checkType=TypeB;
            }
        }
        if(k==3){

            if(temptypeA != checkType && temptypeB != checkType) {

                sys.sendMessage(src, "+Bot: Team not Monotype as " + sys.pokemon(sys.teamPoke(src, i)) + " is not " + sys.type(checkType) + "!");
                if(sys.hasLegalTeamForTier(src, "Dream World")) {
                    if(sys.hasLegalTeamForTier(src,"Wifi")) {
                        sys.changeTier(src, "Wifi");
                        sys.stopEvent()
                        return;
                    }
                    sys.changeTier(src, "Dream World");
                    sys.stopEvent()
                    return;
                }
                if(sys.hasLegalTeamForTier(src,"Wifi Ubers")) {
                    sys.changeTier(src, "Wifi Ubers");
                    sys.stopEvent()
                    return;
                }
                sys.changeTier(src, "Dream World Ubers");
                sys.stopEvent()
                return;
            }
        }

        if(k==1) {
            if (temptypeA != TypeA && temptypeB != TypeA && temptypeA != TypeB && temptypeB != TypeB) {
                sys.sendMessage(src, "+Bot: Team not Monotype as " + sys.pokemon(sys.teamPoke(src, i)) + " does not share a type with " + sys.pokemon(sys.teamPoke(src, 0)) + "!")

                if(sys.hasLegalTeamForTier(src, "Dream World")) {
                    if(sys.hasLegalTeamForTier(src,"Wifi")) {
                        sys.changeTier(src, "Wifi");
                        sys.stopEvent()
                        return;
                    }
                    sys.changeTier(src, "Dream World");
                    sys.stopEvent()
                    return;
                }
                if(sys.hasLegalTeamForTier(src,"Wifi Ubers")) {
                    sys.changeTier(src, "Wifi Ubers");
                    sys.stopEvent()
                    return;
                }
                sys.changeTier(src, "Dream World Ubers");
                sys.stopEvent()
                return;
            }

        }
    }
}

,

shanaiAbilityCheck : function(src, se) {
    var bannedAbilities = {
        'treecko': ['overgrow'],
        'chimchar': ['blaze'],
        'totodile': ['torrent'],
        'spearow': ['sniper'],
        'skorupi': ['battle armor', 'sniper'],
        'spoink': ['thick fat'],
        'golett': ['iron fist'],
        'magnemite': ['magnet pull', 'analytic'],
        'electrike': ['static', 'lightningrod'],
        'nosepass': ['sturdy', 'magnet pull'],
        'axew': ['rivalry'],
        'croagunk': ['poison touch', 'dry skin'],
        'cubchoo': ['rattled']
    };
    for (var i = 0; i < 6; ++i) {
        var ability = sys.ability(sys.teamPokeAbility(src, i));
        var lability = ability.toLowerCase();
        var poke = sys.pokemon(sys.teamPoke(src, i));
        var lpoke = poke.toLowerCase();
        //sys.sendMessage(src, "+Bot: you have " + poke + " with " + ability + "." )
        if (lpoke in bannedAbilities && bannedAbilities[lpoke].indexOf(lability) != -1) {
            sys.sendMessage(src, "+Bot: " + poke + " is not allowed to have ability " + ability + " in Shanai Cup. Please change it in Teambuilder (You are now in Challenge Cup).")
            sys.changeTier(src, "Challenge Cup")
            if (se)
                sys.stopEvent();
            return;
        }
    }
}

})