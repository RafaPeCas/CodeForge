import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import AppLayout from './Layouts/AppLayout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,

        resolve: async (name) => {
            const page = (await import(`./Pages/${name}`)).default;
            page.layout ??= (page:any) => <AppLayout>{page}</AppLayout>;
            return page;
        },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
        <App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
