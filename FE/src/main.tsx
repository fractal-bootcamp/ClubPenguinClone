import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import Room from '../components/common/Room.tsx';
import MapCreator from './MapCreator.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Room />,
  },
  {
    path: '/map-creator',
    element: <MapCreator />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />

  </React.StrictMode>,
);
