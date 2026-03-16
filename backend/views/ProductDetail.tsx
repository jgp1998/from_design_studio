import { ShoppingCart, Check } from 'lucide-react';
import { useState } from 'react';
import { ViewType, CartItem } from '../types';
import { mockProducts } from '../mockData';

interface ProductDetailProps {
    selectedProductId: string;
    onViewChange: (view: ViewType) => void;
    onAddToCart: (item: CartItem) => void;
}

export function ProductDetail({ selectedProductId, onViewChange, onAddToCart }: ProductDetailProps) {
    const product = mockProducts.find(p => p.id === selectedProductId);
    const [configuration, setConfiguration] = useState({
        size: 'Medium',
        color: 'Blue',
        material: 'PLA'
    });
    const [quantity, setQuantity] = useState(1);
    const [showSuccess, setShowSuccess] = useState(false);

    if (!product) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <p className="text-slate-600">Product not found</p>
            </div>
        );
    }

    const calculatePrice = () => {
        let price = product.basePrice;
        if (configuration.size === 'Large') price *= 1.5;
        if (configuration.size === 'Small') price *= 0.7;
        if (configuration.material === 'Resin') price *= 1.3;
        if (configuration.material === 'PETG') price *= 1.2;
        return Math.round(price * 100) / 100;
    };

    const handleAddToCart = () => {
        const cartItem: CartItem = {
            id: `${product.id}-${Date.now()}`,
            type: 'product',
            productId: product.id,
            name: product.name,
            configuration: { ...configuration },
            quantity,
            price: calculatePrice()
        };

        onAddToCart(cartItem);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
    };

    const colorSwatches: Record<string, string> = {
        Red: 'bg-red-500',
        Blue: 'bg-blue-500',
        Black: 'bg-slate-900',
        White: 'bg-white border-2 border-slate-300',
        Gray: 'bg-gray-500',
        Yellow: 'bg-yellow-500',
        Green: 'bg-green-500'
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => onViewChange('store-catalog')}
                    className="text-indigo-600 hover:text-indigo-800 font-medium mb-6 inline-flex items-center"
                >
                    ← Back to Catalog
                </button>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="grid lg:grid-cols-2 gap-8">
                        <div className="aspect-square bg-slate-100">
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="p-8 lg:p-12">
                            <div className="mb-6">
                                <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full mb-4">
                                    {product.category}
                                </span>
                                <h1 className="text-3xl font-bold text-slate-900 mb-4">{product.name}</h1>
                                <p className="text-lg text-slate-600 leading-relaxed">{product.description}</p>
                            </div>

                            <div className="space-y-6 mb-8">
                                {product.sizes.length > 1 && (
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                                            Size
                                        </label>
                                        <div className="flex gap-3">
                                            {product.sizes.map(size => (
                                                <button
                                                    key={size}
                                                    onClick={() => setConfiguration({ ...configuration, size })}
                                                    className={`px-6 py-3 rounded-lg font-medium transition-all ${configuration.size === size
                                                            ? 'bg-indigo-600 text-white shadow-lg'
                                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                        }`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                                        Color
                                    </label>
                                    <div className="flex flex-wrap gap-3">
                                        {product.colors.map(color => (
                                            <button
                                                key={color}
                                                onClick={() => setConfiguration({ ...configuration, color })}
                                                className={`relative w-12 h-12 rounded-full transition-all ${colorSwatches[color]
                                                    } ${configuration.color === color
                                                        ? 'ring-4 ring-indigo-600 ring-offset-2'
                                                        : 'hover:scale-110'
                                                    }`}
                                                title={color}
                                            >
                                                {configuration.color === color && (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <Check className={`w-6 h-6 ${color === 'White' ? 'text-slate-900' : 'text-white'}`} />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-sm text-slate-600 mt-2">Selected: {configuration.color}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                                        Material
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {product.materials.map(material => (
                                            <button
                                                key={material}
                                                onClick={() => setConfiguration({ ...configuration, material })}
                                                className={`px-4 py-3 rounded-lg font-medium transition-all ${configuration.material === material
                                                        ? 'bg-indigo-600 text-white shadow-lg'
                                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                    }`}
                                            >
                                                {material}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                                        Quantity
                                    </label>
                                    <div className="flex items-center space-x-4">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold text-slate-700 transition-colors"
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            min="1"
                                            value={quantity}
                                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                            className="w-20 text-center px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-semibold"
                                        />
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold text-slate-700 transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-slate-200 pt-6 mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-slate-600">Unit Price:</span>
                                    <span className="text-2xl font-bold text-slate-900">${calculatePrice()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-semibold text-slate-900">Total:</span>
                                    <span className="text-3xl font-bold text-indigo-600">
                                        ${(calculatePrice() * quantity).toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-lg transition-all shadow-lg hover:shadow-xl text-lg flex items-center justify-center space-x-2"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                <span>Add to Cart</span>
                            </button>

                            {showSuccess && (
                                <div className="mt-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center space-x-2">
                                    <Check className="w-5 h-5" />
                                    <span className="font-medium">Added to cart successfully!</span>
                                </div>
                            )}

                            <div className="mt-6 bg-slate-50 rounded-lg p-4">
                                <h3 className="font-semibold text-slate-900 mb-2">Product Features</h3>
                                <ul className="text-sm text-slate-600 space-y-1">
                                    <li>• Precision 3D printed</li>
                                    <li>• Quality assured</li>
                                    <li>• Fast production and delivery</li>
                                    <li>• Customizable options</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
