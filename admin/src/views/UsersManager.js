export default {
    template: `
    <div class="min-h-screen flex">
        <aside class="w-64 bg-gray-800 text-white flex flex-col mt-4 ml-4 rounded-l-2xl">
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
                <h1 class="text-3xl font-bold text-gray-800">Usuários</h1>
                <button v-if="isAdmin" @click="openModal()" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">+ Novo Usuário</button>
            </div>

            <div class="bg-white rounded-lg shadow overflow-hidden">
                <table class="w-full text-left">
                    <thead class="bg-gray-50 border-b">
                        <tr>
                            <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Nome</th>
                            <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">E-mail</th>
                            <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Telefone</th>
                            <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Perfil</th>
                            <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Criado em</th>
                            <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50">
                            <td class="px-6 py-4 font-medium text-gray-800">{{ item.nome }}</td>
                            <td class="px-6 py-4 text-gray-600">{{ item.email }}</td>
                            <td class="px-6 py-4 text-gray-600">{{ item.telefone || '—' }}</td>
                            <td class="px-6 py-4">
                                <span :class="item.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-700'" class="px-2 py-1 text-xs rounded-full">{{ item.role === 'admin' ? 'Admin' : 'Editor' }}</span>
                            </td>
                            <td class="px-6 py-4 text-gray-600">{{ item.created_at }}</td>
                            <td class="px-6 py-4 text-right space-x-2">
                                <button @click="editItem(item)" :disabled="!isAdmin && !isOwnRow(item)" class="text-blue-600 hover:text-blue-800 disabled:opacity-40 disabled:cursor-not-allowed">Editar</button>
                                <button @click="deleteItem(item.id)" :disabled="!isAdmin" class="text-red-600 hover:text-red-800 disabled:opacity-40 disabled:cursor-not-allowed">Excluir</button>
                            </td>
                        </tr>
                        <tr v-if="items.length === 0">
                            <td colspan="6" class="px-6 py-10 text-center text-gray-500">Nenhum usuário encontrado.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div class="bg-white rounded-lg max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto">
                    <h2 class="text-2xl font-bold mb-6">{{ editingId ? 'Editar Usuário' : 'Novo Usuário' }}</h2>
                    <form @submit.prevent="saveItem" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Nome completo</label>
                            <input v-model="form.nome" type="text" required class="mt-1 block w-full border border-gray-300 rounded-md p-2">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">E-mail</label>
                            <input v-model="form.email" type="email" required class="mt-1 block w-full border border-gray-300 rounded-md p-2">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Telefone</label>
                            <input v-model="form.telefone" type="tel" class="mt-1 block w-full border border-gray-300 rounded-md p-2" placeholder="(11) 99999-9999">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">{{ editingId ? 'Nova senha (deixe vazio para manter)' : 'Senha' }}</label>
                            <input v-model="form.password" type="password" :required="!editingId" class="mt-1 block w-full border border-gray-300 rounded-md p-2">
                        </div>
                        <div v-if="isAdmin">
                            <label class="block text-sm font-medium text-gray-700">Perfil</label>
                            <select v-model="form.role" class="mt-1 block w-full border border-gray-300 rounded-md p-2">
                                <option value="editor">Editor</option>
                                <option value="admin">Admin</option>
                            </select>
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
            currentUser: null,
            showModal: false,
            editingId: null,
            form: { nome: '', email: '', telefone: '', password: '', role: 'editor' }
        };
    },
    computed: {
        isAdmin() {
            return this.currentUser && this.currentUser.role === 'admin';
        }
    },
    mounted() {
        this.fetchCurrentUser();
        this.fetchItems();
    },
    methods: {
        apiBase() {
            return window.location.pathname.includes('/staging/') ? '/staging/api' : '/api';
        },
        async fetchCurrentUser() {
            try {
                const response = await fetch(`${this.apiBase()}/auth/check_session.php`);
                if (response.ok) {
                    const data = await response.json();
                    this.currentUser = data.user;
                }
            } catch (e) {
                console.error('Erro ao carregar usuário atual', e);
            }
        },
        async fetchItems() {
            try {
                const response = await fetch(`${this.apiBase()}/users/list.php`);
                this.items = await response.json();
            } catch (e) {
                console.error('Erro ao carregar usuários', e);
            }
        },
        isOwnRow(item) {
            return this.currentUser && item.id === this.currentUser.id;
        },
        openModal() {
            this.editingId = null;
            this.form = { nome: '', email: '', telefone: '', password: '', role: 'editor' };
            this.showModal = true;
        },
        editItem(item) {
            this.editingId = item.id;
            this.form = { nome: item.nome, email: item.email, telefone: item.telefone || '', password: '', role: item.role };
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
        },
        async saveItem() {
            const endpoint = this.editingId ? `${this.apiBase()}/users/update.php` : `${this.apiBase()}/users/insert.php`;
            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({ ...this.form, id: this.editingId }).toString()
                });
                const data = await response.json().catch(() => ({}));
                if (response.ok) {
                    this.closeModal();
                    this.fetchItems();
                } else {
                    alert(data.error || 'Erro ao salvar usuário');
                }
            } catch (e) {
                alert('Erro ao salvar usuário');
            }
        },
        async deleteItem(id) {
            if (!confirm('Tem certeza que deseja excluir este usuário?')) return;
            try {
                const response = await fetch(`${this.apiBase()}/users/delete.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({ id }).toString()
                });
                const data = await response.json().catch(() => ({}));
                if (response.ok) {
                    this.fetchItems();
                } else {
                    alert(data.error || 'Erro ao excluir usuário');
                }
            } catch (e) {
                alert('Erro ao excluir usuário');
            }
        },
        async handleLogout() {
            await fetch(`${this.apiBase()}/auth/logout.php`, { method: 'POST' });
            this.$router.push('/login');
        }
    }
};
