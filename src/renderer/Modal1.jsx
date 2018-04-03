import * as React from 'react';
import {Divider, Transition,Button,Input, Grid, Header, List, Segment, Icon, Modal } from 'semantic-ui-react';
export default class App extends React.Component{
  render=()=>{
    return <Modal
        open={this.props.modalOpen}
        onClose={this.props.handleClose}
        basic
        size='small'
      >
        <Header icon='browser' content='Cookies policy' />
        <Modal.Content>
          <h3>This website uses coo
          kies to ensu=
          re the best user experience.</h3>
        </Modal.Content>
        <Modal.Actions>
          <Button color='green' onClick={this.props.handleClose} inverted>
            <Icon name='checkmark' /> =========Got it
          </Button>
        </Modal.Actions>
      </Modal>;
    }
}