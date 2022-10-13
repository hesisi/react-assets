import React, { useState, useRef, useContext } from 'react';
import MonacoEditor from 'react-monaco-editor';
import { designerContext } from '..';

function JsonEditor() {
  const editorRef = useRef();
  const [editorValue, seteditorValue] = useState('');
  const { comp, setComp } = useContext(designerContext);
  const options = {
    selectOnLineNumbers: true,
  };
  // editorRef.getAction('editor.action.formatDocument').run()
  const onChange = (v) => {
    console.log('editor value', v);
    // seteditorValue(v)
    setComp(JSON.parse(v));
  };
  const editorDidMountHandle = (editor, monaco) => {
    // editor.getAction('editor.action.formatDocument').run()
  };
  return (
    <MonacoEditor
      width="100%"
      height="calc(100vh - 200px)"
      language="json"
      theme="vs"
      value={JSON.stringify(comp)}
      // value={editorValue}
      options={options}
      onChange={(v) => onChange(v)}
      ref={editorRef}
      editorDidMount={editorDidMountHandle}
    />
  );
}

export default JsonEditor;
