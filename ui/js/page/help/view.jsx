//@TODO: Customize advice based on OS
import React from 'react';
import lbry from 'lbry.js';
import Link from 'component/link';
import SubHeader from 'component/subHeader'
import {BusyMessage} from 'component/common'

class HelpPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      versionInfo: null,
      lbryId: null,
      uiVersion: null,
      upgradeAvailable: null
    };
  }

  componentWillMount() {
    lbry.getAppVersionInfo().then(({remoteVersion, upgradeAvailable}) => {
      this.setState({
        uiVersion: remoteVersion,
        upgradeAvailable: upgradeAvailable
      });
    });
    lbry.call('version', {}, (info) => {
      this.setState({
        versionInfo: info
      })
    })
    lbry.getSessionInfo((info) => {
      this.setState({
        lbryId: info.lbry_id,
      });
    });
  }

  render() {
    let ver, osName, platform, newVerLink;

    const {
      navigate
    } = this.props

    if (this.state.versionInfo) {
      ver = this.state.versionInfo;
      if (ver.os_system == 'Darwin') {
        osName = (parseInt(ver.os_release.match(/^\d+/)) < 16 ? 'Mac OS X' : 'Mac OS');

        platform = `${osName} ${ver.os_release}`
        newVerLink = 'https://lbry.io/get/lbry.dmg';
      } else if (ver.os_system == 'Linux') {
        platform = `Linux (${ver.platform})`;
        newVerLink = 'https://lbry.io/get/lbry.deb';
      } else {
        platform = `Windows (${ver.platform})`;
        newVerLink = 'https://lbry.io/get/lbry.msi';
      }
    } else {
      ver = null;
    }

    return (
      <main className="main--single-column">
        <SubHeader />
        <section className="card">
          <div className="card__title-primary">
            <h3>Read the FAQ</h3>
          </div>
          <div className="card__content">
            <p>Our FAQ answers many common questions.</p>
            <p><Link href="https://lbry.io/faq" label="Read the FAQ" icon="icon-question" button="alt"/></p>
          </div>
        </section>
        <section className="card">
          <div className="card__title-primary">
            <h3>Get Live Help</h3>
          </div>
          <div className="card__content">
            <p>
              Live help is available most hours in the <strong>#help</strong> channel of our Slack chat room.
            </p>
            <p>
              <Link button="alt" label="Join Our Slack" icon="icon-slack" href="https://slack.lbry.io" />
            </p>
          </div>
        </section>
        <section className="card">
          <div className="card__title-primary"><h3>Report a Bug</h3></div>
          <div className="card__content">
            <p>Did you find something wrong?</p>
            <p><Link onClick={() => navigate('report')} label="Submit a Bug Report" icon="icon-bug" button="alt" /></p>
            <div className="meta">Thanks! LBRY is made by its users.</div>
          </div>
        </section>
        <section className="card">
         <div className="card__title-primary"><h3>About</h3></div>
         <div className="card__content">
           { this.state.upgradeAvailable === null ? '' :
            ( this.state.upgradeAvailable ?
               <p>A newer version of LBRY is available. <Link href={newVerLink} label={`Download now!`} /></p>
               : <p>Your copy of LBRY is up to date.</p>)}
           { this.state.uiVersion && ver ?
             <table className="table-standard">
               <tbody>
                 <tr>
                   <th>daemon (lbrynet)</th>
                   <td>{ver.lbrynet_version}</td>
                 </tr>
                 <tr>
                   <th>wallet (lbryum)</th>
                   <td>{ver.lbryum_version}</td>
                 </tr>
                 <tr>
                   <th>interface</th>
                   <td>{this.state.uiVersion}</td>
                 </tr>
                 <tr>
                   <th>Platform</th>
                   <td>{platform}</td>
                 </tr>
                 <tr>
                   <th>Installation ID</th>
                   <td>{this.state.lbryId}</td>
                 </tr>
               </tbody>
             </table> :
             <BusyMessage message="Looking up version info" />
            }
         </div>
        </section>
      </main>
    );
  }
}

export default HelpPage;
