import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

const TimelineContainer = styled.div`
  padding: 2rem 0;
`;

const TimelineHeader = styled.div`
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

const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const FilterButton = styled.button`
  background-color: ${props => props.active ? 'var(--primary-color)' : 'var(--card-background)'};
  color: var(--text-color);
  border: 2px solid ${props => props.active ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.1)'};
  padding: 0.5rem 1.5rem;
  border-radius: 30px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(183, 28, 28, 0.3);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
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

const TimelineContent = styled(motion.div)`
  .vertical-timeline-element-content {
    background-color: var(--card-background);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    border-radius: 12px;
    padding: 1.5rem;
    
    p {
      color: rgba(245, 245, 245, 0.8);
      line-height: 1.6;
    }
    
    .vertical-timeline-element-date {
      color: var(--text-color);
      font-weight: 500;
      opacity: 0.8;
    }
  }
  
  .vertical-timeline-element-icon {
    box-shadow: 0 0 0 4px var(--primary-color), inset 0 2px 0 rgba(0, 0, 0, 0.08), 0 3px 0 4px rgba(0, 0, 0, 0.05);
    background-color: var(--card-background);
  }
  
  .vertical-timeline::before {
    background: var(--timeline-line-color);
  }
`;

const EventIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: var(--primary-color);
  font-weight: bold;
  font-size: 1rem;
`;

const EventTitle = styled.h3`
  color: var(--text-color);
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const EventDescription = styled.p`
  margin: 0;
`;

const Timeline = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  
  const decades = [
    { id: 'all', label: 'All Events' },
    { id: '1990s', label: '1990s' },
    { id: '2000s', label: '2000s' },
    { id: '2010s', label: '2010s' },
    { id: '2020s', label: '2020s' }
  ];
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // For development, we'll use a mock data approach first
        // In production, this would be: const response = await axios.get('/api/timeline');
        
        // Mock data based on the datasource.txt file
        const mockEvents = [
          { date: 'Dec 31, 1999', description: 'President Boris Yeltsin resigns and appoints Prime Minister Vladimir Putin as Acting President. Putin soon launches the Second Chechen War, boosting his popularity as a strong leader.', year: 1999 },
          { date: 'Mar 26, 2000', description: 'Putin wins his first presidential election (53% of vote) and is inaugurated in May. Early in his term, he moves against independent media and oligarchic power, signaling an end to the chaotic 1990s.', year: 2000 },
          { date: 'Oct 25, 2003', description: 'Oil tycoon Mikhail Khodorkovsky – Russia\'s richest man and a potential political challenger – is arrested. His company Yukos is dismantled and absorbed by state-owned Rosneft, exemplifying Putin\'s strategy of eliminating oligarchs who pose political threats.', year: 2003 },
          { date: 'Mar 14, 2004', description: 'Putin is re-elected to a second term as President. In September, the Beslan school siege by militants kills 300+ hostages; Putin responds by abolishing regional governor elections, tightening the "vertical of power".', year: 2004 },
          { date: 'Apr 25, 2005', description: 'Putin calls the Soviet Union\'s collapse "the greatest geopolitical catastrophe of the century," framing his worldview of Russian loss and a desire to restore influence.', year: 2005 },
          { date: 'Feb 10, 2007', description: 'In a Munich speech, Putin sharply criticizes U.S. unilateralism and NATO expansion, marking a turn toward open confrontation with the West.', year: 2007 },
          { date: 'May 8, 2008', description: 'Term-limited from a third consecutive term, Putin hands the presidency to Dmitry Medvedev and becomes Prime Minister – but remains the de facto paramount leader. In August 2008, Russia fights a five-day war with Georgia, occupying the breakaway regions of Abkhazia and South Ossetia.', year: 2008 },
          { date: 'Mar 4, 2012', description: 'Amid anti-government protests in Moscow, Putin returns to the presidency for a now-extended six-year term. His inauguration is followed by laws increasing penalties for protests, presaging a crackdown on dissent.', year: 2012 },
          { date: 'Feb 7–23, 2014', description: 'Russia hosts the Sochi Winter Olympics as a prestige project. Just days after the Olympics, Ukraine\'s pro-Russian president is ousted in Kyiv; by Feb–Mar 2014, Putin orders covert forces into Crimea and formally annexes the peninsula after a hasty referendum. This is Putin\'s boldest foreign move yet and a turning point in relations with the West.', year: 2014 },
          { date: 'Apr 2014', description: 'Russian-backed separatist revolt erupts in Eastern Ukraine (Donbas), leading to a protracted conflict. In Feb 2015, opposition leader Boris Nemtsov is assassinated near the Kremlin – silencing a prominent critic amid the wartime patriotic fervor.', year: 2014 },
          { date: 'Sept 30, 2015', description: 'Putin expands Russia\'s global reach by intervening militarily in the Syrian Civil War, launching airstrikes that prop up ally Bashar al-Assad. This marks Russia\'s return as a Middle East power broker.', year: 2015 },
          { date: 'Mar 18, 2018', description: 'Putin wins a fourth presidential term. In May, he opens a bridge linking Russia to annexed Crimea, symbolizing the permanence of that territorial gain.', year: 2018 },
          { date: 'July 16, 2018', description: 'At a summit in Helsinki with U.S. President Donald Trump, Putin denies election interference allegations and finds Trump surprisingly supportive of his denials. By now, Putin\'s Russia faces Western sanctions (initially over Crimea and interference activities) yet continues to engage selectively with Western leaders.', year: 2018 },
          { date: 'Jan 15, 2020', description: 'Putin proposes constitutional changes that would allow him to run for president again in 2024 and potentially stay in power until 2036. The amendments are approved in a July referendum.', year: 2020 },
          { date: 'Feb 24, 2022', description: 'Putin launches a full-scale invasion of Ukraine, calling it a "special military operation" to "denazify" the country. The war becomes the largest European conflict since World War II and leads to unprecedented Western sanctions against Russia.', year: 2022 },
          { date: 'Mar 17, 2023', description: 'The International Criminal Court issues an arrest warrant for Putin for alleged war crimes in Ukraine, specifically the unlawful deportation of children.', year: 2023 },
          { date: 'Mar 17, 2024', description: 'Putin wins a fifth term as president with a reported 87% of the vote in an election where no genuine opposition candidates were allowed to run.', year: 2024 }
        ];
        
        setEvents(mockEvents);
        setFilteredEvents(mockEvents);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching timeline data:', err);
        setError('Failed to load timeline data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);
  
  useEffect(() => {
    if (filter === 'all') {
      setFilteredEvents(events);
    } else {
      const decade = parseInt(filter.replace('s', ''));
      const filtered = events.filter(event => {
        const year = event.year;
        return year >= decade && year < decade + 10;
      });
      setFilteredEvents(filtered);
    }
  }, [filter, events]);
  
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };
  
  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }
  
  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }
  
  return (
    <TimelineContainer>
      <TimelineHeader>
        <Title
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Vladimir <span>Putin</span>: Key Events Timeline
        </Title>
        <Subtitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Explore the critical moments that shaped Vladimir Putin's rise to power and his impact on Russia and global politics from 1999 to present day.
        </Subtitle>
      </TimelineHeader>
      
      <FilterContainer>
        {decades.map(decade => (
          <FilterButton
            key={decade.id}
            active={filter === decade.id}
            onClick={() => handleFilterChange(decade.id)}
          >
            {decade.label}
          </FilterButton>
        ))}
      </FilterContainer>
      
      <TimelineContent
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <AnimatePresence>
          <VerticalTimeline>
            {filteredEvents.map((event, index) => (
              <VerticalTimelineElement
                key={index}
                date={event.date}
                iconStyle={{ background: 'var(--card-background)', color: 'var(--primary-color)' }}
                icon={<EventIcon>{event.year.toString().slice(-2)}</EventIcon>}
                contentStyle={{ background: 'var(--card-background)', color: 'var(--text-color)' }}
                contentArrowStyle={{ borderRight: '7px solid var(--card-background)' }}
                animate
              >
                <EventTitle>{event.date}</EventTitle>
                <EventDescription>{event.description}</EventDescription>
              </VerticalTimelineElement>
            ))}
          </VerticalTimeline>
        </AnimatePresence>
      </TimelineContent>
    </TimelineContainer>
  );
};

export default Timeline;
