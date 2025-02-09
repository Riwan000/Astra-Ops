import { useNavigate, useLocation } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

export const BackButton = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return pathname !== '/' ? (
    <button
      onClick={() => navigate(-1)}
      className="fixed top-4 left-4 z-50 p-3 bg-space-dark/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-space-gray/20 transition-all"
    >
      <FiArrowLeft className="w-6 h-6 text-purple-400" />
    </button>
  ) : null;
}; 