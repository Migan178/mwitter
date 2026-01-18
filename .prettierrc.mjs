import baseConfig from "@migan/prettier-config";

/** @type {import("prettier").Config} */

const config = {
	...baseConfig,
	plugins: [
		"prettier-plugin-tailwindcss",
		"@trivago/prettier-plugin-sort-imports",
	],
};

export default config;
