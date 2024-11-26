/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: [
	  "./pages/**/*.{ts,tsx}",
	  "./components/**/*.{ts,tsx}",
	  "./app/**/*.{ts,tsx}",
	  "./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
	  container: {
		center: true,
		padding: "2rem",
		screens: {
		  "2xl": "1400px",
		},
	  },
	  extend: {
		screens: {
		  'xs': '375px',    // Thêm breakpoint cho điện thoại nhỏ
		  'sm': '640px',    // Điện thoại lớn
		  'md': '768px',    // Tablet
		  'lg': '1024px',   // Laptop nhỏ
		  'xl': '1280px',   // Laptop lớn
		  '2xl': '1536px',  // Màn hình lớn
		},
		gridTemplateColumns: {
		  'auto-fill-100': 'repeat(auto-fill, minmax(100px, 1fr))',
		  'auto-fill-200': 'repeat(auto-fill, minmax(200px, 1fr))',
		},
	  },
	},
	plugins: [require("tailwindcss-animate")],
  }