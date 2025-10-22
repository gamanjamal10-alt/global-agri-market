
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import * as api from '../services/mockApi';
import Spinner from '../components/ui/Spinner';
import { LanguageContext } from '../contexts/LanguageContext';

interface TrackingStatus {
    currentLocation: { lat: number, lng: number };
    estimatedDelivery: string;
    history: { status: string; location: string; timestamp: string }[];
}

const TrackingPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const { t } = useContext(LanguageContext);
    const [status, setStatus] = useState<TrackingStatus | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (orderId) {
            api.getShipmentStatus(orderId).then(data => {
                setStatus(data);
                setLoading(false);
            });
        }
    }, [orderId]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
    }

    if (!status) {
        return <p className="text-center text-red-500 mt-10">Tracking information not found for order {orderId}.</p>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">{t('shipment_tracking')}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">{t('order_id')}: <span className="font-mono">{orderId}</span></p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Map Section */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('current_location')}</h2>
                    {/* This is a placeholder for a real map integration like Google Maps or Leaflet */}
                    <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                       <div className="text-center">
                            <svg className="w-16 h-16 text-primary-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">Map simulation</p>
                            <p className="text-sm font-mono text-gray-500">Lat: {status.currentLocation.lat}, Lng: {status.currentLocation.lng}</p>
                       </div>
                    </div>
                    <p className="mt-4 text-center text-lg font-semibold">{t('estimated_delivery')}: {status.estimatedDelivery}</p>
                </div>

                {/* Timeline Section */}
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('tracking_history')}</h2>
                    <ol className="relative border-s border-gray-200 dark:border-gray-700">
                        {status.history.map((item, index) => (
                             <li key={index} className="mb-10 ms-4">
                                <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                                <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">{new Date(item.timestamp).toLocaleString()}</time>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.status}</h3>
                                <p className="text-base font-normal text-gray-500 dark:text-gray-400">{item.location}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default TrackingPage;
