export const PREFERENCE_AGENT_TOOL_DESCRIPTION = `
Extract structured travel preferences from the user request.

Call with a prompt containing the user's message (and any prior answers).

Returns JSON with: isComplete, destination, interests, days, budget, missingFields, clarifyingQuestions.

Do NOT call place_agent or schedule_agent until isComplete is true.
If isComplete is false, ask the user the clarifyingQuestions and stop.
`.trim();

export const PLACE_AGENT_TOOL_DESCRIPTION = `
Discover places/attractions that match complete travel preferences.

Call with a prompt that includes the FULL preference JSON (destination, interests, days, budget).

Returns JSON: { places: [{ name, category, description, estimatedDuration, reason, googleMapsLink }] }.

Do not invent an itinerary. Pass the returned places VERBATIM to schedule_agent.
`.trim();

export const SCHEDULE_AGENT_TOOL_DESCRIPTION = `
Build a day-by-day itinerary from preferences and places.

CRITICAL: The prompt MUST include:
1) the FULL preference JSON, and
2) the FULL places JSON from place_agent, copied verbatim (do not summarize or drop places).

Returns structured itinerary JSON with non-empty activities per day when places exist.

If output has empty activities, do NOT retry with the same thin prompt — re-call place_agent or ask the user.
`.trim();

export const REVIEWER_AGENT_TOOL_DESCRIPTION = `
Review a draft itinerary for feasibility, route logic, timing, and preference fit.

Call with a prompt that includes: preferences JSON, places JSON, and the schedule JSON.

Returns JSON: isOptimized, isMeetingPreferences, score (0-100), suggestions[].

Use at most 2 review cycles total. If still not approved, present the best draft + remaining issues to the user.
`.trim();
