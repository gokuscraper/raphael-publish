import { Github } from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeSelector from './ThemeSelector';
import Toolbar from './Toolbar';

interface HeaderProps {
    activeTheme: string;
    onThemeChange: (themeId: string) => void;
    onCopyHtml: () => void;
    onCopy: () => void;
    onCopyMarkdown: () => void;
    onSync: () => void;
    copied: boolean;
    copiedHtml: boolean;
    copiedMarkdown: boolean;
    isCopying: boolean;
}

export default function Header({ activeTheme, onThemeChange, onCopyHtml, onCopy, onCopyMarkdown, onSync, copied, copiedHtml, copiedMarkdown, isCopying }: HeaderProps) {
    return (
        <header className="glass flex items-center gap-2 px-4 sm:px-6 py-2 sticky top-0 z-[100] flex-wrap">
            <div className="flex items-center gap-3 shrink-0">
                <span className="text-xl">🐵</span>
                <span className="font-bold text-sm sm:text-base tracking-tight text-black dark:text-white whitespace-nowrap">悟空排版</span>
            </div>

            <ThemeSelector activeTheme={activeTheme} onThemeChange={onThemeChange} />

            <div className="flex items-center gap-1 ml-auto">
                <Toolbar
                    onCopyHtml={onCopyHtml}
                    onCopy={onCopy}
                    onCopyMarkdown={onCopyMarkdown}
                    onSync={onSync}
                    copied={copied}
                    copiedHtml={copiedHtml}
                    copiedMarkdown={copiedMarkdown}
                    isCopying={isCopying}
                />
                <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href="https://github.com/gokuscraper/raphael-publish"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                >
                    <Github size={18} />
                </motion.a>
            </div>
        </header>
    );
}
