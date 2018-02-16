import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import Reflux from 'reflux';

import LatestContextStore from '../../stores/latestContextStore';
import StreamTagStore from '../../stores/streamTagStore';
import ProjectState from '../../mixins/projectState';
import StreamTagActions from '../../actions/streamTagActions';
import AlertActions from '../../actions/alertActions';
import ApiMixin from '../../mixins/apiMixin';

import {t} from '../../locale';

import Stream from './stream';

const MAX_TAGS = 500;

const StreamContainer = createReactClass({
  displayName: 'StreamContainer',

  propTypes: {
    setProjectNavSection: PropTypes.func,
  },

  mixins: [
    ProjectState,
    ApiMixin,
    Reflux.listenTo(LatestContextStore, 'onLatestContextChange'),
    Reflux.listenTo(StreamTagStore, 'onStreamTagChange'),
  ],

  getInitialState() {
    const hasEnvironmentsFeature = new Set(this.getOrganization().features).has(
      'environments'
    );

    return {
      hasEnvironmentsFeature,
      environment: hasEnvironmentsFeature ? LatestContextStore.getInitialState() : null,
      tags: StreamTagStore.getAllTags(),
      tagsLoading: true,
    };
  },

  componentWillMount() {
    this.props.setProjectNavSection('stream');
    this.fetchTags();
  },

  onLatestContextChange(context) {
    // Don't do anything unless environment is changing
    if (context.environment === this.state.environment) return;

    if (this.state.hasEnvironmentsFeature) {
      this.setState({
        environment: context.environment,
      });
    }
  },

  onStreamTagChange(tags) {
    // new object to trigger state change
    this.setState({
      tags: {...tags},
    });
  },

  fetchTags() {
    StreamTagStore.reset();
    StreamTagActions.loadTags();

    this.setState({
      tagsLoading: true,
    });

    let {orgId, projectId} = this.props.params;

    this.api.request(`/projects/${orgId}/${projectId}/tags/`, {
      success: tags => {
        let trimmedTags = tags.slice(0, MAX_TAGS);

        if (tags.length > MAX_TAGS) {
          AlertActions.addAlert({
            message: t('You have too many unique tags and some have been truncated'),
            type: 'warn',
          });
        }
        this.setState({tagsLoading: false});
        StreamTagActions.loadTagsSuccess(trimmedTags);
      },
      error: error => {
        this.setState({tagsLoading: false});
        StreamTagActions.loadTagsError();
      },
    });
  },

  render: function() {
    return (
      <Stream
        location={this.props.location}
        params={this.props.params}
        environment={this.state.environment}
        project={this.getProject()}
        organization={this.getOrganization()}
        tags={this.state.tags}
        tagsLoading={this.state.tagsLoading}
      />
    );
  },
});

export default StreamContainer;
