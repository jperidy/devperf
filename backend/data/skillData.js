function getSkills() {
    const skills = [];

    let category = 'Soft Skills';
    let description = 'Description for Soft Skills';
    ['Project Management', 'RFP', 'PMO', 'Change'].map( x => skills.push({category: category, description: 'Description', name: x}));
    /*
    for (let incr = 1 ; incr < 11 ; incr++) {
        skills.push({
            category: category,
            description: description,
            name: `Name skills ${incr}`
        })
    }
    */

    category = 'Hard Skills';
    description = 'Description for Hard Skills';
    ['Workplace', 'AD', 'Telecom', 'UX'].map( x => skills.push({category: category, description: 'Description', name: x}));
    
    //console.log('skills', skills)
    return skills;
}

module.exports = { getSkills };