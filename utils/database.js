const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("./utils/dataStorage.json");
const chalk = require('chalk');
const db = low(adapter);
const today = new Date();

module.exports = {
    createDatabase() {
        db.defaults({
            users: [],
            questions: [],
            applicants: [],
            temporaryUsers: [],
            prevFtop: [],
            wallChecks: {
                lastWallChecked: today.getTime(),
                wallMinuteUnchecked: "",
            },
            bufferChecks: {
                lastBufferChecked: today.getTime(),
                bufferMinuteUnchecked: "",
            },
            channels: {
                c_serverchat: "",
                c_ftop: "",
                c_flist: "",
                c_wallChecks: "",
                c_bufferChecks: "",
                c_weewoo: "",
                c_bank: "",
                c_iam: "",
                c_away: "",
                c_application:"",
                c_applicationLog: "",
                c_logs: "",
                c_joinLeave: "",
            },
            roles: {
                r_muted: "",
                r_joinrole: "",
                r_recruiter: "",
                r_walls: "",
                r_buffers: "",
                r_weewoo: "",
                r_botdev: "",
            },
            times: {
                t_autoHubCmd: 5,
                t_autoFtop: 30,
                t_autoFlist: 10,
                t_autoWallChecks: 3,
                t_autoBufferChecks: 6,
                t_wallsUncheckedAfter: 5,
                t_buffersUncheckedAfter: 5, 
            },
            modules: {
                b_serverChat: true,
                b_autoFtop: true,
                b_autoFlist: true,
                b_applications: true,
                b_autoHubCmd: true,
                b_shield: true,
            },
            layouts: {
                l_ftop: "[Pos]. [Faction] Total: $[Value]",
                l_flist: "[Faction] [Online]/[Max] online, [Claims]",
            },
            totalUsers: 0,
        }).write();
        console.log(chalk.whiteBright(`${chalk.gray(`[${chalk.blueBright("*")}]`)} Database: Default database has been created.`));
    },
    isInitalized: db.has("totalUsers").value(),
    getChannelID(channelName) {
        return db.get(`channels.${channelName}`).value();
    },
    setChannel(channelName, channelID) {
        db.update(
          `channels.${channelName}`,
          (channel) => (channel = channelID)
        ).write();
    },
    getRole(role) {
        return db.get(`roles.${role}`).value();
    },
    setRole(role, roleID) {
        return db.update(`roles.${role}`, (r) => (r = roleID)).write();
    },
    getLayout(msg) {
        return db.get(`layouts.${msg}`).value();
    },
    setLayout(msg, newMsg) {
        return db.update(`layouts.${msg}`, (m) => (m = newMsg)).write();
    },
    getTime(timeName) {
        return db.get(`times.${timeName}`).value();
    },
    setTime(timeName, time) {
        return db.update(`times.${timeName}`, (t) => (t = time)).write();
    },
    getBoolean(boolean) {
        return db.get(`modules.${boolean}`).value();
    },
    toggleBoolean(boolean, value){
        db.update(`modules.${boolean}`, (n) => (n = !n)).write();
    },
    getCommand(commandName) {
        return db.get(`commands.${commandName}`).value();
    },
    setCommand(commandName, command){
        db.update(`commands.${commandName}`, (c) => (c = command)).write();
    },
    pushFtop(ftopData) {
        db.unset("prevFtop").write();
        db.defaults({ prevFtop: ftopData }).write();
    },
    findFaction(factionName) {
        return db.get("prevFtop").find({ factionName: factionName });
    },
    getAllUsersObject() {
        return db.get("users");
    },
    getAllTempUsersObject(){
        return db.get("temporaryUsers");
    },
    addUser(username, discordID) {
        this.getAllUsersObject()
          .push({
            username: username,
            discordID: discordID,
            userWallChecks: {
              wallChecks: 0,
              bufferChecks: 0,
              lastWallChecked: today.getTime(),
              lastBufferChecked: today.getTime(),
            },
            deposits: 0,
            withdraws: 0,
          })
          .write();
        db.update("totalUsers", (n) => (n += 1)).write();
    },
    isVerified(tag) {
        var found = "";
        this.getDiscordUserObject(tag).value() != undefined
          ? (found = true)
          : (found = false);
        return found;
    },
    getUserObject(username) {
        return this.getAllUsersObject().find({ username: username });
    },
    isUserVerified(username) {
        var username = username;
        var found = "";
        this.getUserObject(username).value() != undefined
          ? (found = true)
          : (found = false);
        return found;
    },
    deleteUser(discordID) {
        this.getAllUsersObject().remove({ discordID: discordID }).write();
        db.update("totalUsers", (n) => (n -= 1));
    },
    deleteUserMc(username){
        this.getAllUsersObject().remove({ username: username }).write();
        db.update("totalUsers", (n) => (n -= 1));
    },
    getDiscordUserObject(discordID) {
        return this.getAllUsersObject().find({ discordID: discordID });
    },
    getUserSize() {
        return db.get("users").size();
    },
    getUserPosition(i) {
        return db.get("users").value()[i]
    },
    findUser(username, discordID){
        var ign = this.getAllUsersObject().find({ username: username }).value();
        var discord = this.getAllUsersObject().find({ discordID: discordID });
        if(ign === undefined || discord === undefined){
            return false;
        }else {
            return true;
        }
    },
    findTempUser(discordID){
        var discord = this.getAllTempUsersObject().find({ discordID: discordID });
        if(discord === undefined){
            return true;
        }else {
            db.get("temporaryUsers").remove({ discordID: discordID }).write();
            return true;
        }
    },
    getDiscordTempUser(ign){
        var user = this.getAllTempUsersObject().find({ ign: ign }).value();
        return user;

    },
    isTempUser(ign){
        var user = this.getAllTempUsersObject().find({ign: ign}).value();
        if(user == undefined){
            return false;
        }else {
            return true
        }
    },
    isGoodCode(token){
        var user = this.getAllTempUsersObject().find({token: token }).value();
        if(user == undefined){
            return false;
        }else {
            return true
        }
    },
    createTempCode(discordID, ign) {
        const code =
      Math.random().toString(36).substr(2) +
      Math.random().toString(36).substr(2);
        db.get("temporaryUsers")
          .push({
            token: code,
            ign: ign,
            discordID: discordID,
          })
          .write();
        return code;
    },
    removeTempCode(token) {
        return this.getAllTempUsersObject().remove({ token: token }).write();
    },
    resetTempUsers() {
        db.unset("temporaryUsers").write();
    
        db.defaults({
          temporaryUsers: [],
        }).write();
    },
    getWallChecksObject() {
        return db.get("wallChecks");
    },
    getBufferChecksObject() {
        return db.get("bufferChecks");
    },
    updateWallChecked(userWallObj, currentTime) {
        const wallCheckObj = this.getWallChecksObject();
        userWallObj.update("wallChecks", (n) => n + 1).write();
        userWallObj.update("lastWallChecked", (n) => (n = currentTime)).write();
        wallCheckObj.update("lastWallChecked", (n) => (n = currentTime)).write();
        wallCheckObj.update("wallMinuteUnchecked", (n) => (n = "")).write();
    },
    updateBufferChecked(userBufferObj, currentTime) {
        const bufferCheckObj = this.getBufferChecksObject();
        userBufferObj.update("bufferChecks", (n) => n + 1).write();
        userBufferObj.update("lastBufferChecked", (n) => (n = currentTime)).write();
        bufferCheckObj.update("lastBufferChecked", (n) => (n = currentTime)).write();
        bufferCheckObj.update("bufferMinuteUnchecked", (n) => (n = "")).write();
    },
    updateLastChecks(currentTime) {
        const wallCheckObj = this.getWallChecksObject();
        const bufferCheckObj = this.getBufferChecksObject();
        wallCheckObj.update("lastWallChecked", (n) => (n = currentTime)).write();
        bufferCheckObj.update("lastBufferChecked", (n) => (n = currentTime)).write();
        wallCheckObj.update("wallMinuteUnchecked", (n) => (n = "")).write();
        bufferCheckObj.update("bufferMinuteUnchecked", (n) => (n = "")).write();
    },
    updateDeposit(username, val) {
        this.getUserObject(username)
          .update("deposits", (oldval) => (oldval += val))
          .write();
        this.getUserObject(username)
          .update("balance", (oldval) => (oldval += val))
          .write();
    },
    updateWithdraw(username, val) {
        this.getUserObject(username)
          .update("withdraws", (oldval) => (oldval += val))
          .write();
        this.getUserObject(username)
          .update("balance", (oldval) => (oldval -= val))
          .write();
    },
    resetDatabase() {
        const newState = {};
        let oldChannels = db.get("channels").value();
        db.setState(newState).write();
        this.createDatabase();
        db.update("channels", (ch) => (ch = oldChannels)).write();
    },
    newQuestions(questions) {
        db.update("questions", (q) => (q = questions)).write();
    },
    getQuestions() {
        return db.get("questions").value();
    },
    editQuestion(id, question) {
        db.get("questions").find({ id: parseInt(id) }).update("question", (q) => (q = question)).write();
    },
    resetQuestions() {
        db.unset("questions").write();
        db.defaults({ questions: [] }).write();
    },
    addApplicant(discordID, messageID) {
        db.get("applicants").push({
            discordID: discordID,
            messageID: messageID,
        }).write();
    },
    areQuestionsSet() {
        const questions = db.get("questions").value();
        return questions.length == 0 ? false : true;
    },
    removeApplicant(discordID) {
        db.get("applicants").remove({discordID: discordID,}).write();
    },
    findApplicant(discordID) {
        return db.get("applicants").find({ discordID: discordID }).value();
    },
    findApplicantM(messageID){
        return db.get("applicants").find({ messageID: messageID }).value();
    },
    findApplicantMsg(messageID){
        var applicant = db.get("applicants").find({ messageID: messageID }).value();
        if(applicant == undefined){
            return false;
        }else {
            return true
        }
    },
    resetChannels() {
        db.update(
          "channels",
          (ch) =>
            (ch = {
                c_serverchat: "",
                c_ftop: "",
                c_flist: "",
                c_wallChecks: "",
                c_bufferChecks: "",
                c_weewoo: "",
                c_bank: "",
                c_iam: "",
                c_away: "",
                c_application:"",
                c_applicationLog: "",
                c_logs: "",
                c_joinLeave: "",
            })
        ).write();
    },
}