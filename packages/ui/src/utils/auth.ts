/**
 * Authentication utilities for managing user session.
 */

/**
 * Clears all cookies by setting them to expire in the past.
 * Note: HTTP-only cookies cannot be cleared from JavaScript,
 * but this will clear any non-HTTP-only cookies.
 */
function clearCookies(): void {
  // Get all cookies
  const cookies = document.cookie.split(';');
  
  // Clear each cookie by setting it to expire in the past
  cookies.forEach((cookie) => {
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
    
    // Try to clear cookie for current domain and parent domains
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
    
    // Also try with leading dot for subdomain cookies
    const parts = window.location.hostname.split('.');
    if (parts.length > 1) {
      const domain = '.' + parts.slice(-2).join('.');
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${domain}`;
    }
  });
}

/**
 * Clears all localStorage data.
 */
function clearLocalStorage(): void {
  localStorage.clear();
}

/**
 * Logs out the user by clearing all session data.
 * Calls backend logout endpoint to clear HTTP-only cookies,
 * then clears client-side storage and refreshes the page.
 */
export async function logout(): Promise<void> {
  // Save theme preference before clearing localStorage
  const theme = localStorage.getItem('theme');
  
  try {
    // Call backend logout endpoint to clear HTTP-only cookies
    const apiUrl = import.meta.env.VITE_API_URL || '';
    await fetch(`${apiUrl}/strava/logout`, {
      method: 'POST',
      credentials: 'include', // Include cookies
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Logout request failed:', error);
    // Continue with client-side cleanup even if backend call fails
  }
  
  // Clear all client-side data
  clearCookies();
  clearLocalStorage();
  
  // Restore theme preference (user preference, not auth-related)
  if (theme) {
    localStorage.setItem('theme', theme);
  }
  
  // Force a hard refresh to ensure fresh state
  // Use replace to prevent back button from going to logged-in state
  window.location.replace('/');
}

/**
 * Checks if user is logged in by checking if we have auth data.
 * This is a simple check - actual auth state is determined by API calls.
 */
export function isLoggedIn(): boolean {
  // Check if theme preference exists (indicates user has been here before)
  // But more importantly, we'll check this via the activities hook
  // For now, return true if localStorage has theme preference
  return localStorage.getItem('theme') !== null;
}
