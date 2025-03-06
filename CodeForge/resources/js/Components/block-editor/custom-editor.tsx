import { useState, ChangeEvent } from "react";
import Markdown from "marked-react";

export const MarkdownEditor = () => {
    const [markdownText, setMarkdownText] = useState("# HOLAA");

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
        </>
    );
};
