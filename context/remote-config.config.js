export const CASINO_ENABLED = 'CASINO_ENABLED';
export const TEST = 'TEST';
export const NUMBER_VALUE = 'NUMBER_VALUE';
export const JSON_TEST = 'JSON_TEST';

//Maybe json should be passed default as a string
const configDefaults = {
    [CASINO_ENABLED]: false,
    [TEST]: 'aaa',
    [NUMBER_VALUE]: 1,
    [JSON_TEST]: {},
};

export default configDefaults;