from flask import Blueprint, jsonify
import re

main = Blueprint('main', __name__)

@main.route('/api/timeline', methods=['GET'])
def get_timeline():
    # Extract timeline events from datasource.txt
    timeline_events = extract_timeline_events()
    return jsonify(timeline_events)

def extract_timeline_events():
    """Extract timeline events from the datasource file"""
    events = []
    
    try:
        with open('datasource.txt', 'r') as file:
            content = file.read()
            
            # Extract the timeline section
            timeline_section = re.search(r'## Timeline of Key Events[^\n]*\n(.*?)(?=##|\Z)', 
                                        content, re.DOTALL)
            
            if timeline_section:
                timeline_text = timeline_section.group(1)
                # Extract individual events
                event_pattern = r'- \*\*(.*?):\*\* (.*?)(?=\n- \*\*|\Z)'
                matches = re.findall(event_pattern, timeline_text, re.DOTALL)
                
                for date, description in matches:
                    # Clean up the description
                    clean_description = re.sub(r'\([^)]*\)', '', description)
                    clean_description = re.sub(r'\[[^\]]*\]', '', clean_description)
                    clean_description = clean_description.strip()
                    
                    events.append({
                        'date': date.strip(),
                        'description': clean_description,
                        'year': extract_year(date)
                    })
    except Exception as e:
        print(f"Error extracting timeline events: {e}")
    
    # Sort events by year
    events.sort(key=lambda x: x.get('year', 0))
    return events

def extract_year(date_str):
    """Extract year from date string"""
    year_match = re.search(r'(\d{4})', date_str)
    if year_match:
        return int(year_match.group(1))
    return 0
