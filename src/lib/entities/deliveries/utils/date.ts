/**
 * Determines the accounting date for a delivery.
 * For accepted overdue deliveries, returns accepted_date,
 * otherwise returns expected_date.
 */
export function getAccountingDate(delivery: {
  status: string;
  expected_date: string | null;
  accepted_date: string | null;
}): string | null {
  if (!delivery.expected_date) {
    return null;
  }

  // If delivery is accepted and overdue (accepted_date > expected_date),
  // use accepted_date for accounting
  if (
    delivery.status === 'accepted' &&
    delivery.accepted_date &&
    delivery.expected_date
  ) {
    const acceptedDate = delivery.accepted_date.slice(0, 10);
    const expectedDate = delivery.expected_date.slice(0, 10);

    if (acceptedDate > expectedDate) {
      return acceptedDate;
    }
  }

  return delivery.expected_date.slice(0, 10);
}

/**
 * Checks if a delivery is overdue and accepted
 */
export function isOverdueAccepted(delivery: {
  status: string;
  expected_date: string | null;
  accepted_date: string | null;
}): boolean {
  if (
    delivery.status === 'accepted' &&
    delivery.accepted_date &&
    delivery.expected_date
  ) {
    const acceptedDate = delivery.accepted_date.slice(0, 10);
    const expectedDate = delivery.expected_date.slice(0, 10);
    return acceptedDate > expectedDate;
  }
  return false;
}
