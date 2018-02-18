import PropTypes from 'prop-types';
import React from 'react';
import {shallow} from 'enzyme';

import TeamSettings from 'app/views/settings/team/teamSettings';

const childContextTypes = {
  organization: PropTypes.object,
  router: PropTypes.object,
  location: PropTypes.object,
};

describe('TeamSettings', function() {
  describe('render()', function() {
    let wrapper;
    beforeEach(function() {
      let team = TestStubs.Team();
      wrapper = shallow(
        <TeamSettings
          routes={[]}
          params={{orgId: 'org', teamId: team.slug}}
          team={team}
          onTeamChange={() => {}}
        />,
        {
          context: {
            router: TestStubs.router(),
            organization: {
              id: '1337',
              access: [],
            },
          },
          childContextTypes,
        }
      );
    });

    it('renders', function() {
      wrapper.update();
      expect(wrapper).toMatchSnapshot();
    });

    it('renders with remove team', function() {
      wrapper.setContext({
        organization: {
          id: '1337',
          access: ['team:admin'],
        },
      });
      wrapper.update();
      expect(wrapper).toMatchSnapshot();
    });
  });
});
