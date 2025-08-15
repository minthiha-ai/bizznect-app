/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all files that contain Nativewind classes.
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                blue: {
                    100: '#016FAE'
                }
            },
            fontFamily: {
                poppins: ['Poppins-Regular', 'sans-serif'],
                "poppins-bold": ["Poppins-Bold", "sans-serif"],
                "poppins-medium": ["Poppins-Medium", "sans-serif"],
                "poppins-semibold": ["Poppins-SemiBold", "sans-serif"],
                "poppins-light": ["Poppins-Light", "sans-serif"],
                quicksand: ["Quicksand-Regular", "sans-serif"],
                "quicksand-bold": ["Quicksand-Bold", "sans-serif"],
                "quicksand-semibold": ["Quicksand-SemiBold", "sans-serif"],
                "quicksand-light": ["Quicksand-Light", "sans-serif"],
                "quicksand-medium": ["Quicksand-Medium", "sans-serif"],
            }
        },
    },
    plugins: [],
}
