
import { useState } from 'react';
import LoginForm from './LoginForm'; // Asumiendo que está en el mismo directorio
import RegisterForm from './RegisterForm'; // Asumiendo que está en el mismo directorio

type View = 'login' | 'register';

export default function AuthContainer() {
    const [currentView, setCurrentView] = useState<View>('login');

    const handleSwitchView = (view: View) => {
        setCurrentView(view);
    };

    return (
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg mt-10 p-10">
            {currentView === 'login' ? (
                <LoginForm
                    // Pasar la función para cambiar al registro
                    onSwitchToRegister={() => handleSwitchView('register')}
                />
            ) : (
                <RegisterForm
                    // Pasar la función para cambiar al login después del registro exitoso
                    onSwitchToLogin={() => handleSwitchView('login')}
                />
            )}
        </div>
    );
}