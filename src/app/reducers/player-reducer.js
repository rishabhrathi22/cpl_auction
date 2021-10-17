import { FETCH_ALL_PLAYERS, UPDATE_PLAYERS } from '../actions';

export default (state = {}, action) => {
    switch (action.type) {
        case FETCH_ALL_PLAYERS:
            return action.payload;
        case UPDATE_PLAYERS:
            return action.payload;
        default:
            return state;
    }
}