/*
    ███████╗ ██████╗  ██████╗██╗  ██╗███████╗████████╗███████╗███████╗██████╗ ██╗   ██╗███████╗██████╗
    ██╔════╝██╔═══██╗██╔════╝██║ ██╔╝██╔════╝╚══██╔══╝██╔════╝██╔════╝██╔══██╗██║   ██║██╔════╝██╔══██╗
    ███████╗██║   ██║██║     █████╔╝ █████╗     ██║   ███████╗█████╗  ██████╔╝██║   ██║█████╗  ██████╔╝
    ╚════██║██║   ██║██║     ██╔═██╗ ██╔══╝     ██║   ╚════██║██╔══╝  ██╔══██╗╚██╗ ██╔╝██╔══╝  ██╔══██╗
    ███████║╚██████╔╝╚██████╗██║  ██╗███████╗   ██║   ███████║███████╗██║  ██║ ╚████╔╝ ███████╗██║  ██║
    ╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝   ╚═╝   ╚══════╝╚══════╝╚═╝  ╚═╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝
*/

import { SmartLogger } from './SmartLogger';

const net = require('net');

function IsJSON(str: string)
{
    try
    {
        JSON.parse(str);
    }
    catch (exception)
    {
        return false;
    }

    return true;
}

export class SocketServer
{
    constructor() { }

    private Logger = new SmartLogger();

    private _HasInit = false;
    private _Server = net;
    private _Socket = net;

    // Args[0] = function/callback
    Create(socketn: number, ...args: any[]): boolean
    {
        try
        {
            if (!this._HasInit)
            {
                this._Server = net.createServer( (socket: any) =>
                {
                    this._Socket = socket;

                    socket.on('data', (data: any) =>
                    {
                        if (IsJSON(data))
                        {
                            var json = JSON.parse(data);
                            var message = json.message;
                            var timestamp = json.timestamp;

                            var string =
`------------- PACKET RECIEVED -------------

TIME: ${timestamp}
MSG: ${message}

-------------------------------------------
                            `;

                            console.log(string);
                        }
                        else
                        {
                            this.Logger.createError(`SocketServer recieved incorrect data. (got: "${data.toString()}")`);
                        }

                        //args[0]();
                    });
                }).listen(8989);

                this.Logger.createDebug(`Listening on socket '${socketn}'..`);

                this._HasInit = true;

                return true;
            }
            else
            {
                this.Logger.createAlert(`Pipeline is already running.`);
                return false;
            }
        }
        catch(exception: any)
        {
            this.Logger.createFatal(`SocketServer recieved incorrect data or ran into an exception. (got: "${exception.toString()}")`);
            return false;
        }
    }

    SendMessage(message: string): void
    {
        try
        {
            const packet = JSON.parse(`{ "timestamp": "", "message": "" }`);
            packet.timestamp = new Date().getTime().toString();
            packet.message = message;
            const mes = JSON.stringify(packet);
            this._Socket.write(mes);

            var string =
`--------------- PACKET SENT ---------------

TIME: ${packet.timestamp}
MSG: ${packet.message}

-------------------------------------------
`;

            console.log(string);
        }
        catch(exception: any)
        {
            this.Logger.createFatal(exception.toString());
        }
    }
}