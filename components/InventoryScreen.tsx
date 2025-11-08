import React, { useState, useMemo } from 'react';
import type { Product } from '../types';
import { AlertTriangleIcon, PlusIcon, PencilIcon, TrashIcon } from './Icons';
import Modal from './Modal';

interface ProductsScreenProps {
  products: Product[];
  onAdd: (newProduct: Product) => void;
  onUpdate: (updatedProduct: Product) => void;
  onDelete: (sku: string) => void;
}

const ProductForm: React.FC<{product?: Product | null; onSave: (product: Product) => void; onCancel: () => void;}> = ({ product, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Omit<Product, 'sku'> & { sku?: string }>({
        sku: product?.sku || '',
        user_id: product?.user_id || '',
        name: product?.name || '',
        costPrice: product?.costPrice || 0,
        price: product?.price || 0,
        quantity: product?.quantity || 0,
        lowStockThreshold: product?.lowStockThreshold || 10,
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!formData.sku) {
            alert("SKU is required.");
            return;
        }
        onSave(formData as Product);
    };

    const inputClasses = "w-full p-2 mt-1 border rounded-md bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 disabled:opacity-70";
    const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300";

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="sku" className={labelClasses}>SKU</label>
                    <input type="text" name="sku" value={formData.sku} onChange={handleChange} required disabled={!!product} className={inputClasses}/>
                </div>
                <div>
                    <label htmlFor="name" className={labelClasses}>Product Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className={inputClasses}/>
                </div>
                 <div>
                    <label htmlFor="costPrice" className={labelClasses}>Cost Price (Rs)</label>
                    <input type="number" name="costPrice" value={formData.costPrice} onChange={handleChange} step="0.01" min="0" required className={inputClasses}/>
                </div>
                 <div>
                    <label htmlFor="price" className={labelClasses}>Sale Price (Rs)</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} step="0.01" min="0" required className={inputClasses}/>
                </div>
                 <div>
                    <label htmlFor="quantity" className={labelClasses}>Quantity</label>
                    <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} min="0" required className={inputClasses}/>
                </div>
                 <div>
                    <label htmlFor="lowStockThreshold" className={labelClasses}>Low Stock Threshold</label>
                    <input type="number" name="lowStockThreshold" value={formData.lowStockThreshold} onChange={handleChange} min="0" required className={inputClasses}/>
                </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 font-semibold">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 font-semibold">{product ? 'Update' : 'Save'} Product</button>
            </div>
        </form>
    );
};


const ProductsScreen: React.FC<ProductsScreenProps> = ({ products, onAdd, onUpdate, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);
  
  const openAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };
  
  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSave = (product: Product) => {
    if (editingProduct) {
        onUpdate(product);
    } else {
        if(products.some(p => p.sku === product.sku)) {
            alert(`Product with SKU ${product.sku} already exists.`);
            return;
        }
        onAdd(product);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Products</h1>
        <div className="flex items-center gap-4 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
            />
            <button onClick={openAddModal} className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 font-semibold">
                <PlusIcon className="w-5 h-5 mr-2" /> Add Product
            </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">SKU</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cost Price</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Sale Price</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Quantity</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredProducts.map(product => {
              const isLowStock = product.quantity <= product.lowStockThreshold;
              return (
                <tr key={product.sku} className={isLowStock ? 'bg-red-500/10' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600 dark:text-gray-400">{product.sku}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">Rs {product.costPrice.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">Rs {product.price.toFixed(2)}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${isLowStock ? 'text-red-500' : 'text-gray-800 dark:text-gray-200'}`}>
                    <div className="flex items-center">
                      {product.quantity}
                      {isLowStock && <AlertTriangleIcon className="w-4 h-4 ml-2" title="Low stock" />}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button onClick={() => openEditModal(product)} className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"><PencilIcon className="w-4 h-4"/></button>
                    <button onClick={() => onDelete(product.sku)} className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400"><TrashIcon className="w-4 h-4"/></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProduct ? 'Edit Product' : 'Add New Product'} size="lg">
        <ProductForm product={editingProduct} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default ProductsScreen;
