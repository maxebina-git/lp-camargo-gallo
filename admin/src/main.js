const { createApp } = Vue;
const { createRouter, createWebHistory } = VueRouter;

// Import views (we will implement these files next)
import Login from './views/Login.js';
import Dashboard from './views/Dashboard.js';
import InsightsManager from './views/InsightsManager.js';
import PortfolioManager from './views/PortfolioManager.js';

const routes = [
    { path: '/', redirect: '/dashboard' },
    { path: '/login', component: Login },
    { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
    { path: '/insights', component: InsightsManager, meta: { requiresAuth: true } },
    { path: '/portfolio', component: PortfolioManager, meta: { requiresAuth: true } },
];

const router = createRouter({
    history: createWebHistory('/admin/'),
    routes,
});

router.beforeEach(async (to, from, next) => {
    if (to.meta.requiresAuth) {
        try {
            const response = await fetch('/api/auth/check_session.php');
            if (!response.ok) throw new Error('Unauthorized');
            next();
        } catch (e) {
            next('/login');
        }
    } else {
        next();
    }
});

const app = createApp({
    setup() {
        return {};
    }
});

app.use(router);
app.mount('#app');
