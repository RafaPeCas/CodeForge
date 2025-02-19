import "./SpaceForm.css";
import { Button } from "../index";

interface Props {
    inputValue: string;
    textareaDescription: string;
    changeHandler: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const Form = ({
    inputValue,
    textareaDescription,
    changeHandler,
    onSubmit,
}: Props) => {
    return (
        <form className="project-form" onSubmit={onSubmit}>
            <input
                type="text"
                name="name"
                placeholder="Project Name"
                value={inputValue}
                onChange={changeHandler}
                className="w-full p-2 border rounded mb-2"
                required
            />
            <textarea
                name="description"
                placeholder="Project Description"
                value={textareaDescription}
                onChange={changeHandler}
                className="w-full p-2 border rounded mb-2"
                required
            />
            <Button type="submit" className="w-full">
                Create
            </Button>
        </form>
    );
};
