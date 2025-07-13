
import { Product } from '@/types/restaurant';
import { CategoryService } from '@/services/categoryService';

const STORAGE_KEY = 'restaurant_products';

// Sample data for demonstration
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'برجر اللحم الفاخر',
    price: 85,
    description: 'برجر لحم طازج مع الخضار والجبن والصوص الخاص',
    category: 'main-dishes',
    status: 'أكل',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    createdAt: new Date()
  },
  {
    id: '2',
    name: 'دجاج مشوي',
    price: 120,
    description: 'دجاج مشوي بالأعشاب والتوابل مع الأرز الأبيض',
    category: 'main-dishes',
    status: 'ساخن',
    image: 'https://images.unsplash.com/photo-1594221708779-94832f4320d1?w=400',
    createdAt: new Date()
  },
  {
    id: '3',
    name: 'عصير برتقال طازج',
    price: 25,
    description: 'عصير برتقال طبيعي 100% بدون إضافات',
    category: 'beverages',
    status: 'بارد',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400',
    createdAt: new Date()
  },
  {
    id: '4',
    name: 'حمص بالطحينة',
    price: 35,
    description: 'حمص كريمي مع الطحينة وزيت الزيتون',
    category: 'appetizers',
    status: 'بارد',
    image: 'https://images.unsplash.com/photo-1571197119282-7c4759f8c140?w=400',
    createdAt: new Date()
  },
  {
    id: '5',
    name: 'كنافة نابلسية',
    price: 45,
    description: 'كنافة طازجة بالجبن والقطر',
    category: 'desserts',
    status: 'ساخن',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
    createdAt: new Date()
  },
  {
    id: '6',
    name: 'سلطة فتوش',
    price: 30,
    description: 'سلطة خضار مشكلة مع الخبز المحمص والسماق',
    category: 'salads',
    status: 'بارد',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
    createdAt: new Date()
  }
];

export class ProductService {
  static getProducts(): Product[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored).map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt)
      }));
    }
    
    // Initialize with sample data
    this.saveProducts(sampleProducts);
    return sampleProducts;
  }

  static saveProducts(products: Product[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }

  static addProduct(product: Omit<Product, 'id' | 'createdAt'>): Product {
    const products = this.getProducts();
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    
    products.push(newProduct);
    this.saveProducts(products);
    return newProduct;
  }

  static updateProduct(id: string, productData: Omit<Product, 'id' | 'createdAt'>): Product {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new Error('Product not found');
    }

    const updatedProduct: Product = {
      ...products[index],
      ...productData
    };

    products[index] = updatedProduct;
    this.saveProducts(products);
    return updatedProduct;
  }

  static getProductsByCategory(categoryId: string): Product[] {
    return this.getProducts().filter(product => product.category === categoryId);
  }

  static getCategoryName(categoryId: string): string {
    return CategoryService.getCategoryName(categoryId);
  }

  static deleteProduct(productId: string): void {
    const products = this.getProducts().filter(p => p.id !== productId);
    this.saveProducts(products);
  }
}
