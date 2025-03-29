import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import { feature } from 'topojson-client';

const NetworkContainer = styled.div`
  padding: 2rem 0;
`;

const NetworkHeader = styled.div`
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

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`;

const Tab = styled.button`
  background-color: ${props => props.active ? 'var(--primary-color)' : 'var(--card-background)'};
  color: var(--text-color);
  border: none;
  padding: 0.8rem 2rem;
  margin: 0 0.5rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.active ? 'var(--primary-color)' : 'rgba(183, 28, 28, 0.7)'};
  }
`;

const GraphContainer = styled.div`
  background-color: var(--card-background);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  height: 700px;
  position: relative;
  overflow: hidden;
  
  svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const LoadingSpinner = styled.div`
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  background-color: rgba(183, 28, 28, 0.2);
  color: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  margin: 2rem 0;
`;

const TooltipContainer = styled.div`
  position: absolute;
  background-color: rgba(30, 30, 30, 0.95);
  color: #fff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  width: 200px;
  z-index: 100;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease;
  transform-origin: 0 0;
`;

const TooltipTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  color: var(--primary-color);
  font-size: 1.2rem;
`;

const TooltipContent = styled.div`
  font-size: 0.9rem;
  
  p {
    margin: 0.3rem 0;
  }
  
  .label {
    font-weight: bold;
    color: rgba(255, 255, 255, 0.7);
  }
  
  .score {
    display: inline-block;
    background-color: var(--primary-color);
    color: white;
    padding: 0.1rem 0.4rem;
    border-radius: 4px;
    font-weight: bold;
    margin-left: 0.3rem;
  }
`;

const Legend = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin: 0 1rem;
  font-size: 0.9rem;
`;

const LegendColor = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${props => props.color};
  margin-right: 0.5rem;
`;

const Network = () => {
  const [activeTab, setActiveTab] = useState('domestic');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [networkData, setNetworkData] = useState(null);
  
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const endpoint = activeTab === 'domestic' ? '/api/network/domestic' : '/api/network/international';
        const response = await fetch(endpoint);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch network data: ${response.status}`);
        }
        
        const data = await response.json();
        setNetworkData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching network data:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [activeTab]);
  
  useEffect(() => {
    if (!networkData || loading) return;
    
    // Clear previous graph
    d3.select(svgRef.current).selectAll('*').remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);
      
    const projection = d3.geoMercator()
      .scale(activeTab === 'domestic' ? 400 : 120)
      .center(activeTab === 'domestic' ? [105, 60] : [0, 35])
      .translate([width / 2, height / 2]);
      
    const path = d3.geoPath().projection(projection);
    
    // Function to get coordinates for nodes
    const getNodeCoordinates = (d) => {
      // If node already has coordinates, use them
      if (d.coordinates) return d.coordinates;
      
      if (activeTab === 'domestic') {
        if (d.id === 'Vladimir Putin') {
          return [37.6173, 55.7558]; // Moscow coordinates
        }
        
        // Random coordinates within Russia's rough boundaries
        return [
          Math.random() * (190 - 30) + 30,   // Longitude: 30°E to 190°E
          Math.random() * (75 - 45) + 45     // Latitude: 45°N to 75°N
        ];
      } else {
        // International node coordinates based on country/region [longitude, latitude]
        const countryCoordinates = {
          'Xi Jinping': [116.4074, 39.9042],          // Beijing, China
          'Alexander Lukashenko': [27.5667, 53.9000], // Minsk, Belarus
          'Kim Jong-un': [125.7625, 39.0392],        // Pyongyang, North Korea
          'Viktor Orbán': [19.0402, 47.4979],        // Budapest, Hungary
          'Nicolás Maduro': [-66.9036, 10.4806],     // Caracas, Venezuela
          'Bashar al-Assad': [36.2919, 33.5102],     // Damascus, Syria
          'Ebrahim Raisi': [51.3890, 35.6892],       // Tehran, Iran
          'Narendra Modi': [77.2090, 28.6139],       // New Delhi, India
          'Vladimir Putin': [37.6173, 55.7558],      // Moscow, Russia
          'Recep Tayyip Erdoğan': [32.8597, 39.9334], // Ankara, Turkey
          'Aleksandar Vučić': [20.4651, 44.8125],    // Belgrade, Serbia
          'Miguel Díaz-Canel': [-82.3666, 23.1136],  // Havana, Cuba
          'Daniel Ortega': [-86.2504, 12.1149],      // Managua, Nicaragua
          'Joe Biden': [-77.0369, 38.9072],          // Washington D.C., USA
          'Volodymyr Zelenskyy': [30.5234, 50.4501], // Kyiv, Ukraine
        };
        
        // If we have coordinates for this person, use them
        if (countryCoordinates[d.id]) {
          return countryCoordinates[d.id];
        }
        
        // Fallback to random global coordinates if person not in list
        return [
          Math.random() * 360 - 180,  // Random longitude (-180 to 180)
          Math.random() * 140 - 70     // Random latitude (-70 to 70)
        ];
      }
    };

    // Create a group for all content
    const g = svg.append('g');
    
    // Load map data first
    fetch(`/data/${activeTab === 'domestic' ? 'russia' : 'world'}.json`)
      .then(response => response.json())
      .then(mapData => {
        // Draw map
        const map = activeTab === 'domestic' ? mapData : feature(mapData, mapData.objects.countries);
        
        // Create a specific group for the map
        const mapGroup = g.append('g')
          .attr('class', 'map-layer');

        mapGroup.selectAll('path')
          .data(activeTab === 'domestic' ? map.features : map.features)
          .enter()
          .append('path')
          .attr('d', path)
          .attr('fill', '#2a2a2a')
          .attr('stroke', '#3a3a3a')
          .attr('stroke-width', 0.5);

        // Create a group for markers that will be above the map
        const markerGroup = g.append('g')
          .attr('class', 'marker-layer');

        // Store initial coordinates for each node
        networkData.nodes.forEach(node => {
          if (!node.fixedCoordinates) {
            node.fixedCoordinates = node.coordinates || getNodeCoordinates(node);
          }
        });

        // Create markers
        const markers = markerGroup.selectAll('g.marker')
          .data(networkData.nodes)
          .enter()
          .append('g')
          .attr('class', 'marker')
          .attr('transform', d => {
            const [x, y] = projection(d.fixedCoordinates);
            return `translate(${x},${y})`;
          });

        // Add circles for each marker
        markers.append('circle')
          .attr('r', d => d.id === 'Vladimir Putin' ? 8 : 5)
          .attr('fill', d => {
            if (d.id === 'Vladimir Putin') return '#ffd700';
            return d.type === 'ally' ? '#4caf50' : '#b71c1c';
          })
          .attr('stroke', '#fff')
          .attr('stroke-width', 1)
          .style('cursor', 'pointer');

        // Add labels for each marker
        markers.append('text')
          .attr('dx', 10)
          .attr('dy', 4)
          .style('font-size', '12px')
          .style('fill', '#fff')
          .style('text-shadow', '1px 1px 2px rgba(0,0,0,0.8)')
          .text(d => d.id)
          .style('opacity', 0); // Initially hidden

        // Add hover interactions
        markers
          .on('mouseover', function(event, d) {
            // Show label
            d3.select(this).select('text')
              .style('opacity', 1);

            // Show tooltip with position relative to GraphContainer
            const tooltip = d3.select(tooltipRef.current);
            const graphContainer = d3.select(svgRef.current.parentNode);
            const graphRect = graphContainer.node().getBoundingClientRect();
            
            // Get mouse position relative to graph container
            const mouseX = event.clientX - graphRect.left;
            const mouseY = event.clientY - graphRect.top;
            
            // Position tooltip to the right of cursor by default
            let left = mouseX + 20;
            let top = mouseY;
            
            // If tooltip would overflow right edge, show it on the left side
            if (left + 200 > graphRect.width) { // Assuming max tooltip width of 200px
              left = mouseX - 220;
            }
            
            // If tooltip would overflow bottom, adjust upward
            if (top + 150 > graphRect.height) { // Assuming max tooltip height of 150px
              top = mouseY - 150;
            }
            
            tooltip.style('opacity', 1)
              .style('left', `${left}px`)
              .style('top', `${top}px`);
              
            // Get influence score based on person
            const influenceScores = {
              'Vladimir Putin': 8.5,     // Strong global influence, especially in Eurasia
              'Xi Jinping': 9.5,        // Highest global influence as China's leader
              'Joe Biden': 9.0,         // US President, major global influence
              'Alexander Lukashenko': 5.0, // Regional influence, dependent on Russia
              'Kim Jong-un': 6.0,      // Nuclear power but limited economic influence
              'Viktor Orbán': 4.5,     // Influential in EU politics
              'Nicolás Maduro': 3.5,   // Limited to regional influence
              'Bashar al-Assad': 3.0,   // Mainly regional influence
              'Ebrahim Raisi': 5.5,    // Oil power and regional influence
              'Narendra Modi': 7.5,    // Growing global power, strong regional
              'Recep Tayyip Erdoğan': 6.5, // Strategic position, regional power
              'Aleksandar Vučić': 3.5,  // Balkan regional influence
              'Miguel Díaz-Canel': 2.5, // Limited global influence
              'Daniel Ortega': 2.0,     // Mainly domestic influence
              'Volodymyr Zelenskyy': 8.0, // High global influence due to Ukraine war and international support
            };

            tooltip.select('.tooltip-title').text(d.id);
            tooltip.select('.tooltip-role').text(d.role || 'Unknown');
            tooltip.select('.tooltip-type').text(d.type === 'ally' ? 'Ally' : 'Adversary');
            tooltip.select('.tooltip-influence').text(`Global Influence: ${influenceScores[d.id] || 'N/A'}/10`);
          })
          .on('mouseout', function() {
            // Hide label
            d3.select(this).select('text')
              .style('opacity', 0);

            // Hide tooltip
            d3.select(tooltipRef.current).style('opacity', 0);
          });

        // Create zoom behavior after markers are created
        const zoom = d3.zoom()
          .scaleExtent([1, 8])
          .on('zoom', (event) => {
            g.attr('transform', event.transform);
            markerGroup.selectAll('.marker').attr('transform', d => {
              const [x, y] = projection(d.fixedCoordinates);
              const scale = 1 / event.transform.k;
              return `translate(${x},${y}) scale(${scale})`;
            });
          });

        // Apply zoom to svg
        svg.call(zoom);
      });
    

    // Update tooltip content
    const updateTooltip = (d) => {
      const tooltip = d3.select(tooltipRef.current);
      tooltip.select('.tooltip-title').text(d.id);
      tooltip.select('.tooltip-role').text(d.role || 'Unknown');
      tooltip.select('.tooltip-type').text(d.type === 'ally' ? 'Ally' : 'Adversary');
      tooltip.select('.tooltip-influence').text(d.influence || 'Unknown');
      if (d.description) {
        tooltip.select('.tooltip-description').text(d.description);
      }
    };
  }, [activeTab, networkData, loading]);

  return (
    <NetworkContainer>
      <NetworkHeader>
        <Title
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Putin's <span>Network</span>
        </Title>
        <Subtitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Explore Putin's allies and adversaries across the globe
        </Subtitle>
      </NetworkHeader>

      <TabContainer>
        <Tab
          active={activeTab === 'domestic'}
          onClick={() => setActiveTab('domestic')}
        >
          Domestic Network
        </Tab>
        <Tab
          active={activeTab === 'international'}
          onClick={() => setActiveTab('international')}
        >
          International Network
        </Tab>
      </TabContainer>

      <GraphContainer>
        {loading ? (
          <LoadingContainer>
            <LoadingSpinner />
          </LoadingContainer>
        ) : error ? (
          <ErrorMessage>{error}</ErrorMessage>
        ) : (
          <>
            <svg ref={svgRef} width="100%" height="100%" />
            <TooltipContainer ref={tooltipRef}>
              <TooltipTitle className="tooltip-title" />
              <TooltipContent>
                <p><span className="label">Role:</span> <span className="tooltip-role" /></p>
                <p><span className="label">Type:</span> <span className="tooltip-type" /></p>
                <p><span className="label">Influence:</span> <span className="tooltip-influence" /></p>
                <p className="tooltip-description" />
              </TooltipContent>
            </TooltipContainer>
          </>
        )}
      </GraphContainer>
      
      <Legend>
        <LegendItem>
          <LegendColor color="#ffd700" /> Vladimir Putin
        </LegendItem>
        <LegendItem>
          <LegendColor color="#4caf50" /> Allies
        </LegendItem>
        <LegendItem>
          <LegendColor color="#b71c1c" /> Adversaries
        </LegendItem>
      </Legend>
    </NetworkContainer>
  );
};

export default Network;
