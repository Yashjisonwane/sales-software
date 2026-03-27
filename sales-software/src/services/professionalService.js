// ============================================================
// PROFESSIONAL SERVICE — Query and filter professionals
// ============================================================
import { professionalsData } from '../data/models';

/**
 * Utility: Calculate straight-line distance between two lat/lng points (Haversine formula).
 * @returns distance in miles
 */
export const haversineDistanceMiles = (lat1, lon1, lat2, lon2) => {
    const R = 3958.8; // Earth radius in miles
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

/**
 * Get all active professionals by service category.
 * @param {string} category - e.g. 'Plumbing'
 * @returns {Array} professionals that offer this category
 */
export const getProfessionalsByCategory = (category) => {
    return professionalsData.filter(
        (p) =>
            p.status === 'Active' &&
            p.availability !== 'Offline' &&
            (p.category.toLowerCase() === category.toLowerCase() ||
                (p.services || []).some((s) => s.toLowerCase() === category.toLowerCase()))
    );
};

/**
 * Filter professionals by proximity to a lead's location.
 * @param {Array} professionals - Pre-filtered list
 * @param {number} leadLat - Lead latitude
 * @param {number} leadLon - Lead longitude
 * @returns {Array} professionals within their declared serviceRadius, with distance field added
 */
export const filterByProximity = (professionals, leadLat, leadLon) => {
    return professionals
        .map((p) => {
            const distance = haversineDistanceMiles(p.latitude, p.longitude, leadLat, leadLon);
            return { ...p, distanceFromLead: parseFloat(distance.toFixed(1)) };
        })
        .filter((p) => p.distanceFromLead <= (p.serviceRadius || 20));
};

/**
 * Score and rank professionals for a given lead.
 * Scoring factors:
 *  - Rating (40%)
 *  - Completed jobs (30%)
 *  - Distance inversely (20%)
 *  - Subscription plan tier (10%)
 *
 * @param {Array} professionals - Proximity-filtered list with distanceFromLead
 * @returns {Array} sorted by score descending
 */
export const rankProfessionals = (professionals) => {
    const planScore = { Premium: 10, Pro: 6, Starter: 2 };

    return professionals
        .map((p) => {
            const ratingScore = (p.rating / 5) * 40;
            const jobScore = Math.min(p.completedJobs / 500, 1) * 30;
            const distanceScore = Math.max(0, (1 - p.distanceFromLead / 50)) * 20;
            const subScore = (planScore[p.subscriptionPlan] || 2) / 10;
            const totalScore = ratingScore + jobScore + distanceScore + subScore;
            return { ...p, matchScore: parseFloat(totalScore.toFixed(2)) };
        })
        .sort((a, b) => b.matchScore - a.matchScore);
};

/**
 * Get all professionals for the platform (admin use).
 */
export const getAllProfessionals = () => [...professionalsData];

/**
 * Get a single professional by ID.
 */
export const getProfessionalById = (id) =>
    professionalsData.find((p) => p.id === id) || null;
