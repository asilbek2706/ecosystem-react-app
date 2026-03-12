import { createContext, type ReactNode, useContext, useState } from 'react';

interface BackgroundContextType {
    theme: string;
    setTheme: (theme: string) => void;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(
    undefined
);

interface IProps {
    children: ReactNode;
}

export const BackgroundProvider = ({ children }: IProps) => {
    const [theme, setTheme] = useState('eco-light');

    return (
        <BackgroundContext.Provider value={{ theme, setTheme }}>
            <div className={`app-background ${theme}`}>{children}</div>
        </BackgroundContext.Provider>
    );
};

export const useBackground = () => {
    const context = useContext(BackgroundContext);
    if (!context)
        throw new Error('useBackground must be used within BackgroundProvider');
    return context;
};
