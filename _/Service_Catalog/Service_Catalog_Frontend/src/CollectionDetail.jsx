import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CollectionDetail = () => {
    const { collectionId } = useParams();
    const [collection, setCollection] = useState(null);
    const [products, setProducts] = useState([]);
    const [bannerImages, setBannerImages] = useState([]);

    const bannerSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true,
        fade: true
    };

    useEffect(() => {
        const fetchCollectionDetail = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/collection/detailCollection/${collectionId}`);
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setCollection(data);
            } catch (error) {
                console.error('Failed to fetch collection details:', error);
            }
        };

        const fetchCollectionProducts = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/product/listProductByCollection/${collectionId}`);
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            }
        };

        const fetchBannerImages = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/collection/listImageByCollection/${collectionId}`);
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                const images = data.map(item => item.imageUrl);
                setBannerImages(images);
            } catch (error) {
                console.error('Failed to fetch collection details:', error);
            }
        }

        fetchCollectionDetail();
        fetchCollectionProducts();
        fetchBannerImages();
    }, [collectionId]);

    if (!collection) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-bgOuter px-10 py-6">
            {/* Breadcrumb */}
            <div className="text-white mb-4 flex justify-center">
                <Link to="/" className="text-gray-400">Trang chủ</Link> /
                <Link to="/collection" className="text-gray-400 mx-1">Bộ sưu tập</Link>/ {collection.name}
            </div>

            {/* Banner Slider */}
            <div className="mb-8">
                <Slider {...bannerSettings}>
                    {bannerImages.map((image, index) => (
                        <div key={index} className="relative">
                            <div className="h-[350px] flex items-center justify-center bg-gray-800">
                                <img
                                    src={image}
                                    alt={`${collection.name} banner ${index + 1}`}
                                    className="h-full w-[80%] object-cover rounded-lg"
                    />
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>

            {/* Collection Description */}
            <div className="text-center mb-12 px-4 max-w-4xl mx-auto">
                <h1 className="text-4xl font-serif italic text-white mb-6">{collection.name}</h1>
                <p className="text-gray-300 text-lg">{collection.description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => {
                    const thumbnail = product.productImages.find(image => image.isThumbnail);
                    const imageUrl = thumbnail ? thumbnail.imageUrl : '';
                    return (
                        <Link to={`/product/productDetail/${product.id}`} key={product.productId}
                            className="bg-white bg-opacity-10 rounded-lg p-4 hover:bg-opacity-20 transition-all duration-300">
                            <div className="relative group">
                                <img
                                    src={imageUrl}
                                    alt={product.name}
                                    className="w-full aspect-square object-cover rounded-lg mb-4"
                                />
                                {product.oldPrice && (
                                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm">
                                        Sale
                                    </div>
                                )}
                            </div>
                            <h3 className="text-white font-medium mb-2">{product.name}</h3>
                            <div className="flex justify-between items-center">
                                <span className="text-white font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</span>
                                {product.oldPrice && (
                                    <span className="text-gray-400 line-through text-sm">{product.oldPrice}</span>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default CollectionDetail;