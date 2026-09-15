import { EventItem, EventCategory, Attendee } from '../types';

export const GOOGLE_SHEET_ID = '19FMlhW6Icc3rj9x5cvY29kLmcvxwHYEDXd0oq0nFj3c';
export const GOOGLE_SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:csv`;

// Helper to clean price strings into numeric values
function parseCost(costStr: string): { amount: number; label: string } {
  if (!costStr) return { amount: 0, label: 'Free' };
  const trimmed = costStr.trim();
  if (trimmed === '£0' || trimmed.toLowerCase().includes('free') || trimmed === '0') {
    return { amount: 0, label: 'Free' };
  }
  // Find numeric values like £10.50, £19, £22.50
  const match = trimmed.match(/(\d+(?:\.\d+)?)/);
  if (match) {
    const num = parseFloat(match[1]);
    return { amount: num, label: trimmed.startsWith('£') ? trimmed : `£${trimmed}` };
  }
  return { amount: 0, label: trimmed };
}

// Helper to determine category
function categorize(section: string, name: string): EventCategory {
  const s = (section || '').toUpperCase();
  const n = (name || '').toLowerCase();
  if (s.includes('DAY') || n.includes('carnival') || n.includes('mela') || n.includes('festival') || n.includes('day')) {
    return 'party';
  }
  if (s.includes('WALK') || n.includes('trail') || n.includes('walk') || n.includes('hike') || n.includes('swim')) {
    return 'training';
  }
  if (s.includes('RAIN') || n.includes('museum') || n.includes('theatre') || n.includes('show') || n.includes('park')) {
    return 'club';
  }
  return 'match';
}

export async function fetchEventsFromGoogleSheet(): Promise<{
  success: boolean;
  events: EventItem[];
  message: string;
}> {
  try {
    const response = await fetch(GOOGLE_SHEET_CSV_URL);
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    const csvText = await response.text();
    const rows = parseCSV(csvText);

    const parsedEvents: EventItem[] = [];

    // Parse the right side activity catalogue (Columns K, L, M, N: Activity, Link, Cost, Location)
    // In the CSV, row 12 onwards contains DAYS, SUNNY, ADVENTURE WALKS, RAINING
    let currentSection = 'DAYS';

    rows.forEach((row, index) => {
      // Check column K (index 10 or 11)
      const colK = (row[10] || row[9] || '').trim();
      const link = (row[11] || row[10] || '').trim();
      const costStr = (row[12] || row[11] || '').trim();
      const where = (row[13] || row[12] || '').trim();

      if (!colK) return;

      // Section headers
      if (['DAYS', 'SUNNY', 'ADVENTURE WALKS', 'RAINING'].includes(colK.toUpperCase())) {
        currentSection = colK.toUpperCase();
        return;
      }

      if (colK.length > 2 && !colK.includes('things to do')) {
        const { amount, label } = parseCost(costStr);
        const category = categorize(currentSection, colK);

        // Generate a calendar date across July / August
        const dayOffset = (parsedEvents.length % 35) + 1;
        const eventDate = new Date(2026, 6, 18); // Start around July 18, 2026
        eventDate.setDate(eventDate.getDate() + dayOffset);
        const isoDate = eventDate.toISOString().split('T')[0];

        // Format nice capitalized title
        const formattedTitle = colK
          .split(' ')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(' ');

        const attendees: Attendee[] = [
          {
            id: `att-me-${index}`,
            childName: 'Leo Foster',
            parentName: 'Richard Foster',
            avatarBg: '#DBEAFE',
            isMyChild: true,
          },
          {
            id: `att-other-${index}-1`,
            childName: 'Oliver Jenkins',
            parentName: 'Sarah Jenkins',
            avatarBg: '#E0E7FF',
          },
          {
            id: `att-other-${index}-2`,
            childName: 'Noah Bell',
            parentName: 'Marcus Bell',
            avatarBg: '#FEF3C7',
          },
        ];

        parsedEvents.push({
          id: `sheet-event-${index}`,
          circleId: 'circle-summer',
          circleName: `Summer Activities (${currentSection})`,
          title: formattedTitle,
          category,
          date: isoDate,
          startTime: '10:30',
          endTime: '14:30',
          location: where || 'Greater Manchester',
          address: where ? `${where}, Greater Manchester` : 'Manchester',
          description: link ? `Official event info & booking: ${link}` : 'Family day out from your Google Sheet planner.',
          cost: amount,
          costLabel: label,
          paymentRequired: amount > 0,
          kitNotes: currentSection === 'ADVENTURE WALKS'
            ? 'Walking boots, waterproofs & packed lunch.'
            : currentSection === 'RAINING'
            ? 'Socks required for soft play/activities.'
            : 'Comfortable clothing, suncream & water bottles.',
          organizerName: 'Family Group Rep',
          organizerPhone: '+44 7700 900555',
          capacity: 20,
          eligibleChildIds: ['child-1', 'child-2'],
          attendees,
        });
      }
    });

    return {
      success: true,
      events: parsedEvents,
      message: `Successfully loaded ${parsedEvents.length} activities live from your Google Sheet!`,
    };
  } catch (error: any) {
    console.warn('Error fetching Google Sheet:', error);
    return {
      success: false,
      events: [],
      message: error.message || 'Could not fetch Google Sheet data.',
    };
  }
}

// Simple RFC 4180 CSV line parser handling quotes
function parseCSV(text: string): string[][] {
  const lines: string[][] = [];
  let row: string[] = [];
  let entry = '';
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        entry += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      row.push(entry.trim());
      entry = '';
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      row.push(entry.trim());
      if (row.some((cell) => cell.length > 0)) {
        lines.push(row);
      }
      row = [];
      entry = '';
    } else {
      entry += char;
    }
  }

  if (entry.length > 0 || row.length > 0) {
    row.push(entry.trim());
    lines.push(row);
  }

  return lines;
}
