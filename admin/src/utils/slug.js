// Gera o mesmo slug que a API grava (api/slug.php -> cg_slugify).
// As duas pontas precisam concordar: o que o admin mostra na previa e o
// que o backend usa na URL.
export function slugify(texto) {
    return String(texto || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
