// Gera o mesmo slug que a API grava (api/slug.php -> cg_slugify).
//
// As duas pontas precisam concordar: o que o admin mostra na previa e o
// que o backend usa na URL. Por isso o mapa de acentos e a regra de
// minuscula sao os mesmos dos dois lados — qualquer diferenca aqui
// vira slug diferente no front e no banco.
//
// O.minuscula so troca A-Z (como o strtolower do PHP, que e ASCII) e o
// mapa troca os acentos. O resto vira hifen.
const ACENTOS = {
    á: 'a', à: 'a', ã: 'a', â: 'a', ä: 'a', å: 'a',
    é: 'e', è: 'e', ê: 'e', ë: 'e',
    í: 'i', ì: 'i', î: 'i', ï: 'i',
    ó: 'o', ò: 'o', õ: 'o', ô: 'o', ö: 'o',
    ú: 'u', ù: 'u', û: 'u', ü: 'u',
    ç: 'c', ñ: 'n',
    Á: 'a', À: 'a', Ã: 'a', Â: 'a', Ä: 'a', Å: 'a',
    É: 'e', È: 'e', Ê: 'e', Ë: 'e',
    Í: 'i', Ì: 'i', Î: 'i', Ï: 'i',
    Ó: 'o', Ò: 'o', Õ: 'o', Ô: 'o', Ö: 'o',
    Ú: 'u', Ù: 'u', Û: 'u', Ü: 'u',
    Ç: 'c', Ñ: 'n',
};

const CHAVES = Object.keys(ACENTOS).join('');

export function slugify(texto) {
    return String(texto || '')
        .trim()
        .replace(/[A-Z]/g, (c) => c.toLowerCase())
        .replace(new RegExp('[' + CHAVES + ']', 'g'), (c) => ACENTOS[c])
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
