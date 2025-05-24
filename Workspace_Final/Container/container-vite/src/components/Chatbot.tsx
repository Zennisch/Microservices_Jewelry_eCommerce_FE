import {useEffect, useRef, useState} from 'react';

interface ChatMessage {
    text: string;
    isBot: boolean;
}

interface ChatBotProps {
    onClose: () => void;
}

interface ChatResponse {
    response: string;
    redirect?: string;
}

const ChatBot: React.FC<ChatBotProps> = ({onClose}) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            text: 'Xin chào! Tôi là trợ lý ảo của Tinh Tú Jewelry. Tôi có thể giúp gì cho bạn hôm nay?',
            isBot: true,
        },
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [messages]);

    const sendMessage = async () => {
        if (!inputText.trim()) return;

        setMessages([...messages, {text: inputText, isBot: false}]);

        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/v1/response', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({prompt: inputText}),
            });

            if (!response.ok) {
                throw new Error('Có lỗi xảy ra khi kết nối với chatbot');
            }

            const data: ChatResponse = await response.json();

            setMessages((prev) => [
                ...prev,
                {
                    text: data.response,
                    isBot: true,
                },
            ]);

            if (data.redirect) {
                setMessages((prev) => [
                    ...prev,
                    {
                        text: `Đang chuyển hướng đến trang sản phẩm...`,
                        isBot: true,
                    },
                ]);

                setTimeout(() => {
                    window.location.href = data.redirect as string;
                }, 1500);
            }
        } catch (error) {
            console.error('Error calling chatbot API:', error);
            setMessages((prev) => [
                ...prev,
                {
                    text: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.',
                    isBot: true,
                },
            ]);
        } finally {
            setIsLoading(false);
        }

        setInputText('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    const suggestions = ['Tư vấn nhẫn cưới', 'Chương trình khuyến mãi', 'Bảo hành trang sức', 'Cách chọn vòng tay'];

    const handleSuggestion = (suggestion: string) => {
        setInputText(suggestion);
        setTimeout(() => sendMessage(), 100);
    };

    return (
        <div
            className="fixed bottom-0 left-0 md:left-2 md:bottom-2 w-full md:w-96 h-[500px] md:h-[550px] bg-white rounded-t-lg md:rounded-lg shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-100">
            {/* Header */}
            <div
                className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-3 flex justify-between items-center">
                <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3">
                        <svg viewBox="0 0 100 100" className="w-5 h-5">
                            <polygon points="50,20 80,40 80,70 50,90 20,70 20,40" fill="url(#goldGradient)"/>
                            <text
                                x="50"
                                y="60"
                                textAnchor="middle"
                                fill="#1A1A1A"
                                fontSize="32"
                                fontWeight="bold"
                                fontFamily="serif"
                            >
                                T
                            </text>
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-serif font-medium">Tư Vấn Tinh Tú</h3>
                        <div className="text-xs flex items-center">
                            <span className="w-2 h-2 rounded-full bg-green-400 inline-block mr-1.5"></span>
                            <span className="text-amber-100">Đang hoạt động</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center">
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-amber-100 hover:bg-amber-700 hover:text-white transition-colors"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
            </div>

            {/* Chat content */}
            <div className="flex-grow p-4 overflow-auto bg-gray-50 relative">
                <div className="space-y-4 pb-2">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                            {msg.isBot && (
                                <div
                                    className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                                    <i className="fas fa-gem text-amber-600 text-xs"></i>
                                </div>
                            )}
                            <div
                                className={`max-w-[80%] rounded-lg py-2 px-3.5 shadow-sm ${
                                    msg.isBot
                                        ? 'bg-white text-gray-800 border border-gray-100'
                                        : 'bg-gradient-to-br from-amber-500 to-amber-600 text-white'
                                }`}
                            >
                                <p className={`text-sm leading-relaxed ${msg.isBot ? 'text-gray-700' : 'text-white'}`}>
                                    {msg.text}
                                </p>
                                <span
                                    className={`text-xs block mt-1 ${msg.isBot ? 'text-gray-400' : 'text-amber-200'}`}>
                                    {new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                                </span>
                            </div>
                            {!msg.isBot && (
                                <div
                                    className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center ml-2 flex-shrink-0 mt-1">
                                    <i className="fas fa-user text-white text-xs"></i>
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div
                                className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                                <i className="fas fa-gem text-amber-600 text-xs"></i>
                            </div>
                            <div
                                className="bg-white text-gray-800 rounded-lg py-3 px-4 shadow-sm border border-gray-100">
                                <div className="flex space-x-1.5">
                                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                                    <div
                                        className="w-2 h-2 rounded-full bg-amber-500 animate-pulse animation-delay-300"></div>
                                    <div
                                        className="w-2 h-2 rounded-full bg-amber-500 animate-pulse animation-delay-600"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef}/>
                </div>
            </div>

            {/* Suggestions */}
            {messages.length < 3 && (
                <div className="bg-gray-50 px-4 py-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-2">Bạn có thể hỏi:</p>
                    <div className="flex flex-wrap gap-2">
                        {suggestions.map((suggestion, index) => (
                            <button
                                key={index}
                                onClick={() => handleSuggestion(suggestion)}
                                className="text-xs bg-white border border-amber-200 text-amber-600 px-2.5 py-1.5 rounded-full hover:bg-amber-50 transition-colors"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Input area */}
            <div className="p-3 border-t border-gray-200 bg-white">
                <div className="flex items-center">
                    <input
                        type="text"
                        placeholder="Nhập câu hỏi của bạn..."
                        className="flex-grow p-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 text-gray-700"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                    />
                    <button
                        className={`ml-2 w-10 h-10 rounded-full flex items-center justify-center shadow-sm
              ${inputText.trim() ? 'bg-amber-600 hover:bg-amber-700' : 'bg-gray-200 cursor-not-allowed'}
              text-white transition-colors`}
                        onClick={sendMessage}
                        disabled={!inputText.trim() || isLoading}
                    >
                        <i className={`${isLoading ? 'fas fa-spinner fa-spin' : 'fas fa-paper-plane'}`}></i>
                    </button>
                </div>
                <div className="text-center mt-2">
                    <span className="text-xs text-gray-400">Được hỗ trợ bởi Tinh Tú Jewelry</span>
                </div>
            </div>
        </div>
    );
};

export default ChatBot;
