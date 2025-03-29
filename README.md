# Putin Digital Twin

An AI-powered application that builds a dynamic digital twin of Vladimir Putin based on publicly available data. The application analyzes social and political networks, identifies vulnerabilities, and forecasts geopolitical strategies.

## Features

- **Timeline of Key Events**: Interactive visualization of Putin's rise to power and significant events
- **Network Analysis**: Mapping of Putin's political and social connections
- **Vulnerability Analysis**: Identification of potential political disruptions within the network
- **Geopolitical Forecasting**: Predictions on how changes in the network could affect strategies

## Tech Stack

- **Frontend**: React with styled-components, Framer Motion, and react-vertical-timeline-component
- **Backend**: Flask API with Python
- **Data Processing**: SpaCy for NLP, NetworkX for graph analysis
- **Visualization**: D3.js and Pyvis for network visualization

## Getting Started

### Prerequisites

- Node.js (v14+)
- Python (v3.8+)
- pip
- npm or yarn

### Installation

1. Clone the repository
2. Set up the backend:
   ```
   cd backend
   pip install -r requirements.txt
   python run.py
   ```
3. Set up the frontend:
   ```
   cd frontend
   npm install
   npm start
   ```

## Project Structure

- `/frontend`: React application
  - `/src/components`: React components including Timeline
- `/backend`: Flask API
  - `/app`: Flask application code
  - `/app/routes.py`: API endpoints

## Development Roadmap

1. ✅ Timeline of key events
2. Network visualization of relationships
3. Vulnerability analysis dashboard
4. Geopolitical forecasting model
