export default {
    template: `
    <style>
    .anim-wrap { position: relative; width: 224px; height: 238px; margin: 0 auto 24px; }
    .anim-wrap .scene { position: relative; width: 320px; height: 340px; transform: scale(0.7); transform-origin: top left; }
    .anim-wrap .particles { position: absolute; inset: 0; pointer-events: none; }
    .anim-wrap .particle { position: absolute; width: 3px; height: 3px; background: rgba(212,160,84,0.4); border-radius: 50%; animation: particleFloat 8s ease-in-out infinite; }
    .anim-wrap .particle:nth-child(1) { left: 15%; top: 20%; animation-delay: 0s; animation-duration: 7s; }
    .anim-wrap .particle:nth-child(2) { left: 75%; top: 30%; animation-delay: 1s; animation-duration: 9s; }
    .anim-wrap .particle:nth-child(3) { left: 40%; top: 60%; animation-delay: 2s; animation-duration: 6s; }
    .anim-wrap .particle:nth-child(4) { left: 85%; top: 70%; animation-delay: 3s; animation-duration: 8s; }
    .anim-wrap .particle:nth-child(5) { left: 25%; top: 80%; animation-delay: 4s; animation-duration: 10s; }
    .anim-wrap .particle:nth-child(6) { left: 60%; top: 15%; animation-delay: 0.5s; animation-duration: 7.5s; }
    .anim-wrap .particle:nth-child(7) { left: 10%; top: 50%; animation-delay: 2.5s; animation-duration: 8.5s; }
    .anim-wrap .particle:nth-child(8) { left: 90%; top: 45%; animation-delay: 1.5s; animation-duration: 6.5s; }
    .anim-wrap .ground { position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 260px; height: 4px; background: linear-gradient(90deg, transparent, #d4a054, #e8b96a, #d4a054, transparent); border-radius: 2px; animation: groundPulse 3s ease-in-out infinite; }
    .anim-wrap .building { position: absolute; bottom: 4px; left: 50%; transform: translateX(-50%); width: 120px; display: flex; flex-direction: column-reverse; align-items: center; gap: 3px; }
    .anim-wrap .floor { width: 100%; height: 22px; background: linear-gradient(135deg, #1a1a2e, #16213e); border: 1px solid rgba(212,160,84,0.15); border-radius: 2px; opacity: 0; transform: translateY(20px) scaleY(0); transform-origin: bottom; animation: buildFloor 4s ease-out infinite; position: relative; overflow: hidden; }
    .anim-wrap .floor::after { content: ''; position: absolute; inset: 3px; background: repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(212,160,84,0.08) 8px, rgba(212,160,84,0.08) 9px); }
    .anim-wrap .floor:nth-child(1) { animation-delay: 0s; }
    .anim-wrap .floor:nth-child(2) { animation-delay: 0.4s; }
    .anim-wrap .floor:nth-child(3) { animation-delay: 0.8s; }
    .anim-wrap .floor:nth-child(4) { animation-delay: 1.2s; }
    .anim-wrap .floor:nth-child(5) { animation-delay: 1.6s; }
    .anim-wrap .floor:nth-child(6) { animation-delay: 2.0s; }
    .anim-wrap .floor:nth-child(7) { animation-delay: 2.4s; }
    .anim-wrap .floor .window { position: absolute; width: 8px; height: 10px; background: rgba(212,160,84,0.25); border-radius: 1px; top: 50%; transform: translateY(-50%); animation: windowFlicker 3s ease-in-out infinite; }
    .anim-wrap .floor .window:nth-child(1) { left: 10px; animation-delay: 0.5s; }
    .anim-wrap .floor .window:nth-child(2) { left: 24px; animation-delay: 1.2s; }
    .anim-wrap .floor .window:nth-child(3) { left: 38px; animation-delay: 0.8s; }
    .anim-wrap .floor .window:nth-child(4) { left: 52px; animation-delay: 1.5s; }
    .anim-wrap .floor .window:nth-child(5) { left: 66px; animation-delay: 0.3s; }
    .anim-wrap .floor .window:nth-child(6) { left: 80px; animation-delay: 1.8s; }
    .anim-wrap .floor .window:nth-child(7) { left: 94px; animation-delay: 0.7s; }
    .anim-wrap .crane { position: absolute; bottom: 4px; right: 20px; width: 4px; height: 200px; animation: craneAppear 4s ease-out infinite; }
    .anim-wrap .crane-mast { position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 4px; height: 100%; background: repeating-linear-gradient(0deg, #c9944a, #c9944a 8px, #a0773a 8px, #a0773a 10px); }
    .anim-wrap .crane-jib { position: absolute; top: 0; left: -80px; width: 160px; height: 3px; background: #c9944a; transform-origin: right center; animation: jibSwing 6s ease-in-out infinite; }
    .anim-wrap .crane-cable { position: absolute; top: 3px; left: -80px; width: 1px; height: 40px; background: rgba(201,148,74,0.5); animation: cableLength 4s ease-in-out infinite; transform-origin: top center; }
    .anim-wrap .crane-hook { position: absolute; top: 3px; left: -84px; width: 9px; height: 9px; border: 2px solid #c9944a; border-radius: 0 0 50% 50%; border-top: none; animation: hookSwing 4s ease-in-out infinite; transform-origin: top center; }
    .anim-wrap .crane-block { position: absolute; left: -88px; width: 12px; height: 8px; background: #d4a054; border-radius: 1px; animation: blockLift 4s ease-in-out infinite; }
    .anim-wrap .dust { position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); width: 140px; height: 30px; background: radial-gradient(ellipse, rgba(212,160,84,0.12), transparent 70%); animation: dustPulse 4s ease-in-out infinite; }
    @keyframes groundPulse { 0%, 100% { opacity: 0.6; width: 260px; } 50% { opacity: 1; width: 280px; } }
    @keyframes buildFloor { 0% { opacity: 0; transform: translateY(20px) scaleY(0); } 15% { opacity: 1; transform: translateY(0) scaleY(1); } 70% { opacity: 1; transform: translateY(0) scaleY(1); } 85% { opacity: 0.3; transform: translateY(-5px) scaleY(1.05); } 100% { opacity: 0; transform: translateY(-10px) scaleY(0); } }
    @keyframes windowFlicker { 0%, 100% { opacity: 0.2; background: rgba(212,160,84,0.2); } 50% { opacity: 1; background: rgba(232,185,106,0.6); } }
    @keyframes craneAppear { 0% { opacity: 0; height: 0; } 20% { opacity: 1; height: 200px; } 80% { opacity: 1; height: 200px; } 100% { opacity: 0; height: 0; } }
    @keyframes jibSwing { 0%, 100% { transform: rotate(-8deg); } 50% { transform: rotate(8deg); } }
    @keyframes cableLength { 0%, 100% { height: 40px; } 50% { height: 70px; } }
    @keyframes hookSwing { 0%, 100% { transform: rotate(-15deg); } 50% { transform: rotate(15deg); } }
    @keyframes blockLift { 0% { top: 44px; opacity: 1; } 50% { top: 74px; opacity: 1; } 100% { top: 44px; opacity: 0.5; } }
    @keyframes particleFloat { 0%, 100% { transform: translateY(0) translateX(0); opacity: 0; } 10% { opacity: 0.6; } 50% { transform: translateY(-40px) translateX(15px); opacity: 0.3; } 90% { opacity: 0.6; } }
    @keyframes dustPulse { 0%, 100% { opacity: 0; transform: translateX(-50%) scaleX(0.8); } 50% { opacity: 1; transform: translateX(-50%) scaleX(1.2); } }
    @media (max-width: 480px) { .anim-wrap { width: 179px; height: 190px; } .anim-wrap .scene { transform: scale(0.56); } .anim-wrap .crane { right: 0; } }
    </style>
    <div class="min-h-screen flex">
        <!-- Sidebar -->
        <aside class="w-64 bg-gray-800 text-white flex flex-col">
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
            
            <div class="flex justify-center">
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

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                    <h3 class="text-gray-500 text-sm font-medium">Insights</h3>
                    <p class="text-2xl font-bold text-gray-800">{{ insightsCount }} Artigos Publicados</p>
                    <router-link to="/insights" class="text-blue-600 text-sm hover:underline">Acessar →</router-link>
                </div>
                <div class="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
                    <h3 class="text-gray-500 text-sm font-medium">Portfólio</h3>
                    <p class="text-2xl font-bold text-gray-800">{{ portfolioCount }} Cases</p>
                    <router-link to="/portfolio" class="text-green-600 text-sm hover:underline">Acessar →</router-link>
                </div>
                <div class="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
                    <h3 class="text-gray-500 text-sm font-medium">Usuários</h3>
                    <p class="text-2xl font-bold text-gray-800">{{ usersCount }} Usuários</p>
                    <router-link to="/users" class="text-purple-600 text-sm hover:underline">Acessar →</router-link>
                </div>
            </div>
        </main>
    </div>
    `,
    data() {
        return {
            insightsCount: 0,
            portfolioCount: 0,
            usersCount: 0
        };
    },
    mounted() {
        this.fetchCounts();
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
