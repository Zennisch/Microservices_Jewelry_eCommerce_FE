import React, { use, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const collections = [
    {
        id: 1,
        title: "Thiên đường kim cương",
        description: "Bộ sưu tập trang sức quyến rũ chứa đựng bản chất của sự thanh lịch và tinh tế vượt thời gian",
        image: "https://picsum.photos/id/1/200",
    },
    {
        id: 2,
        title: "Sói Bạc",
        description: "Bộ sưu tập trang sức quyến rũ phản ánh tinh thần hoang dã bất khuất.",
        image: "https://picsum.photos/id/20/200",
    },
    {
        id: 3,
        title: "Thiên đường đôi lứa",
        description: "Bộ sưu tập trang sức quyến rũ tôn vinh mối quan hệ tình yêu vĩnh cửu.",
        image: "https://picsum.photos/id/30/200",
    },
    {
        id: 4,
        title: "Dung Nham Hoàng Kim",
        description: "Bộ sưu tập trang sức rạng rỡ nắm bắt được bản chất của vàng nóng cháy.",
        image: "https://picsum.photos/id/40/200",
    }
    ,
    {
        id: 5,
        title: "Dung Nham Hoàng Kim",
        description: "Bộ sưu tập trang sức rạng rỡ nắm bắt được bản chất của vàng nóng cháy.",
        image: "https://picsum.photos/id/50/200",
    },
    {
        id: 6,
        title: "Dung Nham Hoàng Kim",
        description: "Bộ sưu tập trang sức rạng rỡ nắm bắt được bản chất của vàng nóng cháy.",
        image: "https://picsum.photos/id/60/200",
    }
];

const Collection = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredCollections, setFilteredCollections] = useState([]);

     useEffect(() => {
            const fetchColletions = async () => {
                try {
                    const response = await fetch('http://localhost:8080/api/collection/listCollection');
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    setFilteredCollections(data);
                } catch (error) {
                    console.error('Failed to fetch collections:', error);
                }
            };
    
            fetchColletions();
        }, []);

    const handleSearch = () => {
        const filtered = collections.filter(collection =>
            collection.title.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
            collection.description.toLowerCase().includes(searchTerm.trim().toLowerCase())
        );
        setFilteredCollections(filtered);
    };


    return (
        <div className="min-h-screen bg-bgOuter mx-auto px-6 lg:px-20 py-6">
            <div className="text-white mb-4 flex justify-center">
                <Link to="/" className="text-gray-400">Trang chủ </Link> / Bộ sưu tập
            </div>
            {/* Search Bar */}
            <div className="mb-4 flex items-center justify-center px-4 py-4 mb-2">
                <div className="relative w-full max-w-lg">
                    <input
                        type="text"
                        placeholder="Tìm kiếm bộ sưu tập tại đây"
                        className="pl-4 pr-12 py-2 w-full border border-white rounded-md bg-gray-400 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <button
                        onClick={handleSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-md bg"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                    </button>
                </div>
            </div>
            {/* Collection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {filteredCollections.map((collection, index) => {
                    const pattern = index % 4;
                    const isReversed = pattern >= 2;

                    const thumbnail = collection.collectionImages.find(image => image.isThumbnail);
                    const imageUrl = thumbnail ? thumbnail.imageUrl : ' ';
                    return (
                        <div key={collection.id}
                            className={`flex ${isReversed ? 'flex-row-reverse' : 'flex-row'} gap-8`}
                        >
                            <div className="w-1/2 relative group">
                                <Link to={`/collection/${collection.id}`}>
                                    <div className="absolute inset-0 border-2 border-yellow-500 rounded-lg transform rotate-3 transition-transform group-hover:rotate-6"></div>
                                    <img
                                        src={imageUrl}
                                        alt={collection.title}
                                        className="w-full h-[300px] object-cover bg-gray-800 rounded-lg shadow-xl relative z-10 cursor-pointer"
        />
                                </Link>
                            </div>
                            <div className="w-1/2 flex flex-col justify-center">
                                <h2 className="text-white text-3xl font-serif italic mb-4">{collection.name}</h2>
                                <Link
                                    to={`/collection/${collection.id}`}
                                    className="self-start px-6 py-2 bg-transparent border border-white text-white rounded-md 
                                     hover:bg-white hover:text-black transition-colors duration-300
                                     inline-flex items-center justify-center min-w-[120px] text-center"
                                >
                                    Xem Chi Tiết
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Collection;