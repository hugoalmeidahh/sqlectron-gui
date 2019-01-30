import React, { Component } from 'react';
import PropTypes from 'proptypes';
import DatabaseDiagram from './database-diagram.jsx';
import Loader from './loader.jsx';
import { Modal, Dropdown } from 'semantic-ui-react';
// import Immutable from 'immutable';

//import update from 'immutability-helper';
//import  { List } from 'immutable';
import CheckBox from './checkbox.jsx';
// console.log(Immutable);
const STYLE = {
  list: {
    maxHeight: '250px',
    overflow: 'hidden',
    overflowY: 'scroll',
    padding: '8px',
    border: '2px solid',
  },
};

export default class DatabaseDiagramModal extends Component {
  static propTypes = {
    database: PropTypes.string,
    tables: PropTypes.array,
    selectedTables: PropTypes.array,
    views: PropTypes.array,
    columnsByTable: PropTypes.object,
    tableKeys: PropTypes.object,
    diagramJSON: PropTypes.string,
    isSaving: PropTypes.bool,
    onGenerateDatabaseDiagram: PropTypes.func.isRequired,
    addRelatedTables: PropTypes.func.isRequired,
    onSaveDatabaseDiagram: PropTypes.func.isRequired,
    onExportDatabaseDiagram: PropTypes.func.isRequired,
    onOpenDatabaseDiagram: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    const { tables, views } = this.props;
    const tablesAndViews = tables.concat(views);
    this.state = { modalOpen: false, selectedTables: tablesAndViews };
  }
  // $(':checkbox:checked', 'div.ui.list')
  //   .map((index, checkbox) => selectedTables.push(checkbox.id));
  componentDidMount() {
    // $(this.refs.diagramModal).modal({
    //   closable: true,
    //   detachable: false,
    //   // Updates modal position on loading diagram in modal DOM
    //   observeChanges: true,
    //   onHidden: () => {
    //     this.props.onClose();
    //   },
    //   onApprove: () => false,
    // }).modal('show');
  }
  componentWillUnmount() {
    //this.props.onClose();
  }

  componentWillReceiveProps(nextProps) {
    this.showDiagramIfNeeded(nextProps);
  }

  onSelectAllTables() {
    // console.log(this.state.selectedTables);
    // const s2=this.state.selectedTables.update(k, notSetValue, updater);
    // return;
    //const nested3 = .updateIn([ 'a', 'b', 'd' ], value => value + 1)
    var newlist = this.state.selectedTables;
    for (var i = 0; i < newlist.length; i++) {
      newlist[i].checked = true;
    }
    this.setState({ selectedTables: newlist });
  }

  onDeselectAllTables() {
    var newlist = this.state.selectedTables;
    for (var i = 0; i < newlist.length; i++) {
      newlist[i].checked = false;
    }
    this.setState({ selectedTables: newlist });
  }

  onCheckBoxesChange = (idx, checked) => {
    var newlist = this.state.selectedTables;
    newlist[idx].checked = checked;
    this.setState({ selectedTables: newlist });
    // Disable generate diagram button if there are no tables selected
  };

  onGenerateDiagramClick() {
    this.setState({ showLoader: true });
    const filteredFoods = this.state.selectedTables.filter(
      (item, idx) => item.checked === true
    );
    var out = [];
    for (var i = 0; i < filteredFoods.length; i++) {
      out.push(filteredFoods[i].name);
    }
    console.log(out);

    this.props.onGenerateDatabaseDiagram(this.props.database, out);
  }

  onAddRelatedTables(relatedTables) {
    const { selectedTables, addRelatedTables } = this.props;

    // If all related tables are already on diagram -> no need to reset positions
    if (relatedTables.every(t => selectedTables.includes(t))) {
      return;
    }

    this.setState({ showDatabaseDiagram: false });
    addRelatedTables(relatedTables);
  }

  onExportDatabaseDiagram(imageType) {
    const { onExportDatabaseDiagram } = this.props;
    const diagram = this.refs.databaseDiagram.refs.diagram;

    // fix - reapply css roles which html2canvas ignores for some reason
    // $('.link-tools, .marker-arrowheads', diagram).css({ display: 'none' });
    // $('.link, .connection', diagram).css({ fill: 'none' });

    onExportDatabaseDiagram(diagram, imageType);
  }

  showDiagramIfNeeded(props) {
    if (this.isDataLoaded(props) || props.diagramJSON) {
      this.setState({ showDatabaseDiagram: true });
    }
  }

  isDataLoaded(props) {
    const { selectedTables, columnsByTable, tableKeys } = props;

    return (
      selectedTables &&
      columnsByTable &&
      tableKeys &&
      selectedTables.every(t => Object.keys(columnsByTable).includes(t)) &&
      selectedTables.every(t => Object.keys(tableKeys).includes(t))
    );
  }

  renderSelectTablesMenu() {
    const { onOpenDatabaseDiagram } = this.props;
    //const tablesAndViews =this.state.selectedTables;// tables.concat(views);
    var disabledG = '';
    const filteredFoods = this.state.selectedTables.filter(
      (item, idx) => item.checked === true
    );
    if (filteredFoods.length > 0) {
    } else {
      disabledG = 'disabled';
    }
    // console.log('disabledG:' + disabledG);
    return (
      <div className="content">
        <div className="ui middle aligned padded very relaxed stackable grid">
          <div className="ten wide column">
            <h4 className="ui horizontal divider header">
              <i className="list icon" />
              Select tables to include on diagram
            </h4>
            <div className="ui mini buttons">
              <button
                className="ui button mini"
                onClick={this.onSelectAllTables.bind(this)}
              >
                Select All
              </button>
              <div className="or" />
              <button
                className="ui button mini"
                onClick={this.onDeselectAllTables.bind(this)}
              >
                Deselect All
              </button>
            </div>
            <div className="ui list" style={STYLE.list}>
              {this.state.selectedTables.map((item, idx) => (
                <div style={{ paddingTop: '10px' }} key={idx}>
                  <CheckBox
                    label={item.name}
                    name={item.name}
                    defaultChecked={item.checked}
                    onChecked={() => {
                      this.onCheckBoxesChange(idx, true);
                    }}
                    onUnchecked={() => {
                      this.onCheckBoxesChange(idx, false);
                    }}
                  />
                </div>
              ))}
            </div>
            <button
              ref="generateButton"
              className={'ui right floated positive button ' + disabledG}
              style={{ marginBottom: '1em' }}
              onClick={this.onGenerateDiagramClick.bind(this)}
            >
              Generate diagram
            </button>
          </div>
          <div className="ui vertical divider">Or</div>
          <div className="six wide center aligned column">
            <button
              className="fluid ui blue labeled icon button"
              onClick={() => onOpenDatabaseDiagram()}
            >
              <i className="folder open outline icon" />
              Open diagram from file
            </button>
          </div>
        </div>
      </div>
    );
  }

  renderLoader() {
    return (
      <div style={{ minHeight: '300px' }}>
        <Loader message="Generating diagram" type="active" inverted />
      </div>
    );
  }

  renderDiagram() {
    const {
      selectedTables,
      columnsByTable,
      tableKeys,
      diagramJSON,
      isSaving,
    } = this.props;

    return (
      <DatabaseDiagram
        ref="databaseDiagram"
        tables={selectedTables}
        columnsByTable={columnsByTable}
        tableKeys={tableKeys}
        diagramJSON={diagramJSON}
        isSaving={isSaving}
        addRelatedTables={this.onAddRelatedTables.bind(this)}
      />
    );
  }

  renderActionButtons() {
    //            Export to
    //            <i className="caret up icon"></i>
    const { onSaveDatabaseDiagram } = this.props;
    let actions;
    let cancel;
    cancel = (
      <div
        className={`small ui black deny labeled icon button`}
        onClick={this.props.onClose}
        tabIndex="0"
      >
        Cancel
        <i className="ban icon" />
      </div>
    );
    if (!!this.state.showDatabaseDiagram) {
      actions = (
        <div className="ui buttons">
          {cancel}
          <div
            className="ui small positive button"
            tabIndex="0"
            onClick={() =>
              onSaveDatabaseDiagram(this.refs.databaseDiagram.graph.toJSON())
            }
          >
            Save
          </div>
          <div className="or" />
          <div>
            <Dropdown text="Export to" floating labeled button className="icon">
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => this.onExportDatabaseDiagram('png')}
                >
                  PNG
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => this.onExportDatabaseDiagram('jpeg')}
                >
                  JPEG
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      );
    } else {
      actions = <div className="ui buttons">{cancel}</div>;
    }
    return actions;
  }

  render() {
    // console.log('==render===');

    // Modal has to be in DOM before rendering diagram because of JointJS getBBox() method.
    // On first rendering, if context node is hidden, wrong widths and heights of JointJS
    // elements will be calculated.
    // For more check this issue: https://github.com/clientIO/joint/issues/262
    //     onHidden={ () => {
    //   this.props.onClose();
    // }}
    // onApprove={ () => false}
    return (
      <Modal
        ref="diagramModal"
        closable="true"
        detachable="false"
        dimmer={'inverted'}
        open={this.props.modalOpen}
      >
        {!!this.state.showDatabaseDiagram && (
          <Modal.Header>Database diagram</Modal.Header>
        )}
        <Modal.Content>
          {!this.state.showDatabaseDiagram &&
            !this.state.showLoader &&
            this.renderSelectTablesMenu()}
          {!this.state.showDatabaseDiagram &&
            !!this.state.showLoader &&
            this.renderLoader()}
          {!!this.state.showDatabaseDiagram && this.renderDiagram()}
        </Modal.Content>
        <Modal.Actions>
          {//!!this.state.showDatabaseDiagram && this.renderActionButtons()
          this.renderActionButtons()}
        </Modal.Actions>
      </Modal>
    );
  }
}
