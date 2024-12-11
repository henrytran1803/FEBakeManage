
import {User, Lock} from "lucide-react";
import {useState} from "react";
import {ApiResponse} from "@/types/ApiResponse.ts";
import {LoginData} from "@/types/Auth.ts";
import {login} from "@/services/AuthService.ts";
import { useNavigate } from 'react-router-dom';


const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error , setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async ( email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result: ApiResponse<LoginData> = await login(email, password);
      if (result.success) {
        const roles = result.data.user.roles;
        navigate(roles.includes("ROLE_MANAGE") ? "/admin/home" : "/employee");

        console.log(roles);
      } else {
        setError(result.message || "Login failed. Please check your credentials.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(isLoading)

    if (!isLoading){
      handleLogin(username, password);
    }
  };

  return (
      <div className="fixed inset-0 bg-[#FAF9F4] flex items-center justify-center">
        <div className="fixed left-0 bottom-0 justify-center">
          <div className="absolute left-[-250px] bottom-[-250px] w-[500px] h-[500px] rounded-full bg-[#F2CBCB]"/>
          <div className="absolute left-[-200px] bottom-[-200px] w-[400px] h-[400px] rounded-full bg-[#F5E0E0]"/>
          <div className="absolute left-[-150px] bottom-[-150px] w-[300px] h-[300px] rounded-full bg-[#FDEEEE]"/>
        </div>
        <div className="w-full max-w-md p-8 relative">
          <div className="flex justify-center mb-8">
            <img src="/src/assets/logoapp.png" alt="Cafe Logo" className="w-20 h-20 object-contain"/>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20}/>
              <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="USERNAME"
                  className="w-full px-10 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#F2CBCB] focus:ring-1 focus:ring-[#F2CBCB] transition-colors text-sm"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20}/>
              <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="PASSWORD"
                  className="w-full px-10 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#F2CBCB] focus:ring-1 focus:ring-[#F2CBCB] transition-colors text-sm"
              />
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

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

export default LoginPage;