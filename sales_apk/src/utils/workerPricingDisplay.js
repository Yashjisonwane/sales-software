/**
 * Leads have no hourly rate in the API — pricing is set after scope (quote flow).
 * Jobs may include estimate.amount and optional laborRate / laborHours on estimate.materials.
 */

function fmtMoney(n) {
  const x = Number(n);
  if (!Number.isFinite(x)) return null;
  const rounded = Math.abs(x - Math.round(x)) < 0.01 ? Math.round(x) : Math.round(x * 100) / 100;
  return `$${rounded.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

/**
 * @returns {{ primary: string, secondary: string }}
 */
export function getLeadPricingLines(lead) {
  if (!lead) {
    return { primary: 'Quote-based', secondary: '' };
  }
  const plan = (lead.servicePlan || 'Standard').trim();
  return {
    primary: 'Quote-based',
    secondary: `${plan} · set price in quote`,
  };
}

/**
 * @returns {{ primary: string, secondary: string }}
 */
export function getJobPricingLines(job) {
  if (!job) {
    return { primary: 'No quote yet', secondary: 'Complete quote on job' };
  }
  const est = job.estimate;
  const amt = est?.amount != null ? Number(est.amount) : NaN;
  if (Number.isFinite(amt) && amt > 0) {
    const m = est.materials && typeof est.materials === 'object' ? est.materials : {};
    const lr = m.laborRate != null ? Number(m.laborRate) : NaN;
    const lh = m.laborHours != null ? Number(m.laborHours) : NaN;
    if (Number.isFinite(lr) && lr > 0 && Number.isFinite(lh) && lh > 0) {
      return {
        primary: fmtMoney(lr) + '/hr',
        secondary: `${lh}h labor · ${fmtMoney(amt)} total`,
      };
    }
    return {
      primary: fmtMoney(amt),
      secondary: 'Quoted total',
    };
  }
  return {
    primary: 'No quote yet',
    secondary: 'Start Quote from job',
  };
}

/**
 * For JobOfferDetail: prefer full job (schedule) else lead only.
 */
export function getOfferPricingLines(routeParams) {
  const { job, lead } = routeParams || {};
  if (job && job.id) return getJobPricingLines(job);
  return getLeadPricingLines(lead);
}
