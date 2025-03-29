import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ForecastContainer = styled.div`
  padding: 2rem 0;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled(motion.h2)`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--text-color);
  font-weight: 700;
  
  span {
    color: var(--primary-color);
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.2rem;
  color: rgba(245, 245, 245, 0.8);
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
`;

const SimulationContainer = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  margin-top: 2rem;
`;

const ControlPanel = styled.div`
  background-color: var(--card-background);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
`;

const ControlSection = styled.div`
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
`;

const SimulationDisplay = styled.div`
  background-color: var(--card-background);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
`;

const ScenarioList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const ScenarioCard = styled(motion.div)`
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    transition: transform 0.3s ease;
  }
`;

const ScenarioTitle = styled.h4`
  font-size: 1.1rem;
  color: var(--text-color);
  margin-bottom: 0.5rem;
`;

const ScenarioProbability = styled.div`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
  background-color: ${props => {
    if (props.probability >= 70) return 'rgba(76, 175, 80, 0.9)';
    if (props.probability >= 40) return 'rgba(251, 192, 45, 0.9)';
    return 'rgba(183, 28, 28, 0.9)';
  }};
  color: white;
  margin-bottom: 1rem;
`;

const ScenarioDescription = styled.p`
  font-size: 0.9rem;
  color: rgba(245, 245, 245, 0.8);
  line-height: 1.5;
`;

const TimelineSlider = styled.input`
  width: 100%;
  margin: 1rem 0;
`;

const Button = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
  margin-bottom: 1rem;
  
  &:hover {
    background-color: #8b0000;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-color);
  cursor: pointer;
  
  input {
    cursor: pointer;
  }
`;

const scenarios = [
  {
    id: 1,
    title: "Regime Destabilization",
    probability: 35,
    description: "Internal power struggles and economic pressures lead to significant instability within Putin's inner circle.",
    timeline: "2025-2026",
    factors: ["Elite Loyalty: Critical", "Economic Pressure: High", "Public Unrest: Medium"]
  },
  {
    id: 2,
    title: "Strategic Pivot to Asia",
    probability: 75,
    description: "Deepening alliance with China and increased economic integration with Asian markets to counter Western isolation.",
    timeline: "2025-2027",
    factors: ["China Relations: Strong", "Economic Adaptation: High", "Western Isolation: Continued"]
  },
  {
    id: 3,
    title: "Military Modernization Challenges",
    probability: 65,
    description: "Significant difficulties in maintaining military capabilities due to sanctions and technological limitations.",
    timeline: "2025-2028",
    factors: ["Tech Access: Limited", "Defense Industry: Strained", "Personnel Issues: Growing"]
  },
  {
    id: 4,
    title: "Economic Restructuring",
    probability: 55,
    description: "Major reforms to reduce dependency on energy exports and develop domestic technology sector.",
    timeline: "2025-2030",
    factors: ["Energy Markets: Volatile", "Tech Development: Priority", "Sanctions Impact: High"]
  }
];

const Forecast = () => {
  const [selectedFactors, setSelectedFactors] = useState({
    economic: true,
    political: true,
    military: true,
    international: true
  });
  
  const [timeframe, setTimeframe] = useState(2025);
  
  const handleFactorChange = (factor) => {
    setSelectedFactors(prev => ({
      ...prev,
      [factor]: !prev[factor]
    }));
  };
  
  return (
    <ForecastContainer>
      <Header>
        <Title
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          System <span>Forecast</span>
        </Title>
        <Subtitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Predictive analysis and scenario simulation based on network dynamics and system vulnerabilities
        </Subtitle>
      </Header>
      
      <SimulationContainer>
        <ControlPanel>
          <ControlSection>
            <SectionTitle>Analysis Factors</SectionTitle>
            <CheckboxGroup>
              <CheckboxLabel>
                <input
                  type="checkbox"
                  checked={selectedFactors.economic}
                  onChange={() => handleFactorChange('economic')}
                />
                Economic Factors
              </CheckboxLabel>
              <CheckboxLabel>
                <input
                  type="checkbox"
                  checked={selectedFactors.political}
                  onChange={() => handleFactorChange('political')}
                />
                Political Factors
              </CheckboxLabel>
              <CheckboxLabel>
                <input
                  type="checkbox"
                  checked={selectedFactors.military}
                  onChange={() => handleFactorChange('military')}
                />
                Military Factors
              </CheckboxLabel>
              <CheckboxLabel>
                <input
                  type="checkbox"
                  checked={selectedFactors.international}
                  onChange={() => handleFactorChange('international')}
                />
                International Relations
              </CheckboxLabel>
            </CheckboxGroup>
          </ControlSection>
          
          <ControlSection>
            <SectionTitle>Timeframe</SectionTitle>
            <TimelineSlider
              type="range"
              min="2025"
              max="2030"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
            />
            <div style={{ textAlign: 'center', color: 'var(--text-color)' }}>
              {timeframe}
            </div>
          </ControlSection>
          
          <ControlSection>
            <Button>Run Simulation</Button>
            <Button style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
              Reset Parameters
            </Button>
          </ControlSection>
        </ControlPanel>
        
        <SimulationDisplay>
          <SectionTitle>Predicted Scenarios</SectionTitle>
          <ScenarioList>
            {scenarios.map((scenario, index) => (
              <ScenarioCard
                key={scenario.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ScenarioTitle>{scenario.title}</ScenarioTitle>
                <ScenarioProbability probability={scenario.probability}>
                  {scenario.probability}% Probability
                </ScenarioProbability>
                <ScenarioDescription>{scenario.description}</ScenarioDescription>
                <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'rgba(245, 245, 245, 0.6)' }}>
                  Timeline: {scenario.timeline}
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'rgba(245, 245, 245, 0.5)' }}>
                  {scenario.factors.map((factor, i) => (
                    <div key={i}>{factor}</div>
                  ))}
                </div>
              </ScenarioCard>
            ))}
          </ScenarioList>
        </SimulationDisplay>
      </SimulationContainer>
    </ForecastContainer>
  );
};

export default Forecast;
