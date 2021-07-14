import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react"; 
const EditorPanel = dynamic(() => import("../components/EditorPanel"), { ssr: false });

export default function Editor() {
    const [html, setHtml] = useState("");
    const [css, setCss] = useState("");
    const [js, setJs] = useState("");
    const [srcDoc, setSrcDoc] = useState(null);
    const [consoleItems, setConsoleItems] = useState([]);
    const outputFrame = useRef();
    const consoleRef = useRef();

    const srcDocTemplate = `
        <!DOCTYPE html>
        <html>
            <body>${html}</body>
            <style>${css}</style>
            <script>
                //injected by editor
                const _log = console.log;
                console.log = (m) => {
                    window.parent.postMessage({
                        source: "iframe",
                        message: m.toString(),
                        type: "log"
                    }, "*");
                };

                window.addEventListener("error", (message, source, lineno, colno, error) => {
                    window.parent.postMessage({
                        source: "iframe",
                        message: JSON.parse(JSON.stringify(message, ["message"])).message,
                        type: "error"
                    }, "*");
                });
            </script>
            <script>${js}</script>
        </html>
    `;

    useEffect(() => {
        const timeout = setTimeout(() => {
            setSrcDoc(srcDocTemplate);
        }, 750);

        return () => {
            clearTimeout(timeout);
        }
    }, [html, css, js]);

    useEffect(() => {
        function handleMessage(res) {
            if (res.data && res.data.source == "iframe") {
                const newConsoleItems = consoleItems.concat({msg: res.data.message, type: res.data.type});
                setConsoleItems(newConsoleItems);
                consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
            }
        }
        window.addEventListener("message", handleMessage);

        return () => {
            window.removeEventListener("message", handleMessage);
        }
    }, [consoleItems]);

    return (
        <>
            <div className="editor-header">
                <h1>Pen title</h1>
                <div className="btns">
                    <button onClick={() => { setSrcDoc(srcDocTemplate); outputFrame.current.contentWindow.location.reload(); }}>Run</button>
                </div>
            </div>
            <div className="editor-panels">
                <EditorPanel value={html} displayName="HTML" language="xml" onChange={setHtml} />
                <EditorPanel value={css} displayName="CSS" language="css" onChange={setCss} />
                <EditorPanel value={js} displayName="JS" language="javascript" onChange={setJs} />
            </div>
            <div className="output">
                <iframe ref={outputFrame} srcDoc={srcDoc} frameBorder="0" width="100%" height="100%"></iframe>
            </div>
            <div className="console" ref={consoleRef}>
                <button onClick={() => { setConsoleItems([]) }}>Clear console</button>
                {consoleItems.map((item, index) => (
                    <div key={index} className={item.type}>{item.msg}</div>
                ))}
            </div>
        </>
    )
}