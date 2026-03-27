// ============================================================
// LEAD SERVICE — Core Lead Distribution Engine
// ============================================================
import { leadsData, leadAssignments } from '../data/models';
import {
    getProfessionalsByCategory,
    filterByProximity,
    rankProfessionals,
} from './professionalService';
import { notifyProfessional, notifyCustomer } from './notificationService';

// In-memory store for this session (replaces a real DB)
let leads = [...leadsData];
let assignments = [...leadAssignments];
let assignmentCounter = leadAssignments.length + 1;
let leadCounter = leadsData.length + 1;

// ─── CONFIGURATION ───────────────────────────────────────────
const MIN_PROFESSIONALS = 3;
const MAX_PROFESSIONALS = 5;
const ASSIGNMENT_TTL_HOURS = 24;

// ─── LEAD CRUD ───────────────────────────────────────────────

/**
 * Get all leads (admin view).
 */
export const getAllLeads = () => [...leads];

/**
 * Get a single lead by ID.
 */
export const getLeadById = (id) => leads.find((l) => l.id === id) || null;

/**
 * Update lead status.
 */
export const updateLeadStatus = (leadId, status) => {
    leads = leads.map((l) => (l.id === leadId ? { ...l, status } : l));
    return getLeadById(leadId);
};

// ─── CORE DISTRIBUTION ENGINE ────────────────────────────────

/**
 * MAIN ENTRY POINT — Distribute a new service request to matching professionals.
 *
 * Algorithm:
 *  1. Validate lead fields
 *  2. Find professionals by service category
 *  3. Filter by service radius using lat/lng
 *  4. Rank by score (rating, jobs, distance, subscription)
 *  5. Select top 3-5 professionals
 *  6. Create LeadAssignment records
 *  7. Send Email/SMS/App notifications
 *  8. Notify the customer with confirmation
 *
 * @param {Object} formData - Data from ServiceRequestForm
 * @returns {{ lead, assignments, notified }} Result object
 */
export const distributeNewLead = async (formData) => {
    // ── Step 1: Build and save the new Lead ──────────────────
    const name = formData.name || formData.customerName || 'Unknown Customer';
    const phone = formData.phone || formData.customerPhone || '';
    const email = formData.email || formData.customerEmail || '';
    const serviceCategory = formData.serviceCategory || formData.service || formData.category || '';
    const location = formData.location || '';
    const zipCode = formData.zipCode || '';
    const description = formData.description || '';
    const budget = formData.budget || formData.budgetMin || 'TBD';
    const preferredDate = formData.preferredDate || formData.dateNeeded || null;
    const urgency = formData.urgency || 'Medium';
    const photos = formData.photos || [];

    // Simulate a geocode lookup using a fixed offset on a base lat/lon
    // In production: call Google Geocoding API
    const baseLat = 39.7990;
    const baseLon = -89.6442;
    const jitter = () => (Math.random() - 0.5) * 0.05;

    const newLead = {
        id: formData.id || `L${Date.now()}`,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        serviceCategory: serviceCategory,
        description,
        location,
        zipCode,
        latitude: formData.latitude !== undefined ? formData.latitude : baseLat + jitter(),
        longitude: formData.longitude !== undefined ? formData.longitude : baseLon + jitter(),
        status: formData.status || 'Open',
        urgency,
        budget,
        preferredDate,
        assignedTo: formData.assignedTo || null,
        assignedProfessionals: formData.assignedProfessionals || [],
        dateRequested: formData.dateRequested || new Date().toISOString(),
        photos,
    };

    leads.push(newLead);
    console.log(`[LEAD SERVICE] New lead created: ${newLead.id} — ${newLead.serviceCategory}`);

    // ── Step 2: Category matching ────────────────────────────
    const categoryMatches = getProfessionalsByCategory(newLead.serviceCategory);
    console.log(`[LEAD SERVICE] Step 2 — Category matches: ${categoryMatches.length}`);

    if (categoryMatches.length === 0) {
        console.warn(`[LEAD SERVICE] No professionals found for category: ${newLead.serviceCategory}`);
        return { lead: newLead, assignments: [], notified: 0, error: 'No professionals available for this service.' };
    }

    // ── Step 3: Proximity filter ─────────────────────────────
    const nearbyProfessionals = filterByProximity(categoryMatches, newLead.latitude, newLead.longitude);
    console.log(`[LEAD SERVICE] Step 3 — Within service radius: ${nearbyProfessionals.length}`);

    // ── Step 4: Rank by score ────────────────────────────────
    const ranked = rankProfessionals(nearbyProfessionals);
    console.log(`[LEAD SERVICE] Step 4 — Ranked professionals:`, ranked.map(p => `${p.name} (${p.matchScore})`));

    // ── Step 5: Select 3-5 top professionals ─────────────────
    const selected = ranked.slice(0, Math.min(MAX_PROFESSIONALS, Math.max(MIN_PROFESSIONALS, ranked.length)));
    console.log(`[LEAD SERVICE] Step 5 — Selected ${selected.length} professionals for notification`);

    // ── Step 6: Create LeadAssignment records ────────────────
    const newAssignments = [];
    const expiresAt = new Date(Date.now() + ASSIGNMENT_TTL_HOURS * 60 * 60 * 1000).toISOString();

    for (const pro of selected) {
        const assignment = {
            id: `LA${String(assignmentCounter++).padStart(3, '0')}`,
            leadId: newLead.id,
            professionalId: pro.id,
            assignedAt: new Date().toISOString(),
            status: 'Sent',
            responseAt: null,
            notificationsSent: { email: false, sms: false, app: false },
            distanceFromLead: pro.distanceFromLead,
            matchScore: pro.matchScore,
            expiresAt,
        };
        assignments.push(assignment);
        newAssignments.push({ assignment, professional: pro });
    }

    // Update the lead record with the notified professionals
    const notifiedIds = selected.map((p) => p.id);
    leads = leads.map((l) =>
        l.id === newLead.id ? { ...l, assignedProfessionals: notifiedIds } : l
    );

    // ── Step 7: Fire all notifications concurrently ──────────
    console.log(`[LEAD SERVICE] Step 7 — Sending notifications to ${selected.length} professionals`);
    await Promise.all(
        newAssignments.map(async ({ assignment, professional }) => {
            const notifResults = await notifyProfessional(professional, newLead);
            // Update assignment with notification status
            assignments = assignments.map((a) =>
                a.id === assignment.id ? { ...a, notificationsSent: { email: !!notifResults.email, sms: !!notifResults.sms, app: !!notifResults.app } } : a
            );
        })
    );

    // ── Step 8: Notify the customer ──────────────────────────
    console.log(`[LEAD SERVICE] Step 8 — Sending confirmation to customer: ${newLead.customerEmail}`);
    await notifyCustomer(newLead, selected.length);

    console.log(`[LEAD SERVICE] Distribution complete for lead ${newLead.id}. ${selected.length} professionals notified.`);

    return {
        lead: newLead,
        assignments: newAssignments.map((a) => a.assignment),
        notified: selected.length,
    };
};

// ─── ASSIGNMENT MANAGEMENT ───────────────────────────────────

/**
 * Get all assignments for a given lead.
 */
export const getAssignmentsForLead = (leadId) =>
    assignments.filter((a) => a.leadId === leadId);

/**
 * Professional responds to an assignment (Accept or Reject).
 * If accepted, update the lead status and set assignedTo.
 */
export const respondToLead = (assignmentId, professionalId, decision) => {
    setAssignments(prev => prev.map(a => {
        if (a.id === assignmentId && a.professionalId === professionalId) {
            const updatedStatus = decision === 'accept' ? 'Accepted' : 'Rejected';
            // If accepted, update lead status and assign professional, and reject other assignments
            if (decision === 'accept') {
                // Update main lead status and assignedTo
                updateLead(a.leadId, { status: 'Assigned', assignedTo: professionalId });
                // Reject other assignments for this lead
                setAssignments(prevAssignments => prevAssignments.map(other => {
                    if (other.leadId === a.leadId && other.id !== assignmentId) {
                        return { ...other, status: 'Rejected' };
                    }
                    return other;
                }));
            } else {
                // For reject, just update assignment status
                // Note: The original instruction had `updateLead(a.leadId, { status: 'Rejected' });` here.
                // This would set the lead status to 'Rejected' even if other professionals might still accept.
                // Keeping it as is to faithfully follow the instruction, but it might be a logical flaw.
                updateLead(a.leadId, { status: 'Rejected' });
            }
            return { ...a, status: updatedStatus, responseAt: new Date().toISOString() };
        }
        return a;
    }));
};

/**
 * Get all assignments for a specific professional.
 */
export const getAssignmentsForProfessional = (professionalId) =>
    assignments.filter((a) => a.professionalId === professionalId);
