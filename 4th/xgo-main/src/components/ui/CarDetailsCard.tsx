import React, { useState, useEffect } from 'react';
import { getCars } from '../../context/Data/DataUser';
import type { CarItem } from '../../context/Data/DataUser';
import type { FilterState } from './CarFilterSidebar';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import AirlineSeatReclineExtraIcon from '@mui/icons-material/AirlineSeatReclineExtra';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

import EarbudsIcon from '@mui/icons-material/Earbuds';interface Props {
filters: FilterState;
}

const CarDetailsCard: React.FC<Props> = ({ filters }) => {
const [cars, setCars] = useState<CarItem[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
    const fetchCars = async () => {
    try {
        setLoading(true);
        setError(null);
        const fetchedCars = await getCars(
        filters.selectedBrands[0], // Assuming single brand selection
        filters.selectedTypes[0], // Assuming single type selection
        filters.priceRange
        );
        setCars(fetchedCars);
    } catch (err) {
        console.error('Error fetching cars:', err);
        setError('Failed to load car data. Please try again later.');
    } finally {
        setLoading(false);
    }
    };

    fetchCars();
}, [filters]);

if (loading) {
    return <div className="p-4 text-center">Loading car details...</div>;
}

if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
}

if (cars.length === 0) {
    return <div className="p-4 text-center">No cars match the current filters.</div>;
}

return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
    {cars.map((car) => (
        <div key={car.id} className="bg-[#FAF7F2] rounded-xl">
        <div>
            {car.image && (
            <img
                src={car.image}
                alt={car.name || 'Car image'}
                className="w-full h-48 object-cover mb-4 rounded-lg"
            />
            )}
            <div className='flex justify-between items-center px-2'>
                <h2 className="text-xl font-bold mb-2">{car.name || 'Unnamed Car'}</h2>
                {car.brand && (
                    <div className='bg-[#E5393533] w-16 h-7 rounded-2xl flex items-center justify-center text-sm'>
                        {car.brand}
                    </div>
                )}
            </div>
            <div className="grid grid-cols-4 px-2">
            {car.type && (
                <div className='flex items-center'>
                <AirlineSeatReclineExtraIcon/>
                <p className="font-medium">{car.type}</p>
                </div>
            )}
            {car.seats && (
                <div className='flex items-center'>
                    <DirectionsCarIcon/>                
                    {car.seats}
                </div>
            )}
            {car.transmission && (
                <div className='flex items-center'>
                    <EarbudsIcon/>
                    {car.transmission}
                </div>
            )}
            {car.fuel && (
                <div className='flex items-center'>
                    <LocalGasStationIcon/>
                    {car.fuel}
                </div>
            )}
            </div>
            {car.price && (
                <div className="col-span-2">
                <p className="text-gray-500 text-sm">Price</p>
                <p className="font-medium text-lg text-[#E6911E]">
                    ${typeof car.price === 'number' ? car.price.toLocaleString() : car.price}
                </p>
                </div>
            )}
        </div>
        </div>
    ))}
    </div>
);
};

export default CarDetailsCard;