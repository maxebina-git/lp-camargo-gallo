const MIN_LOADING_MS = 800;

function ensureMinDuration(startedAt, ms) {
    const remaining = ms - (Date.now() - startedAt);
    if (remaining <= 0) return Promise.resolve();
    return new Promise((resolve) => setTimeout(resolve, remaining));
}

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
                    <label class="block text-sm font-medium text-gray-700">E-mail</label>
                    <input v-model="form.email" type="email" required 
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Senha</label>
                    <input v-model="form.password" type="password" required 
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                </div>
                <button type="submit" :disabled="loading"
                    class="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition">
                    <svg v-if="loading" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 animate-spin" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
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
            form: { email: '', password: '' },
            loading: false,
            error: ''
        };
    },
    methods: {
        async handleLogin() {
            this.loading = true;
            this.error = '';
            const startedAt = Date.now();
            let authenticated = false;
            try {
                const apiBase = window.location.pathname.includes('/staging/') ? '/staging/api' : '/api';
                const response = await fetch(`${apiBase}/auth/login.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: this.form.email,
                        password: this.form.password
                    })
                });
                const data = await response.json();
                if (response.ok) {
                    authenticated = true;
                } else {
                    this.error = data.error || 'Erro ao fazer login';
                }
            } catch (e) {
                this.error = 'Erro de conexão com o servidor';
            } finally {
                await ensureMinDuration(startedAt, MIN_LOADING_MS);
            }
            if (authenticated) await this.$router.push('/dashboard').catch(() => {});
            this.loading = false;
        }
    }
};
