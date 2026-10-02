export default {
    template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-900 px-4">
        <div class="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold text-gray-800">Admin Login</h1>
                <p class="text-gray-500">Camargo Gallo Engenharia</p>
            </div>
            <form @submit.prevent="handleLogin" class="space-y-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Usuário</label>
                    <input v-model="form.username" type="text" required 
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Senha</label>
                    <input v-model="form.password" type="password" required 
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                </div>
                <button type="submit" :disabled="loading"
                    class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                    <span v-if="loading">Carregando...</span>
                    <span v-else>Entrar</span>
                </button>
                <p v-if="error" class="mt-2 text-center text-sm text-red-600">{{ error }}</p>
            </form>
        </div>
    </div>
    `,
    data() {
        return {
            form: { username: '', password: '' },
            loading: false,
            error: ''
        };
    },
    methods: {
        async handleLogin() {
            this.loading = true;
            this.error = '';
            try {
                const apiBase = window.location.pathname.includes('/staging/') ? '/staging/api' : '/api';
                const response = await fetch(`${apiBase}/auth/login.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: this.form.username,
                        password: this.form.password
                    })
                });
                const data = await response.json();
                if (response.ok) {
                    this.$router.push('/dashboard');
                } else {
                    this.error = data.error || 'Erro ao fazer login';
                }
            } catch (e) {
                this.error = 'Erro de conexão com o servidor';
            } finally {
                this.loading = false;
            }
        }
    }
};
