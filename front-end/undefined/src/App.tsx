import React from 'react';
import AppRoutes from './routes/AppRoutes';
import './App.css';

/**
 * App agora apenas delega o controle de navegação ao AppRoutes.
 */
export default function App() {
  return (
    <div className='outterContainer'>
    <AppRoutes />;
    </div>
  )
  
}
