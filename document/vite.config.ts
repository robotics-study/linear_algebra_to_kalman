import {defineConfig} from 'vite';


export default defineConfig(({mode}) => {
    return {
        base: mode == 'production' ? '/linear_algebra_to_kalman' : '/',
        server: {
            host: true,
            port: 3000
        }
    }
});
