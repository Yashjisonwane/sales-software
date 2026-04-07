import apiClient from './apiClient';

/**
 * Plug dedicated business features here so screens stay thin.
 * Stubs return safe shapes today; swap bodies for real routes when ready.
 *
 * Suggested backend routes (examples):
 * - GET/POST /api/v1/billing/payment-methods
 * - GET/PUT /api/v1/business/team
 * - GET/POST /api/v1/business/tax/documents
 * - GET/PUT /api/v1/business/inventory
 * - GET/POST /api/v1/business/campaigns
 */

export const FUTURE_ROUTES = {
  paymentMethods: '/api/v1/billing/payment-methods',
  team: '/api/v1/business/team',
  tax: '/api/v1/business/tax',
  inventory: '/api/v1/business/inventory',
  campaigns: '/api/v1/business/campaigns',
};

/**
 * @returns {Promise<{ success: boolean, data: Array, source: string, message?: string }>}
 */
export async function fetchPaymentMethods() {
  return {
    success: true,
    data: [],
    source: 'stub',
    message: '',
  };
}

/**
 * @param {object} _payload — e.g. { paymentMethodId, setDefault }
 */
export async function savePaymentMethod(_payload) {
  return { success: false, source: 'stub', message: 'Not implemented — add POST in futureBusinessApi.' };
}

/**
 * @param {string} _id
 */
export async function removePaymentMethod(_id) {
  return { success: false, source: 'stub', message: 'Not implemented — add DELETE in futureBusinessApi.' };
}

/** Team module — replace with GET /api/v1/business/team */
export async function fetchTeamOverview() {
  return { success: true, data: null, source: 'stub' };
}

/** Tax module */
export async function fetchTaxSummary() {
  return { success: true, data: null, source: 'stub' };
}

/** Inventory module */
export async function fetchInventoryItems() {
  return { success: true, data: null, source: 'stub' };
}

/** Campaigns module */
export async function fetchCampaigns() {
  return { success: true, data: null, source: 'stub' };
}
