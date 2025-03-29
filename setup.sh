#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Setting up Putin Digital Twin Project ===${NC}"

# Create virtual environment for Python
echo -e "${GREEN}Setting up Python virtual environment...${NC}"
cd backend
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
echo -e "${GREEN}Installing Python dependencies...${NC}"
pip install -r requirements.txt

# Move back to project root
cd ..

# Install Node.js dependencies
echo -e "${GREEN}Installing Node.js dependencies...${NC}"
cd frontend
npm install

# Move back to project root
cd ..

echo -e "${BLUE}=== Setup Complete! ===${NC}"
echo -e "${GREEN}To start the backend server:${NC}"
echo -e "  cd backend"
echo -e "  source venv/bin/activate"
echo -e "  python run.py"
echo -e "${GREEN}To start the frontend development server:${NC}"
echo -e "  cd frontend"
echo -e "  npm start"
echo -e "${BLUE}=== Enjoy building your Putin Digital Twin! ===${NC}"
