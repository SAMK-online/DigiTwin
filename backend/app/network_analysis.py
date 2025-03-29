import re
import json
import networkx as nx
from networkx.readwrite import json_graph

def extract_network_data():
    """Extract Putin's network data from datasource.txt"""
    try:
        with open('datasource.txt', 'r') as file:
            content = file.read()
            
            # Extract domestic allies
            domestic_allies = []
            domestic_section = re.search(r'Selected Members of Putin\'s Inner Network \(Domestic Allies\)(.*?)International Allies', 
                                        content, re.DOTALL)
            
            if domestic_section:
                domestic_text = domestic_section.group(1)
                # Extract individuals using regex patterns
                ally_pattern = r'\*\*(.*?)\*\*\s*[–|-]\s*(.*?)\s*[–|-]\s*(.*?)(?=\n|\*\*|\Z)'
                matches = re.findall(ally_pattern, domestic_text, re.DOTALL)
                
                for name, role, description in matches:
                    # Clean up text
                    name = name.strip()
                    role = role.strip()
                    description = re.sub(r'\([^)]*\)', '', description)
                    description = re.sub(r'\[[^\]]*\]', '', description)
                    description = description.strip()
                    
                    domestic_allies.append({
                        'name': name,
                        'role': role,
                        'description': description,
                        'type': 'ally',
                        'category': 'domestic'
                    })
            
            # Extract domestic adversaries
            domestic_adversaries = []
            adversaries_section = re.search(r'Domestic Adversaries and Opposition(.*?)International Allies', 
                                          content, re.DOTALL)
            
            if adversaries_section:
                adversaries_text = adversaries_section.group(1)
                # Extract individuals using regex patterns
                adversary_pattern = r'\*\*(.*?)\*\*'
                matches = re.findall(adversary_pattern, adversaries_text)
                
                for name in matches:
                    if len(name.split()) <= 3 and not name.startswith("Table"):  # Filter out non-names
                        domestic_adversaries.append({
                            'name': name.strip(),
                            'role': 'Opposition Figure',
                            'description': f'Domestic adversary of Putin mentioned in context of opposition',
                            'type': 'adversary',
                            'category': 'domestic'
                        })
            
            # Extract international allies
            international_allies = []
            int_allies_section = re.search(r'International Allies(.*?)International Adversaries', 
                                         content, re.DOTALL)
            
            if int_allies_section:
                int_allies_text = int_allies_section.group(1)
                # Extract individuals and countries
                ally_pattern = r'\*\*(.*?)\*\*\s*\((.*?)\):'
                matches = re.findall(ally_pattern, int_allies_text)
                
                for name, country in matches:
                    international_allies.append({
                        'name': name.strip(),
                        'role': f'Leader of {country.strip()}',
                        'description': f'International ally from {country.strip()}',
                        'type': 'ally',
                        'category': 'international',
                        'country': country.strip()
                    })
            
            # Extract international adversaries
            international_adversaries = []
            int_adversaries_section = re.search(r'International Adversaries(.*?)Political Affiliations', 
                                              content, re.DOTALL)
            
            if int_adversaries_section:
                int_adversaries_text = int_adversaries_section.group(1)
                # Extract countries and individuals
                country_pattern = r'\*\*(.*?)\*\*:'
                matches = re.findall(country_pattern, int_adversaries_text)
                
                for entity in matches:
                    if entity in ["United States", "European Union and NATO Allies", "Ukraine", "Other Regional Adversaries"]:
                        continue
                    
                    international_adversaries.append({
                        'name': entity.strip(),
                        'role': 'International Adversary',
                        'description': f'Opposed to Putin\'s policies',
                        'type': 'adversary',
                        'category': 'international'
                    })
                
                # Extract specific individuals
                individual_pattern = r'\*\*(.*?)\*\*\s*\((.*?)\)'
                matches = re.findall(individual_pattern, int_adversaries_text)
                
                for name, country in matches:
                    if "NATO" not in name and "EU" not in name:
                        international_adversaries.append({
                            'name': name.strip(),
                            'role': f'Leader of {country.strip()}',
                            'description': f'International adversary from {country.strip()}',
                            'type': 'adversary',
                            'category': 'international',
                            'country': country.strip()
                        })
            
            # Manually add key figures that might be missed by regex
            key_domestic_allies = [
                {'name': 'Nikolai Patrushev', 'role': 'Security Council Secretary', 'type': 'ally', 'category': 'domestic'},
                {'name': 'Sergei Shoigu', 'role': 'Defense Minister', 'type': 'ally', 'category': 'domestic'},
                {'name': 'Ramzan Kadyrov', 'role': 'Chechen Leader', 'type': 'ally', 'category': 'domestic'},
                {'name': 'Dmitry Medvedev', 'role': 'Former President/PM', 'type': 'ally', 'category': 'domestic'},
                {'name': 'Igor Sechin', 'role': 'CEO, Rosneft', 'type': 'ally', 'category': 'domestic'},
                {'name': 'Alexei Miller', 'role': 'CEO, Gazprom', 'type': 'ally', 'category': 'domestic'},
                {'name': 'Yury Kovalchuk', 'role': 'Banker', 'type': 'ally', 'category': 'domestic'}
            ]
            
            key_international_allies = [
                {'name': 'Alexander Lukashenko', 'role': 'President of Belarus', 'type': 'ally', 'category': 'international', 'country': 'Belarus'},
                {'name': 'Xi Jinping', 'role': 'President of China', 'type': 'ally', 'category': 'international', 'country': 'China'},
                {'name': 'Bashar al-Assad', 'role': 'President of Syria', 'type': 'ally', 'category': 'international', 'country': 'Syria'},
                {'name': 'Kim Jong-un', 'role': 'Leader of North Korea', 'type': 'ally', 'category': 'international', 'country': 'North Korea'},
                {'name': 'Nicolás Maduro', 'role': 'President of Venezuela', 'type': 'ally', 'category': 'international', 'country': 'Venezuela'},
                {'name': 'Viktor Orbán', 'role': 'Prime Minister of Hungary', 'type': 'ally', 'category': 'international', 'country': 'Hungary'}
            ]
            
            key_domestic_adversaries = [
                {'name': 'Alexei Navalny', 'role': 'Opposition Leader (deceased)', 'type': 'adversary', 'category': 'domestic'},
                {'name': 'Mikhail Khodorkovsky', 'role': 'Exiled Oligarch', 'type': 'adversary', 'category': 'domestic'},
                {'name': 'Boris Nemtsov', 'role': 'Opposition Leader (assassinated)', 'type': 'adversary', 'category': 'domestic'},
                {'name': 'Anna Politkovskaya', 'role': 'Journalist (assassinated)', 'type': 'adversary', 'category': 'domestic'}
            ]
            
            key_international_adversaries = [
                {'name': 'Joe Biden', 'role': 'President of United States', 'type': 'adversary', 'category': 'international', 'country': 'United States'},
                {'name': 'Volodymyr Zelenskyy', 'role': 'President of Ukraine', 'type': 'adversary', 'category': 'international', 'country': 'Ukraine'},
                {'name': 'Jens Stoltenberg', 'role': 'NATO Secretary General', 'type': 'adversary', 'category': 'international', 'country': 'NATO'}
            ]
            
            # Add manually identified figures if they're not already in the lists
            for ally in key_domestic_allies:
                if not any(a['name'] == ally['name'] for a in domestic_allies):
                    domestic_allies.append(ally)
            
            for ally in key_international_allies:
                if not any(a['name'] == ally['name'] for a in international_allies):
                    international_allies.append(ally)
                    
            for adversary in key_domestic_adversaries:
                if not any(a['name'] == adversary['name'] for a in domestic_adversaries):
                    domestic_adversaries.append(adversary)
                    
            for adversary in key_international_adversaries:
                if not any(a['name'] == adversary['name'] for a in international_adversaries):
                    international_adversaries.append(adversary)
            
            # Combine all data
            all_network_data = {
                'domestic_allies': domestic_allies,
                'domestic_adversaries': domestic_adversaries,
                'international_allies': international_allies,
                'international_adversaries': international_adversaries
            }
            
            return all_network_data
            
    except Exception as e:
        print(f"Error extracting network data: {e}")
        return {
            'domestic_allies': [],
            'domestic_adversaries': [],
            'international_allies': [],
            'international_adversaries': []
        }

def create_network_graphs(network_data):
    """Create network graphs for visualization"""
    # Create domestic network
    domestic_graph = nx.Graph()
    
    # Add Putin as central node
    domestic_graph.add_node("Vladimir Putin", role="President of Russia", 
                           type="central", category="domestic", 
                           description="President of Russia since 2000 (with a break as Prime Minister 2008-2012)")
    
    # Add domestic allies
    for ally in network_data['domestic_allies']:
        domestic_graph.add_node(ally['name'], 
                               role=ally.get('role', 'Ally'), 
                               type='ally',
                               category='domestic',
                               description=ally.get('description', 'Domestic ally of Putin'))
        domestic_graph.add_edge("Vladimir Putin", ally['name'], relationship="ally", weight=0.8)
    
    # Add domestic adversaries
    for adversary in network_data['domestic_adversaries']:
        domestic_graph.add_node(adversary['name'], 
                               role=adversary.get('role', 'Adversary'), 
                               type='adversary',
                               category='domestic',
                               description=adversary.get('description', 'Domestic adversary of Putin'))
        domestic_graph.add_edge("Vladimir Putin", adversary['name'], relationship="adversary", weight=0.5)
    
    # Create international network
    international_graph = nx.Graph()
    
    # Add Putin as central node
    international_graph.add_node("Vladimir Putin", role="President of Russia", 
                                type="central", category="international", 
                                description="President of Russia since 2000 (with a break as Prime Minister 2008-2012)")
    
    # Add international allies
    for ally in network_data['international_allies']:
        international_graph.add_node(ally['name'], 
                                    role=ally.get('role', 'International Ally'), 
                                    type='ally',
                                    category='international',
                                    country=ally.get('country', ''),
                                    description=ally.get('description', 'International ally of Putin'))
        international_graph.add_edge("Vladimir Putin", ally['name'], relationship="ally", weight=0.8)
    
    # Add international adversaries
    for adversary in network_data['international_adversaries']:
        international_graph.add_node(adversary['name'], 
                                    role=adversary.get('role', 'International Adversary'), 
                                    type='adversary',
                                    category='international',
                                    country=adversary.get('country', ''),
                                    description=adversary.get('description', 'International adversary of Putin'))
        international_graph.add_edge("Vladimir Putin", adversary['name'], relationship="adversary", weight=0.5)
    
    # Calculate network metrics
    for graph in [domestic_graph, international_graph]:
        # Calculate centrality measures
        degree_centrality = nx.degree_centrality(graph)
        betweenness_centrality = nx.betweenness_centrality(graph)
        eigenvector_centrality = nx.eigenvector_centrality(graph, max_iter=1000)
        
        # Add centrality measures to node attributes
        for node in graph.nodes():
            graph.nodes[node]['degree_centrality'] = round(degree_centrality[node], 3)
            graph.nodes[node]['betweenness_centrality'] = round(betweenness_centrality[node], 3)
            graph.nodes[node]['eigenvector_centrality'] = round(eigenvector_centrality[node], 3)
            
            # Calculate influence score (weighted average of centrality measures)
            influence_score = (0.4 * degree_centrality[node] + 
                              0.3 * betweenness_centrality[node] + 
                              0.3 * eigenvector_centrality[node])
            graph.nodes[node]['influence_score'] = round(influence_score, 3)
    
    # Convert to JSON for visualization
    domestic_json = json_graph.node_link_data(domestic_graph)
    international_json = json_graph.node_link_data(international_graph)
    
    return {
        'domestic_network': domestic_json,
        'international_network': international_json
    }

def get_network_data():
    """Main function to extract and process network data"""
    network_data = extract_network_data()
    graph_data = create_network_graphs(network_data)
    return graph_data
