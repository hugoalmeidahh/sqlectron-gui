// IE 10+ compatibility for demo (must come before other imports)
//import 'babel-polyfill';
// Import react-virtualized styles as part of bootstrap process
//import '../../styles.css';
import * as React from 'react';

import Application from './Application';
export default class App extends React.Component<Props> {

    render=()=>{
        return        <Application />;
    }
}
