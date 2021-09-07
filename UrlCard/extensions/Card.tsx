import * as React from "react";
import { Card, ICardTokens, ICardSectionStyles, ICardSectionTokens } from '@uifabric/react-cards';
import { FontWeights } from '@uifabric/styling';
import { Icon, IIconStyles, Image, Stack, IStackTokens, Text, ITextStyles } from 'office-ui-fabric-react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { initializeIcons } from "office-ui-fabric-react/lib/Icons";
import axios from 'axios';
import * as moment from "moment";
import { Modal } from 'antd';
import ReactPlayer from 'react-player';
import Loading from '../global/loading';

import Config from '../config';
import SearchInput from "../global/searchInput";
import ErrorBoundary from '../global/errorBoundary';
import SearchResults from './searchResults';

initializeIcons(undefined, { disableWarnings: true });

export interface ICardProps {
    isRequired?: boolean;
    errorMessage?: string;
    searchData?: Array<string>;
    test?: string;

    triggerOnChange?: (event: any, newValue?: string) => void;
    triggerOnClick?: () => void;
}

export interface ICardState extends React.ComponentState {
}

export interface IcardCombine extends ICardProps, ICardState {

}

const CardHorizontalExample: React.FC<ICardProps> = ({test}) => {
  const [tags, setTags] = React.useState([]);
  const [inputValue, setInputValue] =  React.useState('');
  const [searchData, setSearchData] =  React.useState([]);
  const [titleData, setTitleData] = React.useState([]);
  const [isLoading, setIsLoading] =  React.useState(false);
  const [isCall, setIsCall] =  React.useState(false);
  const [isResultClick, setIsResultClick] =  React.useState(false);
  const [modalVisible, setModalVisible] =  React.useState(false);
  const [video, setVideo] =  React.useState('');
  const [isSeek, setIsSeek] =  React.useState(false);
  const videoPlayerRef: any = React.createRef();

  React.useEffect(() => {
    if (tags.length !== 0) {
      setIsLoading(true);
      setIsCall(false);
      fetch(`https://dtdv-video-index-uspklrodz4yzi.azurewebsites.net/api/ACSSearchAPIWrapper`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin': "*",
          'Access-Control-Allow-Methods': 'POST, PUT, DELETE, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
        },
        body: JSON.stringify({
          "search": `${tags[0]}`,
          "api_version": '2020-06-30',
          "service": 'dtdvss',
          "key": 'D52DA06B07D3A48F345EEC85B21FAA5D',
          "index": 'development-container-in',
        })
      })
      .then(response => response.json())
      .then(resp => {
        setSearchData(resp.value);
        setTitleData(resp.titles);
        setIsLoading(false);
        setIsCall(true);
      })
      // axios({
      //   method: 'post',
      //   url: `${Config.baseUrl}/api/ACSSearchAPIWrapper`,
      //   headers: {
      //     'Access-Control-Allow-Origin': "*",
      //     // 'Access-Control-Allow-Headers': "*",
      //     'Access-Control-Allow-Methods': 'POST, PUT, DELETE, GET, OPTIONS',
      //     'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
      //   },
      //   data: {
      //     search: `${tags[0]}`,
      //     api_version: '2020-06-30',
      //     service: 'dtss',
      //     key: '9C539F1999DF3F776C0F5A55C449362E',
      //     index: 'video-index-demo-sc-in',
      //   },
      // })
      //   .then((resp) => {
      //     setSearchData(resp.data.value);
      //     setIsLoading(false);
      //     setIsCall(true);
      //   })
      //   .catch((err) => console.log('err@@@@@@', err));
    } else {
      setSearchData([]);
      setIsLoading(false);
    }
  }, [tags]);

  const highlightCount = document.querySelectorAll('em').length;

  return (
    <>
      <div className="container dashboard">
        <h2>Double Time Video Search</h2>
        <SearchInput
          tags={tags}
          inputValue={inputValue}
          setInputValue={setInputValue}
          setIsLoading={setIsLoading}
          setTags={setTags}
          setSearchData={setSearchData}
          setIsCall={setIsCall}
        />
        {highlightCount !== 0 && !isLoading ? (
          <>
            {highlightCount > 1 ? (
              <p className="result-count">{`${highlightCount} matches are found.`}</p>
            ) : (
              <p className="result-count">{`${highlightCount} match is found.`}</p>
            )}
          </>
        ) : (
          <>
            {tags[0] === '*' && !isLoading ? (
              <>
                <p className="result-count">
                  {searchData.length}
                  {' '}
                  videos are found.
                </p>
              </>
            ) : (
              <>
                {(highlightCount === 0 && tags.length !== 0 && tags[0] !== '*' && isCall) && <p className="result-count">No match is found.</p>}
              </>
            )}
          </>
        )}
        <Loading isLoading={isLoading} />
        {/* <NoData isCall={isCall} searchData={searchData} /> */}
      </div>
      <ErrorBoundary isLoading={isLoading} searchData={searchData}>
        <SearchResults
          searchData={searchData}
          titleData={titleData}
          tags={tags}
          isSeek={isSeek}
          videoPlayerRef={videoPlayerRef}
          video={video}
          setSearchData={setSearchData}
          setIsResultClick={setIsResultClick}
          setVideo={setVideo}
          setModalVisible={setModalVisible}
          setIsSeek={setIsSeek}
          isLoading={isLoading}
        />
      </ErrorBoundary>
      {isResultClick && (
        <Modal
          centered
          visible={modalVisible}
          width="650"
          destroyOnClose
          onOk={() => {
            setModalVisible(false);
            setIsResultClick(false);
            setVideo('');
            setIsSeek(false);
          }}
          onCancel={() => {
            setModalVisible(false);
            setIsResultClick(false);
            setVideo('');
            setIsSeek(false);
          }}
          okButtonProps={{ disabled: true }}
          cancelButtonProps={{ disabled: true }}
          className="video-modal"
        >
          <ReactPlayer
            url={[
              { src: video, type: 'video/webm;codecs="vp8, vorbis' },
              { src: video, type: 'video/mp4;codecs="avc1.42E01E, mp4a.40.2' },
            ]}
            ref={videoPlayerRef}
            config={{ file: { attributes: { id: 'audio-element' } } }}
            preload="auto"
            width="600px"
            height="400px"
            playing
            controls
          />
        </Modal>
      )}
    </>
  );
};

export default CardHorizontalExample;

// export class CardHorizontalExample extends React.Component<ICardProps, ICardState> {

//     constructor(props: ICardProps) {
//         super(props);

//         this.state = {
//             isRequired: props.isRequired || false,
//             errorMessage: props.errorMessage || "",
//             searchData: props.searchData || [],

//             onChange: props.triggerOnChange,
//             onClick: props.triggerOnClick,
//         };
//     }

//     public getVideoPath(videoPath: any) {
//         const videoNameArray = videoPath.split('/');
//         const videoNameSplit = videoNameArray[videoNameArray.length - 1].split('.');
//         const videoName = videoNameSplit[0];
//         return videoName;
//     }

//     public openVideo(videoPath: any) {
//         console.log(videoPath)
//     }

//     public componentWillReceiveProps(newProps: ICardProps): void {
//         this.setState(newProps);
//     }

//     public render(): JSX.Element {
//         const siteTextStyles: ITextStyles = {
//             root: {
//                 color: '#025F52',
//                 fontWeight: FontWeights.semibold,
//             },
//         };
//         const descriptionTextStyles: ITextStyles = {
//             root: {
//                 color: '#333333',
//                 fontWeight: FontWeights.regular,
//             },
//         };
//         const helpfulTextStyles: ITextStyles = {
//             root: {
//                 color: '#333333',
//                 fontWeight: FontWeights.regular,
//             },
//         };
//         const iconStyles: IIconStyles = {
//             root: {
//                 color: '#0078D4',
//                 fontSize: 16,
//                 fontWeight: FontWeights.regular,
//             },
//         };
//         const footerCardSectionStyles: ICardSectionStyles = {
//             root: {
//                 alignSelf: 'stretch',
//                 borderLeft: '1px solid #F3F2F1',
//             },
//         };

//         const sectionStackTokens: IStackTokens = { childrenGap: 20 };
//         const cardTokens: ICardTokens = { childrenMargin: 12 };
//         const footerCardSectionTokens: ICardSectionTokens = { padding: '0px 0px 0px 12px' };
//         const iconProps = { iconName: 'Globe' };

//         return (
//             <>
//                 <Stack tokens={sectionStackTokens} className="mainStack">
//                     <SearchInput />
//                     <TextField // prettier-ignore
//                         label={this.state.label}
//                         ariaLabel={this.state.label}
//                         iconProps={iconProps}
//                         required={this.state.isRequired}
//                         errorMessage={this.state.errorMessage}
//                         onChange={this.state.onChange}
//                         defaultValue={this.state.url}
//                     />
//                     {(this.state.searchData && this.state.searchData.length === 0) ? <p>No Data Found.</p> : <p>{this.state.searchData.length} matches are found.</p>}
//                     <Divider />
//                     <Divider />
//                     <Divider />
//                     <Divider />
//                     <Divider />
//                     {
//                         this.state.searchData && this.state.searchData.map((data: any) => {
//                             return <Card aria-label="URL Card" horizontal onClick={this.state.onClick} tokens={cardTokens}>
//                                 <Card.Item fill className="imageCardItem">
//                                     <a onClick={() => { window.open(data.path, "_blank") }}>
//                                         <Image src={data.blob_metadata.thumbnail} alt="Image" className="imageItem" />
//                                     </a>
//                                 </Card.Item>
//                                 <Card.Section>
//                                     <Text variant="large" styles={siteTextStyles}>
//                                         {this.getVideoPath(data.path)}
//                                     </Text>
//                                     <Text styles={descriptionTextStyles}>
//                                         {moment.utc(data.blob_metadata.creation_date).local().format('DD-MMM-YYYY')}
//                                     </Text>
//                                     <Text variant="small" styles={helpfulTextStyles}>
//                                         {this.state.domain}
//                                     </Text>
//                                 </Card.Section>
//                                 <Card.Section styles={footerCardSectionStyles} tokens={footerCardSectionTokens}>
//                                     <a href={data.path} rel="noopener noreferrer" target="_blank"><Icon iconName="NavigateExternalInline" /> </a>
//                                 </Card.Section>
//                             </Card>
//                         })
//                     }
                  
//                 </Stack>
//             </>
//         );
//     }
// }