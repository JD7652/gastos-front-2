import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

interface AuthPanelProps {
    onAuthSuccess?: () => void;
}

function AuthPanel({ onAuthSuccess }: AuthPanelProps) {
    const [showLogin, setShowLogin] = useState(true);

    const handleRegisterSuccess = () => {
        setShowLogin(true); // cambiar a login después de registrar
    };

    return (
        <div className="flex flex-col items-center justify-center gap-6 bg-white rounded-2xl shadow-xl py-10 px-6 max-w-xl mx-auto">
            {showLogin ? (
                <>
                    <LoginForm onLogin={onAuthSuccess} />
                    <div className="text-center mt-8 w-full">
                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-6 py-2 rounded-lg font-bold transition-all shadow w-full"
                            onClick={() => setShowLogin(false)}
                        >
                            Registrarse
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <RegisterForm onRegister={handleRegisterSuccess} />
                    <div className="text-center mt-6 w-full">
                        <button
                            className="bg-gray-200 hover:bg-blue-50 text-blue-600 text-lg px-6 py-2 rounded-lg font-bold transition-all w-full border border-blue-200"
                            onClick={() => setShowLogin(true)}
                        >
                            Iniciar Sesión
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default AuthPanel;