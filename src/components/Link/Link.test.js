import React from 'react';
import Link from './Link';
import renderer from 'react-test-renderer';

it('<Link /> renders correctly (with no additional props)', () => {
  const tree = renderer
    .create(<Link page="http://www.site.com">Site</Link>)
    .toJSON();

  // Check the snapshot against the JSON tree
  expect(tree).toMatchSnapshot();
});

it('<Link /> renders correctly (with error prop)', () => {
  const tree = renderer
    .create(
      <Link page="http://www.site.com" error>Site</Link>
    )
    .toJSON();

  // Check the snapshot against the JSON tree
  expect(tree).toMatchSnapshot();
});