export default {
    template: `
    <div class="min-h-screen flex">
        <!-- Sidebar -->
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

        <!-- Main Content -->
        <main class="flex-1 p-8">
            <header class="mb-8">
                <h1 class="text-3xl font-bold text-gray-800">Dashboard</h1>
                <p class="text-gray-600">Bem-vindo ao painel de gestão de conteúdo.</p>
            </header>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                    <h3 class="text-gray-500 text-sm font-medium">Insights</h3>
                    <p class="text-2xl font-bold text-gray-800">Gerenciar Artigos</p>
                    <router-link to="/insights" class="text-blue-600 text-sm hover:underline">Acessar →</router-link>
                </div>
                <div class="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
                    <h3 class="text-gray-500 text-sm font-medium">Portfólio</h3>
                    <p class="text-2xl font-bold text-gray-800">Gerenciar Obras</p>
                    <router-link to="/portfolio" class="text-green-600 text-sm hover:underline">Acessar →</router-link>
                </div>
                <div class="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
                    <h3 class="text-gray-500 text-sm font-medium">Status</h3>
                    <p class="text-2xl font-bold text-gray-800">Operacional</p>
                    <span class="text-green-500 text-sm">● Online</span>
                </div>
            </div>
        </main>
    </div>
    `,
    methods: {
        async handleLogout() {
            try {
                await fetch('/api/auth/logout.php', { method: 'POST' });
                this.$router.push('/login');
            } catch (e) {
                console.error('Erro ao sair', e);
            }
        }
    }
};
