import './App.css';
import React from 'react';
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from './pages/Home';
import EditorPage from './pages/EditorPage';
function App() {
  return <>
    <div>
      <Toaster position='top-right' toastOptions={
        {
          success: {
            theme: {
              primary: '#4aed88'
            }
          }
        }}></Toaster>
    </div>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/editor/:roomId" element={<EditorPage />} />
    </Routes>
  </>
}

export default App;
