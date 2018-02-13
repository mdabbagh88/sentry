import Reflux from 'reflux';
import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import Button from '../buttons/button';
import {t} from '../../locale';
import {dismiss, markUseful, nextStep} from '../../actionCreators/guides';
import ApiMixin from '../../mixins/apiMixin';
import GuideStore from '../../stores/guideStore';

// GuideDrawer is what slides up when the user clicks on a guide cue.
const GuideDrawer = createReactClass({
  displayName: 'GuideDrawer',

  propTypes: {
    guide: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
  },

  mixins: [ApiMixin, Reflux.listenTo(GuideStore, 'onGuideStateChange')],

  getInitialState() {
    return {
      step: 0,
    };
  },

  onGuideStateChange(data) {
    this.setState({
      step: data.currentStep,
    });
  },

  handleNext() {
    nextStep();
  },

  handleUseful(useful) {
    markUseful(this.props.guide.id, useful);
    this.props.onClose();
  },

  handleDismiss() {
    dismiss(this.props.guide.id);
    this.props.onClose();
  },

  render() {
    return (
      <div>
        <div className="assistant-drawer-title">
          {this.props.guide.steps[this.state.step].title}
        </div>
        <div className="assistant-drawer-message">
          {this.props.guide.steps[this.state.step].message}
        </div>
        <div>
          {this.state.step < this.props.guide.steps.length - 1 ? (
            <div>
              <Button onClick={this.handleNext}>{t('Next')} &rarr;</Button>
              <Button onClick={this.handleDismiss}>{t('Dismiss')}</Button>
            </div>
          ) : (
            <div>
              <p>{t('Did you find this guide useful?')}</p>
              <Button onClick={() => this.handleUseful(true)}>
                {t('Yes')} &nbsp; &#x2714;
              </Button>
              <Button onClick={() => this.handleUseful(false)}>
                {t('No')} &nbsp; &#x2716;
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  },
});

export default GuideDrawer;
