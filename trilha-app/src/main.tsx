import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { iniciarNativo } from './nativo';
import '@fontsource/familjen-grotesk/400.css';
import '@fontsource/familjen-grotesk/500.css';
import '@fontsource/familjen-grotesk/600.css';
import '@fontsource/familjen-grotesk/700.css';
import './v1.css';
import './app.css';

createRoot(document.getElementById('raiz')!).render(<StrictMode><App /></StrictMode>);

void iniciarNativo();
