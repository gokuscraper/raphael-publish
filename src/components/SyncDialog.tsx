import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2, CheckCircle2, AlertCircle, ExternalLink, Send, AlertTriangle } from 'lucide-react';

interface Account {
    type: string;
    title: string;
    displayName: string;
    icon: string;
    avatar: string;
    uid: string;
    home: string;
    supportTypes: string[];
}

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

type Step = 'loading' | 'select' | 'syncing' | 'done';

export default function SyncDialog({ isOpen, onClose, title, htmlContent }: SyncDialogProps) {
    const [step, setStep] = useState<Step>('loading');
    const [accounts, setAccounts] = useState<Account[]>([]);
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
            setStep('select');
            return;
        }
        setExtensionInstalled(true);

        poster.getAccounts((result: Account[]) => {
            if (!Array.isArray(result)) {
                setError('获取平台列表失败');
                setStep('select');
                return;
            }
            const valid = result.filter((a) => a.type !== 'weixin' && a.supportTypes?.includes('html'));
            setAccounts(valid);
            setSelected(new Set(valid.map((a) => a.type)));
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
        if (selected.size === accounts.length) {
            setSelected(new Set());
        } else {
            setSelected(new Set(accounts.map((a) => a.type)));
        }
    };

    const startSync = useCallback(() => {
        const poster = (window as any).$poster;
        if (!poster) return;

        const targetAccounts = accounts.filter((a) => selected.has(a.type));
        if (targetAccounts.length === 0) return;

        setStep('syncing');
        setProgress(targetAccounts.map((a) => ({ type: a.type, title: a.title, status: 'pending' })));

        poster.addTask(
            {
                post: { title, content: htmlContent },
                accounts: targetAccounts,
            },
            (update: { accounts: AccountStatus[] }) => {
                setProgress(update.accounts);
                const allDone = update.accounts.every((a) => a.status === 'done' || a.status === 'failed');
                if (allDone) setStep('done');
            },
            (err: any) => {
                if (err) setError(typeof err === 'string' ? err : '同步失败');
            }
        );
    }, [accounts, selected, title, htmlContent]);

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

    const allSelected = selected.size === accounts.length;

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

                    {extensionInstalled && accounts.length === 0 && step === 'select' && !error && (
                        <div className="flex flex-col items-center gap-3 py-8 text-center">
                            <AlertTriangle size={32} className="text-[#ff9f0a]" />
                            <p className="text-[15px] text-[#1d1d1f] dark:text-[#f5f5f7] font-medium">未登录任何平台</p>
                            <p className="text-[13px] text-[#86868b]">请先点击扩展图标，登录要同步的目标平台</p>
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

                    {step === 'select' && accounts.length > 0 && (
                        <>
                            <div className="flex items-center justify-between mb-3 px-1">
                                <span className="text-[13px] text-[#86868b]">已登录 {accounts.length} 个平台</span>
                                <button onClick={toggleAll} className="text-[13px] text-[#0066cc] dark:text-[#0a84ff] font-medium">
                                    {allSelected ? '取消全选' : '全选'}
                                </button>
                            </div>
                            <div className="space-y-1">
                                {accounts.map((acc) => (
                                    <label
                                        key={acc.type}
                                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                                            selected.has(acc.type) ? 'bg-[#0066cc]/8 dark:bg-[#0a84ff]/15' : 'hover:bg-black/5 dark:hover:bg-white/5'
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selected.has(acc.type)}
                                            onChange={() => togglePlatform(acc.type)}
                                            className="w-4 h-4 rounded accent-[#0066cc] dark:accent-[#0a84ff]"
                                        />
                                        <img src={acc.avatar || acc.icon} alt="" className="w-6 h-6 rounded-full" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                                        <div className="flex-1 min-w-0">
                                            <div className="text-[14px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7] truncate">{acc.displayName}</div>
                                            <div className="text-[12px] text-[#86868b] truncate">@{acc.title || acc.uid}</div>
                                        </div>
                                    </label>
                                ))}
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
                                            {p.status === 'uploading' && '正在上传...'}
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
                    {step === 'select' && (
                        <button
                            onClick={startSync}
                            disabled={selected.size === 0}
                            className="flex items-center gap-2 px-5 py-2 rounded-full text-[14px] font-medium bg-[#0066cc] hover:bg-[#0071e3] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            <Send size={14} />
                            同步到 {selected.size} 个平台
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
