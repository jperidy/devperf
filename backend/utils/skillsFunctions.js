const myAccessSkills = async (data, req) => {
    let access = 'read';
    switch (data) {
        case 'my':
            access = 'read';
            break;
        case 'team':
            access = 'read';
            break;
        case 'department':
            access = 'write';
            break;
        case 'domain': // to implement
            access = 'write';
            break;
        case 'all':
            access = 'write';
            break;
        default:
            break;
    }
    return access;
}

module.exports = { myAccessSkills }