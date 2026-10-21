// Remove arquivos remotos obsoletos via FTP.
//
// O deploy (deploy-ftp.cjs) sobe arquivos, mas nao apaga o que ficou no
// servidor de versoes anteriores. Este script apaga uma lista fixa de
// probes/arquivos que nao devem existir no servidor.
//
// Uso: node deploy-ftp-clean.cjs <remoteDir> <file...>
const path = require('path');
const Ftp = require('promise-ftp');

const remoteDir = process.argv[2]; // ex: staging/api
const files = process.argv.slice(3); // ex: _itest.php

if (!remoteDir || files.length === 0) {
    console.error('Usage: node deploy-ftp-clean.cjs <remoteDir> <file...>');
    process.exit(1);
}

const root = '/public_html/' + remoteDir.replace(/\/+$/, '') + '/';
const ftp = new Ftp();
let erros = 0;

function existeNoServidor(arquivo) {
    const dir = path.posix.dirname(arquivo);
    const nome = path.posix.basename(arquivo);
    return ftp.list(dir).then(
        (lista) => lista.some((item) => item && item.name === nome),
        () => false
    );
}

ftp
    .connect({
        host: process.env.FTP_SERVER,
        user: process.env.FTP_USERNAME,
        password: process.env.FTP_PASSWORD,
        port: 21,
        secure: false,
    })
    .then(async () => {
        for (const file of files) {
            const target = path.posix.join(root, file);
            try {
                await ftp.delete(target);
                console.log('removido: ' + target);
            } catch (e) {
                const code = e && e.code;
                // 550 e o codigo do servidor para "nao existe" ou "sem
                // permissao". Confere se o arquivo ainda esta la para nao
                // esconder uma falha de permissao.
                if (code === 550 || code === 250) {
                    const aindaExiste = await existeNoServidor(target);
                    if (aindaExiste) {
                        console.error('sem permissao para remover: ' + target);
                        erros++;
                    } else {
                        console.log('ja nao existe: ' + target);
                    }
                } else {
                    console.error('falha ao remover ' + target + ': ' + (e && e.message ? e.message : e));
                    erros++;
                }
            }
        }
        ftp.end();
    })
    .then(() => {
        if (erros > 0) {
            // A limpeza e best-effort: o .htaccess ja bloqueia esses
            // arquivos. Falhar o deploy por causa disso esconderia o resto.
            console.warn('ATENCAO: ' + erros + ' arquivo(s) nao puderam ser removidos (veja acima).');
        } else {
            console.log('Limpeza concluida.');
        }
        process.exit(0);
    })
    .catch((err) => {
        console.error('Falha na limpeza FTP:', err && err.message ? err.message : err);
        try {
            ftp.end();
        } catch (_) {
            /* ignora */
        }
        process.exit(1);
    });
