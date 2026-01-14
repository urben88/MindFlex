import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("MindFlex: Script de entrada cargado.");

const mountApp = () => {
  console.log("MindFlex: Intentando montar React...");
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error("MindFlex: No se encontró el elemento #root.");
    return;
  }

  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("MindFlex: React montado correctamente.");
  } catch (error) {
    console.error("MindFlex: Error durante el renderizado:", error);
    rootElement.innerHTML = `<div style="color:red; padding:20px; text-align:center;"><h2>Error al cargar la aplicación</h2><p>${error}</p></div>`;
  }
};

// Asegurar que el DOM está listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}