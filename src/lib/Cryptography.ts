/*
     ██████╗██████╗ ██╗   ██╗██████╗ ████████╗ ██████╗  ██████╗ ██████╗  █████╗ ██████╗ ██╗  ██╗██╗   ██╗
    ██╔════╝██╔══██╗╚██╗ ██╔╝██╔══██╗╚══██╔══╝██╔═══██╗██╔════╝ ██╔══██╗██╔══██╗██╔══██╗██║  ██║╚██╗ ██╔╝
    ██║     ██████╔╝ ╚████╔╝ ██████╔╝   ██║   ██║   ██║██║  ███╗██████╔╝███████║██████╔╝███████║ ╚████╔╝
    ██║     ██╔══██╗  ╚██╔╝  ██╔═══╝    ██║   ██║   ██║██║   ██║██╔══██╗██╔══██║██╔═══╝ ██╔══██║  ╚██╔╝
    ╚██████╗██║  ██║   ██║   ██║        ██║   ╚██████╔╝╚██████╔╝██║  ██║██║  ██║██║     ██║  ██║   ██║
     ╚═════╝╚═╝  ╚═╝   ╚═╝   ╚═╝        ╚═╝    ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝   ╚═╝
*/

import { SmartLogger } from './SmartLogger';

export class Cryptography
{
    constructor() { }

    private crypto = require('crypto');
    private request = require('request');
    private fs = require('fs');

    SHA512(message: string): string
    {
        var hash = this.crypto.createHash('sha512');
        var data = hash.update(message, 'utf-8');

        return `${data.digest('hex')}_02xk34`;
    }

    DownloadImage(uri: string, filename: string, callback: Function)
    {
        this.request.head(uri, (err: any, res: any, body: any) =>
        {
            this.request(uri).pipe(this.fs.createWriteStream(filename)).on('close', callback);
        });
    };

    static GetUserData(userid: string): any
    {
        var options =
        {
            hostname: 'discord.com',
            port: 443,
            path: `/api/v9/users/${userid}`,
            method: 'GET',
            headers:
            {
               'Authorization': 'Bot OTE5MzU3NzM3MjU3Nzk1NjQ1.GvWRUV.CaSuK4eMWS8RZfHPcXXamFX9XI822ytnot2POk'
            }
        };

        return new Promise((resolve, reject) =>
        {
            require('https').get(options, (res: any) =>
            {
                if (res.statusCode === 200)
                {
                    res.on('data', (d: any) =>
                    {
                        resolve(d.toString());
                    });

                    res.on('error', (e: any) =>
                    {
                        reject(`0`);
                    });
                }
                else
                {
                    reject(`0`);
                }
            });
        });
    }

    static SecureRequest(url: string, ...args: JSON[]): any
    {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Needed for SSL complications.

        var arr = JSON.parse(JSON.stringify(args[0])); // Idk why it needed all of this.

        var data = JSON.stringify(args);

        var options =
        {
            hostname: '18.116.67.36',
            port: 443, // 443 = Secure, 80 = Non-secure
            path: url,
            method: 'POST',
            headers:
            {
               'Content-Type': 'application/x-www-form-urlencoded',
               'Content-Length': data.length
            }
        };

        return new Promise ((resolve, reject) => {
            var req = require('https').request(options, (res: any) =>
            {
                res.on('data', (d: any) =>
                {
                    resolve(d.toString());
                });

                req.on('error', (e: any) =>
                {
                    reject(`0`);
                });
            });

            req.write(data);
            req.end();
        });
    }
}