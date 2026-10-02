export default {
    template: `
    <div class="min-h-screen flex">
        <!-- Sidebar -->
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

        <!-- Main Content -->
        <main class="flex-1 p-8">
            <header class="mb-8">
                <h1 class="text-3xl font-bold text-gray-800">Dashboard</h1>
                <p class="text-gray-600">Bem-vindo ao painel de gestão de conteúdo.</p>
            </header>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500 flex items-center gap-4">
                    <div class="flex-1 min-w-0">
                        <h3 class="text-gray-500 text-sm font-medium">Insights</h3>
                        <p class="text-2xl font-bold text-gray-800">{{ insightsCount }} Artigos Publicados</p>
                        <router-link to="/insights" class="text-blue-600 text-sm hover:underline">Acessar →</router-link>
                    </div>
                    <div class="anim-left-wrap">
                        <div class="particles">
                            <div class="particle"></div>
                            <div class="particle"></div>
                            <div class="particle"></div>
                            <div class="particle"></div>
                            <div class="particle"></div>
                            <div class="particle"></div>
                            <div class="particle"></div>
                            <div class="particle"></div>
                        </div>
                        <div class="scene">
                            <div class="building">
                                <div class="floor"><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div></div>
                                <div class="floor"><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div></div>
                                <div class="floor"><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div></div>
                                <div class="floor"><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div></div>
                                <div class="floor"><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div></div>
                                <div class="floor"><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div></div>
                                <div class="floor"><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div></div>
                            </div>
                            <div class="roller roller-left"></div>
                            <div class="roller roller-right"></div>
                            <div class="cable cable-left"></div>
                            <div class="cable cable-right"></div>
                            <div class="platform">
                                <div class="painter painter-1"><div class="helmet"></div><div class="head"></div><div class="body"></div></div>
                                <div class="painter painter-2"><div class="helmet"></div><div class="head"></div><div class="body"></div></div>
                                <div class="painter painter-3"><div class="helmet"></div><div class="head"></div><div class="body"></div></div>
                            </div>
                            <div class="ground"></div>
                        </div>
                    </div>
                </div>
                <div class="bg-white p-6 rounded-lg shadow border-l-4 border-green-500 flex items-center gap-4">
                    <div class="flex-1 min-w-0">
                        <h3 class="text-gray-500 text-sm font-medium">Portfólio</h3>
                        <p class="text-2xl font-bold text-gray-800">{{ portfolioCount }} Cases</p>
                        <router-link to="/portfolio" class="text-green-600 text-sm hover:underline">Acessar →</router-link>
                    </div>
                    <div class="anim-wrap">
                        <div class="particles">
                            <div class="particle"></div>
                            <div class="particle"></div>
                            <div class="particle"></div>
                            <div class="particle"></div>
                            <div class="particle"></div>
                            <div class="particle"></div>
                            <div class="particle"></div>
                            <div class="particle"></div>
                        </div>
                        <div class="scene">
                            <div class="building">
                                <div class="floor"><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div></div>
                                <div class="floor"><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div></div>
                                <div class="floor"><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div></div>
                                <div class="floor"><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div></div>
                                <div class="floor"><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div></div>
                                <div class="floor"><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div></div>
                                <div class="floor"><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div></div>
                            </div>
                            <div class="crane">
                                <div class="crane-mast"></div>
                                <div class="crane-jib"></div>
                                <div class="crane-cable"></div>
                                <div class="crane-hook"></div>
                                <div class="crane-block"></div>
                            </div>
                            <div class="ground"></div>
                            <div class="dust"></div>
                        </div>
                    </div>
                </div>
                <div class="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500 flex items-center gap-4">
                    <div class="flex-1 min-w-0">
                        <h3 class="text-gray-500 text-sm font-medium">Usuários</h3>
                        <p class="text-2xl font-bold text-gray-800">{{ usersCount }} Usuários</p>
                        <router-link to="/users" class="text-purple-600 text-sm hover:underline">Acessar →</router-link>
                    </div>
                    <div class="anim-right-wrap">
                        <div class="particles">
                            <div class="particle"></div>
                            <div class="particle"></div>
                            <div class="particle"></div>
                            <div class="particle"></div>
                            <div class="particle"></div>
                            <div class="particle"></div>
                            <div class="particle"></div>
                            <div class="particle"></div>
                        </div>
                        <div class="scene">
                            <div class="building">
                                <div class="floor"><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div></div>
                                <div class="floor"><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div></div>
                                <div class="floor"><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div></div>
                                <div class="floor"><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div></div>
                                <div class="floor"><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div></div>
                                <div class="floor"><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div></div>
                                <div class="floor"><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div><div class="window"></div></div>
                            </div>
                            <div class="ground"></div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
    `,
    data() {
        return {
            insightsCount: 0,
            portfolioCount: 0,
            usersCount: 0,
            floorShakeTimer: null
        };
    },
    mounted() {
        this.fetchCounts();
        this.startFloorShake();
    },
    beforeUnmount() {
        if (this.floorShakeTimer) {
            clearTimeout(this.floorShakeTimer);
            this.floorShakeTimer = null;
        }
    },
    methods: {
        apiBase() {
            return window.location.pathname.includes('/staging/') ? '/staging/api' : '/api';
        },
        async fetchCounts() {
            try {
                const [insights, portfolio, users] = await Promise.all([
                    fetch(`${this.apiBase()}/insights/list.php`).then(r => r.json()),
                    fetch(`${this.apiBase()}/portfolio/list.php`).then(r => r.json()),
                    fetch(`${this.apiBase()}/users/list.php`).then(r => r.json())
                ]);
                this.insightsCount = Array.isArray(insights) ? insights.length : 0;
                this.portfolioCount = Array.isArray(portfolio) ? portfolio.length : 0;
                this.usersCount = Array.isArray(users) ? users.length : 0;
            } catch (e) {
                console.error('Erro ao carregar contagens', e);
            }
        },
        startFloorShake() {
            const floors = this.$el.querySelectorAll('.anim-right-wrap .floor');
            if (!floors.length) return;

            const floor = floors[Math.floor(Math.random() * floors.length)];
            floor.classList.add('shake');

            setTimeout(() => {
                floor.classList.remove('shake');
                floor.classList.add('pastel');
            }, 500);

            setTimeout(() => {
                floor.classList.remove('pastel');
            }, 3000);

            this.floorShakeTimer = setTimeout(() => this.startFloorShake(), 3500 + Math.random() * 1500);
        },
        async handleLogout() {
            try {
                await fetch(`${this.apiBase()}/auth/logout.php`, { method: 'POST' });
                this.$router.push('/login');
            } catch (e) {
                console.error('Erro ao sair', e);
            }
        }
    }
};
