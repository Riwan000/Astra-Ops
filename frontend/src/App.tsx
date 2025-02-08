import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Operations from './pages/Operations';
import Assistant from './pages/Assistant';
import './App.css';
import 'cesium/Build/Cesium/Widgets/widgets.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/operations" element={<Operations />} />
          <Route path="/assistant" element={<Assistant />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
