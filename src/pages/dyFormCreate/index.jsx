import React, { useEffect } from 'react';
import './index.less';

export default function DyFormCreate() {
  useEffect(() => {}, []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <iframe
        className="dyForm-container"
        frameborder="0"
        allowTransparency="true"
        style={{ width: '100%', height: '100%' }}
        src="http://localhost:9996/tool-datav/index"
      ></iframe>
    </div>
  );
}
