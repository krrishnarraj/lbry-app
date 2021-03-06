import React from 'react';
import lbry from 'lbry';
import lbryio from 'lbryio';
import lbryuri from 'lbryuri';
import lighthouse from 'lighthouse';
import FileTile from 'component/fileTile'
import Link from 'component/link'
import {ToolTip} from 'component/tooltip.js';
import {BusyMessage} from 'component/common.js';

const SearchNoResults = (props) => {
  const {
    navigate,
    query,
  } = props

  return <section>
    <span className="empty">
      No one has checked anything in for {query} yet. { ' ' }
      <Link label="Be the first" onClick={() => navigate('/publish')} />
    </span>
  </section>;
}

const FileListSearchResults = (props) => {
  const {
    results,
  } = props

  const rows = [],
    seenNames = {}; //fix this when the search API returns claim IDs

  for (let {name, claim, claim_id, channel_name, channel_id, txid, nout} of results) {
    const uri = lbryuri.build({
      channelName: channel_name,
      contentName: name,
      claimId: channel_id || claim_id,
    });

    rows.push(
      <FileTile key={uri} uri={uri} />
    );
  }
  return (
    <div>{rows}</div>
  );
}

class FileListSearch extends React.Component{
  componentWillMount() {
    this.props.search(this.props.query)
  }

  render() {
    const {
      isSearching,
      results
    } = this.props

    return (
      <div>
        {isSearching && !results &&
          <BusyMessage message="Looking up the Dewey Decimals" />}

        {isSearching && results &&
          <BusyMessage message="Refreshing the Dewey Decimals" />}

        {(results && !!results.length) ?
          <FileListSearchResults {...this.props} /> :
          <SearchNoResults {...this.props} />}
      </div>
    )
  }
}

export default FileListSearch