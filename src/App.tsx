import { useEffect, useState, useRef, useCallback } from 'react';
import { PenLine, Eye } from 'lucide-react';
import { md, preprocessMarkdown, applyTheme } from './lib/markdown';
import { markElementIndexes } from './lib/markdownIndexer';
import { makeWeChatCompatible, cleanInternalAttributes } from './lib/wechatCompat';
import { THEMES } from './lib/themes';
import { defaultContent } from './defaultContent';
import { findImagePosition, selectTextAreaRange } from './lib/imageSelector';
import { findElementPosition, type ElementLocation } from './lib/markdownLocator';
import Header from './components/Header';
import EditorPanel from './components/EditorPanel';
import PreviewPanel from './components/PreviewPanel';

export default function App() {
    const [markdownInput, setMarkdownInput] = useState<string>(defaultContent);
    const [renderedHtml, setRenderedHtml] = useState<string>('');
    const [activeTheme, setActiveTheme] = useState(THEMES[0].id);
    const [copied, setCopied] = useState(false);
    const [isCopying, setIsCopying] = useState(false);
    const [copiedHtml, setCopiedHtml] = useState(false);
    const [copiedMarkdown, setCopiedMarkdown] = useState(false);
    const [activePanel, setActivePanel] = useState<'editor' | 'preview'>('editor');
    const previewRef = useRef<HTMLDivElement>(null);
    const editorScrollRef = useRef<HTMLTextAreaElement>(null);
    const previewScrollRef = useRef<HTMLDivElement>(null);
    const scrollLockRef = useRef(false);

    useEffect(() => {
        const rawHtml = md.render(preprocessMarkdown(markdownInput));
        const styledHtml = applyTheme(rawHtml, activeTheme);
        const indexedHtml = markElementIndexes(styledHtml);
        setRenderedHtml(indexedHtml);
    }, [markdownInput, activeTheme]);

    const handleCopy = async () => {
        if (!previewRef.current) return;
        setIsCopying(true);
        try {
            const finalHtmlForCopy = await makeWeChatCompatible(renderedHtml, activeTheme);

            const blob = new Blob([finalHtmlForCopy], { type: 'text/html' });
            const textBlob = new Blob([previewRef.current.innerText], { type: 'text/plain' });

            const clipboardItem = new ClipboardItem({
                'text/html': blob,
                'text/plain': textBlob
            });
            await navigator.clipboard.write([clipboardItem]);

            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Copy failed', err);
            alert('复制格式失败，请检查浏览器剪贴板权限');
        } finally {
            setIsCopying(false);
        }
    };

    const handleCopyHtml = async () => {
        const cleanHtml = cleanInternalAttributes(renderedHtml);
        const htmlBlob = new Blob([cleanHtml], { type: 'text/html' });
        const textBlob = new Blob([previewRef.current?.innerText ?? ''], { type: 'text/plain' });
        await navigator.clipboard.write([new ClipboardItem({ 'text/html': htmlBlob, 'text/plain': textBlob })]);
        setCopiedHtml(true);
        setTimeout(() => setCopiedHtml(false), 2000);
    };

    const handleCopyMarkdown = () => {
        navigator.clipboard.writeText(markdownInput);
        setCopiedMarkdown(true);
        setTimeout(() => setCopiedMarkdown(false), 2000);
    };

    const syncScroll = (source: HTMLElement, target: HTMLElement) => {
        if (scrollLockRef.current) return;
        scrollLockRef.current = true;
        const ratio = source.scrollTop / (source.scrollHeight - source.clientHeight);
        target.scrollTop = ratio * (target.scrollHeight - target.clientHeight);
        requestAnimationFrame(() => { scrollLockRef.current = false; });
    };

    const handleEditorScroll = () => {
        if (!editorScrollRef.current || !previewScrollRef.current) return;
        syncScroll(editorScrollRef.current, previewScrollRef.current);
    };

    const handlePreviewScroll = () => {
        if (!previewScrollRef.current || !editorScrollRef.current) return;
        syncScroll(previewScrollRef.current, editorScrollRef.current);
    };

    const handleImageClick = useCallback((info: { type: string; index: number; src?: string; alt?: string; content?: string }) => {
        if (!editorScrollRef.current) return;

        let location: ElementLocation | null = null;

        if (info.type === 'image' && info.src) {
            const match = findImagePosition(markdownInput, info.src, info.alt || '');
            if (match) {
                location = {
                    start: match.start,
                    end: match.end,
                    type: 'image'
                };
            }
        } else {
            location = findElementPosition(markdownInput, info.type, '', info.index);
        }

        if (location) {
            selectTextAreaRange(editorScrollRef.current, location.start, location.end);
            if (window.innerWidth < 768 && activePanel !== 'editor') {
                setActivePanel('editor');
            }
        }
    }, [markdownInput, activePanel]);

    return (
        <div className="flex flex-col h-screen overflow-hidden antialiased bg-[#fbfbfd] dark:bg-black transition-colors duration-300">

            <Header
                activeTheme={activeTheme}
                onThemeChange={setActiveTheme}
                onCopyHtml={handleCopyHtml}
                onCopy={handleCopy}
                onCopyMarkdown={handleCopyMarkdown}
                copied={copied}
                copiedHtml={copiedHtml}
                copiedMarkdown={copiedMarkdown}
                isCopying={isCopying}
            />

            {/* 移动端 Tab 切换 */}
            <div className="md:hidden glass-toolbar flex items-center z-[90]">
                <button
                    data-testid="tab-editor"
                    onClick={() => setActivePanel('editor')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-[13px] font-semibold transition-colors border-b-2 ${activePanel === 'editor' ? 'text-[#0066cc] dark:text-[#0a84ff] border-[#0066cc] dark:border-[#0a84ff]' : 'text-[#86868b] dark:text-[#a1a1a6] border-transparent'}`}
                >
                    <PenLine size={15} />
                    编辑
                </button>
                <button
                    data-testid="tab-preview"
                    onClick={() => setActivePanel('preview')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-[13px] font-semibold transition-colors border-b-2 ${activePanel === 'preview' ? 'text-[#0066cc] dark:text-[#0a84ff] border-[#0066cc] dark:border-[#0a84ff]' : 'text-[#86868b] dark:text-[#a1a1a6] border-transparent'}`}
                >
                    <Eye size={15} />
                    预览
                </button>
            </div>

            {/* 编辑区 & 预览区 */}
            <main className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-2 relative">
                <div className={`${activePanel === 'editor' ? 'flex' : 'hidden'} md:flex flex-col overflow-hidden`}>
                    <EditorPanel
                        markdownInput={markdownInput}
                        onInputChange={setMarkdownInput}
                        editorScrollRef={editorScrollRef}
                        onEditorScroll={handleEditorScroll}
                    />
                </div>
                <div className={`${activePanel === 'preview' ? 'flex' : 'hidden'} md:flex flex-col overflow-hidden`}>
                    <PreviewPanel
                        renderedHtml={renderedHtml}
                        previewRef={previewRef}
                        scrollRef={previewScrollRef}
                        onScroll={handlePreviewScroll}
                        onImageClick={handleImageClick}
                    />
                </div>
            </main>

        </div>
    );
}
