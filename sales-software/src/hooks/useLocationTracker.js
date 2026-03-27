import { useEffect } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';

const useLocationTracker = () => {
    const { currentUser, updateProfessionalLocation, toggleTrackingSetting } = useMarketplace();

    useEffect(() => {
        // Only track if user is professional and tracking is enabled
        if (!currentUser || currentUser.role !== 'professional' || !currentUser.trackingEnabled) {
            return;
        }

        const trackLocation = () => {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        updateProfessionalLocation(currentUser.id, latitude, longitude);
                    },
                    (error) => {
                        console.error("Error tracking location:", error);
                    },
                    { enableHighAccuracy: true }
                );
            }
        };

        // Initial track
        trackLocation();

        // Interval
        const intervalId = setInterval(trackLocation, 15000); // 15 seconds

        return () => clearInterval(intervalId);
    }, [currentUser?.id, currentUser?.trackingEnabled, currentUser?.role]);

    const requestPermission = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                () => {
                    // Success! Enable tracking in context
                    toggleTrackingSetting(currentUser.id, true);
                },
                (error) => {
                    console.error("Permission denied or error:", error);
                }
            );
        }
    };

    return { requestPermission };
};

export default useLocationTracker;
