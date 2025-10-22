
import React, { useState, useEffect, useContext, useRef } from 'react';
import { User, ChatMessage } from '../types';
import * as api from '../services/mockApi';
import { AuthContext } from '../contexts/AuthContext';
import { LanguageContext } from '../contexts/LanguageContext';
import Spinner from '../components/ui/Spinner';

const ChatPage: React.FC = () => {
    const { user } = useContext(AuthContext);
    const { t } = useContext(LanguageContext);
    const [contacts, setContacts] = useState<User[]>([]);
    const [selectedContact, setSelectedContact] = useState<User | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loadingContacts, setLoadingContacts] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (user) {
            api.getChatContacts(user.id).then(data => {
                setContacts(data);
                setLoadingContacts(false);
            });
        }
    }, [user]);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSelectContact = async (contact: User) => {
        setSelectedContact(contact);
        setLoadingMessages(true);
        if (user) {
            const chatMessages = await api.getChatMessages(user.id, contact.id);
            setMessages(chatMessages);
        }
        setLoadingMessages(false);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user || !selectedContact) return;

        const sentMessage = await api.sendChatMessage(user.id, selectedContact.id, newMessage);
        setMessages(prev => [...prev, sentMessage]);
        setNewMessage('');
    };

    if (!user) return null;

    return (
        <div className="container mx-auto px-4 py-8 h-[calc(100vh-8rem)]">
            <div className="flex h-full bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                {/* Contacts List */}
                <div className="w-1/3 border-e border-gray-200 dark:border-gray-700">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('conversations')}</h2>
                    </div>
                    {loadingContacts ? <div className="p-4"><Spinner /></div> : (
                        <ul className="overflow-y-auto">
                            {contacts.map(contact => (
                                <li key={contact.id} onClick={() => handleSelectContact(contact)} className={`p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${selectedContact?.id === contact.id ? 'bg-primary-100 dark:bg-primary-900/50' : ''}`}>
                                    <div className="flex items-center">
                                        <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full me-3" />
                                        <div>
                                            <p className="font-semibold text-gray-800 dark:text-white">{contact.name}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{t(contact.role.toLowerCase())}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Chat Area */}
                <div className="w-2/3 flex flex-col">
                    {selectedContact ? (
                        <>
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
                                <img src={selectedContact.avatar} alt={selectedContact.name} className="w-10 h-10 rounded-full me-3" />
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedContact.name}</h2>
                            </div>
                            <div className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900">
                                {loadingMessages ? <Spinner /> : (
                                    messages.map(msg => (
                                        <div key={msg.id} className={`flex mb-4 ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${msg.senderId === user.id ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'}`}>
                                                <p>{msg.text}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                                <form onSubmit={handleSendMessage} className="flex">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder={t('type_a_message')}
                                        className="flex-1 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                    <button type="submit" className="ms-3 px-6 py-2 bg-primary-600 text-white font-semibold rounded-full hover:bg-primary-700">
                                        {t('send')}
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                            {t('no_contact_selected')}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
