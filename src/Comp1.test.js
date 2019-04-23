import TestRenderer from 'react-test-renderer';
import React from 'react';
function MyComponent() {
  return (
    <div>
      <SubComponent foo="bar" />
      <p className="my">Hello</p>
    </div>
  )
}

function SubComponent() {
  return (
    <p className="sub">Sub</p>
  );
}
const testRenderer = TestRenderer.create(<MyComponent />);
const testInstance = testRenderer.root;
test('test props', () => {
	expect(testInstance.findByType(SubComponent).props.foo).toBe('bar');
});
test('test children', () => {
	expect(testInstance.findByProps({className: "sub"}).children).toEqual(['Sub']);
});
