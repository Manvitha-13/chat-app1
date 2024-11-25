// src/components/Chat.js
import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc, query, onSnapshot, orderBy, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './Chat.css';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                navigate('/login');
            }
        });

        const q = query(collection(db, 'messages'), orderBy('timestamp'));
        const unsubscribeMessages = onSnapshot(q, (snapshot) => {
            const fetchedMessages = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setMessages(fetchedMessages);
        });

        return () => {
            unsubscribeAuth();
            unsubscribeMessages();
        };
    }, [navigate]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (input.trim() === '') return;

        try {
            await addDoc(collection(db, 'messages'), {
                text: input,
                uid: user.uid,
                displayName: user.displayName || 'Anonymous',
                timestamp: serverTimestamp(),
            });
            setInput('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleSignOut = () => {
        signOut(auth)
            .then(() => navigate('/login'))
            .catch((error) => console.error('Sign-out error:', error));
    };

    return (
        <div className="chat-window">
            <header className="chat-header">
                <h2>Chat App</h2>
                <button onClick={handleSignOut} className="sign-out-button">Sign Out</button>
            </header>
            <div className="chat-messages">
                {messages.map((message) => (
                    <div key={message.id} className={`message ${message.uid === user.uid ? 'my-message' : 'other-message'}`}>
                        <span className="message-user">{message.displayName}:</span>
                        <p className="message-text">{message.text}</p>
                        <span className="message-time">{new Date(message.timestamp?.toDate()).toLocaleTimeString()}</span>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSendMessage} className="chat-input-form">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="chat-input"
                />
                <button type="submit" className="send-button">Send</button>
            </form>
        </div>
    );
};

export default Chat;
