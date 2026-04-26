/*
    ███████╗███╗   ███╗ █████╗ ██████╗ ████████╗██╗      ██████╗  ██████╗  ██████╗ ███████╗██████╗
    ██╔════╝████╗ ████║██╔══██╗██╔══██╗╚══██╔══╝██║     ██╔═══██╗██╔════╝ ██╔════╝ ██╔════╝██╔══██╗
    ███████╗██╔████╔██║███████║██████╔╝   ██║   ██║     ██║   ██║██║  ███╗██║  ███╗█████╗  ██████╔╝
    ╚════██║██║╚██╔╝██║██╔══██║██╔══██╗   ██║   ██║     ██║   ██║██║   ██║██║   ██║██╔══╝  ██╔══██╗
    ███████║██║ ╚═╝ ██║██║  ██║██║  ██║   ██║   ███████╗╚██████╔╝╚██████╔╝╚██████╔╝███████╗██║  ██║
    ╚══════╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝ ╚═════╝  ╚═════╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝
*/



export class SmartLogger
{
    constructor()
    {
        //console.log(__dirname);
    }

    // Console Codes
    private _Reset = "\x1b[0m";
    private _Blink = "\x1b[5m"
    private _Bright = "\x1b[1m";
    private _Red = "\x1b[31m";
    private _Yellow = "\x1b[33m";
    private _Blue = "\x1b[34m";

    // Functions
    createDebug(message: string): void
    {
        var date = new Date(); // Get Date
        var hours = date.getHours(); // Get Hours from 'date'
        var minutes = date.getMinutes(); // Get Minutes from 'date'
        var seconds = date.getSeconds(); // Get Seconds from 'date'

        console.log(`<${this._Bright}${this._Blue}DEBUG${this._Reset}> [${hours.toString()}:${minutes.toString()}:${seconds.toString()}] - ${message}`);
    }

    createAlert(message: string): void
    {
        var date = new Date(); // Get Date
        var hours = date.getHours(); // Get Hours from 'date'
        var minutes = date.getMinutes(); // Get Minutes from 'date'
        var seconds = date.getSeconds(); // Get Seconds from 'date'

        console.log(`<${this._Bright}${this._Yellow}ALERT${this._Reset}> [${hours.toString()}:${minutes.toString()}:${seconds.toString()}] - ${message}`);
    }

    createError(message: string): void
    {
        var date = new Date(); // Get Date
        var hours = date.getHours(); // Get Hours from 'date'
        var minutes = date.getMinutes(); // Get Minutes from 'date'
        var seconds = date.getSeconds(); // Get Seconds from 'date'

        console.log(`<${this._Bright}${this._Red}ERROR${this._Reset}> [${hours.toString()}:${minutes.toString()}:${seconds.toString()}] - ${message}`);
    }

    createFatal(message: string): void
    {
        var date = new Date(); // Get Date
        var hours = date.getHours(); // Get Hours from 'date'
        var minutes = date.getMinutes(); // Get Minutes from 'date'
        var seconds = date.getSeconds(); // Get Seconds from 'date'

        console.log(`<${this._Bright}${this._Blink}${this._Red}FATAL${this._Reset}> [${hours.toString()}:${minutes.toString()}:${seconds.toString()}] - ${this._Red}${message}${this._Reset}`);
    }
}