import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {Select2Field, NumberField, TextField} from '../../components/forms';

class RuleNode extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    node: PropTypes.shape({
      label: PropTypes.string.isRequired,
      formFields: PropTypes.object,
    }).isRequired,
    onDelete: PropTypes.func.isRequired,
    handlePropertyChange: PropTypes.func.isRequired,
  };

  componentDidMount() {
    let $html = $(ReactDOM.findDOMNode(this.refs.html));

    $html.find('select, input, textarea').each((_, el) => {
      if (this.props.data[el.name] === undefined) {
        return;
      }

      let $el = $(el);
      $el.attr('id', '');
      $el.val(this.props.data[el.name]);
    });
  }

  getChoiceField(name, data) {
    return (
      <Select2Field
        name={name}
        value={this.props.data[name]}
        choices={data.choices}
        key={name}
        style={{marginBottom: 0}}
        onChange={val => this.props.handlePropertyChange(name, val)}
      />
    );
  }

  getTextField(name, data) {
    return (
      <TextField
        name={name}
        value={this.props.data[name]}
        placeholder={data.placeholder}
        key={name}
        style={{height: 37, marginBottom: 0}}
        onChange={evt => this.props.handlePropertyChange(name, evt.target.value)}
      />
    );
  }

  getNumberField(name, data) {
    return (
      <NumberField
        name={name}
        value={this.props.data[name]}
        placeholder={data.placeholder}
        key={name}
        inputStyle={{height: 37, marginBottom: 0}}
        onChange={evt => this.props.handlePropertyChange(name, evt.target.value)}
      />
    );
  }

  getField(name, data) {
    const getFieldTypes = {
      choice: this.getChoiceField.bind(this),
      number: this.getNumberField.bind(this),
      string: this.getTextField.bind(this),
    };
    return getFieldTypes[data.type](name, data);
  }

  getComponent(node) {
    const {label, formFields} = node;

    return label.split(/({\w+})/).map(part => {
      if (!/^{\w+}$/.test(part)) {
        return part;
      }

      const key = part.slice(1, -1);
      return formFields[key] ? this.getField(key, formFields[key]) : part;
    });
  }

  render() {
    let {data, node} = this.props;
    let html = this.getComponent(node);

    return (
      <tr>
        <td className="rule-form">
          <input type="hidden" name="id" value={data.id} />
          <span style={{display: 'flex', alignItems: 'center'}}>{html}</span>
        </td>
        <td className="align-right">
          <a onClick={this.props.onDelete}>
            <span className="icon-trash" />
          </a>
        </td>
      </tr>
    );
  }
}

export default RuleNode;
