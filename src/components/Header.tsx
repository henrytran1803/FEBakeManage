
const Header = () => {
    return (
        <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-center sm:justify-start gap-3">
                    <div className="flex items-center">
                        <img
                            src="/Bake.png"
                            alt="Bake Logo"
                            className="h-12 w-auto"
                        />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-3xl font-bold text-orange-600">BAKE</h1>
                        <p className="text-sm text-gray-600 italic">Fresh & Delicious</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;