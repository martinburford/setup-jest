# **setup/jest**

**Please note:** before running any code from this branch, be sure to run `npm install`.

This repository has been created in order to demonstrate how **jest** (https://www.npmjs.com/package/jest) should be used in order to perform test snapshots.

----

Jest is useful as a testing platform for many aspects of testing a React codebase. This repository shows how to setup Jest in order to create **snapshots**. The concept of snapshots is to render a React component, and to store a reference of it (its snapshot), so that a future check can be made. This future check will compare the current rendered output of a component against its snapshot. If the comparison doesn't' match, one of the following has happened:

- The React component is currently broken
- The React component has been updated since the last snapshot was taken, and another should be taken

A huge benefit of snapshots is that a deep (recursive) check of a components inner contents is made. So, it's a great way to test both individual components with no children as well as Higher Order Components with potentially many child components. It is down to the test script to determine at what level of nesting a snapshot is taken at.

## How are snapshots generated?

There are a few elements to the configuration of getting snapshots working. Firstly, the following Node modules have to be installed:

- **babel-jest** - https://www.npmjs.com/package/babel-jest

- **jest** - https://www.npmjs.com/package/jest

- **react-test-renderer**: https://www.npmjs.com/package/react-test-renderer

Once these have been installed, the following should be added to the **package.json** file of your project. This configuration can be placed in external configuration .js files, however there is no particular benefit in doing this other than extraction of code configuration to separate file locations.

```javascript
...
"jest": {
  "collectCoverage": true
}
...
```

**collectCoverage** is a useful feature shipped as part of Jest which outputs a visual representation of how much code within your tested components the snapshots have covered. An example of the output from the tests as included within this ReadMe is included below. The reason why there isn't 100% coverage in this particular test is because the code of Link.js (the component being tested) contains event handler functions. These are not tested as part of a snapshot. So, to achieve 100% code coverage, additional tests would need to be performed to include coverage for such features.

| File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s |
|:----------|:-------:|:--------:|:-------:|:-------:|:-----------------:|
| All files | 80      | 75       | 60      | 80      |                   |
| Link.js   | 80      | 75       | 60      | 80      | 22,26             |

There are many other configurable options for jest. These can be found here: https://jestjs.io/docs/en/configuration


Within your package.json file, be sure to add the following suffix to your NPM test script:

```javascript
"test": "jest --env=jsdom"
```

Since unit tests will usually be run as part of a larger Continuous Integration pipeline, it's important to tell Jest that the tests won't be executed in an actual DOM within a browser. By specifying a test environment as **jsdom**, this will ensure the tests can run within a suitable manner.

## A sample snapshot

Below is a sample snapshot. It contains a JSON tree which has been created as a representation of the React component being tested against (`<Link />`):

```javascript
// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`<Link /> renders correctly (with error prop) 1`] = `
<div>
  <a
    className="error"
    href="http://www.site.com"
    onClick={[Function]}
    onMouseLeave={[Function]}
  >
    Site
  </a>
</div>
`;

exports[`<Link /> renders correctly (with no additional props) 1`] = `
<div>
  <a
    className="normal"
    href="http://www.site.com"
    onClick={[Function]}
    onMouseLeave={[Function]}
  >
    Site
  </a>
</div>
`;
```

## React test renderer

One of the 3 requirements of setting up Jest snapshots is a Node module called React-Test-Renderer. This is the module which is responsible for creating a snapshot AND comparing a React component against its own snapshot.

### How is a snapshot created?

By default, for any file which ends in **.test.js**, that test file will be run by Jest. In order to generate a snapshot, an instance of a **react-test-renderer** needs to be created. This is then able to create a React component and convert the rendered output of that component to JSON. This JSON is stored and compared against that tests snapshot. 

If the test script being run doesn't currently have a snapshot, it is automatically created in a folder called **__snapshots**, running alongside the test script.

If the react-test-renderers JSON and the components snapshot match, the test will pass. If however the comparison finds a difference, the test will fail.

In this particular test, there are 2 separate tests being carried out. The first of which (indicated by `exports['<Link /> renders correctly (with no additional props) 1']`) checks a `<Link />` component in its base format with no props provided:

```javascript
import React from 'react';
import Link from './Link';
import renderer from 'react-test-renderer';

it('<Link /> renders correctly (with no additional props)', () => {
  const tree = renderer
    .create(
      <Link 
        page="http://www.site.com"
      >
        Site
      </Link>
    )
    .toJSON();

  // Check the snapshot against the JSON tree
  expect(tree).toMatchSnapshot();
});
```

The second test passes a prop of **error** (as shown below). The provision of this changes the output in the component. As shown in the snapshot code above, the className of the `</a>` tag changes from **normal** to **error**. This is a direct impact from the **error** prop being provided to the component.

```javascript
it('<Link /> renders correctly (with error prop)', () => {
  const tree = renderer
    .create(
      <Link 
        page="http://www.site.com" 
        error
      >
        Site
      </Link>
    )
    .toJSON();

  // Check the snapshot against the JSON tree
  expect(tree).toMatchSnapshot();
});
```

## How are snapshots updated / refreshed?

Components change. Whether this happens intentionally or unintentionally, they will change. As a result, when a snapshot fails, that is a good time to update a projects snapshots. It is entirely possible that a component is updated to include a new feature and the code is entirely valid. A snapshot test would always fail after a component has been updated, since the snapshot (from a previous version of the component) no longer aligns to how the component is now. An error within a component would also result in a failed test, as the snapshot would also differ compared to the components (erroring) rendered output. In order to refresh snapshots in a project, the following command should be run:

```javascript
jest -u
```

Please note that in order to run Jest on the command line, it has to be globally available in your PATH. This can also be achieved by installing Jest globally via `npm install -g jest`.

## The Link.js file being tested

Throughout this ReadMe, a file **Link.js** has been mentioned, in terms of the code component being tested. Here is the code for the `<Link />` React component:

```javascript
import React, { Component } from 'react';

const STATUS = {
  ERROR: 'error',
  HOVERED: 'hovered',
  NORMAL: 'normal',
};

class Link extends Component {
  constructor() {
    super();

    this._onClick = this._onClick.bind(this);
    this._onMouseLeave = this._onMouseLeave.bind(this);

    this.state = {
      class: STATUS.NORMAL,
    };
  }

  _onClick(){
    this.setState({class: STATUS.HOVERED});
  }

  _onMouseLeave(){
    this.setState({class: STATUS.NORMAL});
  }

  componentDidMount(){
    if(this.props.error){
      this.setState({class: STATUS.ERROR});
    }
  }

  render(){
    return (
      <div>
        <a
          className={this.state.class}
          href={this.props.page || '#'}
          onClick={this._onClick}
          onMouseLeave={this._onMouseLeave}
        >
          {this.props.children}
        </a>
      </div>
    );
  }
}

export default Link;
```