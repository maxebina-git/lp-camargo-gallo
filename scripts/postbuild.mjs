// Ajustes no dist depois do build, por ambiente.
//
// O .htaccess vem de public/ e vai para os dois deploys (producao e
// staging), entao o que so vale para o staging e escrito aqui.
//
// No staging o front e acessado pelo subdominio
// (staging.camargogallo.com.br), que tem como raiz o proprio diretorio do
// deploy (/public_html/staging/). O caminho /staging/ no dominio principal
// aponta para o mesmo lugar, mas os assets do build (base '/') sao
// relativos a raiz do subdominio: em /staging/ eles viram
// camargogallo.com.br/_astro/... e nao existem, entao a pagina abre sem
// CSS. O redirect leva o caminho antigo para o endereco canonico.
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.dirname(fileURLToPath(import.meta.url));
const arquivo = path.join(raiz, '..', 'dist', '.htaccess');
const site = process.env.SITE_URL || '';

const STAGING_HOST = 'staging.camargogallo.com.br';

if (!STAGING_HOST.includes(site) && !site.includes(STAGING_HOST)) {
  console.log('postbuild: .htaccess sem ajustes (ambiente ' + (site || 'padrao') + ')');
  process.exit(0);
}

let conteudo = readFileSync(arquivo, 'utf8');

if (conteudo.includes(STAGING_HOST)) {
  console.log('postbuild: .htaccess ja ajustada para o staging');
  process.exit(0);
}

const bloco = [
  '',
  '  # O staging e acessado pelo subdominio, que tem como raiz o proprio',
  '  # diretorio do deploy. O caminho /staging/ no dominio principal aponta',
  '  # para o mesmo lugar, mas os assets do build sao relativos a raiz do',
  '  # subdominio: em /staging/ eles viram camargogallo.com.br/_astro/...',
  '  # e nao existem, entao a pagina abre sem CSS. O redirect leva o',
  '  # caminho antigo para o endereco canonico.',
  '  RewriteCond %{HTTP_HOST} !^staging\\.camargogallo\\.com\\.br$ [NC]',
  '  RewriteRule ^(.*)$ http://' + STAGING_HOST + '/$1 [R=302,L]',
  '',
].join('\n');

const marca = '  RewriteEngine On\n';

if (!conteudo.includes(marca)) {
  console.error('postbuild: nao encontrei "RewriteEngine On" no dist/.htaccess');
  process.exit(1);
}

conteudo = conteudo.replace(marca, marca + bloco);
writeFileSync(arquivo, conteudo);
console.log('postbuild: dist/.htaccess ajustado para o staging');
