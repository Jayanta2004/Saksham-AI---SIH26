import React, { createContext, useContext, useState } from 'react';
const LanguageContext = createContext(null);
export const labels = { en: { dashboard: 'Dashboard', notifications: 'Notifications', portal: 'Portal Home' }, hi: { dashboard: 'डैशबोर्ड', notifications: 'सूचनाएं', portal: 'पोर्टल होम' } };
export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem('saksham_language') || 'en');
  const changeLanguage = value => { localStorage.setItem('saksham_language', value); setLanguage(value); };
  return <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t: labels[language] }}>{children}</LanguageContext.Provider>;
}
export const useLanguage = () => useContext(LanguageContext);
