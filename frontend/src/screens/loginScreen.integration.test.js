import { storeFactory } from '../../test/testUtils';
import { login } from '../actions/userActions';
import moxios from 'moxios';

describe('login action dispatcher', () => {
    const id = 'test@mail.com';
    const matchPassword = '123456';
    const wrongPassword = '654321';
    
    let store;
    const initialState = {};

    store = storeFactory(initialState);

    beforeEach(() => {
        moxios.install();
    });
    afterEach(() => {
        moxios.uninstall();
    });
    test('Update state correcty if wrong email address', () => {
        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({
                status: 200,
                response: {
                    _id: 'test_id',
                    name: 'test_name',
                    email: 'test@mail.com',
                    profil: 'testProfil',
                    adminLevel: 'adminLevel',
                    consultantProfil: {name: 'testProfil'},
                    status: 'Validated',
                    token: 'FakeToken123456',
                    lastConnexion: new Date(Date.now())
                }
            });
        });
        return store.dispatch(login('LOCAL', { email: id, password: wrongPassword }))
            .then(() => {
                const newState = store.getState();
                //console.log(newState);
                expect(newState.userLogin.userInfo).not.toBeUndefined();
            })
    });
    describe('Update state correcty if righ email address', () => {
        test('Update state correcty if password match', () => {

        });
        test('Update state correcty if password unmatch', () => {

        });
    });
});