function getSkills() {
    const skills = [];

    let category = 'Soft Skills';
    let description = 'Description for Soft Skills';
    for (let incr = 1 ; incr < 11 ; incr++) {
        skills.push({
            category: category,
            description: description,
            name: `Name skills ${incr}`
        })
    }

    category = 'Hard Skills';
    description = 'Description for Hard Skills';
    for (let incr = 1 ; incr < 11 ; incr++) {
        skills.push({
            category: category,
            description: description,
            name: `Name skills ${incr}`
        })
    }

    category = 'Other Skills';
    description = 'Description for Other Skills';
    for (let incr = 1 ; incr < 11 ; incr++) {
        skills.push({
            category: category,
            description: description,
            name: `Name skills ${incr}`
        })
    }
    return skills;
}

module.exports = { getSkills };