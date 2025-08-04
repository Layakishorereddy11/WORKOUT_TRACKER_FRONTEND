import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import '../styles/StatsWidget.css'; // Reuse styles for consistency

const TemplateWidget = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTemplates = async () => {
      if (!user || !user.user || !user.user.id) return;
      try {
        setLoading(true);
        const response = await userService.getTemplates(user.user.id);
        setTemplates(response.data);
      } catch (err) {
        console.error("Failed to fetch templates for widget", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, [user]);

  const handleDelete = async (templateId) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      try {
        await userService.deleteTemplate(user.user.id, templateId);
        setTemplates(templates.filter(t => t.id !== templateId));
      } catch (err) {
        console.error("Failed to delete template", err);
        alert("Error: Could not delete template.");
      }
    }
  };

  if (loading) return <div className="no-stats-text">Loading templates...</div>;

  return (
    <div className="stats-widget-container">
      <h2 className="widget-title">Your Templates</h2>
      <div className="muscle-breakdown">
        {templates.length > 0 ? (
          <ul>
            {templates.map(template => (
              <li key={template.id}>
                <span>{template.name}</span>
                <button onClick={() => handleDelete(template.id)} className="btn-delete-template">×</button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-stats-text">You have no saved templates.</p>
        )}
      </div>
    </div>
  );
};

export default TemplateWidget; 