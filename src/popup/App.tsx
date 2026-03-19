import { useState, useEffect } from 'react';
import { Plane, Trash2, Settings } from 'lucide-react';

const App = () => {
  const [status, setStatus] = useState<string>('');
  const [showSettings, setShowSettings] = useState(false);
  const [mappings, setMappings] = useState<Record<string, string>>({});

  useEffect(() => {
    // Load mappings from storage
    chrome.storage.sync.get(['fieldMappings'], (result: { fieldMappings?: Record<string, string> }) => {
      if (result.fieldMappings) {
        setMappings(result.fieldMappings);
      }
    });
  }, []);

  const handleFill = async () => {
    setStatus('Filling...');
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (tab?.id) {
      chrome.tabs.sendMessage(tab.id, { 
        action: 'FILL_FORM',
        customMapping: mappings
      });
      setTimeout(() => setStatus('Form filled!'), 500);
    } else {
      setStatus('No active tab found');
    }
  };

  const handleClear = async () => {
    setStatus('Clearing...');
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (tab?.id) {
      chrome.tabs.sendMessage(tab.id, { action: 'CLEAR_FORM' });
      setTimeout(() => setStatus('Form cleared!'), 500);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setStatus(''), 3000);
    return () => clearTimeout(timer);
  }, [status]);

  return (
    <div className="app-container">
      <header>
        <h1>formPilot</h1>
        <button className="btn-outline" style={{ padding: '8px' }} onClick={() => setShowSettings(!showSettings)}>
          <Settings size={18} />
        </button>
      </header>

      <div className="card">
        <div className="actions">
          <button className="btn-primary" onClick={handleFill}>
            <Plane size={20} />
            Fill Form
          </button>
          <button className="btn-outline" onClick={handleClear}>
            <Trash2 size={20} />
            Clear Form
          </button>
        </div>
      </div>

      {status && (
        <div className="status" style={{ 
          fontSize: '12px', 
          color: status.includes('filled') ? '#22c55e' : '#94a3b8',
          textAlign: 'center',
          animation: 'fadeIn 0.3s ease'
        }}>
          {status}
        </div>
      )}

      {showSettings ? (
        <div className="card mapping-section" style={{ animation: 'slideDown 0.3s ease' }}>
          <div className="mapping-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Field Mappings</span>
            <button className="btn-outline" style={{ padding: '2px 6px', fontSize: '10px' }} 
              onClick={() => {
                const key = prompt('Field name keyword (e.g. "username"):');
                const val = prompt('Faker method (e.g. "internet.userName"):');
                if (key && val) {
                  const newMappings = { ...mappings, [key]: val };
                  setMappings(newMappings);
                  chrome.storage.sync.set({ fieldMappings: newMappings });
                }
              }}>
              + Add
            </button>
          </div>
          <div className="mapping-list">
            {Object.entries(mappings).length === 0 ? (
              <div style={{ fontSize: '12px', color: '#94a3b8', padding: '10px' }}>No custom mappings. Using defaults.</div>
            ) : (
              Object.entries(mappings).map(([key, val]) => (
                <div className="mapping-item" key={key}>
                  <span title={key}>{key}</span>
                  <code>{val as string}</code>
                  <Trash2 size={14} style={{ cursor: 'pointer', color: '#ef4444' }} onClick={() => {
                    const newMappings = { ...mappings };
                    delete newMappings[key];
                    setMappings(newMappings);
                    chrome.storage.sync.set({ fieldMappings: newMappings });
                  }} />
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="footer">
          Ready to pilot your forms.
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default App;
