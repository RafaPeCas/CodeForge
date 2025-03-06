import { useState, ChangeEvent } from "react";
import Markdown from "marked-react";
import Lowlight from "react-lowlight";
import javascript from 'highlight.js/lib/languages/javascript';
import 'highlight.js/styles/default.css'

export const MarkdownEditor = () => {
    Lowlight.registerLanguage("js", javascript);
    const [markdownText, setMarkdownText] = useState("# HOLAA");
    const code = `const hello = "Hola Mundo"; console.log(hello);`;
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
            <Lowlight language="js" value={value} markers={[]} />
        </>
    );
};
