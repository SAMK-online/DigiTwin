import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const VulnerabilitiesContainer = styled.div`
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

const CategoriesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem;
`;

const CategoryCard = styled(motion.div)`
  background-color: var(--card-background);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  
  &:hover {
    transform: translateY(-5px);
    transition: transform 0.3s ease;
  }
`;

const CategoryTitle = styled.h3`
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const VulnerabilityList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const VulnerabilityItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.2);
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Severity = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
  background-color: \${props => {
    switch (props.level) {
      case 'Critical':
        return 'rgba(183, 28, 28, 0.9)';
      case 'High':
        return 'rgba(230, 81, 0, 0.9)';
      case 'Medium':
        return 'rgba(251, 192, 45, 0.9)';
      default:
        return 'rgba(76, 175, 80, 0.9)';
    }
  }};
  color: white;
`;

const VulnerabilityDetails = styled.div`
  flex: 1;
`;

const VulnerabilityTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  color: var(--text-color);
`;

const VulnerabilityDescription = styled.p`
  margin: 0;
  color: rgba(245, 245, 245, 0.8);
  font-size: 0.9rem;
  line-height: 1.5;
`;

const vulnerabilityData = {
  economic: [
    {
      title: "Energy Market Dependency",
      description: "Heavy reliance on oil and gas exports makes economy vulnerable to price fluctuations and sanctions",
      severity: "Critical"
    },
    {
      title: "Technology Sector Weakness",
      description: "Limited domestic tech innovation and dependency on foreign technology",
      severity: "High"
    },
    {
      title: "International Financial Isolation",
      description: "SWIFT restrictions and limited access to global financial markets",
      severity: "High"
    }
  ],
  political: [
    {
      title: "Power Vertical Rigidity",
      description: "Centralized decision-making structure limits adaptability to rapid changes",
      severity: "High"
    },
    {
      title: "Elite Loyalty Dependency",
      description: "System stability relies heavily on maintaining elite support through economic benefits",
      severity: "Critical"
    },
    {
      title: "Public Opinion Management",
      description: "Increasing difficulty in controlling information flow due to digital media",
      severity: "Medium"
    }
  ],
  military: [
    {
      title: "Equipment Modernization",
      description: "Challenges in maintaining and upgrading military hardware due to sanctions",
      severity: "High"
    },
    {
      title: "Personnel Recruitment",
      description: "Difficulties in maintaining force strength and morale during extended conflicts",
      severity: "High"
    },
    {
      title: "Supply Chain Disruption",
      description: "Vulnerability in military-industrial complex due to component import restrictions",
      severity: "Critical"
    }
  ],
  international: [
    {
      title: "Diplomatic Isolation",
      description: "Limited international support and growing number of adversarial relationships",
      severity: "High"
    },
    {
      title: "China Dependency",
      description: "Increasing reliance on Chinese economic and political support",
      severity: "Critical"
    },
    {
      title: "Regional Influence Erosion",
      description: "Weakening control over traditional spheres of influence",
      severity: "High"
    }
  ]
};

const Vulnerabilities = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <VulnerabilitiesContainer>
      <Header>
        <Title
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          System <span>Vulnerabilities</span>
        </Title>
        <Subtitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Analysis of critical weaknesses and potential pressure points in Putin's power structure
        </Subtitle>
      </Header>

      <CategoriesContainer>
        {Object.entries(vulnerabilityData).map(([category, vulnerabilities], index) => (
          <CategoryCard
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <CategoryTitle>
              {category.charAt(0).toUpperCase() + category.slice(1)} Vulnerabilities
            </CategoryTitle>
            <VulnerabilityList>
              {vulnerabilities.map((vulnerability, vIndex) => (
                <VulnerabilityItem key={vIndex}>
                  <VulnerabilityDetails>
                    <VulnerabilityTitle>
                      {vulnerability.title}
                      <Severity level={vulnerability.severity}> {vulnerability.severity}</Severity>
                    </VulnerabilityTitle>
                    <VulnerabilityDescription>
                      {vulnerability.description}
                    </VulnerabilityDescription>
                  </VulnerabilityDetails>
                </VulnerabilityItem>
              ))}
            </VulnerabilityList>
          </CategoryCard>
        ))}
      </CategoriesContainer>
    </VulnerabilitiesContainer>
  );
};

export default Vulnerabilities;
