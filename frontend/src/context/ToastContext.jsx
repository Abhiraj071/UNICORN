import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { 
  FiCheckCircle, 
  FiAlertCircle, 
  FiInfo, 
  FiAlertTriangle, 
  FiX 
} from 'react-icons/fi';
import './Toast.css';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [activeModal, setActiveModal] = useState(null);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg, duration) => addToast(msg, 'success', duration),
    error: (msg, duration) => addToast(msg, 'error', duration),
    info: (msg, duration) => addToast(msg, 'info', duration),
    warning: (msg, duration) => addToast(msg, 'warning', duration),
  };

  // Intercept any native browser alert(...) calls across the app and render them as modern toasts
  useEffect(() => {
    const originalAlert = window.alert;
    window.alert = (msg) => {
      if (!msg) return;
      const strMsg = String(msg);
      const lower = strMsg.toLowerCase();
      if (lower.includes('error') || lower.includes('failed') || lower.includes('cannot') || lower.includes('invalid')) {
        addToast(strMsg, 'error', 4000);
      } else if (lower.includes('success') || lower.includes('added') || lower.includes('updated') || lower.includes('deleted') || lower.includes('thank')) {
        addToast(strMsg, 'success', 3500);
      } else {
        addToast(strMsg, 'info', 3500);
      }
    };
    return () => {
      window.alert = originalAlert;
    };
  }, [addToast]);

  const showAlert = useCallback(({ title = 'NOTICE', message, type = 'info', onConfirm, showCancel = false, confirmText = 'OK', cancelText = 'CANCEL' }) => {
    return new Promise((resolve) => {
      setActiveModal({
        title,
        message,
        type,
        showCancel,
        confirmText,
        cancelText,
        onConfirm: () => {
          if (onConfirm) onConfirm();
          setActiveModal(null);
          resolve(true);
        },
        onCancel: () => {
          setActiveModal(null);
          resolve(false);
        }
      });
    });
  }, []);

  return (
    <ToastContext.Provider value={{ toast, showAlert }}>
      {children}

      {/* Floating Toast Notification Container */}
      <div className="toast-container">
        {toasts.map((t) => {
          let Icon = FiInfo;
          if (t.type === 'success') Icon = FiCheckCircle;
          if (t.type === 'error') Icon = FiAlertCircle;
          if (t.type === 'warning') Icon = FiAlertTriangle;

          return (
            <div key={t.id} className={`toast-item toast-${t.type}`}>
              <div className="toast-icon">
                <Icon />
              </div>
              <div className="toast-body">
                <span className="toast-message">{t.message}</span>
              </div>
              <button 
                onClick={() => removeToast(t.id)} 
                className="toast-close-btn"
                aria-label="Close notification"
              >
                <FiX size={14} />
              </button>
              <div 
                className="toast-progress" 
                style={{ animationDuration: `${t.duration}ms` }} 
              />
            </div>
          );
        })}
      </div>

      {/* Modern Alert Modal Overlay */}
      {activeModal && (
        <div className="alert-modal-overlay">
          <div className="alert-modal-card">
            <div className={`alert-modal-icon-wrapper ${activeModal.type}`}>
              {activeModal.type === 'success' && <FiCheckCircle />}
              {activeModal.type === 'error' && <FiAlertCircle />}
              {activeModal.type === 'warning' && <FiAlertTriangle />}
              {activeModal.type === 'info' && <FiInfo />}
            </div>
            <h3 className="alert-modal-title">{activeModal.title}</h3>
            <p className="alert-modal-message">{activeModal.message}</p>
            <div className="alert-modal-actions">
              {activeModal.showCancel && (
                <button 
                  onClick={activeModal.onCancel} 
                  className="alert-modal-btn-cancel"
                >
                  {activeModal.cancelText}
                </button>
              )}
              <button 
                onClick={activeModal.onConfirm} 
                className="alert-modal-btn-gold"
                autoFocus
              >
                {activeModal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
