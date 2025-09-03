import { useState, ChangeEvent } from "react";
import Markdown from "marked-react";
import Lowlight from "react-lowlight";
import javascript from 'highlight.js/lib/languages/javascript';
import java from 'highlight.js/lib/languages/vbscript-html';
import 'highlight.js/styles/default.css'

export const MarkdownEditor = () => {
    Lowlight.registerLanguage("js", javascript);
    Lowlight.registerLanguage("java", java);
    const [markdownText, setMarkdownText] = useState("# HOLAA");
    const code = `const code = const hello = "Hola Mundo"; console.log(hello);`;
    const value = `<textarea id="MarkdownArea" value={markdownText} onChange={update} className="border p-2 w-full h-32"/>`;

    function update(event: ChangeEvent<HTMLTextAreaElement>) {
        setMarkdownText(event.target.value);
    }

    return (
        <>
            <textarea 
                id="MarkdownArea" 
                value={markdownText} 
                onChange={update} 
                className="border p-2 w-full h-32"
            />
            <div className="prose dark:prose-invert">
                <Markdown>{markdownText}</Markdown>
            </div>
            <Lowlight language="js" value={code} markers={[]} />
            <Lowlight language="java" value={value} markers={[]} />
        </>
    );
};
