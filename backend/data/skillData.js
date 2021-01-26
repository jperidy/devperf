function getSkills() {
    const skills = [];

    let category = 'Soft Skills';
    let description = 'Description for Soft Skills';
    ['Project Management', 'RFP', 'PMO', 'Change'].map( x => skills.push({category: category, description: 'Description', name: x}));

    category = 'Hard Skills';
    description = 'Description for Hard Skills';
    ['Workplace', 'AD', 'Telecom', 'UX'].map( x => skills.push({category: category, description: 'Description', name: x}));
    
    //console.log('skills', skills)
    return skills;
}

module.exports = { getSkills };