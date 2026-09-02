import { createContext, useContext, ReactNode } from 'react';

interface ConfigContextType {
  appName: string;
  appVersion: string;
  apiBaseUrl: string;
  locale: string;
  theme: 'light' | 'dark';
  updateConfig: (config: Partial<ConfigContextType>) => void;
}

const defaultConfig: ConfigContextType = {
  appName: 'Farutech',
  appVersion: '1.0.0',
  apiBaseUrl: '',
  locale: 'es',
  theme: 'light',
  updateConfig: () => {},
};

const ConfigContext = createContext<ConfigContextType>(defaultConfig);

interface ConfigProviderProps {
  children: ReactNode;
  config?: Partial<ConfigContextType>;
}

export function ConfigProvider({ children, config }: ConfigProviderProps) {
  const mergedConfig = { ...defaultConfig, ...config };
  
  const updateConfig = (newConfig: Partial<ConfigContextType>) => {
    // En una implementación real, esto actualizaría el contexto
    console.log('Config actualizada:', newConfig);
  };

  return (
    <ConfigContext.Provider value={{ ...mergedConfig, updateConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig debe usarse dentro de un ConfigProvider');
  }
  return context;
}
