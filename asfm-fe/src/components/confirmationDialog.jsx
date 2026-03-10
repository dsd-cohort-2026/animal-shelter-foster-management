import { CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';

function ConfirmationDialog({ primaryText, secondaryText, button, onClose, type }) {
  const iconMap = {
    success: <CheckCircle size={56} color="#10b981" strokeWidth={1.5} />,
    error: <AlertCircle size={56} color="#ef4444" strokeWidth={1.5} />,
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-100"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-12 max-w-105 w-[90%] shadow-lg relative flex flex-col items-center text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-4xl cursor-pointer w-9 h-9 text-gray-600 hover:text-gray-800"
        >
          ×
        </button>

        <div className="mb-6 mt-2">{iconMap[type]}</div>
        <h2 className="text-xl font-semibold mb-3 mt-0">{primaryText}</h2>

        <p className="text-sm text-gray-600 mb-8 leading-relaxed">{secondaryText}</p>

        <Button
          variant={type === 'success' ? 'secondary' : 'destructive'}
          onClick={onClose}
          className="min-w-30"
        >
          {button || 'Done'}
        </Button>
      </div>
    </div>
  );
}

export default ConfirmationDialog;
