function getSkills() {
    
    const skills = [ 
        { category: 'Soft Skills', description: 'Skill description', name: 'Project management'},
        { category: 'Soft Skills', description: 'Skill description', name: 'RFP'},
        { category: 'Soft Skills', description: 'Skill description', name: 'PMO'},
        { category: 'Soft Skills', description: 'Skill description', name: 'Change'},
        { category: 'Hard Skills', description: 'Skill description', name: 'Workplace'},
        { category: 'Hard Skills', description: 'Skill description', name: 'AD'},
        { category: 'Hard Skills', description: 'Skill description', name: 'Telecom'},
        { category: 'Hard Skills', description: 'Skill description', name: 'UX'},
    ];

    return skills;
}

module.exports = { getSkills };