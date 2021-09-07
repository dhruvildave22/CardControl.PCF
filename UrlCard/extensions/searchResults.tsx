/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import * as React from 'react';
import * as moment from 'moment';
import PropTypes from 'prop-types';
import { ShrinkOutlined, DoubleLeftOutlined, ArrowsAltOutlined } from '@ant-design/icons';
import { Collapse, Tooltip } from 'antd';
import * as _ from 'lodash';

import Utils from '../global/utils';

const { Panel } = Collapse;

interface resultProps extends HTMLInputElement{
    searchData: Array<any>,
    setIsResultClick: (type: boolean) => void,
    setVideo: (video: string) => void, 
    setModalVisible: (type: boolean) => void,
    isSeek: boolean,
    setIsSeek: (type: boolean) => void,
    videoPlayerRef: any,
    video: string,
    isLoading: boolean,
    tags: Array<String>,
    setSearchData: any
}

const SearchResults: React.FC<any> = ({
  searchData, setIsResultClick, setVideo, setModalVisible, isSeek, setIsSeek, videoPlayerRef, video, titleData, isLoading,
}) => {
  const [startTime, setStartTime] = React.useState([]);
  const [searchDataLength, setSearchDataLength] = React.useState([]);
  //const buttonRef = React.createRef();

  const getVideoName = (videoPath: any) => {
    const videoNameArray = videoPath.split('/');
    const videoNameSplit = videoNameArray[videoNameArray.length - 1].split('.');
    const videoName = videoNameSplit[0];
    return videoName;
  };

  const handleResultClick = (videoPath: any, isSeekPer: any, startTimePar:any, e:any) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResultClick(true);
    setVideo(videoPath);
    setModalVisible(true);
    setStartTime(startTimePar);
    if (isSeekPer === '') {
      setIsSeek(true);
    }
  };

  const handleToggleClick = () => {
    if (searchDataLength.length !== 0) {
      setSearchDataLength([]);
    } else {
      const tempArray: any = searchData.map((item: any, index: any) => index.toString());
      setSearchDataLength(tempArray);
    }
  };

  React.useEffect(() => {
    console.log('videoPlayerRef out', videoPlayerRef);
    if (isSeek && video && videoPlayerRef.current) {
      console.log('videoPlayerRef in', videoPlayerRef);
      videoPlayerRef.current.seekTo(Utils.convertHMS(startTime));
    }
  }, [video, isSeek, startTime]);

  React.useEffect(() => {
    const tempArray: any = searchData.map((item: any, index: any) => index.toString());
    setSearchDataLength(tempArray);
  }, [searchData]);

  const handleMetadaClick = (item: any, metadata: any) => {
    const searchString = `${item.key}_URL`;
    const finalArray = metadata.filter((MetaItem: any) => MetaItem.key === searchString);
    if (finalArray.length !== 0) {
      window.open(finalArray[0].value, '_blank');
    }
  };

  const renderSearchUI = (itemArray: any, videoPath: any, _metaData: any, itemText: any, heading: any, searchCount: any) => (
    <>
      {itemArray && itemArray.length !== 0 && (
        <>
          <Collapse className={`result-data-collapse ${heading}`} defaultActiveKey="1">
            <Panel header={`${searchCount ? `${heading} (${searchCount})` : heading}`} key="1">
              <ul>
                {itemArray.map((item: any) => (
                  <>
                    {item.timestamps && item.timestamps.map((timestamp: any) => (
                      <>
                        <li key={timestamp.start}>
                          <button type="button" onClick={(e) => handleResultClick(videoPath, '', timestamp.start, e)}>
                            <span>{timestamp.start.split('.')[0]}</span>
                            {' '}
                            <div dangerouslySetInnerHTML={{ __html: item[itemText] }} />
                          </button>
                        </li>
                      </>
                    ))}
                  </>
                ))}
              </ul>
            </Panel>
          </Collapse>
        </>
      )}
    </>
  );

  const renderMetaData = (metaData: any, searchCount: any) => (
    <div className="metadata">
      <Collapse className="result-data-collapse" defaultActiveKey="1">
        <Panel header={`${searchCount ? `Metadata (${searchCount})` : 'Metadata'}`} key="1">
          <ul>
            {metaData && metaData.length !== 0 && metaData.sort().map((item: any) => (
              <>
                {/* {console.log('@@@@', JSON.parse(metaData).filter(item => item.key === 'Service_Account_URL'))} */}
                {item.key.search('_URL') === -1 && (
                  <li>
                    <button type="button" onClick={() => handleMetadaClick(item, metaData)}>
                      <span>
                        {item.key.length >= 17 ? (
                          <Tooltip title={item.key}>
                            {item.key}
                          </Tooltip>
                        ) : (
                          item.key
                        )}
                      </span>
                      <div dangerouslySetInnerHTML={{ __html: item.value }} />
                    </button>
                  </li>
                )}
              </>
            ))}
          </ul>
        </Panel>
      </Collapse>
    </div>
  );

  const renderSearchResults = (item: any, index: any) => (
    <>
      {!isLoading && (
        <Panel
          header={(
            <div className="row">
              <div className="col-12 col-sm-1 video-thum">
                <button type="button" className="video-button" onClick={(e) => handleResultClick(item.path, 'noSeek', 0, e)}>
                  <img src={item.header.thumbnail} alt="" />
                </button>
              </div>
              <div className="col-12 col-sm-10">
                {/* <h3 className={item.blob_metadata.metadata.length !== 0 ? 'hasMetadata' : 'noMetadata'}> */}
                <h3 className="noMetadata">
                  <button type="button" className="video-name" onClick={(e) => handleResultClick(item.path, 'noSeek', 0, e)}>
                    {getVideoName(item.header.name)}
                    {' '}
                    {item.match_count && (
                      <>
                        (
                          {Utils.getTotalSearchResult(item)}
                        )
                      </>
                    )}
                  </button>
                  {item.header && (
                  <span>
                    {moment.utc(item.header.creation_date).local().format('DD-MMM-YYYY')}
                  </span>
                  )}
                </h3>
              </div>
            </div>
            )}
          key={index}
        >
          <div className="search-result" key={item.id}>
            <div className="row">
              <div className="col-12 col-sm-11 offset-sm-1 pl-0">
                <>
                  {item.metadata && renderMetaData(item.metadata, item.match_count && item.match_count.metadata)}
                </>
                {Object.keys(item).map((key) => (
                  <>
                    {Array.isArray(item[key]) && key !== 'metadata' && renderSearchUI(item[key], item.path, '', 'text', titleData[key], item.match_count && item.match_count[key])}
                  </>
                ))}
              </div>
            </div>
          </div>
        </Panel>
      )}
    </>
  );

  return (
    <>
      {searchData.length !== 0 && searchDataLength.length !== 0 ? (
        <div className="container results-container">
          {!isLoading && (
            <Tooltip title="Collapse All">
              <button type="button" className="toggle-button" onClick={handleToggleClick}>
                <DoubleLeftOutlined rotate={90} style={{ fontSize: 18 }} />
              </button>
            </Tooltip>
          )}
          <Collapse expandIconPosition="right" defaultActiveKey={searchDataLength}>
            {searchData.map((item: any, index: any) => (
              renderSearchResults(_.omit(item, ['@search.score', 'content', 'id']), index)
            ))}
          </Collapse>
        </div>
      ) : (
        <>
          {searchDataLength.length === 0 && searchData.length !== 0 && (
            <div className="container results-container">
              {!isLoading && (
                <Tooltip title="Expand All">
                  <button type="button" className="toggle-button" onClick={handleToggleClick}>
                    <DoubleLeftOutlined rotate={-90} style={{ fontSize: 18 }} />
                  </button>
                </Tooltip>
              )}
              <Collapse expandIconPosition="right" defaultActiveKey={(searchDataLength)}>
                {searchData.map((item: any, index: any) => (
                  renderSearchResults(_.omit(item, ['@search.score', 'content', 'id']), index)
                ))}
              </Collapse>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default SearchResults;
