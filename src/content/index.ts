import { getFakerValue } from '../utils/dataGenerator';

chrome.runtime.onMessage.addListener((request: any, _sender: chrome.runtime.MessageSender, _sendResponse: (response?: any) => void) => {
  if (request.action === 'FILL_FORM') {
    const customMapping = request.customMapping || {};
    fillForm(customMapping);
  } else if (request.action === 'CLEAR_FORM') {
    clearForm();
  }
});

const fillForm = (customMapping: any) => {
  const inputs = document.querySelectorAll('input, textarea, select');
  
  inputs.forEach((input: any) => {
    // Skip hidden, submit, button, checkbox, radio for now or handle them specifically
    if (['submit', 'button', 'hidden', 'checkbox', 'radio'].includes(input.type)) return;

    const fieldInfo = {
      type: input.type,
      name: input.name || '',
      id: input.id || '',
      placeholder: input.placeholder || ''
    };

    const value = getFakerValue(fieldInfo, customMapping);
    
    // Set value and trigger events
    input.value = value;
    
    // Trigger events so React/Vue/etc. pick up the changes
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
};

const clearForm = () => {
  const inputs = document.querySelectorAll('input, textarea, select');
  inputs.forEach((input: any) => {
    if (['submit', 'button', 'hidden'].includes(input.type)) return;
    
    if (input.type === 'checkbox' || input.type === 'radio') {
      input.checked = false;
    } else {
      input.value = '';
    }
    
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
};
