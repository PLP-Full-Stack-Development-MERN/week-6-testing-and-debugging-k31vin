import { useState, useEffect } from 'react';

const useDebug = (componentName, initialData) => {
const [debugData, setDebugData] = useState(initialData);

// Log component lifecycle events
useEffect(() => {
console.log(`[${componentName}] Component mounted`);

return () => {
    console.log(`[${componentName}] Component unmounted`);
};
}, [componentName]);

// Update debug data with new information
const updateDebugData = (newData) => {
setDebugData(prev => {
    const updated = { ...prev, ...newData };
    console.log(`[${componentName}] Debug data updated:`, updated);
    return updated;
});
};

return [debugData, updateDebugData];
};

export default useDebug;