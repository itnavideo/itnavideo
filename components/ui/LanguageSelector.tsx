import { LANGUAGES } from '@/constants/languages';

export const LanguageSelector = ({ value, onChange }) => {
  return (
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      className="p-2 border rounded bg-white text-black w-full"
    >
      {LANGUAGES.map((lang) => (
        <option key={lang.value} value={lang.value}>
          {lang.label}
        </option>
      ))}
    </select>
  );
};