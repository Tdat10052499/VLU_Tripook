import { useState, useEffect } from 'react';
import { tripService } from '../services/api';
import { Trip } from '../types';

export const useTrips = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await tripService.getTrips();
      setTrips(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch trips');
      console.error('Error fetching trips:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const createTrip = async (tripData: Partial<Trip>) => {
    try {
      const response = await tripService.createTrip(tripData);
      setTrips(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      console.error('Error creating trip:', err);
      throw err;
    }
  };

  const updateTrip = async (id: string, tripData: Partial<Trip>) => {
    try {
      const response = await tripService.updateTrip(id, tripData);
      setTrips(prev => prev.map(trip => trip.id === id ? response.data : trip));
      return response.data;
    } catch (err) {
      console.error('Error updating trip:', err);
      throw err;
    }
  };

  const deleteTrip = async (id: string) => {
    try {
      await tripService.deleteTrip(id);
      setTrips(prev => prev.filter(trip => trip.id !== id));
    } catch (err) {
      console.error('Error deleting trip:', err);
      throw err;
    }
  };

  return {
    trips,
    loading,
    error,
    fetchTrips,
    createTrip,
    updateTrip,
    deleteTrip,
  };
};