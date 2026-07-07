import { Copy, CheckCircle2, Code, Loader2, Send, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

interface ToolbarProps {
    onCopyHtml: () => void;
    onCopy: () => void;
    onCopyMarkdown: () => void;
    onSync: () => void;
    onSyncCose: () => void;
    copied: boolean;
    copiedHtml: boolean;
    copiedMarkdown: boolean;
    isCopying: boolean;
}

export default function Toolbar({ onCopyHtml, onCopy, onCopyMarkdown, onSync, onSyncCose, copied, copiedHtml, copiedMarkdown, isCopying }: ToolbarProps) {
    return (
        <div className="flex items-center gap-1 sm:gap-2">
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={onSync}
                className="apple-export-btn !hidden lg:!flex border-transparent !bg-[#00000008] dark:!bg-[#ffffff10]"
            >
                <Send size={14} />
                主同步
            </motion.button>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={onSyncCose}
                className="apple-export-btn !hidden lg:!flex border-transparent !bg-[#00000008] dark:!bg-[#ffffff10]"
            >
                <Globe size={14} />
                副同步
            </motion.button>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                data-testid="copy-html"
                onClick={onCopyHtml}
                className={`apple-export-btn !hidden lg:!flex border-transparent ${copiedHtml ? '!bg-[#34c759]/15 text-[#34c759]' : '!bg-[#00000008] dark:!bg-[#ffffff10]'}`}
            >
                {copiedHtml ? <CheckCircle2 size={14} /> : <Code size={14} />}
                {copiedHtml ? '已复制' : '复制 HTML'}
            </motion.button>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                data-testid="copy-markdown"
                onClick={onCopyMarkdown}
                className={`apple-export-btn !hidden lg:!flex border-transparent ${copiedMarkdown ? '!bg-[#34c759]/15 text-[#34c759]' : '!bg-[#00000008] dark:!bg-[#ffffff10]'}`}
            >
                {copiedMarkdown ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                {copiedMarkdown ? '已复制' : '复制 Markdown'}
            </motion.button>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                data-testid="copy-button"
                onClick={onCopy}
                disabled={isCopying}
                className={copied ? "apple-copy-btn-success apple-copy-btn" : isCopying ? "apple-copy-btn opacity-80 cursor-not-allowed" : "apple-copy-btn"}
            >
                {copied ? <CheckCircle2 size={16} /> : isCopying ? <Loader2 className="animate-spin" size={16} /> : <Copy size={16} />}
                <span className="hidden sm:inline">{copied ? '已复制！请贴往公众号' : isCopying ? '正在打包图片...' : '复制到公众号'}</span>
                <span className="sm:hidden">{copied ? '已复制' : isCopying ? '打包中...' : '复制'}</span>
            </motion.button>
        </div>
    );
}
