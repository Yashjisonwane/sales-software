// ============================================================
// API SERVICE — Unified Facade for all marketplace operations
// ============================================================
// This is the entry point for the UI to interact with all services.
// All methods are async to mirror real API calls.

import { distributeNewLead, getAllLeads, getLeadById, updateLeadStatus, getAssignmentsForLead, respondToAssignment, getAssignmentsForProfessional } from './leadService';
import { getAllProfessionals, getProfessionalById, getProfessionalsByCategory } from './professionalService';

// ─── LEADS ───────────────────────────────────────────────────

/**
 * Submit a new service request and trigger lead distribution.
 * Used by: RequestService.jsx (Customer Website)
 *
 * @param {Object} formData - From ServiceRequestForm
 */
export const submitServiceRequest = async (formData) => {
    try {
        const result = await distributeNewLead(formData);
        return { success: true, data: result };
    } catch (err) {
        console.error('[API] submitServiceRequest error:', err);
        return { success: false, error: err.message };
    }
};

/**
 * Fetch all leads (admin dashboard).
 */
export const fetchAllLeads = async () => {
    await delay(100);
    return { success: true, data: getAllLeads() };
};

/**
 * Fetch a single lead with its assignments (professional view).
 */
export const fetchLeadDetail = async (leadId) => {
    await delay(80);
    const lead = getLeadById(leadId);
    const assignments = getAssignmentsForLead(leadId);
    if (!lead) return { success: false, error: 'Lead not found.' };
    return { success: true, data: { lead, assignments } };
};

/**
 * Update lead status (admin action).
 */
export const changeLeadStatus = async (leadId, status) => {
    await delay(80);
    const updated = updateLeadStatus(leadId, status);
    return { success: true, data: updated };
};

// ─── PROFESSIONALS ───────────────────────────────────────────

/**
 * Fetch all professionals (admin directory).
 */
export const fetchAllProfessionals = async () => {
    await delay(100);
    return { success: true, data: getAllProfessionals() };
};

/**
 * Fetch a single professional profile.
 */
export const fetchProfessionalProfile = async (id) => {
    await delay(80);
    const prof = getProfessionalById(id);
    if (!prof) return { success: false, error: 'Professional not found.' };
    return { success: true, data: prof };
};

/**
 * Fetch professionals by category (customer find-services page).
 */
export const fetchProfessionalsByCategory = async (category) => {
    await delay(80);
    return { success: true, data: getProfessionalsByCategory(category) };
};

// ─── ASSIGNMENTS ─────────────────────────────────────────────

/**
 * Professional: Accept or Reject a lead assignment.
 * @param {string} assignmentId
 * @param {string} professionalId
 * @param {'accept'|'reject'} decision
 */
export const handleLeadResponse = async (assignmentId, professionalId, decision) => {
    await delay(100);
    const updated = respondToAssignment(assignmentId, professionalId, decision);
    return { success: true, data: updated };
};

/**
 * Get all assignments for a professional dashboard.
 */
export const fetchProfessionalAssignments = async (professionalId) => {
    await delay(80);
    return { success: true, data: getAssignmentsForProfessional(professionalId) };
};

// ─── HELPER ──────────────────────────────────────────────────
/** Simulate network latency (ms) */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
