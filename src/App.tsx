import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PriceBoardEditor from "@/pages/PriceBoardEditor";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/page/8879" replace />} />
        <Route path="/page/:pageId" element={<PriceBoardEditor />} />
      </Routes>
    </Router>
  );
}
