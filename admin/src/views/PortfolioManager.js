import { hasRichTextContent, normalizeRichTextHref, sanitizeRichTextHtml } from '../utils/richText.js';

const MIN_LOADING_MS = 600;
const MAX_IMAGENS = 20;

function ensureMinDuration(startedAt, ms) {
    const remaining = ms - (Date.now() - startedAt);
    if (remaining <= 0) return Promise.resolve();
    return new Promise((resolve) => setTimeout(resolve, remaining));
}

export default {
    template: `
    <div class="min-h-screen flex">
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
                <h1 class="text-3xl font-bold text-gray-800">Portfólio de Obras</h1>
                <button @click="openModal()" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">+ Nova Obra</button>
            </div>

            <div class="bg-white rounded-lg shadow overflow-hidden">
                <table class="w-full text-left">
                    <thead class="bg-gray-50 border-b">
                        <tr>
                            <th class="w-10 px-2 py-3 text-xs font-medium text-gray-500 uppercase">Ordem</th>
                            <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Título</th>
                            <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Categoria</th>
                            <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200" :class="{'opacity-60 pointer-events-none': savingOrder}">
                        <tr
                            v-for="(item, index) in items"
                            :key="item.id"
                            draggable="true"
                            @dragstart="onDragStart(index, $event)"
                            @dragover.prevent="onDragOver(index)"
                            @drop.prevent="onDrop(index)"
                            @dragend="onDragEnd"
                            class="hover:bg-gray-50 transition-colors"
                            :class="[
                                dragIndex === index ? 'opacity-40' : '',
                                dragOverIndex === index && dragIndex !== index ? 'bg-blue-50' : ''
                            ]"
                        >
                            <td class="px-2 py-4 text-gray-400 cursor-grab active:cursor-grabbing" title="Arraste para reordenar">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                    <circle cx="9" cy="12" r="1"></circle>
                                    <circle cx="9" cy="5" r="1"></circle>
                                    <circle cx="9" cy="19" r="1"></circle>
                                    <circle cx="15" cy="12" r="1"></circle>
                                    <circle cx="15" cy="5" r="1"></circle>
                                    <circle cx="15" cy="19" r="1"></circle>
                                </svg>
                            </td>
                            <td class="px-6 py-4 font-medium text-gray-800">{{ item.titulo }}</td>
                            <td class="px-6 py-4 text-gray-600">{{ item.categoria }}</td>
                            <td class="px-6 py-4">
                                <span :class="item.status === 'concluido' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'" 
                                      class="px-2 py-1 text-xs rounded-full">
                                    {{ item.status }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-right space-x-2">
                                <button @click="editItem(item)" class="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" aria-hidden="true"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                                    Editar
                                </button>
                                <button @click="openDeleteModal(item, $event)" :disabled="deleting" class="inline-flex items-center gap-1.5 rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" aria-hidden="true"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                    Excluir
                                </button>
                            </td>
                        </tr>
                        <tr v-if="items.length === 0">
                            <td colspan="5" class="px-6 py-10 text-center text-gray-500">Nenhuma obra encontrada.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Modal -->
            <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div class="relative bg-white rounded-lg max-w-4xl w-full p-8 max-h-[90vh] overflow-y-auto">
                    <button type="button" @click="closeModal" :disabled="saving" aria-label="Fechar" class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl leading-none cursor-pointer disabled:opacity-50">&times;</button>
                    <h2 class="text-2xl font-bold mb-6">{{ editingId ? 'Editar Obra' : 'Nova Obra' }}</h2>
                        <form @submit.prevent="saveItem" class="space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
                            <div class="md:col-span-2">
                                <label class="block text-sm font-medium text-gray-700">Título</label>
                                <input v-model="form.titulo" type="text" required class="mt-1 block w-full border border-gray-300 rounded-md p-2">
                            </div>
                            <div class="md:col-span-2">
                                <label class="block text-sm font-medium text-gray-700">Categoria</label>
                                <input v-model="form.categoria" type="text" class="mt-1 block w-full border border-gray-300 rounded-md p-2">
                            </div>
                            <div class="md:col-span-2">
                                <label class="block text-sm font-medium text-gray-700">Data da Obra</label>
                                <input v-model="form.data_obra" type="date" class="mt-1 block w-full border border-gray-300 rounded-md p-2">
                            </div>
                            <div class="md:col-span-2">
                                <label class="block text-sm font-medium text-gray-700">Cidade</label>
                                <input v-model="form.cidade" type="text" placeholder="Ex.: São Paulo, SP" class="mt-1 block w-full border border-gray-300 rounded-md p-2">
                            </div>
                            <div class="md:col-span-2">
                                <label class="block text-sm font-medium text-gray-700">Ano</label>
                                <input v-model="form.ano" type="text" inputmode="numeric" maxlength="4" placeholder="Ex.: 2024" class="mt-1 block w-full border border-gray-300 rounded-md p-2">
                            </div>
                            <div class="md:col-span-2">
                                <label class="block text-sm font-medium text-gray-700">Status</label>
                                <select v-model="form.status" class="mt-1 block w-full border border-gray-300 rounded-md p-2">
                                    <option value="concluido">Concluído</option>
                                    <option value="em_andamento">Em Andamento</option>
                                </select>
                            </div>
                            <div class="md:col-span-6">
                                <label class="block text-sm font-medium text-gray-700">Vídeo do YouTube</label>
                                <input v-model="form.video_youtube" type="text" placeholder="https://youtu.be/YxwwEqbQLzw?si=5uiP6DduWKKs7Z5g" class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm">
                                <p class="mt-0.5 text-xs text-gray-500">Aparece antes da descrição na página da obra. Deixe vazio para não exibir.</p>
                             </div>
                             <div class="md:col-span-6">
                                 <label class="block text-sm font-medium text-gray-700">Descrição</label>
                                 <div class="mt-1 overflow-hidden rounded-md border border-gray-300 bg-white">
                                     <div class="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 p-2">
                                         <button type="button" @mousedown.prevent="saveDescriptionSelection" @click.prevent="applyDescriptionFormat('bold')" title="Negrito" aria-label="Aplicar negrito" class="inline-flex h-8 min-w-8 items-center justify-center rounded px-2 text-sm font-bold text-gray-700 hover:bg-gray-200">B</button>
                                         <button type="button" @mousedown.prevent="saveDescriptionSelection" @click.prevent="applyDescriptionFormat('underline')" title="Sublinhado" aria-label="Aplicar sublinhado" class="inline-flex h-8 min-w-8 items-center justify-center rounded px-2 text-sm text-gray-700 underline hover:bg-gray-200">U</button>
                                         <button type="button" @mousedown.prevent="saveDescriptionSelection" @click.prevent="applyDescriptionFormat('insertUnorderedList')" title="Lista com marcadores" aria-label="Inserir lista com marcadores" class="inline-flex h-8 items-center justify-center rounded px-2 text-sm text-gray-700 hover:bg-gray-200">• Lista</button>
                                         <button type="button" @mousedown.prevent="saveDescriptionSelection" @click.prevent="applyDescriptionFormat('formatBlock', 'blockquote')" title="Citação" aria-label="Aplicar citação" class="inline-flex h-8 items-center justify-center rounded px-2 text-sm text-gray-700 hover:bg-gray-200">❝ Citação</button>
                                         <button type="button" @mousedown.prevent="saveDescriptionSelection" @click.prevent="openDescriptionLinkDialog" title="Inserir link" aria-label="Inserir link" class="inline-flex h-8 items-center justify-center rounded px-2 text-sm text-gray-700 hover:bg-gray-200">🔗 Link</button>
                                     </div>
                                     <div v-if="showDescriptionLinkDialog" class="flex flex-wrap items-end gap-3 border-b border-gray-200 bg-green-50 p-3">
                                         <label class="min-w-[16rem] flex-1 text-xs font-medium text-gray-700">URL<input ref="descriptionLinkUrlInput" v-model="descriptionLinkUrl" type="text" placeholder="https://exemplo.com" @keydown.enter.prevent="applyDescriptionLink" @keydown.esc.prevent="cancelDescriptionLinkDialog" class="mt-1 block w-full rounded border border-gray-300 bg-white p-1.5 text-sm"></label>
                                         <label class="flex items-center gap-2 pb-2 text-xs text-gray-700"><input v-model="descriptionLinkNewTab" type="checkbox" class="rounded border-gray-300">Abrir em nova aba</label>
                                         <button type="button" @click="cancelDescriptionLinkDialog" class="rounded px-3 py-1.5 text-xs text-gray-600 hover:bg-green-100">Cancelar</button>
                                         <button type="button" @click="applyDescriptionLink" class="rounded bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700">Aplicar</button>
                                     </div>
                                     <div ref="descriptionEditor" contenteditable="true" role="textbox" aria-multiline="true" aria-label="Descrição da obra" @input="syncDescription" @paste.prevent="pasteDescriptionPlainText" class="min-h-[180px] overflow-x-auto whitespace-pre-wrap p-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-green-500"></div>
                                 </div>
                                 <p class="mt-1 text-xs text-gray-500">Selecione um trecho e use os botões para formatar a descrição.</p>
                             </div>
                            <div class="md:col-span-6">
                                <label class="block text-sm font-medium text-gray-700">Galeria de imagens</label>
                                <p class="mt-0.5 text-xs text-gray-500">A primeira imagem é a capa usada nos cards. Arraste para reordenar.</p>

                                <div v-if="form.imagens.length" class="mt-2 grid grid-cols-4 gap-2">
                                    <div
                                        v-for="(img, i) in form.imagens"
                                        :key="img.img ? img.url + '-' + i : img + '-' + i"
                                        draggable="true"
                                        @dragstart="onImgDragStart(i, $event)"
                                        @dragover.prevent="onImgDragOver(i)"
                                        @drop.prevent="onImgDrop(i)"
                                        @dragend="onImgDragEnd"
                                        class="relative aspect-square rounded-md border border-gray-300 bg-gray-50 overflow-hidden cursor-grab active:cursor-grabbing"
                                        :class="[imgDragIndex === i ? 'opacity-40' : '', imgDragOverIndex === i && imgDragIndex !== i ? 'ring-2 ring-blue-400' : '']"
                                    >
                                        <img :src="img.url" :alt="'Imagem ' + (i + 1)" class="w-full h-full object-cover" draggable="false">
                                        <span v-if="i === 0" class="absolute top-1 left-1 px-1.5 py-0.5 text-[10px] font-semibold leading-none bg-blue-600 text-white rounded">Capa</span>
                                        <button
                                            type="button"
                                            @click.stop="removeImage(i)"
                                            :disabled="uploading"
                                            aria-label="Remover imagem"
                                            class="absolute top-1 right-1 w-5 h-5 inline-flex items-center justify-center rounded-full bg-black/60 text-white text-xs leading-none hover:bg-black/80 disabled:opacity-50"
                                        >&times;</button>
                                        <input
                                            v-model="img.legenda"
                                            type="text"
                                            placeholder="Legenda"
                                            class="absolute bottom-1 left-1 right-1 text-xs text-gray-300 p-1 bg-white/80 rounded backdrop-blur-sm"
                                            :disabled="uploading"
                                        >
                                    </div>
                                </div>
                                <div v-else class="mt-2 border border-dashed border-gray-300 rounded-md p-4 text-center text-xs text-gray-400">
                                    Nenhuma imagem ainda
                                </div>

                                <div class="mt-2 space-y-2">
                                    <input type="file" multiple accept="image/png,image/jpeg,image/webp,image/gif" @change="onFileChange" :disabled="uploading" class="block w-full text-sm text-gray-600">
                                    <p v-if="uploading" class="text-xs text-blue-600 inline-flex items-center gap-0.5">
                                        Enviando imagem {{ uploadIndex }}/{{ uploadTotal }}<span class="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style="animation-delay:0ms"></span><span class="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style="animation-delay:150ms"></span><span class="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style="animation-delay:300ms"></span>
                                    </p>
                                    <p v-if="uploadError" class="text-xs text-red-600">{{ uploadError }}</p>
                                    <div class="flex gap-2">
                                        <input v-model="urlDraft" type="text" placeholder="ou cole uma URL/caminho" class="flex-1 min-w-0 border border-gray-300 rounded-md p-2 text-xs">
                                        <button type="button" @click="addFromUrl" class="px-3 py-2 text-xs font-medium rounded-md border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100">Adicionar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="flex justify-end space-x-3 mt-6">
                            <button type="button" @click="closeModal" :disabled="saving" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed">Cancelar</button>
                            <button type="submit" :disabled="saving" class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition">
                                <svg v-if="saving" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 animate-spin" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                                <span>{{ saving ? 'Salvando...' : 'Salvar' }}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click.self="closeDeleteModal">
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="delete-modal-title"
                    aria-describedby="delete-modal-description"
                    class="relative bg-white rounded-lg max-w-md w-full p-6 shadow-xl"
                    @click.stop
                >
                    <button
                        type="button"
                        @click="closeDeleteModal"
                        :disabled="deleting"
                        aria-label="Fechar"
                        class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl leading-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >&times;</button>

                    <div class="flex items-start gap-4 pr-6">
                        <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6" aria-hidden="true">
                                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"></path>
                                <line x1="12" y1="9" x2="12" y2="13"></line>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                        </div>
                        <div>
                            <h2 id="delete-modal-title" class="text-xl font-bold text-gray-800">Excluir obra?</h2>
                            <p id="delete-modal-description" class="mt-2 text-sm text-gray-600">
                                Tem certeza que deseja excluir <strong class="text-gray-800">{{ deleteTarget ? deleteTarget.titulo : '' }}</strong>? Esta ação não pode ser desfeita.
                            </p>
                        </div>
                    </div>

                    <p v-if="deleteError" role="alert" class="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{{ deleteError }}</p>

                    <div class="flex justify-end gap-3 mt-6">
                        <button
                            ref="deleteCancelButton"
                            type="button"
                            @click="closeDeleteModal"
                            :disabled="deleting"
                            class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        >Cancelar</button>
                        <button
                            type="button"
                            @click="deleteItem(deleteTarget && deleteTarget.id)"
                            :disabled="deleting"
                            :aria-busy="deleting ? 'true' : 'false'"
                            class="inline-flex items-center justify-center gap-2 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg v-if="deleting" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 animate-spin" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
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
            dragIndex: null,
            dragOverIndex: null,
            savingOrder: false,
            saving: false,
            deleteTarget: null,
            showDeleteModal: false,
            deleting: false,
            deleteError: '',
            deleteTriggerElement: null,
            uploadIndex: 0,
             uploadTotal: 0,
             urlDraft: '',
             imgDragIndex: null,
             imgDragOverIndex: null,
             savedDescriptionRange: null,
             showDescriptionLinkDialog: false,
             descriptionLinkUrl: '',
             descriptionLinkNewTab: false,
             form: { titulo: '', descricao: '', imagem: '', imagens: [], video_youtube: '', categoria: '', data_obra: '', status: 'concluido', cidade: '', ano: '' }
         };
    },
    mounted() {
        this.fetchItems();
    },
    beforeUnmount() {
        window.removeEventListener('keydown', this.onEscKey);
    },
    methods: {
        apiBase() {
            return window.location.pathname.includes('/staging/') ? '/staging/api' : '/api';
        },
        async fetchItems() {
            try {
                const response = await fetch(`${this.apiBase()}/portfolio/list.php`);
                this.items = await response.json();
            } catch (e) {
                console.error('Erro ao carregar portfólio', e);
            }
        },
        onDragStart(index, event) {
            this.dragIndex = index;
            this.dragOverIndex = index;
            if (event && event.dataTransfer) {
                event.dataTransfer.effectAllowed = 'move';
                event.dataTransfer.setData('text/plain', String(this.items[index].id));
            }
        },
        onDragOver(index) {
            this.dragOverIndex = index;
        },
        onDragEnd() {
            this.dragIndex = null;
            this.dragOverIndex = null;
        },
        async onDrop(index) {
            const from = this.dragIndex;
            this.dragIndex = null;
            this.dragOverIndex = null;
            if (from === null || from === index || from < 0 || from >= this.items.length) return;

            const moved = this.items.splice(from, 1)[0];
            this.items.splice(index, 0, moved);
            await this.persistOrder();
        },
        async persistOrder() {
            this.savingOrder = true;
            try {
                const response = await fetch(`${this.apiBase()}/portfolio/reorder.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ids: this.items.map((item) => item.id) })
                });
                if (!response.ok) throw new Error('HTTP ' + response.status);
            } catch (e) {
                console.error('Erro ao salvar a ordem', e);
                alert('Não foi possível salvar a nova ordem.');
                this.fetchItems();
            } finally {
                this.savingOrder = false;
            }
        },
         openModal() {
             this.editingId = null;
             this.form = { titulo: '', descricao: '', imagem: '', imagens: [], video_youtube: '', categoria: '', data_obra: '', status: 'concluido', cidade: '', ano: '' };
            this.uploading = false;
            this.uploadError = '';
             this.urlDraft = '';
             this.saving = false;
             this.savedDescriptionRange = null;
             this.cancelDescriptionLinkDialog();
             this.showModal = true;
             window.addEventListener('keydown', this.onEscKey);
             this.$nextTick(() => this.setDescriptionContent(''));
        },
        openDeleteModal(item, event) {
            if (this.deleting) return;
            this.deleteTarget = item;
            this.deleteError = '';
            this.deleteTriggerElement = event && event.currentTarget && typeof event.currentTarget.focus === 'function'
                ? event.currentTarget
                : null;
            this.showDeleteModal = true;
            window.addEventListener('keydown', this.onEscKey);
            this.$nextTick(() => {
                if (this.showDeleteModal && !this.deleting && this.$refs.deleteCancelButton) {
                    this.$refs.deleteCancelButton.focus();
                }
            });
        },
editItem(item) {
            this.editingId = item.id;
            // Novo formato API: cg_imagens_list retorna {urls: [...], legendas: [...]}
            // Converter para array de {url, legenda} objetos
            let galeria = [];
            if (item.imagens && typeof item.imagens === 'object' && !Array.isArray(item.imagens) && item.imagens.urls) {
                // Formato novo: {urls: [...], legendas: [...]}
                const urls = item.imagens.urls;
                const legendas = item.imagens.legendas;
                galeria = urls.map((url, i) => ({ url, legenda: legendas[i] || '' }));
            } else if (Array.isArray(item.imagens)) {
                // Formato antigo: ['url1', 'url2', ...] - converter para novo formato
                galeria = item.imagens.map((url) => ({ url, legenda: '' }));
            } else if (item.imagem) {
                // Fallback obra antiga: apenas a capa
                galeria = [{ url: item.imagem, legenda: '' }];
            }
            this.form = { ...item, imagens: galeria };
            this.uploading = false;
            this.uploadError = '';
             this.urlDraft = '';
             this.saving = false;
             this.savedDescriptionRange = null;
             this.cancelDescriptionLinkDialog();
             this.showModal = true;
             window.addEventListener('keydown', this.onEscKey);
             this.$nextTick(() => this.setDescriptionContent(item.descricao || ''));
        },
         closeModal() {
             window.removeEventListener('keydown', this.onEscKey);
             this.savedDescriptionRange = null;
             this.cancelDescriptionLinkDialog();
             this.showModal = false;
        },
        closeDeleteModal() {
            if (this.deleting) return;
            window.removeEventListener('keydown', this.onEscKey);
            this.showDeleteModal = false;
            this.deleteError = '';
            const trigger = this.deleteTriggerElement;
            this.deleteTriggerElement = null;
            this.deleteTarget = null;
            if (trigger && typeof trigger.focus === 'function' && typeof document !== 'undefined') {
                this.$nextTick(() => {
                    if (document.contains(trigger)) trigger.focus();
                });
            }
        },
         onEscKey(event) {
             if (event.key !== 'Escape') return;
             if (this.showDeleteModal) {
                 if (!this.deleting) this.closeDeleteModal();
                 return;
            }
             if (this.showModal && !this.saving) {
                 if (this.showDescriptionLinkDialog) {
                     this.cancelDescriptionLinkDialog();
                     return;
                 }
                 this.closeModal();
             }
         },
         setDescriptionContent(value) {
             const editor = this.$refs.descriptionEditor;
             if (!editor) return;

             const raw = String(value || '');
             const hasMarkup = /<\s*(p|div|span|strong|b|u|ul|li|blockquote|br|a)\b/i.test(raw);
             if (hasMarkup) {
                 editor.innerHTML = sanitizeRichTextHtml(raw);
             } else {
                 editor.textContent = raw;
             }
             this.syncDescription();
         },
         syncDescription() {
             const editor = this.$refs.descriptionEditor;
             if (editor) this.form.descricao = editor.innerHTML;
         },
         saveDescriptionSelection() {
             const editor = this.$refs.descriptionEditor;
             const selection = window.getSelection();
             if (!editor || !selection || !selection.rangeCount) return;

             const range = selection.getRangeAt(0);
             if (editor.contains(range.commonAncestorContainer)) {
                 this.savedDescriptionRange = range.cloneRange();
             }
         },
         restoreDescriptionSelection() {
             const editor = this.$refs.descriptionEditor;
             const selection = window.getSelection();
             if (!editor || !selection) return;

             editor.focus();
             if (!this.savedDescriptionRange || !editor.contains(this.savedDescriptionRange.commonAncestorContainer)) return;

             selection.removeAllRanges();
             selection.addRange(this.savedDescriptionRange);
         },
         pasteDescriptionPlainText(event) {
             const text = event.clipboardData ? event.clipboardData.getData('text/plain') : '';
             document.execCommand('insertText', false, text);
             this.syncDescription();
         },
         applyDescriptionFormat(command, value = null) {
             const editor = this.$refs.descriptionEditor;
             if (!editor) return;

             this.restoreDescriptionSelection();
             if (command === 'formatBlock') {
                 const before = editor.innerHTML;
                 const applied = document.execCommand(command, false, value || 'blockquote');
                 if (editor.innerHTML === before && !applied) {
                     document.execCommand(command, false, '<blockquote>');
                 }
             } else {
                 document.execCommand(command, false, value);
             }
             this.syncDescription();
         },
         getSelectedDescriptionAnchor() {
             const editor = this.$refs.descriptionEditor;
             const selection = window.getSelection();
             if (!editor || !selection || !selection.rangeCount) return null;

             let element = selection.anchorNode;
             if (element && element.nodeType !== Node.ELEMENT_NODE) element = element.parentElement;
             const anchor = element && element.closest ? element.closest('a') : null;
             return anchor && editor.contains(anchor) ? anchor : null;
         },
         openDescriptionLinkDialog() {
             const editor = this.$refs.descriptionEditor;
             const selection = window.getSelection();
             if (!editor || !selection || !selection.rangeCount || !editor.contains(selection.getRangeAt(0).commonAncestorContainer)) {
                 alert('Selecione uma palavra ou frase para inserir o link');
                 return;
             }

             this.saveDescriptionSelection();
             const anchor = this.getSelectedDescriptionAnchor();
             this.descriptionLinkUrl = anchor ? anchor.getAttribute('href') || '' : '';
             this.descriptionLinkNewTab = anchor ? anchor.getAttribute('target') === '_blank' : false;
             this.showDescriptionLinkDialog = true;
             this.$nextTick(() => this.$refs.descriptionLinkUrlInput?.focus());
         },
         cancelDescriptionLinkDialog() {
             this.showDescriptionLinkDialog = false;
             this.descriptionLinkUrl = '';
             this.descriptionLinkNewTab = false;
         },
         applyDescriptionLink() {
             const editor = this.$refs.descriptionEditor;
             const href = normalizeRichTextHref(this.descriptionLinkUrl);
             if (!editor || !href) {
                 alert('Informe uma URL válida. Use http://, https://, um caminho interno, mailto: ou tel:');
                 return;
             }

             this.restoreDescriptionSelection();
             const selection = window.getSelection();
             const anchor = this.getSelectedDescriptionAnchor();
             if (anchor) {
                 anchor.setAttribute('href', href);
             } else {
                 if (!selection || selection.isCollapsed || !selection.toString().trim()) {
                     alert('Selecione uma palavra ou frase para inserir o link');
                     return;
                 }
                 document.execCommand('createLink', false, href);
             }

             const appliedAnchor = this.getSelectedDescriptionAnchor();
             if (appliedAnchor) {
                 if (this.descriptionLinkNewTab) {
                     appliedAnchor.setAttribute('target', '_blank');
                     appliedAnchor.setAttribute('rel', 'noopener noreferrer');
                 } else {
                     appliedAnchor.removeAttribute('target');
                     appliedAnchor.removeAttribute('rel');
                 }
             }

             this.syncDescription();
             this.cancelDescriptionLinkDialog();
             editor.focus();
         },
         onFileChange(event) {
             const files = Array.prototype.slice.call(event.target.files || []);
            event.target.value = '';
            if (files.length) this.uploadQueue(files);
        },
        async uploadQueue(files) {
            const room = MAX_IMAGENS - this.form.imagens.length;
            if (room <= 0) {
                this.uploadError = 'Limite de ' + MAX_IMAGENS + ' imagens atingido.';
                return;
            }
            const truncated = files.length > room;
            const queue = truncated ? files.slice(0, room) : files;

            this.uploading = true;
            this.uploadError = '';
            this.uploadTotal = queue.length;
            const failed = [];

            for (let i = 0; i < queue.length; i++) {
                this.uploadIndex = i + 1;
                const path = await this.uploadImage(queue[i]);
                if (path) this.form.imagens.push({ url: path, legenda: '' });
                else if (queue[i] && queue[i].name) failed.push(queue[i].name);
            }

            this.uploading = false;
            this.uploadIndex = 0;
            this.uploadTotal = 0;

            const notes = [];
            if (truncated) notes.push('Limite de ' + MAX_IMAGENS + ' imagens: apenas os ' + queue.length + ' primeiros foram processados.');
            if (failed.length) notes.push('Falha ao enviar: ' + failed.join(', ') + '.');
            this.uploadError = notes.join(' ');
        },
        async uploadImage(file) {
            const startedAt = Date.now();
            let path = '';
            try {
                const body = new FormData();
                body.append('file', file);
                const response = await fetch(`${this.apiBase()}/upload.php`, { method: 'POST', body });
                const data = await response.json().catch(() => ({}));
                if (response.ok && data.path) path = data.path;
            } catch (e) {
                path = '';
            } finally {
                await ensureMinDuration(startedAt, MIN_LOADING_MS);
            }
            return path;
        },
        removeImage(index) {
            if (this.uploading) return;
            this.form.imagens.splice(index, 1);
        },
        addFromUrl() {
            const url = (this.urlDraft || '').trim();
            if (!url) return;
            if (this.form.imagens.length >= MAX_IMAGENS) {
                this.uploadError = 'Limite de ' + MAX_IMAGENS + ' imagens atingido.';
                return;
            }
            this.form.imagens.push({ url, legenda: '' });
            this.urlDraft = '';
        },
        onImgDragStart(index, event) {
            this.imgDragIndex = index;
            this.imgDragOverIndex = index;
            if (event && event.dataTransfer) {
                event.dataTransfer.effectAllowed = 'move';
                event.dataTransfer.setData('text/plain', String(index));
            }
        },
        onImgDragOver(index) {
            this.imgDragOverIndex = index;
        },
        onImgDragEnd() {
            this.imgDragIndex = null;
            this.imgDragOverIndex = null;
        },
        onImgDrop(index) {
            const from = this.imgDragIndex;
            this.imgDragIndex = null;
            this.imgDragOverIndex = null;
            if (from === null || from === index || from < 0 || from >= this.form.imagens.length) return;
            const moved = this.form.imagens.splice(from, 1)[0];
            this.form.imagens.splice(index, 0, moved);
         },
         async saveItem() {
             const endpoint = this.editingId ? `${this.apiBase()}/portfolio/update.php` : `${this.apiBase()}/portfolio/insert.php`;
             this.syncDescription();
             this.form.descricao = sanitizeRichTextHtml(this.form.descricao);
             if (!hasRichTextContent(this.form.descricao)) {
                 alert('Informe a descrição da obra');
                 return;
             }

this.saving = true;
            const startedAt = Date.now();
            let saved = false;
            let failure = '';
            // Converter imagens para formato de strings (compatível com galeria.php)
            // Se vierem como {url, legenda}, extrair apenas as URLs
            if (this.form.imagens && this.form.imagens[0] && typeof this.form.imagens[0] === 'object') {
                this.form.imagens = this.form.imagens.map(img => img.url || '');
            }
            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({
                        ...this.form,
                        imagens: JSON.stringify(this.form.imagens),
                        imagem: this.form.imagens[0]?.url || '',
                        id: this.editingId
                    }).toString()
                });
                const data = await response.json().catch(() => ({}));
                if (response.ok) {
                    saved = true;
                } else {
                    failure = data.error || 'Erro ao salvar obra';
                }
            } catch (e) {
                failure = 'Erro ao salvar obra';
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
        async deleteItem(id) {
            if (this.deleting || !this.deleteTarget || id === null || id === undefined) return;
            this.deleting = true;
            this.deleteError = '';
            try {
                const response = await fetch(`${this.apiBase()}/portfolio/delete.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({ id }).toString()
                });
                let data;
                try {
                    data = await response.json();
                } catch (e) {
                    throw new Error('Resposta inválida ao excluir obra.');
                }
                if (!response.ok) {
                    throw new Error(data && data.error ? data.error : 'Erro ao excluir obra.');
                }
                if (!data || data.success !== true) {
                    throw new Error(data && data.error ? data.error : 'Resposta inválida ao excluir obra.');
                }
            } catch (e) {
                this.deleteError = e && e.message ? e.message : 'Erro ao excluir obra.';
                this.deleting = false;
                return;
            }
            this.deleting = false;
            this.closeDeleteModal();
            await this.fetchItems();
        },
        async handleLogout() {
            await fetch(`${this.apiBase()}/auth/logout.php`, { method: 'POST' });
            this.$router.push('/login');
        }
    }
};
