const MIN_LOADING_MS = 600;
const EDITOR_ALLOWED_TAGS = new Set(['p', 'div', 'span', 'strong', 'b', 'u', 'ul', 'li', 'blockquote', 'br', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'a']);
const EDITOR_REMOVED_TAGS = new Set(['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'textarea', 'button', 'svg', 'math']);

function normalizeEditorHref(value) {
    const href = String(value || '').trim();
    if (!href || /^\s*(?:javascript|data|vbscript):/i.test(href) || href.startsWith('//')) return '';

    try {
        const parsed = new URL(href, window.location.origin);
        if (!['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol)) return '';
        if (/^(?:https?:)?\/\//i.test(href) || href.startsWith('/') || href.startsWith('#') || href.startsWith('./') || href.startsWith('../') || /^(?:mailto|tel):/i.test(href)) {
            return href;
        }
    } catch (error) {
        return '';
    }

    return '';
}

function cleanEditorNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
        return document.createTextNode(node.nodeValue || '');
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return null;

    const tag = node.tagName.toLowerCase();
    if (EDITOR_REMOVED_TAGS.has(tag)) return null;

    const children = Array.from(node.childNodes)
        .map(cleanEditorNode)
        .filter(Boolean);

    if (tag === 'a') {
        const href = normalizeEditorHref(node.getAttribute('href'));
        if (!href) {
            const fragment = document.createDocumentFragment();
            children.forEach((child) => fragment.appendChild(child));
            return fragment;
        }

        const clean = document.createElement('a');
        clean.setAttribute('href', href);
        if (node.getAttribute('target') === '_blank') {
            clean.target = '_blank';
            clean.rel = 'noopener noreferrer';
        }
        children.forEach((child) => clean.appendChild(child));
        return clean;
    }

    if (EDITOR_ALLOWED_TAGS.has(tag)) {
        const clean = document.createElement(tag);
        children.forEach((child) => clean.appendChild(child));
        return clean;
    }

    const fragment = document.createDocumentFragment();
    children.forEach((child) => fragment.appendChild(child));
    return fragment;
}

function sanitizeEditorHtml(value) {
    const template = document.createElement('template');
    template.innerHTML = String(value || '');

    const clean = document.createElement('div');
    Array.from(template.content.childNodes)
        .map(cleanEditorNode)
        .filter(Boolean)
        .forEach((child) => clean.appendChild(child));

    return clean.innerHTML.trim();
}

function hasEditorText(value) {
    const container = document.createElement('div');
    container.innerHTML = String(value || '');
    return (container.textContent || '').replace(/\u00a0/g, ' ').trim() !== '';
}

function ensureMinDuration(startedAt, ms) {
    const remaining = ms - (Date.now() - startedAt);
    if (remaining <= 0) return Promise.resolve();
    return new Promise((resolve) => setTimeout(resolve, remaining));
}

export default {
    template: `
    <div class="min-h-screen flex">
        <!-- Sidebar (Reusable component would be better, but keeping it simple for now) -->
        <aside class="w-64 bg-gray-800 text-white flex flex-col mt-2 ml-2 mb-2 rounded-l-2xl">
            <div class="p-6 text-2xl font-bold border-b border-gray-700">CG Admin</div>
            <nav class="flex-1 p-4 space-y-2">
                <router-link to="/dashboard" class="block px-4 py-2 rounded hover:bg-gray-700 transition" :class="{'bg-gray-700': $route.path === '/dashboard'}">Dashboard</router-link>
                <router-link to="/insights" class="block px-4 py-2 rounded hover:bg-gray-700 transition" :class="{'bg-gray-700': $route.path === '/insights'}">Insights</router-link>
                <router-link to="/portfolio" class="block px-4 py-2 rounded hover:bg-gray-700 transition" :class="{'bg-gray-700': $route.path === '/portfolio'}">Portfólio</router-link>
                <router-link to="/users" class="block px-4 py-2 rounded hover:bg-gray-700 transition" :class="{'bg-gray-700': $route.path === '/users'}">Usuários</router-link>
            </nav>
            <div class="p-4 border-t border-gray-700">
                <button @click="handleLogout" class="w-full text-left px-4 py-2 rounded hover:bg-red-600 transition">Sair</button>
            </div>
        </aside>

        <main class="flex-1 p-8">
            <div class="flex justify-between items-center mb-8">
                <h1 ref="insightsHeading" tabindex="-1" class="text-3xl font-bold text-gray-800">Insights & Conhecimento</h1>
                <button @click="openModal()" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">+ Novo Artigo</button>
            </div>

            <div class="bg-white rounded-lg shadow overflow-hidden">
                <table class="w-full text-left">
                    <thead class="bg-gray-50 border-b">
                        <tr>
                            <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Título</th>
                            <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Data</th>
                            <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Categoria</th>
                            <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50">
                            <td class="px-6 py-4 font-medium text-gray-800">{{ item.titulo }}</td>
                            <td class="px-6 py-4 text-gray-600">{{ item.data }}</td>
                            <td class="px-6 py-4 text-gray-600">{{ item.categoria }}</td>
                            <td class="px-6 py-4 text-right space-x-2">
                                <button @click="editItem(item)" class="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" aria-hidden="true"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                                    Editar
                                </button>
                                <button @click="openDeleteModal(item, $event)" class="inline-flex items-center gap-1.5 rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" aria-hidden="true"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                    Excluir
                                </button>
                            </td>
                        </tr>
                        <tr v-if="items.length === 0">
                            <td colspan="4" class="px-6 py-10 text-center text-gray-500">Nenhum artigo encontrado.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Modal -->
            <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div class="relative bg-white rounded-lg max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
                    <button type="button" @click="closeModal" :disabled="saving" aria-label="Fechar" class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl leading-none cursor-pointer disabled:opacity-50">&times;</button>
                    <h2 class="text-2xl font-bold mb-6">{{ editingId ? 'Editar Artigo' : 'Novo Artigo' }}</h2>
                    <form @submit.prevent="saveItem" class="space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="col-span-2">
                                <label class="block text-sm font-medium text-gray-700">Título</label>
                                <input v-model="form.titulo" type="text" required class="mt-1 block w-full border border-gray-300 rounded-md p-2">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Data</label>
                                <input v-model="form.data" type="date" required class="mt-1 block w-full border border-gray-300 rounded-md p-2">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Categoria</label>
                                <input v-model="form.categoria" type="text" class="mt-1 block w-full border border-gray-300 rounded-md p-2">
                            </div>
                            <div class="col-span-2">
                                <label class="block text-sm font-medium text-gray-700">Resumo</label>
                                <input v-model="form.resumo" type="text" required class="mt-1 block w-full border border-gray-300 rounded-md p-2">
                            </div>
                            <div class="col-span-2">
                                <label class="block text-sm font-medium text-gray-700">Conteúdo</label>
                                <div class="mt-1 overflow-hidden rounded-md border border-gray-300 bg-white">
                                    <div class="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 p-2">
                                        <button type="button" @mousedown.prevent="saveEditorSelection" @click.prevent="applyFormat('bold')" title="Negrito" aria-label="Aplicar negrito" class="inline-flex h-8 min-w-8 items-center justify-center rounded px-2 text-sm font-bold text-gray-700 hover:bg-gray-200">B</button>
                                        <button type="button" @mousedown.prevent="saveEditorSelection" @click.prevent="applyFormat('underline')" title="Sublinhado" aria-label="Aplicar sublinhado" class="inline-flex h-8 min-w-8 items-center justify-center rounded px-2 text-sm text-gray-700 underline hover:bg-gray-200">U</button>
                                        <button type="button" @mousedown.prevent="saveEditorSelection" @click.prevent="applyFormat('insertUnorderedList')" title="Lista com marcadores" aria-label="Inserir lista com marcadores" class="inline-flex h-8 items-center justify-center rounded px-2 text-sm text-gray-700 hover:bg-gray-200">• Lista</button>
                                        <button type="button" @mousedown.prevent="saveEditorSelection" @click.prevent="applyFormat('formatBlock', 'blockquote')" title="Citação" aria-label="Aplicar citação" class="inline-flex h-8 items-center justify-center rounded px-2 text-sm text-gray-700 hover:bg-gray-200">❝ Citação</button>
                                        <button type="button" @mousedown.prevent="saveEditorSelection" @click.prevent="openTableDialog" title="Inserir tabela" aria-label="Inserir tabela" class="inline-flex h-8 items-center justify-center rounded px-2 text-sm text-gray-700 hover:bg-gray-200">▦ Tabela</button>
                                        <button type="button" @mousedown.prevent="saveEditorSelection" @click.prevent="openLinkDialog" title="Inserir link" aria-label="Inserir link" class="inline-flex h-8 items-center justify-center rounded px-2 text-sm text-gray-700 hover:bg-gray-200">🔗 Link</button>
                                    </div>
                                    <div v-if="showTableDialog" class="flex flex-wrap items-end gap-3 border-b border-gray-200 bg-blue-50 p-3">
                                        <label class="text-xs font-medium text-gray-700">Linhas (inclui cabeçalho)<input ref="tableRowsInput" v-model.number="tableRows" type="number" min="1" max="20" @keydown.enter.prevent="insertTable" @keydown.esc.prevent="cancelTableDialog" class="mt-1 block w-20 rounded border border-gray-300 bg-white p-1.5 text-sm"></label>
                                        <label class="text-xs font-medium text-gray-700">Colunas<input v-model.number="tableColumns" type="number" min="1" max="10" @keydown.enter.prevent="insertTable" @keydown.esc.prevent="cancelTableDialog" class="mt-1 block w-20 rounded border border-gray-300 bg-white p-1.5 text-sm"></label>
                                        <button type="button" @click="cancelTableDialog" class="rounded px-3 py-1.5 text-xs text-gray-600 hover:bg-blue-100">Cancelar</button>
                                        <button type="button" @click="insertTable" class="rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700">Inserir</button>
                                    </div>
                                    <div v-if="showLinkDialog" class="flex flex-wrap items-end gap-3 border-b border-gray-200 bg-blue-50 p-3">
                                        <label class="min-w-[16rem] flex-1 text-xs font-medium text-gray-700">URL<input ref="linkUrlInput" v-model="linkUrl" type="text" placeholder="https://exemplo.com" @keydown.enter.prevent="applyLink" @keydown.esc.prevent="cancelLinkDialog" class="mt-1 block w-full rounded border border-gray-300 bg-white p-1.5 text-sm"></label>
                                        <label class="flex items-center gap-2 pb-2 text-xs text-gray-700"><input v-model="linkNewTab" type="checkbox" class="rounded border-gray-300">Abrir em nova aba</label>
                                        <button type="button" @click="cancelLinkDialog" class="rounded px-3 py-1.5 text-xs text-gray-600 hover:bg-blue-100">Cancelar</button>
                                        <button type="button" @click="applyLink" class="rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700">Aplicar</button>
                                    </div>
                                    <div ref="contentEditor" contenteditable="true" role="textbox" aria-multiline="true" aria-label="Conteúdo do insight" @input="syncContent" @paste.prevent="pastePlainText" class="min-h-[180px] overflow-x-auto whitespace-pre-wrap p-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-500"></div>
                                </div>
                                <p class="mt-1 text-xs text-gray-500">Selecione um trecho e use os botões para formatar o conteúdo.</p>
                            </div>
                            <div class="col-span-2">
                                <label class="block text-sm font-medium text-gray-700">Imagem</label>
                                <div class="mt-1 flex items-start gap-4">
                                    <div class="w-28 h-28 flex-shrink-0 rounded-md border border-gray-300 bg-gray-50 overflow-hidden flex items-center justify-center">
                                        <img v-if="form.imagem" :src="form.imagem" alt="Prévia" class="w-full h-full object-cover">
                                        <span v-else class="text-xs text-gray-400">Sem imagem</span>
                                    </div>
                                    <div class="flex-1 space-y-2">
                                        <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" @change="onFileChange" :disabled="uploading" class="block w-full text-sm text-gray-600">
                                        <p v-if="uploading" class="text-xs text-blue-600 inline-flex items-center gap-0.5">
                                            Enviando imagem<span class="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style="animation-delay:0ms"></span><span class="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style="animation-delay:150ms"></span><span class="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style="animation-delay:300ms"></span>
                                        </p>
                                        <p v-if="uploadError" class="text-xs text-red-600">{{ uploadError }}</p>
                                        <input v-model="form.imagem" type="text" placeholder="ou cole uma URL/caminho" class="block w-full border border-gray-300 rounded-md p-2 text-xs">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="flex justify-end space-x-3 mt-6">
                            <button type="button" @click="closeModal" :disabled="saving" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed">Cancelar</button>
                            <button type="submit" :disabled="saving" class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition">
                                <svg v-if="saving" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 animate-spin" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                                <span>{{ saving ? 'Salvando...' : 'Salvar' }}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div
                v-if="showDeleteModal"
                class="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 p-4"
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-modal-title"
                aria-describedby="delete-modal-description"
                @click.self="closeDeleteModal"
            >
                <div ref="deleteDialog" class="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                    <button type="button" @click="closeDeleteModal" :disabled="deleting" aria-label="Fechar" class="absolute right-4 top-4 text-2xl leading-none text-gray-400 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50">&times;</button>
                    <div class="flex items-start gap-4">
                        <div class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6" aria-hidden="true">
                                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
                                <path d="M12 9v4" />
                                <path d="M12 17h.01" />
                            </svg>
                        </div>
                        <div class="pr-6">
                            <h2 id="delete-modal-title" class="text-xl font-bold text-gray-800">Excluir artigo?</h2>
                            <p id="delete-modal-description" class="mt-2 text-sm leading-6 text-gray-600">
                                O artigo <strong class="text-gray-800">“{{ deleteTarget ? deleteTarget.titulo : '' }}”</strong> será excluído permanentemente.
                            </p>
                        </div>
                    </div>
                    <p v-if="deleteError" role="alert" class="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{{ deleteError }}</p>
                    <div class="mt-6 flex justify-end gap-3">
                        <button ref="deleteCancelButton" type="button" @click="closeDeleteModal" :disabled="deleting" class="rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50">Cancelar</button>
                        <button type="button" @click="deleteItem" :disabled="deleting || !deleteTarget" class="inline-flex items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50">
                            <svg v-if="deleting" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 animate-spin" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                            <span>{{ deleting ? 'Excluindo...' : 'Excluir definitivamente' }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </main>
    </div>
    `,
    data() {
        return {
            items: [],
            showModal: false,
            editingId: null,
            uploading: false,
            uploadError: '',
            saving: false,
            showDeleteModal: false,
            deleteTarget: null,
            deleting: false,
            deleteError: '',
            deleteReturnFocus: null,
            form: { titulo: '', resumo: '', conteudo: '', data: '', categoria: '', imagem: '' },
            savedEditorRange: null,
            showTableDialog: false,
            tableRows: 3,
            tableColumns: 3,
            showLinkDialog: false,
            linkUrl: '',
            linkNewTab: false
        };
    },
    mounted() {
        this.fetchItems();
    },
    beforeUnmount() {
        window.removeEventListener('keydown', this.onEscKey);
    },
    methods: {
        async fetchItems() {
            try {
                const apiBase = window.location.pathname.includes('/staging/') ? '/staging/api' : '/api';
                const response = await fetch(`${apiBase}/insights/list.php`);
                this.items = await response.json();
            } catch (e) {
                console.error('Erro ao carregar insights', e);
            }
        },
        openModal() {
            this.editingId = null;
            this.form = { titulo: '', resumo: '', conteudo: '', data: '', categoria: '', imagem: '' };
            this.uploading = false;
            this.uploadError = '';
            this.saving = false;
            this.savedEditorRange = null;
            this.showTableDialog = false;
            this.showLinkDialog = false;
            this.showModal = true;
            window.addEventListener('keydown', this.onEscKey);
            this.$nextTick(() => this.setEditorContent(''));
        },
        editItem(item) {
            this.editingId = item.id;
            this.form = { ...item };
            this.uploading = false;
            this.uploadError = '';
            this.saving = false;
            this.savedEditorRange = null;
            this.showTableDialog = false;
            this.showLinkDialog = false;
            this.showModal = true;
            window.addEventListener('keydown', this.onEscKey);
            this.$nextTick(() => this.setEditorContent(item.conteudo || ''));
        },
        closeModal() {
            window.removeEventListener('keydown', this.onEscKey);
            this.savedEditorRange = null;
            this.showTableDialog = false;
            this.showLinkDialog = false;
            this.showModal = false;
        },
        onEscKey(event) {
            if (event.key !== 'Escape') return;

            if (this.showDeleteModal) {
                if (!this.deleting) this.closeDeleteModal();
                return;
            }

            if (this.showModal && !this.saving) {
                if (this.showTableDialog) {
                    this.cancelTableDialog();
                    return;
                }
                if (this.showLinkDialog) {
                    this.cancelLinkDialog();
                    return;
                }
                this.closeModal();
            }
        },
        openDeleteModal(item, event) {
            if (this.deleting) return;

            const trigger = event && event.currentTarget;
            this.deleteReturnFocus = trigger && typeof trigger.focus === 'function' ? trigger : null;
            this.deleteTarget = item;
            this.deleteError = '';
            this.deleting = false;
            this.showDeleteModal = true;
            window.addEventListener('keydown', this.onEscKey);
            this.$nextTick(() => {
                const cancelButton = this.$refs.deleteCancelButton;
                if (this.showDeleteModal && cancelButton && typeof cancelButton.focus === 'function') {
                    cancelButton.focus();
                }
            });
        },
        restoreDeleteFocus(target, fallback = true) {
            this.$nextTick(() => {
                if (target && typeof target.focus === 'function' && document.contains(target)) {
                    target.focus();
                    return;
                }

                if (fallback) {
                    const heading = this.$refs.insightsHeading;
                    if (heading && typeof heading.focus === 'function') heading.focus();
                }
            });
        },
        closeDeleteModal(restoreFocus = true) {
            if (this.deleting) return;

            const returnFocus = this.deleteReturnFocus;
            window.removeEventListener('keydown', this.onEscKey);
            this.showDeleteModal = false;
            this.deleteTarget = null;
            this.deleteError = '';
            this.deleteReturnFocus = null;
            if (restoreFocus) this.restoreDeleteFocus(returnFocus);
        },
        setEditorContent(value) {
            const editor = this.$refs.contentEditor;
            if (!editor) return;

            const raw = String(value || '');
            const hasMarkup = /<\s*(p|div|span|strong|b|u|ul|li|blockquote|br|table|thead|tbody|tr|th|td|a)\b/i.test(raw);
            if (hasMarkup) {
                editor.innerHTML = sanitizeEditorHtml(raw);
            } else {
                editor.textContent = raw;
            }
            this.syncContent();
        },
        syncContent() {
            const editor = this.$refs.contentEditor;
            if (editor) this.form.conteudo = editor.innerHTML;
        },
        saveEditorSelection() {
            const editor = this.$refs.contentEditor;
            const selection = window.getSelection();
            if (!editor || !selection || !selection.rangeCount) return;

            const range = selection.getRangeAt(0);
            if (editor.contains(range.commonAncestorContainer)) {
                this.savedEditorRange = range.cloneRange();
            }
        },
        restoreEditorSelection() {
            const editor = this.$refs.contentEditor;
            const selection = window.getSelection();
            if (!editor || !selection) return;

            editor.focus();
            if (!this.savedEditorRange || !editor.contains(this.savedEditorRange.commonAncestorContainer)) return;

            selection.removeAllRanges();
            selection.addRange(this.savedEditorRange);
        },
        pastePlainText(event) {
            const text = event.clipboardData ? event.clipboardData.getData('text/plain') : '';
            document.execCommand('insertText', false, text);
            this.syncContent();
        },
        applyFormat(command, value = null) {
            const editor = this.$refs.contentEditor;
            if (!editor) return;

            this.restoreEditorSelection();
            if (command === 'formatBlock') {
                const before = editor.innerHTML;
                const applied = document.execCommand(command, false, value || 'blockquote');
                if (editor.innerHTML === before && !applied) {
                    document.execCommand(command, false, '<blockquote>');
                }
            } else {
                document.execCommand(command, false, value);
            }
            this.syncContent();
        },
        openTableDialog() {
            this.saveEditorSelection();
            this.showLinkDialog = false;
            this.tableRows = 3;
            this.tableColumns = 3;
            this.showTableDialog = true;
            this.$nextTick(() => this.$refs.tableRowsInput?.focus());
        },
        cancelTableDialog() {
            this.showTableDialog = false;
        },
        getSelectedEditorAnchor() {
            const editor = this.$refs.contentEditor;
            const selection = window.getSelection();
            if (!editor || !selection || !selection.rangeCount) return null;

            let element = selection.anchorNode;
            if (element && element.nodeType !== Node.ELEMENT_NODE) element = element.parentElement;
            const anchor = element && element.closest ? element.closest('a') : null;
            return anchor && editor.contains(anchor) ? anchor : null;
        },
        openLinkDialog() {
            const editor = this.$refs.contentEditor;
            const selection = window.getSelection();
            if (!editor || !selection || !selection.rangeCount || !editor.contains(selection.getRangeAt(0).commonAncestorContainer)) {
                alert('Selecione uma palavra ou frase para inserir o link');
                return;
            }

            this.saveEditorSelection();
            const anchor = this.getSelectedEditorAnchor();
            this.showTableDialog = false;
            this.linkUrl = anchor ? anchor.getAttribute('href') || '' : '';
            this.linkNewTab = anchor ? anchor.getAttribute('target') === '_blank' : false;
            this.showLinkDialog = true;
            this.$nextTick(() => this.$refs.linkUrlInput?.focus());
        },
        cancelLinkDialog() {
            this.showLinkDialog = false;
            this.linkUrl = '';
            this.linkNewTab = false;
        },
        applyLink() {
            const editor = this.$refs.contentEditor;
            const href = normalizeEditorHref(this.linkUrl);
            if (!editor || !href) {
                alert('Informe uma URL válida. Use http://, https://, um caminho interno, mailto: ou tel:');
                return;
            }

            this.restoreEditorSelection();
            const selection = window.getSelection();
            const anchor = this.getSelectedEditorAnchor();
            if (anchor) {
                anchor.setAttribute('href', href);
            } else {
                if (!selection || selection.isCollapsed || !selection.toString().trim()) {
                    alert('Selecione uma palavra ou frase para inserir o link');
                    return;
                }
                document.execCommand('createLink', false, href);
            }

            const appliedAnchor = this.getSelectedEditorAnchor();
            if (appliedAnchor) {
                if (this.linkNewTab) {
                    appliedAnchor.setAttribute('target', '_blank');
                    appliedAnchor.setAttribute('rel', 'noopener noreferrer');
                } else {
                    appliedAnchor.removeAttribute('target');
                    appliedAnchor.removeAttribute('rel');
                }
            }

            this.syncContent();
            this.cancelLinkDialog();
            editor.focus();
        },
        insertTable() {
            const editor = this.$refs.contentEditor;
            if (!editor) return;

            const rows = Math.min(20, Math.max(1, Number.parseInt(this.tableRows, 10) || 1));
            const columns = Math.min(10, Math.max(1, Number.parseInt(this.tableColumns, 10) || 1));
            this.tableRows = rows;
            this.tableColumns = columns;
            this.restoreEditorSelection();

            let tableHtml = '<table><thead><tr>';
            for (let column = 1; column <= columns; column += 1) {
                tableHtml += `<th>Coluna ${column}</th>`;
            }
            tableHtml += '</tr></thead><tbody>';
            for (let row = 1; row < rows; row += 1) {
                tableHtml += '<tr>';
                for (let column = 1; column <= columns; column += 1) {
                    tableHtml += '<td><br></td>';
                }
                tableHtml += '</tr>';
            }
            tableHtml += '</tbody></table><p><br></p>';

            const before = editor.innerHTML;
            const inserted = document.execCommand('insertHTML', false, tableHtml);
            if (!inserted && editor.innerHTML === before) {
                const selection = window.getSelection();
                if (selection && selection.rangeCount) {
                    const range = selection.getRangeAt(0);
                    const template = document.createElement('template');
                    template.innerHTML = tableHtml;
                    range.deleteContents();
                    range.insertNode(template.content);
                    range.collapse(false);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }

            this.syncContent();
            this.showTableDialog = false;
            this.showLinkDialog = false;
            editor.focus();
        },
        onFileChange(event) {
            const file = event.target.files && event.target.files[0];
            if (file) this.uploadImage(file);
        },
        async uploadImage(file) {
            const apiBase = window.location.pathname.includes('/staging/') ? '/staging/api' : '/api';
            this.uploading = true;
            this.uploadError = '';
            const startedAt = Date.now();
            let path = '';
            let failure = '';
            try {
                const body = new FormData();
                body.append('file', file);
                const response = await fetch(`${apiBase}/upload.php`, { method: 'POST', body });
                const data = await response.json().catch(() => ({}));
                if (response.ok && data.path) {
                    path = data.path;
                } else {
                    failure = data.error || 'Falha no upload';
                }
            } catch (e) {
                failure = 'Erro de conexão no upload';
            } finally {
                await ensureMinDuration(startedAt, MIN_LOADING_MS);
                this.uploading = false;
            }
            if (path) this.form.imagem = path;
            if (failure) this.uploadError = failure;
        },
        async saveItem() {
            const apiBase = window.location.pathname.includes('/staging/') ? '/staging/api' : '/api';
            const endpoint = this.editingId ? `${apiBase}/insights/update.php` : `${apiBase}/insights/insert.php`;
            this.syncContent();
            this.form.conteudo = sanitizeEditorHtml(this.form.conteudo);
            if (!hasEditorText(this.form.conteudo)) {
                alert('Informe o conteúdo do artigo');
                return;
            }
            this.saving = true;
            const startedAt = Date.now();
            let saved = false;
            let failure = '';
            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({ ...this.form, id: this.editingId }).toString()
                });
                const data = await response.json().catch(() => ({}));
                if (response.ok) {
                    saved = true;
                } else {
                    failure = data.error || 'Erro ao salvar artigo';
                }
            } catch (e) {
                failure = 'Erro ao salvar artigo';
            } finally {
                await ensureMinDuration(startedAt, MIN_LOADING_MS);
                this.saving = false;
            }
            if (failure) {
                alert(failure);
                return;
            }
            if (saved) {
                this.closeModal();
                this.fetchItems();
            }
        },
        async deleteItem() {
            if (this.deleting || !this.deleteTarget) return;

            const apiBase = window.location.pathname.includes('/staging/') ? '/staging/api' : '/api';
            const id = this.deleteTarget.id;
            let deleted = false;
            let failure = '';
            this.deleting = true;
            this.deleteError = '';

            try {
                const response = await fetch(`${apiBase}/insights/delete.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({ id }).toString()
                });
                let data = null;

                try {
                    data = await response.json();
                } catch (e) {
                    failure = 'Resposta inválida do servidor ao excluir artigo';
                }

                if (!failure && !response.ok) {
                    failure = data && data.error ? data.error : 'Erro ao excluir artigo';
                } else if (!failure && (!data || Array.isArray(data) || typeof data !== 'object' || data.success !== true)) {
                    failure = data && data.error ? data.error : 'Resposta inválida do servidor ao excluir artigo';
                } else if (!failure) {
                    deleted = true;
                }
            } catch (e) {
                failure = 'Erro ao excluir artigo';
            } finally {
                this.deleting = false;
            }

            if (failure) {
                this.deleteError = failure;
                return;
            }

            if (deleted) {
                const returnFocus = this.deleteReturnFocus;
                this.closeDeleteModal(false);
                await this.fetchItems();
                this.restoreDeleteFocus(returnFocus);
            }
        },
        async handleLogout() {
            const apiBase = window.location.pathname.includes('/staging/') ? '/staging/api' : '/api';
            await fetch(`${apiBase}/auth/logout.php`, { method: 'POST' });
            this.$router.push('/login');
        }
    }
};
