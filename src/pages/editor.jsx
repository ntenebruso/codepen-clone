import dynamic from "next/dynamic";
import { useState } from "react"; 
const EditorPanel = dynamic(() => import("../components/EditorPanel"), { ssr: false });

export default function Editor() {
    const [html, setHtml] = useState(null);
    const [css, setCss] = useState(null);
    const [js, setJs] = useState(null);

    return (
        <>
            <div className="editor-panels">
                <EditorPanel value={html} displayName="HTML" language="xml" onChange={setHtml} />
                <EditorPanel value={css} displayName="CSS" language="css" onChange={setCss} />
                <EditorPanel value={js} displayName="JS" language="javascript" onChange={setJs} />
            </div>
        </>
    )
}