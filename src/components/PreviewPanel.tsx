import { useEffect, useRef } from 'react';

interface PreviewPanelProps {
    renderedHtml: string;
    previewRef: React.MutableRefObject<HTMLDivElement | null>;
    scrollRef?: React.RefObject<HTMLDivElement>;
    onScroll?: () => void;
    onImageClick?: (info: { type: string; index: number; src?: string; alt?: string }) => void;
}

export default function PreviewPanel({
    renderedHtml,
    previewRef,
    scrollRef,
    onScroll,
    onImageClick
}: PreviewPanelProps) {
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!previewRef || !contentRef.current) return;
        previewRef.current = contentRef.current;
    }, [previewRef]);

    useEffect(() => {
        if (!onImageClick) return;

        const handleElementClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            const element = target.closest('[data-md-type]') as HTMLElement;
            if (!element) return;

            const mdType = element.getAttribute('data-md-type');
            const mdIndex = element.getAttribute('data-md-index');

            if (!mdType || mdIndex === null) return;

            const clickedLink = target.closest('a') as HTMLAnchorElement;
            if (clickedLink) return;

            e.preventDefault();
            e.stopPropagation();

            const clickInfo: { type: string; index: number; src?: string; alt?: string; content?: string } = {
                type: mdType,
                index: parseInt(mdIndex, 10)
            };

            if (mdType === 'image' && target.tagName === 'IMG') {
                const img = target as HTMLImageElement;
                const originalSrc = img.getAttribute('src') || img.src;
                clickInfo.src = originalSrc;
                clickInfo.alt = img.alt || img.getAttribute('alt') || '';
            }

            onImageClick(clickInfo);
        };

        document.addEventListener('click', handleElementClick);

        const style = document.createElement('style');
        style.textContent = `
            .preview-content [data-md-type] {
                cursor: pointer;
                transition: background-color 0.2s ease, outline 0.2s ease;
            }
            .preview-content [data-md-type="image"]:hover,
            .preview-content [data-md-type="paragraph"]:hover {
                background-color: rgba(0, 102, 204, 0.05);
                border-radius: 4px;
            }
            .preview-content [data-md-type="heading"]:hover {
                background-color: rgba(0, 102, 204, 0.05);
                border-radius: 4px;
            }
            .preview-content img:hover {
                outline: 2px solid rgba(0, 102, 204, 0.5);
                outline-offset: 2px;
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.removeEventListener('click', handleElementClick);
            document.head.removeChild(style);
        };
    }, [onImageClick]);

    return (
        <div
            ref={scrollRef}
            onScroll={onScroll}
            className="relative overflow-y-auto no-scrollbar bg-[#f2f2f7]/50 dark:bg-[#000000] flex flex-col z-20 flex-1 min-h-0 w-full overflow-x-hidden"
        >
            <div className="mt-12 mb-32 mx-auto max-w-[660px] h-fit min-h-[calc(100%-48px)]">
                <div className="bg-white rounded-[24px] overflow-hidden shadow-apple-lg transition-all duration-500 ring-1 ring-[#00000008] border-t border-white/50 w-full">
                    <div
                        ref={contentRef}
                        data-testid="preview-content"
                        dangerouslySetInnerHTML={{ __html: renderedHtml }}
                        className="preview-content min-w-full"
                    />
                </div>
            </div>
        </div>
    );
}
