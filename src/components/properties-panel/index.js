import ReactDOM from 'react-dom';
import React from 'react';

import PropertiesView from './PropertiesView';

export default class PropertiesPanel {
  constructor(options) {
    const { modeler, container, flowMsg, setFlowMsg, forms } = options;

    ReactDOM.render(
      <PropertiesView
        modeler={modeler}
        flowMsg={flowMsg}
        forms={forms}
        setFlowMsg={setFlowMsg}
      />,
      container,
    );
  }
}
