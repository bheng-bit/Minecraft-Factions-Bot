
const timeFormat = {
    months: 2592000,
    weeks: 604800,
    days: 86400,
    hours: 3600,
    minutes: 60,
    seconds: 1,
}

const options = {
    getDifference(previousTime, currentTime) {
        var d = Math.abs(currentTime - previousTime) / 1000;
        var r = {};
        Object.keys(timeFormat).forEach(function (key) {
          r[key] = Math.floor(d / timeFormat[key]);
          d -= r[key] * timeFormat[key];
        });
        return r;
    },
    channels: [
        "c_serverchat", 
        "c_ftop", 
        "c_flist", 
        "c_wallChecks", 
        "c_bufferChecks", 
        "c_weewoo", 
        "c_bank", 
        "c_iam", 
        "c_away", 
        "c_application", 
        "c_applicationLog",
        "c_logs", 
        "c_joinLeave"
    ],
    roles: [
        "r_muted",
        "r_joinrole",
        "r_recruiter", 
        "r_walls", 
        "r_buffers", 
        "r_weewoo", 
        "r_botdev",
    ],
    delays: [
        "t_autoHubCmd",
        "t_autoFtop", 
        "t_autoFlist", 
        "t_autoWallChecks", 
        "t_autoBufferChecks", 
        "t_wallsUncheckedAfter", 
        "t_buffersUncheckedAfter",
    ],
    modules: [
        "b_serverChat", 
        "b_autoFtop", 
        "b_autoFlist", 
        "b_autoHubCmd", 
        "b_applications"
    ],
    layouts: [
        "l_ftop",
        "l_flist"
    ],
};

module.exports = {
    options,
};