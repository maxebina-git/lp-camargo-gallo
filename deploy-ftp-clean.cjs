// Remove arquivos remotos obsoletos via FTP.
// O deploy (deploy-ftp.cjs) sobe arquivos, mas nao apaga o que ficou no
// servidor de versoes anteriores. Este script apaga uma lista fixa de
// probes/arquivos que nao devem existir no servidor.
const { Client } = require('@icetee/ftp');
const path = require('path');

const remoteDir = process.argv[2]; // ex: staging/api
const files = process.argv.slice(3); // ex: _itest.php

if (!remoteDir || files.length === 0) {
    console.error('Usage: node deploy-ftp-clean.cjs <remoteDir> <file...>');
    process.exit(1);
}

const client = new Client();
const root = '/public_html/' + remoteDir.replace(/\/+$/, '') + '/';

client.ftp.verbose = false;

async function run() {
    await client.access({
        user: process.env.FTP_USERNAME,
        password: process.env.FTP_PASSWORD,
        host: process.env.FTP_SERVER,
        port: 21,
        secure: false,
    });

    for (const file of files) {
        const target = path.posix.join(root, file);
        try {
            await client.remove(target);
            console.log('removido: ' + target);
        } catch (e) {
            const code = e && e.code;
            if (code === 550) {
                console.log('ja nao existe: ' + target);
            } else {
                console.error('falha ao remover ' + target + ': ' + (e && e.message));
            }
        }
    }

    client.close();
}

run()
    .then(() => process.exit(0))
    .catch(err => {
        console.error('Falha na limpeza FTP:', err && err.message ? err.message : err);
        process.exit(1);
    });
