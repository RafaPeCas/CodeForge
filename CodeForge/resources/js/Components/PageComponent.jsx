import { useState } from 'react';
import axios from 'axios';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/Components/ui/select';

const PageComponent = () => {
    const [formData, setFormData] = useState({
        title: '',
        blocks: [],
        notebookId: '',
        // author: '',
        parentPage: '',
    });
    const [pageId, setPageId] = useState('');
    const [notebookId, setNotebookId] = useState('');
    const [response, setResponse] = useState(null);
    const [blockType, setBlockType] = useState('');
    const [blockContent, setBlockContent] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleBlockTypeChange = (value) => {
        setBlockType(value);
    };

    const handleBlockContentChange = (e) => {
        setBlockContent(e.target.value);
    };

    const addBlock = () => {
        const newBlock = blockType.startsWith('h')
            ? { type: 'heading', level: parseInt(blockType.substring(1)), content: blockContent }
            : { type: 'paragraph', content: blockContent };

        setFormData({
            ...formData,
            blocks: [...formData.blocks, newBlock],
        });

        setBlockContent('');
        setBlockType('');
    };

    const handleCreatePage = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/pages', formData);
            setResponse(res.data);
            setFormData({
                ...formData,
                blocks: [],
            });
            setBlockContent('');
            setBlockType('');
        } catch (error) {
            setResponse(error.response ? error.response.data : error.message);
        }
    };

    const handleGetPages = async () => {
        try {
            const res = await axios.get(`/pages/${notebookId}`);
            setResponse(res.data);
        } catch (error) {
            setResponse(error.response ? error.response.data : error.message);
        }
    };

    const handleGetPage = async () => {
        try {
            const res = await axios.get(`pages/show/${pageId}`);
            setResponse(res.data);
        } catch (error) {
            setResponse(error.response ? error.response.data : error.message);
        }
    };

    const handleUpdatePage = async () => {
        try {
            const res = await axios.put(`/pages/${pageId}`, formData);
            setResponse(res.data);
        } catch (error) {
            setResponse(error.response ? error.response.data : error.message);
        }
    };

    const handleDeletePage = async () => {
        try {
            const res = await axios.delete(`/pages/${pageId}`);
            setResponse(res.data);
        } catch (error) {
            setResponse(error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className='bg-black text-white p-4'>
            <h1>Page API Tester</h1>

            <form onSubmit={handleCreatePage} className='flex flex-col gap-4'>
                <h2>Create Page</h2>
                <input className='border border-white' type="text" name="title" placeholder="Title" onChange={handleChange} required />
                
                <div className='flex flex-col gap-4'>
                    <Select onValueChange={handleBlockTypeChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select block type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="h1">Heading 1</SelectItem>
                            <SelectItem value="h2">Heading 2</SelectItem>
                            <SelectItem value="h3">Heading 3</SelectItem>
                            <SelectItem value="p">Paragraph</SelectItem>
                        </SelectContent>
                    </Select>
                    <textarea className='border border-white' placeholder="Block content" value={blockContent} onChange={handleBlockContentChange} />
                    <button className='bg-amber-500' type="button" onClick={addBlock}>Add Block</button>
                </div>

                <input className='border border-white' type="text" name="notebookId" placeholder="Notebook ID" onChange={handleChange} required />
                <input className='border border-white' type="text" name="parentPage" placeholder="Parent Page ID (optional)" onChange={handleChange} />
                <button className='bg-amber-500' type="submit">Create Page</button>
            </form>

            <div>
                <h2>Get Pages in Notebook</h2>
                <input className='border border-white' type="text" placeholder="Notebook ID" onChange={(e) => setNotebookId(e.target.value)} />
                <button onClick={handleGetPages}>Get Pages</button>
            </div>

            <div>
                <h2>Get Single Page</h2>
                <input className='border border-white' type="text" placeholder="Page ID" onChange={(e) => setPageId(e.target.value)} />
                <button onClick={handleGetPage}>Get Page</button>
            </div>

            <div>
                <h2>Update Page</h2>
                <input className='border border-white' type="text" name="title" placeholder="New Title" onChange={handleChange} />
                <input className='border border-white' type="text" name="blocks" placeholder="New Blocks (JSON)" onChange={handleChange} />
                <input className='border border-white' type="text" name="updatedBy" placeholder="Updated By (User ID)" onChange={handleChange} />
                <button onClick={handleUpdatePage}>Update Page</button>
            </div>

            <div>
                <h2>Delete Page</h2>
                <input className='border border-white' type="text" placeholder="Page ID" onChange={(e) => setPageId(e.target.value)} />
                <button onClick={handleDeletePage}>Delete Page</button>
            </div>

            <div>
                <h2>Response</h2>
                <pre>{JSON.stringify(response, null, 2)}</pre>
            </div>
        </div>
    );
};

export default PageComponent;