import React, { useState } from 'react';
import { User, Lock } from 'lucide-react';

export interface LoginFormProps {
    onSubmit: (email: string, password: string) => void;
    isLoading?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoading) {
            onSubmit(username, password);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAF9F4]">
            {/* Background Design */}
            <div className="fixed left-0 bottom-0 justify-center">
                <div className="absolute left-[-250px] bottom-[-250px] w-[500px] h-[500px] rounded-full bg-[#F2CBCB]" />
                <div className="absolute left-[-200px] bottom-[-200px] w-[400px] h-[400px] rounded-full bg-[#F5E0E0]" />
                <div className="absolute left-[-150px] bottom-[-150px] w-[300px] h-[300px] rounded-full bg-[#FDEEEE]" />
            </div>
            <div className="w-full max-w-md p-8 relative">
                <div className="flex justify-center mb-8">
                    <img src="@/assets/logoapp.png" alt="Cafe Logo" className="w-20 h-20 object-contain" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="USERNAME"
                            className="w-full px-10 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#F2CBCB] focus:ring-1 focus:ring-[#F2CBCB] transition-colors text-sm"
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="PASSWORD"
                            className="w-full px-10 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#F2CBCB] focus:ring-1 focus:ring-[#F2CBCB] transition-colors text-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-[#F2CBCB] text-white rounded-lg hover:bg-opacity-90 transition-opacity font-medium text-sm"
                        disabled={isLoading}
                    >
                        {isLoading ? 'LOADING...' : 'LOGIN'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
