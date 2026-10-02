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
                            <th class="w-10 px-2 py-3"></th>
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
                                <button @click="editItem(item)" class="text-blue-600 hover:text-blue-800">Editar</button>
                                <button @click="deleteItem(item.id)" class="text-red-600 hover:text-red-800">Excluir</button>
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
                <div class="bg-white rounded-lg max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
                    <h2 class="text-2xl font-bold mb-6">{{ editingId ? 'Editar Obra' : 'Nova Obra' }}</h2>
                    <form @submit.prevent="saveItem" class="space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="col-span-2">
                                <label class="block text-sm font-medium text-gray-700">Título</label>
                                <input v-model="form.titulo" type="text" required class="mt-1 block w-full border border-gray-300 rounded-md p-2">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Categoria</label>
                                <input v-model="form.categoria" type="text" class="mt-1 block w-full border border-gray-300 rounded-md p-2">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Data da Obra</label>
                                <input v-model="form.data_obra" type="date" class="mt-1 block w-full border border-gray-300 rounded-md p-2">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Cidade</label>
                                <input v-model="form.cidade" type="text" placeholder="Ex.: São Paulo, SP" class="mt-1 block w-full border border-gray-300 rounded-md p-2">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Ano</label>
                                <input v-model="form.ano" type="text" inputmode="numeric" maxlength="4" placeholder="Ex.: 2024" class="mt-1 block w-full border border-gray-300 rounded-md p-2">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Status</label>
                                <select v-model="form.status" class="mt-1 block w-full border border-gray-300 rounded-md p-2">
                                    <option value="concluido">Concluído</option>
                                    <option value="em_andamento">Em Andamento</option>
                                </select>
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
                                        <p v-if="uploading" class="text-xs text-blue-600">Enviando imagem…</p>
                                        <p v-if="uploadError" class="text-xs text-red-600">{{ uploadError }}</p>
                                        <input v-model="form.imagem" type="text" placeholder="ou cole uma URL/caminho" class="block w-full border border-gray-300 rounded-md p-2 text-xs">
                                    </div>
                                </div>
                            </div>
                            <div class="col-span-2">
                                <label class="block text-sm font-medium text-gray-700">Descrição</label>
                                <textarea v-model="form.descricao" rows="4" required class="mt-1 block w-full border border-gray-300 rounded-md p-2"></textarea>
                            </div>
                        </div>
                        <div class="flex justify-end space-x-3 mt-6">
                            <button type="button" @click="closeModal" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancelar</button>
                            <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Salvar</button>
                        </div>
                    </form>
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
            form: { titulo: '', descricao: '', imagem: '', categoria: '', data_obra: '', status: 'concluido', cidade: '', ano: '' }
        };
    },
    mounted() {
        this.fetchItems();
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
            this.form = { titulo: '', descricao: '', imagem: '', categoria: '', data_obra: '', status: 'concluido', cidade: '', ano: '' };
            this.uploading = false;
            this.uploadError = '';
            this.showModal = true;
        },
        editItem(item) {
            this.editingId = item.id;
            this.form = { ...item };
            this.uploading = false;
            this.uploadError = '';
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
        },
        onFileChange(event) {
            const file = event.target.files && event.target.files[0];
            if (file) this.uploadImage(file);
        },
        async uploadImage(file) {
            this.uploading = true;
            this.uploadError = '';
            try {
                const body = new FormData();
                body.append('file', file);
                const response = await fetch(`${this.apiBase()}/upload.php`, { method: 'POST', body });
                const data = await response.json().catch(() => ({}));
                if (response.ok && data.path) {
                    this.form.imagem = data.path;
                } else {
                    this.uploadError = data.error || 'Falha no upload';
                }
            } catch (e) {
                this.uploadError = 'Erro de conexão no upload';
            } finally {
                this.uploading = false;
            }
        },
        async saveItem() {
            const endpoint = this.editingId ? `${this.apiBase()}/portfolio/update.php` : `${this.apiBase()}/portfolio/insert.php`;
            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({ ...this.form, id: this.editingId }).toString()
                });
                if (response.ok) {
                    this.closeModal();
                    this.fetchItems();
                }
            } catch (e) {
                alert('Erro ao salvar obra');
            }
        },
        async deleteItem(id) {
            if (!confirm('Tem certeza que deseja excluir esta obra?')) return;
            try {
                await fetch(`${this.apiBase()}/portfolio/delete.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({ id }).toString()
                });
                this.fetchItems();
            } catch (e) {
                alert('Erro ao excluir obra');
            }
        },
        async handleLogout() {
            await fetch(`${this.apiBase()}/auth/logout.php`, { method: 'POST' });
            this.$router.push('/login');
        }
    }
};
