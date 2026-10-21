// Remove (ou neutraliza) arquivos remotos obsoletos via FTP.
//
// O deploy (deploy-ftp.cjs) sobe arquivos, mas nao apaga o que ficou no
// servidor de versoes anteriores. Este script apaga uma lista fixa de
// probes/arquivos que nao devem continuar no servidor.
//
// Uso: node deploy-ftp-clean.cjs <remoteDir> <file...>
//
// A limpeza e best-effort: se o usuario de FTP nao puder apagar, o arquivo
// e sobrescrito por um stub que devolve 404, para que nunca volte a expor
// dados. O .htaccess da API ja nega o acesso a esses nomes.
const fs = require('fs');
const os = require('os');
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
let pendentes = 0;

const STUB = [
    '<?php',
    '// Arquivo obsoleto: removido do repositorio e substituido por este stub.',
    '// A versao original nao deve mais estar no servidor.',
    "http_response_code(404);",
    'exit;',
    '',
].join('\n');

function stubLocal() {
    const file = path.join(os.tmpdir(), 'deploy-clean-stub.php');
    fs.writeFileSync(file, STUB, 'utf8');
    return file;
}

// O DELE com caminho completo nem sempre e aceito. Some servidores exigem
// que o diretorio seja o atual antes do DELE.
async function apagar(dir, nome) {
    try {
        await ftp.delete(dir + '/' + nome);
        return 'removido';
    } catch (e) {
        const ondeEstava = await ftp.pwd();
        try {
            await ftp.cwd(dir);
            await ftp.delete(nome);
            await ftp.cwd(ondeEstava);
            return 'removido';
        } catch (e2) {
            try {
                await ftp.cwd(ondeEstava);
            } catch (_) {
                /* ignora */
            }
            return null;
        }
    }
}

function aindaExiste(dir, nome) {
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
        const stub = stubLocal();
        for (const file of files) {
            const dir = path.posix.join(root, path.posix.dirname(file));
            const nome = path.posix.basename(file);

            const resultado = await apagar(dir, nome);
            if (resultado) {
                console.log('removido: ' + dir + '/' + nome);
                continue;
            }

            if (!(await aindaExiste(dir, nome))) {
                console.log('ja nao existe: ' + dir + '/' + nome);
                continue;
            }

            // Nao conseguiu apagar: sobrescreve com o stub para que o arquivo
            // pare de expor qualquer coisa.
            try {
                await ftp.put(stub, dir + '/' + nome);
                console.log('neutralizado (stub 404): ' + dir + '/' + nome);
                pendentes++;
            } catch (e) {
                console.error('NAO REMOVER: ' + dir + '/' + nome + ' -> ' + (e && e.message ? e.message : e));
                pendentes++;
            }
        }
        fs.unlinkSync(stub);
        ftp.end();
    })
    .then(() => {
        if (pendentes > 0) {
            console.warn('ATENCAO: ' + pendentes + ' arquivo(s) continuam no servidor (ver acima).');
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
        process.exit(0);
    });
