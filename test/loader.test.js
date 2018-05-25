import loader from '../';

describe('Loader', () => {
    let thisObject = {
        resourcePath: __filename,
    };
    test('image.png should have proper width/height attributes', () => {
        expect(loader.call(thisObject, "<img src=\"image.png\"/>")).toMatchSnapshot();
    });
    test('should not add width if it is already present', () => {
        expect(loader.call(thisObject, "<img src=\"image.png\" width=\"50\"/>")).toMatchSnapshot();
    });
    test('should not add height if it is already present', () => {
        expect(loader.call(thisObject, "<img src=\"image.png\" height=\"50\"/>")).toMatchSnapshot();
    });
});