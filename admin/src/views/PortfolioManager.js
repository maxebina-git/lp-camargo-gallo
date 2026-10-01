export default {
    template: `
    <div class="min-h-screen flex">
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
                <h1 class="text-3xl font-bold text-gray-800">Portfólio de Obras</h1>
                <button @click="openModal()" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">+ Nova Obra</button>
            </div>

            <div class="bg-white rounded-lg shadow overflow-hidden">
                <table class="w-full text-left">
                    <thead class="bg-gray-50 border-b">
                        <tr>
                            <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Título</th>
                            <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Categoria</th>
                            <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50">
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
                            <td colspan="4" class="px-6 py-10 text-center text-gray-500">Nenhuma obra encontrada.</td>
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
                                <label class="block text-sm font-medium text-gray-700">Status</label>
                                <select v-model="form.status" class="mt-1 block w-full border border-gray-300 rounded-md p-2">
                                    <option value="concluido">Concluído</option>
                                    <option value="em_andamento">Em Andamento</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Imagem (URL ou caminho)</label>
                                <input v-model="form.imagem" type="text" class="mt-1 block w-full border border-gray-300 rounded-md p-2">
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
            form: { titulo: '', descricao: '', imagem: '', categoria: '', data_obra: '', status: 'concluido' }
        };
    },
    mounted() {
        this.fetchItems();
    },
    methods: {
        async fetchItems() {
            try {
                const response = await fetch('/api/portfolio/list.php');
                this.items = await response.json();
            } catch (e) {
                console.error('Erro ao carregar portfólio', e);
            }
        },
        openModal() {
            this.editingId = null;
            this.form = { titulo: '', descricao: '', imagem: '', categoria: '', data_obra: '', status: 'concluido' };
            this.showModal = true;
        },
        editItem(item) {
            this.editingId = item.id;
            this.form = { ...item };
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
        },
        async saveItem() {
            const endpoint = this.editingId ? '/api/portfolio/update.php' : '/api/portfolio/insert.php';
            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...this.form, id: this.editingId })
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
                await fetch('/api/portfolio/delete.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id })
                });
                this.fetchItems();
            } catch (e) {
                alert('Erro ao excluir obra');
            }
        },
        async handleLogout() {
            await fetch('/api/auth/logout.php', { method: 'POST' });
            this.$router.push('/login');
        }
    }
};
