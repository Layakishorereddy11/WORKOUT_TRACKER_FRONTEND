import React from 'react';
import '../styles/TemplateModal.css';

const TemplateModal = ({ templates, onSelect, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Select a Template</h2>
          <button onClick={onClose} className="btn-close-modal">×</button>
        </div>
        <div className="modal-body">
          {templates.length > 0 ? (
            <ul className="template-list">
              {templates.map(template => (
                <li key={template.id} onClick={() => onSelect(template)}>
                  {template.name}
                </li>
              ))}
            </ul>
          ) : (
            <p>You have no saved templates.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateModal; 