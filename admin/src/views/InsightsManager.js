export default {
    template: `
    <div class="min-h-screen flex">
        <!-- Sidebar (Reusable component would be better, but keeping it simple for now) -->
        <aside class="w-64 bg-gray-800 text-white flex flex-col">
            <div class="p-6 text-2xl font-bold border-b border-gray-700">CG Admin</div>
            <nav class="flex-1 p-4 space-y-2">
                <router-link to="/dashboard" class="block px-4 py-2 rounded hover:bg-gray-700 transition" :class="{'bg-gray-700': $route.path === '/dashboard'}">Dashboard</router-link>
                <router-link to="/insights" class="block px-4 py-2 rounded hover:bg-gray-700 transition" :class="{'bg-gray-700': $route.path === '/insights'}">Insights</router-link>
                <router-link to="/portfolio" class="block px-4 py-2 rounded hover:bg-gray-700 transition" :class="{'bg-gray-700': $route.path === '/portfolio'}">Portfólio</router-link>
            </nav>
            <div class="p-4 border-t border-gray-700">
                <button @click="handleLogout" class="w-full text-left px-4 py-2 rounded hover:bg-red-600 transition">Sair</button>
            </div>
        </aside>

        <main class="flex-1 p-8">
            <div class="flex justify-between items-center mb-8">
                <h1 class="text-3xl font-bold text-gray-800">Insights & Conhecimento</h1>
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
                                <button @click="editItem(item)" class="text-blue-600 hover:text-blue-800">Editar</button>
                                <button @click="deleteItem(item.id)" class="text-red-600 hover:text-red-800">Excluir</button>
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
                <div class="bg-white rounded-lg max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
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
                                <textarea v-model="form.resumo" rows="2" required class="mt-1 block w-full border border-gray-300 rounded-md p-2"></textarea>
                            </div>
                            <div class="col-span-2">
                                <label class="block text-sm font-medium text-gray-700">Conteúdo</label>
                                <textarea v-model="form.conteudo" rows="6" required class="mt-1 block w-full border border-gray-300 rounded-md p-2"></textarea>
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
                        </div>
                        <div class="flex justify-end space-x-3 mt-6">
                            <button type="button" @click="closeModal" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancelar</button>
                            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Salvar</button>
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
            form: { titulo: '', resumo: '', conteudo: '', data: '', categoria: '', imagem: '' }
        };
    },
    mounted() {
        this.fetchItems();
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
            const apiBase = window.location.pathname.includes('/staging/') ? '/staging/api' : '/api';
            this.uploading = true;
            this.uploadError = '';
            try {
                const body = new FormData();
                body.append('file', file);
                const response = await fetch(`${apiBase}/upload.php`, { method: 'POST', body });
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
            const apiBase = window.location.pathname.includes('/staging/') ? '/staging/api' : '/api';
            const endpoint = this.editingId ? `${apiBase}/insights/update.php` : `${apiBase}/insights/insert.php`;
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
                alert('Erro ao salvar artigo');
            }
        },
        async deleteItem(id) {
            if (!confirm('Tem certeza que deseja excluir este artigo?')) return;
            try {
                const apiBase = window.location.pathname.includes('/staging/') ? '/staging/api' : '/api';
                await fetch(`${apiBase}/insights/delete.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({ id }).toString()
                });
                this.fetchItems();
            } catch (e) {
                alert('Erro ao excluir artigo');
            }
        },
        async handleLogout() {
            const apiBase = window.location.pathname.includes('/staging/') ? '/staging/api' : '/api';
            await fetch(`${apiBase}/auth/logout.php`, { method: 'POST' });
            this.$router.push('/login');
        }
    }
};
