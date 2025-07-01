import "./App.css";
import Canvas from "./Canvas";
import ProductPage from "./pages/product-page/ProductPage";
import { RedirectButton } from "./RedirectButton";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// import * as THREE from "three";
// import { ARButton } from "three/examples/jsm/webxr/ARButton";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import { XREstimatedLight } from "three/examples/jsm/webxr/XREstimatedLight";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/playground/ar-things" element={<ProductPage />} />
        <Route path="/playground/ar-things/canvas" element={<Canvas />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
