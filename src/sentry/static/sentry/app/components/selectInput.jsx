import PropTypes from 'prop-types';
import React from 'react';
import jQuery from 'jquery';

class SelectInput extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    multiple: PropTypes.bool,
    required: PropTypes.bool,
    placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
  };

  static defaultProps = {
    // HTML attrs
    disabled: false,
    multiple: false,
    required: false,

    // Extra options
    placeholder: 'Select an option...',

    // Component options
    value: '',
    onChange: $.noop,
  };

  componentDidMount() {
    this.create();
    /*below is a hack for a bug in edge related to form submitting.
    see: https://github.com/facebook/react/issues/7655
    (@maxbittker)*/
    if (this.refs.select) {
      let selectedIndex = this.refs.select.selectedIndex;
      if (selectedIndex >= 0) {
        let options = this.refs.select.options;
        let tempIndex = (selectedIndex + 1) % options.length;

        options[tempIndex].selected = true;
        options[selectedIndex].selected = true;
      }
    }
  }

  componentWillUpdate() {
    this.destroy();
  }

  componentDidUpdate() {
    this.create();
  }

  componentWillUnmount() {
    this.destroy();
  }

  getSelect2Value = () => {
    return this.select2.getValue();
  };

  create = () => {
    this.select2 = jQuery(this.refs.select).select2({
      width: 'element',
    });
    this.select2.on('change', this.onChange);
  };

  destroy = () => {
    jQuery(this.refs.select).select2('destroy');
  };

  onChange = (...args) => {
    this.props.onChange.call(this, this.select2, ...args);
  };

  render() {
    return (
      <select ref="select" {...this.props}>
        {this.props.children}
      </select>
    );
  }
}

export default SelectInput;
