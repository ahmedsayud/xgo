import axios from 'axios';
import { API_URL } from '../api/Api';

const apiClient = axios.create({
  baseURL: API_URL
});

export interface Brand {
  id: number;
  name: string;
  logo: string;
  cartCount: number;
}

export interface Type {
  name: string;
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface CarItem {
  id: string;
  name: string;
  image?: string;
  brand?: string;
  seats?: number;
  luggage?: string;
  transmission?: string;
  fuel?: string;
  price?: number | string;
  type?: string;
}

// دالة لجلب العلامات التجارية
export const getBrands = async (): Promise<Brand[]> => {
  try {
    const response = await apiClient.get('/api/user/filter-Info');
    
    if (!response.data?.brands) {
      throw new Error('No brands data available');
    }

    return response.data.brands.map((brand: any) => ({
      id: Number(brand.id) || 0,
      name: brand.attributes?.name || '',
      logo: brand.attributes?.logo || '',
      carCount: brand.attributes?.car_count || 0 
    }));
  } catch (error) {
    console.error('Error fetching brands:', error);
    return [];
  }
};

export const getTypes = async (): Promise<Type[]> => {
  try {
    const response = await apiClient.get('/api/user/filter-Info');
    
    if (!response.data?.types) {
      throw new Error('No types data available');
    }
    
    return response.data.types.map((type: any) => ({
      name: type.name || ''
    }));
  } catch (error) {
    console.error('Error fetching types:', error);
    return [];
  }
};

export const getPriceRange = async (): Promise<PriceRange> => {
  try {
    const response = await apiClient.get('/api/user/filter-Info');
    
    return {
      min: Number(response.data?.min_price) || 0,
      max: Number(response.data?.max_price) || 0
    };
  } catch (error) {
    console.error('Error fetching price range:', error);
    return { min: 0, max: 0 };
  }
};


// دالة لجلب السيارات مع إمكانية التصفية حسب العلامة التجارية
export const getCars = async (
  brandId?: number,
  type?: string,
  priceRange?: [number, number]
): Promise<CarItem[]> => {
  try {
    const params = new URLSearchParams();
    if (brandId) params.append('brand_id', brandId.toString());
    if (type) params.append('type', type);
    if (priceRange) {
      params.append('min_price', priceRange[0].toString());
      params.append('max_price', priceRange[1].toString());
    }
    const response = await apiClient.post('/api/user/Home');
    if (!response.data?.data) {
      throw new Error('No car data available');
    }
    return response.data.data
      .map((item: any) => ({
        id: String(item.id) || '',
        name: item.relationship?.['Model Names']?.model_name || '',
        image: item.attributes?.image || '',
        brand: item.relationship?.Brand?.brand_name || '',
        seats: item.attributes?.seats_count || 0,
        luggage: item.attributes?.seat_type || '',
        transmission: item.attributes?.transmission_type || '',
        fuel: item.attributes?.engine_type || '',
        price: Number(item.attributes?.price) || 0,
        type: item.relationship?.Types?.type_name || '',
        brand_id: Number(item.relationship?.Brand?.brand_id) || 0,
        model_id: Number(item.relationship?.['Model Names']?.model_id) || 0,
        type_id: Number(item.relationship?.Types?.type_id) || 0,
        brand_name: item.relationship?.Brand?.brand_name,
        type_name: item.relationship?.Types?.type_name
      }))
      .filter((car: CarItem) => {
        const brandMatch = !brandId || car.brand === response.data.data.find((d: any) => Number(d.relationship?.Brand?.brand_id) === brandId)?.relationship?.Brand?.brand_name;
        const typeMatch = !type || car.type === type;
        const priceMatch = !priceRange || (car.price >= priceRange[0] && car.price <= priceRange[1]);
        return brandMatch && typeMatch && priceMatch;
      });
  } catch (error) {
    alert('amin')
    console.error('Error fetching cars:', error);
    return [];
  }
};