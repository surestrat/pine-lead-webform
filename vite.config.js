import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			// Add this as a comment for documentation
			/* Alias Usage:
			 *
			 * Instead of: import Component from '../../components/Component'
			 * Use:        import Component from '@components/Component'
			 *
			 * Examples:
			 * import App from '@/App'                     // src/App
			 * import Button from '@components/Button'     // src/components/Button
			 * import logo from '@assets/images/logo.png'  // src/assets/images/logo.png
			 * import useData from '@hooks/useData'        // src/hooks/useData
			 * import formatDate from '@utils/formatDate'  // src/utils/formatDate
			 */
			"@": resolve(__dirname, "./src"),
			"@components": resolve(__dirname, "./src/components"),
			"@assets": resolve(__dirname, "./src/assets"),
			"@hooks": resolve(__dirname, "./src/hooks"),
			"@utils": resolve(__dirname, "./src/utils"),
			"@styles": resolve(__dirname, "./src/styles"),
			"@context": resolve(__dirname, "./src/context"),
			"@pages": resolve(__dirname, "./src/pages"),
			"@services": resolve(__dirname, "./src/services"),
			"@constants": resolve(__dirname, "./src/constants"),
			"@store": resolve(__dirname, "./src/store"),
			"@types": resolve(__dirname, "./src/types"),
			"@tests": resolve(__dirname, "./src/tests"),
			"@mock": resolve(__dirname, "./src/mock"),
			"@config": resolve(__dirname, "./src/config"),
			"@middleware": resolve(__dirname, "./src/middleware"),
			"@lib": resolve(__dirname, "./src/lib"),
			"@api": resolve(__dirname, "./src/api"),
			"@schemas": resolve(__dirname, "./src/schemas"),
		},
	},
});
