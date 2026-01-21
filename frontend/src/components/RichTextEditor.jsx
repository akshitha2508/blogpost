import { useState, useRef } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Link, Image, Code, Quote } from 'lucide-react';

const RichTextEditor = ({ value, onChange, placeholder = "Write your content here..." }) => {
    const textareaRef = useRef(null);
    const [isPreview, setIsPreview] = useState(false);

    const insertText = (before, after = '') => {
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end);
        
        const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
        onChange({ target: { value: newText } });
        
        // Set cursor position after insertion
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
        }, 0);
    };

    const formatText = (type) => {
        switch (type) {
            case 'bold':
                insertText('**', '**');
                break;
            case 'italic':
                insertText('*', '*');
                break;
            case 'underline':
                insertText('<u>', '</u>');
                break;
            case 'code':
                insertText('`', '`');
                break;
            case 'quote':
                insertText('> ');
                break;
            case 'link':
                insertText('[', '](url)');
                break;
            case 'list':
                insertText('- ');
                break;
            case 'orderedList':
                insertText('1. ');
                break;
            case 'heading':
                insertText('## ');
                break;
        }
    };

    const renderPreview = (text) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
            .replace(/^## (.+)$/gm, '<h2>$1</h2>')
            .replace(/^# (.+)$/gm, '<h1>$1</h1>')
            .replace(/^- (.+)$/gm, '<li>$1</li>')
            .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
            .replace(/\n/g, '<br>');
    };

    return (
        <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
            {/* Toolbar */}
            <div style={{ 
                display: 'flex', 
                gap: '0.5rem', 
                padding: '0.75rem', 
                backgroundColor: 'var(--bg-secondary)', 
                borderBottom: '1px solid var(--border)',
                flexWrap: 'wrap'
            }}>
                <button
                    type="button"
                    onClick={() => formatText('bold')}
                    className="btn btn-ghost"
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                    title="Bold"
                >
                    <Bold size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => formatText('italic')}
                    className="btn btn-ghost"
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                    title="Italic"
                >
                    <Italic size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => formatText('underline')}
                    className="btn btn-ghost"
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                    title="Underline"
                >
                    <Underline size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => formatText('code')}
                    className="btn btn-ghost"
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                    title="Code"
                >
                    <Code size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => formatText('quote')}
                    className="btn btn-ghost"
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                    title="Quote"
                >
                    <Quote size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => formatText('list')}
                    className="btn btn-ghost"
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                    title="Bullet List"
                >
                    <List size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => formatText('orderedList')}
                    className="btn btn-ghost"
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                    title="Numbered List"
                >
                    <ListOrdered size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => formatText('link')}
                    className="btn btn-ghost"
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                    title="Link"
                >
                    <Link size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => formatText('heading')}
                    className="btn btn-ghost"
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                    title="Heading"
                >
                    H2
                </button>
                
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
                    <button
                        type="button"
                        onClick={() => setIsPreview(false)}
                        className={`btn ${!isPreview ? 'btn-primary' : 'btn-ghost'}`}
                        style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
                    >
                        Write
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsPreview(true)}
                        className={`btn ${isPreview ? 'btn-primary' : 'btn-ghost'}`}
                        style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
                    >
                        Preview
                    </button>
                </div>
            </div>

            {/* Editor/Preview Area */}
            <div style={{ minHeight: '300px' }}>
                {isPreview ? (
                    <div 
                        style={{ 
                            padding: '1rem', 
                            minHeight: '300px',
                            lineHeight: '1.6',
                            color: 'var(--text-main)'
                        }}
                        dangerouslySetInnerHTML={{ __html: renderPreview(value) }}
                    />
                ) : (
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        style={{
                            width: '100%',
                            minHeight: '300px',
                            padding: '1rem',
                            border: 'none',
                            outline: 'none',
                            resize: 'vertical',
                            fontFamily: 'inherit',
                            fontSize: '1rem',
                            lineHeight: '1.6',
                            backgroundColor: 'transparent',
                            color: 'var(--text-main)'
                        }}
                    />
                )}
            </div>

            {/* Help Text */}
            <div style={{ 
                padding: '0.5rem 1rem', 
                backgroundColor: 'var(--bg-secondary)', 
                borderTop: '1px solid var(--border)',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)'
            }}>
                Supports Markdown: **bold**, *italic*, `code`, &gt; quote, ## heading, - list, [link](url)
            </div>
        </div>
    );
};

export default RichTextEditor;