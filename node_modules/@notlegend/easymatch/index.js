/*
    Made with love by NotLegend <3
*/
class Matcher {
    constructor(startChars, endChars){
        this.startChar = startChars;
        this.endChar = endChars;
        this.pattern = new RegExp(`\\${this.startChar}[^\\${this.startChar}\\${this.endChar}]+\\${this.endChar}`,`g`);
    }

    match(string, matched){
        let names = matched.match(this.pattern);
        let objnames = names.map(element => element.replace(this.startChar, "").replace(this.endChar, ""));
        let matchobj = {};
        let pat = matched;

        for(let i=0; i<objnames.length; i++){
            matchobj[objnames[i]] = "";
            pat = pat.replace(names[i], "§Q§")
        }
        pat = pat.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        pat = new RegExp(pat.replace(/§Q§/g, "(.+)"));
        let res = string.match(pat);
        for(let i=0; i<objnames.length; i++){
            matchobj[objnames[i]] = res === null ? null : res[i + 1];
        }
        return matchobj;
    }
}

module.exports = Matcher;