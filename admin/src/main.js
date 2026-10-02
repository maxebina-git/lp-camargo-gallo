const { createApp } = Vue;
const { createRouter, createWebHistory } = VueRouter;

// Import views (we will implement these files next)
// Last updated: 2026-10-01 to fix routing and use production builds
import Login from './views/Login.js';
import Dashboard from './views/Dashboard.js';
import InsightsManager from './views/InsightsManager.js';
import PortfolioManager from './views/PortfolioManager.js';

const routes = [
    { path: '/', redirect: '/dashboard' },
    { path: '/index.html', redirect: '/' }, // Handle direct access to index.html
    { path: '/login', component: Login },
    { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
    { path: '/insights', component: InsightsManager, meta: { requiresAuth: true } },
    { path: '/portfolio', component: PortfolioManager, meta: { requiresAuth: true } },
];

const router = createRouter({
    history: createWebHistory(window.location.pathname.includes('/admin/') ? '/admin/' : '/staging/admin/'),
    routes,
});

router.beforeEach(async (to, from, next) => {
    if (to.meta.requiresAuth) {
        try {
            const apiBase = window.location.pathname.includes('/staging/') ? '/staging/api' : '/api';
            const response = await fetch(`${apiBase}/auth/check_session.php`);
            if (!response.ok) throw new Error('Unauthorized');
            next();
        } catch (e) {
            next('/login');
        }
    } else {
        next();
    }
};

const app = createApp({
    template: '<router-view/>'
});

app.use(router);
app.mount('#app');
