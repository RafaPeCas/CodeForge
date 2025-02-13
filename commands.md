
# LARAVEL + REACT + TS + BREEZE + INERTIAJS + MONGODB
```Bash
$ composer create-project laravel/laravel test
$ cd test
$ composer require laravel/breeze --dev
$ php artisan breeze:install
$ bun install && bun run dev


$ php artisan migrate:fresh
$ php artisan serve
```

## tailwind

```Bash
$ bun rm tailwindcss
$ bun rm postcss


$ bun install tailwindcss @tailwindcss/vite
```

```
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
});

```

## remove?
@tailwindcss/forms
autoprefixer

## MONGODB
```
use MongoDB\Laravel\Eloquent\Model;
```