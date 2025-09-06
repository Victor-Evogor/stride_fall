import { type FunctionComponent, useEffect} from "react"

// Purchase notification component
const PurchaseNotification: FunctionComponent<{
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-white font-bold transition-all duration-300 ${
        type === 'success' ? 'bg-green-600' : 'bg-red-600'
      }`}
      style={{
        textShadow: "1px 1px 0px #000",
        animation: "slideInRight 0.3s ease-out"
      }}
    >
      {message}
    </div>
  );
};


export default PurchaseNotification