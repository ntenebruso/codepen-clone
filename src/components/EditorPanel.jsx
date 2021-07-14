import { Controlled } from "react-codemirror2-react-17";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/xml/xml";
import "codemirror/mode/css/css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/edit/closetag";

export default function EditorPanel({ value, language, displayName, onChange }) {
    function handleChange(editor, data, value) {
        onChange(value);
    }

    return (
        <div className="editor-panel">
            <div className="title">{displayName}</div>
            <Controlled
                value={value}
                onBeforeChange={handleChange}
                options={{
                    lineWrapping: true,
                    lint: true,
                    mode: language,
                    theme: "material",
                    lineNumbers: true,
                    indentUnit: 2,
                    tabSize: 2,
                    smartIndent: true,
                    indentWithTabs: false,
                    autocorrect: true,
                    autoCloseBrackets: true,
                    autoCloseTags: true
                }}
                className="codemirror-wrapper"
            />
        </div>
    )
}