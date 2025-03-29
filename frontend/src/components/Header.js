import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const HeaderContainer = styled.header`
  background-color: rgba(18, 18, 18, 0.95);
  padding: 1rem 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
`;

const Logo = styled(motion.div)`
  display: flex;
  align-items: center;
  
  h1 {
    margin: 0;
    font-size: 1.8rem;
    color: var(--text-color);
    font-weight: 700;
    
    span {
      color: var(--primary-color);
    }
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: var(--text-color);
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.5rem 0;
  position: relative;
  transition: color 0.3s ease;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background-color: var(--primary-color);
    transition: width 0.3s ease;
  }
  
  &:hover {
    color: var(--primary-color);
    
    &::after {
      width: 100%;
    }
  }
`;

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);
  
  return (
    <HeaderContainer style={{ 
      boxShadow: scrolled ? '0 4px 12px rgba(0, 0, 0, 0.5)' : 'none',
      backgroundColor: scrolled ? 'rgba(18, 18, 18, 0.95)' : 'rgba(18, 18, 18, 0.8)'
    }}>
      <HeaderContent>
        <Logo
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Putin <span>Digital Twin</span></h1>
        </Logo>
        <Nav>
          <NavLink to="/">Timeline</NavLink>
          <NavLink to="/network">Network</NavLink>
          <NavLink to="/vulnerabilities">Vulnerabilities</NavLink>
          <NavLink to="/forecast">Forecast</NavLink>
        </Nav>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
