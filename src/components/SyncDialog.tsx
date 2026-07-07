import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2, CheckCircle2, AlertCircle, ExternalLink, Send, AlertTriangle, LogIn } from 'lucide-react';
import { ALL_PLATFORMS, type PlatformMeta } from '../lib/platforms';

interface AccountStatus {
    type: string;
    title: string;
    displayName?: string;
    status: 'pending' | 'uploading' | 'done' | 'failed';
    msg?: string;
    error?: string;
    editResp?: { draftLink?: string } | null;
}

interface SyncDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    htmlContent: string;
}

interface PlatformItem extends PlatformMeta {
    isAuthenticated: boolean;
    username?: string;
}

type Step = 'loading' | 'select' | 'syncing' | 'done';

export default function SyncDialog({ isOpen, onClose, title, htmlContent }: SyncDialogProps) {
    const [step, setStep] = useState<Step>('loading');
    const [platforms, setPlatforms] = useState<PlatformItem[]>([]);
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [progress, setProgress] = useState<AccountStatus[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [extensionInstalled, setExtensionInstalled] = useState<boolean | null>(null);

    useEffect(() => {
        if (!isOpen) return;
        setStep('loading');
        setError(null);
        setProgress([]);
        setSelected(new Set());

        const poster = (window as any).$poster;
        if (!poster) {
            setExtensionInstalled(false);
            setPlatforms(ALL_PLATFORMS.map((p) => ({ ...p, isAuthenticated: false })));
            setStep('select');
            return;
        }
        setExtensionInstalled(true);

        poster.getAccounts((result: AccountStatus[]) => {
            const authed = new Set(
                Array.isArray(result) ? result.map((a: AccountStatus) => a.type) : []
            );
            const merged: PlatformItem[] = ALL_PLATFORMS.map((p) => {
                const account = Array.isArray(result)
                    ? result.find((a: AccountStatus) => a.type === p.type)
                    : undefined;
                return {
                    ...p,
                    isAuthenticated: authed.has(p.type),
                    username: account?.title,
                };
            });
            setPlatforms(merged);
            setSelected(new Set(merged.filter((p) => p.isAuthenticated && !p.disabled).map((p) => p.type)));
            setStep('select');
        });
    }, [isOpen]);

    const togglePlatform = (type: string) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(type)) next.delete(type);
            else next.add(type);
            return next;
        });
    };

    const toggleAll = () => {
        const authed = platforms.filter((p) => p.isAuthenticated && !p.disabled);
        if (authed.every((p) => selected.has(p.type))) {
            setSelected(new Set());
        } else {
            setSelected(new Set(authed.map((p) => p.type)));
        }
    };

    const openLogin = (homepage: string) => {
        window.open(homepage, '_blank');
    };

    const startSync = useCallback(() => {
        const poster = (window as any).$poster;
        if (!poster) return;

        const targetPlatforms = platforms.filter((p) => selected.has(p.type) && p.isAuthenticated && !p.disabled);
        if (targetPlatforms.length === 0) return;

        const accounts = targetPlatforms.map((p) => ({
            type: p.type,
            title: p.username || p.name,
            displayName: p.name,
            icon: p.icon,
            avatar: p.icon,
            uid: p.username || '',
            home: p.homepage,
            supportTypes: ['html'],
        }));

        setStep('syncing');
        setProgress(accounts.map((a) => ({ type: a.type, title: a.title, status: 'pending' })));

        poster.addTask(
            {
                post: { title, content: htmlContent },
                accounts,
            },
            (update: { accounts: AccountStatus[] }) => {
                setProgress(update.accounts);
                const allDone = update.accounts.every((a) => a.status === 'done' || a.status === 'failed');
                if (allDone) setStep('done');
            },
            () => {}
        );
    }, [platforms, selected, title, htmlContent]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'uploading':
                return <Loader2 size={16} className="animate-spin text-[#0066cc]" />;
            case 'done':
                return <CheckCircle2 size={16} className="text-[#34c759]" />;
            case 'failed':
                return <AlertCircle size={16} className="text-[#ff3b30]" />;
            default:
                return <div className="w-4 h-4 rounded-full border-2 border-[#c7c7cc]" />;
        }
    };

    if (!isOpen) return null;

    const authenticatedCount = platforms.filter((p) => p.isAuthenticated && !p.disabled).length;
    const authedSelectedCount = platforms.filter((p) => selected.has(p.type) && p.isAuthenticated && !p.disabled).length;
    const allAuthedSelected = platforms.filter((p) => p.isAuthenticated && !p.disabled).every((p) => selected.has(p.type));

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-[#1c1c1e] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#00000010] dark:border-[#ffffff10]">
                    <h2 className="text-[17px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">同步到多平台</h2>
                    <button onClick={onClose} className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10">
                        <X size={18} className="text-[#86868b]" />
                    </button>
                </div>

                <div className="px-5 py-4 max-h-[60vh] overflow-y-auto">
                    {extensionInstalled === false && (
                        <div className="flex flex-col items-center gap-3 py-8 text-center">
                            <AlertTriangle size={32} className="text-[#ff9f0a]" />
                            <p className="text-[15px] text-[#1d1d1f] dark:text-[#f5f5f7] font-medium">未检测到同步助手</p>
                            <p className="text-[13px] text-[#86868b]">请先安装 Wechatsync（文章同步助手）Chrome 扩展</p>
                        </div>
                    )}

                    {error && (
                        <div className="flex items-center gap-2 p-3 mb-3 rounded-xl bg-[#ff3b30]/10 text-[#ff3b30] text-[13px]">
                            <AlertCircle size={14} />
                            {error}
                        </div>
                    )}

                    {step === 'loading' && extensionInstalled !== false && (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 size={24} className="animate-spin text-[#86868b]" />
                        </div>
                    )}

                    {step === 'select' && extensionInstalled !== false && (
                        <>
                            <div className="flex items-center justify-between mb-3 px-1">
                                <span className="text-[13px] text-[#86868b]">已登录 {authenticatedCount}/{platforms.length} 个平台</span>
                                {authenticatedCount > 0 && (
                                    <button onClick={toggleAll} className="text-[13px] text-[#0066cc] dark:text-[#0a84ff] font-medium">
                                        {allAuthedSelected ? '取消全选' : '全选'}
                                    </button>
                                )}
                            </div>
                            <div className="space-y-1">
                                {platforms.map((p) => {
                                    const isAuthed = p.isAuthenticated && !p.disabled;
                                    const isSelected = selected.has(p.type);
                                    const isDisabled = p.disabled;
                                    return (
                                        <div
                                            key={p.type}
                                            onClick={() => { if (isDisabled) return; isAuthed ? togglePlatform(p.type) : openLogin(p.homepage) }}
                                            className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                                                isDisabled ? 'cursor-default' : 'cursor-pointer'
                                            } ${
                                                isAuthed && isSelected
                                                    ? 'bg-[#0066cc]/8 dark:bg-[#0a84ff]/15'
                                                    : isAuthed ? 'hover:bg-black/5 dark:hover:bg-white/5' : ''
                                            } ${!isAuthed ? 'opacity-50' : ''}`}
                                        >
                                            {isAuthed ? (
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => togglePlatform(p.type)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="w-4 h-4 rounded accent-[#0066cc] dark:accent-[#0a84ff] shrink-0"
                                                />
                                            ) : (
                                                <div className="w-4 h-4 shrink-0 flex items-center justify-center">
                                                    {isDisabled ? <div className="w-4 h-4" /> : <LogIn size={12} className="text-[#86868b]" />}
                                                </div>
                                            )}
                                            <img
                                                src={p.icon}
                                                alt=""
                                                className="w-6 h-6 rounded-full shrink-0"
                                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="text-[14px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7] truncate">{p.name}</div>
                                                <div className="text-[12px] text-[#86868b] truncate">
                                                    {isDisabled ? '暂不支持' : isAuthed ? (p.username ? `@${p.username}` : '已登录') : '未登录，点击去登录'}
                                                </div>
                                            </div>
                                            {!isAuthed && !isDisabled && (
                                                <span className="text-[12px] text-[#0066cc] dark:text-[#0a84ff] font-medium shrink-0">去登录</span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    {(step === 'syncing' || step === 'done') && (
                        <div className="space-y-2">
                            {progress.map((p) => (
                                <div key={p.type} className={`flex items-center gap-3 p-3 rounded-xl ${
                                    p.status === 'failed' ? 'bg-[#ff3b30]/8' : p.status === 'done' ? 'bg-[#34c759]/8' : 'bg-black/3 dark:bg-white/5'
                                }`}>
                                    {getStatusIcon(p.status)}
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[14px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7] truncate">{p.displayName || p.title}</div>
                                        <div className="text-[12px] text-[#86868b] truncate">
                                            {p.status === 'pending' && '等待中'}
                                            {p.status === 'uploading' && (p.msg || '正在上传...')}
                                            {p.status === 'done' && '同步成功'}
                                            {p.status === 'failed' && (p.error || '同步失败')}
                                        </div>
                                    </div>
                                    {p.status === 'done' && p.editResp?.draftLink && (
                                        <a
                                            href={p.editResp.draftLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 shrink-0"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <ExternalLink size={14} className="text-[#0066cc] dark:text-[#0a84ff]" />
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-[#00000010] dark:border-[#ffffff10]">
                    <button onClick={onClose} className="px-4 py-2 rounded-full text-[14px] font-medium text-[#86868b] hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                        {step === 'done' ? '关闭' : '取消'}
                    </button>
                    {step === 'select' && authenticatedCount > 0 && (
                        <button
                            onClick={startSync}
                            disabled={authedSelectedCount === 0}
                            className="flex items-center gap-2 px-5 py-2 rounded-full text-[14px] font-medium bg-[#0066cc] hover:bg-[#0071e3] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            <Send size={14} />
                            同步到 {authedSelectedCount} 个平台
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
