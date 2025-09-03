
import React, { useState, useEffect } from 'react';
import { ListIcon, XCircleIcon } from './icons';

const ListManager: React.FC = () => {
    const [subscribers, setSubscribers] = useState<string[]>([]);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        try {
            const list = JSON.parse(localStorage.getItem('ns_subscribers') || '[]');
            setSubscribers(list);
        } catch (error) {
            setMessage('Could not load subscriber list from local storage.');
        }
    }, []);

    const handleDelete = (emailToDelete: string) => {
        const updatedList = subscribers.filter(email => email !== emailToDelete);
        setSubscribers(updatedList);
        localStorage.setItem('ns_subscribers', JSON.stringify(updatedList));
        setMessage(`Removed ${emailToDelete} from the list.`);
        setTimeout(() => setMessage(null), 3000);
    };

    return (
        <div className="border border-[rgba(255,255,255,0.08)] bg-gradient-to-b from-[rgba(255,255,255,0.02)] to-[rgba(255,255,255,0.01)] rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-lg backdrop-saturate-[1.3] max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
                <ListIcon className="w-7 h-7 text-white" />
                <h2 className="text-xl font-bold">Subscriber List Manager</h2>
            </div>
            <p className="text-sm text-[#aeb3c7] mt-1 mb-4">
                View and manage the devotee email list from the newsletter form. This data is stored only in your browser.
            </p>
            
            {message && <div className="mb-4 p-3 bg-green-900/50 border border-green-500/50 text-green-300 rounded-lg text-sm">{message}</div>}

            <div className="max-h-[500px] overflow-y-auto border border-[rgba(255,255,255,0.08)] bg-black/20 rounded-xl">
                {subscribers.length > 0 ? (
                    <ul className="divide-y divide-[rgba(255,255,255,0.08)]">
                        {subscribers.map(email => (
                            <li key={email} className="flex items-center justify-between p-3">
                                <span className="text-sm text-white">{email}</span>
                                <button
                                    onClick={() => handleDelete(email)}
                                    className="p-1 rounded-full text-gray-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
                                    aria-label={`Remove ${email}`}
                                >
                                    <XCircleIcon className="w-5 h-5" />
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="p-10 text-center text-sm text-[#aeb3c7]">
                        <p>No subscribers found.</p>
                        <p className="mt-1">Add emails via the form on the homepage to see them here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListManager;
